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
import { Subject } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface EditSubjectModalProps {
  subject: Subject;
  onSuccess: () => void;
}

export function EditSubjectModal({
  subject,
  onSuccess,
}: EditSubjectModalProps) {
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
    if (!subjectForm.name || !subjectForm.code || subjectForm.credits <= 0) {
      toast.error('Please provide a valid name, code, and credits');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/subjects/${subject._id}`,
        subjectForm,
      );
      toast.success('Subject updated');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject');
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-code'>Subject Code</Label>
            <Input
              id='edit-subject-code'
              placeholder='e.g., CS101'
              value={subjectForm.code}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, code: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-name'>Subject Name</Label>
            <Input
              id='edit-subject-name'
              placeholder='e.g., Intro to Computer Science'
              value={subjectForm.name}
              onChange={(e) =>
                setSubjectForm({ ...subjectForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-subject-credits'>Credits</Label>
            <Input
              id='edit-subject-credits'
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
