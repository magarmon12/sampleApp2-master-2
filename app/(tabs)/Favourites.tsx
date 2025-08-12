// app/(tabs)/favourite.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, ActivityIndicator } from "react-native";
import FavoriteCard from "components/FavoriteCard";
import { useAppwriteUser } from "hooks/useAppwriteUser";
import { FavoriteDoc, listFavoritesByUser, removeFavoriteById } from "lib/favorites";
import { IDs, subscribe } from "lib/appwrite";

export default function FavouriteScreen() {
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

  // Initial fetch
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

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribe(
      `databases.${IDs.databaseId}.collections.${IDs.favoritesColId}.documents`,
      (event: any) => {
        const doc = event.payload as FavoriteDoc;
        if (!doc || doc.userId !== user.$id) return;

        if (event.events.some((e: string) => e.endsWith(".create"))) {
          setItems(prev => (prev.find(d => d.$id === doc.$id) ? prev : [doc, ...prev]));
        } else if (event.events.some((e: string) => e.endsWith(".update"))) {
          setItems(prev => prev.map(d => (d.$id === doc.$id ? doc : d)));
        } else if (event.events.some((e: string) => e.endsWith(".delete"))) {
          setItems(prev => prev.filter(d => d.$id !== doc.$id));
        }
      }
    );

    unsubRef.current = unsubscribe;
    return () => { try { unsubRef.current?.(); } catch {} };
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [user, load]);

  const handleDelete = useCallback(async (docId: string) => {
    const prev = items;
    setItems(cur => cur.filter(i => i.$id !== docId)); // optimistic UI
    try {
      await removeFavoriteById(docId);
      // realtime ".delete" will also arrive
    } catch {
      setItems(prev); // rollback if API fails
    }
  }, [items]);

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
    <View style={styles.container}>
      <Text style={styles.h1}>Your Favourites</Text>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text>No favourites yet.</Text>
          <Text style={{ color: "#777" }}>Add some places to see them here.</Text>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", paddingTop: 8 },
  h1: { fontSize: 22, fontWeight: "800", marginHorizontal: 16, marginBottom: 4 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
});