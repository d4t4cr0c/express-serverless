import { Router, IRouter } from 'express';
import { productController } from '../controllers/product.controller';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.middleware';

const router: IRouter = Router();

// GET /api/products - Get all products or search (public access with optional auth)
router.get('/', optionalAuth, productController.getProducts);

// GET /api/products/:id - Get a product by ID (public access with optional auth)
router.get('/:id', optionalAuth, productController.getProductById);

// POST /api/products - Create a new product (requires authentication and admin role)
router.post('/', requireAuth, requireAdmin, productController.createProduct);

// PUT /api/products/:id - Update a product by ID (requires authentication and admin role)
router.put('/:id', requireAuth, requireAdmin, productController.updateProduct);

// DELETE /api/products/:id - Delete a product by ID (requires authentication and admin role)
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

export default router;
