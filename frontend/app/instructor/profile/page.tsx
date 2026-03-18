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
import { TeachingForm } from '@/components/features/profile/teaching-form';

export default function InstructorProfilePage() {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-2xl font-bold tracking-tight'>Profile</h3>
        <p className='text-muted-foreground'>
          Manage your account settings and set your preferences.
        </p>
      </div>
      <Tabs defaultValue='general' className='space-y-6'>
        <TabsList className='bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 flex space-x-6'>
          <TabsTrigger
            value='general'
            className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value='personal'
            className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
          >
            Personal
          </TabsTrigger>
          <TabsTrigger
            value='teaching'
            className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
          >
            Teaching
          </TabsTrigger>
          <TabsTrigger
            value='security'
            className='data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground relative translate-y-px'
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4'>
          <Card className='bg-transparent border-none shadow-none p-0'>
            <CardHeader className='px-0'>
              <CardTitle className='text-xl'>Profile Information</CardTitle>
              <CardDescription>
                Update your account&apos;s profile information and avatar.
              </CardDescription>
            </CardHeader>
            <CardContent className='px-0'>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='personal' className='space-y-4'>
          <PersonalForm />
        </TabsContent>

        <TabsContent value='teaching' className='space-y-4'>
          <TeachingForm />
        </TabsContent>

        <TabsContent value='security' className='space-y-4'>
          <Card className='bg-transparent border-none shadow-none p-0'>
            <CardHeader className='px-0'>
              <CardTitle className='text-xl'>Password</CardTitle>
              <CardDescription>
                Ensure your account is using a long, random password to stay
                secure.
              </CardDescription>
            </CardHeader>
            <CardContent className='px-0'>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
