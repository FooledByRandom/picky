/**
 * Service for managing search history in Supabase
 * Handles saving and retrieving user search queries
 */
import { supabase } from '@/lib/supabase/client';
import type { SearchRow, SearchInsert } from '@/lib/database/supabase-types';
import type { FilterState } from '@/types/filterTypes';

/**
 * Save a search query to history
 */
export async function saveSearch(
  query: string,
  filters: FilterState,
  resultCount: number
): Promise<{ data: SearchRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const insertData: SearchInsert = {
      user_id: user.id,
      query,
      filters,
      result_count: resultCount,
      searched_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('searches')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as SearchRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to save search'),
    };
  }
}

/**
 * Get search history for the current user
 */
export async function getSearchHistory(limit = 20): Promise<{ data: SearchRow[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('searches')
      .select('*')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return { data: (data || []) as SearchRow[], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Failed to fetch search history'),
    };
  }
}

/**
 * Delete a search from history
 */
export async function deleteSearch(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('searches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to delete search'),
    };
  }
}

