// lib/favorites.ts
import {
    databases,
    IDs,
    Query,
    IDHelper,
    PermissionHelper,
    RoleHelper,
  } from '@/lib/appwrite';
  
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
  
  export async function listFavoritesByUser(userId: string): Promise<FavoriteDoc[]> {
    const res = await databases.listDocuments(
      IDs.databaseId,
      IDs.favoritesColId,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );
    return res.documents as unknown as FavoriteDoc[];
  }
  
  export async function getFavoriteByUserPlace(
    userId: string,
    placeId: string
  ): Promise<FavoriteDoc | null> {
    const res = await databases.listDocuments(
      IDs.databaseId,
      IDs.favoritesColId,
      [Query.equal('userId', userId), Query.equal('placeId', placeId), Query.limit(1)]
    );
    return (res.documents?.[0] as unknown as FavoriteDoc) ?? null;
  }
  
  export async function toggleFavoriteApi(params: {
    userId: string;
    placeId: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  }): Promise<FavoriteDoc> {
    const { userId, placeId, ...rest } = params;
  
    const perms = [
      PermissionHelper.read(RoleHelper.user(userId)),
      PermissionHelper.update(RoleHelper.user(userId)),
      PermissionHelper.delete(RoleHelper.user(userId)),
    ];
  
    const created = await databases.createDocument(
      IDs.databaseId,
      IDs.favoritesColId,
      IDHelper.unique(),
      { userId, placeId, ...rest }, 
      perms
    );
  
    return created as unknown as FavoriteDoc;
  }
  
  export async function removeFavoriteById(documentId: string) {
    return databases.deleteDocument(IDs.databaseId, IDs.favoritesColId, documentId);
  }