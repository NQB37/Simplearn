import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import * as profileService from './profile.service.js';
import { Profile } from '../models/profile.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Major } from '../models/major.model.js';

vi.mock('../models/profile.model.js', () => ({
  Profile: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock('../models/faculty.model.js', () => ({
  Faculty: {
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock('../models/major.model.js', () => ({
  Major: {
    find: vi.fn(),
    create: vi.fn(),
    findByIdAndDelete: vi.fn(),
    exists: vi.fn(),
  },
}));

const userId = new mongoose.Types.ObjectId().toString();

describe('ProfileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfileByUserId', () => {
    it('should return null when no profile exists', async () => {
      (Profile.findOne as any).mockReturnValue({ lean: () => null });
      const result = await profileService.getProfileByUserId(userId);
      expect(result).toBeNull();
      expect(Profile.findOne).toHaveBeenCalledWith({ userId });
    });

    it('should return profile when it exists', async () => {
      const mockProfile = { userId, sex: 'male' };
      (Profile.findOne as any).mockReturnValue({ lean: () => mockProfile });
      const result = await profileService.getProfileByUserId(userId);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should call findOneAndUpdate with upsert: true', async () => {
      const mockProfile = { userId, sex: 'female' };
      (Profile.findOneAndUpdate as any).mockReturnValue({ lean: () => mockProfile });

      const result = await profileService.updateProfile(userId, { sex: 'female' });

      expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ userId: expect.any(mongoose.Types.ObjectId) }),
        { $set: { sex: 'female' } },
        { upsert: true, new: true, runValidators: true },
      );
      expect(result).toEqual(mockProfile);
    });

    it('should include only provided fields in $set', async () => {
      (Profile.findOneAndUpdate as any).mockReturnValue({ lean: () => ({}) });

      await profileService.updateProfile(userId, { phone: '+84 123' });

      const callArgs = (Profile.findOneAndUpdate as any).mock.calls[0];
      expect(callArgs[1].$set).toEqual({ phone: '+84 123' });
      expect(callArgs[1].$set.sex).toBeUndefined();
    });
  });

  describe('vocabulary management', () => {
    it('getAllFaculties should call find with sort', async () => {
      (Faculty.find as any).mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: () => [] }) });
      await profileService.getAllFaculties();
      expect(Faculty.find).toHaveBeenCalled();
    });

    it('createFaculty should call create', async () => {
      (Faculty.create as any).mockResolvedValue({ name: 'Engineering' });
      const result = await profileService.createFaculty('Engineering');
      expect(Faculty.create).toHaveBeenCalledWith({ name: 'Engineering' });
      expect(result).toEqual({ name: 'Engineering' });
    });

    it('deleteFaculty should throw if majors exist', async () => {
      (Major.exists as any).mockResolvedValue(true);
      await expect(profileService.deleteFaculty('someId')).rejects.toThrow(
        'Cannot delete: remove dependent majors first.',
      );
    });

    it('deleteFaculty should delete when no majors exist', async () => {
      (Major.exists as any).mockResolvedValue(false);
      (Faculty.findByIdAndDelete as any).mockResolvedValue({ name: 'Engineering' });
      const result = await profileService.deleteFaculty('someId');
      expect(Faculty.findByIdAndDelete).toHaveBeenCalledWith('someId');
      expect(result).toEqual({ name: 'Engineering' });
    });

    it('createMajor should call create with correct args', async () => {
      (Major.create as any).mockResolvedValue({ name: 'Software Engineering', facultyId: 'fid' });
      const result = await profileService.createMajor('Software Engineering', 'fid');
      expect(Major.create).toHaveBeenCalledWith({ name: 'Software Engineering', facultyId: 'fid' });
      expect(result).toEqual({ name: 'Software Engineering', facultyId: 'fid' });
    });

    it('getMajorsByFaculty with facultyId should filter by faculty', async () => {
      (Major.find as any).mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: () => [] }) });
      await profileService.getMajorsByFaculty('fid');
      expect(Major.find).toHaveBeenCalledWith({ facultyId: 'fid' });
    });

    it('getMajorsByFaculty without facultyId should return all majors', async () => {
      (Major.find as any).mockReturnValue({ sort: vi.fn().mockReturnValue({ lean: () => [] }) });
      await profileService.getMajorsByFaculty();
      expect(Major.find).toHaveBeenCalledWith({});
    });
  });
});
