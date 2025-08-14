// app/(tabs)/_layout.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const tint = Colors[scheme ?? 'light'].tint;
  const inactive = '#9ca3af';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,
        // Keep the bar clickable on web and pinned to the bottom
        tabBarStyle:
          Platform.OS === 'web'
            ? { position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 10 }
            : undefined,
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol name={focused ? 'house.fill' : 'house'} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol name={focused ? 'heart.fill' : 'heart'} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="HiddenGem"
        options={{
          title: 'Hidden Gems',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="sparkles" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <IconSymbol name={focused ? 'person.fill' : 'person'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}