// app/favourite/[id].tsx
import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { resolveImage } from '@/lib/imageMap';

export default function FavouriteView() {
  // We expect these to be passed from the list screen via router params
  const { title = '', image = '', description = '' } = useLocalSearchParams<{
    title?: string;
    image?: string;        // can be placeId, filename, or URL
    description?: string;
  }>();

  const source = useMemo(() => resolveImage(image), [image]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favourite – View',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView contentContainerStyle={styles.body}>
        {source ? (
          <Image source={source} style={styles.hero} />
        ) : (
          <View style={[styles.hero, styles.heroEmpty]}>
            <Text style={{ color: '#6b7280' }}>No image</Text>
          </View>
        )}

        <Text style={styles.title}>{String(title) || 'Untitled'}</Text>
        <Text style={styles.desc}>
          {String(description) || 'No description provided.'}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 32 },
  hero: { width: '100%', height: 260, backgroundColor: '#e5e7eb' },
  heroEmpty: { alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 16,
    marginHorizontal: 16,
    color: '#0f172a',
  },
  desc: {
    fontSize: 16,
    marginTop: 10,
    marginHorizontal: 16,
    color: '#334155',
    lineHeight: 22,
  },
});