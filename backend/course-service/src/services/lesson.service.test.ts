import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as lessonService from './lesson.service.js';

const mockLesson = {
  _id: 'lesson-id-1',
  moduleId: 'module-id-1',
  title: 'Test Lesson',
  order: 0,
  contents: [],
};

vi.mock('../models/lesson.model.js', () => {
  const Lesson = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  };
  return { default: Lesson };
});

import Lesson from '../models/lesson.model.js';

describe('lesson.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLessons', () => {
    it('returns lessons sorted by order', async () => {
      const sortMock = vi.fn().mockResolvedValue([mockLesson]);
      (Lesson.find as any).mockReturnValue({ sort: sortMock });

      const result = await lessonService.getLessons('module-id-1');

      expect(Lesson.find).toHaveBeenCalledWith({ moduleId: 'module-id-1' });
      expect(sortMock).toHaveBeenCalledWith({ order: 1 });
      expect(result).toEqual([mockLesson]);
    });
  });

  describe('createLesson', () => {
    it('assigns order 0 when no existing lessons', async () => {
      const sortMock = vi.fn().mockResolvedValue(null);
      (Lesson.findOne as any).mockReturnValue({ sort: sortMock });
      (Lesson.create as any).mockResolvedValue({ ...mockLesson, order: 0 });

      const result = await lessonService.createLesson({
        moduleId: 'module-id-1',
        title: 'Test Lesson',
      });

      expect(Lesson.create).toHaveBeenCalledWith({
        moduleId: 'module-id-1',
        title: 'Test Lesson',
        order: 0,
        contents: [],
      });
      expect(result.order).toBe(0);
    });

    it('assigns order as last.order + 1 when lessons exist', async () => {
      const sortMock = vi.fn().mockResolvedValue({ order: 2 });
      (Lesson.findOne as any).mockReturnValue({ sort: sortMock });
      (Lesson.create as any).mockResolvedValue({ ...mockLesson, order: 3 });

      const result = await lessonService.createLesson({
        moduleId: 'module-id-1',
        title: 'New Lesson',
      });

      expect(Lesson.create).toHaveBeenCalledWith(
        expect.objectContaining({ order: 3 }),
      );
      expect(result.order).toBe(3);
    });

    it('creates lesson with empty contents array', async () => {
      const sortMock = vi.fn().mockResolvedValue(null);
      (Lesson.findOne as any).mockReturnValue({ sort: sortMock });
      (Lesson.create as any).mockResolvedValue(mockLesson);

      await lessonService.createLesson({ moduleId: 'module-id-1', title: 'Lesson' });

      expect(Lesson.create).toHaveBeenCalledWith(
        expect.objectContaining({ contents: [] }),
      );
    });
  });

  describe('updateLesson', () => {
    it('returns updated lesson', async () => {
      const updated = { ...mockLesson, title: 'Updated' };
      (Lesson.findByIdAndUpdate as any).mockResolvedValue(updated);

      const result = await lessonService.updateLesson('lesson-id-1', { title: 'Updated' });

      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        'lesson-id-1',
        { title: 'Updated' },
        { new: true },
      );
      expect(result).toEqual(updated);
    });

    it('returns null when lesson not found', async () => {
      (Lesson.findByIdAndUpdate as any).mockResolvedValue(null);

      const result = await lessonService.updateLesson('nonexistent', { title: 'X' });

      expect(result).toBeNull();
    });

    it('can update contents array', async () => {
      const contents = [{ _id: 'block-1', type: 'text' as const, body: 'Hello' }];
      const updated = { ...mockLesson, contents };
      (Lesson.findByIdAndUpdate as any).mockResolvedValue(updated);

      const result = await lessonService.updateLesson('lesson-id-1', { contents });

      expect(Lesson.findByIdAndUpdate).toHaveBeenCalledWith(
        'lesson-id-1',
        { contents },
        { new: true },
      );
      expect(result).toEqual(updated);
    });
  });

  describe('deleteLesson', () => {
    it('returns deleted lesson', async () => {
      (Lesson.findByIdAndDelete as any).mockResolvedValue(mockLesson);

      const result = await lessonService.deleteLesson('lesson-id-1');

      expect(Lesson.findByIdAndDelete).toHaveBeenCalledWith('lesson-id-1');
      expect(result).toEqual(mockLesson);
    });

    it('returns null when lesson not found', async () => {
      (Lesson.findByIdAndDelete as any).mockResolvedValue(null);

      const result = await lessonService.deleteLesson('nonexistent');

      expect(result).toBeNull();
    });
  });
});
