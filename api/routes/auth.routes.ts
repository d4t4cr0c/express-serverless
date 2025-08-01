import { Router, IRouter } from 'express';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const router: IRouter = Router();

/**
 * GET /api/auth/config - Get Supabase configuration for frontend
 */
router.get('/config', (req: Request, res: Response) => {
  const config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    redirectUrl: process.env.SITE_URL || 'http://localhost:3000'
  };

  res.json(config);
});

/**
 * GET /api/auth/user - Get current user info
 */
router.get('/user', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
      message: 'No user session found'
    });
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.full_name || req.user.user_metadata?.name,
      avatar: req.user.user_metadata?.avatar_url,
      provider: req.user.app_metadata?.provider,
      role: req.user.user_metadata?.role || req.user.app_metadata?.role || 'user'
    }
  });
});

/**
 * POST /api/auth/logout - Handle logout (optional backend cleanup)
 */
router.post('/logout', (req: Request, res: Response) => {
  // With Supabase Auth, logout is handled on the frontend
  // This endpoint can be used for any backend cleanup if needed
  res.json({ message: 'Logout successful' });
});

export default router;
