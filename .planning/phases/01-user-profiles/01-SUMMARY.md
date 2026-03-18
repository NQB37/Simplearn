---
phase: 01-user-profiles
plan: 01
subsystem: api
tags: [mongoose, zod, express, profiles, vocabulary]

requires: []
provides:
  - Profile Mongoose model with nested address, studentData, instructorData sub-schemas
  - FieldOfStudy and Major vocabulary models with compound unique indexes
  - ProfileService with lazy upsert (findOneAndUpdate + upsert: true)
  - GET/PATCH /api/users/profile/extended for authenticated user's own extended profile
  - GET/PATCH /api/admin/users/:id/profile for admin to manage any user's extended profile
  - GET/POST/DELETE /api/admin/vocabulary/fields and /api/admin/vocabulary/majors
affects: [02-user-profiles-frontend, profile-forms, vocabulary-dropdowns]

tech-stack:
  added: []
  patterns:
    - "Lazy upsert: Profile.findOneAndUpdate({ userId }, { $set: data }, { upsert: true, new: true })"
    - "Vocabulary read is accessible to all authenticated roles; write is admin-only"
    - "Extended profile is a separate collection from User, linked by userId ObjectId"

key-files:
  created:
    - backend/user-service/src/models/profile.model.ts
    - backend/user-service/src/models/profile.model.test.ts
    - backend/user-service/src/models/field-of-study.model.ts
    - backend/user-service/src/models/major.model.ts
    - backend/user-service/src/validators/profile.validator.ts
    - backend/user-service/src/services/profile.service.ts
    - backend/user-service/src/services/profile.service.test.ts
    - backend/user-service/src/controllers/profile.controller.ts
    - backend/user-service/src/controllers/admin.profile.controller.ts
  modified:
    - backend/user-service/src/routes/user.route.ts
    - backend/user-service/src/routes/admin.route.ts

key-decisions:
  - "Extended profile stored in separate Profile collection (not embedded in User) for clean separation of auth vs profile data"
  - "Vocabulary reads (fields/majors) are open to all authenticated roles — any role needs them for dropdown population"
  - "Profile endpoints registered as /profile/extended to avoid colliding with existing /profile basic info endpoints"
  - "Major uniqueness enforced per-field via compound index (name + fieldOfStudyId)"

patterns-established:
  - "Lazy upsert: new profiles are created on first PATCH, not on user registration"
  - "Vocabulary guards: delete FieldOfStudy rejects if dependent Majors exist"

requirements-completed: [PROF-01, PROF-02, PROF-03, PROF-04, PROF-05]

duration: 25min
completed: 2026-03-18
---

# Phase 1 Plan 01: User Profiles - Backend Implementation Summary

**Mongoose Profile model with lazy upsert, FieldOfStudy/Major vocabulary, and REST API for user and admin profile management**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-18T17:00:00Z
- **Completed:** 2026-03-18T17:07:00Z
- **Tasks:** 5
- **Files modified:** 11

## Accomplishments

- Profile model with nested address, studentData, instructorData sub-schemas using `{ _id: false }` embedded schemas
- FieldOfStudy and Major vocabulary models; Major has compound unique index on (name, fieldOfStudyId)
- ProfileService using `findOneAndUpdate` with `upsert: true` — profile created on first update, not at registration
- User-facing `GET/PATCH /api/users/profile/extended` and admin-facing `GET/PATCH /api/admin/users/:id/profile`
- Vocabulary CRUD at `/api/admin/vocabulary/fields` and `/api/admin/vocabulary/majors` (read open to all auth, write admin-only)
- 17 unit tests across model and service layers, all passing

## Task Commits

1. **profile-model** - `b110fc9` (feat): Profile Mongoose model, Zod validator, model tests
2. **field-major-models** - `9e0e1a0` (feat): FieldOfStudy and Major vocabulary models
3. **profile-service** - `f3488b2` (feat): ProfileService with lazy upsert and vocabulary operations
4. **profile-routes** - `5143d9d` (feat): User profile controller and extended profile routes
5. **admin-profile-routes** - `1e98b01` (feat): Admin profile and vocabulary management routes

## Files Created/Modified

- `backend/user-service/src/models/profile.model.ts` — Profile schema with nested sub-schemas
- `backend/user-service/src/models/profile.model.test.ts` — 8 model unit tests
- `backend/user-service/src/models/field-of-study.model.ts` — FieldOfStudy vocabulary model
- `backend/user-service/src/models/major.model.ts` — Major model with fieldOfStudyId ref
- `backend/user-service/src/validators/profile.validator.ts` — Zod schema for profile updates
- `backend/user-service/src/services/profile.service.ts` — Lazy upsert + vocabulary CRUD
- `backend/user-service/src/services/profile.service.test.ts` — 9 service unit tests
- `backend/user-service/src/controllers/profile.controller.ts` — User-facing profile controller
- `backend/user-service/src/controllers/admin.profile.controller.ts` — Admin profile + vocabulary controller
- `backend/user-service/src/routes/user.route.ts` — Added extended profile routes
- `backend/user-service/src/routes/admin.route.ts` — Added admin profile + vocabulary routes

## Decisions Made

- Extended profile is a separate collection from User, not embedded. This keeps auth (User) separate from profile data and makes each independently updatable.
- Vocabulary reads are accessible to all authenticated roles (STUDENT, INSTRUCTOR, ADMIN) because the frontend dropdowns for field/major selection need this data regardless of role.
- Profile endpoints are at `/profile/extended` to avoid conflicting with the existing `/profile` endpoint that returns basic User fields (name, picture).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Express 5 route param type incompatibility in admin controller**
- **Found during:** Task 5 (admin profile routes)
- **Issue:** Express 5 types expose `req.params` values as `string | string[]` instead of `string`, causing TypeScript errors
- **Fix:** Used `req.params['id'] as string` cast in admin.profile.controller.ts
- **Files modified:** `backend/user-service/src/controllers/admin.profile.controller.ts`
- **Verification:** `npx tsc --noEmit` passes with no new errors
- **Committed in:** `1e98b01` (Task 5 commit)

**2. [Rule 1 - Bug] Fixed profile model test assertions for nested sub-schema paths**
- **Found during:** Task 1 (profile model)
- **Issue:** Test checked `Profile.schema.paths` for `address.street` etc., but Mongoose doesn't flatten embedded sub-schema paths into the parent schema's `paths` object
- **Fix:** Accessed sub-schema via `(Profile.schema.path('address') as any).schema` and inspected paths there
- **Files modified:** `backend/user-service/src/models/profile.model.test.ts`
- **Verification:** All 8 model tests pass
- **Committed in:** `b110fc9` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes required for correctness. No scope creep.

## Issues Encountered

- Pre-existing `auth.service.test.ts` failure (googleapis constructor mock incompatible with vitest — existed before this plan). Not in scope.

## Next Phase Readiness

- All backend profile API endpoints are implemented and type-safe
- Frontend profile forms (plan 02) can integrate against `/api/users/profile/extended`, `/api/admin/users/:id/profile`, and vocabulary endpoints
- No blockers

## Self-Check: PASSED

All 7 key files found on disk. All 5 task commits verified in git history.

---
*Phase: 01-user-profiles*
*Completed: 2026-03-18*
