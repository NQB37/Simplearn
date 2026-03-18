# Roadmap: Simplearn Expansion

## Overview

This roadmap expands the existing Simplearn LMS to deliver the complete student academic lifecycle: extended user profiles, admin-created student accounts, subject enrollment with deadlines, semester schedule visibility, and instructor-managed assignments with grading. Each phase builds on the last, with the existing auth and academy infrastructure as the foundation.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: User Profiles** - Extended profile data for all users with role-specific fields
- [x] **Phase 2: Student Account Creation** - Admin can create student accounts with full profile via a form (completed 2026-03-18)
- [ ] **Phase 3: Enrollment** - Admin suggests subjects and students enroll before a deadline
- [ ] **Phase 4: Schedule** - Students can view their enrolled subjects for the semester
- [ ] **Phase 5: Assignments & Grading** - Instructors create assignments; students submit; instructors grade

## Phase Details

### Phase 1: User Profiles
**Goal**: All users have extended profile data that reflects their role in the institution
**Depends on**: Nothing (builds on existing user-service auth)
**Requirements**: PROF-01, PROF-02, PROF-03, PROF-04, PROF-05
**Success Criteria** (what must be TRUE):
  1. Any user can open their profile page and see/edit fields: date of birth, sex, phone, address
  2. A student's profile shows form of study, field of study, major, type of study, and start year
  3. An instructor's profile shows the fields and majors they teach
  4. Admin can navigate to any user's profile page and edit all fields on their behalf
  5. A user's own profile edits save and are reflected immediately on next load
**Plans**: TBD

### Phase 2: Student Account Creation
**Goal**: Admins can provision student accounts directly from the admin dashboard with full profile data populated at creation time
**Depends on**: Phase 1
**Requirements**: ACCT-01, ACCT-02
**Success Criteria** (what must be TRUE):
  1. Admin can fill and submit a "Create Student" form that includes name, email, profile fields, academic year, and class assignment
  2. The created student account appears in the user list immediately after creation
  3. The new student can log in using their email and the default password without any additional setup
**Plans:** 2/2 plans complete
Plans:
- [ ] 02-01-PLAN.md — Backend endpoint for admin student account creation (POST /api/admin/users)
- [ ] 02-02-PLAN.md — Frontend create student form page and user list conversion

### Phase 3: Enrollment
**Goal**: Admins can suggest subjects to students and students can enroll within a defined deadline
**Depends on**: Phase 2
**Requirements**: ENRL-01, ENRL-02, ENRL-03, ENRL-04
**Success Criteria** (what must be TRUE):
  1. Admin can select a student and assign a set of suggested subjects from the existing subjects list
  2. Admin can set or update an enrollment deadline for an academic period
  3. A student can view their suggested subjects and click to enroll in chosen ones before the deadline
  4. A student who tries to enroll after the deadline sees an error and is blocked from enrolling
**Plans**: TBD

### Phase 4: Schedule
**Goal**: Students can see which subjects they are enrolled in for their current academic year
**Depends on**: Phase 3
**Requirements**: SCHED-01
**Success Criteria** (what must be TRUE):
  1. A student sees a list of their enrolled subjects on their schedule page, showing subject name and relevant details
  2. The schedule reflects only subjects the student has actively enrolled in (not just suggested ones)
**Plans**: TBD

### Phase 5: Assignments and Grading
**Goal**: Instructors can create, manage, and grade assignments; students can submit work and receive feedback
**Depends on**: Phase 3
**Requirements**: ASGN-01, ASGN-02, ASGN-03, ASGN-04, ASGN-05, ASGN-06
**Success Criteria** (what must be TRUE):
  1. Instructor can create an assignment for a subject with a title, description, and due date, and it appears to all enrolled students
  2. A student enrolled in the subject sees the assignment and can submit a text answer and/or file attachment before the due date
  3. Instructor can open an assignment and view a list of all student submissions
  4. Instructor can select a submission, enter a numeric score and written comment, and save the grade
  5. After grading, the student can open their submission and see their score and the instructor's comment
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. User Profiles | 2/2 | Completed | 2026-03-18 |
| 2. Student Account Creation | 2/2 | Complete   | 2026-03-18 |
| 3. Enrollment | 0/TBD | Not started | - |
| 4. Schedule | 0/TBD | Not started | - |
| 5. Assignments and Grading | 0/TBD | Not started | - |
