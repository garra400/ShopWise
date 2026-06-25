import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Settings } from '@/types';

const KEYS = {
  settings: 'shopwise:settings',
  lastSyncAt: 'shopwise:lastSyncAt',
  favorites: 'shopwise:favorites',
  // Legacy (pre-account) flat keys — migrated once into the 'guest' scope.
  legacyProducts: 'shopwise:products',
  legacySeeded: 'shopwise:seeded',
} as const;

/**
 * Products and the "seeded" flag are stored PER SCOPE so each account has its
 * own pantry on the device. Scope is the Supabase user id, or 'guest' when not
 * signed in.
 */
export type Scope = string; // userId | 'guest'
const productsKey = (scope: Scope) => `shopwise:products:${scope}`;
const seededKey = (scope: Scope) => `shopwise:seeded:${scope}`;

/**
 * One-time migration of the old flat keys (shopwise:products / :seeded) into the
 * guest scope, so existing local data isn't lost when accounts are introduced.
 * Safe to call repeatedly — does nothing once the legacy keys are gone.
 */
export async function migrateLegacyToGuest(): Promise<void> {
  try {
    const legacy = await AsyncStorage.getItem(KEYS.legacyProducts);
    if (legacy != null) {
      const dest = productsKey('guest');
      if ((await AsyncStorage.getItem(dest)) == null) {
        await AsyncStorage.setItem(dest, legacy);
      }
      await AsyncStorage.removeItem(KEYS.legacyProducts);
    }
    const legacySeeded = await AsyncStorage.getItem(KEYS.legacySeeded);
    if (legacySeeded != null) {
      const dest = seededKey('guest');
      if ((await AsyncStorage.getItem(dest)) == null) {
        await AsyncStorage.setItem(dest, legacySeeded);
      }
      await AsyncStorage.removeItem(KEYS.legacySeeded);
    }
  } catch {
    // best-effort migration
  }
}

const DEFAULT_SETTINGS: Settings = {
  themePreference: 'system',
  notificationsEnabled: true,
  language: 'pt',
  measurementSystem: 'metric',
  defaultUnit: 'un',
  dietTags: [],
  allergens: [],
  cuisines: [],
  avoidIngredients: [],
};

export async function loadProducts(scope: Scope): Promise<Product[]> {
  try {
    const raw = await AsyncStorage.getItem(productsKey(scope));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

export async function saveProducts(scope: Scope, list: Product[]): Promise<void> {
  try {
    await AsyncStorage.setItem(productsKey(scope), JSON.stringify(list));
  } catch {
    // silently fail on storage errors
  }
}

/** Remove a scope's pantry entirely (used after migrating guest → account). */
export async function clearProductsStore(scope: Scope): Promise<void> {
  try {
    await AsyncStorage.removeItem(productsKey(scope));
  } catch {
    // silently fail on storage errors
  }
}

/** Whether the example seed data has ever been written for this scope (so we don't re-seed after a manual clear). */
export async function hasSeeded(scope: Scope): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(seededKey(scope))) === '1';
  } catch {
    return false;
  }
}

export async function markSeeded(scope: Scope): Promise<void> {
  try {
    await AsyncStorage.setItem(seededKey(scope), '1');
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
