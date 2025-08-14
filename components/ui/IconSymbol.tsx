// components/ui/IconSymbol.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Map your existing names to Ionicons names (works on web)
const MAP: Record<string, IconName> = {
  heart: 'heart-outline',
  'heart.fill': 'heart',
  person: 'person-outline',
  'person.fill': 'person',
  calendar: 'calendar-outline',
  map: 'map-outline',
  search: 'search-outline',
  sparkles: 'star-outline',            // safe fallback across platforms
  link: 'link-outline',
  'mappin.and.ellipse': 'location-outline',
  'chevron.right': 'chevron-forward',
  close: 'close',
};

function mapName(name: string): IconName {
  return (MAP[name] ?? (name as IconName));
}

export function IconSymbol({
  name,
  size = 18,
  color = '#111827',
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: any;                          // accept any at the prop level
}) {
  return (
    <Ionicons
      name={mapName(name)}
      size={size}
      color={color}
      style={style as StyleProp<TextStyle>}  // cast to what Ionicons expects
    />
  );
}

export default IconSymbol;