/**
 * Collapsible section component for product detail screen
 * Reusable component for Reviews, Price, and Similar Products sections
 */
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ProductCollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ProductCollapsible({ title, children, defaultOpen = false }: ProductCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [animation] = useState(new Animated.Value(defaultOpen ? 1 : 0));

  const toggle = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const maxHeightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // Adjust based on content
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <IconSymbol
            name="chevron.right"
            size={20}
            color="#6B7280"
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: maxHeightInterpolate,
            opacity: animation,
          },
        ]}
      >
        {isOpen && <View style={styles.contentInner}>{children}</View>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    overflow: 'hidden',
  },
  contentInner: {
    paddingTop: 8,
  },
});

