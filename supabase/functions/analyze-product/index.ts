/**
 * Supabase Edge Function: analyze-product
 * 
 * Analyzes a product URL by:
 * 1. Scraping metadata (title, image)
 * 2. Using Gemini with Google Search grounding to research reviews
 * 3. Extracting review summary and source citations
 * 4. Storing results in the products table
 */

import { GoogleGenerativeAI } from "google-genai";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { load } from "cheerio";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  url: string;
}

interface ReviewLink {
  title: string;
  url: string;
}

interface ProductData {
  id?: string;
  original_url: string;
  product_name: string;
  clean_name: string | null;
  image_url: string | null;
  review_summary: string | null;
  review_links: ReviewLink[];
  last_scraped: string;
}

/**
 * Validates URL format and prevents SSRF attacks
 */
function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Block internal/private IPs
    const hostname = urlObj.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("172.17.") ||
      hostname.startsWith("172.18.") ||
      hostname.startsWith("172.19.") ||
      hostname.startsWith("172.20.") ||
      hostname.startsWith("172.21.") ||
      hostname.startsWith("172.22.") ||
      hostname.startsWith("172.23.") ||
      hostname.startsWith("172.24.") ||
      hostname.startsWith("172.25.") ||
      hostname.startsWith("172.26.") ||
      hostname.startsWith("172.27.") ||
      hostname.startsWith("172.28.") ||
      hostname.startsWith("172.29.") ||
      hostname.startsWith("172.30.") ||
      hostname.startsWith("172.31.")
    ) {
      return false;
    }
    // Only allow http/https
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Scrapes metadata from a product URL
 */
async function scrapeMetadata(url: string): Promise<{
  title: string;
  image: string | null;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Try og:title first, fallback to <title>
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      url;

    // Try og:image first, fallback to first large image
    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    // Clean up image URL (handle relative URLs)
    if (image && !image.startsWith("http")) {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).href;
    }

    return { title: title.trim(), image };
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error(`Could not access product page: ${error.message}`);
  }
}

/**
 * Extracts clean product name using Gemini
 */
async function extractCleanName(
  genAI: GoogleGenerativeAI,
  productName: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Extract just the brand and model name from this product title. Return ONLY the brand and model, nothing else. No extra text, no explanations.

Product title: ${productName}

Example outputs:
- "iPhone 15 Pro"
- "Sony WH-1000XM5"
- "Nike Air Max 90"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Clean name extraction error:", error);
    return productName; // Fallback to original
  }
}

/**
 * Researches product reviews using Gemini with Google Search grounding
 */
async function researchProduct(
  genAI: GoogleGenerativeAI,
  productName: string,
  originalUrl: string
): Promise<{
  summary: string;
  citations: ReviewLink[];
}> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ googleSearch: {} }],
    });

    const prompt = `You are a product researcher. I found this product: ${productName}.

Tasks:
1. Identify the exact brand and model name
2. Search for honest reviews on Reddit, YouTube, and independent review sites
3. Summarize the general sentiment in 2 sentences (mention key pros/cons)
4. Be critical and balanced - include both positive and negative feedback

Return ONLY the summary text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    // Extract citations from grounding metadata
    const citations: ReviewLink[] = [];
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri && chunk.web?.title) {
          // Filter out the original product URL
          if (chunk.web.uri !== originalUrl) {
            citations.push({
              title: chunk.web.title,
              url: chunk.web.uri,
            });
          }
        }
      }
    }

    return { summary, citations };
  } catch (error) {
    console.error("Gemini research error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    throw new Error(`Failed to research product: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get environment variables
    // Supabase automatically provides SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    // Debug logging
    console.log("Edge Function called");
    console.log("GOOGLE_API_KEY exists:", !!googleApiKey);
    console.log("SUPABASE_URL exists:", !!supabaseUrl);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!supabaseServiceKey);
    console.log("SUPABASE_ANON_KEY exists:", !!supabaseAnonKey);
    console.log("Authorization header:", req.headers.get("Authorization") ? "Present" : "Missing");

    if (!googleApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing GOOGLE_API_KEY environment variable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL environment variable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_SERVICE_ROLE_KEY environment variable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_ANON_KEY environment variable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "Please provide a valid product URL" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate URL
    if (!validateUrl(url)) {
      return new Response(
        JSON.stringify({ error: "Invalid or unsafe URL provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize clients
    // Use anon key client for auth verification, service role for DB operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const genAI = new GoogleGenerativeAI(googleApiKey);

    // Get user from JWT token
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
        error: authError,
      } = await supabaseAnon.auth.getUser(token);

      if (authError) {
        console.error("Auth error:", authError.message);
        return new Response(
          JSON.stringify({ error: `Invalid authentication token: ${authError.message}` }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      userId = user?.id || null;
    }

    if (!userId) {
      console.error("Authentication failed - no user ID");
      return new Response(
        JSON.stringify({ error: "Authentication required. Please ensure you are logged in." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check cache (products from last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: cachedProduct, error: cacheError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("original_url", url)
      .eq("user_id", userId)
      .gte("last_scraped", sevenDaysAgo.toISOString())
      .single();

    if (cachedProduct && !cacheError) {
      return new Response(JSON.stringify(cachedProduct), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scrape metadata
    const { title: productName, image: imageUrl } = await scrapeMetadata(url);

    // Research with Gemini
    const { summary: reviewSummary, citations: reviewLinks } =
      await researchProduct(genAI, productName, url);

    // Extract clean name
    const cleanName = await extractCleanName(genAI, productName);

    // Prepare product data
    const productData: ProductData = {
      original_url: url,
      product_name: productName,
      clean_name: cleanName,
      image_url: imageUrl,
      review_summary: reviewSummary,
      review_links: reviewLinks,
      last_scraped: new Date().toISOString(),
    };

    // Upsert into database
    const { data: savedProduct, error: dbError } = await supabaseAdmin
      .from("products")
      .upsert(
        {
          ...productData,
          user_id: userId,
        },
        {
          onConflict: "original_url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save product data" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(savedProduct), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

