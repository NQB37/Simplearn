import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService } from '@/lib/services/academy.service';
import { AcademicYear, Room, Subject, ClassModel } from '@/types/academics.type';
import { toast } from 'sonner';

export function useAcademicYears() {
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: academyService.getAcademicYears,
  });
}

export function useAcademicYearMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Omit<AcademicYear, '_id'>) => academyService.createAcademicYear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] });
      toast.success('Academic year created successfully');
    },
    onError: () => toast.error('Failed to create academic year'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AcademicYear> }) =>
      academyService.updateAcademicYear(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] });
      toast.success('Academic year updated successfully');
    },
    onError: () => toast.error('Failed to update academic year'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academyService.deleteAcademicYear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-years'] });
      toast.success('Academic year deleted successfully');
    },
    onError: () => toast.error('Failed to delete academic year'),
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: academyService.getRooms,
  });
}

export function useRoomMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Room, '_id'>) => academyService.createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room created successfully');
    },
    onError: () => toast.error('Failed to create room'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Room> }) =>
      academyService.updateRoom(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room updated successfully');
    },
    onError: () => toast.error('Failed to update room'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academyService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room deleted successfully');
    },
    onError: () => toast.error('Failed to delete room'),
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: academyService.getSubjects,
  });
}

export function useSubjectMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Subject, '_id'>) => academyService.createSubject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created successfully');
    },
    onError: () => toast.error('Failed to create subject'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Subject> }) =>
      academyService.updateSubject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated successfully');
    },
    onError: () => toast.error('Failed to update subject'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academyService.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted successfully');
    },
    onError: () => toast.error('Failed to delete subject'),
  });

  return { createMutation, updateMutation, deleteMutation };
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: academyService.getClasses,
  });
}

export function useClassMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Omit<ClassModel, '_id'>) => academyService.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully');
    },
    onError: () => toast.error('Failed to create class'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ClassModel> }) =>
      academyService.updateClass(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully');
    },
    onError: () => toast.error('Failed to update class'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => academyService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully');
    },
    onError: () => toast.error('Failed to delete class'),
  });

  return { createMutation, updateMutation, deleteMutation };
}
