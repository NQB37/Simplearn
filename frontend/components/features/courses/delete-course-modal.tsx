'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  isPending: boolean;
  onConfirm: () => void;
}

export function DeleteCourseModal({
  open,
  onOpenChange,
  slug,
  isPending,
  onConfirm,
}: DeleteCourseModalProps) {
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (!open) setInputValue('');
  }, [open]);

  const confirmed = inputValue === slug;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            This action is irreversible. The course and all its content will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            To confirm, type the course slug{' '}
            <span className='font-mono font-semibold text-foreground'>
              {slug}
            </span>{' '}
            below.
          </p>
          <div className='grid gap-2'>
            <Label htmlFor='delete-confirm-input'>Course slug</Label>
            <Input
              id='delete-confirm-input'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={slug}
              autoComplete='off'
            />
          </div>
        </div>

        <DialogFooter showCloseButton>
          <Button
            variant='destructive'
            disabled={!confirmed || isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Deleting...' : 'Delete Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
