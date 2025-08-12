// app/data/festivals.ts

export type RNImage = number | string;

export type Festival = {
  id: string;
  name: string;
  city: string;
  dateISO: string; // YYYY-MM-DD
  cover: RNImage;  // require(...) result
  description: string;
  highlights?: string[];
};

// Pretty date like "Oct 10, 2025"
export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Sort helper: earliest first
export function byUpcoming(a: Festival, b: Festival): number {
  return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
}

// NOTE: paths are from app/data → ../assets/images/...
export const FESTIVALS: Festival[] = [
  {
    id: "dashain",
    name: "Dashain",
    city: "Kathmandu",
    dateISO: "2025-10-10",
    cover: require("../assets/images/HomePashupatinath.jpg"),
    description:
      "Dashain is Nepal’s biggest Hindu festival, celebrating the victory of good over evil. Families gather for tika and blessings.",
    highlights: ["Family gatherings", "Tika & blessings", "Kites & fairs"],
  },
  {
    id: "tihar",
    name: "Tihar",
    city: "Bhaktapur",
    dateISO: "2025-11-03",
    cover: require("../assets/images/HomeBhaktapur.jpg"),
    description:
      "Known as the festival of lights, Tihar honors animals like crows, dogs, cows, and celebrates wealth and prosperity.",
    highlights: ["Diyo lamps", "Deusi‑Bhailo songs", "Rangoli art"],
  },
  {
    id: "holi",
    name: "Holi",
    city: "Pokhara",
    dateISO: "2025-03-22",
    cover: require("../assets/images/HomePokhara.jpg"),
    description:
      "Holi is the vibrant festival of colors marking the arrival of spring with music, dancing, and color powder.",
    highlights: ["Color throws", "Live music", "Street parties"],
  },
  {
    id: "losar",
    name: "Losar",
    city: "Boudha",
    dateISO: "2025-02-09",
    cover: require("../assets/images/HomeBouddha.jpg"),
    description:
      "Tibetan New Year celebrated with prayers, mask dances, and traditional foods around Boudhanath and monasteries.",
    highlights: ["Monastery dances", "Butter lamps", "Traditional foods"],
  },
];

// Helpers
export function listFestivals(): Festival[] {
  return [...FESTIVALS].sort(byUpcoming);
}
export function getFestivalById(id: string): Festival | undefined {
  return FESTIVALS.find((f) => f.id === id);
}
export function upcomingFestivals(from: Date = new Date(), limit = 5): Festival[] {
  const today = from.toISOString().slice(0, 10);
  return FESTIVALS.filter((f) => f.dateISO >= today).sort(byUpcoming).slice(0, limit);
}