// lib/appwrite.ts
import {
  Client,
  Account,
  Databases,
  ID,
  Permission,
  Role,
  Query,
} from 'react-native-appwrite';

// --- Fill these with your actual IDs ---
export const IDs = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '686723a7001216b697e7',
  platform: 'testapp',              // any string; use your bundleId in prod
  databaseId: 'YOUR_DB_ID',
  favoritesColId: 'YOUR_FAVORITES_COLLECTION_ID',
};

const client = new Client()
  .setEndpoint(IDs.endpoint)
  .setProject(IDs.projectId)
  .setPlatform(IDs.platform);        // IMPORTANT for RN

export const account   = new Account(client);
export const databases = new Databases(client);

// Realtime: subscribe using the client (RN SDK has no Realtime class)
export function subscribe(
  channels: string | string[],
  cb: (event: any) => void
) {
  const unsub = client.subscribe(channels, cb);
  return () => unsub(); // return unsubscribe fn
}

// Re‑exports so other files can import from one place
export const IDHelper         = ID;
export const PermissionHelper = Permission;
export const RoleHelper       = Role;
export { Query }; // export Query directly too (so `import { Query }` works)

export default client;