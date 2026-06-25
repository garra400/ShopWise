import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { loadFavorites, saveFavorites, clearFavoritesStore } from '@/services/storage';
import { useProducts } from '@/context/ProductsContext';

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => void;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  loading: true,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Favorites follow the active pantry scope (per account), mirroring products.
  const { scope } = useProducts();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const prevScopeRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const prev = prevScopeRef.current;
      if (prev === 'guest' && scope !== 'guest') {
        // First sign-in: merge the guest favorites into the account.
        const [guestFavs, acctFavs] = await Promise.all([loadFavorites('guest'), loadFavorites(scope)]);
        const merged = Array.from(new Set([...acctFavs, ...guestFavs]));
        await saveFavorites(scope, merged);
        if (guestFavs.length) await clearFavoritesStore('guest');
        if (!cancelled) setFavorites(merged);
      } else {
        const ids = await loadFavorites(scope);
        if (!cancelled) setFavorites(ids);
      }
      if (!cancelled) setLoading(false);
      prevScopeRef.current = scope;
    })();
    return () => { cancelled = true; };
  }, [scope]);

  const isFavorite = useCallback(
    (recipeId: string) => favorites.includes(recipeId),
    [favorites],
  );

  const toggleFavorite = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      saveFavorites(scope, next);
      return next;
    });
  }, [scope]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  return useContext(FavoritesContext);
}
