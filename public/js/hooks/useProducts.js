// Products state management hook
import { useState, useEffect } from 'https://esm.sh/preact@10.23.1/hooks';
import { useAPI } from './useAPI.js';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { apiCall } = useAPI();

    const fetchProducts = async (searchTerm = '') => {
        setLoading(true);
        setError('');

        try {
            const url = searchTerm ? 
                `/api/products?search=${encodeURIComponent(searchTerm)}` : 
                '/api/products';

            const { response, data } = await apiCall(url);

            if (response.ok) {
                setProducts(data.data || []);
                return data.data || [];
            } else {
                setError(data.error || 'Failed to fetch products');
                return [];
            }
        } catch (err) {
            setError(`Network error: ${err.message}`);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData) => {
        setLoading(true);
        setError('');

        try {
            const { response, data } = await apiCall('/api/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                // Add the new product to the current list
                setProducts(prevProducts => [...prevProducts, data.data]);
                return { success: true, data: data.data };
            } else {
                setError(data.error || 'Failed to add product');
                return { success: false, error: data.error || 'Failed to add product' };
            }
        } catch (err) {
            const errorMessage = `Network error: ${err.message}`;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const refreshProducts = async (searchTerm = '') => {
        return await fetchProducts(searchTerm);
    };

    // Load products on initial mount
    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        refreshProducts,
        setError
    };
}
