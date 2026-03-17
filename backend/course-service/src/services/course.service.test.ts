import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as courseService from './course.service.js';
import Course from '../models/course.model.js';

vi.mock('../models/course.model.js', () => {
  const mockModel: any = vi.fn().mockImplementation((data: any) => ({
    ...data,
    save: vi.fn().mockResolvedValue({ _id: 'new-id', ...data }),
  }));
  mockModel.find = vi.fn();
  mockModel.findOne = vi.fn();
  mockModel.findByIdAndUpdate = vi.fn();
  mockModel.findByIdAndDelete = vi.fn();
  return { default: mockModel };
});

describe('Course Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should return all courses sorted by createdAt descending', async () => {
      const mockCourses = [
        { _id: '1', title: 'Course A', slug: 'course-a' },
        { _id: '2', title: 'Course B', slug: 'course-b' },
      ];
      (Course.find as any).mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockCourses),
      });

      const result = await courseService.getCourses();

      expect(Course.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getCourseBySlug', () => {
    it('should return a course by slug', async () => {
      const mockCourse = { _id: '1', title: 'Course A', slug: 'course-a' };
      (Course.findOne as any).mockResolvedValue(mockCourse);

      const result = await courseService.getCourseBySlug('course-a');

      expect(Course.findOne).toHaveBeenCalledWith({ slug: 'course-a' });
      expect(result).toEqual(mockCourse);
    });

    it('should return null when course not found', async () => {
      (Course.findOne as any).mockResolvedValue(null);

      const result = await courseService.getCourseBySlug('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createCourse', () => {
    it('should create and return a new course', async () => {
      const data = {
        title: 'New Course',
        slug: 'new-course',
        description: 'A description',
        subjectId: 'subject-123',
        instructorId: 'instructor-456',
      };
      const savedCourse = { _id: 'new-id', ...data, status: 'draft' };

      const saveMock = vi.fn().mockResolvedValue(savedCourse);
      (Course as any).mockImplementation(function (this: any, d: any) {
        Object.assign(this, d);
        this.save = saveMock;
      });

      const result = await courseService.createCourse(data);

      expect(Course).toHaveBeenCalledWith(data);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(savedCourse);
    });
  });

  describe('updateCourse', () => {
    it('should update and return the course', async () => {
      const updatedCourse = {
        _id: '1',
        title: 'Updated Title',
        slug: 'course-a',
        status: 'published',
      };
      (Course.findByIdAndUpdate as any).mockResolvedValue(updatedCourse);

      const result = await courseService.updateCourse('1', {
        title: 'Updated Title',
        status: 'published',
      });

      expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { title: 'Updated Title', status: 'published' },
        { new: true },
      );
      expect(result).toEqual(updatedCourse);
    });

    it('should return null when course not found', async () => {
      (Course.findByIdAndUpdate as any).mockResolvedValue(null);

      const result = await courseService.updateCourse('nonexistent', {
        title: 'Updated',
      });

      expect(result).toBeNull();
    });
  });

  describe('deleteCourse', () => {
    it('should delete and return the deleted course', async () => {
      const deletedCourse = { _id: '1', title: 'Course A', slug: 'course-a' };
      (Course.findByIdAndDelete as any).mockResolvedValue(deletedCourse);

      const result = await courseService.deleteCourse('1');

      expect(Course.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual(deletedCourse);
    });

    it('should return null when course not found', async () => {
      (Course.findByIdAndDelete as any).mockResolvedValue(null);

      const result = await courseService.deleteCourse('nonexistent');

      expect(result).toBeNull();
    });
  });
});
