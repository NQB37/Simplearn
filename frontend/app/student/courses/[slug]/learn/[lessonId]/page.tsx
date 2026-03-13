'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, SkipForward } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Wait - that path is wrong, course-sidebar is in components/courses/viewer/course-sidebar
import { CourseSidebar as Sidebar } from '@/components/features/courses/viewer/course-sidebar';
import { VideoPlayer } from '@/components/features/courses/viewer/video-player';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock Data
const MOCK_MODULES = [
  {
    id: 'mod-1',
    title: 'Introduction',
    lessons: [
      {
        id: 'les-1',
        title: 'Course Welcome',
        type: 'video' as const,
        isCompleted: true,
        isLocked: false,
      },
      {
        id: 'les-2',
        title: 'Setup Environment',
        type: 'text' as const,
        isCompleted: false,
        isLocked: false,
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
        type: 'video' as const,
        isCompleted: false,
        isLocked: false,
      },
      {
        id: 'les-4',
        title: 'Effects and Lifecycle',
        type: 'video' as const,
        isCompleted: false,
        isLocked: true,
      },
      {
        id: 'les-5',
        title: 'Assignment: Build a Counter',
        type: 'text' as const, // Changed for MVP compatibility with Sidebar
        isCompleted: false,
        isLocked: true,
      },
    ],
  },
];

export default function LessonViewerPage() {
  const params = useParams();
  const router = useRouter();
  const { slug, lessonId } = params as { slug: string; lessonId: string };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lesson, setLesson] = React.useState<any>(null);

  // Simulate fetching lesson data
  React.useEffect(() => {
    // Find lesson in mock data
    const foundLesson = MOCK_MODULES.flatMap((m) => m.lessons).find(
      (l) => l.id === lessonId,
    );
    if (foundLesson) {
      setLesson({
        ...foundLesson,
        content:
          foundLesson.type === 'text'
            ? '<h2>Setting up your environment</h2><p>Before we start coding, we need to install Node.js...</p>'
            : null,
      });
    }
  }, [lessonId]);

  if (!lesson)
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      {/* Main Content Area */}
      <div className='flex-1 flex flex-col h-full overflow-hidden'>
        {/* Top Navigation Bar */}
        <div className='h-16 border-b flex items-center px-4 bg-background z-10'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.push(`/courses/${slug}`)}
          >
            <ArrowLeft className='h-4 w-4 mr-2' /> Back to Course
          </Button>
          <div className='ml-4 font-semibold text-lg truncate flex-1'>
            {lesson.title}
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' disabled={lesson.isCompleted}>
              {lesson.isCompleted ? (
                <CheckCircle className='h-4 w-4 mr-2 text-emerald-500' />
              ) : null}
              Mark as Complete
            </Button>
            <Button size='sm'>
              Next Lesson <SkipForward className='h-4 w-4 ml-2' />
            </Button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <ScrollArea className='flex-1'>
          <div className='max-w-4xl mx-auto p-6 md:p-10 space-y-8'>
            {lesson.type === 'video' ? (
              <VideoPlayer />
            ) : (
              <div className='prose dark:prose-invert max-w-none'>
                <div
                  dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
                />
              </div>
            )}

            <div className='space-y-4'>
              <h2 className='text-2xl font-bold'>About this lesson</h2>
              <p className='text-muted-foreground'>
                In this lesson, we will cover the fundamental concepts required
                to understand the rest of the course. Make sure to download the
                attached resources.
              </p>
            </div>

            <Separator />

            {/* Discussion / Q&A Placeholder */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Discussion</h3>
              <div className='bg-muted/30 p-4 rounded-lg text-center text-muted-foreground'>
                Q&A section coming soon...
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Sidebar (Hidden on mobile, collapsible later) */}
      <div className='w-80 hidden md:block h-full border-l bg-background'>
        <Sidebar
          courseSlug={slug}
          modules={MOCK_MODULES}
          currentLessonId={lessonId}
          progress={25}
        />
      </div>
    </div>
  );
}
