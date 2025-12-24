/**
 * Service for managing recent barcode scans in Supabase
 * Handles saving and retrieving camera scan history
 */
import { supabase } from '@/lib/supabase/client';
import type { RecentScanRow, RecentScanInsert } from '@/lib/database/supabase-types';

/**
 * Save a barcode scan
 */
export async function saveScan(
  barcode: string,
  productName: string | null = null,
  feedItemId: string | null = null
): Promise<{ data: RecentScanRow | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const insertData: RecentScanInsert = {
      user_id: user.id,
      barcode,
      product_name: productName,
      feed_item_id: feedItemId,
      scanned_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('recent_scans')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as RecentScanRow, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to save scan'),
    };
  }
}

/**
 * Get recent scans for the current user
 */
export async function getRecentScans(limit = 20): Promise<{ data: RecentScanRow[]; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('recent_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('scanned_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return { data: (data || []) as RecentScanRow[], error: null };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Failed to fetch recent scans'),
    };
  }
}

/**
 * Delete a scan from history
 */
export async function deleteScan(id: string): Promise<{ error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('recent_scans')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to delete scan'),
    };
  }
}

