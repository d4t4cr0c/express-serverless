import { Router, IRouter } from 'express';
import { Request, Response } from 'express';
import { supabaseService } from '../services/supabase.service';

const router: IRouter = Router();

/**
 * TEMPORARY: Set admin role for the current user
 * This endpoint should be removed after initial setup
 */
router.post('/setup-admin', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Bearer token required'
      });
    }

    const accessToken = authHeader.substring(7);
    const { user, error } = await supabaseService.verifyToken(accessToken);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    // For security, you might want to restrict this to specific emails
    const allowedEmails: string[] = [
      // Add your email here for extra security
      // 'your-email@example.com'
    ];

    if (allowedEmails.length > 0 && !allowedEmails.includes(user.email || '')) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Not authorized to become admin'
      });
    }

    return res.json({
      message: 'Admin setup instructions',
      instructions: [
        '1. Go to your Supabase Dashboard → SQL Editor',
        '2. Run this SQL:',
        `UPDATE auth.users SET raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"'::jsonb) WHERE id = '${user.id}';`,
        '3. Refresh your app page',
        '4. You should now have admin access'
      ],
      userInfo: {
        id: user.id,
        email: user.email,
        currentRole: user.user_metadata?.role || user.app_metadata?.role || 'user'
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process admin setup'
    });
  }
});

export default router;
