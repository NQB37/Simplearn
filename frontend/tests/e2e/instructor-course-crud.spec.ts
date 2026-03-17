import { test, expect } from '@playwright/test';

// Mock JWTs — the Next.js middleware only parses the payload, it does not verify
// the signature, so these are valid for route protection purposes.
const INSTRUCTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

// Properly signed student JWT (signed with course-service JWT_ACCESS_SECRET) so
// requireAuth passes but requireRole returns 403 for STUDENT role.
const STUDENT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6InN0dWRlbnQtMDAxIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NzM3NDY0MDgsImV4cCI6MjYzNzY2MDAwOH0' +
  '.bm0kwbpjf5XH0yMCQykGVVC8bUMz2XBRibNdF-NoyGk';

// Stub course data keyed by instructorId == instructor-001
const STUB_COURSES = [
  {
    _id: 'course-abc-123',
    title: 'Introduction to TypeScript',
    slug: 'intro-to-typescript',
    description: 'Learn TypeScript from scratch.',
    subjectId: 'subject-xyz',
    instructorId: 'instructor-001',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const STUB_NEW_COURSE = {
  _id: 'course-new-456',
  title: 'Advanced React',
  slug: 'advanced-react',
  description: 'Deep dive into React patterns.',
  subjectId: 'subject-xyz',
  instructorId: 'instructor-001',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const STUB_SUBJECTS = [
  { _id: 'subject-xyz', name: 'Computer Science', code: 'CS101' },
];

// Zustand user-storage state that matches instructor-001.
// Must be injected via addInitScript before page navigation.
function seedInstructorStore(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never) {
  return (page as any).addInitScript(() => {
    localStorage.setItem('user-storage', JSON.stringify({
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
    }));
  });
}

// Stub the auth refresh endpoint so axios interceptors don't cascade-fail when
// the real auth service is not running during tests.
function stubAuthRefresh(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never) {
  return (page as any).route('http://localhost:8001/**', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: INSTRUCTOR_TOKEN }),
    });
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 1: Instructor sees course list
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Instructor Course List', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('course list page loads with table columns and courses', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route('**/api/courses', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(STUB_COURSES),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses');

    // Page heading
    await expect(page.getByRole('heading', { name: 'My Courses' })).toBeVisible();

    // Create Course button — use nth(1) to target the header button, not the sidebar link
    await expect(
      page.getByRole('link', { name: /create course/i }).nth(1),
    ).toBeVisible();

    // Table headers
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Subject' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();

    // Stub course row appears
    await expect(page.getByText('Introduction to TypeScript')).toBeVisible();
    await expect(page.getByText('draft')).toBeVisible();
  });

  test('shows empty state when no courses exist', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route('**/api/courses', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses');

    await expect(page.getByText(/no courses yet/i)).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 2: Create course
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Create Course', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('create course form is accessible from course list', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route('**/api/courses', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses');
    // Use nth(1) to target the header button link (0 = sidebar link, 1 = main content button)
    await page.getByRole('link', { name: /create course/i }).nth(1).click();

    await expect(page).toHaveURL('/instructor/courses/create');
    // CardTitle renders as a <div data-slot="card-title">, not an h-element
    await expect(page.getByText('Course Details').first()).toBeVisible();
  });

  test('submitting the form creates a course and redirects to edit page', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    // Stub subjects — academy-service uses /api/academy/subjects path
    await page.route('**/api/academy/subjects', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_SUBJECTS),
      });
    });

    // Stub POST and GET for courses
    await page.route('**/api/courses', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ course: { ...STUB_NEW_COURSE, ...body } }),
        });
      } else if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    // Stub GET /api/courses/:slug for the edit page redirect target
    await page.route('**/api/courses/advanced-react', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_NEW_COURSE }),
      });
    });

    await page.goto('/instructor/courses/create');

    // Wait for form to be ready
    await expect(page.getByLabel('Course Title')).toBeVisible({ timeout: 10000 });

    // Fill the form
    await page.getByLabel('Course Title').fill('Advanced React');
    // Slug auto-generates; clear and re-type to make deterministic
    const slugInput = page.getByLabel('Slug');
    await slugInput.clear();
    await slugInput.fill('advanced-react');

    // Select subject from dropdown
    await page.locator('select[name="subjectId"]').selectOption('subject-xyz');

    // Description — uses a rich editor (contenteditable)
    const editor = page.locator('.tiptap, [contenteditable="true"]').first();
    await expect(editor).toBeVisible({ timeout: 5000 });
    await editor.click();
    await editor.fill('Deep dive into React patterns.');

    await page.getByRole('button', { name: 'Create Course' }).click();

    // After successful creation, should redirect to edit page
    await expect(page).toHaveURL(/\/instructor\/courses\/advanced-react\/edit/, { timeout: 10000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 3: Edit course
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Edit Course', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('edit page loads with course data', async ({ page }) => {
    await stubAuthRefresh(page);

    await page.route('**/api/courses/intro-to-typescript', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSES[0] }),
      });
    });

    await page.goto('/instructor/courses/intro-to-typescript/edit');

    await expect(page.getByRole('heading', { name: 'Edit Course' })).toBeVisible();
    // The page subtitle shows the course title
    await expect(page.getByText('Introduction to TypeScript')).toBeVisible();
  });

  test('edit page navigated to from course list via Edit button', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    await page.route('**/api/courses', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(STUB_COURSES),
        });
      } else {
        route.continue();
      }
    });

    await page.route('**/api/courses/intro-to-typescript', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSES[0] }),
      });
    });

    await page.goto('/instructor/courses');
    await expect(page.getByText('Introduction to TypeScript')).toBeVisible();

    // Click the Edit (pencil) button for the course row
    await page.getByRole('row', { name: /introduction to typescript/i })
      .getByRole('button')
      .first()
      .click();

    await expect(page).toHaveURL(/\/instructor\/courses\/intro-to-typescript\/edit/);
  });

  test('Save Changes button is present on edit page', async ({ page }) => {
    await stubAuthRefresh(page);

    await page.route('**/api/courses/intro-to-typescript', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSES[0] }),
      });
    });

    await page.goto('/instructor/courses/intro-to-typescript/edit');

    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
  });

  test('Save Changes shows toast on success', async ({ page }) => {
    await stubAuthRefresh(page);

    await page.route('**/api/courses/intro-to-typescript', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSES[0] }),
      });
    });

    await page.route('**/api/courses/course-abc-123', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...STUB_COURSES[0], title: 'Updated Title' }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/intro-to-typescript/edit');

    // Save Changes button is in the page header (above tabs)
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Toast text from use-courses.ts updateMutation onSuccess: 'Course updated successfully'
    await expect(page.getByText('Course updated successfully')).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 4: Delete course
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Delete Course', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('delete button removes course from list after confirmation', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    let coursesData = [...STUB_COURSES];

    await page.route('**/api/courses', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(coursesData),
        });
      } else {
        route.continue();
      }
    });

    await page.route('**/api/courses/course-abc-123', (route) => {
      if (route.request().method() === 'DELETE') {
        coursesData = [];
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Course deleted successfully' }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses');
    await expect(page.getByText('Introduction to TypeScript')).toBeVisible();

    // Accept the browser confirm dialog
    page.on('dialog', (dialog) => dialog.accept());

    // Click the Delete (trash) button — second button in the actions cell
    await page.getByRole('row', { name: /introduction to typescript/i })
      .getByRole('button')
      .nth(1)
      .click();

    // After deletion and query invalidation the list should show empty state
    await expect(page.getByText(/no courses yet/i)).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 5: Unauthenticated create is rejected by backend (401)
// ──────────────────────────────────────────────────────────────────────────────
test.describe('API Authorization Checks', () => {
  test('POST /api/courses with no token returns 401', async ({ request }) => {
    const response = await request.post('http://localhost:8003/api/courses', {
      data: {
        title: 'Unauthorized Course',
        slug: 'unauthorized-course',
        description: 'This should fail',
        subjectId: 'some-subject-id',
      },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /api/courses with student token returns 403', async ({ request }) => {
    const response = await request.post('http://localhost:8003/api/courses', {
      headers: {
        Authorization: `Bearer ${STUDENT_TOKEN}`,
      },
      data: {
        title: 'Student Course Attempt',
        slug: 'student-course',
        description: 'Students should not be able to create courses',
        subjectId: 'some-subject-id',
      },
    });
    expect(response.status()).toBe(403);
  });
});
