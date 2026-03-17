import { supabase } from '../config/supabase.config.js';
import { config } from '../config/env.config.js';
const bucket = config.supabase.bucket;
export const uploadDocument = async (buffer, originalName, mimetype, userId) => {
    const path = `${userId}/${Date.now()}-${originalName}`;
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, { contentType: mimetype });
    if (error)
        throw error;
    return {
        path: data.path,
        fullPath: `${bucket}/${data.path}`,
        originalName,
        size: buffer.length,
        mimeType: mimetype,
    };
};
export const deleteDocument = async (path) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error)
        throw error;
};
export const getDocumentUrl = async (path) => {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600);
    if (error)
        throw error;
    return {
        signedUrl: data.signedUrl,
        expiresIn: 3600,
    };
};
