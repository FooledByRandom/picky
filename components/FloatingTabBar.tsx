import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 50;
const HORIZONTAL_PADDING = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2);

/**
 * Custom floating bottom navigation bar with segmented control design
 * Features stark black/white contrast and clean typography
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'house.fill';
      case 'search':
        return 'magnifyingglass';
      case 'favorited':
        return 'heart.fill';
      case 'add-review':
        return 'plus.circle.fill';
      default:
        return 'circle';
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Main';
      case 'search':
        return 'Search / Feed';
      case 'favorited':
        return 'Favorited';
      case 'add-review':
        return 'Add Review';
      default:
        return routeName;
    }
  };

  const totalTabs = state.routes.length;
  // Calculate available width for tabs (accounting for container padding and margins)
  const containerPadding = 3; // tabBar padding
  const tabMargin = 1.5; // margin between tabs
  const totalMargins = (totalTabs - 1) * (tabMargin * 2); // margins between tabs
  const availableWidth = TAB_BAR_WIDTH - (containerPadding * 2) - totalMargins;
  
  // Fixed width for active tab to show full text
  const ACTIVE_TAB_MIN_WIDTH = 130;
  // Remaining width for inactive tabs
  const remainingWidth = availableWidth - ACTIVE_TAB_MIN_WIDTH;
  const inactiveTabWidth = remainingWidth / (totalTabs - 1);
  
  // Ensure inactive tabs have minimum width for icon
  const MIN_INACTIVE_WIDTH = 44;
  const actualInactiveWidth = Math.max(MIN_INACTIVE_WIDTH, inactiveTabWidth);
  
  // If inactive tabs need more space, adjust active tab width
  const totalInactiveWidth = actualInactiveWidth * (totalTabs - 1);
  const activeTabWidth = Math.max(ACTIVE_TAB_MIN_WIDTH, availableWidth - totalInactiveWidth);

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 16,
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || getTabLabel(route.name)}
              onPress={() => handleTabPress(route, isFocused)}
              style={[
                styles.tab,
                isFocused && styles.tabActive,
                {
                  width: isFocused ? activeTabWidth : actualInactiveWidth,
                  minWidth: isFocused ? activeTabWidth : actualInactiveWidth,
                },
              ]}
              activeOpacity={0.7}
            >
              <IconSymbol
                name={getIconName(route.name)}
                size={20}
                color={isFocused ? '#FFFFFF' : '#000000'}
                style={[
                  styles.icon,
                  !isFocused && styles.iconOnly,
                ]}
              />
              {isFocused && (
                <Text
                  style={styles.labelActive}
                  numberOfLines={1}
                >
                  {getTabLabel(route.name)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: HORIZONTAL_PADDING,
    right: HORIZONTAL_PADDING,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#000000',
    padding: 3,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingHorizontal: 12,
    marginHorizontal: 1.5,
    minHeight: 44,
  },
  tabActive: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 6,
  },
  iconOnly: {
    marginRight: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.1,
  },
  labelActive: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: -0.1,
    marginLeft: 4,
    flexShrink: 0,
  },
});

