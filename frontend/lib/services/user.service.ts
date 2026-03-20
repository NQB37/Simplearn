import axiosInstance from '@/api/axios.api';

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

export type Sex = 'male' | 'female' | 'other' | '';
export type FormOfStudy = 'full-time' | 'part-time' | 'online' | 'hybrid' | '';
export type TypeOfStudy = 'bachelor' | 'master' | 'phd' | 'associate' | 'certificate' | '';

export interface ExtendedProfile {
  dateOfBirth?: string;
  sex?: Sex;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  studentData?: {
    formOfStudy?: FormOfStudy;
    facultyId?: string;
    majorId?: string;
    typeOfStudy?: TypeOfStudy;
    startYear?: number;
  };
  instructorData?: {
    facultyId?: string;
    majorId?: string;
  };
}

export interface Faculty {
  _id: string;
  name: string;
}

export interface Major {
  _id: string;
  name: string;
  facultyId: string;
}

export interface CreateStudentPayload {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
  };
  picture?: string;
  studentData?: {
    formOfStudy?: FormOfStudy;
    facultyId?: string;
    majorId?: string;
    typeOfStudy?: TypeOfStudy;
    startYear?: number;
  };
}

export const userService = {
  // Own extended profile
  getExtendedProfile: async (): Promise<ExtendedProfile> => {
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/users/profile/extended`);
    return data.profile;
  },
  updateExtendedProfile: async (payload: ExtendedProfile): Promise<ExtendedProfile> => {
    const { data } = await axiosInstance.patch(`${AUTH_BASE_URL}/api/users/profile/extended`, payload);
    return data.profile;
  },

  // Admin: manage any user's extended profile
  getUserProfile: async (userId: string): Promise<ExtendedProfile> => {
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/admin/users/${userId}/profile`);
    return data.profile;
  },
  updateUserProfile: async (userId: string, payload: ExtendedProfile): Promise<ExtendedProfile> => {
    const { data } = await axiosInstance.patch(`${AUTH_BASE_URL}/api/admin/users/${userId}/profile`, payload);
    return data.profile;
  },

  // Vocabulary: Faculties
  getFaculties: async (): Promise<Faculty[]> => {
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/admin/vocabulary/fields`);
    return data;
  },
  createFaculty: async (name: string): Promise<Faculty> => {
    const { data } = await axiosInstance.post(`${AUTH_BASE_URL}/api/admin/vocabulary/fields`, { name });
    return data;
  },
  deleteFaculty: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${AUTH_BASE_URL}/api/admin/vocabulary/fields/${id}`);
  },

  // Vocabulary: Majors
  getMajors: async (facultyId?: string): Promise<Major[]> => {
    const params = facultyId ? { facultyId } : {};
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/admin/vocabulary/majors`, { params });
    return data;
  },
  createMajor: async (name: string, facultyId: string): Promise<Major> => {
    const { data } = await axiosInstance.post(`${AUTH_BASE_URL}/api/admin/vocabulary/majors`, { name, facultyId });
    return data;
  },
  deleteMajor: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${AUTH_BASE_URL}/api/admin/vocabulary/majors/${id}`);
  },

  // Admin: update user status
  updateUserStatus: async (userId: string, status: string) => {
    const { data } = await axiosInstance.patch(`${AUTH_BASE_URL}/api/admin/users/${userId}/status`, { status });
    return data;
  },

  // Admin: create student account
  createStudent: async (payload: CreateStudentPayload) => {
    const { data } = await axiosInstance.post(`${AUTH_BASE_URL}/api/admin/users`, payload);
    return data;
  },
};
