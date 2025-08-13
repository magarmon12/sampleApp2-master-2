// lib/appwrite.ts
import { Platform } from 'react-native';
import {
  Account,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
} from 'react-native-appwrite';

export const IDs = {
  endpoint:   'https://fra.cloud.appwrite.io/v1',
  projectId:  '686723a7001216b697e7',          // your project
  // Expo Go bundle IDs so Appwrite can authorize the device
  platform: Platform.select({
    ios: 'host.exp.Exponent',
    android: 'host.exp.exponent',
    default: 'testapp',
  }) as string,

  // ✅ Your real database/collection IDs
  databaseId:      '689612dd001e9a0100b3',
  favoritesColId:  '6896130500095d165ed8',
};

const client = new Client()
  .setEndpoint(IDs.endpoint)
  .setProject(IDs.projectId)
  .setPlatform(IDs.platform);

export const account   = new Account(client);
export const databases = new Databases(client);

// Realtime subscribe helper (RN SDK exposes subscribe on client)
export function subscribe(
  channels: string | string[],
  cb: (event: any) => void
) {
  const unsub = client.subscribe(channels, cb);
  return () => unsub();
}

// Re‑exports so you can `import { Query, IDHelper, ... } from 'lib/appwrite'`
export const IDHelper         = ID;
export const PermissionHelper = Permission;
export const RoleHelper       = Role;
export { Query };

export default client;