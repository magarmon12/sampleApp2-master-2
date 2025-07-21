// app/tabs/homeScreen.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const handleVisit = () => {
    const url = 'https://example.com';
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={require('../../assets/images/kalinchowk.jpg')} // correct relative path from app/tabs
          style={[styles.cover, { height: screenHeight * 0.4 }]
          }
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.headline}>Welcome to Our App!</Text>
            <Text style={styles.subheading}>Discover amazing features</Text>
            <Pressable style={styles.button} onPress={handleVisit}>
              <Text style={styles.buttonText}>Visit Our Site</Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          {/* Additional content goes here */}
          <Text style={styles.contentText}>Here is some more content below the cover image.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  cover: {
    width: '100%',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  content: {
    padding: 24,
  },
  contentText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
});