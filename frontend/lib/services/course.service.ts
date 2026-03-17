import axiosInstance from '@/api/axios.api';
import { Course, CreateCoursePayload, Module } from '@/types/course.type';

const COURSE_BASE_URL = process.env.NEXT_PUBLIC_COURSE_SERVICE_URL;

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const { data } = await axiosInstance.get(`${COURSE_BASE_URL}/api/courses`);
    return data;
  },

  getCourseBySlug: async (slug: string): Promise<Course> => {
    const { data } = await axiosInstance.get(`${COURSE_BASE_URL}/api/courses/${slug}`);
    return data.course;
  },

  createCourse: async (payload: CreateCoursePayload): Promise<{ course: Course }> => {
    const { data } = await axiosInstance.post(`${COURSE_BASE_URL}/api/courses`, payload);
    return data;
  },

  updateCourse: async (id: string, payload: Partial<Course>): Promise<Course> => {
    const { data } = await axiosInstance.put(`${COURSE_BASE_URL}/api/courses/${id}`, payload);
    return data;
  },

  deleteCourse: async (id: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.delete(`${COURSE_BASE_URL}/api/courses/${id}`);
    return data;
  },

  // Module methods
  getModules: async (courseId: string): Promise<Module[]> => {
    const { data } = await axiosInstance.get(`${COURSE_BASE_URL}/api/courses/${courseId}/modules`);
    return data.modules;
  },

  createModule: async (courseId: string, title: string): Promise<Module> => {
    const { data } = await axiosInstance.post(`${COURSE_BASE_URL}/api/courses/${courseId}/modules`, { title });
    return data.module;
  },

  updateModule: async (courseId: string, moduleId: string, data: { title: string }): Promise<Module> => {
    const { data: response } = await axiosInstance.put(`${COURSE_BASE_URL}/api/courses/${courseId}/modules/${moduleId}`, data);
    return response.module;
  },

  deleteModule: async (courseId: string, moduleId: string): Promise<void> => {
    await axiosInstance.delete(`${COURSE_BASE_URL}/api/courses/${courseId}/modules/${moduleId}`);
  },

  reorderModules: async (courseId: string, orderedIds: string[]): Promise<Module[]> => {
    const { data } = await axiosInstance.put(`${COURSE_BASE_URL}/api/courses/${courseId}/modules/reorder`, { orderedIds });
    return data.modules;
  },
};
