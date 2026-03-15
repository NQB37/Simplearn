import axiosInstance from '@/api/axios.api';
import { AcademicYear, Room, Subject, ClassModel } from '@/types/academics.type';

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
  getSubjects: async (): Promise<Subject[]> => {
    const { data } = await axiosInstance.get(`${ACADEMY_BASE_URL}/api/academy/subjects`);
    return data;
  },
  createSubject: async (payload: Omit<Subject, '_id'>) => {
    const { data } = await axiosInstance.post(`${ACADEMY_BASE_URL}/api/academy/subjects`, payload);
    return data;
  },
  updateSubject: async (id: string, payload: Partial<Subject>) => {
    const { data } = await axiosInstance.put(`${ACADEMY_BASE_URL}/api/academy/subjects/${id}`, payload);
    return data;
  },
  deleteSubject: async (id: string) => {
    const { data } = await axiosInstance.delete(`${ACADEMY_BASE_URL}/api/academy/subjects/${id}`);
    return data;
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
