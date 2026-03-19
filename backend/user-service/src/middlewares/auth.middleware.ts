import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';

export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role.toUpperCase() === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role.toUpperCase();
    
    // Admin always has access
    if (userRole === 'ADMIN') {
      return next();
    }

    if (allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

export const checkSuspended = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { User } = await import('../models/user.model.js');
    const user = await User.findById(req.user.id).select('status');
    if (user?.status === 'SUSPENDED') {
      return res.status(403).json({
        code: 'ACCOUNT_SUSPENDED',
        message: 'This account has been disabled by an administrator.',
      });
    }
    next();
  } catch {
    next();
  }
};

export const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    config.jwtRefreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
