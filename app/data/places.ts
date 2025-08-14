// app/data/places.ts
export type Place = {
  id: string;
  title: string;
  image: any;            // static require()
  location?: string;
  description: string;
};

// Central image map.
// Make sure these files exist under /assets/images with EXACT names & extensions.
const IMG = {
  HomePokhara:       require('../../assets/images/HomePokhara.jpg'),
  HomeNagarkot:      require('../../assets/images/HomeNagarkot.jpg'),
  HomeBandipur:      require('../../assets/images/HomeBandipur.jpg'),
  HomeBhaktapur:     require('../../assets/images/HomeBhaktapur.jpg'),
  HomePatan:         require('../../assets/images/HomePatan.jpg'),
  HomeRara:          require('../../assets/images/HomeRara.jpg'),
  HomeGhandruk:      require('../../assets/images/HomeGhandruk.jpg'),
  HomeJanakpur:      require('../../assets/images/HomeJanakpur.jpg'),
  HomeLumbini:       require('../../assets/images/HomeLumbini.jpg'),
  HomeBouddha:       require('../../assets/images/HomeBouddha.jpg'),
  HomeKirtipur:      require('../../assets/images/HomeKirtipur.jpg'),
  HomeGorkha:        require('../../assets/images/HomeGorkha.jpg'),

  // Adventure
  HomeParagliding:   require('../../assets/images/HoeParagliding.jpg'), // fixed from "HoeParagliding.jpg"
  HomeBungee:        require('../../assets/images/HomeBungee.jpg'),
  Homerafting:       require('../../assets/images/Homerafting.jpg'),
  HomeRockClimbing:  require('../../assets/images/HomeRockClimbing.jpg'),
  HomeMountainBiking:require('../../assets/images/HomeMountainBiking.jpg'),
  HomeSkydiving:     require('../../assets/images/HomeSkydiving.jpg'),
  HomeUltraFlight:   require('../../assets/images/HomeUltraFlight.jpg'),
  HomeCanyoning:     require('../../assets/images/HomeCanyoning.jpg'),
  HomeTrekking:      require('../../assets/images/HomeTrekking.jpg'),
  HomeLangtang:      require('../../assets/images/HomeLangtang.jpg'),
  HomeTangboche:     require('../../assets/images/HomeTangboche.jpg'),

  // Culture extras
  HomeBhaktapurArt:  require('../../assets/images/HomeBhaktapurArt.jpg'),
  HomeThimi:         require('../../assets/images/HomeThimi.jpg'),
  HomeTansen:        require('../../assets/images/HomeTansen.jpg'),
  HomePalanchowk:    require('../../assets/images/HomePalanchowk .jpg'), // fixed extra space
  HomeMuktinath:     require('../../assets/images/HomeMuktinath.jpg'),

  // Sometimes you used a second Pashupatinath file name – keep both pointing to same if needed
  HomePashupatinath: require('../../assets/images/HomePashupatinath.jpg'),
};

