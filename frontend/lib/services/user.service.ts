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
    fieldOfStudyId?: string;
    majorId?: string;
    typeOfStudy?: TypeOfStudy;
    startYear?: number;
  };
  instructorData?: {
    fieldOfStudyId?: string;
    majorId?: string;
  };
}

export interface FieldOfStudy {
  _id: string;
  name: string;
}

export interface Major {
  _id: string;
  name: string;
  fieldOfStudyId: string;
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

  // Vocabulary: Fields of Study
  getFieldsOfStudy: async (): Promise<FieldOfStudy[]> => {
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/admin/vocabulary/fields`);
    return data;
  },
  createFieldOfStudy: async (name: string): Promise<FieldOfStudy> => {
    const { data } = await axiosInstance.post(`${AUTH_BASE_URL}/api/admin/vocabulary/fields`, { name });
    return data;
  },
  deleteFieldOfStudy: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${AUTH_BASE_URL}/api/admin/vocabulary/fields/${id}`);
  },

  // Vocabulary: Majors
  getMajors: async (fieldOfStudyId?: string): Promise<Major[]> => {
    const params = fieldOfStudyId ? { fieldOfStudyId } : {};
    const { data } = await axiosInstance.get(`${AUTH_BASE_URL}/api/admin/vocabulary/majors`, { params });
    return data;
  },
  createMajor: async (name: string, fieldOfStudyId: string): Promise<Major> => {
    const { data } = await axiosInstance.post(`${AUTH_BASE_URL}/api/admin/vocabulary/majors`, { name, fieldOfStudyId });
    return data;
  },
  deleteMajor: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${AUTH_BASE_URL}/api/admin/vocabulary/majors/${id}`);
  },
};
