import { Router, IRouter } from 'express';
import productRoutes from './products.routes';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import { rateLimitByOrigin } from '../middleware/security.middleware';

const router: IRouter = Router();

// Apply rate limiting to all API routes
router.use(rateLimitByOrigin(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Mount route modules
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/health', healthRoutes);

export default router;
