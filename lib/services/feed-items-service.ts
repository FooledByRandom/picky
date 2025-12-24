/**
 * Service for managing feed items in Supabase
 * Handles CRUD operations for feed items with user authentication
 */
import { supabase } from '@/lib/supabase/client';
import { feedItemToRow, rowToFeedItem, type FeedItemInsert, type FeedItemUpdate } from '@/lib/database/types';
import type { FeedItem } from '@/types/reviewTypes';
import type { FilterState } from '@/types/filterTypes';

export interface FeedItemFilters {
  sourcePlatform?: string[];
  contentType?: string[];
  minRating?: number;
  priceRange?: { min: number | null; max: number | null };
  productType?: string | null;
  reviewFormat?: 'video' | 'written' | null;
}

/**
 * Get feed items with optional filtering
 */
export async function getFeedItems(filters?: FeedItemFilters, limit = 50): Promise<{ data: FeedItem[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: new Error('User not authenticated') };
    }

    let query = supabase
      .from('feed_items')
      .select('*')
      .eq('user_id', user.id)
      .order('detected_at', { ascending: false })
      .limit(limit);

    // Apply filters
    if (filters) {
      if (filters.sourcePlatform && filters.sourcePlatform.length > 0) {
        query = query.in('source_platform', filters.sourcePlatform);
      }
      if (filters.contentType && filters.contentType.length > 0) {
        query = query.in('display_content_type', filters.contentType);
      }
      if (filters.minRating !== undefined) {
        query = query.gte('metrics_rating_score', filters.minRating);
      }
      if (filters.priceRange) {
        if (filters.priceRange.min !== null) {
          query = query.gte('commerce_current_price', filters.priceRange.min);
        }
        if (filters.priceRange.max !== null) {
          query = query.lte('commerce_current_price', filters.priceRange.max);
        }
      }
      if (filters.reviewFormat === 'video') {
        query = query.eq('display_content_type', 'video_review');
      } else if (filters.reviewFormat === 'written') {
        query = query.neq('display_content_type', 'video_review');
      }
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    const feedItems = (data || []).map(rowToFeedItem);
    return { data: feedItems, error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Failed to fetch feed items'),
    };
  }
}

/**
 * Get a single feed item by ID
 */
export async function getFeedItemById(id: string): Promise<{ data: FeedItem | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('feed_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return { data: rowToFeedItem(data), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch feed item'),
    };
  }
}

/**
 * Create a new feed item
 */
export async function createFeedItem(feedItem: FeedItem): Promise<{ data: FeedItem | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const row = feedItemToRow(feedItem);
    const insertData: FeedItemInsert = {
      ...row,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('feed_items')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: rowToFeedItem(data), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to create feed item'),
    };
  }
}

/**
 * Update an existing feed item
 */
export async function updateFeedItem(id: string, updates: FeedItemUpdate): Promise<{ data: FeedItem | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('feed_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: rowToFeedItem(data), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to update feed item'),
    };
  }
}

/**
 * Delete a feed item
 */
export async function deleteFeedItem(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('feed_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to delete feed item'),
    };
  }
}

