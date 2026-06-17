/**
 * SyncContext — optional Supabase cloud sync.
 *
 * No-config contract:
 *   When hasSupabase === false (no env keys) this context provides a fully
 *   inert implementation: enabled=false, user=null, initializing=false, all
 *   methods are no-ops and make ZERO network calls.  The Supabase client is
 *   never created (getSupabase() returns null before any call can happen).
 *
 * SyncProvider MUST be mounted INSIDE ProductsProvider so that useProducts()
 * is available.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { hasSupabase } from '@/config/integrations';
import { getSupabase, productToRow, rowToProduct, ProductRow } from '@/services/supabase';
import { useProducts } from '@/context/ProductsContext';
import { loadLastSyncAt, saveLastSyncAt } from '@/services/storage';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface SyncUser {
  id: string;
  email?: string;
}

interface SyncContextValue {
  /** Whether Supabase keys are configured. */
  enabled: boolean;
  /** The currently authenticated user, or null. */
  user: SyncUser | null;
  /** True while checking for an existing session on mount. */
  initializing: boolean;
  /** True while a sync operation is in progress. */
  syncing: boolean;
  /** ISO timestamp of the last successful sync, or null. */
  lastSyncAt: string | null;
  /** Last error message (pt-BR), or null. */
  error: string | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  syncNow(): Promise<void>;
}

const NO_OP_CONTEXT: SyncContextValue = {
  enabled: false,
  user: null,
  initializing: false,
  syncing: false,
  lastSyncAt: null,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  syncNow: async () => {},
};

const SyncContext = createContext<SyncContextValue>(NO_OP_CONTEXT);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'Este e-mail já está cadastrado. Tente entrar.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Senha muito fraca. Use pelo menos 6 caracteres.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Erro de conexão. Verifique sua internet.';
  }
  return 'Ocorreu um erro. Tente novamente.';
}

// ---------------------------------------------------------------------------
// Provider (active — only rendered when hasSupabase === true)
// ---------------------------------------------------------------------------

function ActiveSyncProvider({ children }: { children: React.ReactNode }) {
  const { products, mergeRemoteProducts } = useProducts();

  const [user, setUser] = useState<SyncUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs to avoid stale-closure issues in debounced callbacks.
  const userRef = useRef<SyncUser | null>(null);
  userRef.current = user;

  const productsRef = useRef(products);
  productsRef.current = products;

  const syncingRef = useRef(false);
  syncingRef.current = syncing;

  // Track whether we just merged from remote so we don't re-push immediately.
  const mergeInProgressRef = useRef(false);

  // ---------------------------------------------------------------------------
  // Core sync logic
  // ---------------------------------------------------------------------------

  const syncNow = useCallback(async () => {
    const sb = getSupabase();
    const currentUser = userRef.current;
    if (!sb || !currentUser) return;
    if (syncingRef.current) return; // guard concurrent runs

    setSyncing(true);
    syncingRef.current = true;
    setError(null);

    try {
      const currentProducts = productsRef.current;

      // PUSH: upsert all local products to Supabase.
      const rows = currentProducts.map((p) => productToRow(p, currentUser.id));
      if (rows.length > 0) {
        const { error: upsertError } = await sb
          .from('products')
          .upsert(rows, { onConflict: 'id' });
        if (upsertError) throw upsertError;
      }

      // PULL: fetch all remote rows for this user.
      const { data, error: selectError } = await sb
        .from('products')
        .select('*')
        .eq('user_id', currentUser.id);
      if (selectError) throw selectError;

      // Merge remote into local (last-write-wins).
      if (data && data.length > 0) {
        mergeInProgressRef.current = true;
        await mergeRemoteProducts((data as ProductRow[]).map(rowToProduct));
        // The flag will be cleared by the products-change debounce effect.
      }

      const now = new Date().toISOString();
      setLastSyncAt(now);
      await saveLastSyncAt(now);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(friendlyAuthError(msg));
    } finally {
      setSyncing(false);
      syncingRef.current = false;
    }
  }, [mergeRemoteProducts]);

  // ---------------------------------------------------------------------------
  // Auth helpers
  // ---------------------------------------------------------------------------

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return;
    setError(null);
    const { error: authError } = await sb.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(friendlyAuthError(authError.message));
    }
    // onAuthStateChange will update `user` and trigger the first sync.
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const sb = getSupabase();
    if (!sb) return;
    setError(null);
    const { error: authError } = await sb.auth.signUp({ email, password });
    if (authError) {
      setError(friendlyAuthError(authError.message));
    }
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setError(null);
    await sb.auth.signOut();
    // onAuthStateChange will clear `user`.
  }, []);

  // ---------------------------------------------------------------------------
  // Mount: restore lastSyncAt, read session, subscribe to auth changes.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setInitializing(false);
      return;
    }

    // Restore persisted lastSyncAt.
    loadLastSyncAt().then((val) => {
      if (val) setLastSyncAt(val);
    });

    let unsubscribe: (() => void) | undefined;

    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = { id: session.user.id, email: session.user.email ?? undefined };
        setUser(u);
        userRef.current = u;
      }
      setInitializing(false);
    });

    const { data: listener } = sb.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const u = { id: session.user.id, email: session.user.email ?? undefined };
          setUser(u);
          userRef.current = u;
          // Sync once on sign-in (not on every token refresh).
          if (_event === 'SIGNED_IN') {
            // Slight delay so state settles before the async call.
            setTimeout(() => {
              void syncNow();
            }, 200);
          }
        } else {
          setUser(null);
          userRef.current = null;
        }
      }
    );

    unsubscribe = () => listener.subscription.unsubscribe();

    return () => {
      unsubscribe?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once; syncNow is stable

  // ---------------------------------------------------------------------------
  // Auto-push: debounced push when products change (1.5 s debounce).
  // Only pushes (no pull) to avoid infinite merge loops.
  // The mergeInProgressRef flag prevents re-pushing immediately after a merge.
  // ---------------------------------------------------------------------------

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !userRef.current) return;

    // If this change was triggered by a remote merge, skip pushing back.
    if (mergeInProgressRef.current) {
      mergeInProgressRef.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const currentUser = userRef.current;
      const currentSb = getSupabase();
      if (!currentSb || !currentUser || syncingRef.current) return;

      setSyncing(true);
      syncingRef.current = true;
      setError(null);

      try {
        const rows = productsRef.current.map((p) => productToRow(p, currentUser.id));
        if (rows.length > 0) {
          const { error: upsertError } = await currentSb
            .from('products')
            .upsert(rows, { onConflict: 'id' });
          if (upsertError) throw upsertError;
        }
        const now = new Date().toISOString();
        setLastSyncAt(now);
        await saveLastSyncAt(now);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(friendlyAuthError(msg));
      } finally {
        setSyncing(false);
        syncingRef.current = false;
      }
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  // products is the only real dependency — user changes are handled via ref.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SyncContext.Provider
      value={{
        enabled: true,
        user,
        initializing,
        syncing,
        lastSyncAt,
        error,
        signIn,
        signUp,
        signOut,
        syncNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Public provider — inert when !hasSupabase
// ---------------------------------------------------------------------------

export function SyncProvider({ children }: { children: React.ReactNode }) {
  if (!hasSupabase) {
    // Provide the no-op context without mounting any Supabase logic.
    return (
      <SyncContext.Provider value={NO_OP_CONTEXT}>
        {children}
      </SyncContext.Provider>
    );
  }
  return <ActiveSyncProvider>{children}</ActiveSyncProvider>;
}

export function useSync(): SyncContextValue {
  return useContext(SyncContext);
}
