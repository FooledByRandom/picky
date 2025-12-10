import { Tabs } from 'expo-router';
import React from 'react';
import { FloatingTabBar } from '@/components/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Main',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search / Feed',
        }}
      />
      <Tabs.Screen
        name="favorited"
        options={{
          title: 'Favorited',
        }}
      />
      <Tabs.Screen
        name="add-review"
        options={{
          title: 'Add Review',
        }}
      />
    </Tabs>
  );
}
