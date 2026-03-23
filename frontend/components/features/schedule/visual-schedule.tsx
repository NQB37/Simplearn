'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { Enrollment } from '@/types/academics.type';

interface ShiftDef {
  shiftId: number;
  startTime: string;
  endTime: string;
}

const SHIFTS: ShiftDef[] = [
  { shiftId: 1, startTime: '07:15', endTime: '08:45' },
  { shiftId: 2, startTime: '09:00', endTime: '10:30' },
  { shiftId: 3, startTime: '10:45', endTime: '12:15' },
  { shiftId: 4, startTime: '12:30', endTime: '14:00' },
  { shiftId: 5, startTime: '14:15', endTime: '15:45' },
  { shiftId: 6, startTime: '16:00', endTime: '17:30' },
  { shiftId: 7, startTime: '17:45', endTime: '19:15' },
];

const DAYS = [1, 2, 3, 4, 5];

const DAY_LABELS: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
};

interface ScheduleCell {
  subjectName: string;
  subjectCode: string;
  roomName: string;
  instructorId?: string;
  classCode: string;
}

interface VisualScheduleProps {
  enrollments: Enrollment[];
}

export function VisualSchedule({ enrollments }: VisualScheduleProps) {
  // Build a lookup: grid[dayOfWeek][shiftId] = ScheduleCell
  const grid: Record<number, Record<number, ScheduleCell>> = {};

  for (const enrollment of enrollments) {
    const cls = enrollment.classId;
    if (!cls || !cls.schedules) continue;

    const cell: ScheduleCell = {
      subjectName: cls.subjectId.name,
      subjectCode: cls.subjectId.code,
      roomName: cls.roomId.name,
      instructorId: cls.instructorId,
      classCode: cls.code,
    };

    for (const schedule of cls.schedules) {
      if (!grid[schedule.dayOfWeek]) {
        grid[schedule.dayOfWeek] = {};
      }
      grid[schedule.dayOfWeek][schedule.shiftId] = cell;
    }
  }

  return (
    <div className='overflow-x-auto'>
      <div
        className='grid border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-xs min-w-[600px]'
        style={{ gridTemplateColumns: `120px repeat(5, 1fr)` }}
      >
        {/* Header row */}
        <div className='p-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-500 dark:text-slate-400 border-b border-r border-slate-200 dark:border-slate-700 text-center'>
          Shift / Day
        </div>
        {DAYS.map((day) => (
          <div
            key={day}
            className='p-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-700 text-center last:border-r-0'
          >
            {DAY_LABELS[day]}
          </div>
        ))}

        {/* Shift rows */}
        {SHIFTS.map((shift) => (
          <Fragment key={shift.shiftId}>
            {/* Shift label */}
            <div className='p-2 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-b border-r border-slate-200 dark:border-slate-700 last:border-b-0'>
              <div className='font-medium'>Shift {shift.shiftId}</div>
              <div className='text-slate-400 dark:text-slate-500'>
                {shift.startTime} - {shift.endTime}
              </div>
            </div>

            {/* Day cells */}
            {DAYS.map((day) => {
              const cell = grid[day]?.[shift.shiftId];

              return (
                <div
                  key={`${day}-${shift.shiftId}`}
                  className={cn(
                    'p-1.5 border-b border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-h-[64px] flex flex-col justify-center transition-colors',
                    cell
                      ? 'bg-blue-50 dark:bg-blue-950'
                      : 'bg-white dark:bg-slate-950',
                  )}
                >
                  {cell ? (
                    <div className='space-y-0.5'>
                      <div className='font-semibold text-blue-700 dark:text-blue-300 leading-tight truncate'>
                        {cell.subjectName}
                      </div>
                      <div className='text-slate-500 dark:text-slate-400 truncate'>
                        {cell.roomName}
                      </div>
                      {cell.instructorId && (
                        <div className='text-slate-400 dark:text-slate-500 truncate text-[10px]'>
                          {cell.instructorId}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
