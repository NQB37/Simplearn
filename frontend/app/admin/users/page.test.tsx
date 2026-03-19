import { describe, it, expect } from 'vitest';
import { filterUsers, type User } from './page';

const makeUser = (overrides: Partial<User> & { role: string }): User => ({
  id: '1',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  status: 'ACTIVE',
  createdAt: '2024-01-01',
  ...overrides,
});

const adminUser = makeUser({ id: 'a1', role: 'ADMIN', firstName: 'Admin', lastName: 'One', email: 'admin@example.com' });

const instructorA = makeUser({
  id: 'i1',
  role: 'INSTRUCTOR',
  firstName: 'Bob',
  lastName: 'Jones',
  email: 'bob@example.com',
  instructorData: {
    fieldOfStudyId: { _id: 'field1', name: 'Computer Science' },
    majorId: { _id: 'major1', name: 'Software Engineering' },
  },
});

const instructorB = makeUser({
  id: 'i2',
  role: 'INSTRUCTOR',
  firstName: 'Carol',
  lastName: 'White',
  email: 'carol@example.com',
  instructorData: {
    fieldOfStudyId: { _id: 'field2', name: 'Mathematics' },
    majorId: { _id: 'major2', name: 'Pure Math' },
  },
});

const studentA = makeUser({
  id: 's1',
  role: 'STUDENT',
  firstName: 'Dave',
  lastName: 'Brown',
  email: 'dave@example.com',
  studentData: {
    fieldOfStudyId: { _id: 'field1', name: 'Computer Science' },
    majorId: { _id: 'major1', name: 'Software Engineering' },
    typeOfStudy: 'bachelor',
    startYear: 2022,
  },
});

const studentB = makeUser({
  id: 's2',
  role: 'STUDENT',
  firstName: 'Eve',
  lastName: 'Green',
  email: 'eve@example.com',
  studentData: {
    fieldOfStudyId: { _id: 'field2', name: 'Mathematics' },
    majorId: { _id: 'major2', name: 'Pure Math' },
    typeOfStudy: 'master',
    startYear: 2023,
  },
});

const allUsers = [adminUser, instructorA, instructorB, studentA, studentB];

describe('filterUsers — role partitioning', () => {
  it('returns only ADMIN users for the admin role', () => {
    const result = filterUsers(allUsers, {}, 'ADMIN');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('returns only INSTRUCTOR users for the instructor role', () => {
    const result = filterUsers(allUsers, {}, 'INSTRUCTOR');
    expect(result).toHaveLength(2);
    expect(result.map((u) => u.id)).toEqual(['i1', 'i2']);
  });

  it('returns only STUDENT users for the student role', () => {
    const result = filterUsers(allUsers, {}, 'STUDENT');
    expect(result).toHaveLength(2);
    expect(result.map((u) => u.id)).toEqual(['s1', 's2']);
  });
});

describe('filterUsers — search', () => {
  it('filters by first name (case-insensitive)', () => {
    const result = filterUsers(allUsers, { search: 'bob' }, 'INSTRUCTOR');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('i1');
  });

  it('filters by last name', () => {
    const result = filterUsers(allUsers, { search: 'Green' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('filters by email', () => {
    const result = filterUsers(allUsers, { search: 'dave@' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  it('returns empty array when search matches nothing', () => {
    const result = filterUsers(allUsers, { search: 'zzzzzz' }, 'STUDENT');
    expect(result).toHaveLength(0);
  });

  it('returns all when search is empty string', () => {
    const result = filterUsers(allUsers, { search: '' }, 'STUDENT');
    expect(result).toHaveLength(2);
  });
});

describe('filterUsers — instructor field/major filters', () => {
  it('filters instructors by fieldOfStudyId', () => {
    const result = filterUsers(allUsers, { fieldOfStudyId: 'field1' }, 'INSTRUCTOR');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('i1');
  });

  it('filters instructors by majorId', () => {
    const result = filterUsers(allUsers, { majorId: 'major2' }, 'INSTRUCTOR');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('i2');
  });

  it('returns empty when field filter matches nothing', () => {
    const result = filterUsers(allUsers, { fieldOfStudyId: 'field999' }, 'INSTRUCTOR');
    expect(result).toHaveLength(0);
  });

  it('does not apply fieldOfStudy filter to ADMIN tab', () => {
    const result = filterUsers(allUsers, { fieldOfStudyId: 'field1' }, 'ADMIN');
    expect(result).toHaveLength(1); // only the one admin, unaffected by the filter
  });
});

describe('filterUsers — student field/major/typeOfStudy/startYear filters', () => {
  it('filters students by fieldOfStudyId', () => {
    const result = filterUsers(allUsers, { fieldOfStudyId: 'field2' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('filters students by majorId', () => {
    const result = filterUsers(allUsers, { majorId: 'major1' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  it('filters students by typeOfStudy', () => {
    const result = filterUsers(allUsers, { typeOfStudy: 'bachelor' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  it('filters students by startYear as string', () => {
    const result = filterUsers(allUsers, { startYear: '2023' }, 'STUDENT');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s2');
  });

  it('returns empty when typeOfStudy filter matches nothing', () => {
    const result = filterUsers(allUsers, { typeOfStudy: 'phd' }, 'STUDENT');
    expect(result).toHaveLength(0);
  });

  it('does not apply typeOfStudy filter to INSTRUCTOR tab', () => {
    const result = filterUsers(allUsers, { typeOfStudy: 'bachelor' }, 'INSTRUCTOR');
    // both instructors should be returned since typeOfStudy is student-only
    expect(result).toHaveLength(2);
  });
});

describe('filterUsers — combined filters', () => {
  it('combines search and fieldOfStudyId for students', () => {
    const result = filterUsers(
      allUsers,
      { search: 'dave', fieldOfStudyId: 'field1' },
      'STUDENT',
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });

  it('returns empty when combined filters produce no match', () => {
    const result = filterUsers(
      allUsers,
      { search: 'dave', fieldOfStudyId: 'field2' },
      'STUDENT',
    );
    expect(result).toHaveLength(0);
  });

  it('combines all four student filters', () => {
    const result = filterUsers(
      allUsers,
      {
        fieldOfStudyId: 'field1',
        majorId: 'major1',
        typeOfStudy: 'bachelor',
        startYear: '2022',
      },
      'STUDENT',
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('s1');
  });
});
