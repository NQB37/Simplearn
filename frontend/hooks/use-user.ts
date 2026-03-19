import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, ExtendedProfile, FormOfStudy, TypeOfStudy, Sex, CreateStudentPayload } from '@/lib/services/user.service';
import { toast } from 'sonner';

export type { FormOfStudy, TypeOfStudy, Sex };

export function useExtendedProfile() {
  return useQuery({
    queryKey: ['extended-profile'],
    queryFn: userService.getExtendedProfile,
  });
}

export function useExtendedProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExtendedProfile) => userService.updateExtendedProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extended-profile'] });
      toast.success('Profile updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useUserProfileMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExtendedProfile) => userService.updateUserProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      toast.success('Profile updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}

export function useFieldsOfStudy() {
  return useQuery({
    queryKey: ['fields-of-study'],
    queryFn: userService.getFieldsOfStudy,
  });
}

export function useMajors(fieldOfStudyId?: string) {
  return useQuery({
    queryKey: ['majors', fieldOfStudyId],
    queryFn: () => userService.getMajors(fieldOfStudyId),
  });
}

export function useVocabularyMutations() {
  const queryClient = useQueryClient();

  const createFieldMutation = useMutation({
    mutationFn: (name: string) => userService.createFieldOfStudy(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields-of-study'] });
      toast.success('Field of study created.');
    },
    onError: () => toast.error('Failed to create field of study.'),
  });

  const deleteFieldMutation = useMutation({
    mutationFn: (id: string) => userService.deleteFieldOfStudy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields-of-study'] });
      toast.success('Deleted.');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to delete.'),
  });

  const createMajorMutation = useMutation({
    mutationFn: ({ name, fieldOfStudyId }: { name: string; fieldOfStudyId: string }) => 
      userService.createMajor(name, fieldOfStudyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] });
      toast.success('Major created.');
    },
    onError: () => toast.error('Failed to create major.'),
  });

  const deleteMajorMutation = useMutation({
    mutationFn: (id: string) => userService.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] });
      toast.success('Deleted.');
    },
    onError: () => toast.error('Failed to delete.'),
  });

  return { createFieldMutation, deleteFieldMutation, createMajorMutation, deleteMajorMutation };
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await (await import('@/api/axios.api')).default.get(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/api/admin/users`,
      );
      return data;
    },
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => userService.createStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      userService.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
}