// -------- TOP PLACES (12) --------
export const TOP_PLACES: Place[] = [
  {
    id: 'pokhara',
    title: 'Pokhara Lakeside',
    image: IMG.HomePokhara,
    location: 'Pokhara',
    description:
      'Nepal’s chill capital of cafés and canoeing. Walk Lakeside at sunset, rent a boat on Phewa, and watch the Annapurnas glow above town. It’s the perfect base for day trips and gentle adventures.',
  },
  {
    id: 'nagarkot',
    title: 'Nagarkot Sunrise',
    image: IMG.HomeNagarkot,
    location: 'Nagarkot',
    description:
      'A classic hill station known for dramatic dawn skies. Wake up early for pastel horizons and a silhouette of Himalayan giants. Easy village walks and cozy tea houses make it a great quick escape.',
  },
  {
    id: 'bandipur',
    title: 'Bandipur Newari Town',
    image: IMG.HomeBandipur,
    location: 'Tanahun',
    description:
      'Pedestrian stone lanes, carved windows, and slow evenings under string lights. Bandipur blends heritage charm with ridgeline views, offering a peaceful pause between Kathmandu and Pokhara.',
  },
  {
    id: 'bhaktapur',
    title: 'Bhaktapur Durbar Heritage',
    image: IMG.HomeBhaktapur,
    location: 'Bhaktapur',
    description:
      'Red‑brick courtyards and towering temples set the scene for pottery, woodcraft, and juju dhau (king curd). The city is a living museum where every alley reveals another photo‑worthy corner.',
  },
  {
    id: 'patan',
    title: 'Patan (Lalitpur) Squares',
    image: IMG.HomePatan,
    location: 'Lalitpur',
    description:
      'Golden roofs, quiet cloisters, and world‑class metalwork studios. Explore Patan Durbar Square and hidden bahas (courtyards), then linger at rooftop cafés watching the city’s rhythm below.',
  },
  {
    id: 'rara',
    title: 'Rara Lake',
    image: IMG.HomeRara,
    location: 'Mugu',
    description:
      'Crystal‑blue waters ringed by pine forests at Nepal’s largest lake. Days feel unhurried here: walk lakeside trails, picnic on meadows, and watch the light shift across an ever‑changing mirror.',
  },
  {
    id: 'ghandruk',
    title: 'Ghandruk Village',
    image: IMG.HomeGhandruk,
    location: 'Kaski',
    description:
      'A stone‑built Gurung village looking straight at Annapurna South. Short trails, warm homestays, and clear mountain mornings make Ghandruk a favorite first taste of Himalayan life.',
  },
  {
    id: 'janakpur',
    title: 'Janakpur Mithila Heritage',
    image: IMG.HomeJanakpur,
    location: 'Dhanusha',
    description:
      'Vibrant temples and Maithili murals in the birthplace of Sita. Visit Janaki Mandir, sample mithila sweets, and explore a city where devotion and color fill every festival season.',
  },
  {
    id: 'lumbini',
    title: 'Lumbini – Birthplace of Buddha',
    image: IMG.HomeLumbini,
    location: 'Rupandehi',
    description:
      'Calm gardens and monasteries from around the world surround the Maya Devi Temple. Lumbini invites slow walks, quiet reflection, and sunrise cycles through a spiritual landscape.',
  },
  {
    id: 'bouddha',
    title: 'Bouddhanath Stupa',
    image: IMG.HomeBouddha,
    location: 'Kathmandu',
    description:
      'Prayer wheels hum, butter lamps flicker, and the stupa watches with serene eyes. Join the evening kora, sip butter tea on a terrace, and soak up the meditative energy of Boudha.',
  },
  {
    id: 'kirtipur',
    title: 'Kirtipur Hill Town',
    image: IMG.HomeKirtipur,
    location: 'Kathmandu Valley',
    description:
      'Stepped lanes, ancient shrines, and valley views without the crowds. Try local Newari cuisine, wander small squares, and catch golden hour from the ridge top.',
  },
  {
    id: 'gorkha',
    title: 'Gorkha Palace Ridge',
    image: IMG.HomeGorkha,
    location: 'Gorkha',
    description:
      'A hilltop palace tied to the origins of modern Nepal. Climb the staircase for sweeping peaks and history in one frame, then explore peaceful villages on the ridge.',
  },
];

