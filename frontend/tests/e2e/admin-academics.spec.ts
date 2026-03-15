import { test, expect } from '@playwright/test';

// Mocking the ADMIN authentication by setting a fake JWT in the refreshToken cookie
// A real JWT would be needed if the backend actually validates it, 
// but for UI E2E tests we can often mock the behavior or the backend calls.
const MOCK_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZ2lkIjoiMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTUxNjIzOTAyMn0.dummy-signature';

test.describe('Admin Academics Management', () => {
  test.beforeEach(async ({ context, page }) => {
    // Set the cookie before each test
    await context.addCookies([
      {
        name: 'refreshToken',
        value: MOCK_ADMIN_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Navigate to the academics management page
    await page.goto('/admin/academics');
  });

  test('should display academics management page with tabs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Academics Management' })).toBeVisible();
    
    // Verify tabs are present
    await expect(page.getByRole('tab', { name: 'Academic Years' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Rooms' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Subjects' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Classes' })).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Rooms tab
    await page.getByRole('tab', { name: 'Rooms' }).click();
    await expect(page.getByRole('button', { name: 'Add Room' })).toBeVisible();

    // Click on Subjects tab
    await page.getByRole('tab', { name: 'Subjects' }).click();
    await expect(page.getByRole('button', { name: 'Add Subject' })).toBeVisible();

    // Click on Classes tab
    await page.getByRole('tab', { name: 'Classes' }).click();
    await expect(page.getByRole('button', { name: 'Add Class' })).toBeVisible();
  });

  test('should open add academic year modal', async ({ page }) => {
    await page.getByRole('tab', { name: 'Academic Years' }).click();
    await page.getByRole('button', { name: 'Add Year' }).click();
    
    await expect(page.getByRole('heading', { name: 'Add Academic Year' })).toBeVisible();
    await expect(page.getByLabel('Year Name')).toBeVisible();
    await expect(page.getByLabel('Start Date')).toBeVisible();
    await expect(page.getByLabel('End Date')).toBeVisible();
  });
});
