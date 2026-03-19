---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready for execution
stopped_at: Completed 03-04-PLAN.md
last_updated: "2026-03-19T21:23:18.752Z"
last_activity: 2026-03-19 — Completed 03-02 enrollment backend.
progress:
  total_phases: 5
  completed_phases: 1
  total_plans: 10
  completed_plans: 8
  percent: 44
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-18)

**Core value:** Students can manage their academic life in one place: see their semester schedule, do their assignments, and access course content — all tied to their enrolled classes.  
**Current focus:** Phase 3 — Enrollment

## Current Position

Phase: 3 of 5 (Enrollment)
Plan: 4 of 4 in current phase
Status: Ready for execution
Last activity: 2026-03-19 — Completed 03-02 enrollment backend.

Progress: [▓▓▓▓░░░░░░] 44%
## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01 P01 | 25 | 5 tasks | 11 files |
| Phase 02-student-account-creation P01 | 8 | 2 tasks | 4 files |
| Phase 02-student-account-creation P02 | 15 | 2 tasks | 4 files |
| Phase 02-student-account-creation P03 | 8 | 2 tasks | 4 files |
| Phase 02-student-account-creation P04 | 8 | 2 tasks | 3 files |
| Phase 03-enrollment P01 | 15 | 4 tasks | 8 files |
| Phase 03-enrollment P02 | 15 | 3 tasks | 5 files |
| Phase 03-enrollment P04 | 20 | 3 tasks | 11 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- New assignment-service (port 8005) planned for Phase 5 — keeps course-service focused on curriculum
- Enrollment logic to live in academy-service — subjects/classes already reside there
- Default student password will be a fixed string (e.g., `simplearn123`) — simple for school setting
- [Phase 01]: Extended profile stored in separate Profile collection (not embedded in User) for clean separation of auth vs profile data
- [Phase 01]: Profile endpoints at /profile/extended to avoid collision with existing /profile basic info endpoint
- [Phase 01]: Vocabulary reads open to all authenticated roles; writes restricted to admin
- [Phase 02-student-account-creation]: Use err.code = 'DUPLICATE_EMAIL' pattern for cross-layer error signaling; controller maps code to HTTP 409
- [Phase 02-student-account-creation]: Profile upsert only when studentData provided and non-empty — avoids empty profile documents
- [Phase 02-student-account-creation]: useAdminUsers hook uses useQuery with queryKey ['admin-users'] enabling query invalidation on student creation
- [Phase 02-student-account-creation]: Duplicate email mapped to inline form.setError on email field, not toast, per UX spec
- [Phase 02-student-account-creation]: Split name field into firstName+lastName in User model for proper name handling
- [Phase 02-student-account-creation]: Profile upsert combines personal fields and studentData into a single profileData object, avoiding multiple DB calls
- [Phase 02-student-account-creation]: Email auto-generation uses lastName prefix (3 chars) + firstName fill + 4 random digits + @simplearn.com; stops on manual edit via emailManuallyEdited flag
- [Phase 02-student-account-creation]: Photo upload is separate state outside Zod schema — uploaded to Cloudinary on submit, URL added to CreateStudentPayload.picture
- [Phase 03-enrollment]: AcademicYear uniqueness changed from name-only to composite name+semester since same year name can have multiple semesters
- [Phase 03-enrollment]: Curriculum routes mounted at /api/v1/curriculum alongside existing /api/academy/* routes as specified
- [Phase 03-enrollment]: Enrollment model refactored from classId to subjectId+academicYearId; no status or role fields needed
- [Phase 03-enrollment]: Node.js built-in fetch used for user-service profile call — avoids adding axios dependency to academy-service
- [Phase 03-enrollment]: bulkEnroll uses deleteMany+insertMany for clean semester replacement semantics
- [Phase 03-enrollment]: Native HTML checkbox used for enrollment page (Shadcn Checkbox not installed); isMandatory subjects default-checked but remain toggleable per UI-SPEC

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-03-19T21:23:18.749Z
Stopped at: Completed 03-04-PLAN.md
Resume file: None
