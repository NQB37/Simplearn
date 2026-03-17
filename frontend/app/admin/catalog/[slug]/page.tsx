'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Lock, LayoutList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCourseBySlug, useModules } from '@/hooks/use-courses';
import { useSubjects } from '@/hooks/use-academics';

export default function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: course, isLoading } = useCourseBySlug(slug);
  const { data: modules = [], isLoading: modulesLoading } = useModules(
    course?._id ?? '',
  );
  const { data: subjects = [] } = useSubjects();

  const subjectName = (id: string) =>
    subjects.find((s) => s._id === id)?.name ?? id;

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto py-12 text-center text-slate-500'>
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className='max-w-4xl mx-auto py-12 text-center text-slate-500'>
        Course not found.
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center gap-3'>
        <Link
          href='/admin/catalog'
          className='flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Catalog
        </Link>
      </div>

      {/* Header */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
            {course.title}
          </h1>
          <p className='text-slate-500 text-sm mt-1'>/{course.slug}</p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${
            course.status === 'published'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {course.status === 'published' ? (
            <Eye className='h-3.5 w-3.5' />
          ) : (
            <Lock className='h-3.5 w-3.5' />
          )}
          {course.status}
        </span>
      </div>

      {/* Info card */}
      <Card className='rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
        <CardHeader className='pb-3 border-b border-slate-100 dark:border-slate-800'>
          <CardTitle className='text-base font-bold flex items-center gap-2'>
            <BookOpen className='h-4 w-4' />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-4 space-y-4 text-sm'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-xs font-semibold uppercase text-slate-500 mb-1'>
                Subject
              </p>
              <Badge variant='outline' className='font-medium'>
                {subjectName(course.subjectId)}
              </Badge>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase text-slate-500 mb-1'>
                Instructor ID
              </p>
              <p className='font-mono text-xs text-slate-600 dark:text-slate-400'>
                {course.instructorId}
              </p>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase text-slate-500 mb-1'>
                Created
              </p>
              <p className='text-slate-700 dark:text-slate-300'>
                {new Date(course.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className='text-xs font-semibold uppercase text-slate-500 mb-1'>
                Last Updated
              </p>
              <p className='text-slate-700 dark:text-slate-300'>
                {new Date(course.updatedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {course.description && (
            <>
              <Separator />
              <div>
                <p className='text-xs font-semibold uppercase text-slate-500 mb-2'>
                  Description
                </p>
                <div
                  className='prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300'
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modules card */}
      <Card className='rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
        <CardHeader className='pb-3 border-b border-slate-100 dark:border-slate-800'>
          <CardTitle className='text-base font-bold flex items-center gap-2'>
            <LayoutList className='h-4 w-4' />
            Curriculum
            <span className='ml-1 text-sm font-normal text-slate-500'>
              ({modules.length} module{modules.length !== 1 ? 's' : ''})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-4'>
          {modulesLoading ? (
            <p className='text-center py-6 text-slate-500 text-sm'>
              Loading modules...
            </p>
          ) : modules.length === 0 ? (
            <p className='text-center py-6 text-slate-500 text-sm italic'>
              No modules yet.
            </p>
          ) : (
            <ol className='space-y-2'>
              {modules.map((module, index) => (
                <li
                  key={module._id}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm'
                >
                  <span className='text-xs font-bold text-slate-400 w-5 text-center'>
                    {index + 1}
                  </span>
                  <span className='font-medium text-slate-800 dark:text-slate-200'>
                    {module.title}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
