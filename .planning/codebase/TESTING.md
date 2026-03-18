# Codebase Testing

**Analysis Date:** 2026-03-18

## Testing Frameworks
- **Unit & Integration:** Vitest
- **End-to-End (E2E):** Playwright
- **Utilities:** @testing-library/react, @testing-library/jest-dom, msw (potentially used/referenced for API mocking).

## Test Organization
- **Frontend Unit Tests:** Located in `frontend/tests/unit/` and `frontend/components/**/*.test.tsx`.
- **Backend Unit Tests:** Located in `backend/*/src/tests/` (e.g., `user-service/vitest.config.ts`).
- **E2E Tests:** Located in `frontend/tests/e2e/`. Files follow the `.spec.ts` suffix.

## Patterns & Practices
- **Component Testing:** Uses `@testing-library/react` for user-centric component testing.
- **Mocking:** 
  - `vi.mock` used for Next.js modules (`next/navigation`), toast notifications (`sonner`), and store libraries (`zustand`).
  - E2E tests often use stubbed responses via Playwright's `route.fulfill` to bypass backend dependencies.
- **Role-Based Tests:** Verifying component visibility and behavior based on user roles (STUDENT, INSTRUCTOR, ADMIN).

## Success Criteria
- [ ] Passing Vitest suite (Unit and Integration).
- [ ] Passing Playwright suite (E2E flows for main user paths).
- [ ] No regression on core features like login, registration, and course creation.

## Mocking Strategy
- **API Mocks:** Frontend tests mock backend services using Vitest's `vi.mock` to ensure isolation.
- **State Mocks:** Zustand stores are initialized with known states for predictable test outcomes.
- **Time Mocks:** `vi.useFakeTimers()` used for testing asynchronous behaviors and intervals.
