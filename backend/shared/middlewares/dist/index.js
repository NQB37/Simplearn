import jwt from 'jsonwebtoken';
export const requireRole = (allowedRoles, secretOrPublicKey) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const checkRole = (user) => {
            const userRoleLower = user.role.toLowerCase();
            // Admin always has access to all routes
            if (userRoleLower === 'admin') {
                return next();
            }
            const hasPermission = allowedRoles.some((role) => role.toLowerCase() === userRoleLower);
            if (!hasPermission) {
                res
                    .status(403)
                    .json({ message: 'Forbidden: Insufficient permissions' });
                return;
            }
            next();
        };
        if (req.user) {
            return checkRole(req.user);
        }
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }
        jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized: Invalid token' });
                return;
            }
            const user = decoded;
            req.user = user;
            checkRole(user);
        });
    };
};
export const requireAuth = (secretOrPublicKey) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }
        jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized: Invalid token' });
                return;
            }
            req.user = decoded;
            next();
        });
    };
};
