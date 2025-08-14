// app/location-details.tsx
import React from 'react';
import { getPlaceById } from '@/app/data/places';
import {
  SafeAreaView, ScrollView, View, Text, Image, StyleSheet, Platform, Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function LocationDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  
const place = id ? getPlaceById(id) : null;

  if (!place) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* Simple top bar (web/back) */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={18} color="#111827" />
          </Pressable>
          <Text style={styles.topTitle}>location-details</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.page}>
          {/* HERO with controlled height */}
          <View style={styles.heroWrap}>
            <Image source={place.image} style={styles.heroImg} resizeMode="cover" />
          </View>

          <Text style={styles.title}>{place.title}</Text>

          {!!place.location && (
            <View style={styles.locRow}>
              <IconSymbol name="mappin.and.ellipse" size={14} color="#6b7280" />
              <Text style={styles.locText}>{place.location}</Text>
            </View>
          )}

          {!!place.description && <Text style={styles.desc}>{place.description}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  scrollBody: { paddingBottom: 32 },

  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: Platform.OS === 'web' ? StyleSheet.hairlineWidth : 0,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topTitle: { flex: 1, textAlign: 'center', color: '#6b7280', fontSize: 13, fontWeight: '600' },

  page: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // The key bits to keep the image “not huge” on web:
  heroWrap: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    aspectRatio: 16 / 9,         // keeps height controlled
    maxHeight: 360,              // hard cap for wide screens
    alignSelf: 'center',
  },
  heroImg: { width: '100%', height: '100%' },

  title: { marginTop: 12, fontSize: 24, fontWeight: '800', color: '#111827' },
  locRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  locText: { color: '#6b7280', fontSize: 14, fontWeight: '600' },
  desc: { marginTop: 12, color: '#374151', fontSize: 15, lineHeight: 22 },
});