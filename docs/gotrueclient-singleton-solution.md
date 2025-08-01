# GoTrueClient Multiple Instances Warning: Problem & Solution

## 🚨 The Problem: Multiple GoTrueClient Instances Warning

### What is GoTrueClient?

**GoTrueClient** is the authentication client inside Supabase that handles:
- User authentication (sign in/out)
- Session management and token refresh
- OAuth provider integrations (GitHub, Google, etc.)
- Auth state change listeners

### The Warning Message

When multiple Supabase client instances are created, you'll see this warning in the browser console:

```
⚠️ Multiple GoTrueClient instances detected in the same browser session. 
This may lead to undefined behavior and session conflicts.
```

### Why This Warning Appears

The warning occurs when multiple instances of `createClient()` are called with the same configuration, which creates multiple GoTrueClient instances that:

1. **Compete for session storage** - Each instance tries to manage the same auth tokens
2. **Create duplicate event listeners** - Multiple listeners for auth state changes
3. **Cause memory leaks** - Unused instances remain in memory
4. **Lead to undefined behavior** - Session conflicts and inconsistent auth state

### Common Causes in React/Preact Applications

#### ❌ **Anti-Pattern: Multiple Client Creation**
```javascript
// 🚫 BAD: Creating clients in multiple places
// Component A
const supabase = createClient(url, key);

// Component B  
const supabase = createClient(url, key); // Another instance!

// Hook C
const supabase = createClient(url, key); // Yet another instance!
```

#### ❌ **Anti-Pattern: Module-Level Client Creation**
```javascript
// 🚫 BAD: Direct module exports
// services/supabase.js
export const supabase = createClient(url, key);

// hooks/useAuth.js
import { supabase } from '../services/supabase.js';

// hooks/useAPI.js  
import { supabase } from '../services/supabase.js';
// Each import could create a new instance depending on module loading
```

#### ❌ **Anti-Pattern: Component-Level Creation**
```javascript
// 🚫 BAD: Creating client in component render
function MyComponent() {
    const supabase = createClient(url, key); // New instance every render!
    // ...
}
```

## ✅ The Solution: Singleton Pattern

### Our Implementation Strategy

We implemented a **Singleton pattern** that ensures only one Supabase client instance exists throughout the application lifecycle.

### 1. **Frontend Singleton Service** (`/public/js/services/supabase.js`)

```javascript
class SupabaseService {
    constructor() {
        this.client = null;              // Single client instance
        this.config = null;              // Configuration cache
        this.isInitialized = false;      // Initialization flag
        this.initPromise = null;         // Prevent concurrent initialization
    }

    async initialize() {
        // Return existing client if already initialized
        if (this.isInitialized && this.client) {
            return this.client;
        }

        // Wait for in-progress initialization
        if (this.initPromise) {
            return this.initPromise;
        }

        // Start new initialization
        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    async _doInitialize() {
        try {
            // Fetch config from backend
            const response = await fetch('/api/auth/config');
            this.config = await response.json();
            
            // Create client only if it doesn't exist
            if (!this.client) {
                this.client = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey, {
                    auth: {
                        redirectTo: `${window.location.origin}`,
                        autoRefreshToken: true,
                        persistSession: true,
                        storageKey: 'supabase.auth.token' // Consistent storage key
                    }
                });
            }

            this.isInitialized = true;
            return this.client;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.initPromise = null; // Reset for retry
            throw error;
        }
    }

    getClient() {
        return this.client;
    }

    isReady() {
        return this.isInitialized && this.client !== null;
    }
}

// Create single instance (singleton)
const supabaseService = new SupabaseService();

// Export functions that use the singleton
export async function initSupabase() {
    return await supabaseService.initialize();
}

export function getSupabase() {
    return supabaseService.getClient();
}

export function isSupabaseReady() {
    return supabaseService.isReady();
}
```

### 2. **Backend Singleton Pattern** (`/api/services/supabase.service.ts`)

```typescript
// Lazy initialization of Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration.');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Authenticated clients are created per-request (stateless)
function getAuthenticatedClient(accessToken: string): SupabaseClient {
  // Create new client with user token for each request
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
```

### 3. **Hooks Using Singleton** (`/public/js/hooks/useAuth.js`)

```javascript
export function useAuth() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        let authSubscription = null;

        async function initializeAuth() {
            try {
                // Use singleton - ensures only one instance
                const supabaseClient = await initSupabase();
                
                if (!mounted || !supabaseClient) return;
                
                // Get initial session
                const { data: { session } } = await supabaseClient.auth.getSession();
                
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);
                }

                // Single auth state listener
                const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
                    async (event, session) => {
                        if (mounted) {
                            setSession(session);
                            setUser(session?.user ?? null);
                        }
                    }
                );

                authSubscription = subscription;
            } catch (error) {
                console.error('Auth initialization failed:', error);
                if (mounted) setLoading(false);
            }
        }

        initializeAuth();

        // Cleanup
        return () => {
            mounted = false;
            if (authSubscription) {
                authSubscription.unsubscribe();
            }
        };
    }, []);

    // ... rest of hook
}
```

