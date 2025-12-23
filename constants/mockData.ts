/**
 * Mock feed data for development and testing
 * Replace with real data from your API/database
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    externalId: 'B09XS7JWHH',
    sourcePlatform: SourcePlatform.Amazon,
    detectedAt: new Date(),
    display: {
      title: 'Sony WH-1000XM5 Wireless Premium Noise Canceling Overhead Headphones',
      description: 'Industry-leading noise canceling with Dual Noise Sensor technology.',
      mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
      thumbnailUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
      actionUrl: 'https://amazon.com/dp/B09XS7JWHH',
      contentType: ContentType.PhysicalProduct,
    },
    commerce: {
      currency: 'USD',
      currentPrice: 348.00,
      originalPrice: 399.00,
      isOnSale: true,
      merchantName: 'Amazon',
    },
    metrics: {
      ratingScore: 4.8,
      reviewCount: 10420,
      engagementScore: 850,
    },
    tags: ['electronics', 'headphones', 'noise_cancelling'],
  },
  {
    id: '2',
    externalId: '7234567890123456789',
    sourcePlatform: SourcePlatform.TikTok,
    detectedAt: new Date(),
    display: {
      title: 'Best Headphones for Work',
      description: 'These Sony headphones changed my life! 🎧 #headphones #tech',
      mainImageUrl: 'https://p16-sign-va.tiktokcdn.com/example.jpg',
      actionUrl: 'https://tiktok.com/@user/video/7234567890123456789',
      contentType: ContentType.VideoReview,
    },
    commerce: null,
    metrics: {
      viewCount: 1500000,
      reviewCount: 8500,
      engagementScore: 920,
    },
    tags: ['headphones', 'tech', 'productreview'],
  },
  {
    id: '3',
    externalId: 'dQw4w9WgXcQ',
    sourcePlatform: SourcePlatform.YouTube,
    detectedAt: new Date(),
    display: {
      title: 'Sony WH-1000XM5 Review - Best Noise Canceling Headphones?',
      description: 'In-depth review of the Sony WH-1000XM5 headphones covering sound quality, noise canceling, and comfort.',
      mainImageUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      actionUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      contentType: ContentType.VideoReview,
    },
    commerce: null,
    metrics: {
      viewCount: 2500000,
      reviewCount: 3200,
      engagementScore: 780,
    },
    tags: ['headphones', 'review', 'sony'],
  },
  {
    id: '4',
    externalId: 'B08XYZ123',
    sourcePlatform: SourcePlatform.Amazon,
    detectedAt: new Date(),
    display: {
      title: 'Apple AirPods Pro (2nd Generation)',
      description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio.',
      mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
      actionUrl: 'https://amazon.com/dp/B08XYZ123',
      contentType: ContentType.PhysicalProduct,
    },
    commerce: {
      currency: 'USD',
      currentPrice: 249.99,
      originalPrice: 279.99,
      isOnSale: true,
      merchantName: 'Amazon',
    },
    metrics: {
      ratingScore: 4.7,
      reviewCount: 15200,
      engagementScore: 890,
    },
    tags: ['electronics', 'earbuds', 'apple'],
  },
  {
    id: '5',
    externalId: '9876543210987654321',
    sourcePlatform: SourcePlatform.TikTok,
    detectedAt: new Date(),
    display: {
      title: 'AirPods Pro Unboxing',
      description: 'Just got these and they are AMAZING! The noise cancellation is incredible 🎧✨',
      mainImageUrl: 'https://p16-sign-va.tiktokcdn.com/example2.jpg',
      actionUrl: 'https://tiktok.com/@user/video/9876543210987654321',
      contentType: ContentType.VideoReview,
    },
    commerce: null,
    metrics: {
      viewCount: 850000,
      reviewCount: 4200,
      engagementScore: 650,
    },
    tags: ['airpods', 'unboxing', 'tech'],
  },
];
