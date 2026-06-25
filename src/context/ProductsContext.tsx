import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Product } from '@/types';
import {
  loadProducts,
  saveProducts,
  hasSeeded,
  markSeeded,
  clearProductsStore,
  migrateLegacyToGuest,
} from '@/services/storage';
import { SEED_PRODUCTS } from '@/data/seed';
import { resolveCanonicalId } from '@/utils/ingredients';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  /** Current storage scope: the signed-in user id, or 'guest'. */
  scope: string;
  /**
   * Switch the active pantry scope (called by the auth layer on sign in/out).
   * With `{ migrate: true }` (used on first sign-in), a non-empty guest pantry
   * is moved into the account scope so nothing is lost.
   */
  setActiveScope: (scope: string, opts?: { migrate?: boolean }) => Promise<void>;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addProducts: (list: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  markConsumed: (id: string) => Promise<void>;
  /**
   * Apply a recipe's consumption to the pantry in one atomic update: each entry
   * either marks a product consumed or sets its remaining quantity (loop-safe).
   */
  consumeForRecipe: (deductions: { id: string; consume: boolean; quantity?: number }[]) => Promise<void>;
  renewExpiry: (id: string, newDate: string) => Promise<void>;
  reseedProducts: () => Promise<void>;
  clearProducts: () => Promise<void>;
  /**
   * Merges a list of remotely fetched products into the local store.
   * Last-write-wins by `updatedAt` ISO string comparison.
   * IDs present only locally are kept; IDs present only remotely are added.
   * Does NOT depend on Supabase — purely a local state merge.
   */
  mergeRemoteProducts: (remote: Product[]) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: [],
  loading: true,
  scope: 'guest',
  setActiveScope: async () => {},
  addProduct: async () => {},
  addProducts: async () => {},
  updateProduct: async () => {},
  removeProduct: async () => {},
  markConsumed: async () => {},
  consumeForRecipe: async () => {},
  renewExpiry: async () => {},
  reseedProducts: async () => {},
  clearProducts: async () => {},
  mergeRemoteProducts: async () => {},
});

function makeId(): string {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Active pantry scope: the signed-in user id, or 'guest' when not signed in.
  const [scope, setScope] = useState<string>('guest');

  useEffect(() => {
    (async () => {
      await migrateLegacyToGuest();
      const [stored, seeded] = await Promise.all([loadProducts('guest'), hasSeeded('guest')]);
      if (stored.length === 0 && !seeded) {
        // First run only — seed the GUEST pantry with example data.
        // Accounts are never seeded: they start from their own cloud data.
        setProducts(SEED_PRODUCTS);
        saveProducts('guest', SEED_PRODUCTS);
        markSeeded('guest');
      } else {
        setProducts(stored);
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(
    async (list: Product[]) => {
      setProducts(list);
      await saveProducts(scope, list);
    },
    [scope]
  );

  const setActiveScope = useCallback(
    async (newScope: string, opts?: { migrate?: boolean }) => {
      if (newScope === scope) return;

      // First sign-in with a non-empty guest pantry → move it into the account.
      // Skip the bundled example products (seed-*) so they don't pollute the account.
      const guestReal = products.filter((p) => !p.id.startsWith('seed-'));
      if (opts?.migrate && scope === 'guest' && newScope !== 'guest' && guestReal.length > 0) {
        const accountExisting = await loadProducts(newScope);
        const byId = new Map(accountExisting.map((p) => [p.id, p]));
        for (const g of guestReal) if (!byId.has(g.id)) byId.set(g.id, g);
        const merged = Array.from(byId.values());
        await saveProducts(newScope, merged);
        await clearProductsStore('guest'); // the data lives in the account now
        setScope(newScope);
        setProducts(merged);
        return;
      }

      // Plain switch (sign-out, or session restore): load the target pantry.
      const list = await loadProducts(newScope);
      setScope(newScope);
      setProducts(list);
    },
    [scope, products]
  );

  const addProduct = useCallback(
    async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const product: Product = {
        ...data,
        canonicalId: data.canonicalId ?? resolveCanonicalId(data.name),
        id: makeId(),
        createdAt: now,
        updatedAt: now,
      };
      await persist([...products, product]);
    },
    [products, persist]
  );

  const addProducts = useCallback(
    async (list: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => {
      const now = new Date().toISOString();
      const newProducts: Product[] = list.map((data) => ({
        ...data,
        canonicalId: data.canonicalId ?? resolveCanonicalId(data.name),
        id: makeId(),
        createdAt: now,
        updatedAt: now,
      }));
      await persist([...products, ...newProducts]);
    },
    [products, persist]
  );

  const updateProduct = useCallback(
    async (id: string, patch: Partial<Product>) => {
      const updated = products.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      );
      await persist(updated);
    },
    [products, persist]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      await persist(products.filter((p) => p.id !== id));
    },
    [products, persist]
  );

  const markConsumed = useCallback(
    async (id: string) => {
      await updateProduct(id, { consumed: true });
    },
    [updateProduct]
  );

  const consumeForRecipe = useCallback(
    async (deductions: { id: string; consume: boolean; quantity?: number }[]) => {
      if (deductions.length === 0) return;
      const byId = new Map(deductions.map((d) => [d.id, d]));
      const now = new Date().toISOString();
      const updated = products.map((p) => {
        const d = byId.get(p.id);
        if (!d) return p;
        if (d.consume) return { ...p, consumed: true, updatedAt: now };
        return { ...p, quantity: d.quantity ?? p.quantity, updatedAt: now };
      });
      await persist(updated);
    },
    [products, persist]
  );

  const renewExpiry = useCallback(
    async (id: string, newDate: string) => {
      await updateProduct(id, { expiryDate: newDate });
    },
    [updateProduct]
  );

  const reseedProducts = useCallback(async () => {
    const now = new Date().toISOString();
    const reseeded = SEED_PRODUCTS.map((p) => ({ ...p, createdAt: now, updatedAt: now }));
    await persist(reseeded);
  }, [persist]);

  const clearProducts = useCallback(async () => {
    await persist([]);
  }, [persist]);

  /**
   * Merge remote products into the local store using last-write-wins on
   * `updatedAt`.  The function is deterministic given its inputs and never
   * touches Supabase — that concern lives in SyncContext.
   */
  const mergeRemoteProducts = useCallback(
    async (remote: Product[]) => {
      // Build a map of current local products keyed by id.
      const localMap = new Map<string, Product>(products.map((p) => [p.id, p]));

      for (const remoteProduct of remote) {
        const local = localMap.get(remoteProduct.id);
        if (!local) {
          // Remote-only → add it locally.
          localMap.set(remoteProduct.id, remoteProduct);
        } else {
          // Both sides have the record — keep the newer one (last-write-wins).
          const localTime = new Date(local.updatedAt).getTime();
          const remoteTime = new Date(remoteProduct.updatedAt).getTime();
          if (remoteTime > localTime) {
            localMap.set(remoteProduct.id, remoteProduct);
          }
          // If local is newer (or same), we keep the local version — no-op.
        }
      }

      const merged = Array.from(localMap.values());
      await persist(merged);
    },
    [products, persist]
  );

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        scope,
        setActiveScope,
        addProduct,
        addProducts,
        updateProduct,
        removeProduct,
        markConsumed,
        consumeForRecipe,
        renewExpiry,
        reseedProducts,
        clearProducts,
        mergeRemoteProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextValue {
  return useContext(ProductsContext);
}
