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
import { toast } from 'sonner';
import { ClassModel, Subject, Room, AcademicYear } from '@/types/academics.type';
import { useClassMutations, useRooms, useSubjects, useAcademicYears } from '@/hooks/use-academics';

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
    maxCapacity: 0,
    status: 'active' as const,
  });

  const { data: rooms = [] } = useRooms();
  const { data: subjects = [] } = useSubjects();
  const { data: academicYears = [] } = useAcademicYears();
  const { updateMutation } = useClassMutations();

  useEffect(() => {
    if (classData) {
      setClassForm({
        code: classData.code,
        subjectId:
          typeof classData.subjectId === 'string'
            ? classData.subjectId
            : (classData.subjectId as Subject)._id,
        roomId:
          typeof classData.roomId === 'string'
            ? classData.roomId
            : (classData.roomId as Room)._id,
        academicYearId:
          typeof classData.academicYearId === 'string'
            ? classData.academicYearId
            : (classData.academicYearId as AcademicYear)._id,
        maxCapacity: classData.maxCapacity,
        status: classData.status as any,
      });
    }
  }, [classData, isOpen]);

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

    updateMutation.mutate(
      { id: classData._id, payload: classForm },
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
      <DialogContent className='sm:max-w-[425px] overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Edit Class Details</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
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
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={classForm.subjectId}
              onChange={(e) =>
                setClassForm({ ...classForm, subjectId: e.target.value })
              }
            >
              <option value=''>Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-room'>Room</Label>
            <select
              id='edit-class-room'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={classForm.roomId}
              onChange={(e) =>
                setClassForm({ ...classForm, roomId: e.target.value })
              }
            >
              <option value=''>Select Room</option>
              {rooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} (Cap: {r.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-year'>Academic Year</Label>
            <select
              id='edit-class-year'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={classForm.academicYearId}
              onChange={(e) =>
                setClassForm({ ...classForm, academicYearId: e.target.value })
              }
            >
              <option value=''>Select Year</option>
              {academicYears.map((y) => (
                <option key={y._id} value={y._id}>
                  {y.name}
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
                  maxCapacity: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-class-status'>Status</Label>
            <select
              id='edit-class-status'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
              value={classForm.status}
              onChange={(e) =>
                setClassForm({ ...classForm, status: e.target.value as any })
              }
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='archived'>Archived</option>
            </select>
          </div>
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
