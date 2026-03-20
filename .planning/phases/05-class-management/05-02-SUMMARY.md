---
phase: 05-class-management
plan: 02
subsystem: frontend/admin-classes
tags: [ui, scheduling, time-grid, react-hook-form, zod]
dependency_graph:
  requires: ["05-01"]
  provides: ["admin-class-creation-ui", "time-grid-component"]
  affects: ["frontend/app/admin/classes", "frontend/hooks/use-academics"]
tech_stack:
  added: []
  patterns: ["react-hook-form + zod v4", "availability-driven cascading selects", "CSS grid time-grid"]
key_files:
  created:
    - frontend/components/features/academics/time-grid.tsx
    - frontend/components/features/academics/class-form.tsx
    - frontend/app/admin/classes/page.tsx
    - frontend/app/admin/classes/create/page.tsx
  modified:
    - frontend/hooks/use-academics.ts
    - frontend/hooks/use-user.ts
    - frontend/lib/services/academy.service.ts
    - frontend/types/academics.type.ts
    - frontend/app/admin/layout.tsx
decisions:
  - "TimeGrid renders busy slots from backend RoomGrid using a CSS grid (not a third-party library)"
  - "useBusyInstructorIds fans out parallel requests per slot and unions the results"
  - "ClassModel.instructorId and schedules made optional to preserve backward compat with add-class-modal"
  - "maxCapacity uses valueAsNumber on the Input to avoid zod v4 coerce type inference issues with react-hook-form"
metrics:
  duration: "7 minutes"
  completed_date: "2026-03-20"
  tasks_completed: 4
  files_changed: 9
---

# Phase 5 Plan 02: Admin Class Creation UI Summary

**One-liner:** Interactive 5x7 time-grid class creation UI with availability-driven room and instructor selection.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Time-Grid Component | 42952a4 | time-grid.tsx |
| 2 | Hooks & Data Fetching | 26836fa | use-academics.ts, use-user.ts, academy.service.ts, academics.type.ts |
| 3 | Class Creation Page | 308ba61 | class-form.tsx, admin/classes/create/page.tsx |
| 4 | Class List & Navigation | 996ae4b | admin/classes/page.tsx, admin/layout.tsx |

## What Was Built

### TimeGrid Component
A CSS-grid based scheduling grid (5 days x 7 shifts). Supports:
- Click-and-drag painting for multi-slot selection
- `available` (white), `selected` (blue), `busy` (gray with subject label) visual states
- Keyboard-friendly mouse events (mousedown, mouseenter, mouseup)
- Tooltip labels on busy cells showing the subject name or class code

### Class Creation Workflow (3-step)
1. Select subject, room, academic year, code, and capacity
2. TimeGrid renders with the room's real occupancy from `GET /api/academy/availability/grid/:roomId`
3. Instructor dropdown shows only free instructors (filtered by busy IDs from `GET /api/academy/availability/instructors` for each selected slot)

### Hooks Added
- `useRoomAvailabilityGrid(roomId, academicYearId)` — fetches full 5x7 room grid
- `useBusyInstructorIds(academicYearId, schedules)` — fans out requests for each slot and unions results
- `useInstructors()` — fetches all users with role=instructor from user-service

### Service Methods Added
- `academyService.getRoomGrid(roomId, academicYearId)`
- `academyService.getBusyInstructorIds(academicYearId, schedules)`

### Types Updated
- `ClassSchedule`, `GridCellData`, `RoomGrid` interfaces added
- `ClassModel.instructorId` and `ClassModel.schedules` added as optional fields

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Build error from ClassModel type update breaking add-class-modal**
- **Found during:** Task 3 build verification
- **Issue:** Adding `instructorId` and `schedules` as required fields to `ClassModel` broke the existing `add-class-modal.tsx` which doesn't supply those fields
- **Fix:** Made both fields optional (`?`) in `ClassModel` to preserve backward compatibility
- **Files modified:** frontend/types/academics.type.ts

**2. [Rule 1 - Bug] Zod v4 + react-hook-form type inference failure with coerce**
- **Found during:** Task 3 build verification
- **Issue:** `z.coerce.number()` and `z.number({ coerce: true })` both cause resolver type mismatch with react-hook-form under Zod v4 — the input type is inferred as `unknown`
- **Fix:** Used plain `z.number()` with `e.target.valueAsNumber` in the Input onChange handler
- **Files modified:** frontend/components/features/academics/class-form.tsx

## Self-Check: PASSED

All created files verified on disk. All 4 task commits verified in git log.
- FOUND: frontend/components/features/academics/time-grid.tsx
- FOUND: frontend/components/features/academics/class-form.tsx
- FOUND: frontend/app/admin/classes/page.tsx
- FOUND: frontend/app/admin/classes/create/page.tsx
- COMMIT 42952a4: feat(05-02): add TimeGrid component
- COMMIT 26836fa: feat(05-02): add availability hooks and service methods
- COMMIT 308ba61: feat(05-02): add ClassForm and class creation page
- COMMIT 996ae4b: feat(05-02): add class list page and sidebar navigation
