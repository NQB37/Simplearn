import { test, expect } from '@playwright/test';

// Mock JWT — Next.js middleware only parses the payload, not the signature.
const INSTRUCTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

const STUB_COURSE = {
  _id: 'course-abc-123',
  slug: 'test-course',
  title: 'Test Course',
  description: '',
  thumbnail: '',
  price: 0,
  instructor: 'instructor-001',
};

const STUB_MODULE = {
  _id: 'mod-1',
  courseId: 'course-abc-123',
  title: 'Module 1',
  order: 0,
};

const STUB_LESSON = {
  _id: 'les-1',
  moduleId: 'mod-1',
  title: 'Lesson 1',
  order: 0,
  contents: [] as unknown[],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

async function stubBasicRoutes(page: any, lessons: unknown[]) {
  await page.route('**/api/courses/test-course', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ course: STUB_COURSE }),
    });
  });

  await page.route('**/api/courses/course-abc-123/modules', (route: any) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ modules: [STUB_MODULE] }),
      });
    } else {
      route.continue();
    }
  });

  await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons', (route: any) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ lessons }),
      });
    } else {
      route.continue();
    }
  });
}

async function navigateToEditPage(page: any) {
  await page.goto('/instructor/courses/test-course/edit');
  await expect(page.getByRole('heading', { name: 'Edit Course' })).toBeVisible({ timeout: 10000 });
}

async function expandModule(page: any) {
  // The AccordionTrigger contains the module title; click it to expand
  await page.getByText('Module 1').first().click();
  // Wait for the module accordion content to reveal
  await expect(page.getByRole('button', { name: 'Add Lesson' })).toBeVisible({ timeout: 5000 });
}

