import { useQuery, useMutation } from '@tanstack/react-query';
import { mediaService } from '@/lib/services/media.service';
import { toast } from 'sonner';

export function useImageUpload() {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadImage(file),
    onSuccess: () => toast.success('Image uploaded successfully'),
    onError: () => toast.error('Failed to upload image'),
  });
}

export function useImageDelete() {
  return useMutation({
    mutationFn: (publicId: string) => mediaService.deleteImage(publicId),
    onSuccess: () => toast.success('Image deleted successfully'),
    onError: () => toast.error('Failed to delete image'),
  });
}

export function useDocumentUpload() {
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadDocument(file),
    onSuccess: () => toast.success('Document uploaded successfully'),
    onError: () => toast.error('Failed to upload document'),
  });
}

export function useDocumentDelete() {
  return useMutation({
    mutationFn: (path: string) => mediaService.deleteDocument(path),
    onSuccess: () => toast.success('Document deleted successfully'),
    onError: () => toast.error('Failed to delete document'),
  });
}

export function useDocumentUrl(path: string) {
  return useQuery({
    queryKey: ['documentUrl', path],
    queryFn: () => mediaService.getDocumentUrl(path),
    enabled: !!path,
  });
}
