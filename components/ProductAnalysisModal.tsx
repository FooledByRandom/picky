/**
 * ProductAnalysisModal component for displaying AI-analyzed product information
 * Shows product image, name, review summary, and source citations from Gemini research
 */
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Product } from '@/lib/database/types';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProductAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  productData: Product | null;
  loading?: boolean;
  error?: string | null;
}

/**
 * ProductAnalysisModal displays AI-generated product analysis
 * Includes product image, clean name, review summary, and clickable source citations
 */
export function ProductAnalysisModal({
  visible,
  onClose,
  productData,
  loading = false,
  error = null,
}: ProductAnalysisModalProps) {
  const handleSourcePress = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('Failed to open URL:', err);
    }
  };

  const handleViewProduct = () => {
    if (productData?.id) {
      router.push(`/product/${productData.id}` as any);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Product Analysis</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#111827" />
                <Text style={styles.loadingText}>Analyzing product...</Text>
                <Text style={styles.loadingSubtext}>
                  Researching reviews across the web
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.triangle" size={48} color="#EF4444" />
                <Text style={styles.errorTitle}>Analysis Failed</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={onClose}
                >
                  <Text style={styles.retryButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}

            {productData && !loading && !error && (
              <>
                {/* Product Image */}
                {productData.imageUrl && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: productData.imageUrl }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Product Name */}
                <View style={styles.nameContainer}>
                  <Text style={styles.productName}>
                    {productData.cleanName || productData.productName}
                  </Text>
                  {productData.cleanName && productData.cleanName !== productData.productName && (
                    <Text style={styles.originalName}>{productData.productName}</Text>
                  )}
                </View>

                {/* Review Summary */}
                {productData.reviewSummary && (
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                      <IconSymbol name="sparkles" size={20} color="#111827" />
                      <Text style={styles.summaryTitle}>AI Review Summary</Text>
                    </View>
                    <Text style={styles.summaryText}>
                      {productData.reviewSummary}
                    </Text>
                  </View>
                )}

                {/* Source Citations */}
                {productData.reviewLinks && productData.reviewLinks.length > 0 && (
                  <View style={styles.sourcesContainer}>
                    <View style={styles.sourcesHeader}>
                      <IconSymbol name="link" size={20} color="#111827" />
                      <Text style={styles.sourcesTitle}>
                        Sources ({productData.reviewLinks.length})
                      </Text>
                    </View>
                    {productData.reviewLinks.map((link, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.sourceLink}
                        onPress={() => handleSourcePress(link.url)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.sourceLinkContent}>
                          <Text style={styles.sourceLinkTitle} numberOfLines={2}>
                            {link.title}
                          </Text>
                          <Text style={styles.sourceLinkUrl} numberOfLines={1}>
                            {new URL(link.url).hostname}
                          </Text>
                        </View>
                        <IconSymbol
                          name="arrow.up.right.square"
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Empty State for Sources */}
                {(!productData.reviewLinks || productData.reviewLinks.length === 0) && (
                  <View style={styles.emptySourcesContainer}>
                    <Text style={styles.emptySourcesText}>
                      No review sources found
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          {productData && !loading && !error && (
            <SafeAreaView style={styles.footer} edges={['bottom']}>
              <TouchableOpacity
                style={styles.viewProductButton}
                onPress={handleViewProduct}
                activeOpacity={0.7}
              >
                <Text style={styles.viewProductButtonText}>
                  View Full Product
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
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
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  originalName: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  sourcesContainer: {
    marginBottom: 24,
  },
  sourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sourcesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceLinkContent: {
    flex: 1,
    marginRight: 12,
  },
  sourceLinkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  sourceLinkUrl: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptySourcesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptySourcesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  viewProductButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProductButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

