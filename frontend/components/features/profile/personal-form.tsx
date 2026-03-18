'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useExtendedProfile, useExtendedProfileMutation, useUserProfile, useUserProfileMutation } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

// Form validation schema
const personalFormSchema = z.object({
  dateOfBirth: z.string().optional().or(z.literal('')),
  sex: z.enum(['male', 'female', 'other', '']).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type PersonalFormValues = z.infer<typeof personalFormSchema>;

interface PersonalFormProps {
  userId?: string;
}

export function PersonalForm({ userId }: PersonalFormProps) {
  const { data: ownProfile, isLoading: isOwnLoading } = useExtendedProfile();
  const { data: userProfile, isLoading: isUserLoading } = useUserProfile(userId || '');
  
  const ownMutation = useExtendedProfileMutation();
  const userMutation = useUserProfileMutation(userId || '');

  const profile = userId ? userProfile : ownProfile;
  const isLoading = userId ? isUserLoading : isOwnLoading;
  const mutation = userId ? userMutation : ownMutation;

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: {
      dateOfBirth: '',
      sex: '',
      phone: '',
      address: {
        street: '',
        city: '',
        country: '',
      },
    },
  });

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        sex: profile.sex || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          country: profile.address?.country || '',
        },
      });
    }
  }, [profile, form]);

  function onSubmit(data: PersonalFormValues) {
    // Send full data to ensure no overwrites if using partial updates logic on backend
    mutation.mutate(data);
  }

  if (isLoading) {
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
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <CardDescription>
          Update your date of birth, contact details, and address.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          {/* Web Accessibility: Semantic <form> element handles submission events */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    {/* Web Accessibility: Programmatic association between label and input */}
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        {/* Web Accessibility: SelectTrigger is focusable and announces state */}
                        <SelectTrigger aria-label="Select sex">
                          <SelectValue placeholder="Select sex" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +84 912 345 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">Address</FormLabel>
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hanoi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Vietnam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              {/* Web Accessibility: Button handles 'Enter' key and shows loading state */}
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
