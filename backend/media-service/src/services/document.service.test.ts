import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase config before importing the service
vi.mock('../config/supabase.config.js', () => ({
  supabase: {
    storage: {
      from: vi.fn(),
    },
  },
}));

// Mock env config
vi.mock('../config/env.config.js', () => ({
  config: {
    supabase: {
      bucket: 'documents',
    },
  },
}));

import * as documentService from './document.service.js';
import { supabase } from '../config/supabase.config.js';

describe('Document Service', () => {
  const mockUpload = vi.fn();
  const mockRemove = vi.fn();
  const mockCreateSignedUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.storage.from as any).mockReturnValue({
      upload: mockUpload,
      remove: mockRemove,
      createSignedUrl: mockCreateSignedUrl,
    });
  });

  describe('uploadDocument', () => {
    it('should upload document and return metadata', async () => {
      const fakeBuffer = Buffer.from('fake-pdf-data');
      const originalName = 'report.pdf';
      const mimetype = 'application/pdf';
      const userId = 'user-123';

      mockUpload.mockResolvedValue({
        data: { path: `${userId}/1710000000-${originalName}` },
        error: null,
      });

      const result = await documentService.uploadDocument(
        fakeBuffer,
        originalName,
        mimetype,
        userId,
      );

      expect(supabase.storage.from).toHaveBeenCalledWith('documents');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp(`^${userId}/\\d+-${originalName}$`)),
        fakeBuffer,
        { contentType: mimetype },
      );
      expect(result).toMatchObject({
        originalName,
        size: fakeBuffer.length,
        mimeType: mimetype,
      });
      expect(result.path).toMatch(new RegExp(`^${userId}/\\d+-${originalName}$`));
      expect(result.fullPath).toMatch(new RegExp(`^documents/${userId}/\\d+-${originalName}$`));
    });

    it('should throw when supabase returns an error', async () => {
      mockUpload.mockResolvedValue({
        data: null,
        error: new Error('Storage quota exceeded'),
      });

      const buffer = Buffer.from('data');
      await expect(
        documentService.uploadDocument(buffer, 'file.pdf', 'application/pdf', 'user-456'),
      ).rejects.toThrow('Storage quota exceeded');
    });
  });

  describe('deleteDocument', () => {
    it('should delete the document successfully', async () => {
      mockRemove.mockResolvedValue({ data: {}, error: null });

      await documentService.deleteDocument('user-123/1710000000-report.pdf');

      expect(supabase.storage.from).toHaveBeenCalledWith('documents');
      expect(mockRemove).toHaveBeenCalledWith(['user-123/1710000000-report.pdf']);
    });

    it('should throw when supabase returns an error', async () => {
      mockRemove.mockResolvedValue({
        data: null,
        error: new Error('File not found'),
      });

      await expect(
        documentService.deleteDocument('user-123/nonexistent.pdf'),
      ).rejects.toThrow('File not found');
    });
  });

  describe('getDocumentUrl', () => {
    it('should return signedUrl and expiresIn', async () => {
      const signedUrl = 'https://xxx.supabase.co/storage/v1/object/sign/documents/path?token=abc';
      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl },
        error: null,
      });

      const result = await documentService.getDocumentUrl('user-123/1710000000-report.pdf');

      expect(supabase.storage.from).toHaveBeenCalledWith('documents');
      expect(mockCreateSignedUrl).toHaveBeenCalledWith('user-123/1710000000-report.pdf', 3600);
      expect(result).toEqual({ signedUrl, expiresIn: 3600 });
    });

    it('should throw when supabase returns an error', async () => {
      mockCreateSignedUrl.mockResolvedValue({
        data: null,
        error: new Error('Path not found'),
      });

      await expect(documentService.getDocumentUrl('user-123/missing.pdf')).rejects.toThrow(
        'Path not found',
      );
    });
  });
});