async function expandLesson(page: any) {
  // Click the lesson row to open its inline LessonPanel
  await page.getByText('Lesson 1').first().click();
  // The LessonPanel toolbar becomes visible
  await expect(page.getByRole('button', { name: 'Add Text' })).toBeVisible({ timeout: 5000 });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Lesson Content — lesson CRUD and content blocks', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  // ── Scenario 1: Create lesson ──────────────────────────────────────────────
  test('Scenario 1: clicking Add Lesson creates a lesson and shows toast', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, []);

    // Stub POST lessons
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ lesson: STUB_LESSON }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);

    await page.getByRole('button', { name: 'Add Lesson' }).click();

    await expect(page.getByText('Lesson added')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 2: Add text block ─────────────────────────────────────────────
  test('Scenario 2: adding a text block and saving shows toast "Lesson saved"', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, [STUB_LESSON]);

    const updatedLesson = {
      ...STUB_LESSON,
      contents: [{ _id: 'blk-1', type: 'text', body: '<p>hello</p>' }],
    };

    // Stub PUT lesson
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons/les-1', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ lesson: updatedLesson }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);
    await expandLesson(page);

    // Click "Add Text"
    await page.getByRole('button', { name: 'Add Text' }).click();

    // The Tiptap editor inside the LessonPanel should appear
    const lessonEditor = page.locator('.tiptap[contenteditable="true"]').first();
    await expect(lessonEditor).toBeVisible({ timeout: 5000 });
    await lessonEditor.click();
    await lessonEditor.pressSequentially('hello');

    // Save the lesson (exact match avoids collision with "Save Changes" on the page)
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.getByText('Lesson saved')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 3: Add image block ────────────────────────────────────────────
  test('Scenario 3: uploading an image block shows img preview, saving shows toast', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, [STUB_LESSON]);

    // Stub image upload
    await page.route('**/api/media/images/upload', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          url: 'https://res.cloudinary.com/demo/image/upload/test.jpg',
          publicId: 'simplearn/test',
          format: 'jpg',
          width: 100,
          height: 100,
          bytes: 1024,
        }),
      });
    });

    const updatedLesson = {
      ...STUB_LESSON,
      contents: [{ _id: 'blk-2', type: 'image', url: 'https://res.cloudinary.com/demo/image/upload/test.jpg' }],
    };

    // Stub PUT lesson
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons/les-1', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ lesson: updatedLesson }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);
    await expandLesson(page);

    // Trigger image file input via the hidden input
    const imageInput = page.locator('input[type="file"][accept="image/*"]');
    await imageInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]), // minimal JPEG header
    });

    // The <img> preview should appear inside the LessonPanel
    const imgPreview = page.locator('img[src="https://res.cloudinary.com/demo/image/upload/test.jpg"]');
    await expect(imgPreview).toBeVisible({ timeout: 5000 });

    // Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Lesson saved')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 4: Add document block ────────────────────────────────────────
  test('Scenario 4: uploading a document block shows filename, saving shows toast', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, [STUB_LESSON]);

    // Stub document upload
    await page.route('**/api/media/documents/upload', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          path: 'instructor-001/doc.pdf',
          fullPath: 'documents/instructor-001/doc.pdf',
          originalName: 'doc.pdf',
          size: 2048,
          mimeType: 'application/pdf',
        }),
      });
    });

    const updatedLesson = {
      ...STUB_LESSON,
      contents: [{
        _id: 'blk-3',
        type: 'document',
        path: 'instructor-001/doc.pdf',
        fullPath: 'documents/instructor-001/doc.pdf',
        originalName: 'doc.pdf',
        size: 2048,
        mimeType: 'application/pdf',
      }],
    };

    // Stub PUT lesson
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons/les-1', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ lesson: updatedLesson }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);
    await expandLesson(page);

    // Trigger document file input via the hidden input
    const docInput = page.locator('input[type="file"][accept=".pdf,.doc,.docx,.ppt,.pptx"]');
    await docInput.setInputFiles({
      name: 'doc.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 minimal'),
    });

    // "doc.pdf" filename should appear in the document block's rename input
    await expect(page.locator('input[value="doc.pdf"]')).toBeVisible({ timeout: 5000 });

    // Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Lesson saved')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 5: Delete content block ──────────────────────────────────────
  test('Scenario 5: deleting a content block and saving shows toast "Lesson saved"', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    const lessonWithBlock = {
      ...STUB_LESSON,
      contents: [{ _id: 'blk-1', type: 'text', body: '<p>hello</p>' }],
    };

    await stubBasicRoutes(page, [lessonWithBlock]);

    // Stub PUT lesson returning empty contents
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons/les-1', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ lesson: { ...STUB_LESSON, contents: [] } }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);
    await expandLesson(page);

    // The text block's tiptap editor should be visible
    const lessonEditor = page.locator('.tiptap[contenteditable="true"]').first();
    await expect(lessonEditor).toBeVisible({ timeout: 5000 });

    // The remove button has opacity-0 by default (revealed on hover via CSS).
    // Use force:true to click it without requiring it to be visible.
    const removeBtn = page.getByRole('button', { name: 'Remove block' });
    await removeBtn.click({ force: true });

    // Editor should be gone
    await expect(lessonEditor).not.toBeVisible({ timeout: 3000 });

    // Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Lesson saved')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 6: Delete lesson ──────────────────────────────────────────────
  test('Scenario 6: clicking trash on a lesson row shows toast "Lesson deleted"', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, [STUB_LESSON]);

    // Stub DELETE lesson
    await page.route('**/api/courses/course-abc-123/modules/mod-1/lessons/les-1', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Lesson deleted successfully' }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToEditPage(page);
    await expandModule(page);

    // "Lesson 1" row should be visible
    await expect(page.getByText('Lesson 1')).toBeVisible({ timeout: 5000 });

    // Hover over the lesson row to reveal action buttons, then click the trash
    const lessonRow = page.getByText('Lesson 1').locator('../..');
    await lessonRow.hover();
    const trashBtn = lessonRow.getByRole('button').filter({ has: page.locator('svg') }).last();
    await trashBtn.click();

    await expect(page.getByText('Lesson deleted')).toBeVisible({ timeout: 5000 });
  });

  // ── Scenario 7: Video option absent ───────────────────────────────────────
  test('Scenario 7: "Video" option is not present in the UI', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);
    await stubBasicRoutes(page, [STUB_LESSON]);

    await navigateToEditPage(page);
    await expandModule(page);
    await expandLesson(page);

    // The LessonPanel toolbar should not contain any "Video" button or text
    await expect(page.getByRole('button', { name: /video/i })).not.toBeVisible();
    await expect(page.getByText('Video', { exact: true })).not.toBeVisible();
  });
});