// -------- ADVENTURE (12) --------
export const ADVENTURE: Place[] = [
  {
    id: 'paragliding',
    title: 'Paragliding Over Phewa',
    image: IMG.HomeParagliding,
    location: 'Pokhara',
    description:
      'Run, lift, and suddenly you’re floating above a glittering lake. Tandem flights glide past green hills with the Annapurnas in the distance. Smooth thermals make it beginner‑friendly and breathtaking.',
  },
  {
    id: 'bungee',
    title: 'Bungee Jumping',
    image: IMG.HomeBungee,
    location: 'Kushma',
    description:
      'Step onto a high suspension bridge, listen to the roar of the river below, and make the leap. A heart‑pounding freefall with epic canyon scenery—equal parts fear and pure exhilaration.',
  },
  {
    id: 'rafting',
    title: 'White‑Water Rafting',
    image: IMG.Homerafting,
    location: 'Trishuli',
    description:
      'Crashing waves, quick paddles, and riverside campfires under a sky of stars. Trishuli’s playful rapids are perfect for a day trip, with bigger water available in seasonal runs.',
  },
  {
    id: 'rockclimb',
    title: 'Rock Climbing',
    image: IMG.HomeRockClimbing,
    location: 'Nagarjun / Hattiban',
    description:
      'Limestone crags close to Kathmandu offer well‑bolted routes and shady belay spots. New climbers can learn the basics, while veterans test crimps with valley views as the backdrop.',
  },
  {
    id: 'mountainbiking',
    title: 'Mountain Biking',
    image: IMG.HomeMountainBiking,
    location: 'Kathmandu & Pokhara',
    description:
      'Flowy singletrack, farm roads, and ridge‑line panoramas. From mellow lake loops to technical descents, Nepal’s trails turn every ride into a mini‑expedition with chai stops.',
  },
  {
    id: 'skydiving',
    title: 'Skydiving Above the Hills',
    image: IMG.HomeSkydiving,
    location: 'Pokhara',
    description:
      'The plane door opens and the world tilts to a rush of wind. A once‑in‑a‑lifetime plunge with mountains and a sapphire lake beneath—short, intense, and unforgettable.',
  },
  {
    id: 'ultraflight',
    title: 'Ultralight Flight',
    image: IMG.HomeUltraFlight,
    location: 'Pokhara',
    description:
      'Climb into a tiny open‑cockpit craft and cruise along mountain walls. The flight is smooth, the views are unreal, and the photos feel like postcards from a dream.',
  },
  {
    id: 'canyoning',
    title: 'Canyoning Waterfalls',
    image: IMG.HomeCanyoning,
    location: 'Sundarijal / Jalbire',
    description:
      'Rappel through cool mist and emerald pools as you descend a jungle gorge. Safe, guided routes mix gentle slides with vertical drops for an adventurous half‑day escape.',
  },
  {
    id: 'trekking',
    title: 'Short Ridge Trek',
    image: IMG.HomeTrekking,
    location: 'Annapurna Foothills',
    description:
      'Two days, big vistas, and cozy village teahouses. A taste of trekking life with stone steps, rhododendron forests, and sunrise peaks—no expedition packing required.',
  },
  {
    id: 'langtang',
    title: 'Langtang Valley Hike',
    image: IMG.HomeLangtang,
    location: 'Rasuwa',
    description:
      'Gradual trails follow a glacier‑fed river toward open yak pastures. A rewarding trek with fewer crowds, generous hospitality, and a strong sense of mountain culture.',
  },
  {
    id: 'tangboche',
    title: 'Tengboche View Walk',
    image: IMG.HomeTangboche,
    location: 'Khumbu',
    description:
      'Monastery bells ring beneath Everest‑region peaks. Even a short approach gifts you huge scenery and the tranquil rhythm of Sherpa villages along the trail.',
  },
  {
    id: 'rockbridge',
    title: 'Suspension Bridge Run',
    image: IMG.HomeGorkha,
    location: 'Various',
    description:
      'A fun challenge linking villages over airy spans. These iconic bridges turn a simple hike into an adventure—pause mid‑river for the best photos and a little wobble.',
  },
];

