import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService } from '@/lib/services/academy.service';
import { toast } from 'sonner';

export function useEnrollmentCatalog() {
  return useQuery({
    queryKey: ['enrollment-catalog'],
    queryFn: academyService.getClassCatalog,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => academyService.enrollInClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-catalog'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Enrolled successfully.');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error ?? 'Failed to enroll.';
      toast.error(msg);
    },
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['my-enrollments'],
    queryFn: academyService.getMyEnrollments,
  });
}
