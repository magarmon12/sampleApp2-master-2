// lib/favorites.ts
import { Databases, ID, Permission, Role, Query } from 'react-native-appwrite';
import { databases, IDs } from './appwrite';

export type FavoriteDoc = {
  $id: string;
  userId: string;
  placeId: string;
  title?: string;        // lower-case
  description?: string;  // lower-case
  image?: string;        // lower-case file name or URL
};

export async function listFavoritesByUser(userId: string): Promise<FavoriteDoc[]> {
  const res = await databases.listDocuments(
    IDs.databaseId,
    IDs.favoritesColId,
    [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
  );
  return res.documents as unknown as FavoriteDoc[];
}

export async function getFavoriteByUserPlace(userId: string, placeId: string) {
  const res = await databases.listDocuments(
    IDs.databaseId,
    IDs.favoritesColId,
    [Query.equal('userId', userId), Query.equal('placeId', placeId), Query.limit(1)]
  );
  return (res.documents[0] as unknown as FavoriteDoc) ?? null;
}

export async function removeFavoriteById(id: string) {
  return databases.deleteDocument(IDs.databaseId, IDs.favoritesColId, id);
}

/**
 * Creates a favorite when it doesn't exist. If one already exists, it just returns it.
 * Only uses lower-case keys.
 */
export async function toggleFavoriteApi(input: {
  userId: string;
  placeId: string;
  title?: string;
  description?: string;
  image?: string;
}): Promise<FavoriteDoc> {
  const existing = await getFavoriteByUserPlace(input.userId, input.placeId);
  if (existing) return existing;

  const created = await databases.createDocument(
    IDs.databaseId,
    IDs.favoritesColId,
    ID.unique(),
    {
      userId: input.userId,
      placeId: input.placeId,
      title: input.title ?? '',
      description: input.description ?? '',
      image: input.image ?? '',
    },
    [
      Permission.read(Role.user(input.userId)),
      Permission.update(Role.user(input.userId)),
      Permission.delete(Role.user(input.userId)),
      Permission.read(Role.any()), // optional: let others read
    ]
  );

  return created as unknown as FavoriteDoc;
}