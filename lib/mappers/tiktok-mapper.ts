/**
 * Maps TikTok video data to normalized FeedItem structure
 * Handles TikTok-specific fields like video ID, views, engagement
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface TikTokRawData {
  videoId?: string;
  videoUrl?: string;
  title?: string;
  description?: string;
  caption?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  productName?: string;
  productUrl?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Calculates engagement score for TikTok videos
 * Based on views, likes, comments, and shares
 */
function calculateEngagementScore(
  viewCount: number = 0,
  likeCount: number = 0,
  commentCount: number = 0,
  shareCount: number = 0
): number {
  // Weighted engagement: views are less valuable than interactions
  const viewScore = Math.log10(viewCount + 1) * 5;
  const likeScore = likeCount * 0.1;
  const commentScore = commentCount * 0.5;
  const shareScore = shareCount * 2;
  
  return Math.round(viewScore + likeScore + commentScore + shareScore);
}

/**
 * Maps TikTok video data to FeedItem
 */
export function mapTikTokToFeedItem(
  rawData: TikTokRawData,
  id: string,
  detectedAt: Date = new Date()
): FeedItem {
  const videoId = rawData.videoId || (rawData.externalId as string | undefined) || '';
  const videoUrl = rawData.videoUrl || (rawData.actionUrl as string | undefined) || `https://tiktok.com/@video/${videoId}`;
  const title = rawData.title || rawData.productName || 'TikTok Video';
  const description = rawData.description || rawData.caption || '';
  const thumbnailUrl = rawData.thumbnailUrl || '';
  const viewCount = rawData.viewCount || 0;
  const likeCount = rawData.likeCount || 0;
  const commentCount = rawData.commentCount || 0;
  const shareCount = rawData.shareCount || 0;
  const productUrl = rawData.productUrl as string | undefined;
  const tags = rawData.tags || [];

  const engagementScore = calculateEngagementScore(viewCount, likeCount, commentCount, shareCount);

  return {
    id,
    externalId: videoId || '',
    sourcePlatform: SourcePlatform.TikTok,
    detectedAt,
    display: {
      title,
      description,
      mainImageUrl: thumbnailUrl,
      thumbnailUrl,
      actionUrl: productUrl || videoUrl || '',
      contentType: ContentType.VideoReview,
    },
    commerce: null, // TikTok videos typically don't have direct commerce data
    metrics: {
      viewCount,
      reviewCount: commentCount, // Using comment count as review count
      engagementScore,
    },
    tags,
    rawPayload: rawData,
  };
}

