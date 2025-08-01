// Main App component
import { h } from 'https://esm.sh/preact@10.23.1';
import htm from 'https://esm.sh/htm';
import { useAuth } from '../hooks/useAuth.js';
import { useProducts } from '../hooks/useProducts.js';
import { LoginPage } from './LoginPage.js';
import { Header } from './Header.js';
import { ProductSearch } from './ProductSearch.js';
import { ProductForm } from './ProductForm.js';

// Initialize htm with Preact
const html = htm.bind(h);

export function App() {
    const { user, loading, signOut } = useAuth();
    const productsState = useProducts();

    if (loading) {
        return html`
            <div class="container">
                <div class="loading">Loading application...</div>
            </div>
        `;
    }

    if (!user) {
        return html`<${LoginPage} />`;
    }

    return html`
        <div class="container">
            <${Header} user=${user} onSignOut=${signOut} />
            <${ProductSearch} productsState=${productsState} />
            <${ProductForm} productsState=${productsState} />
        </div>
    `;
}
