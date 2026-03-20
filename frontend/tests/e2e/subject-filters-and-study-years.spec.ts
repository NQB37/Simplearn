import { test, expect } from '@playwright/test';

// The Next.js middleware only parses the JWT payload (no signature verification),
// so a structurally valid token with role=ADMIN is sufficient for route protection.
const ADMIN_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpZCI6ImFkbWluLTAwMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ' +
  '.dummy-sig';

// ── Stub data ──────────────────────────────────────────────────────────────────

const STUB_FIELDS_OF_STUDY = [
  { _id: 'fos-eng', name: 'Engineering' },
  { _id: 'fos-sci', name: 'Science' },
];

const STUB_MAJORS = [
  { _id: 'major-cs', name: 'Computer Science', fieldOfStudyId: 'fos-eng' },
  { _id: 'major-ee', name: 'Electrical Engineering', fieldOfStudyId: 'fos-eng' },
  { _id: 'major-bio', name: 'Biology', fieldOfStudyId: 'fos-sci' },
];

// Three subjects: two bachelor under Engineering, one master under Science
const STUB_SUBJECTS = [
  {
    _id: 'subj-001',
    name: 'Algorithms',
    code: 'CS201',
    credits: 3,
    curriculum: [
      {
        _id: 'cur-001',
        majorId: 'major-cs',
        studyYear: 2,
        semester: 'first',
        isMandatory: true,
        typeOfStudy: 'bachelor',
      },
    ],
  },
  {
    _id: 'subj-002',
    name: 'Circuit Theory',
    code: 'EE101',
    credits: 4,
    curriculum: [
      {
        _id: 'cur-002',
        majorId: 'major-ee',
        studyYear: 1,
        semester: 'second',
        isMandatory: true,
        typeOfStudy: 'bachelor',
      },
    ],
  },
  {
    _id: 'subj-003',
    name: 'Molecular Biology',
    code: 'BIO501',
    credits: 3,
    curriculum: [
      {
        _id: 'cur-003',
        majorId: 'major-bio',
        studyYear: 1,
        semester: 'first',
        isMandatory: false,
        typeOfStudy: 'master',
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

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

/**
 * Stubs all user-service (port 8001) routes:
 * - vocabulary/fields  → STUB_FIELDS_OF_STUDY
 * - vocabulary/majors  → STUB_MAJORS
 * - auth/refresh       → { accessToken }
 * - everything else    → 200 {}
 */
function stubUserServiceRoutes(page: any) {
  return page.route('http://localhost:8001/**', (route: any) => {
    const url = route.request().url();

    if (url.includes('/api/admin/vocabulary/fields')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_FIELDS_OF_STUDY),
      });
    }

    if (url.includes('/api/admin/vocabulary/majors')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_MAJORS),
      });
    }

    // Auth refresh fallback
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: ADMIN_TOKEN }),
    });
  });
}

/**
 * Stubs all academy-service (port 8002) routes.
 */
function stubAcademyServiceRoutes(page: any) {
  return page.route('http://localhost:8002/**', (route: any) => {
    const url = route.request().url();

    if (url.includes('/api/academy/subjects')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(STUB_SUBJECTS),
      });
    }

    // academic-years, rooms, classes — return empty arrays
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
}

async function navigateToSubjectsTab(page: any) {
  await page.goto('/admin/academics');
  await page.getByRole('tab', { name: 'Subjects' }).click();
  // Wait for the table header which is always present once SubjectsManager mounts
  await expect(page.getByRole('columnheader', { name: 'Code' })).toBeVisible();
}

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Subject Catalog Filters', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'refreshToken', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    ]);
    await seedAdminStore(page);
    await stubUserServiceRoutes(page);
    await stubAcademyServiceRoutes(page);
  });

  // Scenario 1: Filter dropdowns are visible on Subjects tab
  test('filter dropdowns are visible when Subjects tab is active', async ({ page }) => {
    await navigateToSubjectsTab(page);

    // Two comboboxes are rendered in the filter bar above the table
    const comboboxes = page.getByRole('combobox');
    await expect(comboboxes).toHaveCount(2);

    // The Type of Study placeholder text is visible
    await expect(page.getByText('Type of Study')).toBeVisible();

    // Open the Faculty combobox to confirm it exists and contains faculty options
    await comboboxes.nth(1).click();
    await expect(page.getByRole('option', { name: 'Engineering' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Science' })).toBeVisible();
    // Close by pressing Escape
    await page.keyboard.press('Escape');
  });

  // Scenario 2: Filter by Type of Study
  test('filtering by Type of Study shows only matching subjects', async ({ page }) => {
    await navigateToSubjectsTab(page);

    // All three subjects start visible
    await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).toBeVisible();

    // Open Type of Study dropdown (first combobox in the filter bar) and select "Bachelor"
    const comboboxes = page.getByRole('combobox');
    await comboboxes.first().click();
    await page.getByRole('option', { name: 'Bachelor' }).click();

    // Only bachelor subjects remain
    await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).not.toBeVisible();
  });

  // Scenario 3: Filter by Faculty
  test('filtering by Faculty shows only subjects from that faculty', async ({ page }) => {
    await navigateToSubjectsTab(page);

    // Open Faculty dropdown (second combobox) and select "Science"
    const comboboxes = page.getByRole('combobox');
    await comboboxes.nth(1).click();
    await page.getByRole('option', { name: 'Science' }).click();

    // Only the Science faculty subject (Molecular Biology) should be visible
    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Algorithms' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).not.toBeVisible();
  });

  // Scenario 4: AND logic when both filters are active
  test('combining Type of Study and Faculty filters uses AND logic', async ({ page }) => {
    await navigateToSubjectsTab(page);

    const comboboxes = page.getByRole('combobox');

    // Select Type of Study = Bachelor
    await comboboxes.first().click();
    await page.getByRole('option', { name: 'Bachelor' }).click();

    // Select Faculty = Engineering
    await comboboxes.nth(1).click();
    await page.getByRole('option', { name: 'Engineering' }).click();

    // Both CS and EE are bachelor + Engineering
    await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).toBeVisible();
    // Master/Science subject excluded by both filters
    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).not.toBeVisible();
  });

  // Scenario 5: Resetting filters back to "All" shows all subjects
  test('resetting filters to All shows all subjects again', async ({ page }) => {
    await navigateToSubjectsTab(page);

    const comboboxes = page.getByRole('combobox');

    // Apply a filter first
    await comboboxes.first().click();
    await page.getByRole('option', { name: 'Master' }).click();

    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Algorithms' })).not.toBeVisible();

    // Reset to All
    await comboboxes.first().click();
    await page.getByRole('option', { name: 'All' }).first().click();

    // All subjects visible again
    await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Molecular Biology' })).toBeVisible();
  });

  // Scenario 6: Changing one filter preserves the other filter selection
  test('changing one filter preserves the other filter selection', async ({ page }) => {
    await navigateToSubjectsTab(page);

    const comboboxes = page.getByRole('combobox');

    // Select Faculty = Engineering
    await comboboxes.nth(1).click();
    await page.getByRole('option', { name: 'Engineering' }).click();

    // Now select Type of Study = Master — no master subjects exist in Engineering
    await comboboxes.first().click();
    await page.getByRole('option', { name: 'Master' }).click();

    await expect(page.getByText('No subjects found.')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Algorithms' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'Circuit Theory' })).not.toBeVisible();
  });
});

