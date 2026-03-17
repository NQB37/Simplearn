import axiosInstance from '@/api/axios.api';
import { ImageUploadResponse, DocumentUploadResponse, DocumentUrlResponse } from '@/types/media.type';

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL;

export const mediaService = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    // Do NOT set Content-Type manually — axios auto-sets multipart/form-data with the
    // required boundary when it detects FormData. Manually setting it strips the boundary
    // and breaks multer's body parsing on the server.
    const { data } = await axiosInstance.post(
      `${MEDIA_BASE_URL}/api/media/images/upload`,
      formData,
    );
    return data;
  },

  deleteImage: async (publicId: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.delete(
      `${MEDIA_BASE_URL}/api/media/images`,
      { params: { publicId } },
    );
    return data;
  },

  uploadDocument: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('document', file);
    const { data } = await axiosInstance.post(
      `${MEDIA_BASE_URL}/api/media/documents/upload`,
      formData,
    );
    return data;
  },

  deleteDocument: async (path: string): Promise<{ message: string }> => {
    const { data } = await axiosInstance.delete(
      `${MEDIA_BASE_URL}/api/media/documents`,
      { params: { path } },
    );
    return data;
  },

  getDocumentUrl: async (path: string): Promise<DocumentUrlResponse> => {
    const { data } = await axiosInstance.get(
      `${MEDIA_BASE_URL}/api/media/documents/url`,
      { params: { path } },
    );
    return data;
  },
};
