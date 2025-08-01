import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Product, CreateProductData } from '../types';

// Lazy initialization of Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

// Create authenticated client with user's JWT
function getAuthenticatedClient(accessToken: string): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration.');
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

// Helper function to sanitize search terms and prevent SQL injection
function sanitizeSearchTerm(term: string): string | null {
  // Remove any potentially dangerous characters and patterns
  const cleaned = term
    .replace(/[;'"\\]/g, '') // Remove semicolons, quotes, backslashes
    .replace(/--/g, '') // Remove SQL comment patterns
    .replace(/\/\*/g, '') // Remove SQL comment start
    .replace(/\*\//g, '') // Remove SQL comment end
    .trim();

  // Reject if term contains SQL keywords (case insensitive)
  const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b/i;
  if (sqlKeywords.test(cleaned)) {
    return null;
  }

  return cleaned.length > 0 ? cleaned : null;
}

export const supabaseService = {
  // Auth methods
  async verifyToken(accessToken: string): Promise<{ user: User | null; error: any }> {
    try {
      const client = getAuthenticatedClient(accessToken);
      const { data: { user }, error } = await client.auth.getUser();
      return { user, error };
    } catch (error) {
      console.error('Error verifying token:', error);
      return { user: null, error };
    }
  },

  async getProducts(searchTerm?: string, accessToken?: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      const client = accessToken ? getAuthenticatedClient(accessToken) : getSupabaseClient();
      let query = client
        .from('products')
        .select('*')
        .limit(100) // Prevent large result sets
        .order('created_at', { ascending: false });

      // If search parameter is provided, filter by title or author
      if (searchTerm) {
        const sanitizedTerm = sanitizeSearchTerm(searchTerm);
        if (sanitizedTerm) {
          // Use Supabase's text search which is safe from SQL injection
          query = query.or(`title.ilike.%${sanitizedTerm}%,author.ilike.%${sanitizedTerm}%`);
        }
      }

      const result = await query;
      
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }
  },

  async createProduct(productData: CreateProductData, accessToken: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      const client = getAuthenticatedClient(accessToken);
      const result = await client
        .from('products')
        .insert([productData])
        .select();

      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Error creating product:', error);
      return { data: null, error };
    }
  },

  async getProductById(id: number, accessToken?: string): Promise<{ data: Product | null; error: any }> {
    try {
      const client = accessToken ? getAuthenticatedClient(accessToken) : getSupabaseClient();
      const result = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return { data: null, error };
    }
  },

  async updateProduct(id: number, productData: Partial<CreateProductData>, accessToken: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      const client = getAuthenticatedClient(accessToken);
      const result = await client
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();

      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Error updating product:', error);
      return { data: null, error };
    }
  },

  async deleteProduct(id: number, accessToken: string): Promise<{ error: any }> {
    try {
      const client = getAuthenticatedClient(accessToken);
      const result = await client
        .from('products')
        .delete()
        .eq('id', id);

      return { error: result.error };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { error };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('products')
        .select('count', { count: 'exact', head: true });

      return !error;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export default supabaseService;
