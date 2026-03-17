import cloudinary from '../config/cloudinary.config.js';

export const uploadImage = (buffer: Buffer, mimetype: string) => {
  return new Promise<{
    url: string;
    publicId: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'simplearn', resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      },
    );
    stream.end(buffer);
  });
};

export const deleteImage = async (publicId: string) => {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result === 'not found') {
    throw new Error('Image not found');
  }
  return result;
};
