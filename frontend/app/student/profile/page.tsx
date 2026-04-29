'use client';

import { ContactForm } from '@/components/features/profile/contact-form';
import { ChangePasswordModal } from '@/components/features/profile/change-password-modal';
import { useUserStore } from '@/store/user.store';
import { useExtendedProfile, useFaculties, useMajors } from '@/hooks/use-user';
import { GraduationCap } from 'lucide-react';

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className='space-y-1'>
      <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
        {label}
      </p>
      <p className='text-sm text-slate-900 dark:text-slate-100'>
        {value || (
          <span className='text-slate-400 dark:text-slate-600 italic'>
            Not set
          </span>
        )}
      </p>
    </div>
  );
}

export default function StudentProfilePage() {
  const { user } = useUserStore();
  const { data: profile, isLoading } = useExtendedProfile();
  const { data: faculties } = useFaculties();
  const { data: majors } = useMajors(profile?.studentData?.facultyId);

  const facultyName = faculties?.find(
    (f) => f._id === profile?.studentData?.facultyId,
  )?.name;
  const majorName = majors?.find(
    (m) => m._id === profile?.studentData?.majorId,
  )?.name;

  const formatDate = (iso?: string) => {
    if (!iso) return undefined;
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const capitalize = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          My Profile
        </h1>
        <p className='text-slate-500 dark:text-slate-400 mt-1'>
          View your personal and academic information.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start'>
        {/* Left: Avatar + Identity Card */}
        <div className='lg:sticky lg:top-20 space-y-4'>
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col items-center text-center gap-3'>
            <div className='h-20 w-20 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center overflow-hidden'>
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.lastName}
                  className='h-full w-full object-cover'
                />
              ) : (
                <span className='text-2xl font-bold text-teal-600'>
                  {user?.lastName?.[0]?.toUpperCase() ?? 'S'}
                </span>
              )}
            </div>
            <div>
              <p className='font-bold text-slate-900 dark:text-slate-50'>
                {user?.lastName ?? 'Student'}
              </p>
              <p className='text-sm text-slate-500'>{user?.email}</p>
            </div>
            <span className='inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300'>
              <GraduationCap className='h-3 w-3' />
              Student
            </span>
            <div className='w-full pt-2 border-t border-slate-100 dark:border-slate-800'>
              <ChangePasswordModal />
            </div>
          </div>
        </div>

        {/* Right: Sections */}
        <div className='space-y-6'>
          {/* Personal Information — read-only */}
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>
              Personal Information
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
              Basic personal details managed by the institution.
            </p>
            {isLoading ? (
              <div className='space-y-4'>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className='h-8 rounded bg-slate-100 dark:bg-slate-800 animate-pulse'
                  />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <ReadOnlyField
                  label='Date of Birth'
                  value={formatDate(profile?.dateOfBirth)}
                />
                <ReadOnlyField label='Sex' value={capitalize(profile?.sex)} />
              </div>
            )}
          </div>

          {/* Contact Information — editable */}
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>
              Contact Information
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
              Update your phone number and address.
            </p>
            <ContactForm />
          </div>

          {/* Academic Information — read-only */}
          <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6'>
            <h2 className='text-base font-bold text-slate-900 dark:text-slate-50 mb-1'>
              Academic Information
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-5'>
              Your enrollment and study program details.
            </p>
            {isLoading ? (
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-8 rounded bg-slate-100 dark:bg-slate-800 animate-pulse'
                  />
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <ReadOnlyField
                  label='Form of Study'
                  value={capitalize(
                    profile?.studentData?.formOfStudy?.replace('-', ' '),
                  )}
                />
                <ReadOnlyField
                  label='Type of Study'
                  value={capitalize(profile?.studentData?.typeOfStudy)}
                />
                <ReadOnlyField label='Faculty' value={facultyName} />
                <ReadOnlyField label='Major' value={majorName} />
                <ReadOnlyField
                  label='Start Year'
                  value={profile?.studentData?.startYear?.toString()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
