/**
 * Core type definitions for review aggregation system
 * Defines the normalized structure for feed items from multiple platforms
 */

// 1. Enums help prevent typos in your logic later (e.g., ensuring you don't type "tik_tok" instead of "tiktok")
export enum SourcePlatform {
  Amazon = 'amazon',
  Google = 'google',
  TikTok = 'tiktok',
  YouTube = 'youtube',
}

export enum ContentType {
  PhysicalProduct = 'physical_product', // Buyable items
  VideoReview = 'video_review',         // Content to watch
  SearchTrend = 'search_trend',         // Just a keyword trending up
}

// 2. Sub-interfaces for organization
export interface FeedItemDisplay {
  title: string;
  description: string;
  mainImageUrl: string;
  thumbnailUrl?: string; // Optional: Some sources might not have a separate thumbnail
  actionUrl: string;     // Deep link to the source (Amazon page, TikTok video)
  contentType: ContentType;
}

export interface CommerceData {
  currency: string;      // 'USD', 'EUR', etc.
  currentPrice: number;
  originalPrice?: number; // Optional: Useful for showing strike-through pricing
  isOnSale: boolean;
  merchantName: string;   // 'Amazon', 'Walmart', etc.
}

export interface SocialMetrics {
  ratingScore?: number;   // Normalized 0-5 stars
  reviewCount?: number;   // Count of reviews or comments
  viewCount?: number;     // Count of video views
  engagementScore: number; // Your calculated "Hotness" score
}

// 3. The Main Interface
export interface FeedItem {
  id: string;             // Your internal database ID
  externalId: string;     // The ID from the source (ASIN, Video ID)
  sourcePlatform: SourcePlatform;
  detectedAt: Date;       // When your scraper found this trend
  
  // Grouped Data
  display: FeedItemDisplay;
  
  // Commerce is nullable ( | null ) because a TikTok video might not have a price yet
  commerce: CommerceData | null; 
  
  metrics: SocialMetrics;
  
  tags: string[];
  
  // Unknown type for raw payload allows flexibility for debugging later
  rawPayload?: Record<string, unknown>; 
}
