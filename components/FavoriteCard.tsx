// components/FavoriteCard.tsx
import React, { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getImage } from '@/lib/imageMap';         // single correct import
import { getPlaceById } from '@/app/data/places';   // to fill missing fields from local data

type Props = {
  title: string;
  description?: string | null;
  /** Can be a URL, a local key/filename, or a place id like "kalinchowk" */
  image?: string | null;
  /** If provided, we’ll use local data as fallback for image/description */
  placeId?: string;
  onDelete?: () => void;
  onPress?: () => void;
};

function resolveSource(
  input: string | null | undefined,
  titleGuess: string | undefined,
  placeImage: any | undefined,
  placeId: string | undefined
): ImageSourcePropType | undefined {
  // 1) Remote URL / data / file URI
  if (input && /^(https?:|data:|file:)/i.test(input)) {
    return { uri: input };
  }

  // 2) Try central image map directly (keys like "HomePokhara" or basenames like "HomePokhara.jpg")
  if (input) {
    const direct = getImage(input);
    if (direct) return direct;

    const base = decodeURIComponent(input).split('/').pop()!;
    const baseNoExt = base.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const fromBase = getImage(base) || getImage(baseNoExt);
    if (fromBase) return fromBase;
  }

  // 3) If the matched Place has a bundled image (static require), use it
  if (placeImage) return placeImage;

  // 4) Title / placeId keyword guesses → explicit keys in imageMap
  const tokenMap: Record<string, string> = {
    // place ids / tokens → imageMap key
    pokhara: 'HomePokhara',
    kalinchowk: 'HomeKalinchowk',
    bhaktapur: 'HomeBhaktapur',
    bouddha: 'HomeBouddha',
    nagarkot: 'HomeNagarkot',
    pashupatinath: 'HomePashupatinath',
    lumbini: 'HomeLumbini',
    janakpur: 'HomeJanakpur',
    bandipur: 'HomeBandipur',
    kirtipur: 'HomeKirtipur',
    gorkha: 'HomeGorkha',
    rara: 'HomeRara',
    muktinath: 'HomeMuktinath',
    palanchowk: 'HomePalanchowk',
    langtang: 'HomeLangtang',
    canyoning: 'HomeCanyoning',
    bungee: 'HomeBungee',
    rockclimbing: 'HomeRockClimbing',
    mountainbiking: 'HomeMountainBiking',
    skydiving: 'HomeSkydiving',
    ultraflight: 'HomeUltraFlight',
    rafting: 'Homerafting',
    thimi: 'HomeThimi',
    tansen: 'HomeTansen',
    tangboche: 'HomeTangboche',
    ghandruk: 'HomeGhandruk',
    ilam: 'Homellam',
    paragliding: 'HoeParagliding', // actual filename in your repo
  };

  const tryTokens = (txt?: string) => {
    if (!txt) return undefined;
    const t = txt.toLowerCase();
    for (const token of Object.keys(tokenMap)) {
      if (t.includes(token)) {
        const hit = getImage(tokenMap[token]);
        if (hit) return hit;
      }
    }
  };

  const byId = tryTokens(placeId);
  if (byId) return byId;

  const byTitle = tryTokens(titleGuess);
  if (byTitle) return byTitle;

  // 5) Nothing found
  return undefined;
}

export default function FavoriteCard({
  title,
  description,
  image,
  placeId,
  onDelete,
  onPress,
}: Props) {
  // Fallback to local places data if DB doc misses fields
  const place = placeId ? getPlaceById(placeId) : undefined;

  const finalTitle = title || place?.title || 'Untitled';
  const finalDesc = (description ?? undefined) || place?.description;

  const source = useMemo(
    () => resolveSource(image, finalTitle, place?.image, placeId),
    [image, finalTitle, place?.image, placeId]
  );

  const Wrapper: any = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={s.card}>
      {source ? (
        <Image source={source} style={s.thumb} />
      ) : (
        <View style={[s.thumb, s.thumbPlaceholder]}>
          <Text style={s.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>
          {finalTitle}
        </Text>
        {finalDesc ? (
          <Text numberOfLines={2} style={s.desc}>
            {finalDesc}
          </Text>
        ) : null}
      </View>

      {onDelete && (
        <Pressable onPress={onDelete} hitSlop={10} style={s.delete}>
          <Text style={s.deleteText}>Delete</Text>
        </Pressable>
      )}
    </Wrapper>
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