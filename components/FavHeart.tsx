// components/FavHeart.tsx
import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useFavorites } from '@/hooks/favouritesContext';

export default function FavHeart({ placeId, title, image, description, style }:{
  placeId: string;
  title?: string;
  image?: string;
  description?: string;
  style?: ViewStyle;
}) {
  const { isFavourited, toggleFavourite } = useFavorites();
  const filled = isFavourited(placeId);

  const onPress = async () => {
    await toggleFavourite({ placeId, title, image, description });
  };

  return (
    <Pressable onPress={onPress} hitSlop={8} style={[styles.btn, style]}>
      <Text style={[styles.icon, filled && styles.iconFilled]}>{filled ? '♥' : '♡'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 8, paddingVertical: 4 },
  icon: { fontSize: 20, color: '#334155' },
  iconFilled: { color: '#ef4444' },
});