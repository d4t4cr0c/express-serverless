// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { enhancedCors } from './middleware/security.middleware';
import { securityHeaders, apiSecurityHeaders } from './middleware/security-headers.middleware';

const app: Express = express();

// Security headers (applied first)
app.use(securityHeaders);

// Middleware
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS configuration with security checks
app.use(enhancedCors);

// API-specific security headers
app.use('/api', apiSecurityHeaders);

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// For Vercel serverless functions
export default app;
