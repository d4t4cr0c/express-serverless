// Supabase service module - Singleton pattern
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

class SupabaseService {
    constructor() {
        this.client = null;
        this.config = null;
        this.isInitialized = false;
        this.initPromise = null;
    }

    async initialize() {
        // If already initialized, return the existing client
        if (this.isInitialized && this.client) {
            return this.client;
        }

        // If initialization is in progress, wait for it
        if (this.initPromise) {
            return this.initPromise;
        }

        // Start initialization
        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    async _doInitialize() {
        try {
            const response = await fetch('/api/auth/config');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch config: ${response.status}`);
            }
            
            this.config = await response.json();
            
            // Only create client if it doesn't exist
            if (!this.client) {
                this.client = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey, {
                    auth: {
                        redirectTo: `${window.location.origin}`,
                        autoRefreshToken: true,
                        persistSession: true,
                        storageKey: 'supabase.auth.token' // Ensure consistent storage key
                    }
                });
            }

            this.isInitialized = true;
            return this.client;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            this.initPromise = null; // Reset so we can try again
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

// Create a single instance
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

// For backward compatibility
export { supabaseService as default };
