/**
 * Service for managing filter state in AsyncStorage (local only)
 * Filters are stored locally and not synced to Supabase
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FilterState } from '@/types/filterTypes';

const FILTER_STORAGE_KEY = '@picky:filter_state';

/**
 * Save filter state to AsyncStorage
 */
export async function saveFilters(filterState: FilterState): Promise<{ error: Error | null }> {
  try {
    const jsonValue = JSON.stringify(filterState);
    await AsyncStorage.setItem(FILTER_STORAGE_KEY, jsonValue);
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to save filters'),
    };
  }
}

/**
 * Get filter state from AsyncStorage
 */
export async function getFilters(): Promise<{ data: FilterState | null; error: Error | null }> {
  try {
    const jsonValue = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
    if (jsonValue === null) {
      // Return default filter state
      return {
        data: {
          productType: null,
          subProduct: null,
          priceRange: { min: null, max: null },
          minRating: null,
          reviewFormat: null,
        },
        error: null,
      };
    }
    const filterState = JSON.parse(jsonValue) as FilterState;
    return { data: filterState, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to load filters'),
    };
  }
}

/**
 * Clear filter state from AsyncStorage
 */
export async function clearFilters(): Promise<{ error: Error | null }> {
  try {
    await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Failed to clear filters'),
    };
  }
}

