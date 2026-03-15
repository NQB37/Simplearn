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
import { useSubjectMutations } from '@/hooks/use-academics';

export function AddSubjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: 3,
  });

  const { createMutation } = useSubjectMutations();

  const handleSave = async () => {
    if (!subjectForm.name || !subjectForm.code || subjectForm.credits < 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    createMutation.mutate(subjectForm, {
      onSuccess: () => {
        setSubjectForm({ name: '', code: '', credits: 3 });
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
          <Plus className='h-4 w-4 mr-1' /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Subject to Catalog</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='subject-name'>Subject Name</Label>
            <Input
              id='subject-name'
              placeholder='e.g., Mathematics I'
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='subject-code'>Subject Code</Label>
            <Input
              id='subject-code'
              placeholder='e.g., MATH101'
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, code: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='subject-credits'>Credits</Label>
            <Input
              id='subject-credits'
              type='number'
              placeholder='e.g., 3'
              value={subjectForm.credits}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  credits: parseInt(e.target.value) || 0,
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
