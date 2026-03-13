import { useState } from 'react';
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
import { Plus } from 'lucide-react';
import { ClassModel, Room, Subject, AcademicYear } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface AddClassModalProps {
  onSuccess: () => void;
  rooms: Room[];
  subjects: Subject[];
  academicYears: AcademicYear[];
}

export function AddClassModal({
  onSuccess,
  rooms,
  subjects,
  academicYears,
}: AddClassModalProps) {
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
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/classes`,
        classForm,
      );
      toast.success('Class created');
      setClassForm({
        code: '',
        roomId: '',
        subjectId: '',
        academicYearId: '',
        maxCapacity: 30,
        status: 'active',
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 text-xs rounded-lg'
        >
          <Plus className='h-4 w-4 mr-1' /> Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] overflow-visible'>
        <DialogHeader>
          <DialogTitle>Add Class</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-class-code'>Class Code</Label>
            <Input
              id='add-class-code'
              placeholder='e.g., MATH101-A'
              value={classForm.code}
              onChange={(e) =>
                setClassForm({ ...classForm, code: e.target.value })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-class-subject'>Subject</Label>
            <select
              id='add-class-subject'
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
            <Label htmlFor='add-class-room'>Room</Label>
            <select
              id='add-class-room'
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
            <Label htmlFor='add-class-year'>Academic Year</Label>
            <select
              id='add-class-year'
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
            <Label htmlFor='add-class-capacity'>Max Capacity</Label>
            <Input
              id='add-class-capacity'
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
            <Label htmlFor='add-class-status'>Status</Label>
            <select
              id='add-class-status'
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
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
