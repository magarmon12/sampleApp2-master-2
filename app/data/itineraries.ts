// app/data/itineraries.ts
export type Activity = { time?: string; title: string; notes?: string; };
export type DayPlan = { day: number; title: string; activities: Activity[]; };
export type Itinerary = {
  id: string;
  title: string;
  days: number;
  startCity: string;
  theme: 'Culture' | 'Adventure' | 'Nature';
  highlights: string[];
  cover: any; // static require()
  dayPlans: DayPlan[];
};

// reuse the same images to avoid typos
const IMG = {
  HomeBhaktapur: require('../../assets/images/HomeBhaktapur.jpg'),
  HomePokhara:   require('../../assets/images/HomePokhara.jpg'),
  HomeKalinchowk:require('../../assets/images/HomeKalinchowk.jpg'),
};

const ITINERARIES: Itinerary[] = [
  {
    id: 'ktm3',
    title: '3‑Day Kathmandu Heritage',
    days: 3,
    startCity: 'Kathmandu',
    theme: 'Culture',
    highlights: ['Pashupatinath', 'Boudhanath', 'Bhaktapur Durbar'],
    cover: IMG.HomeBhaktapur,
    dayPlans: [
      { day: 1, title: 'Pashupatinath & Boudha', activities: [
        { time: '09:00', title: 'Pashupatinath Temple', notes: 'Morning rituals' },
        { time: '12:30', title: 'Lunch in Pashupati area' },
        { time: '14:00', title: 'Boudhanath Stupa', notes: 'Kora walk + butter tea' },
      ]},
      { day: 2, title: 'Patan Heritage', activities: [
        { time: '10:00', title: 'Patan Durbar Square' },
        { time: '13:00', title: 'Museum & Newa cuisine' },
      ]},
      { day: 3, title: 'Bhaktapur Day Trip', activities: [
        { time: '09:30', title: 'Bhaktapur Durbar Square' },
        { time: '12:00', title: 'Juju dhau tasting' },
        { time: '15:00', title: 'Pottery square' },
      ]},
    ],
  },
  {
    id: 'pkr5',
    title: '5‑Day Pokhara & Annapurna',
    days: 5,
    startCity: 'Pokhara',
    theme: 'Nature',
    highlights: ['Phewa Lake', 'Sarangkot Sunrise', 'Australian Camp'],
    cover: IMG.HomePokhara,
    dayPlans: [
      { day: 1, title: 'Lakeside & Boating', activities: [{ title: 'Phewa Lake boat ride' }] },
      { day: 2, title: 'Sarangkot Sunrise', activities: [{ time: '05:00', title: 'Viewpoint' }] },
      { day: 3, title: 'Day Hike to Australian Camp', activities: [{ title: 'Kande–Australian Camp' }] },
      { day: 4, title: 'Caves & Falls', activities: [{ title: 'Gupteshwor, Davis Falls' }] },
      { day: 5, title: 'Free day', activities: [{ title: 'Paragliding optional' }] },
    ],
  },
  {
    id: 'east4',
    title: '4‑Day Kalinchowk & Dolakha',
    days: 4,
    startCity: 'Charikot',
    theme: 'Adventure',
    highlights: ['Kalinchowk', 'Snow Walks', 'Local Temples'],
    cover: IMG.HomeKalinchowk,
    dayPlans: [
      { day: 1, title: 'Drive to Charikot', activities: [{ title: 'Road trip' }] },
      { day: 2, title: 'Kalinchowk Bhagwati', activities: [{ title: 'Cable car & summit' }] },
      { day: 3, title: 'Dolakha Bhimsen', activities: [{ title: 'Temple visit' }] },
      { day: 4, title: 'Return', activities: [{ title: 'Drive back' }] },
    ],
  },
];

export const getItineraries = (): Itinerary[] => ITINERARIES;
export const getItineraryById = (id: string): Itinerary | undefined =>
  ITINERARIES.find(i => i.id === id);