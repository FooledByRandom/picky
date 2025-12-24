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
const IMAGE_HEIGHT = 140; // Reduced height for compact layout
// Calculate card width for two-column layout: (screen width - left padding - right padding - gap) / 2
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 8) / 2;

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
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
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
            size={12}
            color="#FFFFFF"
            style={{ marginRight: 3 }}
          />
          <Text style={styles.platformLabel}>{platformStyle.label}</Text>
        </View>
      </View>

      {/* Body Content */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {display.title}
        </Text>

        {/* Description - moved inside card */}
        <Text style={styles.description} numberOfLines={2}>
          {display.description}
        </Text>

        {/* Dynamic Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Price OR View Count */}
          {commerce ? (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {formatPrice(commerce.currentPrice, commerce.currency)}
              </Text>
              {commerce.originalPrice && (
                <Text style={styles.originalPrice}>
                  {formatPrice(commerce.originalPrice, commerce.currency)}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.viewCountContainer}>
              <IconSymbol
                name="eye.fill"
                size={12}
                color="#6B7280"
                style={{ marginRight: 3 }}
              />
              <Text style={styles.viewCount}>
                {formatMetric(metrics.viewCount || 0)}
              </Text>
            </View>
          )}

          {/* Rating (Stars) */}
          {metrics.ratingScore && (
            <View style={styles.ratingContainer}>
              <IconSymbol
                name="star.fill"
                size={12}
                color="#FCD34D"
                style={{ marginRight: 2 }}
              />
              <Text style={styles.ratingScore}>
                {metrics.ratingScore.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    fontSize: 36,
  },
  platformBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
  },
  platformLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 18,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  viewCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
});


