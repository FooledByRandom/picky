/**
 * Maps YouTube video data to normalized FeedItem structure
 * Handles YouTube-specific fields like video ID, views, comments
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface YouTubeRawData {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  productName?: string;
  productUrl?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Calculates engagement score for YouTube videos
 * Based on views, likes, and comments
 */
function calculateEngagementScore(
  viewCount: number = 0,
  likeCount: number = 0,
  commentCount: number = 0
): number {
  // YouTube engagement: views are primary, but interactions matter more
  const viewScore = Math.log10(viewCount + 1) * 10;
  const likeScore = likeCount * 0.2;
  const commentScore = commentCount * 1;
  
  return Math.round(viewScore + likeScore + commentScore);
}

/**
 * Maps YouTube video data to FeedItem
 */
export function mapYouTubeToFeedItem(
  rawData: YouTubeRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const videoId = rawData.videoId || rawData.externalId || '';
  const videoUrl = rawData.videoUrl || rawData.actionUrl || `https://youtube.com/watch?v=${videoId}`;
  const title = rawData.title || rawData.productName || 'YouTube Video';
  const description = rawData.description || '';
  const thumbnailUrl = rawData.thumbnailUrl || '';
  const viewCount = rawData.viewCount || 0;
  const likeCount = rawData.likeCount || 0;
  const commentCount = rawData.commentCount || 0;
  const productUrl = rawData.productUrl;
  const tags = rawData.tags || [];

  const engagementScore = calculateEngagementScore(viewCount, likeCount, commentCount);

  return {
    id,
    externalId: videoId,
    sourcePlatform: SourcePlatform.YouTube,
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: thumbnailUrl,
      thumbnailUrl,
      actionUrl: productUrl || videoUrl,
      contentType: ContentType.VideoReview,
    },
    commerce: null, // YouTube videos typically don't have direct commerce data
    metrics: {
      viewCount,
      reviewCount: commentCount, // Using comment count as review count
      engagementScore,
    },
    tags,
    rawPayload: rawData,
  };
}
