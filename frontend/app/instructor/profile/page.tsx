'use client';

import { ProfileForm } from '@/components/features/profile/profile-form';
import { PersonalForm } from '@/components/features/profile/personal-form';
import { TeachingForm } from '@/components/features/profile/teaching-form';
import { ChangePasswordModal } from '@/components/features/profile/change-password-modal';
import { useUserStore } from '@/store/user.store';
import { BookOpen } from 'lucide-react';

export default function InstructorProfilePage() {
  const { user } = useUserStore();

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          My Profile
        </h1>
        <p className='text-slate-500 dark:text-slate-400 mt-1'>
          Manage your personal information and teaching details.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start'>
        {/* Left: Avatar + Identity Card */}
        <div className='lg:sticky lg:top-20 space-y-4'>
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col items-center text-center gap-3'>
            <div className='h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden'>
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className='h-full w-full object-cover' />
              ) : (
                <span className='text-2xl font-bold text-indigo-600'>
                  {user?.name?.[0]?.toUpperCase() ?? 'I'}
                </span>
              )}
            </div>
            <div>
              <p className='font-bold text-slate-900 dark:text-slate-50'>{user?.name ?? 'Instructor'}</p>
              <p className='text-sm text-slate-500'>{user?.email}</p>
            </div>
            <span className='inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'>
              <BookOpen className='h-3 w-3' />
              Instructor
            </span>
            <div className='w-full pt-2 border-t border-slate-100 dark:border-slate-800'>
              <ChangePasswordModal />
            </div>
          </div>
        </div>

        {/* Right: Form Sections */}
        <div className='space-y-6'>
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>Basic Information</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>Update your name and profile photo.</p>
            <ProfileForm />
          </div>

          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>Personal Details</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>Date of birth, gender, phone, and address.</p>
            <PersonalForm />
          </div>

          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>Teaching Information</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>Your faculty and major specialization.</p>
            <TeachingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
