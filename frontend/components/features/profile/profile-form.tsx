'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axios.api';
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
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  picture: z
    .string()
    .url({ message: 'Please enter a valid URL.' })
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name?: string;
    picture?: string;
    role: string;
  } | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      picture: '',
    },
  });

  useEffect(() => {
    // Fetch initial user data
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/me');
        const userData = response.data.user;
        setUser(userData);
        form.reset({
          name: userData.name || '',
          picture: userData.picture || '',
        });
      } catch (error) {
        toast.error('Failed to load user data');
      }
    };
    fetchUser();
  }, [form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      await axiosInstance.patch('/api/users/profile', data);
      toast.success('Profile updated successfully.');
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex items-center space-x-4 mb-2'>
          <Avatar className='h-16 w-16 border bg-muted'>
            <AvatarImage
              src={form.watch('picture') || user?.picture || ''}
              alt={user?.name || ''}
              className='object-cover'
            />
            <AvatarFallback className='bg-primary/10 text-primary font-medium'>
              {(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Your display name' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='picture'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input
                  placeholder='https://example.com/avatar.jpg'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a direct link to an image for your avatar mapping.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end pt-4'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full sm:w-auto'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
