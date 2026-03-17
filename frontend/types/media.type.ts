export interface ImageUploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface DocumentUploadResponse {
  path: string;
  fullPath: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export interface DocumentUrlResponse {
  signedUrl: string;
  expiresIn: number;
}
