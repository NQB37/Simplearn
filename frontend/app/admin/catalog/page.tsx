'use client';

import Link from 'next/link';
import { Eye, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses } from '@/hooks/use-courses';
import { useSubjects } from '@/hooks/use-academics';

export default function AdminCatalogPage() {
  const { data: courses = [], isLoading } = useCourses();
  const { data: subjects = [] } = useSubjects();

  const subjectName = (id: string) =>
    subjects.find((s) => s._id === id)?.name ?? id;

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50'>
          Course Catalog
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium'>
          Global view of all courses on Simplearn.
        </p>
      </div>

      <Card className='rounded-2xl shadow-sm border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900'>
        <CardHeader className='pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between'>
          <CardTitle className='text-lg font-bold'>
            All Courses
            <span className='ml-2 text-sm font-normal text-slate-500'>
              ({courses.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <p className='text-center py-12 text-slate-500'>Loading...</p>
          ) : courses.length === 0 ? (
            <p className='text-center py-12 text-slate-500'>No courses found.</p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left align-middle'>
                <thead className='text-xs font-bold uppercase text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800'>
                  <tr>
                    <th className='px-6 py-4'>Title</th>
                    <th className='px-6 py-4'>Subject</th>
                    <th className='px-6 py-4'>Status</th>
                    <th className='px-6 py-4'>Created</th>
                    <th className='px-6 py-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800/80'>
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group'
                    >
                      <td className='px-6 py-4 font-semibold text-slate-900 dark:text-slate-100'>
                        {course.title}
                      </td>
                      <td className='px-6 py-4'>
                        <Badge
                          variant='outline'
                          className='font-medium rounded-lg text-slate-500 dark:text-slate-400'
                        >
                          {subjectName(course.subjectId)}
                        </Badge>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`text-xs font-bold flex items-center gap-1 ${
                            course.status === 'published'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {course.status === 'published' ? (
                            <Eye className='h-3 w-3' />
                          ) : (
                            <Lock className='h-3 w-3' />
                          )}
                          {course.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-slate-500 text-xs'>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Link
                          href={`/admin/catalog/${course.slug}`}
                          className='text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
