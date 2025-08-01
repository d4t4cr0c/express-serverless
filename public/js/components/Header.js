// Header component
import { h } from 'https://esm.sh/preact@10.23.1';
import htm from 'https://esm.sh/htm';

// Initialize htm with Preact
const html = htm.bind(h);

export function Header({ user, onSignOut }) {
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role || 'user';
    const isAdmin = userRole === 'admin';

    return html`
        <div class="header">
            <div>
                <h1>📚 Product Manager</h1>
                ${isAdmin && html`
                    <span style="background: #007acc; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        ADMIN
                    </span>
                `}
            </div>
            <div class="user-info">
                ${user.user_metadata?.avatar_url && html`
                    <img 
                        src=${user.user_metadata.avatar_url} 
                        class="avatar"
                        alt="Avatar"
                    />
                `}
                <div>
                    <div style="font-weight: bold;">
                        ${user.user_metadata?.full_name || user.email}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        ${user.email}
                    </div>
                </div>
                <button 
                    onClick=${onSignOut}
                    class="secondary"
                    style="width: auto; padding: 8px 16px; margin-left: 10px;"
                >
                    Sign Out
                </button>
            </div>
        </div>
    `;
}
