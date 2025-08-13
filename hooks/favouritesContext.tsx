// hooks/favoritesContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import useAppwriteUser from '@/hooks/useAppwriteUser';
import { databases } from '@/lib/appwrite';
import { IDs, subscribe } from '@/lib/appwrite';
import { Permission, Role, ID, Query, type Models } from 'react-native-appwrite';
import { FavoriteDoc } from '@/lib/favourites'; // your existing type
// ^ FavoriteDoc should include: $id, userId, placeId, title?, image?, description?

type Ctx = {
  ready: boolean;
  docs: FavoriteDoc[];
  favouriteIds: Set<string>;         // set of placeIds
  isFavourited: (placeId: string) => boolean;
  addFavourite: (doc: Omit<FavoriteDoc, '$id' | 'userId'> & { placeId: string }) => Promise<void>;
  removeFavouriteByDocId: (docId: string) => Promise<void>;
  removeFavouriteByPlaceId: (placeId: string) => Promise<void>;
  toggleFavourite: (payload: { placeId: string; title?: string; image?: string; description?: string }) => Promise<void>;
};

const FavoritesCtx = createContext<Ctx | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAppwriteUser();
  const [docs, setDocs] = useState<FavoriteDoc[]>([]);
  const [ready, setReady] = useState(false);

  // fetch current favourites
  const load = useCallback(async () => {
    if (!user) { setDocs([]); return; }
    const res = await databases.listDocuments<FavoriteDoc>(IDs.databaseId, IDs.favoritesColId, [
      Query.equal('userId', user.$id),
      Query.orderDesc('$createdAt'),
      Query.limit(200),
    ]);
    setDocs(res.documents);
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) { setDocs([]); setReady(true); return; }
    (async () => {
      await load();
      setReady(true);
    })();
  }, [loading, user, load]);

  // realtime: keep docs in sync across screens
  useEffect(() => {
    if (!user) return;
    const channel = `databases.${IDs.databaseId}.collections.${IDs.favoritesColId}.documents`;
    const unsub = subscribe(channel, (event) => {
      const payload = event?.payload as FavoriteDoc | undefined;
      if (!payload || payload.userId !== user.$id) return;

      const evs = (event?.events ?? []) as string[];
      if (evs.some(e => e.endsWith('.create'))) {
        setDocs(prev => (prev.find(d => d.$id === payload.$id) ? prev : [payload, ...prev]));
      } else if (evs.some(e => e.endsWith('.update'))) {
        setDocs(prev => prev.map(d => d.$id === payload.$id ? payload : d));
      } else if (evs.some(e => e.endsWith('.delete'))) {
        setDocs(prev => prev.filter(d => d.$id !== payload.$id));
      }
    });
    return () => { try { unsub(); } catch {} };
  }, [user]);

  // quick lookups
  const favouriteIds = useMemo(() => new Set(docs.map(d => String(d.placeId))), [docs]);
  const isFavourited = useCallback((placeId: string) => favouriteIds.has(String(placeId)), [favouriteIds]);

  // mutations
  const addFavourite = useCallback(async (doc: Omit<FavoriteDoc, '$id' | 'userId'> & { placeId: string }) => {
    if (!user) return;
    await databases.createDocument(IDs.databaseId, IDs.favoritesColId, ID.unique(), {
      ...doc,
      userId: user.$id,
      placeId: String(doc.placeId),
    } as any, [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]);
    // no manual setDocs needed: realtime will add it
  }, [user]);

  const removeFavouriteByDocId = useCallback(async (docId: string) => {
    await databases.deleteDocument(IDs.databaseId, IDs.favoritesColId, docId);
    // realtime will remove it
  }, []);

  const removeFavouriteByPlaceId = useCallback(async (placeId: string) => {
    if (!user) return;
    // find the document for this place
    const match = docs.find(d => String(d.placeId) === String(placeId));
    if (match) await removeFavouriteByDocId(match.$id);
  }, [docs, removeFavouriteByDocId, user]);

  const toggleFavourite = useCallback(async (payload: { placeId: string; title?: string; image?: string; description?: string }) => {
    const { placeId, title, image, description } = payload;
    if (isFavourited(placeId)) {
      await removeFavouriteByPlaceId(placeId);
    } else {
      await addFavourite({ placeId, title, image, description } as any);
    }
  }, [isFavourited, removeFavouriteByPlaceId, addFavourite]);

  const value = useMemo<Ctx>(() => ({
    ready,
    docs,
    favouriteIds,
    isFavourited,
    addFavourite,
    removeFavouriteByDocId,
    removeFavouriteByPlaceId,
    toggleFavourite,
  }), [ready, docs, favouriteIds, isFavourited, addFavourite, removeFavouriteByDocId, removeFavouriteByPlaceId, toggleFavourite]);

  return <FavoritesCtx.Provider value={value}>{children}</FavoritesCtx.Provider>;
};

export function useFavorites() {
  const ctx = useContext(FavoritesCtx);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}