/**
 * Service for managing upcoming items (wishlist) in Supabase
 * Handles adding, retrieving, updating, and removing items users want to track
 */
import { supabase } from '@/lib/supabase/client';
import type { UpcomingItemRow, UpcomingItemInsert, UpcomingItemUpdate } from '@/lib/database/supabase-types';

/**
 * Add an item to upcoming items list
 */
export async function addUpcomingItem(
  feedItemId: string,
  notes: string | null = null,
  reminderDate: Date | null = null
): Promise<{ data: UpcomingItemRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const insertData: UpcomingItemInsert = {
      user_id: user.id,
      feed_item_id: feedItemId,
      notes,
      reminder_date: reminderDate ? reminderDate.toISOString() : null,
      added_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('upcoming_items')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as UpcomingItemRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to add upcoming item'),
    };
  }
}

/**
 * Get all upcoming items for the current user
 */
export async function getUpcomingItems(): Promise<{ data: UpcomingItemRow[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('upcoming_items')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return { data: (data || []) as UpcomingItemRow[], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Failed to fetch upcoming items'),
    };
  }
}

/**
 * Update an upcoming item
 */
export async function updateUpcomingItem(
  id: string,
  updates: UpcomingItemUpdate
): Promise<{ data: UpcomingItemRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('upcoming_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as UpcomingItemRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to update upcoming item'),
    };
  }
}

/**
 * Remove an item from upcoming items list
 */
export async function removeUpcomingItem(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('upcoming_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to remove upcoming item'),
    };
  }
}

