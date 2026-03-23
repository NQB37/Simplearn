# Requirements: Simplearn Expansion

**Defined:** 2026-03-18
**Core Value:** Students can manage their academic life in one place: see their semester schedule, do their assignments, and access course content — all tied to their enrolled classes.

## v1 Requirements

### User Profiles

- [x] **PROF-01**: All users can have extended profile fields: date of birth, sex, phone, address (street, city, country)
- [x] **PROF-02**: Student profile includes: form of study (full-time/part-time/online), field of study (STEM/Business/etc.), major, type of study (bachelor/master/etc.), start year
- [x] **PROF-03**: Instructor profile includes: field(s) they teach, major(s) they teach
- [x] **PROF-04**: Admin can view and edit any user's profile
- [x] **PROF-05**: User can view and edit their own profile

### Student Account Management

- [x] **ACCT-01**: Admin can create a student account via a form (name, email, full profile fields, academic year, class); account is created with a fixed default password
- [x] **ACCT-02**: Newly created student can log in with their email and default password

### Class Management (Admin)

- [x] **CLAS-01**: Admin can pre-create "Class Shells" by selecting a Subject, a Room, an Instructor, and specific Time Shifts.
- [x] **CLAS-02**: Admin UI includes a Time-Grid (Mon-Fri, 7 Shifts) that shows existing Room bookings to prevent overlaps.
- [x] **CLAS-03**: System prevents Room and Instructor conflicts during Class creation.
- [x] **CLAS-04**: Shifts are defined as 7 fixed 90-minute slots stored in the database.

### Enrollment & Schedule (Student)

- [x] **ENRL-01**: Students can browse a catalog of available Classes matching their Major/Faculty.
- [x] **ENRL-02**: System enforces a hard capacity limit based on Room size; full classes are disabled.
- [x] **ENRL-03**: Student can only enroll in one Class per Subject per semester.
- [x] **ENRL-04**: System prevents Student schedule conflicts (cannot enroll in two classes during the same shift).
- [x] **SCHED-01**: Student can view their visual schedule of enrolled classes.

### Assignments

- [ ] **ASGN-01**: Instructor can create an assignment linked to a subject (title, description, due date)
- [ ] **ASGN-02**: All students enrolled in that subject can see the assignment
- [ ] **ASGN-03**: Student can submit an assignment with a text answer and/or file attachment before the due date
- [ ] **ASGN-04**: Instructor can view all submissions for an assignment
- [ ] **ASGN-05**: Instructor can grade a submission with a numeric score and written comment
- [ ] **ASGN-06**: Student can see their grade and feedback after the instructor grades

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PROF-01 | Phase 1 | Complete |
| PROF-02 | Phase 1 | Complete |
| PROF-03 | Phase 1 | Complete |
| PROF-04 | Phase 1 | Complete |
| PROF-05 | Phase 1 | Complete |
| ACCT-01 | Phase 2 | Complete |
| ACCT-02 | Phase 2 | Complete |
| CLAS-01 | Phase 5 | Complete |
| CLAS-02 | Phase 5 | Complete |
| CLAS-03 | Phase 5 | Complete |
| CLAS-04 | Phase 5 | Complete |
| ENRL-01 | Phase 4 | Refactor |
| ENRL-02 | Phase 4 | Refactor |
| ENRL-03 | Phase 4 | Refactor |
| ENRL-04 | Phase 4 | Refactor |
| SCHED-01 | Phase 4 | Refactor |
| ASGN-01 | Phase 6 | Pending |
| ASGN-02 | Phase 6 | Pending |
| ASGN-03 | Phase 6 | Pending |
| ASGN-04 | Phase 6 | Pending |
| ASGN-05 | Phase 6 | Pending |
| ASGN-06 | Phase 6 | Pending |

---
*Requirements updated: 2026-03-20 — Refactored for Class-First Enrollment*
