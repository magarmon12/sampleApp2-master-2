// app/(tabs)/_layout.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const tint = Colors[scheme ?? 'light'].tint;
  const inactive = '#9ca3af';

  return (
    <Tabs
      initialRouteName="homeScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      {/* 1) Home */}
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house.fill" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 2) Favourites */}
      <Tabs.Screen
        name="Favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="heart" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 3) Hidden Gems */}
      <Tabs.Screen
        name="hiddenGem"
        options={{
          title: 'HiddenGem',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="sparkles" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* 4) Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person.crop.circle" color={color} size={size ?? 22} />
          ),
        }}
      />

      {/* Discover removed intentionally. If a file still exists, keep it hidden: */}
      {/* <Tabs.Screen name="Discover" options={{ href: null }} /> */}
    </Tabs>
  );
}