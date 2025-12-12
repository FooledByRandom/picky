/**
 * Utility functions for formatting currency, numbers, and platform-specific styling
 */
import { SourcePlatform } from '@/types/reviewTypes';

/**
 * Formats a number as currency using Intl.NumberFormat
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string (e.g., '$348.00')
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats large numbers with K (thousands) or M (millions) suffix
 * @param num - The number to format
 * @returns Formatted string (e.g., '2.5M', '1.2k', '500')
 */
export function formatMetric(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Platform-specific styling configuration
 * Returns color, label, and icon name for each platform
 */
export interface PlatformStyle {
  backgroundColor: string;
  label: string;
  iconName: 'cart.fill' | 'play.circle.fill' | 'globe';
}

/**
 * Gets platform-specific styling configuration
 * @param platform - The source platform
 * @returns Platform style configuration
 */
export function getPlatformStyle(platform: SourcePlatform): PlatformStyle {
  switch (platform) {
    case SourcePlatform.Amazon:
      return {
        backgroundColor: '#FCD34D', // yellow-400
        label: 'Amazon',
        iconName: 'cart.fill',
      };
    case SourcePlatform.TikTok:
      return {
        backgroundColor: '#000000', // black
        label: 'TikTok',
        iconName: 'play.circle.fill',
      };
    case SourcePlatform.YouTube:
      return {
        backgroundColor: '#DC2626', // red-600
        label: 'YouTube',
        iconName: 'play.circle.fill',
      };
    case SourcePlatform.Google:
    default:
      return {
        backgroundColor: '#3B82F6', // blue-500
        label: 'Web',
        iconName: 'globe',
      };
  }
}
