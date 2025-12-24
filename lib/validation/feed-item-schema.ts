/**
 * Zod validation schema for FeedItem
 * Ensures data integrity before saving to database
 */
import { ContentType, SourcePlatform } from '@/types/reviewTypes';
import { z } from 'zod';

// Schema for FeedItemDisplay
const feedItemDisplaySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  mainImageUrl: z.string().url('Main image URL must be a valid URL'),
  thumbnailUrl: z.string().url('Thumbnail URL must be a valid URL').optional(),
  actionUrl: z.string().url('Action URL must be a valid URL'),
  contentType: z.nativeEnum(ContentType),
});

// Schema for CommerceData
const commerceDataSchema = z.object({
  currency: z.string().length(3, 'Currency must be a 3-letter code (e.g., USD)'),
  currentPrice: z.number().nonnegative('Current price must be non-negative'),
  originalPrice: z.number().nonnegative('Original price must be non-negative').optional(),
  isOnSale: z.boolean(),
  merchantName: z.string().min(1, 'Merchant name is required'),
});

// Schema for SocialMetrics
const socialMetricsSchema = z.object({
  ratingScore: z.number().min(0).max(5, 'Rating score must be between 0 and 5').optional(),
  reviewCount: z.number().int().nonnegative('Review count must be a non-negative integer').optional(),
  viewCount: z.number().int().nonnegative('View count must be a non-negative integer').optional(),
  engagementScore: z.number().nonnegative('Engagement score must be non-negative'),
});

// Main FeedItem schema
export const feedItemSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
  externalId: z.string().min(1, 'External ID is required'),
  sourcePlatform: z.nativeEnum(SourcePlatform),
  detectedAt: z.date(),
  display: feedItemDisplaySchema,
  commerce: commerceDataSchema.nullable(),
  metrics: socialMetricsSchema,
  tags: z.array(z.string()).default([]),
  rawPayload: z.record(z.unknown()).optional(),
});

/**
 * Validates a FeedItem object against the schema
 * @param data - The data to validate
 * @returns The validated FeedItem
 * @throws ZodError if validation fails
 */
export function validateFeedItem(data: unknown) {
  return feedItemSchema.parse(data);
}

/**
 * Safely validates a FeedItem object, returning a result object
 * @param data - The data to validate
 * @returns Object with success flag and data/error
 */
export function safeValidateFeedItem(data: unknown) {
  return feedItemSchema.safeParse(data);
}

