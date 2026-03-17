import 'dotenv/config';

export const config = {
  port: process.env.PORT || 8004,
  jwtSecret: process.env.JWT_ACCESS_SECRET || 'access_secret',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    bucket: process.env.SUPABASE_BUCKET || 'documents',
  },
};
