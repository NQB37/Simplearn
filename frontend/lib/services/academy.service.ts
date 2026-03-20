import axiosInstance from '@/api/axios.api';
import { AcademicYear, Room, Subject, SubjectWithCurriculum, ClassModel, EligibleSubjectsResponse, Enrollment, MajorSubject, Semester, TypeOfStudy, BulkSubjectRow, BulkImportResult } from '@/types/academics.type';

interface SubjectCurriculumFields {
  majorId?: string;
  studyYear?: number;
  semester?: Semester;
  isMandatory?: boolean;
  typeOfStudy?: TypeOfStudy;
}

const ACADEMY_BASE_URL = process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL;

export const academyService = {
  // Academic Years
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/academy/academic-years`);
    return data;
  },
  createAcademicYear: async (payload: Omit<AcademicYear, '_id'>) => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/academic-years`, payload);
    return data;
  },
  updateAcademicYear: async (id: string, payload: Partial<AcademicYear>) => {
    const { data } = await axiosInstance.put(`${ACADEMY_BASE_URL}/api/academy/academic-years/${id}`, payload);
    return data;
  },
  deleteAcademicYear: async (id: string) => {
    const { data } = await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/academy/academic-years/${id}`);
    return data;
  },

  // Rooms
  getRooms: async (): Promise<Room[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/academy/rooms`);
    return data;
  },
  createRoom: async (payload: Omit<Room, '_id'>) => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/rooms`, payload);
    return data;
  },
  updateRoom: async (id: string, payload: Partial<Room>) => {
    const { data } = await axiosInstance.put(`${ACADEMY_BASE_URL}/api/academy/rooms/${id}`, payload);
    return data;
  },
  deleteRoom: async (id: string) => {
    const { data } = await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/academy/rooms/${id}`);
    return data;
  },

  // Subjects
  getSubjects: async (): Promise<SubjectWithCurriculum[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/academy/subjects`);
    return data;
  },
  createSubject: async (payload: Omit<Subject, '_id'> & SubjectCurriculumFields) => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/subjects`, payload);
    return data;
  },
  updateSubject: async (id: string, payload: Partial<Subject> & SubjectCurriculumFields) => {
    const { data } = await axiosInstance.put(`${ACADEMY_BASE_URL}/api/academy/subjects/${id}`, payload);
    return data;
  },
  deleteSubject: async (id: string) => {
    const { data } = await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/academy/subjects/${id}`);
    return data;
  },
  bulkCreateSubjects: async (subjects: BulkSubjectRow[]): Promise<BulkImportResult> => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/subjects/bulk`, { subjects });
    return data;
  },

  // Enrollments
  getEligibleSubjects: async (): Promise<EligibleSubjectsResponse> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/v1/enrollments/eligible`);
    return data;
  },
  bulkEnroll: async (subjectIds: string[], academicYearId: string): Promise<void> => {
    await axiosInstance.post(`${ACADEMY_BASE_URL}/api/v1/enrollments/bulk`, { subjectIds, academicYearId });
  },
  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/v1/enrollments/me`);
    return data;
  },

  // Curriculum
  getCurriculum: async (majorId: string, typeOfStudy?: string): Promise<MajorSubject[]> => {
    const params = typeOfStudy ? { typeOfStudy } : {};
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/v1/curriculum/${majorId}`, { params });
    return data;
  },
  addCurriculumEntry: async (payload: {
    majorId: string;
    subjectId: string;
    studyYear: number;
    semester: 'first' | 'second' | 'summer';
    isMandatory?: boolean;
  }): Promise<MajorSubject> => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/v1/curriculum`, payload);
    return data;
  },
  deleteCurriculumEntry: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/v1/curriculum/${id}`);
  },

  // Classes
  getClasses: async (): Promise<ClassModel[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/academy/classes`);
    return data;
  },
  createClass: async (payload: Omit<ClassModel, '_id'>) => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/classes`, payload);
    return data;
  },
  updateClass: async (id: string, payload: Partial<ClassModel>) => {
    const { data } = await axiosInstance.put(`${ACADEMY_BASE_URL}/api/academy/classes/${id}`, payload);
    return data;
  },
  deleteClass: async (id: string) => {
    const { data } = await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/academy/classes/${id}`);
    return data;
  },
};
