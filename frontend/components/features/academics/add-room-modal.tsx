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
import { useRoomMutations } from '@/hooks/use-academics';

export function AddRoomModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: 0,
    status: 'active' as const,
  });

  const { createMutation } = useRoomMutations();

  const handleSave = async () => {
    if (!roomForm.name || roomForm.capacity <= 0) {
      toast.error('Please provide a valid name and capacity');
      return;
    }

    createMutation.mutate(roomForm, {
      onSuccess: () => {
        setRoomForm({ name: '', capacity: 0, status: 'active' });
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
          <Plus className='h-4 w-4 mr-1' /> Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Class Room</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='room-name'>Room Name</Label>
            <Input
              id='room-name'
              placeholder='e.g., Room 101'
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({ ...roomForm, name: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='room-capacity'>Capacity</Label>
            <Input
              id='room-capacity'
              type='number'
              placeholder='e.g., 30'
              value={roomForm.capacity}
              onChange={(e) =>
                setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='room-status'>Status</Label>
            <select
              id='room-status'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              value={roomForm.status}
              onChange={(e) =>
                setRoomForm({ ...roomForm, status: e.target.value as any })
              }
            >
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
              <option value='maintenance'>Maintenance</option>
            </select>
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
