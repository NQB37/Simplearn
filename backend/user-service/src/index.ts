import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import { connectDB } from './config/database.config.js';
import { config } from './config/env.config.js';

import dns from 'node:dns/promises';

dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB();

const app: Express = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Auth Service is running' });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
