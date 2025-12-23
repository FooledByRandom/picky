/**
 * Type definitions for filter functionality
 * Defines the structure for filter state used in FilterModal
 */

export interface FilterState {
  productType: string | null;
  subProduct: string | null;
  priceRange: { min: number | null; max: number | null };
  minRating: number | null;
  reviewFormat: 'video' | 'written' | null;
}

