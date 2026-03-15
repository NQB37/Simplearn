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
import { Subject } from '@/types/academics.type';
import { toast } from 'sonner';
import { useSubjectMutations } from '@/hooks/use-academics';

interface EditSubjectModalProps {
  subject: Subject;
}

export function EditSubjectModal({ subject }: EditSubjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: 0,
  });

  const { updateMutation } = useSubjectMutations();

  useEffect(() => {
    if (subject) {
      setSubjectForm({
        name: subject.name,
        code: subject.code,
        credits: subject.credits,
      });
    }
  }, [subject, isOpen]);

  const handleSave = async () => {
    if (!subjectForm.name || !subjectForm.code || subjectForm.credits < 0) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    updateMutation.mutate(
      { id: subject._id, payload: subjectForm },
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
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-name'>Subject Name</Label>
            <Input
              id='edit-subject-name'
              placeholder='e.g., Mathematics I'
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-code'>Subject Code</Label>
            <Input
              id='edit-subject-code'
              placeholder='e.g., MATH101'
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, code: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-credits'>Credits</Label>
            <Input
              id='edit-subject-credits'
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
