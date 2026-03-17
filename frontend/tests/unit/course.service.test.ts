import { describe, it, expect, vi, beforeEach } from 'vitest';
import { courseService } from '@/lib/services/course.service';

vi.mock('@/api/axios.api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import axiosInstance from '@/api/axios.api';

const mockAxios = axiosInstance as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const mockCourse = {
  _id: 'course-1',
  title: 'Test Course',
  slug: 'test-course',
  description: 'A test course description',
  subjectId: 'subject-1',
  instructorId: 'instructor-1',
  status: 'draft' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('courseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCourses returns array of courses', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: [mockCourse] });
    const result = await courseService.getCourses();
    expect(result).toEqual([mockCourse]);
    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/courses'),
    );
  });

  it('getCourseBySlug returns course from data.course', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { course: mockCourse } });
    const result = await courseService.getCourseBySlug('test-course');
    expect(result).toEqual(mockCourse);
    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/courses/test-course'),
    );
  });

  it('createCourse posts payload and returns data', async () => {
    const payload = {
      title: 'New Course',
      slug: 'new-course',
      description: 'A new course description',
      subjectId: 'subject-1',
    };
    mockAxios.post.mockResolvedValueOnce({ data: { course: mockCourse } });
    const result = await courseService.createCourse(payload);
    expect(result).toEqual({ course: mockCourse });
    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/courses'),
      payload,
    );
  });

  it('updateCourse puts to course id endpoint', async () => {
    mockAxios.put.mockResolvedValueOnce({ data: mockCourse });
    const result = await courseService.updateCourse('course-1', { title: 'Updated' });
    expect(result).toEqual(mockCourse);
    expect(mockAxios.put).toHaveBeenCalledWith(
      expect.stringContaining('/api/courses/course-1'),
      { title: 'Updated' },
    );
  });

  it('deleteCourse deletes by id and returns message', async () => {
    mockAxios.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });
    const result = await courseService.deleteCourse('course-1');
    expect(result).toEqual({ message: 'Deleted' });
    expect(mockAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/courses/course-1'),
    );
  });
});
