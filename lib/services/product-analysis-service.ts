/**
 * Service for analyzing product URLs using Supabase Edge Functions
 * Calls the analyze-product Edge Function which uses Gemini with Google Search grounding
 */
import type { Product, ProductRow } from '@/lib/database/types';
import { rowToProduct } from '@/lib/database/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Analyze a product URL using Gemini with Google Search grounding
 *
 * @param url - The product URL to analyze
 * @returns Product data with AI-generated review summary and citations
 */
export async function analyzeProductUrl(
  url: string
): Promise<{ data: Product | null; error: Error | null }> {
  try {
    // Validate URL format
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    if (!urlPattern.test(url)) {
      return {
        data: null,
        error: new Error('Please provide a valid product URL'),
      };
    }

    // Verify authentication. getUser() contacts the server and refreshes the
    // session token if it has expired, unlike getSession() which only reads
    // from local storage and can return a stale/expired token.
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      return {
        data: null,
        error: new Error('User not authenticated'),
      };
    }

    // Use supabase.functions.invoke() so the SDK automatically attaches a
    // fresh Authorization header — this avoids the 401 caused by manually
    // passing a potentially-expired token from getSession().
    const { data: responseData, error: invokeError } = await supabase.functions.invoke(
      'analyze-product',
      { body: { url } }
    );

    if (invokeError) {
      return {
        data: null,
        error: new Error(invokeError.message || 'Edge Function call failed'),
      };
    }

    if (responseData?.error) {
      return {
        data: null,
        error: new Error(responseData.error),
      };
    }

    const productRow = responseData as ProductRow;
    const product = rowToProduct(productRow);
    return { data: product, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error
        ? error
        : new Error('Failed to analyze product URL'),
    };
  }
}

/**
 * Get a product by URL from the database (cached result)
 * 
 * @param url - The product URL
 * @returns Cached product data if available
 */
export async function getProductByUrl(
  url: string
): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        data: null,
        error: new Error('User not authenticated'),
      };
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('original_url', url)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return { data: null, error: null };
      }
      return {
        data: null,
        error: new Error(error.message),
      };
    }

    const product = rowToProduct(data as ProductRow);
    return { data: product, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error 
        ? error 
        : new Error('Failed to fetch product'),
    };
  }
}

