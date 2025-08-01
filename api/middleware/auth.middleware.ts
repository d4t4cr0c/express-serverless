import { Request, Response, NextFunction } from 'express';
import { supabaseService } from '../services/supabase.service';

export interface AuthenticatedRequest extends Request {
  user?: any;
  accessToken?: string;
}

/**
 * Middleware to verify Supabase JWT token
 */
export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const { user, error } = await supabaseService.verifyToken(accessToken);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Attach user and token to request
    req.user = user;
    req.accessToken = accessToken;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication verification failed'
    });
  }
};

/**
 * Middleware to check if user has admin role
 * This is a basic implementation - you can enhance based on your needs
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  // Check user metadata for admin role
  // You can customize this based on how you store user roles
  const userRole = req.user.user_metadata?.role || req.user.app_metadata?.role;
  
  if (userRole !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Optional auth middleware - proceeds with or without authentication
 */
export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      const { user, error } = await supabaseService.verifyToken(accessToken);
      
      if (!error && user) {
        req.user = user;
        req.accessToken = accessToken;
      }
    }
    
    // Always proceed, regardless of auth status
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Don't block the request, just log the error
    next();
  }
};