## 🔧 Key Features of Our Solution

### 1. **Single Instance Guarantee**
- ✅ Only one GoTrueClient instance across the entire application
- ✅ Prevents session conflicts and memory leaks
- ✅ Consistent auth state management

### 2. **Lazy Initialization**
- ✅ Client created only when needed
- ✅ Configuration fetched from backend securely
- ✅ Handles initialization failures gracefully

### 3. **Concurrent Access Protection**
- ✅ `initPromise` prevents multiple simultaneous initializations
- ✅ Multiple components can safely call `initSupabase()`
- ✅ Returns same promise for concurrent calls

### 4. **Error Recovery**
- ✅ Resets initialization state on failure
- ✅ Allows retry after configuration errors
- ✅ Graceful degradation when backend is unavailable

### 5. **Clean Separation of Concerns**
- ✅ Frontend: Singleton service with auth state management
- ✅ Backend: Per-request authenticated clients (stateless)
- ✅ Hooks: Use singleton, focus on reactive state

## 📊 Before vs After Comparison

### Before (Multiple Instances)
```
🚫 Problem Indicators:
- Console warning about multiple GoTrueClient instances
- Inconsistent auth state between components
- Memory leaks from unused clients
- Potential session conflicts
- Race conditions in auth state updates
```

### After (Singleton Pattern)
```
✅ Solution Benefits:
- No more GoTrueClient warnings
- Consistent auth state across all components
- Proper memory management
- Single source of truth for authentication
- Reliable session management
- Better performance (fewer clients)
```

## 🔍 Debugging Multiple Instances

### Detection Methods

#### 1. **Console Warnings**
```javascript
// Supabase automatically detects and warns about multiple instances
⚠️ Multiple GoTrueClient instances detected in the same browser session.
```

#### 2. **Manual Detection**
```javascript
// Add to your app for debugging
let supabaseInstanceCount = 0;

// Patch createClient to track instances
const originalCreateClient = createClient;
window.createClient = function(...args) {
    supabaseInstanceCount++;
    console.log(`Supabase instance #${supabaseInstanceCount} created`);
    console.trace('Creation stack trace:');
    return originalCreateClient(...args);
};
```

#### 3. **Memory Inspection**
```javascript
// Check for multiple auth listeners
console.log('Auth listeners count:', window.supabase?.auth?._listeners?.length);
```

### Common Debugging Steps

1. **Search for `createClient` calls** in your codebase
2. **Check import patterns** - avoid circular dependencies
3. **Verify singleton usage** - ensure all code uses the same instance
4. **Monitor console warnings** during development
5. **Test auth state consistency** across components

## 🚀 Best Practices

### ✅ Do's

1. **Use Singleton Pattern**
   ```javascript
   // Single instance creation
   const supabaseService = new SupabaseService();
   ```

2. **Lazy Initialization**
   ```javascript
   // Create only when needed
   if (!this.client) {
       this.client = createClient(url, key);
   }
   ```

3. **Proper Cleanup**
   ```javascript
   // Unsubscribe from auth listeners
   return () => {
       if (authSubscription) {
           authSubscription.unsubscribe();
       }
   };
   ```

4. **Centralized Configuration**
   ```javascript
   // Fetch config from secure backend endpoint
   const config = await fetch('/api/auth/config');
   ```

### ❌ Don'ts

1. **Multiple createClient Calls**
   ```javascript
   // 🚫 Don't create multiple instances
   const supabase1 = createClient(url, key);
   const supabase2 = createClient(url, key);
   ```

2. **Component-Level Client Creation**
   ```javascript
   // 🚫 Don't create in component render
   function MyComponent() {
       const supabase = createClient(url, key);
   }
   ```

3. **Hardcoded Configuration**
   ```javascript
   // 🚫 Don't expose keys in frontend
   const supabase = createClient(
       'https://hardcoded-url.supabase.co',
       'hardcoded-anon-key'
   );
   ```

4. **Missing Cleanup**
   ```javascript
   // 🚫 Don't forget to unsubscribe
   supabase.auth.onAuthStateChange(() => {
       // Missing cleanup in useEffect
   });
   ```

## 📈 Performance Impact

### Memory Usage
- **Before**: Multiple clients × ~2MB each = Memory waste
- **After**: Single client = ~2MB total

### Network Requests  
- **Before**: Multiple auth config fetches
- **After**: Single config fetch, cached

### Event Listeners
- **Before**: Multiple auth state listeners
- **After**: Single listener, shared state

### Bundle Size
- **Before**: Multiple client instances in memory
- **After**: Single instance, better tree-shaking

## 🎯 Summary

The **GoTrueClient multiple instances warning** occurs when multiple Supabase clients are created, leading to:
- Session conflicts
- Memory leaks  
- Inconsistent auth state
- Performance issues

Our **Singleton pattern solution** ensures:
- ✅ Single GoTrueClient instance
- ✅ Consistent auth state
- ✅ Proper memory management
- ✅ No more console warnings
- ✅ Better performance

The implementation uses a class-based singleton with lazy initialization, error recovery, and concurrent access protection, providing a robust foundation for authentication in our serverless Express application.
