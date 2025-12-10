import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Search / Feed screen
 * Displays search functionality and product feed
 */
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Animation values
  const searchBarPosition = useRef(new Animated.Value(insets.bottom + 16 + 50 + 8)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;
  
  // Calculate initial position: tab bar height (50) + tab bar bottom padding (16) + small gap (8)
  const initialSearchBarBottom = insets.bottom + 16 + 50 + 8;

  // Animate content when focus state changes
  useEffect(() => {
    if (isFocused) {
      // Move content to top immediately
      Animated.timing(contentPosition, {
        toValue: -150,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      // Return content to center
      Animated.timing(contentPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, contentPosition]);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{ translateY: contentPosition }],
          },
        ]}
      >
        <Text style={styles.title}>Search / Feed</Text>
        <Text style={styles.description}>
          Search for products by name, brand, UPC, or description. Browse the latest product feed.
        </Text>
      </Animated.View>
      
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
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
});

