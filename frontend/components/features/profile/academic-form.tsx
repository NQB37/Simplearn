'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2 } from 'lucide-react';
import { useExtendedProfile, useExtendedProfileMutation, useFieldsOfStudy, useMajors, useUserProfile, useUserProfileMutation, FormOfStudy, TypeOfStudy } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

const academicFormSchema = z.object({
  studentData: z.object({
    formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid', '']).optional(),
    fieldOfStudyId: z.string().optional(),
    majorId: z.string().optional(),
    typeOfStudy: z.enum(['bachelor', 'master', 'phd', 'associate', 'certificate', '']).optional(),
    startYear: z.preprocess((val) => (val === '' || val === 0 ? undefined : Number(val)), z.number().int().min(1900).max(2100).optional()),
  }),
});

type AcademicFormValues = z.infer<typeof academicFormSchema>;

interface AcademicFormProps {
  userId?: string;
}

export function AcademicForm({ userId }: AcademicFormProps) {
  const { data: ownProfile, isLoading: isOwnLoading } = useExtendedProfile();
  const { data: userProfile, isLoading: isUserLoading } = useUserProfile(userId || '');
  const { data: fields, isLoading: isFieldsLoading } = useFieldsOfStudy();
  
  const ownMutation = useExtendedProfileMutation();
  const userMutation = useUserProfileMutation(userId || '');

  const profile = userId ? userProfile : ownProfile;
  const isProfileLoading = userId ? isUserLoading : isOwnLoading;
  const mutation = userId ? userMutation : ownMutation;

  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(academicFormSchema) as any,
    defaultValues: {
      studentData: {
        formOfStudy: '',
        fieldOfStudyId: '',
        majorId: '',
        typeOfStudy: '',
        startYear: undefined,
      },
    },
  });

  const selectedFieldId = useWatch({
    control: form.control,
    name: 'studentData.fieldOfStudyId',
  });

  const { data: majors, isLoading: isMajorsLoading } = useMajors(selectedFieldId);

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile?.studentData) {
      form.reset({
        studentData: {
          formOfStudy: profile.studentData.formOfStudy || '',
          fieldOfStudyId: profile.studentData.fieldOfStudyId || '',
          majorId: profile.studentData.majorId || '',
          typeOfStudy: profile.studentData.typeOfStudy || '',
          startYear: profile.studentData.startYear || 0,
        },
      });
    }
  }, [profile, form]);

  // Reset major when field of study changes
  useEffect(() => {
    const currentMajorId = form.getValues('studentData.majorId');
    if (currentMajorId && selectedFieldId) {
      // Check if current major belongs to selected field
      const majorExistsInNewField = majors?.some(m => m._id === currentMajorId);
      if (!majorExistsInNewField && !isMajorsLoading) {
         form.setValue('studentData.majorId', '');
      }
    } else if (!selectedFieldId) {
      form.setValue('studentData.majorId', '');
    }
  }, [selectedFieldId, majors, isMajorsLoading, form]);

  function onSubmit(data: AcademicFormValues) {
    mutation.mutate(data);
  }

  if (isProfileLoading || isFieldsLoading) {
    return (
      <Card className="bg-transparent border-none shadow-none p-0">
        <CardHeader className="px-0">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Academic Details</CardTitle>
        <CardDescription>
          Update your study program and enrollment information.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    {/* Web Accessibility: Major is disabled until Field is selected, announced via placeholder */}
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!selectedFieldId || isMajorsLoading}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Select major">
                          <SelectValue placeholder={!selectedFieldId ? "Select a field first" : "Select a major"} />
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

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full sm:w-auto"
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
