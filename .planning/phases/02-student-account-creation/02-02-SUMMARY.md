---
phase: 02-student-account-creation
plan: 02
subsystem: ui
tags: [react, tanstack-query, react-hook-form, zod, shadcn, next.js]

# Dependency graph
requires:
  - phase: 02-01
    provides: POST /api/admin/users endpoint with 409 duplicate email response

provides:
  - Admin create student form at /admin/users/new with Account Information and Academic Profile sections
  - useAdminUsers hook (useQuery-based) replacing useState+useEffect in user list
  - useCreateStudent mutation hook with query invalidation
  - createStudent service function in user.service.ts

affects:
  - 03-enrollment
  - future admin user management pages

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useQuery replaces useState+useEffect for data fetching in admin pages
    - useMutation with onSuccess invalidateQueries for list refresh after creation
    - form.setError for inline field errors on API 409 responses (not toast)
    - Dependent select: useWatch on fieldOfStudyId -> useMajors -> reset majorId on field change

key-files:
  created:
    - frontend/app/admin/users/new/page.tsx
  modified:
    - frontend/lib/services/user.service.ts
    - frontend/hooks/use-user.ts
    - frontend/app/admin/users/page.tsx

key-decisions:
  - "useAdminUsers uses dynamic import for axiosInstance to avoid SSR issues in dynamic import path"
  - "handleRoleChange/handleStatusChange left as stubs (toast only) per RESEARCH.md open question 1 — not in scope for this plan"
  - "Payload cleanup before send: empty strings filtered out so backend does not receive empty studentData fields"

patterns-established:
  - "Admin form pages: max-w-2xl mx-auto, two Cards (required fields / optional fields), right-aligned submit"
  - "Duplicate email: inline via form.setError('email', ...) + FormMessage, NOT toast"
  - "Post-create: router.push then toast.success (navigation first, then notify)"

requirements-completed: [ACCT-01, ACCT-02]

# Metrics
duration: 15min
completed: 2026-03-18
---

# Phase 2 Plan 02: Student Account Creation Frontend Summary

**Admin create student form at /admin/users/new with useQuery-powered list refresh, dependent Field-Major selects, inline duplicate email error, and success toast with default password**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-18T22:20:00Z
- **Completed:** 2026-03-18T22:35:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Converted user list page from useState+useEffect to useQuery with query key `['admin-users']` for automatic invalidation
- Added Create Student button to user list page header linking to /admin/users/new
- Created full create student form with Account Information (name, email required) and Academic Profile (all optional) sections
- Dependent Field of Study -> Major select with auto-reset on field change (ported from AcademicForm)
- Inline 409 duplicate email error via form.setError, success redirect with toast containing default password

## Task Commits

Each task was committed atomically:

1. **Task 1: Add service function, hooks, and convert user list page** - `69ebde9` (feat)
2. **Task 2: Create student form page at /admin/users/new** - `d806a54` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `frontend/app/admin/users/new/page.tsx` - Create student form page (315 lines)
- `frontend/lib/services/user.service.ts` - Added CreateStudentPayload interface and createStudent method
- `frontend/hooks/use-user.ts` - Added useAdminUsers and useCreateStudent hooks
- `frontend/app/admin/users/page.tsx` - Converted to useQuery, added Create Student button with Link to /admin/users/new

## Decisions Made

- handleRoleChange and handleStatusChange in users/page.tsx left as toast-only stubs — backend endpoints for role/status changes are out of scope for this plan (noted in RESEARCH.md open question 1)
- Payload sent to backend strips empty string values from studentData so backend receives clean data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in `tests/e2e/*.spec.ts` and `tests/unit/course.service.test.ts` were present before this plan and are out of scope. No new errors introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Admin can now create student accounts via /admin/users/new
- New students appear immediately in the user list after creation via query invalidation
- Phase 3 (Enrollment) can proceed: students exist and can be assigned to classes

---
*Phase: 02-student-account-creation*
*Completed: 2026-03-18*
