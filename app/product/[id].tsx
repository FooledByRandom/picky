/**
 * Product detail screen
 * Displays product information with image header, overlapping info circle,
 * and collapsible sections for Reviews, Price, and Similar Products
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FeedCard } from '@/components/FeedCard';
import { ProductCollapsible } from '@/components/ProductCollapsible';
import { ProductCard } from '@/components/ProductCard';
import { getProductDetailById } from '@/constants/productMockData';
import { formatPrice } from '@/lib/utils/formatting';
import type { ProductDetail } from '@/constants/productMockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.15; // 15% of screen height
const CIRCLE_SIZE = 400; // Much larger circle
const CIRCLE_VISIBLE_HEIGHT = CIRCLE_SIZE * 0.1; // Only show bottom 10% as crescent/hump
const CIRCLE_SPACING = 0; // No spacing - crescent sits at bottom of image

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = id ? getProductDetailById(id) : null;

  if (!product) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Get first 4 reviews for display (2 rows, 2 columns)
  const displayedReviews = product.reviews.slice(0, 4);
  const hasMoreReviews = product.reviews.length > 4;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Header (15% of screen) with Crescent at Bottom */}
        <View style={[styles.imageHeader, { height: HEADER_HEIGHT }]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.headerImage}
            contentFit="cover"
            transition={500}
            placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
            placeholderContentFit="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButtonOverlay}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Large Circle with Product Info - Only bottom arc visible as crescent/hump */}
          <View style={styles.circleContainer}>
            <View style={styles.circleWrapper}>
              <View style={styles.infoCircle}>
                <Text style={styles.brandName}>{product.brand}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Product Name and Rating - Outside the crescent */}
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingContainer}>
            <IconSymbol
              name="star.fill"
              size={12}
              color="#FCD34D"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.ratingText}>
              {product.overallRating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCountText}>
              ({product.reviewCount.toLocaleString()})
            </Text>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          {/* Reviews Section (Auto-opened) */}
          <ProductCollapsible title="Reviews" defaultOpen={true}>
            <View style={styles.reviewsGrid}>
              {displayedReviews.map((review, index) => (
                <View key={review.id} style={styles.reviewCardWrapper}>
                  <FeedCard item={review} />
                  {/* Fade-out overlay on second row */}
                  {index >= 2 && hasMoreReviews && (
                    <View style={styles.fadeOverlay} pointerEvents="none">
                      <View style={[styles.fadeLayer, { opacity: 0.2, top: 0 }]} />
                      <View style={[styles.fadeLayer, { opacity: 0.5, top: 20 }]} />
                      <View style={[styles.fadeLayer, { opacity: 0.8, top: 40 }]} />
                      <View style={[styles.fadeLayer, { opacity: 1, top: 60 }]} />
                    </View>
                  )}
                </View>
              ))}
            </View>
            {hasMoreReviews && (
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>
                  See {product.reviews.length - 4} more reviews
                </Text>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            )}
          </ProductCollapsible>

          {/* Price Section */}
          <ProductCollapsible title="Price" defaultOpen={false}>
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>
                  {formatPrice(product.price.current, product.price.currency)}
                </Text>
                {product.price.original && (
                  <Text style={styles.originalPrice}>
                    {formatPrice(product.price.original, product.price.currency)}
                  </Text>
                )}
              </View>
              {product.price.original && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>
                    Save {formatPrice(
                      product.price.original - product.price.current,
                      product.price.currency
                    )}
                  </Text>
                </View>
              )}
              <View style={styles.merchantInfo}>
                <IconSymbol
                  name="storefront"
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.merchantText}>
                  Available at {product.price.merchant}
                </Text>
              </View>
              {/* Mock price history */}
              <View style={styles.priceHistory}>
                <Text style={styles.priceHistoryTitle}>Price History</Text>
                <View style={styles.priceHistoryChart}>
                  <View style={styles.chartBar} />
                  <View style={[styles.chartBar, styles.chartBarLower]} />
                  <View style={[styles.chartBar, styles.chartBarLower]} />
                  <View style={styles.chartBar} />
                  <View style={[styles.chartBar, styles.chartBarLower]} />
                </View>
                <Text style={styles.priceHistoryNote}>
                  Price has dropped 13% in the last 30 days
                </Text>
              </View>
            </View>
          </ProductCollapsible>

          {/* Similar Products Section */}
          <ProductCollapsible title="Similar Products" defaultOpen={false}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarProductsScroll}
            >
              {product.similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  id={similarProduct.id}
                  name={similarProduct.display.title}
                  brand={similarProduct.commerce?.merchantName}
                  imageUrl={similarProduct.display.mainImageUrl}
                />
              ))}
            </ScrollView>
          </ProductCollapsible>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageHeader: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  circleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: CIRCLE_VISIBLE_HEIGHT,
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    // Position circle so only bottom 10% (crescent/hump) is visible
    // Move it down so only bottom arc shows, creating the crescent effect
    position: 'absolute',
    bottom: -(CIRCLE_SIZE - CIRCLE_VISIBLE_HEIGHT),
    left: (SCREEN_WIDTH - CIRCLE_SIZE) / 2,
  },
  infoCircle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // Position ONLY brand name in the visible bottom crescent/hump
    paddingBottom: CIRCLE_SIZE * 0.9 - CIRCLE_VISIBLE_HEIGHT + 12, // Move down so only brand is in crescent
  },
  brandName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginRight: 4,
  },
  reviewCountText: {
    fontSize: 10,
    color: '#6B7280',
  },
  content: {
    marginTop: 4, // Just a tad down so Reviews is visible in exact same spot
    paddingHorizontal: 16,
  },
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reviewCardWrapper: {
    width: (SCREEN_WIDTH - 48) / 2,
    position: 'relative',
    marginBottom: 16,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
  },
  fadeLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#FFFFFF',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  priceSection: {
    paddingTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 20,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  merchantText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceHistory: {
    marginTop: 8,
  },
  priceHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  priceHistoryChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 8,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    height: 60,
  },
  chartBarLower: {
    height: 40,
    backgroundColor: '#9CA3AF',
  },
  priceHistoryNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  similarProductsScroll: {
    paddingVertical: 8,
  },
});
