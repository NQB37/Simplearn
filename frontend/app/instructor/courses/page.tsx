'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCourses, useCourseMutations } from '@/hooks/use-courses';
import { useSubjects } from '@/hooks/use-academics';
import { useUserStore } from '@/store/user.store';
import { DeleteCourseModal } from '@/components/features/courses/delete-course-modal';

export default function CoursesPage() {
  const router = useRouter();
  const { data: courses, isLoading } = useCourses();
  const { deleteMutation } = useCourseMutations();
  const { data: subjects = [] } = useSubjects();
  const user = useUserStore((state) => state.user);
  const [pendingDelete, setPendingDelete] = React.useState<{
    id: string;
    slug: string;
  } | null>(null);

  const myCourses = courses?.filter((c) => c.instructorId === user?.id) ?? [];

  const handleDelete = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  return (
    <div className='container mx-auto py-6 px-4 max-w-5xl'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>My Courses</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Manage your authored courses
          </p>
        </div>
        <Button asChild>
          <Link href='/instructor/courses/create'>
            <PlusCircle className='mr-2 h-4 w-4' />
            Create Course
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
          <CardDescription>
            {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className='text-center py-8 text-muted-foreground'>
              Loading courses...
            </p>
          ) : myCourses.length === 0 ? (
            <p className='text-center py-8 text-muted-foreground'>
              No courses yet. Create your first course.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className='font-medium'>{course.title}</TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {subjects.find((s) => s._id === course.subjectId)?.name ?? course.subjectId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.status === 'published' ? 'default' : 'secondary'
                        }
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() =>
                            router.push(
                              `/instructor/courses/${course.slug}/edit`,
                            )
                          }
                        >
                          <Pencil className='h-4 w-4' />
                          <span className='sr-only'>Edit</span>
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-destructive hover:text-destructive'
                          onClick={() =>
                            setPendingDelete({
                              id: course._id,
                              slug: course.slug,
                            })
                          }
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='sr-only'>Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DeleteCourseModal
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        slug={pendingDelete?.slug ?? ''}
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
