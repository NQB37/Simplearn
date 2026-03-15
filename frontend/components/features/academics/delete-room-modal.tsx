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
import { Room } from '@/types/academics.type';
import { useRoomMutations } from '@/hooks/use-academics';

interface DeleteRoomModalProps {
  room: Room;
}

export function DeleteRoomModal({ room }: DeleteRoomModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { deleteMutation } = useRoomMutations();

  const handleDelete = async () => {
    if (!room) return;

    deleteMutation.mutate(room._id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Class Room</DialogTitle>
        </DialogHeader>
        <p className='text-sm text-slate-500'>
          Are you sure you want to delete the room{' '}
          <strong>{room?.name}</strong>? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
