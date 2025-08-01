// Product form component
import { h } from 'https://esm.sh/preact@10.23.1';
import { useState } from 'https://esm.sh/preact@10.23.1/hooks';
import htm from 'https://esm.sh/htm';
import { useAuth } from '../hooks/useAuth.js';

// Initialize htm with Preact
const html = htm.bind(h);

export function ProductForm({ productsState }) {
    const { user } = useAuth();
    const { addProduct, loading } = productsState;
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const userRole = user?.user_metadata?.role || user?.app_metadata?.role || 'user';
    const isAdmin = userRole === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const formData = new FormData(e.target);
        const productData = {
            category_id: formData.get('categoryId'),
            'product-category': formData.get('productCategory'),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            author: formData.get('author'),
            description: formData.get('description'),
            'product-code-or-isbn': formData.get('productCode'),
            price: parseFloat(formData.get('price')),
            base_price: parseFloat(formData.get('basePrice')) || parseFloat(formData.get('price')),
            currency_id: formData.get('currencyId'),
            available_quantity: parseInt(formData.get('availableQuantity')) || 1
        };

        const result = await addProduct(productData);
        
        if (result.success) {
            setMessage('Product added successfully! The list below has been updated.');
            e.target.reset();
        } else {
            setError(result.error);
        }
    };

    if (!isAdmin) {
        return html`
            <div class="card">
                <h2>➕ Add New Product</h2>
                <div class="error">
                    Admin access required to add products. Contact an administrator to get admin privileges.
                </div>
            </div>
        `;
    }

    return html`
        <div class="card">
            <h2>➕ Add New Product</h2>
            <form onSubmit=${handleSubmit}>
                <div class="two-column">
                    <div class="form-group">
                        <label>Category ID:</label>
                        <input name="categoryId" defaultValue="MLA412445" required />
                    </div>
                    <div class="form-group">
                        <label>Product Category:</label>
                        <input name="productCategory" defaultValue="book" required />
                    </div>
                    <div class="form-group">
                        <label>Title:</label>
                        <input name="title" required />
                    </div>
                    <div class="form-group">
                        <label>Subtitle:</label>
                        <input name="subtitle" />
                    </div>
                    <div class="form-group">
                        <label>Author:</label>
                        <input name="author" required />
                    </div>
                    <div class="form-group">
                        <label>Product Code/ISBN:</label>
                        <input name="productCode" />
                    </div>
                    <div class="form-group">
                        <label>Price:</label>
                        <input name="price" type="number" step="0.01" required />
                    </div>
                    <div class="form-group">
                        <label>Base Price:</label>
                        <input name="basePrice" type="number" step="0.01" />
                    </div>
                    <div class="form-group">
                        <label>Currency:</label>
                        <input name="currencyId" defaultValue="ARS" required />
                    </div>
                    <div class="form-group">
                        <label>Available Quantity:</label>
                        <input name="availableQuantity" type="number" defaultValue="1" />
                    </div>
                </div>
                <div class="form-group">
                    <label>Description:</label>
                    <textarea name="description" rows="4"></textarea>
                </div>
                <button type="submit" disabled=${loading}>
                    ${loading ? 'Adding Product...' : 'Add Product'}
                </button>
                ${message && html`<div class="success">${message}</div>`}
                ${error && html`<div class="error">${error}</div>`}
            </form>
        </div>
    `;
}
