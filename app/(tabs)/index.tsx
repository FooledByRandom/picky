import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { ProductCard } from '@/components/ProductCard';
import { getFeedItems } from '@/lib/services/feed-items-service';
import { getRecentScans } from '@/lib/services/recent-scans-service';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedItem } from '@/types/reviewTypes';
import type { RecentScanRow } from '@/lib/database/supabase-types';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT / 3;

/**
 * Main home screen with collapsible header and scrollable product sections
 * Header collapses on scroll, revealing full content area
 */
export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const [recentScans, setRecentScans] = useState<RecentScanRow[]>([]);
  const [popularProducts, setPopularProducts] = useState<FeedItem[]>([]);
  const [emergingProducts, setEmergingProducts] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // Load recent scans
      const { data: scans } = await getRecentScans(10);
      if (scans) {
        setRecentScans(scans);
      }

      // Load popular products (high engagement score)
      const { data: popular } = await getFeedItems({}, 10);
      if (popular) {
        setPopularProducts(popular);
      }

      // Load emerging products (recently detected)
      const { data: emerging } = await getFeedItems({}, 10);
      if (emerging) {
        setEmergingProducts(emerging);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleCameraPress = async () => {
    try {
      // Request camera permission
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      
      if (!cameraPermission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Picky needs access to your camera to scan barcodes. Please enable camera access in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Request photo library permission
      const photoPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!photoPermission.granted) {
        Alert.alert(
          'Photo Library Permission Required',
          'Picky needs access to your photos to save and share product images. Please enable photo access in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Both permissions granted - navigate to camera screen
      router.push('/camera' as any);
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(
        'Error',
        'An error occurred while requesting permissions. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT },
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {loading || authLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          ) : (
            <>
              <ProductSection
                title="Recent Scans"
                products={recentScans.map(scan => ({
                  id: scan.id,
                  name: scan.product_name || 'Unknown Product',
                  barcode: scan.barcode,
                }))}
                emptyMessage="No recent scans. Tap the camera to scan a barcode!"
              />
              <ProductSection
                title="Popular Products"
                products={popularProducts.map(item => ({
                  id: item.id,
                  name: item.display.title,
                  imageUrl: item.display.mainImageUrl,
                }))}
                emptyMessage="No popular products yet. Check back soon!"
              />
              <ProductSection
                title="Emerging Products"
                products={emergingProducts.map(item => ({
                  id: item.id,
                  name: item.display.title,
                  imageUrl: item.display.mainImageUrl,
                }))}
                emptyMessage="No emerging products yet. Be the first to discover something new!"
              />
            </>
          )}
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.cameraButtonContainer,
            {
              opacity: headerOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleCameraPress}
            activeOpacity={0.7}
          >
            <Text style={styles.cameraEmoji}>📷</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

interface ProductSectionProps {
  title: string;
  products: Array<{ id: string; name: string; brand?: string; imageUrl?: string; barcode?: string }>;
  emptyMessage: string;
}

/**
 * Horizontal scrollable section for product lists
 * Shows empty state when no products are available
 */
function ProductSection({ title, products, emptyMessage }: ProductSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyMessage}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              imageUrl={product.imageUrl}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraEmoji: {
    fontSize: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
  },
  emptyState: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginHorizontal: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
});
