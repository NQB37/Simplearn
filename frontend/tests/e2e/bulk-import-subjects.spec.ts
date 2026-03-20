import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import os from 'os';

const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6ImFkbWluLTAwMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ' +
  '.dummy-sig';

const STUB_FACULTIES = [
  { _id: 'fac-eng', name: 'Engineering' },
];

const STUB_MAJORS = [
  { _id: 'major-cs', name: 'Computer Science', facultyId: 'fac-eng' },
  { _id: 'major-ee', name: 'Electrical Engineering', facultyId: 'fac-eng' },
];

const STUB_SUBJECTS: any[] = [];

function seedAdminStore(page: any) {
  return page.addInitScript(() => {
    localStorage.setItem(
      'user-storage',
      JSON.stringify({
        state: {
          user: {
            id: 'admin-001',
            role: 'ADMIN',
            email: 'admin@test.com',
            name: 'Test Admin',
          },
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJpZCI6ImFkbWluLTAwMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ' +
            '.dummy-sig',
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  });
}

function stubUserServiceRoutes(page: any) {
  return page.route('http://localhost:8001/**', (route: any) => {
    const url = route.request().url();

    if (url.includes('/api/admin/vocabulary/fields')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_FACULTIES),
      });
    }

    if (url.includes('/api/admin/vocabulary/majors')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_MAJORS),
      });
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: ADMIN_TOKEN }),
    });
  });
}

function createTempCsv(content: string): string {
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, `test-import-${Date.now()}.csv`);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

test.describe('Bulk Import Subjects', () => {
  let bulkEndpointCalled = false;
  let bulkRequestBody: any = null;

  test.beforeEach(async ({ context, page }) => {
    bulkEndpointCalled = false;
    bulkRequestBody = null;

    await context.addCookies([
      { name: 'refreshToken', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    ]);
    await seedAdminStore(page);
    await stubUserServiceRoutes(page);

    // Stub academy-service routes, intercepting the bulk endpoint specifically
    await page.route('http://localhost:8002/**', (route: any) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('/api/academy/subjects/bulk') && method === 'POST') {
        bulkEndpointCalled = true;
        bulkRequestBody = route.request().postDataJSON();
        const subjects = bulkRequestBody?.subjects ?? [];
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            created: subjects.length,
            skipped: 0,
            errors: [],
          }),
        });
      }

      if (url.includes('/api/academy/subjects')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(STUB_SUBJECTS),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  async function navigateToSubjectsTab(page: any) {
    await page.goto('/admin/academics');
    await page.getByRole('tab', { name: 'Subjects' }).click();
    await expect(page.getByRole('columnheader', { name: 'Code' })).toBeVisible();
  }

  test('Import CSV button is visible on Subjects tab', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await expect(page.getByRole('button', { name: 'Import CSV' })).toBeVisible();
  });

  test('opens modal and shows upload step', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Import Subjects from CSV')).toBeVisible();
    await expect(dialog.getByText('Upload a CSV file')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Choose File' })).toBeVisible();
  });

  test('successful import with all valid rows', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');

    // Create CSV with valid data
    const csvContent = [
      'name,code,credits,majorName,typeOfStudy,studyYear,semester',
      'Algorithms,CS201,3,Computer Science,bachelor,2,first',
      'Data Structures,CS102,3,Computer Science,bachelor,1,second',
    ].join('\n');
    const csvPath = createTempCsv(csvContent);

    // Upload file
    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    // Preview step should show
    await expect(dialog.getByText('2 valid')).toBeVisible();
    await expect(dialog.getByText('0 invalid')).toBeVisible();

    // Both rows visible in preview
    await expect(dialog.getByText('Algorithms')).toBeVisible();
    await expect(dialog.getByText('Data Structures')).toBeVisible();

    // Confirm import
    await dialog.getByRole('button', { name: /Import 2/ }).click();

    // Results step
    await expect(dialog.getByText('Created:')).toBeVisible();
    await expect(dialog.getByText('2')).toBeVisible();

    expect(bulkEndpointCalled).toBe(true);
    expect(bulkRequestBody.subjects).toHaveLength(2);
    expect(bulkRequestBody.subjects[0].majorId).toBe('major-cs');

    // Cleanup
    fs.unlinkSync(csvPath);
  });

  test('client-side validation marks invalid rows', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');

    // CSV with one valid and one invalid row (missing name)
    const csvContent = [
      'name,code,credits,majorName,typeOfStudy,studyYear,semester',
      'Valid Subject,VS101,3,,,',
      ',BAD001,abc,,,',
    ].join('\n');
    const csvPath = createTempCsv(csvContent);

    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    // Should show 1 valid, 1 invalid
    await expect(dialog.getByText('1 valid')).toBeVisible();
    await expect(dialog.getByText('1 invalid')).toBeVisible();

    // Invalid row should have error indicators
    await expect(dialog.getByText('name is required')).toBeVisible();

    // Import button should say "Import 1 subject(s)"
    await expect(dialog.getByRole('button', { name: /Import 1/ })).toBeVisible();

    fs.unlinkSync(csvPath);
  });

  test('unknown major name shows warning', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');

    const csvContent = [
      'name,code,credits,majorName,typeOfStudy,studyYear,semester',
      'Physics 101,PHY101,3,Physics,bachelor,1,first',
    ].join('\n');
    const csvPath = createTempCsv(csvContent);

    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    // Should show as warning (importable but with note)
    await expect(dialog.getByText('1 warning')).toBeVisible();
    await expect(dialog.getByText(/not found/)).toBeVisible();

    // Should still be importable
    await expect(dialog.getByRole('button', { name: /Import 1/ })).toBeEnabled();

    fs.unlinkSync(csvPath);
  });

  test('all-invalid CSV disables import button', async ({ page }) => {
    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');

    const csvContent = [
      'name,code,credits,majorName,typeOfStudy,studyYear,semester',
      ',,abc,,,',
      ',,xyz,,,',
    ].join('\n');
    const csvPath = createTempCsv(csvContent);

    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    await expect(dialog.getByText('0 valid')).toBeVisible();
    await expect(dialog.getByText('2 invalid')).toBeVisible();
    await expect(dialog.getByText('No valid rows to import')).toBeVisible();

    fs.unlinkSync(csvPath);
  });

  test('server reports skipped duplicates in results', async ({ page }) => {
    // Override the bulk endpoint to return a mixed result
    await page.route('http://localhost:8002/api/academy/subjects/bulk', (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          created: 1,
          skipped: 1,
          errors: [
            { row: 2, code: 'DUP101', reason: 'Duplicate subject code' },
          ],
        }),
      });
    });

    await navigateToSubjectsTab(page);
    await page.getByRole('button', { name: 'Import CSV' }).click();

    const dialog = page.getByRole('dialog');

    const csvContent = [
      'name,code,credits',
      'New Subject,NEW101,3',
      'Duplicate Subject,DUP101,3',
    ].join('\n');
    const csvPath = createTempCsv(csvContent);

    const fileInput = dialog.locator('input[type="file"]');
    await fileInput.setInputFiles(csvPath);

    await dialog.getByRole('button', { name: /Import 2/ }).click();

    // Results should show created and skipped
    await expect(dialog.getByText('Created:')).toBeVisible();
    await expect(dialog.getByText('Skipped:')).toBeVisible();
    await expect(dialog.getByText('Duplicate subject code')).toBeVisible();
    await expect(dialog.getByText('DUP101')).toBeVisible();

    fs.unlinkSync(csvPath);
  });
});
