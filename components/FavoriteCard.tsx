// components/FavoriteCard.tsx
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export type FavoriteCardProps = {
  /** Title to show on the card */
  title?: string;
  /** Image key/uri. If undefined, we show the gray placeholder */
  image?: string;
  /** Tapped the whole card */
  onPress?: () => void;
  /** Tapped the Delete button */
  onDelete?: () => void;
};

export default function FavoriteCard({
  title,
  image,
  onPress,
  onDelete,
}: FavoriteCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.thumbWrap}>
        {image ? (
          // If you later store actual require() keys, replace this with the correct source
          <Image source={{ uri: image }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.placeholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {title || 'Untitled'}
        </Text>
      </View>

      <Pressable onPress={onDelete} style={styles.deleteBtn} hitSlop={8}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 6,
    padding: 12,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumbWrap: { marginRight: 12 },
  thumb: { width: 84, height: 84, borderRadius: 10 },
  placeholder: {
    backgroundColor: '#eef1f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: '#6b7280', fontSize: 12 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827' },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,0,0,0.08)',
    marginLeft: 10,
  },
  deleteText: { color: '#ef4444', fontWeight: '800' },
});