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
import { Room } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface AddRoomModalProps {
  onSuccess: () => void;
}

export function AddRoomModal({ onSuccess }: AddRoomModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomForm, setRoomForm] = useState<{
    name: string;
    capacity: number;
    status: Room['status'];
  }>({
    name: '',
    capacity: 30,
    status: 'active',
  });

  const handleSave = async () => {
    if (!roomForm.name || roomForm.capacity <= 0) {
      toast.error('Please provide a valid name and capacity');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/rooms`,
        roomForm,
      );
      toast.success('Room created');
      setRoomForm({ name: '', capacity: 30, status: 'active' });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
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
          <Plus className='h-4 w-4 mr-1' /> Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-room-name'>Room Name</Label>
            <Input
              id='add-room-name'
              placeholder='e.g., Room 101'
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-capacity'>Capacity</Label>
            <Input
              id='add-capacity'
              type='number'
              value={roomForm.capacity}
              onChange={(e) =>
                setRoomForm({ ...roomForm, capacity: Number(e.target.value) })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='add-status'>Status</Label>
            <select
              id='add-status'
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
              value={roomForm.status}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  status: e.target.value as Room['status'],
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
                value='maintenance'
                className='dark:bg-slate-900 dark:text-slate-100'
              >
                Maintenance
              </option>
            </select>
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
