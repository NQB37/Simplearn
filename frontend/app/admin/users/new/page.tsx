'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCreateStudent, useFieldsOfStudy, useMajors } from '@/hooks/use-user';
import { CreateStudentPayload } from '@/lib/services/user.service';

const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  studentData: z.object({
    formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid', '']).optional(),
    fieldOfStudyId: z.string().optional(),
    majorId: z.string().optional(),
    typeOfStudy: z.enum(['bachelor', 'master', 'phd', 'associate', 'certificate', '']).optional(),
    startYear: z.preprocess(
      (val) => (val === '' || val === 0 ? undefined : Number(val)),
      z.number().int().min(1900).max(2100).optional(),
    ),
  }).optional(),
});

type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export default function CreateStudentPage() {
  const router = useRouter();
  const mutation = useCreateStudent();
  const { data: fields } = useFieldsOfStudy();

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      studentData: {
        formOfStudy: '',
        typeOfStudy: '',
        fieldOfStudyId: '',
        majorId: '',
        startYear: undefined,
      },
    },
  });

  const selectedFieldId = useWatch({ control: form.control, name: 'studentData.fieldOfStudyId' });
  const { data: majors, isLoading: isMajorsLoading } = useMajors(selectedFieldId);

  useEffect(() => {
    const currentMajorId = form.getValues('studentData.majorId');
    if (currentMajorId && selectedFieldId) {
      const majorExistsInNewField = majors?.some((m) => m._id === currentMajorId);
      if (!majorExistsInNewField && !isMajorsLoading) {
        form.setValue('studentData.majorId', '');
      }
    } else if (!selectedFieldId) {
      form.setValue('studentData.majorId', '');
    }
  }, [selectedFieldId, majors, isMajorsLoading, form]);

  function onSubmit(data: CreateStudentFormValues) {
    const payload: CreateStudentPayload = {
      name: data.name,
      email: data.email,
    };
    if (data.studentData) {
      const sd: Record<string, unknown> = {};
      if (data.studentData.formOfStudy) sd.formOfStudy = data.studentData.formOfStudy;
      if (data.studentData.typeOfStudy) sd.typeOfStudy = data.studentData.typeOfStudy;
      if (data.studentData.fieldOfStudyId) sd.fieldOfStudyId = data.studentData.fieldOfStudyId;
      if (data.studentData.majorId) sd.majorId = data.studentData.majorId;
      if (data.studentData.startYear) sd.startYear = data.studentData.startYear;
      if (Object.keys(sd).length > 0) payload.studentData = sd as CreateStudentPayload['studentData'];
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        router.push('/admin/users');
        toast.success('Student created. Default password: simplearn123');
      },
      onError: (error: any) => {
        if (error.response?.status === 409) {
          form.setError('email', { message: 'An account with this email already exists.' });
        } else {
          toast.error('Failed to create student. Please try again.');
        }
      },
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Student</h1>
        <p className="text-muted-foreground">
          Fill in the required fields to provision a new student account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Name and email are required. The student will use these credentials to log in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Profile</CardTitle>
              <CardDescription>
                All fields below are optional and can be completed later from the student's profile page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentData.formOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form of Study</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger aria-label="Select form of study">
                            <SelectValue placeholder="Select form of study" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentData.typeOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Study</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger aria-label="Select type of study">
                            <SelectValue placeholder="Select type of study" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bachelor">Bachelor</SelectItem>
                          <SelectItem value="master">Master</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="associate">Associate</SelectItem>
                          <SelectItem value="certificate">Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentData.fieldOfStudyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger aria-label="Select field of study">
                            <SelectValue placeholder="Select a field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fields?.map((f) => (
                            <SelectItem key={f._id} value={f._id}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentData.majorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedFieldId || isMajorsLoading}
                      >
                        <FormControl>
                          <SelectTrigger aria-label="Select major">
                            <SelectValue
                              placeholder={!selectedFieldId ? 'Select a field first' : 'Select a major'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {majors?.map((m) => (
                            <SelectItem key={m._id} value={m._id}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="studentData.startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 2023"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {mutation.isPending ? 'Creating...' : 'Create Student'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
