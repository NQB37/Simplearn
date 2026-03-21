'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassForm } from './class-form';

export function CreateClassModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className='bg-blue-600 hover:bg-blue-700 text-white font-bold'
        onClick={() => setIsOpen(true)}
      >
        <Plus className='h-4 w-4 mr-2' />
        Create Class
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Create Class</DialogTitle>
          </DialogHeader>
          <ClassForm key={isOpen ? 'open' : 'closed'} onSuccess={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
