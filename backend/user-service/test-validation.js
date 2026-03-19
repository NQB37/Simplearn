import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
}).optional();

const studentDataSchema = z.object({
  formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid']).optional(),
  fieldOfStudyId: z.string().optional(),
  majorId: z.string().optional(),
  typeOfStudy: z.enum(['bachelor', 'master', 'phd', 'associate', 'certificate']).optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
});

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  address: addressSchema,
  picture: z.string().url().optional(),
  studentData: studentDataSchema.optional(),
});

const payload = {
  firstName: "Test",
  lastName: "Student",
  email: "test.student@simplearn.com"
};

async function test() {
  try {
    const validatedData = await createUserSchema.parseAsync(payload);
    console.log("Success:", validatedData);
  } catch (err) {
    console.error("Error length:", err.issues?.length);
    console.error(err.issues);
  }
}

test();
