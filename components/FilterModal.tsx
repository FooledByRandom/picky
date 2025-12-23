/**
 * FilterModal component for filtering the product feed
 * Provides filtering by product type, sub-product, price range, rating, and review format
 */
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FilterState } from '@/types/filterTypes';
import React, { useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Category mapping: Main categories to their sub-categories
export const CATEGORY_MAPPING: Record<string, string[]> = {
  'Food & Beverage': ['Snacks', 'Beverages', 'Dairy', 'Frozen Foods'],
  Technology: ['Headphones', 'Laptops', 'Accessories', 'Smartphones'],
  Beauty: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances'],
  'Personal Care': ['Oral Care', 'Body Care', 'Hair Care', 'Shaving'],
  'Household Products': ['Cleaning Supplies', 'Storage', 'Kitchenware', 'Home Decor'],
};

const PRODUCT_TYPES = Object.keys(CATEGORY_MAPPING);

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

/**
 * FilterModal component displays filter options in a modal overlay
 * Users can filter by product type, sub-product, price range, rating, and review format
 */
export function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  // Local state for filter selections (not applied until user clicks Apply)
  const [productType, setProductType] = useState<string | null>(
    initialFilters?.productType || null
  );
  const [subProduct, setSubProduct] = useState<string | null>(
    initialFilters?.subProduct || null
  );
  const [priceMin, setPriceMin] = useState<string>(
    initialFilters?.priceRange.min?.toString() || ''
  );
  const [priceMax, setPriceMax] = useState<string>(
    initialFilters?.priceRange.max?.toString() || ''
  );
  const [minRating, setMinRating] = useState<number | null>(
    initialFilters?.minRating || null
  );
  const [reviewFormat, setReviewFormat] = useState<'video' | 'written' | null>(
    initialFilters?.reviewFormat || null
  );

  // Animation for sub-product section
  const subProductOpacity = useState(new Animated.Value(productType ? 1 : 0))[0];

  // Update animation when productType changes
  React.useEffect(() => {
    if (productType) {
      Animated.timing(subProductOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(subProductOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setSubProduct(null); // Clear sub-product when main category is cleared
    }
  }, [productType, subProductOpacity]);

  const handleProductTypeSelect = (type: string) => {
    if (productType === type) {
      setProductType(null);
    } else {
      setProductType(type);
      setSubProduct(null); // Reset sub-product when changing main category
    }
  };

  const handleSubProductSelect = (sub: string) => {
    if (subProduct === sub) {
      setSubProduct(null);
    } else {
      setSubProduct(sub);
    }
  };

  const handleStarPress = (rating: number) => {
    if (minRating === rating) {
      setMinRating(null);
    } else {
      setMinRating(rating);
    }
  };

  const handleReviewFormatSelect = (format: 'video' | 'written') => {
    if (reviewFormat === format) {
      setReviewFormat(null);
    } else {
      setReviewFormat(format);
    }
  };

  const handleReset = () => {
    setProductType(null);
    setSubProduct(null);
    setPriceMin('');
    setPriceMax('');
    setMinRating(null);
    setReviewFormat(null);
  };

  const handleApply = () => {
    const filters: FilterState = {
      productType,
      subProduct,
      priceRange: {
        min: priceMin ? parseFloat(priceMin) : null,
        max: priceMax ? parseFloat(priceMax) : null,
      },
      minRating,
      reviewFormat,
    };
    onApply(filters);
    onClose();
  };

  const subProducts = productType ? CATEGORY_MAPPING[productType] : [];

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer}>
      {/* Backdrop overlay */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Dropdown container */}
      <View style={styles.dropdownContainer}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Product Type Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Type</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipContainer}
                >
                  {PRODUCT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        productType === type && styles.chipSelected,
                      ]}
                      onPress={() => handleProductTypeSelect(type)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          productType === type && styles.chipTextSelected,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Sub-Product Section - Conditionally Rendered */}
              {productType && (
                <Animated.View
                  style={[
                    styles.section,
                    {
                      opacity: subProductOpacity,
                    },
                  ]}
                >
                  <Text style={styles.sectionTitle}>Sub-Product</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipContainer}
                  >
                    {subProducts.map((sub) => (
                      <TouchableOpacity
                        key={sub}
                        style={[
                          styles.chip,
                          subProduct === sub && styles.chipSelected,
                        ]}
                        onPress={() => handleSubProductSelect(sub)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            subProduct === sub && styles.chipTextSelected,
                          ]}
                        >
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}

              {/* Price Range Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Price Range</Text>
                <View style={styles.priceContainer}>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceLabel}>Min</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="$0"
                      placeholderTextColor="#9CA3AF"
                      value={priceMin}
                      onChangeText={setPriceMin}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.priceLabel}>Max</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="$9999"
                      placeholderTextColor="#9CA3AF"
                      value={priceMax}
                      onChangeText={setPriceMax}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Minimum Rating Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minimum Rating</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => handleStarPress(rating)}
                      style={styles.starButton}
                    >
                      <IconSymbol
                        name="star.fill"
                        size={32}
                        color={
                          minRating && rating <= minRating
                            ? '#FCD34D'
                            : '#E5E7EB'
                        }
                      />
                    </TouchableOpacity>
                  ))}
                  {minRating && (
                    <Text style={styles.ratingText}>
                      {minRating} {minRating === 1 ? 'Star' : 'Stars'} & Up
                    </Text>
                  )}
                </View>
              </View>

              {/* Review Format Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Review Format</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      styles.segmentButtonLeft,
                      reviewFormat === 'video' && styles.segmentButtonActive,
                    ]}
                    onPress={() => handleReviewFormatSelect('video')}
                  >
                    <Text
                      style={[
                        styles.segmentButtonText,
                        reviewFormat === 'video' &&
                          styles.segmentButtonTextActive,
                      ]}
                    >
                      Video Review
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentButton,
                      styles.segmentButtonRight,
                      reviewFormat === 'written' && styles.segmentButtonActive,
                    ]}
                    onPress={() => handleReviewFormatSelect('written')}
                  >
                    <Text
                      style={[
                        styles.segmentButtonText,
                        reviewFormat === 'written' &&
                          styles.segmentButtonTextActive,
                      ]}
                    >
                      Written Review
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <SafeAreaView style={styles.footer} edges={['bottom']}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApply}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 120, // Position below header (Discover title + subtitle + filter button)
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentButtonRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#111827',
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

