/**
 * TypeScript types for Supabase database tables
 * Defines row types, insert types, and update types for all tables
 */
import type { FilterState } from '@/types/filterTypes';

// Base types
export type UUID = string;
export type Timestamp = string; // ISO date string

// 1. Feed Items Table Types - Re-exported from lib/database/types.ts
// See lib/database/types.ts for FeedItemRow, FeedItemInsert, FeedItemUpdate

// 2. Searches Table Types
export interface SearchRow {
  id: UUID;
  user_id: UUID;
  query: string;
  filters: FilterState;
  result_count: number;
  searched_at: Timestamp;
  created_at: Timestamp;
}

export type SearchInsert = Omit<SearchRow, 'id' | 'created_at'>;
export type SearchUpdate = Partial<Omit<SearchRow, 'id' | 'user_id' | 'created_at'>>;

// 3. Recent Scans Table Types
export interface RecentScanRow {
  id: UUID;
  user_id: UUID;
  barcode: string;
  product_name: string | null;
  feed_item_id: UUID | null;
  scanned_at: Timestamp;
  created_at: Timestamp;
}

export type RecentScanInsert = Omit<RecentScanRow, 'id' | 'created_at'>;
export type RecentScanUpdate = Partial<Omit<RecentScanRow, 'id' | 'user_id' | 'created_at'>>;

// 4. Upcoming Items Table Types
export interface UpcomingItemRow {
  id: UUID;
  user_id: UUID;
  feed_item_id: UUID;
  notes: string | null;
  reminder_date: Timestamp | null;
  added_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type UpcomingItemInsert = Omit<UpcomingItemRow, 'id' | 'created_at' | 'updated_at'>;
export type UpcomingItemUpdate = Partial<Omit<UpcomingItemRow, 'id' | 'user_id' | 'created_at'>>;

// 5. Score Ratings Table Types
export interface ScoreRatingRow {
  id: UUID;
  user_id: UUID;
  feed_item_id: UUID;
  rating: number; // 1-5
  comment: string | null;
  rated_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type ScoreRatingInsert = Omit<ScoreRatingRow, 'id' | 'created_at' | 'updated_at'>;
export type ScoreRatingUpdate = Partial<Omit<ScoreRatingRow, 'id' | 'user_id' | 'created_at'>>;

// Helper type for database responses
export interface DatabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
    hint?: string;
  } | null;
}

