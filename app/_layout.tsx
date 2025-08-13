// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContext } from '@/contexts/AuthContext';
import { UserProvider } from '@/hooks/userContext';
import { account } from '@/lib/appwrite';

// NEW: shared favourites state (make sure hooks/favoritesContext.tsx exists)
import { FavoritesProvider } from '@/hooks/favouritesContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContext.Provider value={account}>
        <UserProvider>
          <FavoritesProvider>
            <Stack initialRouteName="(tabs)">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="loginPage" options={{ title: 'Sign In' }} />
              <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </FavoritesProvider>
        </UserProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}