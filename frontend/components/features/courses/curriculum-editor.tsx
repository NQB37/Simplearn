'use client';

import * as React from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  FileText,
  Video,
  Pencil,
  Type,
} from 'lucide-react';

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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Module } from '@/types/course.type';
import { useModules, useModuleMutations } from '@/hooks/use-courses';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  freePreview: boolean;
}

// Local interface for UI display - modules now have lessons as local state
interface ModuleWithLessons {
  _id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

interface CurriculumEditorProps {
  courseId: string;
}

interface SortableModuleProps {
  module: ModuleWithLessons;
  isEditing: boolean;
  newTitle: string;
  onTitleChange: (title: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onAddLesson: (type: Lesson['type']) => void;
  onDeleteLesson: (lessonId: string) => void;
}

function SortableModule({
  module,
  isEditing,
  newTitle,
  onTitleChange,
  onSaveTitle,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onAddLesson,
  onDeleteLesson,
}: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={module._id}
        className='border rounded-lg px-4 bg-muted/10'
      >
        <AccordionTrigger className='hover:no-underline py-4'>
          <div className='flex items-center w-full gap-4'>
            <GripVertical
              className='h-4 w-4 text-muted-foreground mr-2 cursor-grab shrink-0'
              onClick={(e) => e.stopPropagation()}
              {...attributes}
              {...listeners}
            />

            {isEditing ? (
              <div
                className='flex items-center gap-2 flex-1 mr-4'
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  value={newTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className='h-8'
                  autoFocus
                />
                <Button size='sm' onClick={onSaveTitle}>
                  Save
                </Button>
                <Button size='sm' variant='ghost' onClick={onCancelEdit}>
                  Cancel
                </Button>
              </div>
            ) : (
              <span className='font-semibold text-left flex-1'>
                {module.title}
              </span>
            )}

            <div
              className='flex items-center gap-2'
              onClick={(e) => e.stopPropagation()}
            >
              <Badge variant='secondary' className='mr-2'>
                {module.lessons.length} Lessons
              </Badge>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8'
                onClick={onStartEdit}
              >
                <Pencil className='h-4 w-4' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 text-destructive hover:text-destructive/90'
                onClick={onDelete}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='pt-2 pb-4 space-y-2'>
          {module.lessons.length === 0 && (
            <p className='text-sm text-muted-foreground text-center py-4 italic'>
              No lessons in this module yet.
            </p>
          )}

          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className='flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group'
            >
              <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='p-2 bg-background border rounded-md'>
                {lesson.type === 'video' ? (
                  <Video className='h-4 w-4 text-blue-500' />
                ) : lesson.type === 'pdf' ? (
                  <FileText className='h-4 w-4 text-red-500' />
                ) : (
                  <Type className='h-4 w-4 text-green-500' />
                )}
              </div>
              <span className='flex-1 text-sm font-medium'>{lesson.title}</span>
              <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                <Button size='icon' variant='ghost' className='h-7 w-7'>
                  <Pencil className='h-3 w-3' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 text-destructive'
                  onClick={() => onDeleteLesson(lesson.id)}
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
            </div>
          ))}

          <div className='flex justify-center mt-4 pt-2 border-t border-dashed'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground'
                >
                  <Plus className='h-4 w-4 mr-2' /> Add Lesson Content
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='center'>
                <DropdownMenuItem onClick={() => onAddLesson('video')}>
                  <Video className='h-4 w-4 mr-2' /> Video
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddLesson('text')}>
                  <Type className='h-4 w-4 mr-2' /> Text / Article
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddLesson('pdf')}>
                  <FileText className='h-4 w-4 mr-2' /> PDF Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export function CurriculumEditor({ courseId }: CurriculumEditorProps) {
  const { data: modules = [], isLoading } = useModules(courseId);
  const { createMutation, updateMutation, deleteMutation, reorderMutation } = useModuleMutations(courseId);

  const [isEditingModule, setIsEditingModule] = React.useState<string | null>(null);
  const [newModuleTitle, setNewModuleTitle] = React.useState('');

  // Local state for lessons (not persisted)
  const [moduleLessons, setModuleLessons] = React.useState<Record<string, Lesson[]>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Create modules with lessons for display
  const modulesWithLessons: ModuleWithLessons[] = modules.map((module) => ({
    ...module,
    lessons: moduleLessons[module._id] || [],
  }));

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
    // Clean up lessons for deleted module
    setModuleLessons(prev => {
      const updated = { ...prev };
      delete updated[moduleId];
      return updated;
    });
  };

  const handleUpdateModuleTitle = (moduleId: string) => {
    updateMutation.mutate({ moduleId, data: { title: newModuleTitle } });
    setIsEditingModule(null);
  };

  const handleAddLesson = (moduleId: string, type: Lesson['type']) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `New ${type} lesson`,
      type,
      freePreview: false,
    };
    setModuleLessons(prev => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] || []), newLesson],
    }));
    toast.success(`Added ${type} lesson`);
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModuleLessons(prev => ({
      ...prev,
      [moduleId]: (prev[moduleId] || []).filter(l => l.id !== lessonId),
    }));
    toast.success('Lesson deleted');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading curriculum...</div>;
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
          items={modulesWithLessons.map((m) => m._id)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type='multiple' className='w-full space-y-4'>
            {modulesWithLessons.map((module) => (
              <SortableModule
                key={module._id}
                module={module}
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
                onAddLesson={(type) => handleAddLesson(module._id, type)}
                onDeleteLesson={(lessonId) =>
                  handleDeleteLesson(module._id, lessonId)
                }
              />
            ))}
          </Accordion>
        </SortableContext>
      </DndContext>

      {modulesWithLessons.length === 0 && (
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
