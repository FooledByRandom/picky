/**
 * Service for managing user product ratings in Supabase
 * Handles creating, retrieving, updating, and deleting user ratings
 */
import { supabase } from '@/lib/supabase/client';
import type { ScoreRatingRow, ScoreRatingInsert, ScoreRatingUpdate } from '@/lib/database/supabase-types';

/**
 * Rate a product (feed item)
 */
export async function rateProduct(
  feedItemId: string,
  rating: number,
  comment: string | null = null
): Promise<{ data: ScoreRatingRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    if (rating < 1 || rating > 5) {
      return { data: null, error: new Error('Rating must be between 1 and 5') };
    }

    const insertData: ScoreRatingInsert = {
      user_id: user.id,
      feed_item_id: feedItemId,
      rating,
      comment,
      rated_at: new Date().toISOString(),
    };

    // Use upsert to handle case where user already rated this item
    const { data, error } = await supabase
      .from('score_ratings')
      .upsert(insertData, {
        onConflict: 'user_id,feed_item_id',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ScoreRatingRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to rate product'),
    };
  }
}

/**
 * Get all ratings for the current user
 */
export async function getUserRatings(): Promise<{ data: ScoreRatingRow[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('score_ratings')
      .select('*')
      .eq('user_id', user.id)
      .order('rated_at', { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return { data: (data || []) as ScoreRatingRow[], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Failed to fetch user ratings'),
    };
  }
}

/**
 * Get rating for a specific feed item
 */
export async function getRatingForFeedItem(feedItemId: string): Promise<{ data: ScoreRatingRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('score_ratings')
      .select('*')
      .eq('user_id', user.id)
      .eq('feed_item_id', feedItemId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rating found
        return { data: null, error: null };
      }
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ScoreRatingRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch rating'),
    };
  }
}

/**
 * Update an existing rating
 */
export async function updateRating(
  id: string,
  updates: ScoreRatingUpdate
): Promise<{ data: ScoreRatingRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
      return { data: null, error: new Error('Rating must be between 1 and 5') };
    }

    const { data, error } = await supabase
      .from('score_ratings')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as ScoreRatingRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to update rating'),
    };
  }
}

/**
 * Delete a rating
 */
export async function deleteRating(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('score_ratings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to delete rating'),
    };
  }
}

