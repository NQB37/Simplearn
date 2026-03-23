'use client';

import { useEnrollmentCatalog, useEnroll, useMyEnrollments } from '@/hooks/use-enrollment';
import { ClassModel, Subject, Room } from '@/types/academics.type';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const SHIFTS: Record<number, string> = {
  1: '07:15-08:45',
  2: '09:00-10:30',
  3: '10:45-12:15',
  4: '12:30-14:00',
  5: '14:15-15:45',
  6: '16:00-17:30',
  7: '17:45-19:15',
};

function formatSchedule(schedules?: ClassModel['schedules']) {
  if (!schedules || schedules.length === 0) return 'No schedule';
  return schedules
    .map((s) => `${DAY_NAMES[s.dayOfWeek]} ${SHIFTS[s.shiftId] ?? ''}`)
    .join(', ');
}

function getEnrolledClassIds(enrollments: { classId: { _id: string } | string }[]): Set<string> {
  return new Set(
    enrollments.map((e) => (typeof e.classId === 'string' ? e.classId : e.classId._id)),
  );
}

function getEnrolledSubjectIds(enrollments: { subjectId: { _id: string } | string }[]): Set<string> {
  return new Set(
    enrollments.map((e) => (typeof e.subjectId === 'string' ? e.subjectId : e.subjectId._id)),
  );
}

function getEnrolledShiftKeys(
  enrollments: { classId: { schedules?: { dayOfWeek: number; shiftId: number }[] } | string }[],
): Set<string> {
  const keys = new Set<string>();
  for (const e of enrollments) {
    if (typeof e.classId === 'object' && e.classId.schedules) {
      for (const s of e.classId.schedules) {
        keys.add(`${s.dayOfWeek}-${s.shiftId}`);
      }
    }
  }
  return keys;
}

function hasShiftConflict(
  cls: ClassModel,
  enrolledShiftKeys: Set<string>,
): boolean {
  if (!cls.schedules) return false;
  return cls.schedules.some((s) => enrolledShiftKeys.has(`${s.dayOfWeek}-${s.shiftId}`));
}

export function EnrollmentCatalog() {
  const { data: catalog, isLoading: catalogLoading } = useEnrollmentCatalog();
  const { data: myEnrollments = [] } = useMyEnrollments();
  const enrollMutation = useEnroll();

  if (catalogLoading) {
    return (
      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold">Available Classes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, col) => (
                    <TableCell key={col}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (!catalog || catalog.classes.length === 0) {
    return (
      <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold">Available Classes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-slate-400">
                  No classes available for your major this semester.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const enrolledClassIds = getEnrolledClassIds(myEnrollments as any);
  const enrolledSubjectIds = getEnrolledSubjectIds(myEnrollments as any);
  const enrolledShiftKeys = getEnrolledShiftKeys(myEnrollments as any);

  return (
    <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-bold">
          Available Classes{' '}
          <span className="font-normal text-slate-400 text-sm">
            ({catalog.classes.length} classes)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalog.classes.map((cls) => {
              const subject = cls.subjectId as Subject;
              const room = cls.roomId as Room;
              const isFull = (cls.currentEnrollments ?? 0) >= cls.maxCapacity;
              const isEnrolled = enrolledClassIds.has(cls._id);
              const isDuplicateSubject =
                !isEnrolled &&
                enrolledSubjectIds.has(typeof subject === 'string' ? subject : subject._id);
              const isConflict = !isEnrolled && hasShiftConflict(cls, enrolledShiftKeys);
              const isDisabled =
                isFull || isEnrolled || isDuplicateSubject || isConflict || enrollMutation.isPending;

              let buttonLabel = 'Enroll';
              if (isEnrolled) buttonLabel = 'Enrolled';
              else if (isFull) buttonLabel = 'Full';
              else if (isDuplicateSubject) buttonLabel = 'Subject taken';
              else if (isConflict) buttonLabel = 'Conflict';

              let statusBadge: React.ReactNode;
              if (isEnrolled) {
                statusBadge = (
                  <Badge variant="outline" className="text-teal-600 border-teal-300 text-xs">
                    Enrolled
                  </Badge>
                );
              } else if (isFull) {
                statusBadge = (
                  <Badge variant="outline" className="text-red-500 border-red-300 text-xs">
                    Full
                  </Badge>
                );
              } else if (isConflict) {
                statusBadge = (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                    Conflict
                  </Badge>
                );
              } else {
                statusBadge = (
                  <Badge variant="outline" className="text-slate-500 border-slate-300 text-xs">
                    Available
                  </Badge>
                );
              }

              return (
                <TableRow key={cls._id}>
                  <TableCell>
                    <span className="font-mono text-xs text-slate-500">{cls.code}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {typeof subject === 'string' ? cls.code : subject.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {typeof subject === 'string' ? '—' : subject.credits}
                  </TableCell>
                  <TableCell>{formatSchedule(cls.schedules)}</TableCell>
                  <TableCell>
                    {typeof room !== 'string' && room?.name ? room.name : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {cls.currentEnrollments ?? 0}/{cls.maxCapacity}
                  </TableCell>
                  <TableCell>{statusBadge}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={isEnrolled ? 'outline' : 'default'}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && enrollMutation.mutate(cls._id)}
                      className={
                        isEnrolled
                          ? 'rounded-full border-teal-300 text-teal-600'
                          : 'rounded-full bg-teal-600 hover:bg-teal-700 text-white'
                      }
                    >
                      {buttonLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
