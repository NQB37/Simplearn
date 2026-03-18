# Testing Patterns

**Analysis Date:** 2026-03-18

## Test Framework

**Runner:**
- Vitest 4.1.0
- Frontend config: `frontend/vitest.config.ts`
- Backend (user-service) config: `backend/user-service/vitest.config.ts`
- Other backend services: No vitest config (tests exist but runner TBD)

**Assertion Library:**
- Vitest built-in `expect()` (compatible with Jest)
- React Testing Library for component assertions
- Playwright for E2E tests

**Run Commands:**
```bash
# Frontend
npm run test              # Vitest run (unit tests only)
npm run test:e2e          # Playwright (all E2E tests, all browsers)
npx playwright test tests/e2e/some.spec.ts  # Single E2E test file

# Backend services
npm run test              # Vitest run (unit tests)
npx vitest run src/some.test.ts  # Single test file
```

**Coverage:**
- Vitest coverage via v8 provider (backend user-service config): `vitest run --coverage`
- Reporters: text, json, html (backend)
- Frontend: No coverage config

## Test File Organization

**Location:**
- Unit tests: Co-located with source (e.g., `src/services/auth.service.test.ts` next to `src/services/auth.service.ts`)
- E2E tests: `frontend/tests/e2e/` (separate directory)
- Frontend unit tests: `frontend/tests/unit/` (e.g., `course.service.test.ts`)
- Component tests: Co-located (e.g., `delete-course-modal.test.tsx` next to `delete-course-modal.tsx`)

**Naming:**
- `.test.ts` suffix (e.g., `course.service.test.ts`, `auth.service.test.ts`)
- `.spec.ts` suffix for E2E (e.g., `instructor-course-crud.spec.ts`)

**Vitest Config Exclusions:**
```typescript
// frontend/vitest.config.ts excludes E2E tests:
exclude: ['node_modules', 'tests/e2e/**']
```

## Test Structure

**Unit Test Pattern (Backend Service):**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as courseService from './course.service.js';
import Course from '../models/course.model.js';

vi.mock('../models/course.model.js', () => {
  const mockModel: any = vi.fn().mockImplementation((data: any) => ({
    ...data,
    save: vi.fn().mockResolvedValue({ _id: 'new-id', ...data }),
  }));
  mockModel.find = vi.fn();
  mockModel.findOne = vi.fn();
  mockModel.findByIdAndUpdate = vi.fn();
  mockModel.findByIdAndDelete = vi.fn();
  return { default: mockModel };
});

describe('Course Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should return all courses sorted by createdAt descending', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course A', slug: 'course-a' },
        { _id: '2', title: 'Course B', slug: 'course-b' },
      ];
      (Course.find as any).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockCourses),
      });

      const result = await courseService.getCourses();

      expect(Course.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockCourses);
    });
  });
});
```

**Unit Test Pattern (Frontend Service):**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseService } from '@/lib/services/course.service';

vi.mock('@/api/axios.api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import axiosInstance from '@/api/axios.api';

describe('courseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCourses returns array of courses', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: [mockCourse] });
    const result = await courseService.getCourses();
    expect(result).toEqual([mockCourse]);
  });
});
```

**Component Test Pattern:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCourseModal } from './delete-course-modal';

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  slug: 'my-test-course',
  isPending: false,
  onConfirm: vi.fn(),
};

describe('DeleteCourseModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the warning message and slug', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    expect(
      screen.getByText(/This action is irreversible/i),
    ).toBeInTheDocument();
    expect(screen.getByText('my-test-course')).toBeInTheDocument();
  });

  it('enables the confirm button when input matches slug exactly', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    const button = screen.getByRole('button', { name: /delete course/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onConfirm when confirm button is clicked with matching slug', () => {
    render(<DeleteCourseModal {...defaultProps} />);
    const input = screen.getByLabelText(/course slug/i);
    fireEvent.change(input, { target: { value: 'my-test-course' } });
    const button = screen.getByRole('button', { name: /delete course/i });
    fireEvent.click(button);
    expect(defaultProps.onConfirm).toHaveBeenCalledOnce();
  });
});
```

**E2E Test Pattern (Playwright):**
```typescript
import { test, expect } from '@playwright/test';

