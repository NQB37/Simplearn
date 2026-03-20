'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { academyService } from '@/lib/services/academy.service';
import { Enrollment } from '@/types/academics.type';
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
    <div className='max-w-4xl mx-auto py-8 px-4 space-y-6'>
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
        <div className='rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment._id}>
                  <TableCell className='text-base font-normal'>
                    {enrollment.subjectId.name}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {enrollment.subjectId.code}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {enrollment.subjectId.credits}
                  </TableCell>
                  <TableCell className='text-sm text-slate-400'>TBD</TableCell>
                  <TableCell className='text-sm text-slate-400'>
                    To be scheduled
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='text-teal-600 border-teal-200'>
                      Enrolled
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
