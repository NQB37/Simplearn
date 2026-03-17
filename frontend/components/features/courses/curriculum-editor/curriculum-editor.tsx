'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useModules, useModuleMutations } from '@/hooks/use-courses';
import { SortableModule } from './sortable-module';

interface CurriculumEditorProps {
  courseId: string;
}

export function CurriculumEditor({ courseId }: CurriculumEditorProps) {
  const { data: modules = [], isLoading } = useModules(courseId);
  const { createMutation, updateMutation, deleteMutation, reorderMutation } =
    useModuleMutations(courseId);

  const [isEditingModule, setIsEditingModule] = React.useState<string | null>(
    null,
  );
  const [newModuleTitle, setNewModuleTitle] = React.useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m._id === active.id);
      const newIndex = modules.findIndex((m) => m._id === over.id);
      const reorderedModules = arrayMove(modules, oldIndex, newIndex);
      const orderedIds = reorderedModules.map((m) => m._id);
      reorderMutation.mutate(orderedIds);
    }
  };

  const handleAddModule = () => {
    createMutation.mutate({ title: 'New Module' });
  };

  const handleDeleteModule = (moduleId: string) => {
    deleteMutation.mutate(moduleId);
  };

  const handleUpdateModuleTitle = (moduleId: string) => {
    updateMutation.mutate({ moduleId, data: { title: newModuleTitle } });
    setIsEditingModule(null);
  };

  if (isLoading) {
    return <div className='text-center py-8'>Loading curriculum...</div>;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium'>Curriculum Structure</h3>
        <Button onClick={handleAddModule} size='sm'>
          <Plus className='h-4 w-4 mr-2' /> Add Module
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type='multiple' className='w-full space-y-4'>
            {modules.map((module) => (
              <SortableModule
                key={module._id}
                module={module}
                courseId={courseId}
                isEditing={isEditingModule === module._id}
                newTitle={newModuleTitle}
                onTitleChange={setNewModuleTitle}
                onSaveTitle={() => handleUpdateModuleTitle(module._id)}
                onCancelEdit={() => setIsEditingModule(null)}
                onStartEdit={() => {
                  setIsEditingModule(module._id);
                  setNewModuleTitle(module.title);
                }}
                onDelete={() => handleDeleteModule(module._id)}
              />
            ))}
          </Accordion>
        </SortableContext>
      </DndContext>

      {modules.length === 0 && (
        <div className='text-center py-12 border-2 border-dashed rounded-lg bg-muted/5'>
          <p className='text-muted-foreground mb-4'>
            Start building your course structure
          </p>
          <Button onClick={handleAddModule}>
            <Plus className='h-4 w-4 mr-2' /> Create First Module
          </Button>
        </div>
      )}
    </div>
  );
}
