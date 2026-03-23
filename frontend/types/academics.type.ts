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
  enrollmentStartDate?: string;
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
  optional?: boolean;
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

export interface PopulatedClass {
  _id: string;
  code: string;
  roomId: Room;
  subjectId: Subject;
  instructorId?: string;
  academicYearId: string;
  schedules: ClassSchedule[];
  maxCapacity: number;
  currentEnrollments: number;
  status: 'active' | 'inactive' | 'archived';
}

export interface Enrollment {
  _id: string;
  userId: string;
  classId: PopulatedClass;
  subjectId: Subject;
  academicYearId: AcademicYear;
  createdAt: string;
}

export interface ClassSchedule {
  dayOfWeek: number;
  shiftId: number;
}

export interface ClassModel {
  _id: string;
  code: string;
  roomId: Room | string;
  subjectId: Subject | string;
  instructorId?: string;
  academicYearId: AcademicYear | string;
  schedules?: ClassSchedule[];
  maxCapacity: number;
  status: 'active' | 'inactive' | 'archived';
}

export interface GridCellData {
  free: boolean;
  classId?: string;
  classCode?: string;
  subjectName?: string;
}

export interface RoomGrid {
  roomId: string;
  roomName: string;
  capacity: number;
  grid: Record<number, Record<number, GridCellData>>;
  shifts: Array<{ shiftId: number; startTime: string; endTime: string }>;
  days: number[];
}

export interface BulkSubjectRow {
  name: string;
  code: string;
  credits: number;
  optional?: boolean;
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
