import { Request, Response } from 'express';
import { supabaseService } from '../services/supabase.service';
import { Product, CreateProductData, ProductSearchQuery } from '../types';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const productController = {
  // GET /api/products - Get all products or search
  async getProducts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { search } = req.query as ProductSearchQuery;
      
      const { data, error } = await supabaseService.getProducts(search, req.accessToken);
      
      if (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
          error: 'Failed to fetch products',
          message: error.message || 'Internal server error'
        });
        return;
      }

      res.status(200).json({
        data: data || [],
        message: data?.length === 0 ? 'No products found' : `Found ${data?.length} products`
      });
    } catch (error) {
      console.error('Unexpected error in getProducts:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching products'
      });
    }
  },

  // GET /api/products/:id - Get a product by ID
  async getProductById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'Invalid product ID',
          message: 'Product ID must be a positive number'
        });
        return;
      }

      const { data, error } = await supabaseService.getProductById(id, req.accessToken);
      
      if (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({
          error: 'Failed to fetch product',
          message: error.message || 'Internal server error'
        });
        return;
      }

      if (!data) {
        res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      res.status(200).json({
        data,
        message: 'Product retrieved successfully'
      });
    } catch (error) {
      console.error('Unexpected error in getProductById:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching the product'
      });
    }
  },

  // POST /api/products - Create a new product
  async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const productData: CreateProductData = req.body;
      
      // Basic validation
      if (!productData.title || !productData.author || !productData.price) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'Title, author, and price are required'
        });
        return;
      }

      if (productData.price <= 0) {
        res.status(400).json({
          error: 'Invalid price',
          message: 'Price must be greater than 0'
        });
        return;
      }

      const { data, error } = await supabaseService.createProduct(productData, req.accessToken!);
      
      if (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
          error: 'Failed to create product',
          message: error.message || 'Internal server error'
        });
        return;
      }

      res.status(201).json({
        data: data?.[0],
        message: 'Product created successfully'
      });
    } catch (error) {
      console.error('Unexpected error in createProduct:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while creating the product'
      });
    }
  },

  // PUT /api/products/:id - Update a product by ID
  async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const productData: Partial<CreateProductData> = req.body;
      
      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'Invalid product ID',
          message: 'Product ID must be a positive number'
        });
        return;
      }

      // Validate price if provided
      if (productData.price !== undefined && productData.price <= 0) {
        res.status(400).json({
          error: 'Invalid price',
          message: 'Price must be greater than 0'
        });
        return;
      }

      // Check if product exists first
      const { data: existingProduct } = await supabaseService.getProductById(id, req.accessToken);
      if (!existingProduct) {
        res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      const { data, error } = await supabaseService.updateProduct(id, productData, req.accessToken!);
      
      if (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
          error: 'Failed to update product',
          message: error.message || 'Internal server error'
        });
        return;
      }

      res.status(200).json({
        data: data?.[0],
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Unexpected error in updateProduct:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while updating the product'
      });
    }
  },

  // DELETE /api/products/:id - Delete a product by ID
  async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'Invalid product ID',
          message: 'Product ID must be a positive number'
        });
        return;
      }

      // Check if product exists first
      const { data: existingProduct } = await supabaseService.getProductById(id, req.accessToken);
      if (!existingProduct) {
        res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
        return;
      }

      const { error } = await supabaseService.deleteProduct(id, req.accessToken!);
      
      if (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
          error: 'Failed to delete product',
          message: error.message || 'Internal server error'
        });
        return;
      }

      res.status(200).json({
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Unexpected error in deleteProduct:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred while deleting the product'
      });
    }
  }
};

export default productController;
