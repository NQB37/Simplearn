'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { academyService } from '@/lib/services/academy.service';
import { Enrollment } from '@/types/academics.type';
import { VisualSchedule } from '@/components/features/schedule/visual-schedule';
import { toast } from 'sonner';

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    academyService
      .getMyEnrollments()
      .then(setEnrollments)
      .catch(() => toast.error('Failed to load schedule.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className='max-w-5xl mx-auto py-8 px-4 space-y-6'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Class Schedule
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium mt-1'>
          Your enrolled subjects for the current semester.
        </p>
      </div>

      {loading ? (
        <p className='text-center text-slate-400 py-8'>Loading schedule...</p>
      ) : enrollments.length === 0 ? (
        <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm'>
          <CardContent className='py-10 text-center'>
            <p className='text-slate-500 dark:text-slate-400'>
              You currently have no active enrolled subjects for this semester.
              Please contact the Admin to resolve your enrollment status.
            </p>
          </CardContent>
        </Card>
      ) : (
        <VisualSchedule enrollments={enrollments} />
      )}
    </div>
  );
}
