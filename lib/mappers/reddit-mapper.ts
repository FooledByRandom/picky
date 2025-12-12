/**
 * Maps Reddit post data to normalized FeedItem structure
 * Handles Reddit-specific fields like post ID, upvotes, comments
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface RedditRawData {
  postId?: string;
  postUrl?: string;
  title?: string;
  selftext?: string;
  description?: string;
  thumbnailUrl?: string;
  upvotes?: number;
  downvotes?: number;
  commentCount?: number;
  score?: number;
  productName?: string;
  productUrl?: string;
  subreddit?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Calculates engagement score for Reddit posts
 * Based on upvotes, downvotes, and comments
 */
function calculateEngagementScore(
  upvotes: number = 0,
  downvotes: number = 0,
  commentCount: number = 0
): number {
  const score = upvotes - downvotes;
  // Reddit engagement: score is primary, comments are valuable
  const scoreValue = Math.log10(Math.abs(score) + 1) * 20;
  const commentValue = commentCount * 2;
  
  return Math.round(scoreValue + commentValue);
}

/**
 * Maps Reddit post data to FeedItem
 */
export function mapRedditToFeedItem(
  rawData: RedditRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const postId = rawData.postId || rawData.externalId || '';
  const postUrl = rawData.postUrl || rawData.actionUrl || `https://reddit.com${postId}`;
  const title = rawData.title || rawData.productName || 'Reddit Post';
  const description = rawData.description || rawData.selftext || '';
  const thumbnailUrl = rawData.thumbnailUrl || '';
  const upvotes = rawData.upvotes || 0;
  const downvotes = rawData.downvotes || 0;
  const score = rawData.score ?? (upvotes - downvotes);
  const commentCount = rawData.commentCount || 0;
  const productUrl = rawData.productUrl;
  const subreddit = rawData.subreddit;
  const tags = rawData.tags || [];
  
  // Add subreddit as a tag if present
  const allTags = subreddit ? [...tags, subreddit] : tags;

  const engagementScore = calculateEngagementScore(upvotes, downvotes, commentCount);

  return {
    id,
    externalId: postId,
    sourcePlatform: SourcePlatform.Google, // Reddit might be categorized under Google search results
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: thumbnailUrl,
      thumbnailUrl,
      actionUrl: productUrl || postUrl,
      contentType: ContentType.SearchTrend,
    },
    commerce: null, // Reddit posts typically don't have direct commerce data
    metrics: {
      reviewCount: commentCount,
      engagementScore,
    },
    tags: allTags,
    rawPayload: rawData,
  };
}
