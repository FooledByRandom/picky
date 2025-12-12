/**
 * Maps Twitter/X post data to normalized FeedItem structure
 * Handles Twitter-specific fields like tweet ID, likes, retweets, replies
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface TwitterRawData {
  tweetId?: string;
  tweetUrl?: string;
  text?: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  likeCount?: number;
  retweetCount?: number;
  replyCount?: number;
  quoteCount?: number;
  productName?: string;
  productUrl?: string;
  hashtags?: string[];
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Calculates engagement score for Twitter posts
 * Based on likes, retweets, replies, and quotes
 */
function calculateEngagementScore(
  likeCount: number = 0,
  retweetCount: number = 0,
  replyCount: number = 0,
  quoteCount: number = 0
): number {
  // Twitter engagement: retweets and quotes are most valuable
  const likeValue = likeCount * 0.1;
  const retweetValue = retweetCount * 2;
  const replyValue = replyCount * 0.5;
  const quoteValue = quoteCount * 3;
  
  return Math.round(likeValue + retweetValue + replyValue + quoteValue);
}

/**
 * Maps Twitter/X post data to FeedItem
 */
export function mapTwitterToFeedItem(
  rawData: TwitterRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const tweetId = rawData.tweetId || rawData.externalId || '';
  const tweetUrl = rawData.tweetUrl || rawData.actionUrl || `https://twitter.com/i/web/status/${tweetId}`;
  const text = rawData.text || rawData.description || '';
  const title = rawData.productName || 'Twitter Post';
  const description = text;
  const mediaUrl = rawData.mediaUrl || '';
  const thumbnailUrl = rawData.thumbnailUrl || mediaUrl;
  const likeCount = rawData.likeCount || 0;
  const retweetCount = rawData.retweetCount || 0;
  const replyCount = rawData.replyCount || 0;
  const quoteCount = rawData.quoteCount || 0;
  const productUrl = rawData.productUrl;
  const hashtags = rawData.hashtags || [];
  const tags = rawData.tags || [];
  const allTags = [...tags, ...hashtags];

  const engagementScore = calculateEngagementScore(likeCount, retweetCount, replyCount, quoteCount);

  return {
    id,
    externalId: tweetId,
    sourcePlatform: SourcePlatform.Google, // Twitter might be categorized under Google search results
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: thumbnailUrl,
      thumbnailUrl,
      actionUrl: productUrl || tweetUrl,
      contentType: ContentType.SearchTrend,
    },
    commerce: null, // Twitter posts typically don't have direct commerce data
    metrics: {
      reviewCount: replyCount, // Using reply count as review count
      engagementScore,
    },
    tags: allTags,
    rawPayload: rawData,
  };
}
