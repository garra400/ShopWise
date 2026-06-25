import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { Product } from '@/types';
import { loadProducts, saveProducts, hasSeeded, markSeeded } from '@/services/storage';
import { SEED_PRODUCTS } from '@/data/seed';
import { resolveCanonicalId } from '@/utils/ingredients';

interface ProductsContextValue {
  products: Product[];
  loading: boolean;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addProducts: (list: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  markConsumed: (id: string) => Promise<void>;
  /** Mark several products as consumed in a single atomic update (loop-safe). */
  markConsumedMany: (ids: string[]) => Promise<void>;
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
  addProduct: async () => {},
  addProducts: async () => {},
  updateProduct: async () => {},
  removeProduct: async () => {},
  markConsumed: async () => {},
  markConsumedMany: async () => {},
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

  useEffect(() => {
    Promise.all([loadProducts(), hasSeeded()]).then(([stored, seeded]) => {
      if (stored.length === 0 && !seeded) {
        // First run only — seed with example data (won't re-seed after a manual clear)
        setProducts(SEED_PRODUCTS);
        saveProducts(SEED_PRODUCTS);
        markSeeded();
      } else {
        setProducts(stored);
      }
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (list: Product[]) => {
    setProducts(list);
    await saveProducts(list);
  }, []);

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

  const markConsumedMany = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;
      const set = new Set(ids);
      const now = new Date().toISOString();
      const updated = products.map((p) =>
        set.has(p.id) ? { ...p, consumed: true, updatedAt: now } : p
      );
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
        addProduct,
        addProducts,
        updateProduct,
        removeProduct,
        markConsumed,
        markConsumedMany,
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
