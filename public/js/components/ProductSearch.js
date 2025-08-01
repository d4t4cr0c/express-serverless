// Product search component
import { h } from 'https://esm.sh/preact@10.23.1';
import { useState } from 'https://esm.sh/preact@10.23.1/hooks';
import htm from 'https://esm.sh/htm';
import { ProductTable } from './ProductTable.js';

// Initialize htm with Preact
const html = htm.bind(h);

export function ProductSearch({ productsState }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { products, loading, error, fetchProducts, setError } = productsState;

    const handleSearch = async () => {
        await fetchProducts(searchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        fetchProducts('');
    };

    return html`
        <div class="card">
            <h2>🔍 Search Products</h2>
            <div class="search-container">
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value=${searchTerm}
                    onInput=${(e) => setSearchTerm(e.target.value)}
                    onKeyPress=${handleKeyPress}
                />
                <button onClick=${handleSearch} disabled=${loading}>
                    ${loading ? 'Searching...' : 'Search'}
                </button>
                <button 
                    onClick=${handleClear}
                    disabled=${loading}
                    style="margin-left: 10px;"
                >
                    Clear
                </button>
            </div>
            ${error && html`<div class="error">${error}</div>`}
            <div class="results">
                ${loading ? html`<div class="loading">Loading products...</div>` :
                  html`
                    <div>
                        <p style="margin-bottom: 15px; color: #666;">
                            Found ${products.length} product${products.length !== 1 ? 's' : ''}
                        </p>
                        <${ProductTable} products=${products} />
                    </div>
                  `
                }
            </div>
        </div>
    `;
}
