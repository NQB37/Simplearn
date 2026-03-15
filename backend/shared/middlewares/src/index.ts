import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireRole = (
  allowedRoles: string[],
  secretOrPublicKey: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    jwt.verify(token, secretOrPublicKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return;
      }

      const user = decoded as { id: string; email: string; role: string };
      req.user = user;

      const userRoleLower = user.role.toLowerCase();
      
      // Admin always has access to all routes
      if (userRoleLower === 'admin') {
        return next();
      }

      const hasPermission = allowedRoles.some(
        (role) => role.toLowerCase() === userRoleLower,
      );

      if (!hasPermission) {
        res
          .status(403)
          .json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      next();
    });
  };
};

export const requireAuth = (secretOrPublicKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    jwt.verify(token, secretOrPublicKey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return;
      }

      req.user = decoded;
      next();
    });
  };
};
