---
phase: 02-student-account-creation
plan: 03
subsystem: api
tags: [mongodb, mongoose, zod, typescript, playwright]

# Dependency graph
requires:
  - phase: 02-student-account-creation
    provides: User model, admin.service createUser, create-user validator, E2E test directory
provides:
  - User model with firstName and lastName fields replacing the old name field
  - Expanded createUserSchema with personal fields (dateOfBirth, phone, address, picture)
  - admin.service createUser with firstName/lastName and Profile personal field upsert
  - E2E test skeleton for ACCT-01 and ACCT-02 scenarios
affects: [student-enrollment, student-dashboard, user-list display]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Profile upsert collects personal fields (dateOfBirth, phone, address) alongside studentData in a single $set operation"
    - "User model stores split name as firstName+lastName for better data granularity"

key-files:
  created:
    - frontend/tests/e2e/admin-student-creation.spec.ts
  modified:
    - backend/user-service/src/models/user.model.ts
    - backend/user-service/src/validators/create-user.validator.ts
    - backend/user-service/src/services/admin.service.ts

key-decisions:
  - "Split name field into firstName+lastName in both IUser interface and userSchema for proper name handling"
  - "Profile upsert now combines personal fields and studentData into a single profileData object before upserting, avoiding multiple DB calls"

patterns-established:
  - "Profile upsert: build profileData object conditionally from all personal fields, then upsert in one operation if non-empty"

requirements-completed: [ACCT-01, ACCT-02]

# Metrics
duration: 8min
completed: 2026-03-19
---

# Phase 2 Plan 03: Gap Closure — User Model firstName/lastName Migration Summary

**User model migrated from `name` to `firstName`+`lastName`, validator expanded with personal fields (dateOfBirth, phone, address, picture), service updated to upsert Profile with all personal and academic data, and E2E test skeleton created with four skipped stubs for ACCT-01/ACCT-02.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-19T00:00:00Z
- **Completed:** 2026-03-19T00:08:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Replaced `name` field with `firstName`+`lastName` in IUser interface and userSchema
- Expanded `createUserSchema` validator to accept personal fields: dateOfBirth, phone, address, picture, studentData
- Updated `createUser` service to construct User with firstName/lastName/picture and upsert Profile with all personal+academic fields
- Updated `getAllUsers` select string to return `firstName lastName` instead of `name`
- Created E2E test skeleton with four `test.skip` stubs covering all ACCT-01 and ACCT-02 scenarios

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate User model and expand validator+service** - `0c7c9bc` (feat)
2. **Task 2: Create E2E test skeleton for ACCT-01 and ACCT-02** - `9dd38ca` (test)

## Files Created/Modified

- `backend/user-service/src/models/user.model.ts` - IUser interface and userSchema updated: name removed, firstName+lastName added
- `backend/user-service/src/validators/create-user.validator.ts` - Replaced with expanded schema including personal fields and addressSchema
- `backend/user-service/src/services/admin.service.ts` - createUser uses firstName/lastName, Profile upsert handles all personal fields, getAllUsers selects firstName+lastName
- `frontend/tests/e2e/admin-student-creation.spec.ts` - E2E skeleton with skipped stubs for navigation, form submission, duplicate email, and login scenarios

## Decisions Made

None - followed plan as specified. All changes were direct implementations of the plan's action items.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in `src/google-test.ts` (jest namespace) and `src/middlewares/logger.middleware.ts` (@simplearn/logger missing) were present before this plan and are unrelated to the changes made. They are noted in CLAUDE.md as known issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Backend is now consistent: User model, validator, and service all use firstName+lastName
- E2E skeleton is in place for when full E2E implementation is done
- Frontend form at `/admin/users/new` (from plan 02-02) already uses firstName/lastName fields — now aligned with backend

---
*Phase: 02-student-account-creation*
*Completed: 2026-03-19*
