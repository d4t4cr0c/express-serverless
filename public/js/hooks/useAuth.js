// Auth hook
import { useState, useEffect } from 'https://esm.sh/preact@10.23.1/hooks';
import { initSupabase, getSupabase, isSupabaseReady } from '../services/supabase.js';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supabaseReady, setSupabaseReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        let authSubscription = null;

        async function initializeAuth() {
            try {
                // Initialize Supabase (singleton pattern ensures only one instance)
                const supabaseClient = await initSupabase();
                
                if (!mounted || !supabaseClient) {
                    return;
                }
                
                setSupabaseReady(true);
                
                // Get initial session
                const { data: { session } } = await supabaseClient.auth.getSession();
                
                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                    setLoading(false);
                }

                // Set up auth state change listener
                const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
                    async (event, session) => {
                        if (mounted) {
                            setSession(session);
                            setUser(session?.user ?? null);
                            setLoading(false);
                        }
                    }
                );
                authSubscription = subscription;

            } catch (error) {
                console.error('Auth initialization error:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        initializeAuth();

        return () => {
            mounted = false;
            authSubscription?.unsubscribe();
        };
    }, []);

    const signIn = async () => {
        const supabase = getSupabase();
        if (!supabase) {
            console.error('Supabase not initialized');
            return;
        }
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}`
            }
        });
        
        if (error) {
            console.error('Error signing in:', error);
        }
    };

    const signOut = async () => {
        const supabase = getSupabase();
        if (!supabase) {
            console.error('Supabase not initialized');
            return;
        }
        
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    };

    return {
        user,
        session,
        loading,
        signIn,
        signOut,
        supabaseReady
    };
}
