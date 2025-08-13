// app/favourite/[id].tsx
import React, { useMemo } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FavouriteView() {
  const { title = '', image = '', description = '' } = useLocalSearchParams<{
    title?: string;
    image?: string;
    description?: string;
  }>();

  // Resolve known bundled images by file name (no dynamic require)
  const source = useMemo(() => {
    const map: Record<string, any> = {
      'HomeKalinchowk.jpg': require('../assets/images/HomeKalinchowk.jpg'),
      'HomePokhara.jpg': require('../assets/images/HomePokhara.jpg'),
      'HomeBhaktapur.jpg': require('../assets/images/HomeBhaktapur.jpg'),
      'HomeBouddha.jpg': require('../assets/images/HomeBouddha.jpg'),
      'HomeNagarkot.jpg': require('../assets/images/HomeNagarkot.jpg'),
      'HomePashupatinath.jpg': require('../assets/images/HomePashupatinath.jpg'),
      'HomeZipline.jpg': require('../assets/images/HomeZipline.jpg'),
      'HomeBungee.jpg': require('../assets/images/HomeBungee.jpg'),
      'HomeSkydiving.jpg': require('../assets/images/HomeSkydiving.jpg'),
      'Homerafting.jpg': require('../assets/images/Homerafting.jpg'),
      'HomeLumbini.jpg': require('../assets/images/HomeLumbini.jpg'),
    };
    return map[String(image)] ?? null;
  }, [image]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Favourite – View',
          headerBackTitle: 'Back', // show “Back”, not a tab
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

        <Text style={styles.title}>{title || 'Untitled'}</Text>
        <Text style={styles.desc}>
          {description || 'No description provided.'}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 32 },
  hero: { width: '100%', height: 260 },
  heroEmpty: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
  title: { fontSize: 28, fontWeight: '800', marginTop: 16, marginHorizontal: 16, color: '#0f172a' },
  desc: { fontSize: 16, marginTop: 10, marginHorizontal: 16, color: '#334155', lineHeight: 22 },
});