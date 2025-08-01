export interface Product {
  id?: number;
  category_id: string;
  'product-category': string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  'product-code-or-isbn': string;
  price: number;
  base_price: number;
  currency_id: string;
  available_quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {}

export interface ProductSearchQuery {
  search?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ProductsResponse extends ApiResponse<Product[]> {
  products: Product[];
}

export interface ProductResponse extends ApiResponse<Product> {
  product: Product;
}
