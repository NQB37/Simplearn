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

### Enrollment

- [ ] **ENRL-01**: Admin can suggest a set of subjects for a specific student to enroll in
- [ ] **ENRL-02**: Admin can set an enrollment deadline per academic period
- [x] **ENRL-03**: Student can view their suggested subjects and enroll in chosen ones before the deadline
- [x] **ENRL-04**: Student cannot enroll after the enrollment deadline has passed

### Schedule

- [ ] **SCHED-01**: Student can view a list of their enrolled subjects for their current academic year/semester

### Assignments

- [ ] **ASGN-01**: Instructor can create an assignment linked to a subject (title, description, due date)
- [ ] **ASGN-02**: All students enrolled in that subject can see the assignment
- [ ] **ASGN-03**: Student can submit an assignment with a text answer and/or file attachment before the due date
- [ ] **ASGN-04**: Instructor can view all submissions for an assignment
- [ ] **ASGN-05**: Instructor can grade a submission with a numeric score and written comment
- [ ] **ASGN-06**: Student can see their grade and feedback after the instructor grades

## v2 Requirements

### Notifications

- **NOTF-01**: Student receives notification when new assignment is posted
- **NOTF-02**: Student receives notification when assignment is graded
- **NOTF-03**: Student receives notification when enrollment period opens

### Grade Book

- **GRADE-01**: Student can view all grades across all subjects in one place
- **GRADE-02**: Instructor can view grade summary per subject

## Out of Scope

| Feature | Reason |
|---------|--------|
| Student self-registration | Admin creates all student accounts |
| Timetable/weekly schedule view | Semester subject list is sufficient for v1 |
| Assignment auto-grading / rubrics | Manual grading only in v1 |
| Grade book / transcript | Per-assignment grades sufficient for v1 |
| Real-time notifications | Deferred; polling acceptable for v1 |

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
| ENRL-01 | Phase 3 | Pending |
| ENRL-02 | Phase 3 | Pending |
| ENRL-03 | Phase 3 | Complete |
| ENRL-04 | Phase 3 | Complete |
| SCHED-01 | Phase 4 | Pending |
| ASGN-01 | Phase 5 | Pending |
| ASGN-02 | Phase 5 | Pending |
| ASGN-03 | Phase 5 | Pending |
| ASGN-04 | Phase 5 | Pending |
| ASGN-05 | Phase 5 | Pending |
| ASGN-06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-03-18*
*Last updated: 2026-03-18 — traceability confirmed after roadmap creation*
