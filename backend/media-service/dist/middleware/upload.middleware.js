import multer from 'multer';
const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];
const DOCUMENT_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
const imageFilter = (_req, file, cb) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG'));
    }
};
const documentFilter = (_req, file, cb) => {
    if (DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX'));
    }
};
export const imageUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('image');
export const documentUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter: documentFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
}).single('document');
