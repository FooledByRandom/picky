/**
 * FeedCard component for displaying FeedItems
 * Shows product/video information with platform badges, metrics, and action buttons
 */
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatMetric, formatPrice, getPlatformStyle } from '@/lib/utils/formatting';
import { FeedItem } from '@/types/reviewTypes';
import { Image } from 'expo-image';
import React from 'react';
import {
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const IMAGE_HEIGHT = 192; // 48 * 4 (h-48 equivalent)

interface FeedCardProps {
  item: FeedItem;
  onPress?: (item: FeedItem) => void;
}

/**
 * FeedCard component displays a FeedItem with:
 * - Image header with platform badge
 * - Title and description
 * - Dynamic metrics (price or view count, rating)
 * - Action button (View Product or Watch Video)
 */
export function FeedCard({ item, onPress }: FeedCardProps) {
  const { display, commerce, metrics, sourcePlatform } = item;
  const platformStyle = getPlatformStyle(sourcePlatform);

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      // Default: open URL in browser
      Linking.openURL(display.actionUrl).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* Image Header */}
      <View style={styles.imageContainer}>
        {display.mainImageUrl ? (
          <Image
            source={{ uri: display.mainImageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={500}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            placeholderContentFit="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📦</Text>
          </View>
        )}

        {/* Platform Badge (Top Right) */}
        <View
          style={[
            styles.platformBadge,
            { backgroundColor: platformStyle.backgroundColor },
          ]}
        >
          <IconSymbol
            name={platformStyle.iconName}
            size={14}
            color="#FFFFFF"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.platformLabel}>{platformStyle.label}</Text>
        </View>
      </View>

      {/* Body Content */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {display.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {display.description}
        </Text>

        {/* Dynamic Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Left Side: Price OR View Count */}
          <View style={styles.metricsLeft}>
            {commerce ? (
              // If Commerce exists (Amazon), show Price
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {formatPrice(commerce.currentPrice, commerce.currency)}
                </Text>
                {commerce.originalPrice && (
                  <Text style={[styles.originalPrice, { marginLeft: 8 }]}>
                    {formatPrice(commerce.originalPrice, commerce.currency)}
                  </Text>
                )}
              </View>
            ) : (
              // If No Commerce (TikTok/YouTube), show View Count
              <View style={styles.viewCountContainer}>
                <IconSymbol
                  name="eye.fill"
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.viewCount}>
                  {formatMetric(metrics.viewCount || 0)} Views
                </Text>
              </View>
            )}
          </View>

          {/* Right Side: Rating (Stars) */}
          {metrics.ratingScore && (
            <View style={styles.ratingContainer}>
              <IconSymbol
                name="star.fill"
                size={14}
                color="#FCD34D"
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.ratingScore, { marginRight: 4 }]}>
                {metrics.ratingScore.toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>
                ({formatMetric(metrics.reviewCount || 0)})
              </Text>
            </View>
          )}
        </View>

        {/* Call to Action Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {commerce ? 'View Product' : 'Watch Video'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  platformBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  platformLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricsLeft: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButton: {
    width: '100%',
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