test.describe('Study Year Limits in Add Subject Modal', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'refreshToken', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    ]);
    await seedAdminStore(page);
    await stubUserServiceRoutes(page);
    await stubAcademyServiceRoutes(page);
  });

  // Scenario 7: Bachelor type shows max 3 study years (STUDY_YEAR_LIMITS.bachelor === 3)
  test('Add Subject modal shows exactly 3 year options for Bachelor type', async ({ page }) => {
    await navigateToSubjectsTab(page);

    await page.getByRole('button', { name: 'Add Subject' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Add Subject to Catalog' })).toBeVisible();

    // Open Type of Study dropdown inside the modal and select Bachelor
    await dialog.getByText('Select type').click();
    await page.getByRole('option', { name: 'Bachelor' }).click();

    // Open the Study Year dropdown
    await dialog.getByText('Select year').click();

    // Verify exactly 3 year options (Year 1–3); Year 4 must not exist
    await expect(page.getByRole('option', { name: 'Year 1' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 2' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 3' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 4' })).not.toBeVisible();
  });

  // Scenario 8: PhD type shows max 4 study years
  test('Add Subject modal shows exactly 4 year options for PhD type', async ({ page }) => {
    await navigateToSubjectsTab(page);

    await page.getByRole('button', { name: 'Add Subject' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByText('Select type').click();
    await page.getByRole('option', { name: 'PhD' }).click();

    await dialog.getByText('Select year').click();

    await expect(page.getByRole('option', { name: 'Year 1' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 2' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 3' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 4' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 5' })).not.toBeVisible();
  });

  // Scenario 9: Certificate type shows only 1 year option
  test('Add Subject modal shows exactly 1 year option for Certificate type', async ({ page }) => {
    await navigateToSubjectsTab(page);

    await page.getByRole('button', { name: 'Add Subject' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByText('Select type').click();
    await page.getByRole('option', { name: 'Certificate' }).click();

    await dialog.getByText('Select year').click();

    await expect(page.getByRole('option', { name: 'Year 1' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 2' })).not.toBeVisible();
  });
});

test.describe('Study Year Limits in Edit Subject Modal', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      { name: 'refreshToken', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    ]);
    await seedAdminStore(page);
    await stubUserServiceRoutes(page);
    await stubAcademyServiceRoutes(page);
  });

  // Scenario 10: Edit modal for a bachelor subject respects max 3 years
  test('Edit Subject modal shows max 3 years for a bachelor subject', async ({ page }) => {
    await navigateToSubjectsTab(page);

    // Wait for subject rows to load
    await expect(page.getByRole('cell', { name: 'Algorithms' })).toBeVisible();

    // The first row is Algorithms (bachelor). Its edit button is the first icon button in that row.
    const firstRow = page.locator('tbody tr').first();
    await firstRow.locator('button').first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Edit Subject' })).toBeVisible();

    // The modal pre-populates typeOfStudy=bachelor. Open the Study Year dropdown.
    // The trigger shows the current year value or "Select year" when empty.
    const studyYearTrigger = dialog
      .locator('button[role="combobox"]')
      .filter({ hasText: /Year \d|Select year/i })
      .first();
    await studyYearTrigger.click();

    await expect(page.getByRole('option', { name: 'Year 1' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 2' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 3' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Year 4' })).not.toBeVisible();
  });
});
