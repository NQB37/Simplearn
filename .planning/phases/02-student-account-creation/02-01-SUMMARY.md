---
phase: 02-student-account-creation
plan: 01
subsystem: api
tags: [express, zod, mongoose, user-management, rbac]

requires:
  - phase: 01-user-profiles
    provides: User model with pre-save bcrypt hook, Profile model with studentData sub-schema

provides:
  - POST /api/admin/users endpoint for admin-driven student account creation
  - createUserSchema Zod validator (name, email, optional studentData)
  - createUser service function with duplicate detection and Profile upsert
  - createUser controller with 201/409/500 responses

affects: [02-student-account-creation, admin-ui, e2e-tests]

tech-stack:
  added: []
  patterns:
    - "Throw error with custom err.code for domain errors; controller maps code to HTTP status"
    - "Service creates User with plaintext password; pre-save hook bcrypt-hashes it (no double-hashing)"
    - "Optional sub-document upsert via Profile.findOneAndUpdate with $set and upsert:true"

key-files:
  created:
    - backend/user-service/src/validators/create-user.validator.ts
  modified:
    - backend/user-service/src/services/admin.service.ts
    - backend/user-service/src/controllers/admin.controller.ts
    - backend/user-service/src/routes/admin.route.ts

key-decisions:
  - "Use err.code = 'DUPLICATE_EMAIL' pattern (not instanceof) for clean cross-layer error signaling"
  - "Only upsert Profile if studentData is provided and non-empty — avoids creating empty profile docs"

patterns-established:
  - "Domain error signaling: service throws Error with .code property; controller maps .code to HTTP status"

requirements-completed: [ACCT-01, ACCT-02]

duration: 8min
completed: 2026-03-18
---

# Phase 2 Plan 01: Student Account Creation Backend Summary

**POST /api/admin/users endpoint using Zod validation, bcrypt-safe User creation with role STUDENT, and optional Profile upsert via findOneAndUpdate**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-18T22:10:00Z
- **Completed:** 2026-03-18T22:18:13Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created Zod schema for create-user payload (name, email, optional studentData)
- Added createUser service with duplicate email detection (409) and Profile upsert
- Registered POST /api/admin/users with isAuthenticated + isAdmin + validateRequest guards

## Task Commits

Each task was committed atomically:

1. **Task 1: Create user validator and service function** - `72b596a` (feat)
2. **Task 2: Add controller handler and register POST route** - `e76c39d` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `backend/user-service/src/validators/create-user.validator.ts` - Zod schema and CreateUserInput type
- `backend/user-service/src/services/admin.service.ts` - createUser function with duplicate check and Profile upsert
- `backend/user-service/src/controllers/admin.controller.ts` - createUser handler returning 201/409/500
- `backend/user-service/src/routes/admin.route.ts` - POST /users route registration with full middleware chain

## Decisions Made

- err.code = 'DUPLICATE_EMAIL' used for cross-layer error signaling; controller maps it to HTTP 409
- Profile upsert only occurs when studentData is provided and non-empty — no empty profile documents created

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Backend endpoint is complete and ready for frontend admin UI integration (02-02)
- Endpoint accepts { name, email, studentData? } and returns created user with role STUDENT
- Default password is simplearn123 — student can log in immediately after creation

---
*Phase: 02-student-account-creation*
*Completed: 2026-03-18*
