import React, { useMemo } from 'react';
import {
  Image, ImageSourcePropType, Pressable, StyleSheet, Text, View,
} from 'react-native';

type Props = {
  title: string;
  description?: string;
  /** Can be a URL, a local filename like "HomeKalinchowk.jpg", or a placeId like "kalinchowk" */
  image?: string;
  onDelete?: () => void;
  onPress?: () => void;
};

function resolveImageSource(image?: string, title?: string): ImageSourcePropType | null {
  // 1) Remote URL / data / file URI
  if (image && /^(https?:|data:|file:)/i.test(image)) {
    return { uri: image };
  }

  // 2) Local bundled filenames (Metro needs static requires)
  const fileMap: Record<string, ImageSourcePropType> = {
    'HomeBhaktapur.jpg': require('../assets/images/HomeBhaktapur.jpg'),
    'HomeBouddha.jpg': require('../assets/images/HomeBouddha.jpg'),
    'HomeBungee.jpg': require('../assets/images/HomeBungee.jpg'),
    'HomeKalinchowk.jpg': require('../assets/images/HomeKalinchowk.jpg'),
    'HomeLumbini.jpg': require('../assets/images/HomeLumbini.jpg'),
    'HomeNagarkot.jpg': require('../assets/images/HomeNagarkot.jpg'),
    'HomePashupatinath.jpg': require('../assets/images/HomePashupatinath.jpg'),
    'HomePokhara.jpg': require('../assets/images/HomePokhara.jpg'),
    'Homerafting.jpg': require('../assets/images/Homerafting.jpg'),
    'HomeSkydiving.jpg': require('../assets/images/HomeSkydiving.jpg'),
    'HomeZipline.jpg': require('../assets/images/HomeZipline.jpg'),
  };

  // If a filename (or a full path) was provided, try basename lookup
  if (image) {
    const base = decodeURIComponent(image).split('/').pop() || image;
    if (fileMap[base]) return fileMap[base];
  }

  // 3) Place ID → filename mapping (handles image prop like "kalinchowk", "pashupatinath")
  const idToFile: Record<string, string> = {
    kalinchowk: 'HomeKalinchowk.jpg',
    pokhara: 'HomePokhara.jpg',
    nagarkot: 'HomeNagarkot.jpg',
    bungee: 'HomeBungee.jpg',
    zipline: 'HomeZipline.jpg',
    skydiving: 'HomeSkydiving.jpg',
    rafting: 'Homerafting.jpg',
    pashupatinath: 'HomePashupatinath.jpg',
    bouddha: 'HomeBouddha.jpg',
    bhaktapur: 'HomeBhaktapur.jpg',
    lumbini: 'HomeLumbini.jpg',
  };
  if (image) {
    const idKey = image.trim().toLowerCase();
    const byId = idToFile[idKey];
    if (byId && fileMap[byId]) return fileMap[byId];
  }

  // 4) Title → filename mapping (for titles like "Pashupatinath Temple")
  const titleKey = (title ?? '').toLowerCase();
  const titleToIdGuess: Array<[string, string]> = [
    ['kalinchowk', 'HomeKalinchowk.jpg'],
    ['pokhara', 'HomePokhara.jpg'],
    ['bhaktapur', 'HomeBhaktapur.jpg'],
    ['bouddha', 'HomeBouddha.jpg'],
    ['nagarkot', 'HomeNagarkot.jpg'],
    ['pashupatinath', 'HomePashupatinath.jpg'],
    ['lumbini', 'HomeLumbini.jpg'],
    ['rafting', 'Homerafting.jpg'],
    ['skydiving', 'HomeSkydiving.jpg'],
    ['zipline', 'HomeZipline.jpg'],
  ];
  for (const [needle, file] of titleToIdGuess) {
    if (titleKey.includes(needle) && fileMap[file]) return fileMap[file];
  }

  // 5) No match → no image (card shows placeholder)
  return null;
}

export default function FavoriteCard({ title, description, image, onDelete, onPress }: Props) {
  const source = useMemo(() => resolveImageSource(image, title), [image, title]);

  const CardWrapper = onPress ? Pressable : View;
  return (
    <CardWrapper onPress={onPress} style={s.card}>
      {source ? (
        <Image source={source} style={s.thumb} />
      ) : (
        <View style={[s.thumb, s.thumbPlaceholder]}>
          <Text style={s.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={s.info}>
        <Text style={s.title}>{title || 'Untitled'}</Text>
        {!!description && <Text numberOfLines={2} style={s.desc}>{description}</Text>}
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={10} style={s.delete}>
          <Text style={s.deleteText}>Delete</Text>
        </Pressable>
      )}
    </CardWrapper>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: { width: 88, height: 64, borderRadius: 10, backgroundColor: '#eee' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#9ca3af', fontSize: 12 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  desc: { marginTop: 4, color: '#475569' },
  delete: { paddingHorizontal: 6, paddingVertical: 4 },
  deleteText: { color: '#ef4444', fontWeight: '600' },
});