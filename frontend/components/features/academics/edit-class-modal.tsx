import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { ClassModel, Room, Subject, AcademicYear } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface EditClassModalProps {
  classData: ClassModel;
  onSuccess: () => void;
  rooms: Room[];
  subjects: Subject[];
  academicYears: AcademicYear[];
}

export function EditClassModal({
  classData,
  onSuccess,
  rooms,
  subjects,
  academicYears,
}: EditClassModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classForm, setClassForm] = useState<{
    code: string;
    roomId: string;
    subjectId: string;
    academicYearId: string;
    maxCapacity: number;
    status: ClassModel['status'];
  }>({
    code: '',
    roomId: '',
    subjectId: '',
    academicYearId: '',
    maxCapacity: 30,
    status: 'active',
  });

  useEffect(() => {
    if (classData) {
      setClassForm({
        code: classData.code,
        roomId:
          typeof classData.roomId === 'string'
            ? classData.roomId
            : (classData.roomId as Room)._id,
        subjectId:
          typeof classData.subjectId === 'string'
            ? classData.subjectId
            : (classData.subjectId as Subject)._id,
        academicYearId:
          typeof classData.academicYearId === 'string'
            ? classData.academicYearId
            : (classData.academicYearId as AcademicYear)._id,
        maxCapacity: classData.maxCapacity,
        status: classData.status,
      });
    }
  }, [classData, isOpen]);

  const handleSave = async () => {
    if (
      !classForm.code ||
      !classForm.roomId ||
      !classForm.subjectId ||
      !classForm.academicYearId ||
      classForm.maxCapacity <= 0
    ) {
      toast.error('Please fill out all fields correctly');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/classes/${classData._id}`,
        classForm,
      );
      toast.success('Class updated');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating class:', error);
      toast.error('Failed to update class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50'
        >
          <Edit2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] overflow-visible'>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-code'>Class Code</Label>
            <Input
              id='edit-class-code'
              placeholder='e.g., MATH101-A'
              value={classForm.code}
              onChange={(e) =>
                setClassForm({ ...classForm, code: e.target.value })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-subject'>Subject</Label>
            <select
              id='edit-class-subject'
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={classForm.subjectId}
              onChange={(e) =>
                setClassForm({ ...classForm, subjectId: e.target.value })
              }
            >
              <option
                value=''
                disabled
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Select Subject
              </option>
              {subjects.map((sub) => (
                <option
                  key={sub._id}
                  value={sub._id}
                  className='dark:bg-slate-900 dark:text-slate-100'
                >
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-room'>Room</Label>
            <select
              id='edit-class-room'
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={classForm.roomId}
              onChange={(e) =>
                setClassForm({ ...classForm, roomId: e.target.value })
              }
            >
              <option
                value=''
                disabled
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Select Room
              </option>
              {rooms.map((room) => (
                <option
                  key={room._id}
                  value={room._id}
                  className='dark:bg-slate-900 dark:text-slate-100'
                >
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-year'>Academic Year</Label>
            <select
              id='edit-class-year'
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={classForm.academicYearId}
              onChange={(e) =>
                setClassForm({ ...classForm, academicYearId: e.target.value })
              }
            >
              <option
                value=''
                disabled
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Select Year
              </option>
              {academicYears.map((year) => (
                <option
                  key={year._id}
                  value={year._id}
                  className='dark:bg-slate-900 dark:text-slate-100'
                >
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-capacity'>Max Capacity</Label>
            <Input
              id='edit-class-capacity'
              type='number'
              value={classForm.maxCapacity}
              onChange={(e) =>
                setClassForm({
                  ...classForm,
                  maxCapacity: Number(e.target.value),
                })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-status'>Status</Label>
            <select
              id='edit-class-status'
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={classForm.status}
              onChange={(e) =>
                setClassForm({
                  ...classForm,
                  status: e.target.value as ClassModel['status'],
                })
              }
            >
              <option
                value='active'
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Active
              </option>
              <option
                value='inactive'
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Inactive
              </option>
              <option
                value='archived'
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Archived
              </option>
            </select>
          </div>
        </div>
        <DialogFooter className='pt-2'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
