import * as imageService from '../services/image.service.js';
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        const result = await imageService.uploadImage(req.file.buffer, req.file.mimetype);
        res.status(201).json(result);
    }
    catch (err) {
        console.error('Error uploading image', err);
        res.status(500).json({ error: err.message || 'Failed to upload image' });
    }
};
export const deleteImage = async (req, res) => {
    try {
        const publicId = req.query.publicId;
        if (!publicId) {
            return res.status(400).json({ error: 'Missing publicId query parameter' });
        }
        await imageService.deleteImage(publicId);
        res.json({ message: 'Image deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting image', err);
        if (err.message === 'Image not found') {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(500).json({ error: err.message || 'Failed to delete image' });
    }
};
