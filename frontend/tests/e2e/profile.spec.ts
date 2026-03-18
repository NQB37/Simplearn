import { test, expect } from '@playwright/test';

// Helper to seed store and stub auth
async function setupAuth(page: any, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') {
  await page.addInitScript((role: string) => {
    window.localStorage.setItem('user-storage', JSON.stringify({
      state: {
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: role,
        },
        accessToken: 'mock-token',
      }
    }));
  }, role);

  // Stub /api/auth/me
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: role,
        }
      }),
    });
  });
}

test.describe('User Profiles', () => {
  test.setTimeout(60000);

  test('Student can update personal and academic profile', async ({ page }) => {
    await setupAuth(page, 'STUDENT');

    // Mock profile and vocabulary APIs
    await page.route('**/api/users/profile', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify({ profile: {} }) });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify({ profile: route.request().postDataJSON() }) });
      }
    });

    await page.route('**/api/admin/vocabulary/fields', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([{ _id: 'field-1', name: 'Computer Science' }]) });
    });

    await page.route('**/api/admin/vocabulary/majors*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([{ _id: 'major-1', name: 'Software Engineering', fieldOfStudyId: 'field-1' }]) });
    });

    await page.goto('/student/dashboard/profile');

    // Check Personal tab
    const personalTab = page.locator('button:has-text("Personal")');
    await personalTab.waitFor();
    await personalTab.click();
    
    const dobInput = page.locator('input[type="date"]');
    await dobInput.waitFor();
    await dobInput.fill('1995-05-20');
    
    await page.click('button:has-text("Save changes")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();

    // Check Academic tab
    await page.click('button:has-text("Academic")');
    await page.click('button[aria-label="Select type of study"]');
    await page.click('text=Bachelor');
    
    await page.click('button[aria-label="Select field of study"]');
    await page.click('text=Computer Science');

    // Major should be enabled now
    await page.click('button[aria-label="Select major"]');
    await page.click('text=Software Engineering');

    await page.click('button:has-text("Save changes")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('Instructor can update teaching profile', async ({ page }) => {
    test.setTimeout(60000);
    await setupAuth(page, 'INSTRUCTOR');

    await page.route('**/api/users/profile', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ profile: {} }) });
    });

    await page.route('**/api/admin/vocabulary/fields', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([{ _id: 'field-1', name: 'Mathematics' }]) });
    });

    await page.goto('/instructor/profile');

    const teachingTab = page.locator('button:has-text("Teaching")');
    await teachingTab.waitFor();
    await teachingTab.click();
    
    const fieldSelect = page.locator('button[aria-label="Select field of study"]');
    await fieldSelect.waitFor();
    await fieldSelect.click();
    await page.click('text=Mathematics');
    
    await page.click('button:has-text("Save changes")');
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('Admin can manage vocabulary', async ({ page }) => {
    test.setTimeout(60000);
    await setupAuth(page, 'ADMIN');

    // Mock vocabulary APIs
    let fields = [{ _id: 'field-1', name: 'Science' }];
    await page.route('**/api/admin/vocabulary/fields', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify(fields) });
      } else if (route.request().method() === 'POST') {
        const newField = { _id: 'field-2', name: route.request().postDataJSON().name };
        fields.push(newField);
        await route.fulfill({ status: 201, body: JSON.stringify(newField) });
      }
    });

    await page.route('**/api/admin/vocabulary/majors*', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto('/admin/vocabulary');

    const fieldInput = page.locator('input[placeholder="New field name..."]');
    await fieldInput.waitFor();
    await fieldInput.fill('Arts');
    await page.click('button:has-text("Add")');
    
    await expect(page.locator('text=Field of study created')).toBeVisible();
    await expect(page.locator('text=Arts')).toBeVisible();
  });
});
