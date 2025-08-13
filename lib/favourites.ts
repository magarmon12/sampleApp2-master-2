// lib/favorites.ts
import { databases, IDs, ID, Query, Models } from '@/lib/appwrite';

export type FavoriteDoc = Models.Document & {
  userId: string;
  itemId: string;          // your domain id (e.g. festival id)
  title?: string;
  image?: string;          // remote URL or image key, up to you
  description?: string;
  createdAt: string;       // ISO string
};

export async function listFavoritesByUser(userId: string) {
  const res = await databases.listDocuments<FavoriteDoc>(
    IDs.databaseId,
    IDs.favoritesColId,
    [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ]
  );
  return res.documents;
}

export async function addFavorite(input: Omit<FavoriteDoc, keyof Models.Document>) {
  return await databases.createDocument<FavoriteDoc>(
    IDs.databaseId,
    IDs.favoritesColId,
    ID.unique(),
    input
  );
}

export async function removeFavoriteById(documentId: string) {
  return await databases.deleteDocument(
    IDs.databaseId,
    IDs.favoritesColId,
    documentId
  );
}