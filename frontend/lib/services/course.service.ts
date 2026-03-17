import axiosInstance from '@/api/axios.api';
import { Course, CreateCoursePayload } from '@/types/course.type';

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
};
