import { Router, IRouter } from 'express';
import { healthController } from '../controllers/health.controller';

const router: IRouter = Router();

// GET /api/health - Health check endpoint
router.get('/', healthController.healthCheck);

// GET /api/health/token - Get frontend authentication token
router.get('/token', healthController.getToken);

export default router;
