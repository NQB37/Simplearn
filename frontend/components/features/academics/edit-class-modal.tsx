'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClassModel, Subject, Room, AcademicYear } from '@/types/academics.type';
import { useClassMutations, useRooms, useSubjects, useAcademicYears, useRoomAvailabilityGrid } from '@/hooks/use-academics';
import { useInstructors } from '@/hooks/use-user';
import { TimeGrid } from './time-grid';

interface EditClassModalProps {
  classData: ClassModel;
}

export function EditClassModal({ classData }: EditClassModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [classForm, setClassForm] = useState({
    code: '',
    subjectId: '',
    roomId: '',
    academicYearId: '',
    instructorId: '',
    maxCapacity: 0,
    status: 'active' as const,
  });
  const [selectedSlots, setSelectedSlots] = useState<Array<[number, number]>>([]);

  const { data: rooms = [] } = useRooms();
  const { data: subjects = [] } = useSubjects();
  const { data: academicYears = [] } = useAcademicYears();
  const { data: instructors = [] } = useInstructors();
  const { updateMutation } = useClassMutations();

  const { data: roomGrid, isLoading: gridLoading } = useRoomAvailabilityGrid(
    classForm.roomId || null,
    classForm.academicYearId || null,
  );

  const shifts = roomGrid?.shifts ?? [];
  const days = roomGrid?.days ?? [1, 2, 3, 4, 5];

  // Exclude the current class's own slots from the busy grid so they appear selectable
  const busyGrid = useMemo(() => {
    if (!roomGrid?.grid) return {};
    const grid = structuredClone(roomGrid.grid);
    for (const [day, shiftMap] of Object.entries(grid)) {
      for (const [shift, cell] of Object.entries(shiftMap as any)) {
        if ((cell as any).classId === classData._id) {
          (grid as any)[day][shift] = { free: true };
        }
      }
    }
    return grid;
  }, [roomGrid, classData._id]);

  useEffect(() => {
    if (classData) {
      setClassForm({
        code: classData.code,
        subjectId:
          typeof classData.subjectId === 'string'
            ? classData.subjectId
            : (classData.subjectId as Subject)?._id ?? '',
        roomId:
          typeof classData.roomId === 'string'
            ? classData.roomId
            : (classData.roomId as Room)?._id ?? '',
        academicYearId:
          typeof classData.academicYearId === 'string'
            ? classData.academicYearId
            : (classData.academicYearId as AcademicYear)?._id ?? '',
        instructorId: classData.instructorId ?? '',
        maxCapacity: classData.maxCapacity,
        status: classData.status as any,
      });
      setSelectedSlots(
        (classData.schedules ?? []).map((s) => [s.dayOfWeek, s.shiftId] as [number, number]),
      );
    }
  }, [classData, isOpen]);

  // Reset slots when room or academic year changes
  useEffect(() => {
    setSelectedSlots([]);
  }, [classForm.roomId, classForm.academicYearId]);

  const handleSave = async () => {
    if (
      !classForm.code ||
      !classForm.subjectId ||
      !classForm.roomId ||
      !classForm.academicYearId
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const schedules = selectedSlots.map(([dayOfWeek, shiftId]) => ({ dayOfWeek, shiftId }));
    const payload: any = { ...classForm, schedules };
    if (!payload.instructorId) delete payload.instructorId;

    updateMutation.mutate(
      { id: classData._id, payload },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        >
          <Edit2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Class Details</DialogTitle>
        </DialogHeader>
        <div className='space-y-8 py-4'>
          {/* Step 1: Class Details */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
              Class Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='edit-class-code'>Class Code</Label>
                <Input
                  id='edit-class-code'
                  placeholder='e.g., MATH101-A'
                  value={classForm.code}
                  onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label htmlFor='edit-class-capacity'>Max Capacity</Label>
                <Input
                  id='edit-class-capacity'
                  type='number'
                  value={classForm.maxCapacity}
                  onChange={(e) =>
                    setClassForm({ ...classForm, maxCapacity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Academic Year</Label>
                <Select
                  value={classForm.academicYearId}
                  onValueChange={(val) => setClassForm({ ...classForm, academicYearId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select academic year' />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((y) => (
                      <SelectItem key={y._id} value={y._id}>
                        {y.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Subject</Label>
                <Select
                  value={classForm.subjectId}
                  onValueChange={(val) => setClassForm({ ...classForm, subjectId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select subject' />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Room</Label>
                <Select
                  value={classForm.roomId}
                  onValueChange={(val) => setClassForm({ ...classForm, roomId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select room' />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r._id} value={r._id}>
                        {r.name} (Cap: {r.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Status</Label>
                <Select
                  value={classForm.status}
                  onValueChange={(val) => setClassForm({ ...classForm, status: val as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Inactive</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-2'>
                <Label>Instructor <span className='font-normal text-slate-400'>(Optional)</span></Label>
                <Select
                  value={classForm.instructorId}
                  onValueChange={(val) => setClassForm({ ...classForm, instructorId: val === '__none__' ? '' : val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select instructor' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='__none__'>None</SelectItem>
                    {instructors.map((i) => (
                      <SelectItem key={i._id} value={i._id}>
                        {i.firstName} {i.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Step 2: Schedule */}
          {classForm.roomId && classForm.academicYearId && (
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider'>
                Schedule
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
                    busyGrid={busyGrid}
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
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
