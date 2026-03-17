import { test, expect } from '@playwright/test';

// Mock JWT — Next.js middleware only parses the payload, not the signature.
const INSTRUCTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

const STUB_COURSE = {
  _id: 'course-abc-123',
  title: 'Introduction to TypeScript',
  slug: 'intro-to-typescript',
  description: '',
  subjectId: 'subject-xyz',
  instructorId: 'instructor-001',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function seedInstructorStore(page: any) {
  return page.addInitScript(() => {
    localStorage.setItem(
      'user-storage',
      JSON.stringify({
        state: {
          user: {
            id: 'instructor-001',
            role: 'INSTRUCTOR',
            email: 'instructor@test.com',
            name: 'Test Instructor',
          },
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
            '.dummy-sig',
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  });
}

function stubAuthRefresh(page: any) {
  return page.route('http://localhost:8001/**', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: INSTRUCTOR_TOKEN }),
    });
  });
}

// Navigate to the edit page with stubbed course data and switch to the Details tab.
async function openDetailsTab(page: any) {
  await seedInstructorStore(page);
  await stubAuthRefresh(page);

  await page.route('**/api/courses/intro-to-typescript', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ course: STUB_COURSE }),
    });
  });

  await page.goto('/instructor/courses/intro-to-typescript/edit');
  await expect(page.getByRole('heading', { name: 'Edit Course' })).toBeVisible({ timeout: 10000 });

  // The page opens on the Curriculum tab by default — switch to Details.
  await page.getByRole('tab', { name: 'Details' }).click();

  // Wait for the Tiptap editor to be present.
  const editor = page.locator('.tiptap[contenteditable="true"]');
  await expect(editor).toBeVisible({ timeout: 8000 });

  return editor;
}

test.describe('Rich Text Editor — typography plugin regression', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'refreshToken',
        value: INSTRUCTOR_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Bullet list
  // ──────────────────────────────────────────────────────────────────────────
  test('bullet list items render with visible bullet markers', async ({ page }) => {
    const editor = await openDetailsTab(page);

    // Click the Bullet List toolbar button.
    await page.getByRole('button', { name: 'Toggle Bullet List' }).click();

    // Type a list item.
    await editor.pressSequentially('First item');
    await editor.press('Enter');
    await editor.pressSequentially('Second item');

    // Tiptap emits a <ul> with <li> children for bullet lists.
    const ul = editor.locator('ul');
    await expect(ul).toBeVisible({ timeout: 5000 });

    const items = ul.locator('li');
    await expect(items).toHaveCount(2);

    // The prose/typography plugin must give <ul> a list-style so that
    // actual bullet markers are rendered.  We verify via computed CSS that
    // list-style-type is NOT "none".
    const listStyleType = await ul.evaluate((el: Element) =>
      window.getComputedStyle(el).listStyleType,
    );
    expect(listStyleType).not.toBe('none');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Ordered list
  // ──────────────────────────────────────────────────────────────────────────
  test('ordered list items render with visible numbers', async ({ page }) => {
    const editor = await openDetailsTab(page);

    // Click the Ordered List toolbar button.
    await page.getByRole('button', { name: 'Toggle Ordered List' }).click();

    await editor.pressSequentially('Step one');
    await editor.press('Enter');
    await editor.pressSequentially('Step two');

    // Tiptap emits a <ol> with <li> children for ordered lists.
    const ol = editor.locator('ol');
    await expect(ol).toBeVisible({ timeout: 5000 });

    const items = ol.locator('li');
    await expect(items).toHaveCount(2);

    // The typography plugin must give <ol> a decimal list-style so numbers show.
    const listStyleType = await ol.evaluate((el: Element) =>
      window.getComputedStyle(el).listStyleType,
    );
    expect(listStyleType).not.toBe('none');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Bold
  // ──────────────────────────────────────────────────────────────────────────
  test('Bold button wraps selected text in <strong>', async ({ page }) => {
    const editor = await openDetailsTab(page);

    await editor.pressSequentially('hello world');

    // Select all text and apply bold.
    await editor.press('Control+a');
    await page.getByRole('button', { name: 'Toggle Bold' }).click();

    const strong = editor.locator('strong');
    await expect(strong).toBeVisible({ timeout: 5000 });
    await expect(strong).toContainText('hello world');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Italic
  // ──────────────────────────────────────────────────────────────────────────
  test('Italic button wraps selected text in <em>', async ({ page }) => {
    const editor = await openDetailsTab(page);

    await editor.pressSequentially('italic me');

    await editor.press('Control+a');
    await page.getByRole('button', { name: 'Toggle Italic' }).click();

    const em = editor.locator('em');
    await expect(em).toBeVisible({ timeout: 5000 });
    await expect(em).toContainText('italic me');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Strikethrough
  // ──────────────────────────────────────────────────────────────────────────
  test('Strikethrough button wraps selected text in <s>', async ({ page }) => {
    const editor = await openDetailsTab(page);

    await editor.pressSequentially('strike this');

    await editor.press('Control+a');
    await page.getByRole('button', { name: 'Toggle Strikethrough' }).click();

    // Tiptap renders strikethrough as <s>.
    const s = editor.locator('s');
    await expect(s).toBeVisible({ timeout: 5000 });
    await expect(s).toContainText('strike this');
  });
});
