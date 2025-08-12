// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';
// import { AuthContext } from '@/contexts/AuthContext';
// import { account } from '@/lib/appwrite';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) return null;

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AuthContext.Provider value={account}>
//         {/* TESTING: boot straight into tabs */}
//         <Stack initialRouteName="(tabs)">
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           {/* Keep others available for later manual testing */}
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="loginPage" options={{ title: 'Sign In' }} />
//           <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//         <StatusBar style="auto" />
//       </AuthContext.Provider>
//     </ThemeProvider>
//   );
// }

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContext } from '@/contexts/AuthContext';
import { UserProvider } from '../hooks/userContext'; 
import { account } from '@/lib/appwrite';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContext.Provider value={account}>
        <UserProvider>
          <Stack initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="loginPage" options={{ title: 'Sign In' }} />
            <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </UserProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}