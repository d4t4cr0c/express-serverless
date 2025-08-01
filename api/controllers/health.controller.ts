import { Request, Response } from 'express';
import { supabaseService } from '../services/supabase.service';
import { getFrontendToken } from '../middleware/security.middleware';

/**
 * Basic health check endpoint
 */
export async function healthCheck(req: Request, res: Response) {
  try {
    const timestamp = new Date().toISOString();
    const dbHealthy = await supabaseService.healthCheck();
    
    const healthStatus = {
      status: dbHealthy ? 'OK' : 'DEGRADED',
      timestamp,
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        api: 'healthy'
      },
      environment: process.env.NODE_ENV || 'unknown',
      version: '1.0.0'
    };

    const statusCode = dbHealthy ? 200 : 503;
    return res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        api: 'unhealthy'
      },
      error: 'Health check failed'
    });
  }
}

/**
 * Get frontend authentication token
 */
export async function getToken(req: Request, res: Response) {
  try {
    const token = getFrontendToken();
    
    return res.json({
      token,
      expires_in: 3600, // 1 hour
      token_type: 'Bearer'
    });
  } catch (error) {
    console.error('Token generation failed:', error);
    return res.status(500).json({
      error: 'Failed to generate token'
    });
  }
}

export const healthController = {
  healthCheck,
  getToken
};
