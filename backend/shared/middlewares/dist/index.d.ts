import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export declare const requireRole: (allowedRoles: string[], secretOrPublicKey: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAuth: (secretOrPublicKey: string) => (req: Request, res: Response, next: NextFunction) => void;
