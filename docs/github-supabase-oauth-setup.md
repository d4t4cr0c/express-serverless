# 🚀 Supabase Auth + GitHub OAuth Setup Guide

## Overview
This guide will help you set up GitHub OAuth authentication with Supabase for your Express serverless app.

## Step 1: Configure GitHub OAuth App

### 1.1 Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `Your App Name`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

### 1.2 Get Your Supabase Project Details
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Settings → API
3. Copy:
   - **Project URL** (https://your-project-ref.supabase.co)
   - **Project API Key** (anon public key)

## Step 2: Configure Supabase Authentication

### 2.1 Enable GitHub Provider
1. In your Supabase Dashboard, go to **Authentication → Providers**
2. Find **GitHub** and click to configure
3. Enable GitHub authentication
4. Enter your GitHub OAuth app credentials:
   - **Client ID**: From GitHub OAuth app
   - **Client Secret**: From GitHub OAuth app
5. Set **Redirect URL** to: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Click **Save**

### 2.2 Configure Site URL
1. Go to **Authentication → Settings**
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

## Step 3: Update Database Schema

### 3.1 Run the Auth Setup SQL
1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy and paste the contents of `supabase-auth-setup.sql`
3. Click **Run** to execute the SQL
4. This will:
   - Update the products table with user tracking
   - Set up Row Level Security policies
   - Create admin-only access for create/update/delete operations

### 3.2 Make Yourself an Admin
After you first log in with GitHub, you'll need to make yourself an admin:

1. Go to **Authentication → Users** in Supabase Dashboard
2. Find your user account
3. Click on the user to edit
4. In the **Raw User Meta Data** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Click **Save**

## Step 4: Update Environment Variables

### 4.1 Update Your .env File
Add/update these variables in your `.env` file:

```bash
# Existing Supabase vars
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# New variables for auth
SITE_URL=http://localhost:3000

# Optional: Custom domain for production
# CUSTOM_DOMAIN=your-domain.com
```

## Step 5: Deploy and Test

### 5.1 Start Your Development Server
```bash
pnpm dev
```

### 5.2 Test the New Frontend
1. Navigate to `http://localhost:3000/index-preact.html`
2. Click "Sign in with GitHub"
3. Complete the OAuth flow
4. You should see the dashboard with your user info

### 5.3 Test Admin Functions
- If you're an admin, you should see the "Add New Product" form
- If you're not an admin, you'll see a message about needing admin access

## Step 6: Switch to New Frontend (Optional)

Once everything is working, you can replace the old frontend:

```bash
# Backup the old frontend
mv public/index.html public/index-old.html

# Use the new Preact frontend
mv public/index-preact.html public/index.html
```

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URL"**
   - Check that your GitHub OAuth callback URL matches Supabase exactly
   - Format: `https://your-project-ref.supabase.co/auth/v1/callback`

2. **"Forbidden: Admin access required"**
   - Make sure you've added `"role": "admin"` to your user metadata in Supabase

3. **Authentication not persisting**
   - Check that SITE_URL is set correctly in your environment variables
   - Ensure the domain matches between your app and Supabase settings

4. **CORS errors**
   - Verify your Site URL in Supabase Authentication settings
   - Check that the domain matches exactly (including port for localhost)

## Production Deployment

For production deployment:

1. Update GitHub OAuth app with production URLs
2. Update Supabase Site URL to your production domain
3. Set environment variables on your hosting platform
4. Update CORS settings if needed

## Features Now Available

✅ **GitHub OAuth Authentication**  
✅ **User Profiles with Avatar**  
✅ **Role-based Access Control**  
✅ **Admin-only Product Management**  
✅ **Persistent Sessions**  
✅ **Modern Preact Frontend**  
✅ **No-build Setup**  

Your app now has enterprise-grade authentication with GitHub OAuth! 🎉
