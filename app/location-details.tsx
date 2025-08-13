import { useLocalSearchParams } from 'expo-router';

// ...
const { id } = useLocalSearchParams<{ id?: string }>();
// use `id` to fetch/render the place