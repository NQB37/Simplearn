import { test, expect } from '@playwright/test';

// The Next.js middleware only parses the JWT payload (no signature verification),
// so a structurally valid token with role=STUDENT is sufficient for route protection.
const STUDENT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6InN0dWRlbnQtMDAxIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
  '.dummy-sig';

function seedStudentStore(page: any) {
  return page.addInitScript(() => {
    localStorage.setItem(
      'user-storage',
      JSON.stringify({
        state: {
          user: {
            id: 'student-001',
            role: 'STUDENT',
            email: 'student@test.com',
            name: 'Test Student',
          },
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
            '.eyJpZCI6InN0dWRlbnQtMDAxIiwicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0' +
            '.dummy-sig',
          isAuthenticated: true,
        },
        version: 0,
      }),
    );
  });
}

function stubUserServiceRoutes(page: any, token: string) {
  return page.route('http://localhost:8001/**', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: token }),
    });
  });
}

test.describe('Student Schedule Page (SCHED-01)', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'refreshToken', value: STUDENT_TOKEN, domain: 'localhost', path: '/' },
    ]);
    await seedStudentStore(page);
    await stubUserServiceRoutes(page, STUDENT_TOKEN);
  });

  test('shows empty state message when student has no enrollments', async ({ page }) => {
    await page.route('http://localhost:8002/**/api/v1/enrollments/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/student/schedule');

    await expect(
      page.getByText('contact the Admin to resolve your enrollment status.'),
    ).toBeVisible();
  });

  test('renders enrolled subjects in table when enrollments exist', async ({ page }) => {
    const STUB_ENROLLMENTS = [
      {
        _id: 'enroll-001',
        userId: 'student-001',
        subjectId: {
          _id: 'subj-001',
          name: 'React 101',
          code: 'RN01',
          credits: 3,
        },
        academicYearId: {
          _id: 'ay-001',
          name: '2025-2026',
          semester: 'first',
        },
        createdAt: '2025-09-01T00:00:00.000Z',
      },
    ];

    await page.route('http://localhost:8002/**/api/v1/enrollments/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_ENROLLMENTS),
      });
    });

    await page.goto('/student/schedule');

    await expect(page.getByRole('cell', { name: 'React 101' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'TBD' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'To be scheduled' })).toBeVisible();
  });
});
