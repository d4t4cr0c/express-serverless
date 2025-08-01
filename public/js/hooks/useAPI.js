// API hook
import { useState, useEffect } from 'https://esm.sh/preact@10.23.1/hooks';
import { getSupabase } from '../services/supabase.js';

export function useAPI() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        let mounted = true;
        let authSubscription = null;

        const setupSessionListener = () => {
            const supabase = getSupabase();
            if (supabase) {
                // Get current session
                supabase.auth.getSession().then(({ data: { session } }) => {
                    if (mounted) {
                        setSession(session);
                    }
                });

                // Listen for auth changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    (event, session) => {
                        if (mounted) {
                            setSession(session);
                        }
                    }
                );
                authSubscription = subscription;
            }
        };

        // Try immediately, then retry if needed
        setupSessionListener();
        
        // If supabase isn't ready yet, retry after a short delay
        const retryTimeout = setTimeout(setupSessionListener, 100);

        return () => {
            mounted = false;
            clearTimeout(retryTimeout);
            authSubscription?.unsubscribe();
        };
    }, []);

    const apiCall = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (session?.access_token) {
            headers.Authorization = `Bearer ${session.access_token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();
        return { response, data };
    };

    return { apiCall };
}
