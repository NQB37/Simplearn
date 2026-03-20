export type Semester = 'first' | 'second' | 'summer';
export type TypeOfStudy = 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate';

export const STUDY_YEAR_LIMITS: Record<TypeOfStudy, number> = {
  bachelor: 3,
  master: 2,
  phd: 4,
  associate: 3,
  certificate: 1,
};

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

export interface SubjectWithCurriculum extends Subject {
  curriculum?: {
    _id: string;
    majorId: string;
    studyYear: number;
    semester: Semester;
    isMandatory: boolean;
    typeOfStudy?: TypeOfStudy;
  }[];
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

export interface BulkSubjectRow {
  name: string;
  code: string;
  credits: number;
  majorId?: string;
  typeOfStudy?: TypeOfStudy;
  studyYear?: number;
  semester?: Semester;
}

export interface BulkImportResult {
  created: number;
  skipped: number;
  errors: { row: number; code: string; reason: string }[];
}
