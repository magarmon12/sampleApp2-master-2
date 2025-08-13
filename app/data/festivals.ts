// app/data/festivals.ts
import { ImageSourcePropType } from 'react-native';

export type Festival = {
  id: string;
  name: string;
  /** ISO date string, e.g. "2025-10-02" */
  dateISO: string;
  city: string;
  cover: ImageSourcePropType;
  description?: string;
  highlights?: string[];
};

/**
 * Your images live at project root: /assets/images
 * This file is at:                 /app/data/festivals.ts
 * Correct relative path is:        ../../assets/images/...
 * 
 * NOTE: Metro requires static literal paths inside require(...).
 * Do NOT build paths dynamically.
 */

// Reuse images you already have as placeholders until you add festival images.
const images = {
  // guaranteed to exist from your screenshot
  placeholder: require('../../assets/images/react-logo.png'),
  kalinchowk: require('../../assets/images/kalinchowk.jpg'),
  palpa: require('../../assets/images/palpa.jpg'),
  rara: require('../../assets/images/rara.jpg'),
} as const;

export function formatDisplayDate(iso: string, withYear = false) {
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return iso;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

/** Sort helper: soonest-first */
export function byUpcoming(a: Festival, b: Festival) {
  return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
}

/**
 * Map your festivals to existing images for now.
 * When you add actual files (e.g., dashain.png, tihar.png),
 * change cover to: require('../../assets/images/festivals/dashain.png')
 * after creating /assets/images/festivals/ and adding the PNGs.
 */
export const FESTIVALS: Festival[] = [
  {
    id: 'dashain',
    name: 'Dashain',
    dateISO: '2025-10-02',
    city: 'Kathmandu',
    cover: images.kalinchowk, // TEMP: replace with real dashain image when available
    description:
      'The biggest Hindu festival in Nepal celebrating the victory of good over evil with family gatherings, tika, and feasts.',
    highlights: ['Family tika', 'Kites', 'Goat & buffalo offerings'],
  },
  {
    id: 'tihar',
    name: 'Tihar (Deepawali)',
    dateISO: '2025-10-22',
    city: 'Bhaktapur',
    cover: images.palpa, // TEMP
    description:
      'Festival of lights honoring crows, dogs, cows, and siblings, with oil lamps and rangoli decorating homes and streets.',
    highlights: ['Bhai Tika', 'Rangoli', 'Deusi–Bhailo'],
  },
  {
    id: 'holi',
    name: 'Holi',
    dateISO: '2026-03-03',
    city: 'Pokhara',
    cover: images.rara, // TEMP
    description:
      'Color-splash festival marking the arrival of spring—music, water guns, and vibrant powder in the streets.',
    highlights: ['Color play', 'Music & dance', 'Street parties'],
  },
  {
    id: 'losar',
    name: 'Losar',
    dateISO: '2026-02-18',
    city: 'Boudha',
    cover: images.placeholder, // TEMP
    description:
      'Tibetan New Year celebrated with prayers, butter lamps, and traditional dances around Boudhanath Stupa.',
    highlights: ['Butter lamps', 'Masked dances', 'Monastic rituals'],
  },
].sort(byUpcoming);

/** Convenience getter used by details page */
export function getFestival(id?: string) {
  if (!id) return undefined;
  return FESTIVALS.find((f) => f.id === id);
}
// app/data/festivals.ts
export function findFestival(key?: string) {
  if (!key) return undefined;
  const k = decodeURIComponent(String(key)).trim().toLowerCase();
  return FESTIVALS.find(
    f => f.id.toLowerCase() === k || f.name.toLowerCase() === k
  );
}