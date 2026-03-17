'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { courseService } from '@/lib/services/course.service';
import { useSubjects } from '@/hooks/use-academics';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/ui/editor';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useCourseMutations } from '@/hooks/use-courses';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  slug: z
    .string()
    .min(3, {
      message: 'Slug must be at least 3 characters.',
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be URL-safe (lowercase, dashes only).',
    }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  subjectId: z.string().min(1, {
    message: 'Subject is required.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateCourseForm = () => {
  const router = useRouter();
  const { createMutation } = useCourseMutations();
  const { data: subjects } = useSubjects();

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      subjectId: '',
    },
  });

  // Auto-generate slug from title
  const titleValue = form.watch('title');
  React.useEffect(() => {
    if (titleValue && !form.getFieldState('slug').isDirty) {
      const slug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      form.setValue('slug', slug);
    }
  }, [titleValue, form]);

  const onSubmit = async (values: FormValues) => {
    const result = await createMutation.mutateAsync(values).catch(() => null);
    if (result?.course?.slug) {
      router.push(`/instructor/courses/${result.course.slug}/edit`);
    } else if (result) {
      router.push('/instructor/courses');
    }
  };

  return (
    <Card className='max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>
          Provide the basic information for your new course.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. Advanced React Patterns'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The public name of your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. advanced-react-patterns'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly identifier for your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subjectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className='w-full border border-input rounded-md px-3 py-2 text-sm bg-background'
                    >
                      <option value=''>Select a subject</option>
                      {subjects?.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className='min-h-[200px]'>
                      <Editor value={field.value} onChange={field.onChange} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    A detailed overview of what students will learn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Course
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter />
    </Card>
  );
};
