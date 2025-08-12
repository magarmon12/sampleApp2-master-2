// app/(tabs)/favourite.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';

import FavoriteCard from 'components/FavoriteCard';
import { useAppwriteUser } from '@/hooks/useAppwriteUser';
import {
  listFavoritesByUser,
  removeFavoriteById,
  type FavoriteDoc,
} from '@/lib/favorites';
import { IDs, subscribe } from '@/lib/appwrite';

export default function FavouriteScreen() {
  const { user, loading } = useAppwriteUser();

  const [items, setItems] = useState<FavoriteDoc[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const unsubRef = useRef<null | (() => void)>(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!user) return;
    const docs = await listFavoritesByUser(user.$id);
    if (!mountedRef.current) return;
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
      try {
        await load();
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'Could not load favourites.');
      } finally {
        if (mountedRef.current) setInitialLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
      try {
        unsubRef.current?.();
      } catch {}
    };
  }, [loading, user, load]);

  useEffect(() => {
    if (!user || initialLoading) return;

    try {
      unsubRef.current?.();
    } catch {}

    const channel = `databases.${IDs.databaseId}.collections.${IDs.favoritesColId}.documents`;

    const off = subscribe(channel, (event: any) => {
      const doc = event?.payload as FavoriteDoc | undefined;
      if (!doc || doc.userId !== user.$id) return;

      const evts: string[] = event?.events ?? [];
      if (evts.some((e) => e.endsWith('.create'))) {
        setItems((prev) => (prev.find((d) => d.$id === doc.$id) ? prev : [doc, ...prev]));
      } else if (evts.some((e) => e.endsWith('.update'))) {
        setItems((prev) => prev.map((d) => (d.$id === doc.$id ? doc : d)));
      } else if (evts.some((e) => e.endsWith('.delete'))) {
        setItems((prev) => prev.filter((d) => d.$id !== doc.$id));
      }
    });

    unsubRef.current = off;
    return () => {
      try {
        off?.();
      } catch {}
    };
  }, [user, initialLoading]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      await load();
    } catch (e: any) {
      Alert.alert('Refresh failed', e?.message ?? 'Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [user, load]);

  const handleDelete = useCallback(
    async (docId: string) => {
      const prev = items;
      setItems((cur) => cur.filter((i) => i.$id !== docId));
      try {
        await removeFavoriteById(docId);
      } catch {
        setItems(prev);
        Alert.alert('Delete failed', 'Could not remove favorite. Please try again.');
      }
    },
    [items]
  );

  if (loading || initialLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Loading favourites…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text>Please log in to see your favourites.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.h1}>Your Favourites</Text>

        {items.length === 0 ? (
          <View style={styles.center}>
            <Text>No favourites yet.</Text>
            <Text style={{ color: '#777' }}>Add some places to see them here.</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
              <FavoriteCard item={item} onDelete={handleDelete} />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  container: { flex: 1, paddingTop: 8 },
  h1: { fontSize: 22, fontWeight: '800', marginHorizontal: 16, marginBottom: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
});