const INSTRUCTOR_TOKEN = 'eyJ...'; // Mock JWT

test.describe('Instructor Course List', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
    ]);
  });

  test('course list page loads with table columns and courses', async ({ page }) => {
    // Seed auth state
    await seedInstructorStore(page);
    // Stub external auth calls
    await stubAuthRefresh(page);
    // Mock API responses
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

    // Assert
    await expect(page.getByRole('heading', { name: 'My Courses' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Title' })).toBeVisible();
    await expect(page.getByText('Introduction to TypeScript')).toBeVisible();
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
```

**Setup/Teardown:**
- `beforeEach()`: Clear mocks, reset state
- `test.beforeEach()` (E2E): Add cookies, init auth state via localStorage
- No explicit teardown (Vitest + React Testing Library handle cleanup)

**Assertion Pattern:**
- Vitest: `expect(result).toEqual(expected)`, `expect(fn).toHaveBeenCalledWith(args)`
- React Testing Library: `expect(element).toBeVisible()`, `expect(element).toBeDisabled()`, `expect(screen.getByText(...)).toBeInTheDocument()`
- Playwright: `await expect(page.getByRole(...)).toBeVisible()`

## Mocking

**Framework:** Vitest `vi.mock()` (replaces imports before module load)

**Patterns:**

**1. Mocking Mongoose Models:**
```typescript
vi.mock('../models/course.model.js', () => {
  const mockModel: any = vi.fn().mockImplementation((data: any) => ({
    ...data,
    save: vi.fn().mockResolvedValue({ _id: 'new-id', ...data }),
  }));
  mockModel.find = vi.fn();
  mockModel.findOne = vi.fn();
  mockModel.findByIdAndUpdate = vi.fn();
  mockModel.findByIdAndDelete = vi.fn();
  return { default: mockModel };
});
```

**2. Mocking External APIs (googleapis):**
```typescript
vi.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: vi.fn().mockImplementation(() => ({
        getToken: vi
          .fn()
          .mockResolvedValue({ tokens: { access_token: 'fake_token' } }),
        setCredentials: vi.fn(),
      })),
    },
    oauth2: vi.fn().mockReturnValue({
      userinfo: {
        get: vi.fn().mockResolvedValue({
          data: {
            email: 'test-google@example.com',
            name: 'Test Google User',
            picture: 'http://example.com/pic.jpg',
          },
        }),
      },
    }),
  },
}));
```

**3. Mocking Axios:**
```typescript
vi.mock('@/api/axios.api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
```

**4. E2E Route Mocking (Playwright):**
```typescript
// Mock API response
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

// Stub auth refresh endpoint
await page.route('http://localhost:8001/**', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ accessToken: INSTRUCTOR_TOKEN }),
  });
});
```

**What to Mock:**
- External dependencies (databases, APIs, external services)
- Mongoose models (via vi.mock)
- Axios instance (via vi.mock)
- Complex integrations (googleapis OAuth)
- Next page.route() for HTTP calls in E2E

**What NOT to Mock:**
- Internal service functions (test actual logic)
- Pure utility functions
- Zustand store itself (test getState() calls directly)
- React component internals (test via render + screen queries)

## Fixtures and Factories

**Test Data:**
- Inline mock objects in test files
- E2E tests use stub data constants: `STUB_COURSES`, `STUB_SUBJECTS`, `STUB_NEW_COURSE`
- Component test props: `defaultProps` object

**Example (E2E Fixture):**
```typescript
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
```

**Example (Component Test Props):**
```typescript
const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  slug: 'my-test-course',
  isPending: false,
  onConfirm: vi.fn(),
};
```

**Location:**
- Inline in test file (co-located)
- No separate fixtures directory
- Reused across test suites via constants at file top

## Test Types

**Unit Tests:**
- Scope: Service methods, individual functions
- Approach: Mock dependencies (models, external APIs); test business logic
- Location: `src/services/*.test.ts`, `src/models/*.test.ts` (backend); `tests/unit/` (frontend)
- Examples: `auth.service.test.ts`, `course.service.test.ts`, `course.service.test.ts` (frontend)

**Integration Tests:**
- Scope: Service + model interactions (e.g., course CRUD with Mongoose)
- Approach: Mock external APIs only; test actual Mongoose queries
- Status: Not extensively seen; most tests are unit tests with mocked models
- Could expand to test database operations without mocks

**E2E Tests:**
- Framework: Playwright
- Scope: Full user workflows (UI → backend → database)
- Location: `frontend/tests/e2e/`
- Examples: `instructor-course-crud.spec.ts`, `module-crud.spec.ts`, `lesson-content.spec.ts`
- Approach: Route-mocking for API calls; localStorage seeding for auth state; real page navigation

## Common Patterns

**Async Testing:**
```typescript
// Backend service test
it('should create and return a new course', async () => {
  const data = { title: 'New Course', slug: 'new-course', ... };
  const result = await courseService.createCourse(data);
  expect(result).toEqual(expect.objectContaining(data));
});

// E2E test
test('course list page loads', async ({ page }) => {
  await page.goto('/instructor/courses');
  await expect(page.getByRole('heading', { name: 'My Courses' })).toBeVisible();
});
```

**Error Testing:**
```typescript
// Backend service test
it('should throw an error if user already exists', async () => {
  (User.findOne as any).mockResolvedValue({ email: 'test@example.com' });
  await expect(
    authService.register('Test', 'test@example.com', 'password'),
  ).rejects.toThrow('User already exists');
});

// Component test
it('disables the confirm button and shows loading text when isPending', () => {
  render(<DeleteCourseModal {...defaultProps} isPending={true} />);
  const input = screen.getByLabelText(/course slug/i);
  fireEvent.change(input, { target: { value: 'my-test-course' } });
  const button = screen.getByRole('button', { name: /deleting/i });
  expect(button).toBeDisabled();
});
```

**State Testing:**
```typescript
// Component test with state transitions
it('clears the input when modal is closed and reopened', () => {
  const { rerender } = render(<DeleteCourseModal {...defaultProps} />);
  const input = screen.getByLabelText(/course slug/i);
  fireEvent.change(input, { target: { value: 'my-test-course' } });
  expect((input as HTMLInputElement).value).toBe('my-test-course');

  rerender(<DeleteCourseModal {...defaultProps} open={false} />);
  rerender(<DeleteCourseModal {...defaultProps} open={true} />);
  const freshInput = screen.getByLabelText(/course slug/i);
  expect((freshInput as HTMLInputElement).value).toBe('');
});
```

## E2E Setup Helpers

**Auth State Injection (localStorage):**
```typescript
function seedInstructorStore(page) {
  return (page as any).addInitScript(() => {
    localStorage.setItem('user-storage', JSON.stringify({
      state: {
        user: {
          id: 'instructor-001',
          role: 'INSTRUCTOR',
          email: 'instructor@test.com',
          name: 'Test Instructor',
        },
        accessToken: INSTRUCTOR_TOKEN,
        isAuthenticated: true,
      },
      version: 0,
    }));
  });
}
```

**Cookie Setup:**
```typescript
test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: 'refreshToken', value: INSTRUCTOR_TOKEN, domain: 'localhost', path: '/' },
  ]);
});
```

**API Route Stubbing:**
```typescript
function stubAuthRefresh(page) {
  return (page as any).route('http://localhost:8001/**', (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: INSTRUCTOR_TOKEN }),
    });
  });
}
```

---

*Testing analysis: 2026-03-18*
