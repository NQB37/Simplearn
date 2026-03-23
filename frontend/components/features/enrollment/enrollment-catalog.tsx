'use client';

import { useEnrollmentCatalog, useEnroll, useMyEnrollments } from '@/hooks/use-enrollment';
import { ClassModel, Subject, Room } from '@/types/academics.type';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!catalog || catalog.classes.length === 0) {
    return (
      <p className="py-8 text-center text-slate-400">
        No classes available for your major this semester.
      </p>
    );
  }

  const enrolledClassIds = getEnrolledClassIds(myEnrollments as any);
  const enrolledSubjectIds = getEnrolledSubjectIds(myEnrollments as any);
  const enrolledShiftKeys = getEnrolledShiftKeys(myEnrollments as any);

  return (
    <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-base font-bold">Available Classes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {catalog.classes.map((cls) => {
            const subject = cls.subjectId as Subject;
            const room = cls.roomId as Room;
            const isFull = (cls.currentEnrollments ?? 0) >= cls.maxCapacity;
            const isEnrolled = enrolledClassIds.has(cls._id);
            const isDuplicateSubject = !isEnrolled &&
              enrolledSubjectIds.has(typeof subject === 'string' ? subject : subject._id);
            const isConflict = !isEnrolled && hasShiftConflict(cls, enrolledShiftKeys);
            const isDisabled = isFull || isEnrolled || isDuplicateSubject || isConflict || enrollMutation.isPending;

            let buttonLabel = 'Enroll';
            if (isEnrolled) buttonLabel = 'Enrolled';
            else if (isFull) buttonLabel = 'Full';
            else if (isDuplicateSubject) buttonLabel = 'Subject taken';
            else if (isConflict) buttonLabel = 'Conflict';

            return (
              <li key={cls._id} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {typeof subject === 'string' ? cls.code : subject.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{cls.code}</span>
                    {isEnrolled && (
                      <Badge variant="outline" className="text-teal-600 border-teal-300 text-xs">
                        Enrolled
                      </Badge>
                    )}
                    {isFull && !isEnrolled && (
                      <Badge variant="outline" className="text-red-500 border-red-300 text-xs">
                        Full
                      </Badge>
                    )}
                    {isConflict && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                        Conflict
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatSchedule(cls.schedules)}
                    {typeof room !== 'string' && room?.name && ` — ${room.name}`}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cls.currentEnrollments ?? 0}/{cls.maxCapacity} enrolled
                  </p>
                </div>
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
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
