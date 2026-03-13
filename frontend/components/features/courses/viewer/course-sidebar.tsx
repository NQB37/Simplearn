'use client';

import * as React from 'react';
import Link from 'next/link';
import { PlayCircle, FileText, CheckCircle, Circle, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf';
  isCompleted: boolean;
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  courseSlug: string;
  modules: Module[];
  currentLessonId: string;
  progress: number;
}

export function CourseSidebar({
  courseSlug,
  modules,
  currentLessonId,
  progress,
}: CourseSidebarProps) {
  return (
    <div className='flex flex-col h-full border-r bg-muted/10'>
      <div className='p-4 border-b'>
        <h3 className='font-semibold mb-2'>Course Progress</h3>
        <Progress value={progress} className='h-2' />
        <p className='text-xs text-muted-foreground mt-2'>
          {progress}% Completed
        </p>
      </div>

      <ScrollArea className='flex-1'>
        <div className='flex flex-col w-full'>
          {modules.map((module) => (
            <div key={module.id} className='flex flex-col w-full'>
              <div className='px-4 py-3 bg-muted/30 font-medium text-sm border-b'>
                {module.title}
              </div>
              <div className='flex flex-col w-full'>
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={
                      lesson.isLocked
                        ? '#'
                        : `/courses/${courseSlug}/learn/${lesson.id}`
                    }
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b last:border-0 hover:bg-muted/50',
                      currentLessonId === lesson.id &&
                        'bg-muted hover:bg-muted font-medium text-primary',
                      lesson.isLocked &&
                        'opacity-50 cursor-not-allowed hover:bg-transparent',
                    )}
                  >
                    <div className='flex-shrink-0'>
                      {lesson.isLocked ? (
                        <Lock className='h-4 w-4' />
                      ) : lesson.isCompleted ? (
                        <CheckCircle className='h-4 w-4 text-emerald-500' />
                      ) : (
                        <Circle className='h-4 w-4 text-muted-foreground/50' />
                      )}
                    </div>
                    <div className='flex-1 line-clamp-2'>{lesson.title}</div>
                    <div className='flex-shrink-0 text-muted-foreground/60'>
                      {lesson.type === 'video' && (
                        <PlayCircle className='h-4 w-4' />
                      )}
                      {lesson.type === 'text' && (
                        <FileText className='h-4 w-4' />
                      )}
                      {lesson.type === 'pdf' && (
                        <FileText className='h-4 w-4' />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
