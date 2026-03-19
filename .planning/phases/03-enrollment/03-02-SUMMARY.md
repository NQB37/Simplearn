---
phase: 03-enrollment
plan: 02
subsystem: api
tags: [enrollment, mongodb, mongoose, express, zod, jwt]

requires:
  - phase: 03-01
    provides: AcademicYear model with enrollmentDeadline, MajorSubject curriculum model

provides:
  - Refactored Enrollment model (subjectId + academicYearId, no classId)
  - GET /api/v1/enrollments/eligible — student's eligible subjects for active term
  - POST /api/v1/enrollments/bulk — bulk enroll/replace with deadline enforcement

affects: [03-03, 03-04]

tech-stack:
  added: []
  patterns:
    - statusCode on thrown errors for controller-level HTTP mapping
    - fetch() for inter-service calls (no axios dependency needed)
    - Zod validation middleware inline in route files

key-files:
  created:
    - backend/academy-service/src/services/enrollment.service.ts
    - backend/academy-service/src/controllers/enrollment.controller.ts
    - backend/academy-service/src/routes/enrollment.route.ts
  modified:
    - backend/academy-service/src/models/enrollment.model.ts
    - backend/academy-service/src/index.ts

key-decisions:
  - "Used Node.js built-in fetch instead of axios for user-service profile call — no extra dependency needed"
  - "bulkEnroll deletes all user+academicYear enrollments then insertMany — clean atomic replacement"
  - "eligibility calculates currentYear = activeYear.startDate.getFullYear() - startYear + 1"

requirements-completed: []

duration: 15min
completed: 2026-03-19
---

# Phase 3 Plan 02: Backend - Student Enrollment Logic Summary

**Subject-level Enrollment model with GET /eligible and POST /bulk endpoints enforcing enrollmentDeadline**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-19T21:20:00Z
- **Completed:** 2026-03-19T21:35:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Refactored Enrollment model: replaced classId+role+status with subjectId+academicYearId
- Implemented GET /api/v1/enrollments/eligible — calls user-service for student profile, finds active AcademicYear, queries MajorSubject curriculum filtered by studyYear and semester
- Implemented POST /api/v1/enrollments/bulk — verifies enrollmentDeadline, deletes prior enrollments for that semester, inserts all submitted subjectIds atomically

## Task Commits

1. **Task 1: Refactor Enrollment model** - `9844da7` (feat)
2. **Tasks 2+3: Eligibility and bulk enrollment endpoints** - `9a8674a` (feat)

## Files Created/Modified

- `backend/academy-service/src/models/enrollment.model.ts` - Replaced classId with subjectId+academicYearId; updated unique index
- `backend/academy-service/src/services/enrollment.service.ts` - Service logic for eligibility fetch and bulk enroll
- `backend/academy-service/src/controllers/enrollment.controller.ts` - HTTP handlers mapping service to request/response
- `backend/academy-service/src/routes/enrollment.route.ts` - Routes with requireAuth + requireRole(['student']) + Zod validation
- `backend/academy-service/src/index.ts` - Registered enrollment router at /api/v1/enrollments

## Decisions Made

- Used Node.js built-in `fetch` for user-service profile call at `GET /profile/extended` — avoids adding axios dependency
- `bulkEnroll` does `deleteMany` then `insertMany` — simple replacement semantics, no partial state
- Eligibility query uses `studyYear: { $lte: currentYear }` to include subjects from past years the student may have missed
- Errors carry `statusCode` property so controllers can map to correct HTTP status without a custom error class

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Enrollment backend complete; frontend enrollment UI (03-03) can call these endpoints
- Student must have a profile with majorId and startYear set for eligibility to work
- Only one AcademicYear should have isActive=true at any time for correct behavior

---
*Phase: 03-enrollment*
*Completed: 2026-03-19*
