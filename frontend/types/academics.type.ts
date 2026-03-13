export interface AcademicYear {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
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

export interface ClassModel {
  _id: string;
  code: string;
  roomId: Room | string;
  subjectId: Subject | string;
  academicYearId: AcademicYear | string;
  maxCapacity: number;
  status: 'active' | 'inactive' | 'archived';
}
