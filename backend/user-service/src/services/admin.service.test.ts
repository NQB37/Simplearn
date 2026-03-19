import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import * as adminService from './admin.service.js';
import { User } from '../models/user.model.js';

vi.mock('../models/user.model.js', () => ({
  User: {
    aggregate: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock('../models/profile.model.js', () => ({
  Profile: {
    findOneAndUpdate: vi.fn(),
  },
}));

const fid = new mongoose.Types.ObjectId();
const mid = new mongoose.Types.ObjectId();

const makeUser = (overrides: Record<string, any> = {}) => ({
  id: new mongoose.Types.ObjectId().toString(),
  email: 'student@test.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'STUDENT',
  status: 'ACTIVE',
  createdAt: new Date(),
  picture: null,
  studentData: {
    formOfStudy: 'full-time',
    typeOfStudy: 'bachelor',
    startYear: 2024,
    fieldOfStudyId: { _id: fid, name: 'Computer Science' },
    majorId: { _id: mid, name: 'Software Engineering' },
  },
  ...overrides,
});

describe('adminService.getAllUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns aggregation results with no filters', async () => {
    const mockUsers = [makeUser()];
    (User.aggregate as any).mockResolvedValue(mockUsers);

    const result = await adminService.getAllUsers();

    expect(User.aggregate).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUsers);
  });

  it('passes role filter as uppercase in the match stage', async () => {
    (User.aggregate as any).mockResolvedValue([]);

    await adminService.getAllUsers({ role: 'student' });

    const pipeline = (User.aggregate as any).mock.calls[0][0];
    const matchStage = pipeline.find((s: any) => s.$match);
    expect(matchStage.$match.role).toBe('STUDENT');
  });

  it('does not include role in match when not provided', async () => {
    (User.aggregate as any).mockResolvedValue([]);

    await adminService.getAllUsers({});

    const pipeline = (User.aggregate as any).mock.calls[0][0];
    const matchStage = pipeline.find((s: any) => s.$match);
    expect(matchStage.$match.role).toBeUndefined();
  });

  it('filters by typeOfStudy post-aggregation', async () => {
    const users = [makeUser(), makeUser({ studentData: { typeOfStudy: 'master' } })];
    (User.aggregate as any).mockResolvedValue(users);

    const result = await adminService.getAllUsers({ typeOfStudy: 'bachelor' });

    expect(result).toHaveLength(1);
    expect(result[0].studentData.typeOfStudy).toBe('bachelor');
  });

  it('filters by startYear post-aggregation', async () => {
    const users = [makeUser(), makeUser({ studentData: { startYear: 2023, typeOfStudy: 'bachelor' } })];
    (User.aggregate as any).mockResolvedValue(users);

    const result = await adminService.getAllUsers({ startYear: '2024' });

    expect(result).toHaveLength(1);
    expect(result[0].studentData.startYear).toBe(2024);
  });

  it('filters by fieldOfStudyId post-aggregation', async () => {
    const otherId = new mongoose.Types.ObjectId();
    const users = [
      makeUser(),
      makeUser({ studentData: { fieldOfStudyId: { _id: otherId, name: 'Physics' } } }),
    ];
    (User.aggregate as any).mockResolvedValue(users);

    const result = await adminService.getAllUsers({ fieldOfStudyId: fid.toString() });

    expect(result).toHaveLength(1);
    expect(result[0].studentData.fieldOfStudyId._id.toString()).toBe(fid.toString());
  });

  it('filters by majorId post-aggregation', async () => {
    const otherId = new mongoose.Types.ObjectId();
    const users = [
      makeUser(),
      makeUser({ studentData: { majorId: { _id: otherId, name: 'Physics Major' } } }),
    ];
    (User.aggregate as any).mockResolvedValue(users);

    const result = await adminService.getAllUsers({ majorId: mid.toString() });

    expect(result).toHaveLength(1);
    expect(result[0].studentData.majorId._id.toString()).toBe(mid.toString());
  });

  it('returns empty array when aggregate returns empty', async () => {
    (User.aggregate as any).mockResolvedValue([]);

    const result = await adminService.getAllUsers({ role: 'ADMIN' });

    expect(result).toEqual([]);
  });

  it('keeps users with no studentData when filtering by typeOfStudy', async () => {
    const users = [makeUser({ role: 'ADMIN', studentData: undefined }), makeUser()];
    (User.aggregate as any).mockResolvedValue(users);

    const result = await adminService.getAllUsers({ typeOfStudy: 'bachelor' });

    // Admin user has no studentData, should be excluded since typeOfStudy doesn't match
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('STUDENT');
  });

  it('fieldOfStudyId filter matches instructorData as well', async () => {
    const instructorUser = makeUser({
      role: 'INSTRUCTOR',
      studentData: undefined,
      instructorData: { fieldOfStudyId: { _id: fid, name: 'Computer Science' } },
    });
    (User.aggregate as any).mockResolvedValue([instructorUser]);

    const result = await adminService.getAllUsers({ fieldOfStudyId: fid.toString() });

    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('INSTRUCTOR');
  });
});
