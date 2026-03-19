'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { academyService } from '@/lib/services/academy.service';
import { Enrollment } from '@/types/academics.type';
import { toast } from 'sonner';

export default function StudyPlanPage() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    academyService
      .getMyEnrollments()
      .then(setEnrollments)
      .catch(() => toast.error('Failed to load study plan.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='max-w-2xl mx-auto py-8 px-4 space-y-6'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Study Plan
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium mt-1'>
          Your enrolled subjects for this semester.
        </p>
      </div>

      <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm'>
        <CardHeader className='border-b border-slate-100 dark:border-slate-800'>
          <CardTitle className='text-base font-bold'>Enrolled Subjects</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {loading ? (
            <p className='px-6 py-8 text-center text-slate-400'>Loading...</p>
          ) : enrollments.length === 0 ? (
            <p className='px-6 py-8 text-center text-slate-400'>
              No enrollments yet. Visit the{' '}
              <a
                href='/student/enrollment'
                className='text-teal-600 hover:underline font-medium'
              >
                enrollment page
              </a>{' '}
              to get started.
            </p>
          ) : (
            <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
              {enrollments.map((enrollment) => (
                <li
                  key={enrollment._id}
                  className='px-6 py-4 flex items-center justify-between gap-4'
                >
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-slate-800 dark:text-slate-200 truncate'>
                      {enrollment.subjectId.name}
                    </p>
                    <p className='text-xs text-slate-400 font-mono mt-0.5'>
                      {enrollment.subjectId.code} &middot;{' '}
                      {enrollment.subjectId.credits} credits
                    </p>
                  </div>
                  <div className='flex items-center gap-3 shrink-0'>
                    <span className='text-xs text-slate-400'>
                      {enrollment.academicYearId.name}
                    </span>
                    <Badge
                      variant='outline'
                      className='text-xs font-bold text-teal-600 border-teal-200 dark:border-teal-800 dark:text-teal-400'
                    >
                      Enrolled
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
