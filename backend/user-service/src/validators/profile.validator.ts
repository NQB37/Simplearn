import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const studentDataSchema = z.object({
  formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid']).optional(),
  fieldOfStudyId: z.string().optional(),
  majorId: z.string().optional(),
  typeOfStudy: z.enum(['bachelor', 'master', 'phd', 'associate', 'certificate']).optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
});

const instructorDataSchema = z.object({
  fieldOfStudyId: z.string().optional(),
  majorId: z.string().optional(),
});

export const updateProfileSchema = z.object({
  dateOfBirth: z.string().datetime({ offset: true }).optional().or(z.literal('')),
  sex: z.enum(['male', 'female', 'other']).optional(),
  phone: z.string().optional(),
  address: addressSchema.optional(),
  studentData: studentDataSchema.optional(),
  instructorData: instructorDataSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
