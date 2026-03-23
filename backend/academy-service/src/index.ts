import './config/env.config.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import connectDB from './config/database.config.js';
import academyRoutes from './routes/academy.route.js';
import roomRoutes from './routes/room.route.js';
import classRoutes from './routes/class.route.js';
import subjectRoutes from './routes/subject.route.js';
import curriculumRoutes from './routes/curriculum.route.js';
import enrollmentRoutes from './routes/enrollment.route.js';
import Shift from './models/shift.model.js';

import dns from 'node:dns/promises';
import { SHIFTS } from './constants/shifts.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seedShifts() {
  const count = await Shift.countDocuments();
  if (count === 0) {
    await Shift.insertMany(SHIFTS);
    console.log('Shifts seeded');
  }
}

const app: Express = express();
const PORT = process.env.PORT || 8002;

connectDB().then(seedShifts);

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
app.use('/api/academy/curriculum', curriculumRoutes);
app.use('/api/academy/enrollments', enrollmentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Academy Service is running' });
});

app.listen(PORT, () => {
  console.log(`Academy Service running on port ${PORT}`);
});
