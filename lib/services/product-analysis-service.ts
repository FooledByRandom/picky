/**
 * Service for analyzing product URLs using Supabase Edge Functions
 * Calls the analyze-product Edge Function which uses Gemini with Google Search grounding
 */
import type { Product, ProductRow } from '@/lib/database/types';
import { rowToProduct } from '@/lib/database/types';
import { supabase } from '@/lib/supabase/client';
import Constants from 'expo-constants';

/**
 * Response from the analyze-product Edge Function
 */
interface AnalyzeProductResponse {
  id: string;
  original_url: string;
  product_name: string;
  clean_name: string | null;
  image_url: string | null;
  review_summary: string | null;
  review_links: Array<{ title: string; url: string }>;
  last_scraped: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

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

    // Check authentication and get session
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:46',message:'Calling getSession',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:49',message:'getSession result',data:{sessionExists:!!session,sessionError:sessionError?.message,hasAccessToken:!!session?.access_token,tokenLength:session?.access_token?.length,tokenPreview:session?.access_token?.substring(0,20)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (!session || sessionError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:54',message:'Session check failed',data:{sessionExists:!!session,sessionError:sessionError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return {
        data: null,
        error: new Error('User not authenticated'),
      };
    }

    // Debug: Log session info
    console.log('=== Product Analysis Debug ===');
    console.log('Session exists:', !!session);
    console.log('Session access_token exists:', !!session?.access_token);
    if (session?.access_token) {
      console.log('Token preview:', session.access_token.substring(0, 20) + '...');
      console.log('Token length:', session.access_token.length);
    }

    // Call the Edge Function with explicit authorization header
    // Use direct fetch to have better control over error handling
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '';
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '';
    const functionUrl = `${supabaseUrl}/functions/v1/analyze-product`;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:66',message:'Preparing fetch request',data:{functionUrl,hasToken:!!session?.access_token,tokenLength:session?.access_token?.length,hasAnonKey:!!supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    console.log('Function URL:', functionUrl);
    console.log('Request URL:', url);
    
    const authHeader = `Bearer ${session.access_token}`;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:75',message:'Auth header constructed',data:{headerLength:authHeader.length,headerPreview:authHeader.substring(0,30),tokenStart:session.access_token.substring(0,10)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:78',message:'Sending fetch request',data:{method:'POST',url:functionUrl,hasAuthHeader:true,hasApikey:!!supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ url }),
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ca0f0e07-5835-40db-9946-44cf7fd39c55',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'product-analysis-service.ts:92',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Get response text first to see what we're actually getting
      const responseText = await response.text();
      console.log('Response text (raw):', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Response data (parsed):', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        console.error('Response text was:', responseText);
        responseData = { error: responseText || `Edge Function returned status ${response.status}` };
      }

      if (!response.ok) {
        // Handle error response
        const errorMessage = responseData?.error || responseData?.message || `Edge Function returned status ${response.status}`;
        console.error('❌ Edge Function error response:', errorMessage);
        console.error('Full response data:', JSON.stringify(responseData, null, 2));
        console.error('Response status code:', response.status);
        return {
          data: null,
          error: new Error(errorMessage),
        };
      }
      
      console.log('✅ Success! Product data received');

      // Success - convert to Product type
      const productRow = responseData as ProductRow;
      const product = rowToProduct(productRow);
      return { data: product, error: null };
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return {
        data: null,
        error: fetchError instanceof Error 
          ? fetchError 
          : new Error('Failed to call Edge Function'),
      };
    }
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

