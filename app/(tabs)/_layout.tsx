// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { account } from "@/lib/appwrite";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    account
      .get()
      .then(() => mounted && setChecking(false))
      .catch(() => {
        if (!mounted) return;
        setChecking(false);
        router.replace("/loginPage");
      });
    return () => { mounted = false; };
  }, [router]);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? "light"].tint} />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="homeScreen"  // must match: app/(tabs)/homeScreen.tsx
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="homeScreen" // file: app/(tabs)/homeScreen.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Favourites" // file: app/(tabs)/Favourites.tsx (note the capital F)
        options={{
          title: "Favourites",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="underrated" // file: app/(tabs)/underrated.tsx
        options={{
          title: "Gems",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="location.north.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile" // file: app/(tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}