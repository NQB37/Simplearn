'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState, useRef } from 'react';
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
import { useCreateStudent, useFaculties, useMajors } from '@/hooks/use-user';
import { CreateStudentPayload } from '@/lib/services/user.service';
import axiosInstance from '@/api/axios.api';

const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  studentData: z.object({
    formOfStudy: z.enum(['full-time', 'part-time', 'online', 'hybrid', '']).optional(),
    facultyId: z.string().optional(),
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
  const { data: faculties } = useFaculties();

  const form = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      phone: '',
      address: { street: '', city: '', country: '' },
      studentData: {
        formOfStudy: '',
        typeOfStudy: '',
        facultyId: '',
        majorId: '',
        startYear: '' as unknown as number,
      },
    },
  });

  const selectedFacultyId = useWatch({ control: form.control, name: 'studentData.facultyId' });
  const { data: majors, isLoading: isMajorsLoading } = useMajors(selectedFacultyId);

  useEffect(() => {
    const currentMajorId = form.getValues('studentData.majorId');
    if (currentMajorId && selectedFacultyId) {
      const majorExistsInNewFaculty = majors?.some((m) => m._id === currentMajorId);
      if (!majorExistsInNewFaculty && !isMajorsLoading) {
        form.setValue('studentData.majorId', '');
      }
    } else if (!selectedFacultyId) {
      form.setValue('studentData.majorId', '');
    }
  }, [selectedFacultyId, majors, isMajorsLoading, form]);

  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false);
  const generatedEmailRef = useRef('');

  const watchedFirstName = useWatch({ control: form.control, name: 'firstName' });
  const watchedLastName = useWatch({ control: form.control, name: 'lastName' });

  function generateEmail(firstName: string, lastName: string): string {
    const ln = lastName.toLowerCase().replace(/[^a-z]/g, '');
    const fn = firstName.toLowerCase().replace(/[^a-z]/g, '');
    let prefix = ln.slice(0, 3);
    if (prefix.length < 3) {
      prefix += fn.slice(0, 3 - prefix.length);
    }
    if (prefix.length === 0) return '';
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${prefix}${digits}@simplearn.com`;
  }

  useEffect(() => {
    if (!emailManuallyEdited && (watchedLastName || watchedFirstName)) {
      const generated = generateEmail(watchedFirstName || '', watchedLastName || '');
      generatedEmailRef.current = generated;
      if (generated) {
        form.setValue('email', generated);
      }
    }
  }, [watchedFirstName, watchedLastName, emailManuallyEdited, form]);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(data: CreateStudentFormValues) {
    let pictureUrl: string | undefined;

    if (photoFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', photoFile);
        const { data: uploadResult } = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL}/api/media/images/upload`,
          formData,
        );
        pictureUrl = uploadResult.url;
      } catch {
        toast.error('Failed to upload photo. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload: CreateStudentPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
    if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth;
    if (data.phone) payload.phone = data.phone;
    if (data.address) {
      const addr: Record<string, string> = {};
      if (data.address.street) addr.street = data.address.street;
      if (data.address.city) addr.city = data.address.city;
      if (data.address.country) addr.country = data.address.country;
      if (Object.keys(addr).length > 0) payload.address = addr;
    }
    if (pictureUrl) payload.picture = pictureUrl;
    if (data.studentData) {
      const sd: Record<string, unknown> = {};
      if (data.studentData.formOfStudy) sd.formOfStudy = data.studentData.formOfStudy;
      if (data.studentData.typeOfStudy) sd.typeOfStudy = data.studentData.typeOfStudy;
      if (data.studentData.facultyId) sd.facultyId = data.studentData.facultyId;
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
                First and last name are required. Email auto-generates from name but can be edited.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value !== generatedEmailRef.current) {
                          setEmailManuallyEdited(true);
                        }
                      }}
                      className={!emailManuallyEdited && field.value ? 'text-muted-foreground' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>All fields below are optional and can be completed later.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input type="tel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium">Address</p>
                <FormField control={form.control} name="address.street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="address.city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address.country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Profile Photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-2" />
                )}
              </div>
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
                  name="studentData.facultyId"
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
                  name="studentData.majorId"
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
                            <SelectValue
                              placeholder={!selectedFacultyId ? 'Select a faculty first' : 'Select a major'}
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
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? '' : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending || isUploading}>
              {(mutation.isPending || isUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {mutation.isPending || isUploading ? 'Creating...' : 'Create Student'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
