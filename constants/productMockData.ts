/**
 * Mock product detail data for development and testing
 * Structure is modular to be replaced with Supabase queries later
 */
import { ContentType, FeedItem, SourcePlatform } from '@/types/reviewTypes';

export interface ProductDetail {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  overallRating: number;
  reviewCount: number;
  reviews: FeedItem[];
  price: {
    current: number;
    original?: number;
    currency: string;
    merchant: string;
  };
  similarProducts: FeedItem[];
}

/**
 * Mock product details mapped by product ID
 */
export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  '1': {
    id: '1',
    name: 'Sony WH-1000XM5 Wireless Premium Noise Canceling Overhead Headphones',
    brand: 'Sony',
    imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
    overallRating: 4.8,
    reviewCount: 10420,
    price: {
      current: 348.00,
      original: 399.00,
      currency: 'USD',
      merchant: 'Amazon',
    },
    reviews: [
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
        id: 'review-1',
        externalId: 'B09XS7JWHH-review-1',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Excellent noise cancellation and sound quality',
          description: 'I\'ve been using these for 3 months now and they are absolutely fantastic. The noise cancellation is top-notch and the battery life is incredible.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B09XS7JWHH',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: null,
        metrics: {
          ratingScore: 5.0,
          reviewCount: 1,
          engagementScore: 100,
        },
        tags: ['headphones', 'review'],
      },
      {
        id: 'review-2',
        externalId: 'B09XS7JWHH-review-2',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Great headphones but pricey',
          description: 'Sound quality is amazing and comfort is good for long sessions. Only downside is the price point.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B09XS7JWHH',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: null,
        metrics: {
          ratingScore: 4.5,
          reviewCount: 1,
          engagementScore: 85,
        },
        tags: ['headphones', 'review'],
      },
    ],
    similarProducts: [
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
        id: 'similar-1',
        externalId: 'B08ABC456',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Bose QuietComfort 45 Wireless Headphones',
          description: 'Premium noise canceling headphones with world-class noise cancellation.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B08ABC456',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: {
          currency: 'USD',
          currentPrice: 329.00,
          originalPrice: 379.00,
          isOnSale: true,
          merchantName: 'Amazon',
        },
        metrics: {
          ratingScore: 4.6,
          reviewCount: 8900,
          engagementScore: 820,
        },
        tags: ['electronics', 'headphones', 'bose'],
      },
    ],
  },
  '4': {
    id: '4',
    name: 'Apple AirPods Pro (2nd Generation)',
    brand: 'Apple',
    imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
    overallRating: 4.7,
    reviewCount: 15200,
    price: {
      current: 249.99,
      original: 279.99,
      currency: 'USD',
      merchant: 'Amazon',
    },
    reviews: [
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
      {
        id: 'review-3',
        externalId: 'B08XYZ123-review-1',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Perfect fit and amazing sound',
          description: 'These are the best earbuds I\'ve ever owned. The fit is perfect and the sound quality is outstanding.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B08XYZ123',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: null,
        metrics: {
          ratingScore: 5.0,
          reviewCount: 1,
          engagementScore: 100,
        },
        tags: ['earbuds', 'review'],
      },
      {
        id: 'review-4',
        externalId: 'B08XYZ123-review-2',
        sourcePlatform: SourcePlatform.YouTube,
        detectedAt: new Date(),
        display: {
          title: 'AirPods Pro 2 Review - Worth the Upgrade?',
          description: 'Comparing the new AirPods Pro 2 with the original model. Is it worth upgrading?',
          mainImageUrl: 'https://i.ytimg.com/vi/example/maxresdefault.jpg',
          actionUrl: 'https://youtube.com/watch?v=example',
          contentType: ContentType.VideoReview,
        },
        commerce: null,
        metrics: {
          viewCount: 1200000,
          reviewCount: 2800,
          engagementScore: 750,
        },
        tags: ['airpods', 'review', 'comparison'],
      },
      {
        id: 'review-5',
        externalId: 'B08XYZ123-review-3',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Good but battery could be better',
          description: 'Sound quality is great and noise cancellation works well. Battery life is decent but could be improved.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B08XYZ123',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: null,
        metrics: {
          ratingScore: 4.0,
          reviewCount: 1,
          engagementScore: 70,
        },
        tags: ['earbuds', 'review'],
      },
    ],
    similarProducts: [
      {
        id: '1',
        externalId: 'B09XS7JWHH',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Sony WH-1000XM5 Wireless Premium Noise Canceling Overhead Headphones',
          description: 'Industry-leading noise canceling with Dual Noise Sensor technology.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
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
        id: 'similar-2',
        externalId: 'B08DEF789',
        sourcePlatform: SourcePlatform.Amazon,
        detectedAt: new Date(),
        display: {
          title: 'Samsung Galaxy Buds2 Pro',
          description: 'Premium wireless earbuds with active noise cancellation and 360 Audio.',
          mainImageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
          actionUrl: 'https://amazon.com/dp/B08DEF789',
          contentType: ContentType.PhysicalProduct,
        },
        commerce: {
          currency: 'USD',
          currentPrice: 199.99,
          originalPrice: 229.99,
          isOnSale: true,
          merchantName: 'Amazon',
        },
        metrics: {
          ratingScore: 4.5,
          reviewCount: 6800,
          engagementScore: 720,
        },
        tags: ['electronics', 'earbuds', 'samsung'],
      },
    ],
  },
};

/**
 * Get product detail by ID (mock implementation)
 * Later: Replace with Supabase query
 */
export function getProductDetailById(id: string): ProductDetail | null {
  return MOCK_PRODUCT_DETAILS[id] || null;
}

