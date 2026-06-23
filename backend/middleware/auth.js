import jwt from 'jsonwebtoken';
import { db } from '../db.js';

// JWT secret key (should be loaded from env, with a secure fallback)
export const JWT_SECRET = process.env.JWT_SECRET || 'your_place_secret_jwt_key_2026_secure';

/**
 * Middleware to authenticate API requests via JWT Bearer Token.
 * Immune to CSRF as browser does not auto-send Authorization header.
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    // Log unauthorized access attempt
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await db.run(
      `INSERT INTO audit_logs (action, details, ip_address, user_agent, status) 
       VALUES (?, ?, ?, ?, ?)`,
      ['API_ACCESS_DENIED', `Attempted to access ${req.originalUrl} without token`, ip, userAgent, 'failed']
    );
    return res.status(401).json({ message: 'Token required / لم يتم توفير رمز الدخول' });
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      await db.run(
        `INSERT INTO audit_logs (action, details, ip_address, user_agent, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['API_ACCESS_DENIED', `Invalid token signature for ${req.originalUrl}`, ip, userAgent, 'failed']
      );
      return res.status(403).json({ message: 'Invalid or expired token / رمز الدخول غير صالح أو انتهت صلاحيته' });
    }
    
    // Attach user payload to request
    req.user = user;
    next();
  });
}

/**
 * Role-Based Access Control Middleware.
 * Checks if req.user has one of the allowed roles.
 */
export function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized / غير مصرح' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      // Log unauthorized operation attempt in audit_logs
      await db.run(
        `INSERT INTO audit_logs (user_id, action, details, ip_address, user_agent, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          'RBAC_VIOLATION',
          `User '${req.user.username}' (role: ${req.user.role}) attempted unauthorized action: ${req.method} ${req.originalUrl}`,
          ip,
          userAgent,
          'failed'
        ]
      );

      return res.status(403).json({ 
        message: 'Permission denied / لا تملك الصلاحية الكافية لإتمام هذا الإجراء' 
      });
    }

    next();
  };
}
