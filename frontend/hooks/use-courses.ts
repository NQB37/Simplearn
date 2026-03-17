import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import { Course, CreateCoursePayload, Module } from '@/types/course.type';
import { toast } from 'sonner';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: courseService.getCourses,
  });
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ['courses', slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
  });
}

export function useCourseMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateCoursePayload) => courseService.createCourse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: () => toast.error('Failed to create course'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Course> }) =>
      courseService.updateCourse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: () => toast.error('Failed to update course'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: () => toast.error('Failed to delete course'),
  });

  return { createMutation, updateMutation, deleteMutation };
}

// Module hooks
export function useModules(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => courseService.getModules(courseId),
    enabled: !!courseId,
  });
}

export function useModuleMutations(courseId: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({ title }: { title: string }) => courseService.createModule(courseId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      toast.success('Module added');
    },
    onError: () => toast.error('Failed to create module'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: { title: string } }) =>
      courseService.updateModule(courseId, moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      toast.success('Module updated');
    },
    onError: () => toast.error('Failed to update module'),
  });

  const deleteMutation = useMutation({
    mutationFn: (moduleId: string) => courseService.deleteModule(courseId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
      toast.success('Module deleted');
    },
    onError: () => toast.error('Failed to delete module'),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => courseService.reorderModules(courseId, orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', courseId] });
    },
    onError: () => toast.error('Failed to reorder modules'),
  });

  return { createMutation, updateMutation, deleteMutation, reorderMutation };
}
