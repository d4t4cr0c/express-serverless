# Express Serverless App with Supabase Auth & Preact Frontend

A modern, secure TypeScript Express application deployed as Vercel serverless functions with Supabase authentication, PostgreSQL database, and a reactive Preact frontend using ES modules.

## 📚 Table of Contents

1. [Features](#-features)
2. [Technology Stack](#-technology-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Project Structure](#-project-structure)
5. [Frontend Specifications](#-frontend-specifications)
6. [Security Features](#-security-features)
7. [Setup Instructions](#-setup-instructions)
8. [Authentication Setup](#-authentication-setup)
9. [API Endpoints](#-api-endpoints)
10. [Frontend Usage](#-frontend-usage)
11. [Development Workflow](#-development-workflow)
12. [Deployment](#-deployment)
13. [Environment Variables](#-environment-variables)
14. [Troubleshooting](#-troubleshooting)
15. [Documentation](#-documentation)

## ✨ Features

### Core Application
- 🚀 **Express.js** with TypeScript for robust backend API
- 📊 **Supabase** PostgreSQL database with Row Level Security (RLS)
- ⚡ **Vercel** serverless functions for automatic scaling
- � **GitHub OAuth** authentication via Supabase Auth
- 👥 **Role-based access control** (Admin/User permissions)
- �🔍 **Advanced product search** with real-time filtering
- ➕ **Admin product management** (Create, Read, Update, Delete)
- 📱 **Responsive design** for desktop and mobile

### Modern Frontend
- ⚛️ **Preact 10.23.1** with hooks for reactive UI
- 🏷️ **HTM (Hyperscript Tagged Markup)** for JSX-like syntax without build step
- 📦 **ES Modules** architecture with clean separation of concerns
- 🎨 **Modern CSS** with responsive grid layouts
- 🔄 **Real-time state management** with automatic UI updates
- 🛡️ **Singleton pattern** for Supabase client management

### Security & Performance
- 🔒 **Comprehensive security middleware** stack
- 🚦 **Request rate limiting** and payload size controls
- 🛡️ **XSS and SQL injection prevention**
- 📋 **Content Security Policy** implementation
- 🎯 **Performance monitoring** and error tracking

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth (GitHub OAuth)
- **Deployment**: Vercel Serverless Functions
- **Security**: Custom middleware stack with CORS, CSP, rate limiting

### Frontend
- **Framework**: Preact 10.23.1 (3KB React alternative)
- **Template Engine**: HTM (Hyperscript Tagged Markup)
- **Module System**: Native ES6 modules (no build process)
- **Styling**: Modern CSS with Grid and Flexbox
- **State Management**: Preact hooks with custom services
- **HTTP Client**: Fetch API for backend communication

### Development Tools
- **Package Manager**: pnpm
- **Type Checking**: TypeScript with strict mode
- **Development Server**: tsx for local development
- **Environment**: dotenv for configuration management

## 🏗 Architecture Overview

### Serverless Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │  Serverless     │    │   Supabase      │
│   (Frontend)    │────│  Functions      │────│   Database      │
│   Static Files  │    │  (API Routes)   │    │   + Auth        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   GitHub OAuth  │──────────────┘
                        │   Integration   │
                        └─────────────────┘
```

### Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Components/     │  Hooks/         │  Services/             │
│  - App.js        │  - useAuth.js   │  - supabase.js         │
│  - LoginPage.js  │  - useAPI.js    │    (Singleton)         │
│  - Header.js     │  - useProducts.js                        │
│  - ProductTable.js                                         │
│  - ProductForm.js                                          │
├─────────────────────────────────────────────────────────────┤
│                     ES Modules Layer                        │
├─────────────────────────────────────────────────────────────┤
│  External Dependencies (ESM.sh CDN)                        │
│  - Preact + Hooks                                          │
│  - HTM Template Engine                                     │
│  - Supabase Client                                         │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
├── api/                          # Serverless API functions
│   ├── index.ts                  # Main Express app export
│   ├── controllers/              # Business logic handlers
│   │   ├── health.controller.ts  # Health check endpoints
│   │   └── product.controller.ts # Product CRUD operations
│   ├── middleware/               # Express middleware stack
│   │   ├── auth.middleware.ts    # JWT verification & role checks
│   │   ├── error.middleware.ts   # Error handling & logging
│   │   ├── security.middleware.ts        # CORS & validation
│   │   └── security-headers.middleware.ts # CSP & security headers
│   ├── routes/                   # API route definitions
│   │   ├── index.ts              # Main router assembly
│   │   ├── auth.routes.ts        # Authentication endpoints
│   │   ├── health.routes.ts      # Health check routes
│   │   └── products.routes.ts    # Product management routes
│   ├── services/                 # External service integrations
│   │   └── supabase.service.ts   # Supabase client & operations
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts              # Shared type definitions
│   ├── utils/                    # Utility functions
│   │   └── validation.utils.ts   # Input validation helpers
│   └── data/
│       └── products.json         # Sample data for development
├── public/                       # Frontend static files
│   ├── index.html                # Entry point (minimal HTML)
│   ├── css/
│   │   └── styles.css            # Application styles
│   └── js/                       # Modular JavaScript
│       ├── main.js               # Application bootstrap
│       ├── components/           # Preact UI components
│       │   ├── App.js            # Main application component
│       │   ├── LoginPage.js      # GitHub OAuth login
│       │   ├── Header.js         # Navigation & user info
│       │   ├── ProductTable.js   # Data table component
│       │   ├── ProductSearch.js  # Search & filtering
│       │   └── ProductForm.js    # Admin product creation
│       ├── hooks/                # Custom Preact hooks
│       │   ├── useAuth.js        # Authentication state
│       │   ├── useAPI.js         # HTTP client with auth
│       │   └── useProducts.js    # Product state management
│       └── services/             # Frontend services
│           └── supabase.js       # Singleton Supabase client
├── docs/                         # Documentation
│   ├── serverless-vs-vps-deployment.md
│   └── gotrueclient-singleton-solution.md
├── dev-server.ts                 # Local development server
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Serverless deployment config (300s timeout)
└── .env.example                  # Environment variables template
```

## ⚛️ Frontend Specifications

### Preact Implementation Details

#### **No-Build Architecture**
- **ES Modules**: Direct browser support, no bundling required
- **CDN Dependencies**: All libraries loaded from esm.sh CDN
- **Hot Reloading**: Native browser module reloading
- **Development Speed**: Instant updates without build step

#### **Component Architecture**
```javascript
// HTM Syntax Example
import { h } from 'https://esm.sh/preact@10.23.1';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

export function ProductTable({ products }) {
    return html`
        <div class="product-table-container">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => html`
                        <tr key=${product.id}>
                            <td>${product.title}</td>
                            <td>${product.author}</td>
                            <td><span class="category-badge">${product.category}</span></td>
                            <td class="price-cell">${product.price}</td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `;
}
```

#### **State Management Pattern**
```javascript
// Custom hooks for reactive state
export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const addProduct = async (productData) => {
        const result = await apiCall('/api/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
        
        if (result.success) {
            // Reactive update - UI updates automatically
            setProducts(prevProducts => [...prevProducts, result.data]);
        }
        return result;
    };
    
    return { products, loading, addProduct };
}
```

#### **Singleton Service Pattern**
```javascript
// Prevents multiple Supabase client instances
class SupabaseService {
    constructor() {
        this.client = null;
        this.isInitialized = false;
    }
    
    async initialize() {
        if (this.isInitialized && this.client) {
            return this.client;
        }
        // Initialize once, reuse everywhere
        this.client = createClient(url, key);
        this.isInitialized = true;
        return this.client;
    }
}
```

#### **Performance Characteristics**
- **Bundle Size**: ~15KB total (Preact + HTM + app code)
- **Load Time**: <100ms first paint with CDN caching
- **Memory Usage**: ~2MB runtime footprint
- **Reactivity**: Real-time UI updates without manual DOM manipulation

### Modern CSS Features
- **CSS Grid**: Responsive layouts without media query complexity
- **Custom Properties**: Theme-able design system
- **Flexbox**: Component-level layouts
- **Container Queries**: Component-responsive design (where supported)

## 🔐 Security Features

### Authentication & Authorization
```typescript
// JWT-based authentication with role checking
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { user, error } = await supabaseService.verifyToken(req.accessToken!);
    
    if (!user || user.user_metadata?.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    
    req.user = user;
    next();
};
```

### Database Security (Row Level Security)
```sql
-- Admin-only product creation
CREATE POLICY "Admin can insert products" ON products
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Public read access
CREATE POLICY "Anyone can read products" ON products
FOR SELECT USING (true);
```

### Content Security Policy
```typescript
// Strict CSP preventing XSS attacks
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' https://esm.sh 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src 'self' https://*.supabase.co; " +
        "frame-ancestors 'none';"
    );
});
```

### Input Validation & Sanitization
```typescript
// SQL injection prevention
function sanitizeSearchTerm(term: string): string | null {
    const cleaned = term
        .replace(/[;'"\\]/g, '')     // Remove dangerous characters
        .replace(/--/g, '')          // Remove SQL comments
        .replace(/\/\*/g, '')        // Remove block comments
        .trim();
    
    // Reject SQL keywords
    const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b/i;
    return sqlKeywords.test(cleaned) ? null : cleaned;
}
```

### Rate Limiting & DoS Protection
```typescript
// Per-origin rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const enhancedCors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;
    
    // Rate limiting logic
    const key = origin || req.ip;
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > current.resetTime) {
        current.count = 1;
        current.resetTime = now + windowMs;
    } else {
        current.count++;
    }
    
    if (current.count > maxRequests) {
        res.status(429).json({ error: 'Too many requests' });
        return;
    }
    
    rateLimitStore.set(key, current);
    next();
};
```

### Security Headers Stack
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Restricted camera, microphone, geolocation access

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Supabase account
- Vercel account (for deployment)
- GitHub account (for OAuth)

### 1. Clone & Install
```bash
git clone <repository-url>
cd express-serverless
pnpm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Setup
1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and API keys

2. **Run Database Setup**
   ```sql
   -- In Supabase SQL Editor, run:
   -- 1. Create products table
   -- 2. Enable Row Level Security
   -- 3. Create security policies
   -- 4. Insert sample data
   ```
   Copy and run the contents of `supabase-setup.sql`

3. **Configure GitHub OAuth**
   - Follow the guide in `docs/github-supabase-oauth-setup.md`
   - Set up GitHub OAuth app
   - Configure Supabase Auth provider

## 🔐 Authentication Setup

### GitHub OAuth Configuration

1. **Create GitHub OAuth App**
   ```
   GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   
   Application name: Your App Name
   Homepage URL: https://your-domain.com
   Authorization callback URL: https://your-project.supabase.co/auth/v1/callback
   ```

2. **Configure Supabase Auth**
   ```
   Supabase Dashboard → Authentication → Providers → GitHub
   
   Enable GitHub provider
   Client ID: (from GitHub OAuth app)
   Client Secret: (from GitHub OAuth app)
   ```

3. **Assign Admin Role**
   ```sql
   -- Make yourself admin (run in Supabase SQL Editor)
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'), 
     '{role}', 
     '"admin"'
   ) 
   WHERE email = 'your-email@example.com';
   ```

## 📡 API Endpoints

### Authentication Routes
```http
GET  /api/auth/config     # Frontend auth configuration
GET  /api/auth/user       # Current user info
```

### Product Management
```http
GET    /api/products                    # List/search products
POST   /api/products                    # Create product (admin only)
GET    /api/products/:id                # Get product by ID
PUT    /api/products/:id                # Update product (admin only)
DELETE /api/products/:id                # Delete product (admin only)
```

### Health Check
```http
GET /api/health                         # Application health status
```

### API Examples

#### Search Products
```bash
# Search by title or author
curl "https://your-app.vercel.app/api/products?search=photography"

# Get all products
curl "https://your-app.vercel.app/api/products"
```

#### Create Product (Admin Required)
```bash
curl -X POST "https://your-app.vercel.app/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Advanced Photography",
    "subtitle": "Mastering Light and Composition", 
    "author": "Jane Smith",
    "description": "A comprehensive guide to professional photography",
    "price": 49.99,
    "currency_id": "USD",
    "category_id": "MLA412445",
    "product-category": "book",
    "available_quantity": 25
  }'
```

## 🖥 Frontend Usage

### User Flow
1. **Landing Page**: Displays login prompt for unauthenticated users
2. **GitHub Login**: OAuth authentication via Supabase
3. **Product Dashboard**: Search and view products
4. **Admin Features**: Create/edit products (admin users only)

### Key Features
- **Real-time Search**: Type to filter products instantly
- **Responsive Table**: Mobile-friendly product display  
- **Role-based UI**: Admin controls shown only to admin users
- **Reactive Updates**: New products appear immediately after creation
- **Error Handling**: User-friendly error messages and retry options

### Component Structure
```javascript
App
├── LoginPage              # GitHub OAuth authentication
└── Authenticated Layout
    ├── Header             # User info, role display, logout
    ├── ProductSearch      # Search form + results table
    └── ProductForm        # Admin-only product creation
```

## � Development Workflow

### Local Development
```bash
# Start development server
pnpm dev

# Development server features:
# - Express server on http://localhost:3000
# - Static file serving for frontend
# - API routes for testing
# - Environment variable loading
# - TypeScript compilation
```

### Code Organization
```bash
# Backend development
api/
├── controllers/    # Add new endpoint handlers
├── routes/        # Define new API routes  
├── middleware/    # Add cross-cutting concerns
├── services/      # External service integrations
└── types/         # TypeScript definitions

# Frontend development  
public/js/
├── components/    # Add new UI components
├── hooks/         # Add custom Preact hooks
└── services/      # Add frontend services
```

### Development Scripts
```bash
pnpm dev              # Local development server
pnpm build            # TypeScript compilation
pnpm dev:vercel       # Simulate Vercel environment locally
```

## 🚢 Deployment

### Vercel Deployment
1. **Connect Repository**
   ```bash
   # Option 1: CLI deployment
   vercel --prod
   
   # Option 2: GitHub integration (recommended)
   # Connect repo to Vercel dashboard for auto-deployments
   ```

2. **Environment Variables**
   ```
   Vercel Dashboard → Project → Settings → Environment Variables
   
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key  
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Domain Configuration**
   - Custom domains via Vercel dashboard
   - Automatic HTTPS certificates
   - Global CDN distribution

### Production Considerations
- **Function Timeout**: 300 seconds (5 minutes) configured in vercel.json
- **Memory Limits**: 1GB max per function
- **Cold Starts**: ~100-500ms for Node.js functions
- **Rate Limits**: Based on Vercel plan limits

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Supabase project URL | ✅ | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Public anon key | ✅ | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | ✅ | `eyJhbGciOiJIUzI1NiIs...` |
| `NODE_ENV` | Environment mode | ❌ | `production` |
| `VERCEL_URL` | Auto-set by Vercel | ❌ | `your-app.vercel.app` |

### Security Notes
- ✅ **Service role key**: Backend only, never expose to frontend
- ✅ **Anon key**: Safe for frontend, has limited permissions
- ✅ **Environment files**: Never commit `.env.local` to version control

## 🛠 Troubleshooting

### Common Issues

#### Authentication Problems
```bash
# Issue: GitHub OAuth not working
# Solution: Check callback URL configuration
# Verify: https://your-project.supabase.co/auth/v1/callback

# Issue: Admin role not working  
# Solution: Check user metadata in Supabase dashboard
# Run: UPDATE auth.users SET raw_user_meta_data = jsonb_set(...)
```

#### Database Connection Issues
```bash
# Issue: Database queries failing
# Solution: Verify environment variables
# Check: SUPABASE_URL and keys in Vercel dashboard

# Issue: RLS policies blocking access
# Solution: Review policies in Supabase dashboard
# Check: Products table permissions
```

#### Frontend Loading Issues
```bash
# Issue: Modules not loading
# Solution: Check network tab for 404s
# Verify: All imports use correct paths

# Issue: Authentication state not updating
# Solution: Check browser console for errors  
# Verify: Singleton pattern working correctly
```

### Debug Tools
```javascript
// Enable debug logging
localStorage.setItem('debug', 'supabase:*');

// Monitor function execution time
console.time('operation');
await someOperation();
console.timeEnd('operation');

// Check auth state
console.log('Auth state:', await supabase.auth.getSession());
```

## 📖 Documentation

### Available Guides
- **[Serverless vs VPS Deployment](./docs/serverless-vs-vps-deployment.md)** - Architecture comparison and trade-offs
- **[GoTrueClient Singleton Solution](./docs/gotrueclient-singleton-solution.md)** - Multiple instance warning fix

### Architecture Decisions
- **Serverless-first**: Built for automatic scaling and cost efficiency
- **Security-focused**: Multiple layers of protection against common vulnerabilities  
- **No-build frontend**: ES modules for faster development without build complexity
- **Reactive state**: Preact hooks for consistent UI updates
- **Type safety**: TypeScript throughout for better developer experience

### Performance Characteristics
- **Cold start**: ~200ms average
- **Database queries**: <100ms typical response time
- **Frontend bundle**: ~15KB total size
- **Memory usage**: ~50MB per function execution
- **Concurrent users**: Scales automatically with Vercel infrastructure

---

**Built with ❤️ using modern web technologies for scalable, secure applications.**
