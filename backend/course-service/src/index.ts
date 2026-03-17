import './config/env.config.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import connectDB from './config/database.config.js';
import courseRoutes from './routes/course.route.js';
import moduleRoutes from './routes/module.route.js';
import lessonRoutes from './routes/lesson.route.js';
import dns from 'node:dns/promises';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app: Express = express();
const PORT = process.env.PORT || 8003;

connectDB();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/courses', courseRoutes);
app.use('/api/courses/:courseId/modules', moduleRoutes);
app.use('/api/courses/:courseId/modules/:moduleId/lessons', lessonRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Course Service is running' });
});

app.listen(PORT, () => {
  console.log(`Course Service running on port ${PORT}`);
});
