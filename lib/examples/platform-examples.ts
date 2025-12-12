/**
 * Example usage of the normalization system
 * Shows raw data from each platform and the resulting normalized FeedItem
 */
import { feedItemToRow } from '@/lib/database/types';
import { normalizeFeedItem } from '@/lib/services/normalize-feed-item';
import { FeedItem, SourcePlatform } from '@/types/reviewTypes';

// Example Amazon product data
export const exampleAmazonData = {
  asin: 'B09XS7JWHH',
  title: 'Sony WH-1000XM5 Wireless Premium Noise Canceling Overhead Headphones',
  description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo.',
  imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
  thumbnailUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg',
  productUrl: 'https://amazon.com/dp/B09XS7JWHH',
  price: 348.00,
  originalPrice: 399.00,
  currency: 'USD',
  rating: 4.8,
  reviewCount: 10420,
  merchantName: 'Amazon',
  tags: ['electronics', 'headphones', 'noise_cancelling'],
};

// Example TikTok video data
export const exampleTikTokData = {
  videoId: '7234567890123456789',
  videoUrl: 'https://tiktok.com/@user/video/7234567890123456789',
  title: 'Best Headphones for Work',
  caption: 'These Sony headphones changed my life! 🎧 #headphones #tech #productreview',
  thumbnailUrl: 'https://p16-sign-va.tiktokcdn.com/example.jpg',
  viewCount: 1500000,
  likeCount: 125000,
  commentCount: 8500,
  shareCount: 3200,
  tags: ['headphones', 'tech', 'productreview'],
};

// Example YouTube video data
export const exampleYouTubeData = {
  videoId: 'dQw4w9WgXcQ',
  videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Sony WH-1000XM5 Review - Best Noise Canceling Headphones?',
  description: 'In-depth review of the Sony WH-1000XM5 headphones covering sound quality, noise canceling, and comfort.',
  thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  viewCount: 2500000,
  likeCount: 45000,
  commentCount: 3200,
  tags: ['headphones', 'review', 'sony'],
};

// Example Reddit post data
export const exampleRedditData = {
  postId: '/r/headphones/comments/abc123/sony_wh1000xm5_review',
  postUrl: 'https://reddit.com/r/headphones/comments/abc123/sony_wh1000xm5_review',
  title: 'Sony WH-1000XM5 Review - My honest thoughts after 3 months',
  selftext: 'I\'ve been using these headphones for 3 months now and here are my thoughts...',
  thumbnailUrl: 'https://example.com/reddit-thumb.jpg',
  upvotes: 1250,
  downvotes: 45,
  commentCount: 320,
  subreddit: 'headphones',
  tags: ['review', 'sony'],
};

// Example Twitter/X post data
export const exampleTwitterData = {
  tweetId: '1234567890123456789',
  tweetUrl: 'https://twitter.com/user/status/1234567890123456789',
  text: 'Just got the Sony WH-1000XM5 headphones and they are incredible! The noise canceling is next level. #headphones #tech',
  mediaUrl: 'https://pbs.twimg.com/media/example.jpg',
  likeCount: 850,
  retweetCount: 120,
  replyCount: 45,
  quoteCount: 15,
  hashtags: ['headphones', 'tech'],
};

// Example Google search/product data
export const exampleGoogleData = {
  productId: 'sony-wh-1000xm5',
  searchQuery: 'Sony WH-1000XM5',
  title: 'Sony WH-1000XM5 Wireless Premium Noise Canceling Headphones',
  description: 'Buy Sony WH-1000XM5 at Best Buy. Free shipping available.',
  imageUrl: 'https://example.com/google-product.jpg',
  productUrl: 'https://bestbuy.com/site/sony-wh-1000xm5',
  price: 349.99,
  originalPrice: 399.99,
  currency: 'USD',
  rating: 4.7,
  reviewCount: 8500,
  merchantName: 'Best Buy',
  trendScore: 95,
  tags: ['headphones', 'sony'],
};

/**
 * Example: Normalize Amazon data
 */
export function exampleNormalizeAmazon(): FeedItem {
  return normalizeFeedItem(exampleAmazonData, {
    sourcePlatform: SourcePlatform.Amazon,
  });
}

/**
 * Example: Normalize TikTok data
 */
export function exampleNormalizeTikTok(): FeedItem {
  return normalizeFeedItem(exampleTikTokData, {
    sourcePlatform: SourcePlatform.TikTok,
  });
}

/**
 * Example: Normalize YouTube data
 */
export function exampleNormalizeYouTube(): FeedItem {
  return normalizeFeedItem(exampleYouTubeData, {
    sourcePlatform: SourcePlatform.YouTube,
  });
}

/**
 * Example: Normalize Reddit data
 */
export function exampleNormalizeReddit(): FeedItem {
  return normalizeFeedItem(exampleRedditData);
}

/**
 * Example: Normalize Twitter data
 */
export function exampleNormalizeTwitter(): FeedItem {
  return normalizeFeedItem(exampleTwitterData);
}

/**
 * Example: Normalize Google data
 */
export function exampleNormalizeGoogle(): FeedItem {
  return normalizeFeedItem(exampleGoogleData, {
    sourcePlatform: SourcePlatform.Google,
  });
}

/**
 * Example: Convert FeedItem to database row
 */
export function exampleFeedItemToRow(feedItem: FeedItem) {
  return feedItemToRow(feedItem);
}

/**
 * Example: Complete workflow - normalize and prepare for database
 */
export function exampleCompleteWorkflow(rawData: any) {
  // Step 1: Normalize the data
  const feedItem = normalizeFeedItem(rawData);
  
  // Step 2: Convert to database row format
  const dbRow = feedItemToRow(feedItem);
  
  // Step 3: Ready to insert into Supabase
  // await supabase.from('feed_items').insert(dbRow);
  
  return { feedItem, dbRow };
}
