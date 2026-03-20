# Roadmap: Simplearn Expansion

## Overview

This roadmap delivers the complete student academic lifecycle. We've pivoted to a **Class-First Enrollment** model where Admins create classes and Students enroll directly into them.

## Phases

- [x] **Phase 1: User Profiles** - Role-specific profile data (Completed 2026-03-18)
- [x] **Phase 2: Student Account Creation** - Admin-provisioned accounts (Completed 2026-03-19)
- [x] **Phase 3: Academic Infrastructure** - Years, Subjects, Rooms base (Completed 2026-03-19)
- [ ] **Phase 4: Class Catalog & Enrollment** - [PIVOT] Students enroll in Classes directly based on Major/Faculty
- [ ] **Phase 5: Class Management (Admin)** - Admin builds the class shell catalog with room/shift/instructor
- [ ] **Phase 6: Assignments & Grading** - Instructor/Student academic work cycle

## Phase Details

### Phase 4: Class Catalog & Enrollment
**Goal**: Students can browse and enroll in specific Classes for their major.
**Depends on**: Phase 3, Phase 5 (for catalog data)
**Requirements**: ENRL-01, ENRL-02, ENRL-03, ENRL-04, SCHED-01
**Success Criteria**:
  1. Student views a list of classes matching their Faculty/Major.
  2. Student can only select one Class per Subject.
  3. System prevents overlapping class times for a single student.
  4. Student visual schedule reflects their chosen classes.

### Phase 5: Class Management (Admin)
**Goal**: Admins pre-create the operational catalog of Classes.
**Depends on**: Phase 3
**Requirements**: CLAS-01, CLAS-02, CLAS-03, CLAS-04
**Success Criteria**:
  1. Admin can create a "Class Shell" with Subject, Instructor, Room, and Day/Shift.
  2. A visual Time-Grid shows room availability to prevent overlaps.
  3. System prevents scheduling a busy Instructor or Room.
  4. Shifts are correctly persisted as 7 fixed 90-min slots.

### Phase 6: Assignments and Grading
**Goal**: Academic interaction between Instructor and Student.
**Depends on**: Phase 4
**Requirements**: ASGN-01, ASGN-02, ASGN-03, ASGN-04, ASGN-05, ASGN-06

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. User Profiles | 2/2 | Completed | 2026-03-18 |
| 2. Student Account Creation | 4/4 | Complete | 2026-03-19 |
| 3. Academic Infrastructure | 5/5 | Complete | 2026-03-19 |
| 4. Class Catalog & Enrollment | 0/TBD | In Refactor | - |
| 5. Class Management (Admin) | 1/3 | In Progress|  |
| 6. Assignments and Grading | 0/TBD | Not started | - |
