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
import { toast } from 'sonner';
import { useClassMutations, useRooms, useSubjects, useAcademicYears } from '@/hooks/use-academics';

export function AddClassModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [classForm, setClassForm] = useState({
    code: '',
    subjectId: '',
    roomId: '',
    academicYearId: '',
    maxCapacity: 30,
    status: 'active' as const,
  });

  const { data: rooms = [] } = useRooms();
  const { data: subjects = [] } = useSubjects();
  const { data: academicYears = [] } = useAcademicYears();
  const { createMutation } = useClassMutations();

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

    createMutation.mutate(classForm, {
      onSuccess: () => {
        setClassForm({
          code: '',
          subjectId: '',
          roomId: '',
          academicYearId: '',
          maxCapacity: 30,
          status: 'active',
        });
        setIsOpen(false);
      },
    });
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
      <DialogContent className='sm:max-w-[425px] overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>Open New Class</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='class-code'>Class Code</Label>
            <Input
              id='class-code'
              placeholder='e.g., MATH101-A'
              value={classForm.code}
              onChange={(e) =>
                setClassForm({ ...classForm, code: e.target.value })
              }
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='class-subject'>Subject</Label>
            <select
              id='class-subject'
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
            <Label htmlFor='class-room'>Room</Label>
            <select
              id='class-room'
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
            <Label htmlFor='class-year'>Academic Year</Label>
            <select
              id='class-year'
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
            <Label htmlFor='class-capacity'>Max Capacity</Label>
            <Input
              id='class-capacity'
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
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createMutation.isPending}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
