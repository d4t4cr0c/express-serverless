import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Generate a shared secret for request verification
const API_SECRET = process.env.API_SECRET || crypto.randomBytes(32).toString('hex');

export interface AuthenticatedRequest extends Request {
  isVerifiedFrontend?: boolean;
}

/**
 * Enhanced CORS middleware with additional security checks
 */
export const enhancedCors = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const userAgent = req.get('User-Agent');
  
  // Define allowed origins based on environment
  const allowedOrigins = getAllowedOrigins();
  
  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin && isFromSameDomain(referer, req)) {
    // Allow same-domain requests (when serving frontend from same server)
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    return res.status(403).json({ 
      error: 'Forbidden: Invalid origin',
      message: 'Requests are only allowed from the official frontend'
    });
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Frontend-Token');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

/**
 * Frontend verification middleware using tokens
 */
export const verifyFrontendToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const frontendToken = req.get('X-Frontend-Token');
  const expectedToken = generateFrontendToken();
  
  if (frontendToken === expectedToken) {
    req.isVerifiedFrontend = true;
  }
  
  next();
};

/**
 * Strict frontend-only middleware (blocks all non-frontend requests)
 */
export const frontendOnlyAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.isVerifiedFrontend) {
    return res.status(403).json({
      error: 'Forbidden: Frontend access only',
      message: 'This endpoint only accepts requests from the official frontend application'
    });
  }
  
  next();
};

/**
 * Rate limiting per origin
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitByOrigin = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || req.get('Origin') || 'unknown';
    const now = Date.now();
    
    const current = requestCounts.get(identifier);
    
    if (!current || now > current.resetTime) {
      requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (current.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    current.count++;
    next();
  };
};

/**
 * Helper functions
 */
function getAllowedOrigins(): string[] {
  const origins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  
  // Add production origins
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }
  
  // Add custom domain if specified
  if (process.env.CUSTOM_DOMAIN) {
    origins.push(`https://${process.env.CUSTOM_DOMAIN}`);
  }
  
  return origins;
}

function isFromSameDomain(referer: string | undefined, req: Request): boolean {
  if (!referer) return false;
  
  const refererUrl = new URL(referer);
  const requestHost = req.get('Host');
  
  return refererUrl.host === requestHost;
}

function generateFrontendToken(): string {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 5)); // 5-minute windows
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(`frontend-${timestamp}`)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Generate token for frontend to use
 */
export const getFrontendToken = (): string => {
  return generateFrontendToken();
};
