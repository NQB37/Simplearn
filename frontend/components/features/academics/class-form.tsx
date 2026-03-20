'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeGrid } from './time-grid';
import { useSubjects, useRooms, useAcademicYears, useRoomAvailabilityGrid, useBusyInstructorIds, useClassMutations } from '@/hooks/use-academics';
import { useInstructors } from '@/hooks/use-user';

const classFormSchema = z.object({
  code: z.string().min(1, 'Class code is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  roomId: z.string().min(1, 'Room is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
  instructorId: z.string().min(1, 'Instructor is required'),
  maxCapacity: z.number().min(1, 'Max capacity must be at least 1'),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

export function ClassForm() {
  const router = useRouter();
  const [selectedSlots, setSelectedSlots] = useState<Array<[number, number]>>([]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      code: '',
      subjectId: '',
      roomId: '',
      academicYearId: '',
      instructorId: '',
      maxCapacity: 30,
    },
  });

  const watchedRoomId = form.watch('roomId');
  const watchedAcademicYearId = form.watch('academicYearId');

  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: academicYears = [], isLoading: yearsLoading } = useAcademicYears();
  const { data: instructors = [], isLoading: instructorsLoading } = useInstructors();

  const { data: roomGrid, isLoading: gridLoading } = useRoomAvailabilityGrid(
    watchedRoomId || null,
    watchedAcademicYearId || null,
  );

  const schedulePayload = useMemo(
    () => selectedSlots.map(([dayOfWeek, shiftId]) => ({ dayOfWeek, shiftId })),
    [selectedSlots],
  );

  const { data: busyInstructorIds = [] } = useBusyInstructorIds(
    watchedAcademicYearId || null,
    schedulePayload,
  );

  const busySet = useMemo(() => new Set(busyInstructorIds), [busyInstructorIds]);

  const availableInstructors = useMemo(
    () => instructors.filter((i) => !busySet.has(i._id)),
    [instructors, busySet],
  );

  // Reset instructor if they become unavailable
  useEffect(() => {
    const currentInstructor = form.getValues('instructorId');
    if (currentInstructor && busySet.has(currentInstructor)) {
      form.setValue('instructorId', '');
    }
  }, [busySet, form]);

  // Reset selected slots when room or academic year changes
  useEffect(() => {
    setSelectedSlots([]);
    form.setValue('instructorId', '');
  }, [watchedRoomId, watchedAcademicYearId, form]);

  const { createMutation } = useClassMutations();

  const onSubmit = async (values: ClassFormValues) => {
    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    createMutation.mutate(
      {
        ...values,
        schedules: schedulePayload,
        status: 'active',
      } as any,
      {
        onSuccess: () => {
          router.push('/admin/classes');
        },
      },
    );
  };

  const shifts = roomGrid?.shifts ?? [];
  const days = roomGrid?.days ?? [1, 2, 3, 4, 5];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* Step 1: Subject, Room, Academic Year */}
        <div className='space-y-4'>
          <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
            Step 1 — Class Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Code</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. CS101-A' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='maxCapacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='academicYearId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Academic Year</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={yearsLoading ? 'Loading...' : 'Select academic year'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year._id} value={year._id}>
                          {year.name} ({year.semester})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='subjectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={subjectsLoading ? 'Loading...' : 'Select subject'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='roomId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={roomsLoading ? 'Loading...' : 'Select room'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          {room.name} (capacity: {room.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Step 2: TimeGrid — only shows when room + academic year selected */}
        {watchedRoomId && watchedAcademicYearId && (
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
              Step 2 — Select Schedule Slots
            </h3>
            {gridLoading ? (
              <div className='text-sm text-slate-500'>Loading room schedule...</div>
            ) : shifts.length > 0 ? (
              <>
                <p className='text-xs text-slate-500'>
                  Click or drag to select slots. Gray cells are already booked.
                </p>
                <TimeGrid
                  selected={selectedSlots}
                  onChange={setSelectedSlots}
                  busyGrid={roomGrid?.grid}
                  shifts={shifts}
                  days={days}
                />
                {selectedSlots.length > 0 && (
                  <p className='text-xs text-blue-600 dark:text-blue-400'>
                    {selectedSlots.length} slot(s) selected
                  </p>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* Step 3: Instructor — only shows when slots are selected */}
        {selectedSlots.length > 0 && (
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
              Step 3 — Assign Instructor
            </h3>
            <FormField
              control={form.control}
              name='instructorId'
              render={({ field }) => (
                <FormItem className='max-w-sm'>
                  <FormLabel>Instructor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            instructorsLoading
                              ? 'Loading...'
                              : availableInstructors.length === 0
                                ? 'No available instructors'
                                : 'Select instructor'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableInstructors.map((instructor) => (
                        <SelectItem key={instructor._id} value={instructor._id}>
                          {instructor.firstName} {instructor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className='flex gap-3'>
          <Button
            type='submit'
            disabled={createMutation.isPending || selectedSlots.length === 0}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Class'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/classes')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
