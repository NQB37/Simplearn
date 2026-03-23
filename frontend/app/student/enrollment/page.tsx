'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEnrollmentCatalog } from '@/hooks/use-enrollment';
import { EnrollmentCatalog } from '@/components/features/enrollment/enrollment-catalog';

export default function EnrollmentPage() {
  const router = useRouter();
  const { data: catalog, isLoading, error } = useEnrollmentCatalog();

  useEffect(() => {
    if (!catalog) return;

    if (catalog.enrollmentDeadline && new Date() > new Date(catalog.enrollmentDeadline)) {
      router.replace('/student/study-plan');
    }
  }, [catalog, router]);

  useEffect(() => {
    const err = error as any;
    if (err?.response?.status === 403 || err?.response?.status === 422) {
      router.replace('/student/study-plan');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center text-slate-500">
        Loading...
      </div>
    );
  }

  const deadlinePassed =
    catalog?.enrollmentDeadline && new Date() > new Date(catalog.enrollmentDeadline);

  if (deadlinePassed) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Enrollment
        </h1>
        {catalog?.enrollmentDeadline && (
          <p className="text-sm font-medium text-slate-500 mt-1">
            Deadline:{' '}
            {new Date(catalog.enrollmentDeadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
      <EnrollmentCatalog />
    </div>
  );
}
