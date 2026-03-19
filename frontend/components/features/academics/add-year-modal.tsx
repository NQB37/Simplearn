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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAcademicYearMutations } from '@/hooks/use-academics';
import { Semester } from '@/types/academics.type';

export function AddYearModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [yearForm, setYearForm] = useState({
    name: '',
    semester: '' as Semester | '',
    startDate: '',
    endDate: '',
    enrollmentDeadline: '',
    isActive: false,
  });

  const { createMutation } = useAcademicYearMutations();

  const handleSave = async () => {
    if (!yearForm.name || !yearForm.semester || !yearForm.startDate || !yearForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      name: yearForm.name,
      semester: yearForm.semester as Semester,
      startDate: yearForm.startDate,
      endDate: yearForm.endDate,
      isActive: yearForm.isActive,
      ...(yearForm.enrollmentDeadline && { enrollmentDeadline: yearForm.enrollmentDeadline }),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setYearForm({ name: '', semester: '', startDate: '', endDate: '', enrollmentDeadline: '', isActive: false });
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
          <Plus className='h-4 w-4 mr-1' /> Add Year
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Academic Year</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-year-name'>Year Name</Label>
            <Input
              id='add-year-name'
              placeholder='e.g., 2025-2026'
              value={yearForm.name}
              onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-semester'>Semester</Label>
            <Select
              value={yearForm.semester}
              onValueChange={(val) => setYearForm({ ...yearForm, semester: val as Semester })}
            >
              <SelectTrigger id='add-semester'>
                <SelectValue placeholder='Select semester' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='first'>First Semester</SelectItem>
                <SelectItem value='second'>Second Semester</SelectItem>
                <SelectItem value='summer'>Summer Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-startDate'>Start Date</Label>
            <Input
              id='add-startDate'
              type='date'
              value={yearForm.startDate}
              onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-endDate'>End Date</Label>
            <Input
              id='add-endDate'
              type='date'
              value={yearForm.endDate}
              onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-enrollmentDeadline'>Enrollment Deadline <span className='text-slate-400 font-normal'>(optional)</span></Label>
            <Input
              id='add-enrollmentDeadline'
              type='datetime-local'
              value={yearForm.enrollmentDeadline}
              onChange={(e) => setYearForm({ ...yearForm, enrollmentDeadline: e.target.value })}
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='add-isActive'
              checked={yearForm.isActive}
              onChange={(e) => setYearForm({ ...yearForm, isActive: e.target.checked })}
              className='w-4 h-4 mt-0.5'
            />
            <Label htmlFor='add-isActive' className='cursor-pointer'>
              Set as Active Year
            </Label>
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
