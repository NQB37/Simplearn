---
phase: 02-student-account-creation
plan: 04
subsystem: frontend
tags: [frontend, forms, user-management, gap-closure]
dependency_graph:
  requires: [02-03]
  provides: [create-student-form-v2, user-list-firstname-lastname]
  affects: [frontend/app/admin/users, frontend/lib/services]
tech_stack:
  added: []
  patterns: [email-auto-generation, photo-upload-preview, three-card-form-layout]
key_files:
  created: []
  modified:
    - frontend/lib/services/user.service.ts
    - frontend/app/admin/users/page.tsx
    - frontend/app/admin/users/new/page.tsx
decisions:
  - Email auto-generation uses lastName (3 chars) + firstName (fill to 3) + 4 random digits + @simplearn.com; stops auto-updating on manual edit via emailManuallyEdited flag
  - Photo upload is separate state (not in Zod schema) — uploaded to Cloudinary on submit, URL added to payload
  - address field in payload only included when at least one sub-field is non-empty
metrics:
  duration: 8 minutes
  completed: 2026-03-19
  tasks_completed: 2
  files_modified: 3
---

# Phase 2 Plan 4: Frontend Gap Closure — firstName/lastName and Three-Card Form Summary

**One-liner:** Replaced stale `name` field with `firstName`+`lastName` throughout frontend, rebuilt create-student form with three cards, email auto-generation, and Cloudinary photo upload.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update CreateStudentPayload and fix user list Name column | 036e9d3 | user.service.ts, admin/users/page.tsx |
| 2 | Rebuild create student form with three cards, email auto-generation, and photo upload | 584be4a | admin/users/new/page.tsx |

## What Was Built

**Task 1 — Service type and list display:**
- `CreateStudentPayload` now has `firstName`, `lastName`, `email`, `dateOfBirth?`, `phone?`, `address?`, `picture?`, `studentData?` — matching the backend schema from Plan 03
- `User` type in admin users list page updated from `name: string` to `firstName: string` + `lastName: string`
- Name column changed from `accessorKey: 'name'` to a computed `id: 'name'` cell rendering `row.original.firstName + ' ' + row.original.lastName`

**Task 2 — Three-card form:**
- Card 1 "Account Information": firstName + lastName side-by-side grid, email field that auto-populates from name
- Card 2 "Personal Information": date of birth, phone, address (street/city/country), profile photo upload with circular preview
- Card 3 "Academic Profile": unchanged from Plan 02 — form/type of study, field of study, major dependent select, start year
- Email auto-generation: `generateEmail(firstName, lastName)` takes up to 3 chars from lastName, fills remainder from firstName, appends 4 random digits + `@simplearn.com`. Stops regenerating once user manually edits the field.
- Photo upload: file input triggers preview via FileReader; on submit, if photo selected, uploads via `axiosInstance.post` to media-service `/api/media/images/upload`, sets `pictureUrl` in payload
- 409 duplicate email mapped to `form.setError('email', ...)` inline error, not toast
- Submit button disabled during `mutation.isPending || isUploading`

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] frontend/lib/services/user.service.ts — CreateStudentPayload has firstName+lastName
- [x] frontend/app/admin/users/page.tsx — User type and Name column updated
- [x] frontend/app/admin/users/new/page.tsx — Three-card form with all required features
- [x] Commits 036e9d3 and 584be4a exist
- [x] `npx tsc --noEmit` — no errors in application files (pre-existing test file errors unaffected)
- [x] `npm run build` — build succeeds

## Self-Check: PASSED
