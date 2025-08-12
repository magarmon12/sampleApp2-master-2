// app/(tabs)/Profile.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { account } from '@/lib/appwrite'; // adjust path if different
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSignOut = async () => {
    try {
      await account.deleteSession('current'); // logout from Appwrite
      router.replace('/loginPage'); // redirect to login page
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Add your existing profile content here */}

      <Pressable
        style={[styles.signOutButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111827',
  },
  signOutButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});