// -------- CULTURE (12) --------
export const CULTURE: Place[] = [
  {
    id: 'pashupatinath',
    title: 'Pashupatinath Temple',
    image: IMG.HomePashupatinath,
    location: 'Kathmandu',
    description:
      'A sacred complex on the Bagmati River where ancient rituals continue daily. Visit respectfully, watch evening arati, and feel the deep continuity of devotion and time.',
  },
  {
    id: 'bouddha_culture',
    title: 'Bouddhanath Stupa',
    image: IMG.HomeBouddha,
    location: 'Kathmandu',
    description:
      'Prayer flags ripple as pilgrims circle the white dome. Monasteries, bookshops, and rooftop cafés create a gentle rhythm perfect for an afternoon of quiet discovery.',
  },
  {
    id: 'bhaktapur_art',
    title: 'Bhaktapur Art & Alleyways',
    image: IMG.HomeBhaktapurArt,
    location: 'Bhaktapur',
    description:
      'Workshops ring with the sound of chisels and wheels. Learn about woodcarving and pottery in a city where craftsmanship has defined daily life for centuries.',
  },
  {
    id: 'janakpur_culture',
    title: 'Janakpur Temples & Murals',
    image: IMG.HomeJanakpur,
    location: 'Dhanusha',
    description:
      'Mithila paintings brighten walls and shrines, telling stories in bold color. Festival days turn the city into a living canvas of music, processions, and sweet offerings.',
  },
  {
    id: 'kirtipur_culture',
    title: 'Kirtipur Newari Flavors',
    image: IMG.HomeKirtipur,
    location: 'Kathmandu Valley',
    description:
      'Traditional houses line narrow lanes leading to hilltop temples. Try a Newari feast, learn about community guthis, and watch evening light wash across the valley.',
  },
  {
    id: 'patan_culture',
    title: 'Patan Metalwork & Monasteries',
    image: IMG.HomePatan,
    location: 'Lalitpur',
    description:
      'Artists cast bronze deities using age‑old techniques while monks chant nearby. A beautiful blend of craft, scholarship, and sacred architecture in close quarters.',
  },
  {
    id: 'thimi',
    title: 'Thimi Pottery Square',
    image: IMG.HomeThimi,
    location: 'Bhaktapur',
    description:
      'Clay takes shape on spinning wheels as courtyards fill with drying pots. Friendly artisans demonstrate their craft, and you can try your hand at a simple bowl.',
  },
  {
    id: 'tansen',
    title: 'Tansen Hill Town',
    image: IMG.HomeTansen,
    location: 'Palpa',
    description:
      'Wooden balconies, tiled roofs, and winding lanes paint a nostalgic hill‑station vibe. Hike to Srinagar Hill for a wide view and sip locally roasted coffee downtown.',
  },
  {
    id: 'palanchowk',
    title: 'Palanchowk Bhagwati Temple',
    image: IMG.HomePalanchowk, // fixed
    location: 'Kavre',
    description:
      'A revered goddess shrine settled on a peaceful ridge. Morning puja, mountain horizons, and a gentle countryside drive make this a rewarding cultural day out.',
  },
  {
    id: 'muktinath',
    title: 'Muktinath Pilgrimage',
    image: IMG.HomeMuktinath,
    location: 'Mustang',
    description:
      'Sacred flames and 108 water spouts welcome hikers and pilgrims alike. The stark Trans‑Himalayan landscape adds drama to a site cherished by multiple faiths.',
  },
  {
    id: 'pashupati_ghats',
    title: 'Bagmati Ghats Walk',
    image: IMG.HomePashupatinath,
    location: 'Kathmandu',
    description:
      'Quiet steps and stone shrines line the river upstream of the main complex. A contemplative stroll where bells ring, sadhus wander, and incense drifts on evening air.',
  },
  {
    id: 'bouddha_streets',
    title: 'Boudha Backstreets',
    image: IMG.HomeBouddha,
    location: 'Kathmandu',
    description:
      'Beyond the stupa, narrow lanes reveal tiny noodle shops, thangka studios, and hidden monasteries. Spend an hour exploring and you’ll uncover your own favorite corner.',
  },
];

export function getByCategory(cat: 'top' | 'adventure' | 'culture'): Place[] {
  switch (cat) {
    case 'adventure':
      return ADVENTURE;
    case 'culture':
      return CULTURE;
    default:
      return TOP_PLACES;
  }
}

const ALL: Place[] = [...TOP_PLACES, ...ADVENTURE, ...CULTURE];

export function getPlaceById(id: string): Place | undefined {
  return ALL.find(p => p.id === id);
}