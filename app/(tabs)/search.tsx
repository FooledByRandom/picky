import { FeedCard } from '@/components/FeedCard';
import { FilterModal } from '@/components/FilterModal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { getFeedItems } from '@/lib/services/feed-items-service';
import { getFilters, saveFilters } from '@/lib/services/filter-storage';
import { saveSearch } from '@/lib/services/searches-service';
import { FilterState } from '@/types/filterTypes';
import type { FeedItem } from '@/types/reviewTypes';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Keyboard, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Search / Feed screen
 * Displays search functionality and product feed
 */
export default function SearchScreen() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    productType: null,
    subProduct: null,
    priceRange: { min: null, max: null },
    minRating: null,
    reviewFormat: null,
  });
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  // Animation values
  const searchBarPosition = useRef(new Animated.Value(insets.bottom + 16 + 50 + 8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  
  // Calculate initial position: tab bar height (50) + tab bar bottom padding (16) + small gap (8)
  const initialSearchBarBottom = insets.bottom + 16 + 50 + 8;

  // Animate title and description when focus state changes
  useEffect(() => {
    if (isFocused) {
      // Show title and description
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide title and description
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(descriptionOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, titleOpacity, descriptionOpacity]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        if (isFocused) {
          // Move search bar above keyboard
          Animated.timing(searchBarPosition, {
            toValue: e.endCoordinates.height + 8,
            duration: 250,
            useNativeDriver: false,
          }).start();
        }
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Return search bar to original position when keyboard hides
        Animated.timing(searchBarPosition, {
          toValue: initialSearchBarBottom,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [isFocused, initialSearchBarBottom, searchBarPosition]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOpenFilters = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilters = () => {
    setIsFilterModalVisible(false);
  };

  // Load filters from AsyncStorage on mount
  useEffect(() => {
    const loadFilters = async () => {
      const { data } = await getFilters();
      if (data) {
        setActiveFilters(data);
      }
    };
    loadFilters();
  }, []);

  // Load feed items
  useEffect(() => {
    const loadFeedItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const filters = {
        minRating: activeFilters.minRating ?? undefined,
        priceRange: activeFilters.priceRange,
        reviewFormat: activeFilters.reviewFormat ?? undefined,
      };
      const { data, error } = await getFeedItems(filters);
      if (error) {
        console.error('Error loading feed items:', error);
      } else {
        setFeedItems(data);
      }
      setLoading(false);
    };

    loadFeedItems();
  }, [user, activeFilters]);

  const handleApplyFilters = async (filters: FilterState) => {
    setActiveFilters(filters);
    await saveFilters(filters);
  };

  const handleResetFilters = async () => {
    const defaultFilters: FilterState = {
      productType: null,
      subProduct: null,
      priceRange: { min: null, max: null },
      minRating: null,
      reviewFormat: null,
    };
    setActiveFilters(defaultFilters);
    await saveFilters(defaultFilters);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;

    // Save search to history
    await saveSearch(searchQuery, activeFilters, feedItems.length);

    // Reload feed items with search query (if needed)
    // For now, we'll just save the search
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => (
    <FeedCard item={item} />
  );

  const renderListHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Discover</Text>
      <Text style={styles.headerSubtitle}>
        Fresh drops from Amazon, TikTok & YouTube
      </Text>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={handleOpenFilters}
        activeOpacity={0.7}
      >
        <IconSymbol
          name="slider.horizontal.3"
          size={18}
          color="#111827"
          style={styles.filterIcon}
        />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Title and Description - Only visible when search is focused */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: titleOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.title}>Search / Feed</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.descriptionContainer,
            {
              opacity: descriptionOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.description}>
            Search for products by name, brand, UPC, or description. Browse the latest product feed.
          </Text>
        </Animated.View>

        {/* Feed List */}
        {loading || authLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        ) : (
          <FlatList
            data={feedItems}
            keyExtractor={(item) => item.id}
            renderItem={renderFeedItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No feed items found</Text>
              </View>
            }
          />
        )}
        
        {/* Search Bar - Fixed at bottom */}
        <Animated.View 
          style={[
            styles.searchBarContainer,
            { 
              bottom: searchBarPosition,
            },
          ]}
        >
          <View style={styles.searchBar}>
            <IconSymbol
              name="magnifyingglass"
              size={18}
              color="#6B7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmitEditing={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Filter Modal - Rendered outside SafeAreaView for proper overlay */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    zIndex: 10,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
    backgroundColor: '#F9FAFB',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for search bar
  },
  row: {
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800', // Extra bold
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  searchBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    padding: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

