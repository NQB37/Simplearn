export type Semester = 'first' | 'second' | 'summer';

export interface AcademicYear {
  _id: string;
  name: string;
  semester: Semester;
  startDate: string;
  endDate: string;
  enrollmentDeadline?: string;
  isActive: boolean;
}

export interface Room {
  _id: string;
  name: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
}

export interface MajorSubject {
  _id: string;
  majorId: string;
  subjectId: Subject;
  studyYear: number;
  semester: 'first' | 'second' | 'summer';
  isMandatory: boolean;
}

export interface EligibleSubjectsResponse {
  enrollmentDeadline: string | null;
  academicYearId: string;
  subjects: MajorSubject[];
}

export interface Enrollment {
  _id: string;
  userId: string;
  subjectId: Subject;
  academicYearId: AcademicYear;
  createdAt: string;
}

export interface ClassModel {
  _id: string;
  code: string;
  roomId: Room | string;
  subjectId: Subject | string;
  academicYearId: AcademicYear | string;
  maxCapacity: number;
  status: 'active' | 'inactive' | 'archived';
}
