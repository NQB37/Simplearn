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
import { Subject } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface AddSubjectModalProps {
  onSuccess: () => void;
}

export function AddSubjectModal({ onSuccess }: AddSubjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjectForm, setSubjectForm] = useState<{
    name: string;
    code: string;
    credits: number;
  }>({
    name: '',
    code: '',
    credits: 3,
  });

  const handleSave = async () => {
    if (!subjectForm.name || !subjectForm.code || subjectForm.credits <= 0) {
      toast.error('Please provide a valid name, code, and credits');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/subjects`,
        subjectForm,
      );
      toast.success('Subject created');
      setSubjectForm({ name: '', code: '', credits: 3 });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast.error('Failed to create subject');
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
          <Plus className='h-4 w-4 mr-1' /> Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-subject-code'>Subject Code</Label>
            <Input
              id='add-subject-code'
              placeholder='e.g., CS101'
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, code: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-subject-name'>Subject Name</Label>
            <Input
              id='add-subject-name'
              placeholder='e.g., Intro to Computer Science'
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-subject-credits'>Credits</Label>
            <Input
              id='add-subject-credits'
              type='number'
              value={subjectForm.credits}
              onChange={(e) =>
                setSubjectForm({
                  ...subjectForm,
                  credits: Number(e.target.value),
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
