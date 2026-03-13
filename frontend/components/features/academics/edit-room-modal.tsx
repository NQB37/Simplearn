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
import { Room } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface EditRoomModalProps {
  room: Room;
  onSuccess: () => void;
}

export function EditRoomModal({ room, onSuccess }: EditRoomModalProps) {
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

  useEffect(() => {
    if (room) {
      setRoomForm({
        name: room.name,
        capacity: room.capacity,
        status: room.status,
      });
    }
  }, [room, isOpen]);

  const handleSave = async () => {
    if (!roomForm.name || roomForm.capacity <= 0) {
      toast.error('Please provide a valid name and capacity');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/rooms/${room._id}`,
        roomForm,
      );
      toast.success('Room updated');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
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
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-room-name'>Room Name</Label>
            <Input
              id='edit-room-name'
              placeholder='e.g., Room 101'
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-capacity'>Capacity</Label>
            <Input
              id='edit-capacity'
              type='number'
              value={roomForm.capacity}
              onChange={(e) =>
                setRoomForm({ ...roomForm, capacity: Number(e.target.value) })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='edit-status'>Status</Label>
            <select
              id='edit-status'
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
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
