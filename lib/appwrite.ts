// lib/appwrite.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  Account,
  Client,
  Databases
} from 'react-native-appwrite';

// ----- platform selection (unchanged) -----
const ownership = Constants.appOwnership; // 'expo' | 'standalone' | 'guest'
const iosBundle  = Constants.expoConfig?.ios?.bundleIdentifier;
const androidPkg = Constants.expoConfig?.android?.package;

function resolvePlatformId() {
  if (Platform.OS === 'ios') return ownership === 'expo' ? 'host.exp.Exponent' : (iosBundle ?? 'com.example.app');
  if (Platform.OS === 'android') return ownership === 'expo' ? 'host.exp.exponent' : (androidPkg ?? 'com.example.app');
  return 'com.example.app';
}

export const IDs = {
  endpoint:  'https://fra.cloud.appwrite.io/v1',
  projectId: '686723a7001216b697e7',
  databaseId:     '689612dd001e9a0100b3',
  favoritesColId: '6896130500095d165ed8',
};

const client = new Client()
  .setEndpoint(IDs.endpoint)
  .setProject(IDs.projectId)
  .setPlatform(resolvePlatformId());

export const account   = new Account(client);
export const databases = new Databases(client);

// optional helper
export function subscribe(channels: string | string[], cb: (e: any) => void) {
  const unsub = client.subscribe(channels, cb);
  return () => unsub();
}

// ---- RE‑EXPORT SDK NAMES EXACTLY AS YOUR APP EXPECTS ----
export { ID, Permission, Query, Role } from 'react-native-appwrite';
export type { Models } from 'react-native-appwrite';

// keep default if you want
export default client;