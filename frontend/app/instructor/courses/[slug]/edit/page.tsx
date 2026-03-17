'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  CurriculumEditor,
  Module,
} from '@/components/features/courses/curriculum-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Editor } from '@/components/ui/editor';
import { useCourseBySlug, useCourseMutations } from '@/hooks/use-courses';

const EditCoursePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: course, isLoading } = useCourseBySlug(slug);
  const { updateMutation, deleteMutation } = useCourseMutations();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [curriculum, setCurriculum] = React.useState<Module[]>([]);

  React.useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
    }
  }, [course]);

  const handleSave = () => {
    if (!course) return;
    updateMutation.mutate({ id: course._id, payload: { title, description } });
  };

  const handleDelete = () => {
    if (!course) return;
    if (!confirm('Are you sure you want to delete this course?')) return;
    deleteMutation.mutate(course._id, {
      onSuccess: () => router.push('/instructor/courses'),
    });
  };

  if (isLoading)
    return <div className='p-8 text-center'>Loading course...</div>;

  if (!course)
    return <div className='p-8 text-center'>Course not found.</div>;

  return (
    <div className='container mx-auto py-6 px-4 max-w-5xl'>
      <div className='flex items-center gap-4 mb-8'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.push('/instructor/courses')}
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Edit Course</h1>
          <p className='text-muted-foreground text-sm'>Managing: {title}</p>
        </div>
        <div className='ml-auto flex gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push(`/student/courses/${slug}`)}
          >
            Preview
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue='curriculum' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 max-w-[400px]'>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='curriculum'>Curriculum</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value='details' className='mt-6 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Update basic course details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-2'>
                <Label htmlFor='title'>Course Title</Label>
                <Input
                  id='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <div className='min-h-[200px]'>
                  <Editor value={description} onChange={setDescription} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='curriculum' className='mt-6'>
          <CurriculumEditor modules={curriculum} onChange={setCurriculum} />
        </TabsContent>

        <TabsContent value='settings' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>
                Manage publishing status and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='p-4 border border-destructive/20 bg-destructive/5 rounded-md text-destructive'>
                <h4 className='font-semibold flex items-center gap-2'>
                  Danger Zone
                </h4>
                <p className='text-sm mt-1'>
                  Deleting a course is permanent and cannot be undone.
                </p>
                <Button
                  variant='destructive'
                  size='sm'
                  className='mt-4'
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  Delete Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCoursePage;
