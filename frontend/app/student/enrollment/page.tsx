'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { academyService } from '@/lib/services/academy.service';
import { MajorSubject } from '@/types/academics.type';

export default function EnrollmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [academicYearId, setAcademicYearId] = useState('');
  const [subjects, setSubjects] = useState<MajorSubject[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [deadlinePassed, setDeadlinePassed] = useState(false);

  useEffect(() => {
    academyService
      .getEligibleSubjects()
      .then((data) => {
        setDeadline(data.enrollmentDeadline);
        setAcademicYearId(data.academicYearId);
        setSubjects(data.subjects);

        if (data.enrollmentDeadline && new Date() > new Date(data.enrollmentDeadline)) {
          setDeadlinePassed(true);
          router.replace('/student/study-plan');
          return;
        }

        const defaultChecked = new Set(
          data.subjects
            .filter((s) => s.isMandatory)
            .map((s) => s.subjectId._id),
        );
        setChecked(defaultChecked);
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          router.replace('/student/study-plan');
        } else {
          toast.error('Failed to load eligible subjects.');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function toggleSubject(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await academyService.bulkEnroll([...checked], academicYearId);
      toast.success('Enrollment saved successfully.');
      router.push('/student/study-plan');
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'Failed to save enrollment.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto py-12 text-center text-slate-500'>
        Loading...
      </div>
    );
  }

  if (deadlinePassed) {
    return null;
  }

  return (
    <div className='max-w-2xl mx-auto py-8 px-4 space-y-6'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Enrollment
        </h1>
        {deadline && (
          <p className='text-sm font-medium text-slate-500 mt-1'>
            Deadline:{' '}
            {new Date(deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className='rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm'>
          <CardHeader className='border-b border-slate-100 dark:border-slate-800'>
            <CardTitle className='text-base font-bold'>Select Subjects</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            {subjects.length === 0 ? (
              <p className='px-6 py-8 text-center text-slate-400'>
                No eligible subjects found for this semester.
              </p>
            ) : (
              <ul className='divide-y divide-slate-100 dark:divide-slate-800'>
                {subjects.map((entry) => {
                  const subjectId = entry.subjectId._id;
                  const isChecked = checked.has(subjectId);
                  return (
                    <li key={subjectId} className='px-6 py-4'>
                      <label className='flex items-center gap-3 cursor-pointer'>
                        <input
                          type='checkbox'
                          className='h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer'
                          checked={isChecked}
                          onChange={() => toggleSubject(subjectId)}
                        />
                        <span className='flex-1 font-medium text-slate-800 dark:text-slate-200'>
                          {entry.subjectId.name}
                        </span>
                        <span className='text-xs text-slate-400 font-mono'>
                          {entry.subjectId.code}
                        </span>
                        {entry.isMandatory && (
                          <span className='text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide'>
                            Required
                          </span>
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className='sticky bottom-4 mt-4 flex justify-end'>
          <Button
            type='submit'
            disabled={submitting || checked.size === 0}
            className='rounded-full font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 active:scale-95 transition-all px-8'
          >
            {submitting ? 'Saving...' : 'Save Enrollment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
