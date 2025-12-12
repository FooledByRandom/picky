/**
 * Main normalization service that routes incoming data to appropriate mappers
 * and validates the output before returning
 */
import { AmazonRawData, mapAmazonToFeedItem } from '@/lib/mappers/amazon-mapper';
import { GoogleRawData, mapGoogleToFeedItem } from '@/lib/mappers/google-mapper';
import { mapRedditToFeedItem, RedditRawData } from '@/lib/mappers/reddit-mapper';
import { mapTikTokToFeedItem, TikTokRawData } from '@/lib/mappers/tiktok-mapper';
import { mapTwitterToFeedItem, TwitterRawData } from '@/lib/mappers/twitter-mapper';
import { mapYouTubeToFeedItem, YouTubeRawData } from '@/lib/mappers/youtube-mapper';
import { validateFeedItem } from '@/lib/validation/feed-item-schema';
import { FeedItem, SourcePlatform } from '@/types/reviewTypes';
import { randomUUID } from 'uuid';

export type PlatformRawData = 
  | AmazonRawData 
  | TikTokRawData 
  | YouTubeRawData 
  | RedditRawData 
  | TwitterRawData 
  | GoogleRawData;

export interface NormalizeOptions {
  id?: string;
  detectedAt?: Date;
  sourcePlatform?: SourcePlatform;
}

/**
 * Detects the source platform from raw data
 * Checks for platform-specific identifiers
 */
function detectSourcePlatform(data: PlatformRawData, explicitPlatform?: SourcePlatform): SourcePlatform {
  if (explicitPlatform) {
    return explicitPlatform;
  }

  // Check for platform-specific identifiers
  if ('asin' in data || data.sourcePlatform === 'amazon') {
    return SourcePlatform.Amazon;
  }
  
  if ('videoId' in data && 'tiktok' in (data.videoUrl || '').toLowerCase()) {
    return SourcePlatform.TikTok;
  }
  
  if ('videoId' in data && ('youtube' in (data.videoUrl || '').toLowerCase() || 'youtu.be' in (data.videoUrl || '').toLowerCase())) {
    return SourcePlatform.YouTube;
  }
  
  if ('postId' in data || 'subreddit' in data || 'reddit' in (data.postUrl || '').toLowerCase()) {
    return SourcePlatform.Google; // Reddit categorized under Google
  }
  
  if ('tweetId' in data || 'twitter' in (data.tweetUrl || '').toLowerCase()) {
    return SourcePlatform.Google; // Twitter categorized under Google
  }
  
  // Default to Google for search results and unknown sources
  return SourcePlatform.Google;
}

/**
 * Normalizes incoming data from any platform to FeedItem structure
 * @param rawData - Platform-specific raw data
 * @param options - Optional normalization options (id, detectedAt, sourcePlatform)
 * @returns Normalized FeedItem
 * @throws Error if validation fails
 */
export function normalizeFeedItem(
  rawData: PlatformRawData,
  options: NormalizeOptions = {}
): FeedItem {
  const id = options.id || randomUUID();
  const detectedAt = options.detectedAt || new Date();
  const sourcePlatform = detectSourcePlatform(rawData, options.sourcePlatform);

  let normalizedItem: FeedItem;

  // Route to appropriate mapper based on detected platform
  switch (sourcePlatform) {
    case SourcePlatform.Amazon:
      normalizedItem = mapAmazonToFeedItem(rawData as AmazonRawData, id, detectedAt);
      break;
    
    case SourcePlatform.TikTok:
      normalizedItem = mapTikTokToFeedItem(rawData as TikTokRawData, id, detectedAt);
      break;
    
    case SourcePlatform.YouTube:
      normalizedItem = mapYouTubeToFeedItem(rawData as YouTubeRawData, id, detectedAt);
      break;
    
    case SourcePlatform.Google:
      // Check if it's Reddit or Twitter data
      if ('postId' in rawData || 'subreddit' in rawData) {
        normalizedItem = mapRedditToFeedItem(rawData as RedditRawData, id, detectedAt);
      } else if ('tweetId' in rawData) {
        normalizedItem = mapTwitterToFeedItem(rawData as TwitterRawData, id, detectedAt);
      } else {
        normalizedItem = mapGoogleToFeedItem(rawData as GoogleRawData, id, detectedAt);
      }
      break;
    
    default:
      // Fallback to Google mapper for unknown sources
      normalizedItem = mapGoogleToFeedItem(rawData as GoogleRawData, id, detectedAt);
  }

  // Validate the normalized item
  try {
    validateFeedItem(normalizedItem);
  } catch (error) {
    throw new Error(`Validation failed for normalized FeedItem: ${error instanceof Error ? error.message : String(error)}`);
  }

  return normalizedItem;
}

/**
 * Normalizes multiple items in batch
 * @param rawDataArray - Array of platform-specific raw data
 * @param options - Optional normalization options
 * @returns Array of normalized FeedItems
 */
export function normalizeFeedItems(
  rawDataArray: PlatformRawData[],
  options: NormalizeOptions = {}
): FeedItem[] {
  return rawDataArray.map((rawData) => normalizeFeedItem(rawData, options));
}
