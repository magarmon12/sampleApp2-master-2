// lib/imageMap.ts
import { ImageSourcePropType } from 'react-native';

/**
 * Map your known place IDs to bundled images.
 * Keys should match the values you save in Appwrite (e.g., placeId or filename).
 */
const BY_ID: Record<string, ImageSourcePropType> = {
  // --- Top places
  kalinchowk: require('../assets/images/HomeKalinchowk.jpg'),
  pokhara: require('../assets/images/HomePokhara.jpg'),
  nagarkot: require('../assets/images/HomeNagarkot.jpg'),

  // --- Adventure
  bungee: require('../assets/images/HomeBungee.jpg'),
  zipline: require('../assets/images/HomeZipline.jpg'),
  skydiving: require('../assets/images/HomeSkydiving.jpg'),
  rafting: require('../assets/images/Homerafting.jpg'),

  // --- Culture
  pashupatinath: require('../assets/images/HomePashupatinath.jpg'),
  bouddha: require('../assets/images/HomeBouddha.jpg'),
  bhaktapur: require('../assets/images/HomeBhaktapur.jpg'),
  lumbini: require('../assets/images/HomeLumbini.jpg'),
};

/**
 * Map exact bundled filenames to require(). Use this if you store filenames
 * (e.g. "HomeKalinchowk.jpg") in Appwrite.
 */
const BY_FILENAME: Record<string, ImageSourcePropType> = {
  'HomeKalinchowk.jpg': require('../assets/images/HomeKalinchowk.jpg'),
  'HomePokhara.jpg': require('../assets/images/HomePokhara.jpg'),
  'HomeNagarkot.jpg': require('../assets/images/HomeNagarkot.jpg'),
  'HomeBungee.jpg': require('../assets/images/HomeBungee.jpg'),
  'HomeZipline.jpg': require('../assets/images/HomeZipline.jpg'),
  'HomeSkydiving.jpg': require('../assets/images/HomeSkydiving.jpg'),
  'Homerafting.jpg': require('../assets/images/Homerafting.jpg'),
  'HomePashupatinath.jpg': require('../assets/images/HomePashupatinath.jpg'),
  'HomeBouddha.jpg': require('../assets/images/HomeBouddha.jpg'),
  'HomeBhaktapur.jpg': require('../assets/images/HomeBhaktapur.jpg'),
  'HomeLumbini.jpg': require('../assets/images/HomeLumbini.jpg'),
};

/** Optional fallback (local placeholder). Comment out if you don’t want it. */
const FALLBACK: ImageSourcePropType | null = null;
// const FALLBACK: ImageSourcePropType = require('../assets/images/placeholder.png');

/**
 * Resolve a value (id, filename, or URL) to a valid RN image source.
 * - URL -> { uri }
 * - known id -> require(...)
 * - known filename -> require(...)
 * - otherwise -> null / FALLBACK
 */
export function resolveImage(value?: string | string[] | null): ImageSourcePropType | null {
  if (!value) return FALLBACK;

  // If Expo Router param array, take the first.
  const key = Array.isArray(value) ? value[0] : value;

  // URL (http/https)
  if (/^https?:\/\//i.test(key)) {
    return { uri: key };
  }

  // Exact filename match
  if (Object.prototype.hasOwnProperty.call(BY_FILENAME, key)) {
    return BY_FILENAME[key];
  }

  // ID match (e.g. "kalinchowk")
  if (Object.prototype.hasOwnProperty.call(BY_ID, key)) {
    return BY_ID[key];
  }

  return FALLBACK;
}

/** If you explicitly know you’re resolving by placeId */
export function getImageByPlaceId(placeId?: string | null): ImageSourcePropType | null {
  if (!placeId) return FALLBACK;
  const key = String(placeId);
  return BY_ID[key] ?? FALLBACK;
}

/** If you explicitly know you’re resolving by a saved filename (e.g., "HomeX.jpg") */
export function getImageByFilename(name?: string | null): ImageSourcePropType | null {
  if (!name) return FALLBACK;
  const key = String(name);
  return BY_FILENAME[key] ?? FALLBACK;
}

export default resolveImage;