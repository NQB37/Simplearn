import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import { Profile } from './profile.model.js';

describe('Profile model', () => {
  it('should have the correct top-level schema fields', () => {
    const schemaPaths = Object.keys(Profile.schema.paths);
    expect(schemaPaths).toContain('userId');
    expect(schemaPaths).toContain('dateOfBirth');
    expect(schemaPaths).toContain('sex');
    expect(schemaPaths).toContain('phone');
  });

  it('should have nested address sub-schema fields', () => {
    const addressSchema = (Profile.schema.path('address') as any).schema;
    const addressPaths = Object.keys(addressSchema.paths);
    expect(addressPaths).toContain('street');
    expect(addressPaths).toContain('city');
    expect(addressPaths).toContain('country');
  });

  it('should have nested studentData sub-schema fields', () => {
    const studentSchema = (Profile.schema.path('studentData') as any).schema;
    const studentPaths = Object.keys(studentSchema.paths);
    expect(studentPaths).toContain('formOfStudy');
    expect(studentPaths).toContain('fieldOfStudyId');
    expect(studentPaths).toContain('majorId');
    expect(studentPaths).toContain('typeOfStudy');
    expect(studentPaths).toContain('startYear');
  });

  it('should have nested instructorData sub-schema fields', () => {
    const instructorSchema = (Profile.schema.path('instructorData') as any).schema;
    const instructorPaths = Object.keys(instructorSchema.paths);
    expect(instructorPaths).toContain('fieldOfStudyId');
    expect(instructorPaths).toContain('majorId');
  });

  it('should require userId', () => {
    const profile = new Profile({});
    const error = profile.validateSync();
    expect(error?.errors['userId']).toBeDefined();
  });

  it('should create a valid profile document', () => {
    const userId = new mongoose.Types.ObjectId();
    const profile = new Profile({
      userId,
      sex: 'male',
      phone: '+84 912 345 678',
      address: { street: '123 Main St', city: 'Hanoi', country: 'Vietnam' },
      studentData: { formOfStudy: 'full-time', startYear: 2023 },
    });
    const error = profile.validateSync();
    expect(error).toBeUndefined();
    expect(profile.userId.toString()).toBe(userId.toString());
  });

  it('should reject invalid sex enum value', () => {
    const profile = new Profile({
      userId: new mongoose.Types.ObjectId(),
      sex: 'unknown',
    });
    const error = profile.validateSync();
    expect(error?.errors['sex']).toBeDefined();
  });

  it('should reject invalid formOfStudy enum value', () => {
    const profile = new Profile({
      userId: new mongoose.Types.ObjectId(),
      studentData: { formOfStudy: 'invalid' },
    });
    const error = profile.validateSync();
    expect(error?.errors['studentData.formOfStudy']).toBeDefined();
  });
});
