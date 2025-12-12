/**
 * Maps Google search/product data to normalized FeedItem structure
 * Handles Google Shopping, Google Trends, and general search results
 */
import { CommerceData, ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface GoogleRawData {
  productId?: string;
  searchQuery?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  productUrl?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  merchantName?: string;
  trendScore?: number;
  searchVolume?: number;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Calculates engagement score for Google results
 * Based on rating, review count, trend score, or search volume
 */
function calculateEngagementScore(
  rating?: number,
  reviewCount?: number,
  trendScore?: number,
  searchVolume?: number
): number {
  // For products with ratings
  if (rating && reviewCount) {
    const ratingScore = (rating / 5) * 100;
    const reviewScore = Math.log10(reviewCount + 1) * 10;
    return Math.round(ratingScore + reviewScore);
  }
  
  // For search trends
  if (trendScore) {
    return Math.round(trendScore);
  }
  
  // For search volume
  if (searchVolume) {
    return Math.round(Math.log10(searchVolume + 1) * 20);
  }
  
  return 0;
}

/**
 * Maps Google search/product data to FeedItem
 */
export function mapGoogleToFeedItem(
  rawData: GoogleRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const productId = rawData.productId || rawData.externalId || rawData.searchQuery || '';
  const title = rawData.title || rawData.searchQuery || 'Google Result';
  const description = rawData.description || '';
  const imageUrl = rawData.imageUrl || rawData.mainImageUrl || '';
  const thumbnailUrl = rawData.thumbnailUrl || imageUrl;
  const productUrl = rawData.productUrl || rawData.actionUrl || '';
  const price = rawData.price || rawData.currentPrice;
  const originalPrice = rawData.originalPrice;
  const currency = rawData.currency || 'USD';
  const rating = rawData.rating || rawData.ratingScore;
  const reviewCount = rawData.reviewCount || 0;
  const merchantName = rawData.merchantName || 'Google';
  const trendScore = rawData.trendScore;
  const searchVolume = rawData.searchVolume;
  const tags = rawData.tags || [];

  // Determine content type based on available data
  let contentType = ContentType.SearchTrend;
  if (price !== undefined) {
    contentType = ContentType.PhysicalProduct;
  }

  // Create commerce data if price is available
  let commerce: CommerceData | null = null;
  if (price !== undefined) {
    commerce = {
      currency,
      currentPrice: price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      isOnSale: originalPrice ? originalPrice > price : false,
      merchantName,
    };
  }

  const engagementScore = calculateEngagementScore(rating, reviewCount, trendScore, searchVolume);

  return {
    id,
    externalId: productId,
    sourcePlatform: SourcePlatform.Google,
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: imageUrl,
      thumbnailUrl,
      actionUrl: productUrl,
      contentType,
    },
    commerce,
    metrics: {
      ratingScore: rating,
      reviewCount,
      engagementScore,
    },
    tags,
    rawPayload: rawData,
  };
}
