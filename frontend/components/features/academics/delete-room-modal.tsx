import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Room } from '../types';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios.api';

interface DeleteRoomModalProps {
  room: Room;
  onSuccess: () => void;
}

export function DeleteRoomModal({ room, onSuccess }: DeleteRoomModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!room) return;

    setLoading(true);
    try {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_ACADEMY_SERVICE_URL}/api/academy/rooms/${room._id}`,
      );
      toast.success('Room deleted');
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
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
          className='h-8 w-8 p-0 text-red-600 hover:bg-red-50'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
        </DialogHeader>
        <p className='text-sm text-slate-500'>
          Are you sure you want to delete the room <strong>{room?.name}</strong>
          ? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
