// app/(tabs)/Favourites.tsx
import FavoriteCard from '@/components/FavoriteCard'; // default export
import useAppwriteUser from '@/hooks/useAppwriteUser';
import { IDs, subscribe } from '@/lib/appwrite';
import { FavoriteDoc, listFavoritesByUser, removeFavoriteById } from '@/lib/favourites';
import { Href, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function FavouritesScreen() {
  const router = useRouter();
  const { user, loading } = useAppwriteUser();

  const [items, setItems] = useState<FavoriteDoc[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const unsubRef = useRef<null | (() => void)>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const docs = await listFavoritesByUser(user.$id);
    setItems(docs);
  }, [user]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setItems([]);
      setInitialLoading(false);
      return;
    }

    (async () => {
      await load();
      setInitialLoading(false);
    })();
  }, [loading, user, load]);

  useEffect(() => {
    if (!user) return;

    const channel = `databases.${IDs.databaseId}.collections.${IDs.favoritesColId}.documents`;

    const unsub = subscribe(channel, (event) => {
      const doc = event?.payload as FavoriteDoc | undefined;
      if (!doc || doc.userId !== user.$id) return;

      const evs = (event?.events ?? []) as string[];

      if (evs.some((e) => e.endsWith('.create'))) {
        setItems((prev) => (prev.find((d) => d.$id === doc.$id) ? prev : [doc, ...prev]));
      } else if (evs.some((e) => e.endsWith('.update'))) {
        setItems((prev) => prev.map((d) => (d.$id === doc.$id ? doc : d)));
      } else if (evs.some((e) => e.endsWith('.delete'))) {
        setItems((prev) => prev.filter((d) => d.$id !== doc.$id));
      }
    });

    unsubRef.current = () => unsub();
    return () => {
      try {
        unsubRef.current?.();
      } catch {}
    };
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [user, load]);

  const confirmDelete = useCallback(
    (docId: string, title?: string) => {
      Alert.alert(
        'Remove favourite',
        `Delete "${title || 'this place'}" from your favourites?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const prev = items;
              setItems((cur) => cur.filter((i) => i.$id !== docId)); // optimistic
              try {
                await removeFavoriteById(docId);
                Alert.alert('Removed', 'Favourite deleted.');
              } catch (e: any) {
                setItems(prev); // rollback
                Alert.alert('Error', e?.message ?? 'Could not delete favourite.');
              }
            },
          },
        ],
      );
    },
    [items],
  );

  const openDetails = (item: FavoriteDoc) => {
  const href = {
    pathname: '/favourite/[id]',
    params: {
      id: String(item.$id),
      title: item.title ?? '',
      image: item.image || item.placeId, // fallback to placeId if image is missing
      description: '', // leave empty for now
    },
  } as unknown as Href;

  router.push(href);
};

  if (loading || initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading favourites…</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Please log in to see your favourites.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.h1}>Your Favourites</Text>

      {items.length === 0 ? (
        <View style={[styles.center, { flex: 1 }]}>
          <Text>No favourites yet.</Text>
          <Text style={{ color: '#777' }}>Add some places to see them here.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => openDetails(item)}>
             <FavoriteCard
  title={item.title ?? ''}
  image={item.image ?? ''}
  description={item.description ?? ''}
  onDelete={() => confirmDelete(item.$id, item.title ?? '')}
/>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  h1: { fontSize: 22, fontWeight: '800', marginHorizontal: 16, marginVertical: 8 },
  center: { alignItems: 'center', justifyContent: 'center', padding: 16 },
});
