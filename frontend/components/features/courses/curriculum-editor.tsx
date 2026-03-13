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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  freePreview: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CurriculumEditorProps {
  modules: Module[];
  onChange: (modules: Module[]) => void;
}

const MOCK_CURRICULUM: Module[] = [
  {
    id: 'mod-1',
    title: 'Introduction',
    lessons: [
      {
        id: 'les-1',
        title: 'Course Welcome',
        type: 'video',
        freePreview: true,
      },
      {
        id: 'les-2',
        title: 'Setup Environment',
        type: 'text',
        freePreview: false,
      },
    ],
  },
  {
    id: 'mod-2',
    title: 'Core Concepts',
    lessons: [
      {
        id: 'les-3',
        title: 'Understanding React State',
        type: 'video',
        freePreview: false,
      },
      {
        id: 'les-4',
        title: 'Effects and Lifecycle',
        type: 'video',
        freePreview: false,
      },
      {
        id: 'les-5',
        title: 'Assignment: Build a Counter',
        type: 'pdf',
        freePreview: false,
      },
    ],
  },
];

export function CurriculumEditor({ modules, onChange }: CurriculumEditorProps) {
  // const [modules, setModules] = React.useState<Module[]>(MOCK_CURRICULUM); // Removed local state
  const [isEditingModule, setIsEditingModule] = React.useState<string | null>(
    null,
  );
  const [newModuleTitle, setNewModuleTitle] = React.useState('');

  const setModules = (newModules: Module[]) => {
    onChange(newModules);
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: 'New Module',
      lessons: [],
    };
    setModules([...modules, newModule]);
    setIsEditingModule(newModule.id);
    setNewModuleTitle('New Module');
    toast.success('Module added');
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
    toast.success('Module deleted');
  };

  const handleUpdateModuleTitle = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, title: newModuleTitle } : m,
      ),
    );
    setIsEditingModule(null);
    toast.success('Module updated');
  };

  const handleAddLesson = (moduleId: string, type: Lesson['type']) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: `New ${type} lesson`,
      type: type,
      freePreview: false,
    };
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
      ),
    );
    toast.success(`Added ${type} lesson`);
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
    toast.success('Lesson deleted');
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium'>Curriculum Structure</h3>
        <Button onClick={handleAddModule} size='sm'>
          <Plus className='h-4 w-4 mr-2' /> Add Module
        </Button>
      </div>

      <Accordion type='multiple' className='w-full space-y-4'>
        {modules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className='border rounded-lg px-4 bg-muted/10'
          >
            <AccordionTrigger className='hover:no-underline py-4'>
              <div className='flex items-center w-full gap-4'>
                <GripVertical
                  className='h-4 w-4 text-muted-foreground mr-2 cursor-grab'
                  onClick={(e) => e.stopPropagation()}
                />

                {isEditingModule === module.id ? (
                  <div
                    className='flex items-center gap-2 flex-1 mr-4'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      className='h-8'
                      autoFocus
                    />
                    <Button
                      size='sm'
                      onClick={() => handleUpdateModuleTitle(module.id)}
                    >
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => setIsEditingModule(null)}
                    >
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
                    onClick={() => {
                      setIsEditingModule(module.id);
                      setNewModuleTitle(module.title);
                    }}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8 text-destructive hover:text-destructive/90'
                    onClick={() => handleDeleteModule(module.id)}
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
                  <span className='flex-1 text-sm font-medium'>
                    {lesson.title}
                  </span>
                  <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button size='icon' variant='ghost' className='h-7 w-7'>
                      <Pencil className='h-3 w-3' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 text-destructive'
                      onClick={() => handleDeleteLesson(module.id, lesson.id)}
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
                    <DropdownMenuItem
                      onClick={() => handleAddLesson(module.id, 'video')}
                    >
                      <Video className='h-4 w-4 mr-2' /> Video
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddLesson(module.id, 'text')}
                    >
                      <Type className='h-4 w-4 mr-2' /> Text / Article
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAddLesson(module.id, 'pdf')}
                    >
                      <FileText className='h-4 w-4 mr-2' /> PDF Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Empty State */}
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
