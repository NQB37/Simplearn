'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { useExtendedProfile, useExtendedProfileMutation, useFaculties, useMajors, useUserProfile, useUserProfileMutation } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

const teachingFormSchema = z.object({
  instructorData: z.object({
    facultyId: z.string().optional().or(z.literal('')),
    majorId: z.string().optional().or(z.literal('')),
  }),
});

type TeachingFormValues = z.infer<typeof teachingFormSchema>;

interface TeachingFormProps {
  userId?: string;
}

export function TeachingForm({ userId }: TeachingFormProps) {
  const { data: ownProfile, isLoading: isOwnLoading } = useExtendedProfile();
  const { data: userProfile, isLoading: isUserLoading } = useUserProfile(userId || '');
  const { data: faculties, isLoading: isFacultiesLoading } = useFaculties();
  
  const ownMutation = useExtendedProfileMutation();
  const userMutation = useUserProfileMutation(userId || '');

  const profile = userId ? userProfile : ownProfile;
  const isProfileLoading = userId ? isUserLoading : isOwnLoading;
  const mutation = userId ? userMutation : ownMutation;

  const form = useForm<TeachingFormValues>({
    resolver: zodResolver(teachingFormSchema),
    defaultValues: {
      instructorData: {
        facultyId: '',
        majorId: '',
      },
    },
  });

  const selectedFacultyId = useWatch({
    control: form.control,
    name: 'instructorData.facultyId',
  });

  const { data: majors, isLoading: isMajorsLoading } = useMajors(selectedFacultyId);

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile?.instructorData) {
      form.reset({
        instructorData: {
          facultyId: profile.instructorData.facultyId || '',
          majorId: profile.instructorData.majorId || '',
        },
      });
    }
  }, [profile, form]);

  // Reset major when faculty changes
  useEffect(() => {
    const currentMajorId = form.getValues('instructorData.majorId');
    if (currentMajorId && selectedFacultyId) {
      const majorExistsInNewFaculty = majors?.some(m => m._id === currentMajorId);
      if (!majorExistsInNewFaculty && !isMajorsLoading) {
         form.setValue('instructorData.majorId', '');
      }
    } else if (!selectedFacultyId) {
      form.setValue('instructorData.majorId', '');
    }
  }, [selectedFacultyId, majors, isMajorsLoading, form]);

  function onSubmit(data: TeachingFormValues) {
    mutation.mutate(data);
  }

  if (isProfileLoading || isFacultiesLoading) {
    return (
      <Card className="bg-transparent border-none shadow-none p-0">
        <CardHeader className="px-0">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Teaching Details</CardTitle>
        <CardDescription>
          Update the fields and majors you teach.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instructorData.facultyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faculty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Select faculty">
                          <SelectValue placeholder="Select a faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties?.map((f) => (
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
                name="instructorData.majorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedFacultyId || isMajorsLoading}
                    >
                      <FormControl>
                        <SelectTrigger aria-label="Select major">
                          <SelectValue placeholder={!selectedFacultyId ? "Select a faculty first" : "Select a major"} />
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
