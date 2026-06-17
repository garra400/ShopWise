/**
 * Integration configuration.
 *
 * Expo inlines EXPO_PUBLIC_* variables at build time.
 * When no key is present the app falls back to the local recipe database.
 */

export const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY ?? '';

/** True only when a Spoonacular API key has been provided via env. */
export const hasSpoonacular = SPOONACULAR_API_KEY.length > 0;

// ---------------------------------------------------------------------------
// Supabase (optional cloud sync)
// ---------------------------------------------------------------------------
// Create a FREE project at https://supabase.com (no credit card required),
// run supabase_schema.sql in the Supabase SQL editor, then paste the Project
// URL and anon key below (in a .env file — copy from .env.example).
// Without these keys the app remains fully local and makes zero network calls.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True only when both Supabase env keys have been provided. */
export const hasSupabase = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
