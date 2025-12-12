# Review Aggregation System

This directory contains the data normalization system for aggregating reviews from multiple platforms.

## Structure

- **`types/reviewTypes.ts`** - Core type definitions with enums and interfaces
- **`lib/validation/feed-item-schema.ts`** - Zod validation schemas
- **`lib/mappers/`** - Platform-specific data mappers
  - `amazon-mapper.ts` - Amazon product data
  - `tiktok-mapper.ts` - TikTok video data
  - `youtube-mapper.ts` - YouTube video data
  - `reddit-mapper.ts` - Reddit post data
  - `twitter-mapper.ts` - Twitter/X post data
  - `google-mapper.ts` - Google search/product data
- **`lib/services/normalize-feed-item.ts`** - Main normalization service
- **`lib/database/types.ts`** - Supabase database types and conversion utilities
- **`lib/examples/platform-examples.ts`** - Usage examples

## Usage

```typescript
import { normalizeFeedItem } from '@/lib/services/normalize-feed-item';
import { feedItemToRow } from '@/lib/database/types';

// Normalize raw platform data
const rawData = {
  asin: 'B09XS7JWHH',
  title: 'Sony WH-1000XM5',
  // ... other fields
};

const feedItem = normalizeFeedItem(rawData, {
  sourcePlatform: SourcePlatform.Amazon,
});

// Convert to database format
const dbRow = feedItemToRow(feedItem);

// Insert into Supabase
// await supabase.from('feed_items').insert(dbRow);
```

## Notes

- Reddit and Twitter data are currently mapped to `SourcePlatform.Google` as they may come through Google search results. If you need separate platforms, extend the `SourcePlatform` enum.
- All mappers preserve the original `rawPayload` for debugging and auditing.
- The normalization service automatically detects the platform if not explicitly provided.
