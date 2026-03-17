import { test, expect } from '@playwright/test';

// Mock JWTs — the Next.js middleware only parses the payload, it does not verify
// the signature, so these are valid for route protection purposes.
const INSTRUCTOR_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6Imluc3RydWN0b3ItMDAxIiwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

// Stub course data
const STUB_COURSE = {
  _id: 'course-abc-123',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test course for modules.',
  subjectId: 'subject-xyz',
  instructorId: 'instructor-001',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Stub module data
const STUB_MODULES = [
  {
    _id: 'mod-1',
    courseId: 'course-abc-123',
    title: 'Module 1',
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mod-2',
    courseId: 'course-abc-123',
    title: 'Module 2',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
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
// Scenario 1: View modules on edit page
// ──────────────────────────────────────────────────────────────────────────────
test.describe('View Modules on Edit Page', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('shows modules on curriculum tab of edit page', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    // Stub course details
    await page.route('**/api/courses/test-course', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSE }),
      });
    });

    // Stub modules endpoint
    await page.route('**/api/courses/course-abc-123/modules', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ modules: STUB_MODULES }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/test-course/edit');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Edit Course' })).toBeVisible();

    // The curriculum tab should be the default tab, so modules should be visible
    await expect(page.getByText('Module 1')).toBeVisible();
    await expect(page.getByText('Module 2')).toBeVisible();

    // Each module should show "0 Lessons" badge
    await expect(page.getByText('0 Lessons').first()).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 2: Add a new module
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Add Module', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('clicking Add Module button creates a new module', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    const newModule = {
      _id: 'mod-3',
      courseId: 'course-abc-123',
      title: 'New Module',
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Stub course details
    await page.route('**/api/courses/test-course', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSE }),
      });
    });

    // Stub GET modules endpoint
    await page.route('**/api/courses/course-abc-123/modules', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ modules: STUB_MODULES }),
        });
      } else if (route.request().method() === 'POST') {
        // Stub POST to create new module
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ module: newModule }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/test-course/edit');

    // Wait for page to load
    await expect(page.getByText('Module 1')).toBeVisible();

    // Click Add Module button
    await page.getByRole('button', { name: 'Add Module' }).click();

    // Expect toast message
    await expect(page.getByText('Module added')).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 3: Rename a module
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Rename Module', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('clicking edit icon allows renaming module title', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    const updatedModule = {
      ...STUB_MODULES[0],
      title: 'Updated Module',
    };

    // Stub course details
    await page.route('**/api/courses/test-course', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSE }),
      });
    });

    // Stub modules endpoints
    await page.route('**/api/courses/course-abc-123/modules', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ modules: STUB_MODULES }),
        });
      } else {
        route.continue();
      }
    });

    // Stub PUT endpoint for updating module
    await page.route('**/api/courses/course-abc-123/modules/mod-1', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ module: updatedModule }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/test-course/edit');

    // Wait for modules to load
    await expect(page.getByText('Module 1')).toBeVisible();

    // Wait for modules to load first
    await expect(page.getByText('Module 1')).toBeVisible();

    // Find the first module row and click the edit (pencil) icon
    // The pencil button should be right after the "0 Lessons" badge
    const module1Row = page.getByText('Module 1').locator('..');
    await module1Row.getByRole('button').nth(1).click(); // pencil is typically second button after grip

    // Should see input field with Save and Cancel buttons
    await expect(page.getByRole('textbox')).toBeVisible();

    // Clear and type new title
    await page.getByRole('textbox').clear();
    await page.getByRole('textbox').fill('Updated Module');

    // Click Save button (the specific one for module editing)
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Expect toast message
    await expect(page.getByText('Module updated')).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 4: Delete a module
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Delete Module', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('clicking delete icon removes module from list', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    let modulesData = [...STUB_MODULES];

    // Stub course details
    await page.route('**/api/courses/test-course', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSE }),
      });
    });

    // Stub GET modules endpoint
    await page.route('**/api/courses/course-abc-123/modules', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ modules: modulesData }),
        });
      } else {
        route.continue();
      }
    });

    // Stub DELETE endpoint
    await page.route('**/api/courses/course-abc-123/modules/mod-2', (route) => {
      if (route.request().method() === 'DELETE') {
        modulesData = modulesData.filter(m => m._id !== 'mod-2');
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Module deleted successfully' }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/test-course/edit');

    // Wait for modules to load
    await expect(page.getByText('Module 2')).toBeVisible();

    // Wait for modules to load first
    await expect(page.getByText('Module 2')).toBeVisible();

    // Find Module 2 and click the delete (trash) icon
    const module2Row = page.getByText('Module 2').locator('..');
    await module2Row.getByRole('button').nth(2).click(); // trash is typically third button (grip, pencil, trash)

    // Expect toast message
    await expect(page.getByText('Module deleted')).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Scenario 5: Empty state
// ──────────────────────────────────────────────────────────────────────────────
test.describe('Empty State', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('shows empty state when no modules exist', async ({ page }) => {
    await seedInstructorStore(page);
    await stubAuthRefresh(page);

    // Stub course details
    await page.route('**/api/courses/test-course', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ course: STUB_COURSE }),
      });
    });

    // Stub empty modules response
    await page.route('**/api/courses/course-abc-123/modules', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ modules: [] }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/instructor/courses/test-course/edit');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Edit Course' })).toBeVisible();

    // Should see empty state message
    await expect(page.getByText('Start building your course structure')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create First Module' })).toBeVisible();
  });
});