// Login component
import { h } from 'https://esm.sh/preact@10.23.1';
import htm from 'https://esm.sh/htm';
import { useAuth } from '../hooks/useAuth.js';

// Initialize htm with Preact
const html = htm.bind(h);

export function LoginPage() {
    const { signIn, loading } = useAuth();

    if (loading) {
        return html`<div class="loading">Loading...</div>`;
    }

    return html`
        <div class="login-container">
            <div class="login-card">
                <h1>🔐 Welcome</h1>
                <p style="margin-bottom: 30px; color: #666;">
                    Please sign in with GitHub to manage products
                </p>
                <button class="github-btn" onClick=${signIn}>
                    🔗 Sign in with GitHub
                </button>
            </div>
        </div>
    `;
}
