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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2 } from 'lucide-react';
import { AcademicYear, Semester } from '@/types/academics.type';
import { toast } from 'sonner';
import { useAcademicYearMutations } from '@/hooks/use-academics';

interface EditYearModalProps {
  year: AcademicYear;
}

function toLocalDateString(isoStr: string) {
  if (!isoStr) return '';
  return isoStr.slice(0, 10);
}

function toLocalDatetimeString(isoStr: string) {
  if (!isoStr) return '';
  return isoStr.slice(0, 16);
}

export function EditYearModal({ year }: EditYearModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [yearForm, setYearForm] = useState({
    name: '',
    semester: '' as Semester | '',
    startDate: '',
    endDate: '',
    enrollmentStartDate: '',
    enrollmentDeadline: '',
    isActive: false,
  });

  const { updateMutation } = useAcademicYearMutations();

  useEffect(() => {
    if (year) {
      setYearForm({
        name: year.name,
        semester: year.semester,
        startDate: toLocalDateString(year.startDate),
        endDate: toLocalDateString(year.endDate),
        enrollmentStartDate: year.enrollmentStartDate ? toLocalDatetimeString(year.enrollmentStartDate) : '',
        enrollmentDeadline: year.enrollmentDeadline ? toLocalDatetimeString(year.enrollmentDeadline) : '',
        isActive: year.isActive,
      });
    }
  }, [year, isOpen]);

  const handleSave = async () => {
    if (!yearForm.name || !yearForm.semester || !yearForm.startDate || !yearForm.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload: Partial<AcademicYear> = {
      name: yearForm.name,
      semester: yearForm.semester as Semester,
      startDate: yearForm.startDate,
      endDate: yearForm.endDate,
      isActive: yearForm.isActive,
      ...(yearForm.enrollmentStartDate && { enrollmentStartDate: yearForm.enrollmentStartDate }),
      ...(yearForm.enrollmentDeadline && { enrollmentDeadline: yearForm.enrollmentDeadline }),
    };

    updateMutation.mutate(
      { id: year._id, payload },
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Academic Year</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-year-name'>Year Name</Label>
            <Input
              id='edit-year-name'
              placeholder='e.g., 2025-2026'
              value={yearForm.name}
              onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-semester'>Semester</Label>
            <Select
              value={yearForm.semester}
              onValueChange={(val) => setYearForm({ ...yearForm, semester: val as Semester })}
            >
              <SelectTrigger id='edit-semester'>
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
            <Label htmlFor='edit-startDate'>Start Date</Label>
            <Input
              id='edit-startDate'
              type='date'
              value={yearForm.startDate}
              onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-endDate'>End Date</Label>
            <Input
              id='edit-endDate'
              type='date'
              value={yearForm.endDate}
              onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-enrollmentStartDate'>Enrollment Start Date <span className='text-slate-400 font-normal'>(optional)</span></Label>
            <Input
              id='edit-enrollmentStartDate'
              type='datetime-local'
              value={yearForm.enrollmentStartDate}
              onChange={(e) => setYearForm({ ...yearForm, enrollmentStartDate: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-enrollmentDeadline'>Enrollment Deadline <span className='text-slate-400 font-normal'>(optional)</span></Label>
            <Input
              id='edit-enrollmentDeadline'
              type='datetime-local'
              value={yearForm.enrollmentDeadline}
              onChange={(e) => setYearForm({ ...yearForm, enrollmentDeadline: e.target.value })}
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='edit-isActive'
              checked={yearForm.isActive}
              onChange={(e) => setYearForm({ ...yearForm, isActive: e.target.checked })}
              className='w-4 h-4 mt-0.5'
            />
            <Label htmlFor='edit-isActive' className='cursor-pointer'>
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
