// Product table component
import { h } from 'https://esm.sh/preact@10.23.1';
import htm from 'https://esm.sh/htm';

// Initialize htm with Preact
const html = htm.bind(h);

export function ProductTable({ products }) {
    if (!products || products.length === 0) {
        return html`<div class="no-products">No products found.</div>`;
    }

    return html`
        <div class="product-table-container">
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Currency</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => html`
                        <tr key=${product.id}>
                            <td class="title-cell">
                                <div class="product-title">${product.title || 'N/A'}</div>
                                ${product.subtitle && html`
                                    <div class="product-subtitle">${product.subtitle}</div>
                                `}
                            </td>
                            <td>${product.author || 'N/A'}</td>
                            <td>
                                <span class="category-badge">
                                    ${product['product-category'] || product.category || 'N/A'}
                                </span>
                            </td>
                            <td class="quantity-cell">
                                ${product.available_quantity || 0}
                            </td>
                            <td class="price-cell">
                                ${product.price ? product.price.toFixed(2) : 'N/A'}
                            </td>
                            <td class="currency-cell">
                                ${product.currency_id || 'N/A'}
                            </td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    `;
}
