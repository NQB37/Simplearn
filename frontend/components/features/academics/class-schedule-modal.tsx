'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { ClassModel, Subject, Room, AcademicYear } from '@/types/academics.type';
import { useRoomAvailabilityGrid } from '@/hooks/use-academics';
import { TimeGrid } from './time-grid';

interface ClassScheduleModalProps {
  classData: ClassModel;
}

export function ClassScheduleModal({ classData }: ClassScheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roomId = typeof classData.roomId === 'string' ? classData.roomId : (classData.roomId as Room)?._id;
  const academicYearId = typeof classData.academicYearId === 'string' ? classData.academicYearId : (classData.academicYearId as AcademicYear)?._id;

  const { data: roomGrid, isLoading } = useRoomAvailabilityGrid(
    isOpen ? roomId ?? null : null,
    isOpen ? academicYearId ?? null : null,
  );

  const selectedSlots: Array<[number, number]> = (classData.schedules ?? []).map(
    (s) => [s.dayOfWeek, s.shiftId] as [number, number],
  );

  const shifts = roomGrid?.shifts ?? [];
  const days = roomGrid?.days ?? [1, 2, 3, 4, 5];

  const subjectName = typeof classData.subjectId === 'string'
    ? classData.subjectId
    : (classData.subjectId as Subject)?.name;

  const roomName = typeof classData.roomId === 'string'
    ? classData.roomId
    : (classData.roomId as Room)?.name;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
        >
          <CalendarDays className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Schedule — {classData.code}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <div className='flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400'>
            {subjectName && <span><span className='font-medium text-slate-900 dark:text-slate-100'>Subject:</span> {subjectName}</span>}
            {roomName && <span><span className='font-medium text-slate-900 dark:text-slate-100'>Room:</span> {roomName}</span>}
            <span><span className='font-medium text-slate-900 dark:text-slate-100'>Slots:</span> {selectedSlots.length}</span>
          </div>

          {isLoading ? (
            <div className='text-sm text-slate-500'>Loading schedule...</div>
          ) : shifts.length > 0 ? (
            <TimeGrid
              selected={selectedSlots}
              onChange={() => {}}
              busyGrid={{}}
              shifts={shifts}
              days={days}
              disabled
            />
          ) : (
            <div className='text-sm text-slate-500'>No schedule data available.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
