import './config/env.config.js';
import express from 'express';
import cors from 'cors';
import imageRoutes from './routes/image.route.js';
import documentRoutes from './routes/document.route.js';
const app = express();
const PORT = process.env.PORT || 8004;
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use('/api/media/images', imageRoutes);
app.use('/api/media/documents', documentRoutes);
app.get('/', (_req, res) => {
    res.json({ message: 'Media Service is running' });
});
// Error handling for multer errors
app.use((err, _req, res, _next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large' });
    }
    if (err.message?.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`Media Service running on port ${PORT}`);
});
