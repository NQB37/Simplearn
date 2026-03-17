import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock cloudinary config before importing the service
vi.mock('../config/cloudinary.config.js', () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

import * as imageService from './image.service.js';
import cloudinary from '../config/cloudinary.config.js';

describe('Image Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should resolve with image data on successful upload', async () => {
      const mockResult = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/simplearn/abc123.jpg',
        public_id: 'simplearn/abc123',
        format: 'jpg',
        width: 800,
        height: 600,
        bytes: 123456,
      };

      // upload_stream receives options and a callback, returns a writable stream
      // When stream.end(buffer) is called, simulate the cloudinary callback firing
      (cloudinary.uploader.upload_stream as any).mockImplementation(
        (_opts: any, cb: (err: any, result: any) => void) => {
          const mockStream = {
            end: vi.fn(() => setImmediate(() => cb(null, mockResult))),
            write: vi.fn(),
          };
          return mockStream;
        },
      );

      const buffer = Buffer.from('fake-image-data');
      const result = await imageService.uploadImage(buffer, 'image/jpeg');

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: 'simplearn', resource_type: 'image' },
        expect.any(Function),
      );
      expect(result).toEqual({
        url: mockResult.secure_url,
        publicId: mockResult.public_id,
        format: mockResult.format,
        width: mockResult.width,
        height: mockResult.height,
        bytes: mockResult.bytes,
      });
    });

    it('should reject when cloudinary returns an error', async () => {
      const mockError = new Error('Cloudinary upload failed');

      (cloudinary.uploader.upload_stream as any).mockImplementation(
        (_opts: any, cb: (err: any, result: any) => void) => {
          const mockStream = {
            end: vi.fn(() => setImmediate(() => cb(mockError, null))),
            write: vi.fn(),
          };
          return mockStream;
        },
      );

      const buffer = Buffer.from('fake-image-data');
      await expect(imageService.uploadImage(buffer, 'image/jpeg')).rejects.toThrow(
        'Cloudinary upload failed',
      );
    });

    it('should reject with "Upload failed" when cloudinary returns no result', async () => {
      (cloudinary.uploader.upload_stream as any).mockImplementation(
        (_opts: any, cb: (err: any, result: any) => void) => {
          const mockStream = {
            end: vi.fn(() => setImmediate(() => cb(null, null))),
            write: vi.fn(),
          };
          return mockStream;
        },
      );

      const buffer = Buffer.from('fake-image-data');
      await expect(imageService.uploadImage(buffer, 'image/png')).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteImage', () => {
    it('should resolve when image is deleted successfully', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'ok' });

      const result = await imageService.deleteImage('simplearn/abc123');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('simplearn/abc123');
      expect(result).toEqual({ result: 'ok' });
    });

    it('should throw when image is not found', async () => {
      (cloudinary.uploader.destroy as any).mockResolvedValue({ result: 'not found' });

      await expect(imageService.deleteImage('simplearn/nonexistent')).rejects.toThrow(
        'Image not found',
      );
    });
  });
});
