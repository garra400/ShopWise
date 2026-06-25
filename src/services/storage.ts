import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Settings } from '@/types';

const KEYS = {
  products: 'shopwise:products',
  settings: 'shopwise:settings',
  seeded: 'shopwise:seeded',
  lastSyncAt: 'shopwise:lastSyncAt',
  favorites: 'shopwise:favorites',
} as const;

const DEFAULT_SETTINGS: Settings = {
  themePreference: 'system',
  notificationsEnabled: true,
  language: 'pt',
  defaultUnit: 'un',
  dietTags: [],
  allergens: [],
  cuisines: [],
  avoidIngredients: [],
};

export async function loadProducts(): Promise<Product[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.products);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

export async function saveProducts(list: Product[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.products, JSON.stringify(list));
  } catch {
    // silently fail on storage errors
  }
}

/** Whether the example seed data has ever been written (so we don't re-seed after the user clears everything). */
export async function hasSeeded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEYS.seeded)) === '1';
  } catch {
    return false;
  }
}

export async function markSeeded(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.seeded, '1');
  } catch {
    // silently fail on storage errors
  }
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed } as Settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(s: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(s));
  } catch {
    // silently fail on storage errors
  }
}

export async function loadFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.favorites);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(ids));
  } catch {
    // silently fail on storage errors
  }
}

export async function loadLastSyncAt(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.lastSyncAt);
  } catch {
    return null;
  }
}

export async function saveLastSyncAt(iso: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.lastSyncAt, iso);
  } catch {
    // silently fail on storage errors
  }
}
