/**
 * Recipe image service — Pexels adapter (free tier).
 *
 * When EXPO_PUBLIC_PEXELS_API_KEY is absent, fetchRecipeImage returns null and
 * the UI falls back to a themed placeholder. Results are cached in-memory per
 * query so the same recipe never costs more than one request per session.
 */

import { PEXELS_API_KEY, hasPexels } from '@/config/integrations';

// query -> resolved url (or null when nothing was found / no key)
const imageCache = new Map<string, string | null>();
// query -> in-flight promise, so concurrent cards don't duplicate requests
const inFlight = new Map<string, Promise<string | null>>();

/** Build a search query for a recipe title (food context improves results). */
export function recipeImageQuery(title: string): string {
  return `${title} comida prato`;
}

interface PexelsPhoto {
  src?: { landscape?: string; large?: string; medium?: string };
}
interface PexelsResponse {
  photos?: PexelsPhoto[];
}

/**
 * Fetch a stock photo URL for the given query from Pexels.
 * Returns null when no key is configured, on any error, or when nothing matches.
 */
export async function fetchRecipeImage(query: string): Promise<string | null> {
  if (!hasPexels || !query.trim()) return null;
  if (imageCache.has(query)) return imageCache.get(query) ?? null;
  const existing = inFlight.get(query);
  if (existing) return existing;

  const promise = (async (): Promise<string | null> => {
    try {
      const url = new URL('https://api.pexels.com/v1/search');
      url.searchParams.set('query', query);
      url.searchParams.set('per_page', '1');
      url.searchParams.set('orientation', 'landscape');

      const res = await fetch(url.toString(), {
        headers: { Authorization: PEXELS_API_KEY },
      });
      if (!res.ok) {
        imageCache.set(query, null);
        return null;
      }
      const data = (await res.json()) as PexelsResponse;
      const src = data.photos?.[0]?.src;
      const resolved = src?.landscape ?? src?.large ?? src?.medium ?? null;
      imageCache.set(query, resolved);
      return resolved;
    } catch {
      imageCache.set(query, null);
      return null;
    } finally {
      inFlight.delete(query);
    }
  })();

  inFlight.set(query, promise);
  return promise;
}
