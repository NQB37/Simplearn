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
import { AcademicYear } from '@/types/academics.type';
import { toast } from 'sonner';
import { useAcademicYearMutations } from '@/hooks/use-academics';

interface EditYearModalProps {
  year: AcademicYear;
}

export function EditYearModal({ year }: EditYearModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [yearForm, setYearForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false,
  });

  const { updateMutation } = useAcademicYearMutations();

  useEffect(() => {
    if (year) {
      setYearForm({
        name: year.name,
        startDate: year.startDate,
        endDate: year.endDate,
        isActive: year.isActive,
      });
    }
  }, [year, isOpen]);

  const handleSave = async () => {
    if (!yearForm.name || !yearForm.startDate || !yearForm.endDate) {
      toast.error('Please fill in all fields');
      return;
    }

    updateMutation.mutate(
      { id: year._id, payload: yearForm },
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
              onChange={(e) =>
                setYearForm({ ...yearForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-startDate'>Start Date</Label>
            <Input
              id='edit-startDate'
              type='date'
              value={yearForm.startDate}
              onChange={(e) =>
                setYearForm({ ...yearForm, startDate: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-endDate'>End Date</Label>
            <Input
              id='edit-endDate'
              type='date'
              value={yearForm.endDate}
              onChange={(e) =>
                setYearForm({ ...yearForm, endDate: e.target.value })
              }
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='edit-isActive'
              checked={yearForm.isActive}
              onChange={(e) =>
                setYearForm({ ...yearForm, isActive: e.target.checked })
              }
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
