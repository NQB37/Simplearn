import './config/env.config.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import connectDB from './config/database.config.js';
import academyRoutes from './routes/academy.route.js';
import roomRoutes from './routes/room.route.js';
import classRoutes from './routes/class.route.js';
import subjectRoutes from './routes/subject.route.js';
import dns from 'node:dns/promises';

dns.setServers(['1.1.1.1', '1.0.0.1']);

const app: Express = express();
const PORT = process.env.PORT || 8002;

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

app.use('/api/academy', academyRoutes);
app.use('/api/academy/rooms', roomRoutes);
app.use('/api/academy/classes', classRoutes);
app.use('/api/academy/subjects', subjectRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Academy Service is running' });
});

app.listen(PORT, () => {
  console.log(`Academy Service running on port ${PORT}`);
});
