import { test, expect } from '@playwright/test';

const INSTRUCTOR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.dummy-sig';

const STUB_COURSE = {
  _id: 'course-abc-123',
  title: 'Introduction to TypeScript',
  slug: 'intro-to-typescript',
  description: 'Learn TypeScript from scratch.',
  subjectId: 'subject-xyz',
  instructorId: 'instructor-001',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test('debug edit page - Details tab crash investigation', async ({ page, context }) => {
  await context.addCookies([
    { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
  ]);

  const pageErrors: string[] = [];
  page.on('pageerror', err => pageErrors.push(`${err.message}\n${err.stack?.slice(0, 200)}`));
  page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text()}`);
  });

  await page.route('**/api/courses/intro-to-typescript', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ course: STUB_COURSE }),
    });
  });

  await page.goto('/instructor/courses/intro-to-typescript/edit');
  await page.waitForTimeout(2000);

  console.log('Page errors before tab click:', pageErrors.join('\n'));

  // Check Save Changes before tab click
  const saveBtnBefore = await page.getByRole('button', { name: 'Save Changes' }).isVisible();
  console.log('Save Changes visible before:', saveBtnBefore);

  // Click Details tab
  await page.getByRole('tab', { name: 'Details' }).click();
  await page.waitForTimeout(2000);

  console.log('Page errors after Details tab click:', pageErrors.join('\n'));

  // Check Save Changes after tab click
  const saveBtnAfter = await page.getByRole('button', { name: 'Save Changes' }).isVisible();
  console.log('Save Changes visible after:', saveBtnAfter);

  // Check if any buttons exist at all
  const allButtons = await page.locator('button').allTextContents();
  console.log('All buttons after tab click:', JSON.stringify(allButtons));

  // Check the page body
  const bodyText = await page.locator('body').innerText();
  console.log('Body text (first 400):', bodyText.slice(0, 400));

  await page.screenshot({ path: 'tests/e2e/debug-edit-details-tab.png', fullPage: true });
});
