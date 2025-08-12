// lib/favorites.ts
import { databases, IDs, Query, PermissionHelper, RoleHelper, IDHelper } from "./appwrite";

export type FavoriteDoc = {
  $id: string;
  userId: string;
  placeId: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  $createdAt: string;
  $updatedAt: string;
};

export async function listFavoritesByUser(userId: string) {
  const res = await databases.listDocuments(
    IDs.databaseId,
    IDs.favoritesColId,
    [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
  );
  return res.documents as unknown as FavoriteDoc[];
}

export async function addFavorite(params: {
  userId: string;
  placeId: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}) {
  const { userId, placeId, ...rest } = params;

  const perms = [
    PermissionHelper.read(RoleHelper.user(userId)),
    PermissionHelper.update(RoleHelper.user(userId)),
    PermissionHelper.delete(RoleHelper.user(userId)),
  ];

  return databases.createDocument(
    IDs.databaseId,
    IDs.favoritesColId,
    IDHelper.unique(),
    { userId, placeId, ...rest },
    perms
  );
}

export async function removeFavoriteById(documentId: string) {
  return databases.deleteDocument(IDs.databaseId, IDs.favoritesColId, documentId);
}