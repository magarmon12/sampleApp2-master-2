// lib/imageMap.ts
export type ImageKey =
  | 'HomeBandipur' | 'HomeBhaktapur' | 'HomeBhaktapurArt' | 'HomeBouddha'
  | 'HomeBungee' | 'HomeCanyoning' | 'HomeChitwan' | 'HomeGhandruk'
  | 'HomeGorkha' | 'HomeIlam' | 'HomeJanakpur' | 'HomeKalinchowk'
  | 'HomeKirtipur' | 'HomeLangtang' | 'HomeLumbini' | 'HomeMountainBiking'
  | 'HomeMuktinath' | 'HomeNagarkot' | 'HomePalanchowk' | 'HomePashupatinath'
  | 'HomePatan' | 'HomePokhara' | 'Homerafting' | 'HomeRara'
  | 'HomeRockClimbing' | 'HomeSkydiving' | 'HomeTangboche' | 'HomeTansen'
  | 'HomeThimi' | 'HomeTrekking' | 'HomeUltraFlight' | 'HoeParagliding';

export const images: Record<ImageKey, any> = {
  HomeBandipur:        require('../assets/images/HomeBandipur.jpg'),
  HomeBhaktapur:       require('../assets/images/HomeBhaktapur.jpg'),
  HomeBhaktapurArt:    require('../assets/images/HomeBhaktapurArt.jpg'),
  HomeBouddha:         require('../assets/images/HomeBouddha.jpg'),
  HomeBungee:          require('../assets/images/HomeBungee.jpg'),
  HomeCanyoning:       require('../assets/images/HomeCanyoning.jpg'),
  HomeChitwan:         require('../assets/images/HomeChitwan.jpg'),
  HomeGhandruk:        require('../assets/images/HomeGhandruk.jpg'),
  HomeGorkha:          require('../assets/images/HomeGorkha.jpg'),
  HomeIlam:            require('../assets/images/HomeIlam.jpg'),          // ✅ Ilam
  HomeJanakpur:        require('../assets/images/HomeJanakpur.jpg'),
  HomeKalinchowk:      require('../assets/images/HomeKalinchowk.jpg'),
  HomeKirtipur:        require('../assets/images/HomeKirtipur.jpg'),
  HomeLangtang:        require('../assets/images/HomeLangtang.jpg'),
  HomeLumbini:         require('../assets/images/HomeLumbini.jpg'),
  HomeMountainBiking:  require('../assets/images/HomeMountainBiking.jpg'),
  HomeMuktinath:       require('../assets/images/HomeMuktinath.jpg'),
  HomeNagarkot:        require('../assets/images/HomeNagarkot.jpg'),
  HomePalanchowk:      require('../assets/images/HomePalanchowk .jpg'),    // ✅ no space
  HomePashupatinath:   require('../assets/images/HomePashupatinath.jpg'),
  HomePatan:           require('../assets/images/HomePatan.jpg'),
  HomePokhara:         require('../assets/images/HomePokhara.jpg'),
  Homerafting:         require('../assets/images/Homerafting.jpg'),
  HomeRara:            require('../assets/images/HomeRara.jpg'),
  HomeRockClimbing:    require('../assets/images/HomeRockClimbing.jpg'),
  HomeSkydiving:       require('../assets/images/HomeSkydiving.jpg'),
  HomeTangboche:       require('../assets/images/HomeTangboche.jpg'),
  HomeTansen:          require('../assets/images/HomeTansen.jpg'),
  HomeThimi:           require('../assets/images/HomeThimi.jpg'),
  HomeTrekking:        require('../assets/images/HomeTrekking.jpg'),
  HomeUltraFlight:     require('../assets/images/HomeUltraFlight.jpg'),
  HoeParagliding:      require('../assets/images/HoeParagliding.jpg'),
};

/** Get a static require by ImageKey (or alias) */
export function getImage(key?: string) {
  if (!key) return undefined;
  const alias: Record<string, ImageKey> = {
    HomeParagliding: 'HoeParagliding', // common alias
    Homellam: 'HomeIlam',              // old key -> new key
  };
  const cleaned = key.trim();
  const resolved = (alias[cleaned] ?? cleaned) as ImageKey;
  return images[resolved];
}

/**
 * Flexible helper:
 * - number (require) -> returns as-is
 * - ImageKey string  -> mapped require
 * - remote URL       -> { uri }
 * - { uri } object   -> as-is
 * - { key: ImageKey }-> mapped require
 */
export function resolveImage(input?: any) {
  if (!input) return undefined;
  if (typeof input === 'number') return input;
  if (typeof input === 'string') return getImage(input) ?? { uri: input };
  if (input && typeof input === 'object') {
    if ('uri' in input && typeof input.uri === 'string') return input;
    if ('key' in input && typeof input.key === 'string') return getImage(input.key);
  }
  return undefined;
}