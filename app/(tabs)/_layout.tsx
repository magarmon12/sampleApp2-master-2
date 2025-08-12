import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Wrapper for icon animation
  const AnimatedIcon = ({ name, focused, color }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.spring(scaleValue, {
        toValue: focused ? 1.3 : 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }, [focused]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Ionicons name={name} size={focused ? 30 : 26} color={color} />
      </Animated.View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          Colors[colorScheme ?? 'light'].tint || '#007AFF', // ✅ High contrast
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderTopWidth: 0.5,
            borderTopColor: '#E5E5E7',
            height: 88,
            paddingBottom: 20,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          android: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#E1E1E1',
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            elevation: 8,
          },
          default: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#E1E1E1',
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Favourites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'heart' : 'heart-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="HiddenGem"
        options={{
          title: 'Hidden Gem',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'star' : 'star-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              name={focused ? 'person' : 'person-outline'}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
