// app/data/festivals.ts

export type Festival = {
    id: string;
    name: string;
    city: string;
    dateISO: string;       // canonical ISO date (YYYY-MM-DD)
    cover: any;            // require(...) image
    description: string;
    highlights?: string[]; // bullets shown on detail page
  };
  
  // Small helper to format a friendly date like "Oct 10, 2025"
  export function formatDisplayDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  // Sort helper: upcoming first
  export function byUpcoming(a: Festival, b: Festival): number {
    return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime();
  }
  
  /**
   * NOTE ON IMAGES:
   * Using existing images to avoid missing files.
   * Replace with your own in /assets/images/ if you like.
   */
  export const FESTIVALS: Festival[] = [
    {
      id: 'dashain',
      name: 'Dashain',
      city: 'Kathmandu',
      dateISO: '2025-10-10',
      cover: require('../../assets/images/HomePashupatinath.jpg'),
      description:
        'Dashain is Nepal’s biggest Hindu festival, celebrating the victory of good over evil. Families gather for tika and blessings.',
      highlights: ['Family gatherings', 'Tika & blessings', 'Kites & fairs'],
    },
    {
      id: 'tihar',
      name: 'Tihar',
      city: 'Bhaktapur',
      dateISO: '2025-11-03',
      cover: require('../../assets/images/HomeBhaktapur.jpg'),
      description:
        'Known as the festival of lights, Tihar honors animals like crows, dogs, cows, and celebrates wealth and prosperity.',
      highlights: ['Diyo lamps', 'Deusi-Bhailo songs', 'Rangoli art'],
    },
    {
      id: 'holi',
      name: 'Holi',
      city: 'Pokhara',
      dateISO: '2025-03-22',
      cover: require('../../assets/images/HomePokhara.jpg'),
      description:
        'Holi is the vibrant festival of colors marking the arrival of spring with music, dancing, and color powder.',
      highlights: ['Color throws', 'Live music', 'Street parties'],
    },
    {
      id: 'losar',
      name: 'Losar',
      city: 'Boudha',
      dateISO: '2025-02-09',
      cover: require('../../assets/images/HomeBouddha.jpg'),
      description:
        'Tibetan New Year celebrated with prayers, mask dances, and traditional foods around Boudhanath and monasteries.',
      highlights: ['Monastery dances', 'Butter lamps', 'Traditional foods'],
    },
  ];