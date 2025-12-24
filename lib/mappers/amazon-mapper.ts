/**
 * Maps Amazon product data to normalized FeedItem structure
 * Handles both Rainforest API format and generic Amazon data formats
 */
import { CommerceData, ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface AmazonRawData {
  // Common fields
  asin?: string;
  title?: string;
  rating?: number;
  merchantName?: string;
  tags?: string[];
  
  // Rainforest API specific fields
  price?: {
    value?: number;
    currency?: string;
    raw?: string;
  } | number; // Can be object (Rainforest) or number (generic)
  ratings_total?: number; // Rainforest field name
  feature_bullets?: string[]; // Rainforest feature bullets
  image?: string; // Rainforest image field
  link?: string; // Rainforest product URL
  is_prime?: boolean; // Rainforest prime indicator
  
  // Generic format fields (for backward compatibility)
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  productUrl?: string;
  originalPrice?: number;
  currency?: string;
  reviewCount?: number;
  
  [key: string]: unknown;
}

/**
 * Calculates engagement score for Amazon products
 * Based on rating and review count
 */
function calculateEngagementScore(rating?: number, reviewCount?: number): number {
  if (!rating || !reviewCount) return 0;
  
  // Normalize rating (0-5) to 0-100 scale, then multiply by log of review count
  const ratingScore = (rating / 5) * 100;
  const reviewScore = Math.log10(reviewCount + 1) * 10;
  
  return Math.round(ratingScore + reviewScore);
}

/**
 * Detects if the data is in Rainforest API format
 */
function isRainforestFormat(data: AmazonRawData): boolean {
  return (
    (typeof data.price === 'object' && data.price !== null && 'value' in data.price) ||
    typeof data.ratings_total === 'number' ||
    Array.isArray(data.feature_bullets)
  );
}

/**
 * Truncates title to 80 characters with ellipsis
 */
function truncateTitle(title: string): string {
  if (title.length <= 80) return title;
  return title.substring(0, 80) + '...';
}

/**
 * Maps Amazon product data to FeedItem
 * Supports both Rainforest API format and generic Amazon data format
 */
export function mapAmazonToFeedItem(
  rawData: AmazonRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const isRainforest = isRainforestFormat(rawData);
  const asin = rawData.asin || rawData.externalId || '';
  
  // Title handling with truncation
  const rawTitle = rawData.title || 'Unknown Product';
  const title = truncateTitle(rawTitle);
  
  // Description handling: Rainforest uses feature_bullets, generic uses description
  const description = isRainforest
    ? rawData.feature_bullets?.[0] || ''
    : rawData.description || '';
  
  // Image handling: Rainforest uses 'image', generic uses 'imageUrl'
  const imageUrl = isRainforest
    ? rawData.image || ''
    : rawData.imageUrl || rawData.mainImageUrl || '';
  const thumbnailUrl = rawData.thumbnailUrl || imageUrl;
  
  // URL handling: Rainforest uses 'link', generic uses 'productUrl'
  const productUrl = isRainforest
    ? rawData.link || `https://amazon.com/dp/${asin}`
    : rawData.productUrl || rawData.actionUrl || `https://amazon.com/dp/${asin}`;
  
  // Price handling: Rainforest has price object, generic has price number
  let currentPrice = 0;
  let currency = 'USD';
  let originalPrice: number | undefined;
  
  if (isRainforest && typeof rawData.price === 'object' && rawData.price !== null) {
    currentPrice = rawData.price.value || 0;
    currency = rawData.price.currency || 'USD';
    // Parse price.raw for original price if available
    if (rawData.price.raw) {
      const parsed = parseFloat(rawData.price.raw);
      if (!isNaN(parsed)) {
        originalPrice = parsed;
      }
    }
  } else {
    // Generic format
    currentPrice = typeof rawData.price === 'number' ? rawData.price : rawData.currentPrice || 0;
    currency = rawData.currency || 'USD';
    originalPrice = rawData.originalPrice;
  }
  
  // Review count: Rainforest uses 'ratings_total', generic uses 'reviewCount'
  const reviewCount = isRainforest
    ? rawData.ratings_total || 0
    : rawData.reviewCount || 0;
  
  const rating = rawData.rating || rawData.ratingScore;
  const merchantName = rawData.merchantName || 'Amazon';
  const tags = rawData.tags || [];
  
  // Determine if on sale: Rainforest uses is_prime, generic compares prices
  const isOnSale = isRainforest
    ? !!rawData.is_prime
    : originalPrice ? originalPrice > currentPrice : false;

  const commerce: CommerceData = {
    currency,
    currentPrice,
    originalPrice: originalPrice && originalPrice > currentPrice ? originalPrice : undefined,
    isOnSale,
    merchantName,
  };

  const engagementScore = calculateEngagementScore(rating, reviewCount);

  return {
    id,
    externalId: asin,
    sourcePlatform: SourcePlatform.Amazon,
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: imageUrl,
      thumbnailUrl,
      actionUrl: productUrl,
      contentType: ContentType.PhysicalProduct,
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

