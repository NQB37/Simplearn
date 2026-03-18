import { z } from 'zod';

const studentDataSchema = z.object({
  formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid']).optional(),
  fieldOfStudyId: z.string().optional(),
  majorId: z.string().optional(),
  typeOfStudy: z.enum(['bachelor', 'master', 'phd', 'associate', 'certificate']).optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  studentData: studentDataSchema.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
