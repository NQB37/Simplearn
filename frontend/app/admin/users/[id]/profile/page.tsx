'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from '@/components/features/profile/profile-form';
import { PasswordForm } from '@/components/features/profile/password-form';
import { PersonalForm } from '@/components/features/profile/personal-form';
import { AcademicForm } from '@/components/features/profile/academic-form';
import { TeachingForm } from '@/components/features/profile/teaching-form';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axios.api';
import { Skeleton } from '@/components/ui/skeleton';

interface TargetUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}

export default function AdminUserEditPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<TargetUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/admin/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (isLoading) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold tracking-tight'>Profile</h3>
        <p className='text-muted-foreground'>
          Editing {user.name}&apos;s profile ({user.role}).
        </p>
      </div>
      <Tabs defaultValue='personal' className='space-y-6'>
        <TabsList className='bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 flex space-x-6'>
          <TabsTrigger
            value='personal'
            className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
          >
            Personal
          </TabsTrigger>
          
          {user.role === 'STUDENT' && (
            <TabsTrigger
              value='academic'
              className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
            >
              Academic
            </TabsTrigger>
          )}

          {user.role === 'INSTRUCTOR' && (
            <TabsTrigger
              value='teaching'
              className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
            >
              Teaching
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value='personal' className='space-y-4'>
          <PersonalForm userId={userId} />
        </TabsContent>

        {user.role === 'STUDENT' && (
          <TabsContent value='academic' className='space-y-4'>
            <AcademicForm userId={userId} />
          </TabsContent>
        )}

        {user.role === 'INSTRUCTOR' && (
          <TabsContent value='teaching' className='space-y-4'>
            <TeachingForm userId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
