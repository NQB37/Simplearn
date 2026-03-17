'use client';

import * as React from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Accordion as AccordionPrimitive } from 'radix-ui';
import { AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Module } from '@/types/course.type';
import { useLessons, useLessonMutations } from '@/hooks/use-courses';
import { LessonPanel } from './lesson-panel';

interface SortableModuleProps {
  module: Module;
  courseId: string;
  isEditing: boolean;
  newTitle: string;
  onTitleChange: (title: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
}

export function SortableModule({
  module,
  courseId,
  isEditing,
  newTitle,
  onTitleChange,
  onSaveTitle,
  onCancelEdit,
  onStartEdit,
  onDelete,
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

  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(
    courseId,
    module._id,
  );
  const {
    createMutation: lessonCreateMutation,
    updateMutation: lessonUpdateMutation,
    deleteMutation: lessonDeleteMutation,
  } = useLessonMutations(courseId, module._id);

  const [expandedLessonIds, setExpandedLessonIds] = React.useState<Set<string>>(
    new Set(),
  );
  const [editingLessonId, setEditingLessonId] = React.useState<string | null>(
    null,
  );
  const [lessonTitleDraft, setLessonTitleDraft] = React.useState('');

  function toggleLesson(lessonId: string) {
    setExpandedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  }

  function handleSaveLessonTitle(lessonId: string) {
    lessonUpdateMutation.mutate({
      lessonId,
      data: { title: lessonTitleDraft },
    });
    setEditingLessonId(null);
  }

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={module._id}
        className='border rounded-lg px-4 bg-muted/10'
      >
        <AccordionPrimitive.Header className='flex items-center w-full gap-2 py-4'>
          <GripVertical
            className='h-4 w-4 text-muted-foreground cursor-grab shrink-0'
            onClick={(e) => e.stopPropagation()}
            {...attributes}
            {...listeners}
          />

          {isEditing ? (
            <div className='flex items-center gap-2 flex-1'>
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
            <AccordionPrimitive.Trigger className='flex flex-1 items-center text-left font-semibold outline-none [&[data-state=open]>svg]:rotate-180'>
              <span className='flex-1'>{module.title}</span>
              <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200' />
            </AccordionPrimitive.Trigger>
          )}

          <div className='flex items-center gap-2 shrink-0'>
            <Badge variant='secondary'>{lessons.length} Lessons</Badge>
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
        </AccordionPrimitive.Header>

        <AccordionContent className='pt-2 pb-4 space-y-2'>
          {lessonsLoading && (
            <p className='text-sm text-muted-foreground text-center py-4'>
              Loading lessons...
            </p>
          )}

          {!lessonsLoading && lessons.length === 0 && (
            <p className='text-sm text-muted-foreground text-center py-4 italic'>
              No lessons in this module yet.
            </p>
          )}

          {lessons.map((lesson) => (
            <div key={lesson._id}>
              {/* Lesson row */}
              <div
                className='flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group cursor-pointer'
                onClick={() => toggleLesson(lesson._id)}
              >
                {expandedLessonIds.has(lesson._id) ? (
                  <ChevronUp className='h-4 w-4 text-muted-foreground shrink-0' />
                ) : (
                  <ChevronDown className='h-4 w-4 text-muted-foreground shrink-0' />
                )}

                {editingLessonId === lesson._id ? (
                  <div
                    className='flex items-center gap-2 flex-1'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={lessonTitleDraft}
                      onChange={(e) => setLessonTitleDraft(e.target.value)}
                      className='h-7'
                      autoFocus
                    />
                    <Button
                      size='sm'
                      className='h-7'
                      onClick={() => handleSaveLessonTitle(lesson._id)}
                    >
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='h-7'
                      onClick={() => setEditingLessonId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <span className='flex-1 text-sm font-medium'>
                    {lesson.title}
                  </span>
                )}

                <div
                  className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7'
                    onClick={() => {
                      setEditingLessonId(lesson._id);
                      setLessonTitleDraft(lesson.title);
                    }}
                  >
                    <Pencil className='h-3 w-3' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7 text-destructive'
                    onClick={() => lessonDeleteMutation.mutate(lesson._id)}
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>

              {/* Inline lesson panel */}
              {expandedLessonIds.has(lesson._id) && (
                <div className='ml-7 mt-1 mb-2'>
                  <LessonPanel
                    lesson={lesson}
                    courseId={courseId}
                    moduleId={module._id}
                  />
                </div>
              )}
            </div>
          ))}

          <div className='flex justify-center mt-4 pt-2 border-t border-dashed'>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground'
              onClick={() => lessonCreateMutation.mutate('New Lesson')}
              disabled={lessonCreateMutation.isPending}
            >
              <Plus className='h-4 w-4 mr-2' /> Add Lesson
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
