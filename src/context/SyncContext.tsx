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
import { loadLastSyncAt, saveLastSyncAt, clearProductsStore, clearFavoritesStore } from '@/services/storage';

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
  /** True after sign-up when the user must enter the e-mail confirmation code. */
  awaitingConfirmation: boolean;
  /** The e-mail awaiting confirmation (for the OTP screen), or null. */
  pendingEmail: string | null;
  /** True during the password-reset flow (waiting for the recovery code). */
  awaitingPasswordReset: boolean;
  /** The e-mail awaiting the recovery code, or null. */
  pendingResetEmail: string | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  /** Verify the 6-digit code e-mailed after sign-up. */
  verifyOtp(token: string): Promise<void>;
  /** Re-send the confirmation code to the pending e-mail. */
  resendOtp(): Promise<void>;
  /** Abandon the pending confirmation (back to the sign-in form). */
  cancelConfirmation(): void;
  /** Start password recovery: e-mails a reset code to the address. */
  requestPasswordReset(email: string): Promise<void>;
  /** Finish recovery: verify the code and set the new password. */
  confirmPasswordReset(token: string, newPassword: string): Promise<void>;
  /** Abandon the password-reset flow. */
  cancelPasswordReset(): void;
  signOut(): Promise<void>;
  syncNow(): Promise<void>;
  /** Delete the account and all its data (LGPD right to erasure). */
  deleteAccount(): Promise<void>;
}

const NO_OP_CONTEXT: SyncContextValue = {
  enabled: false,
  user: null,
  initializing: false,
  syncing: false,
  lastSyncAt: null,
  error: null,
  awaitingConfirmation: false,
  pendingEmail: null,
  awaitingPasswordReset: false,
  pendingResetEmail: null,
  signIn: async () => {},
  signUp: async () => {},
  verifyOtp: async () => {},
  resendOtp: async () => {},
  cancelConfirmation: () => {},
  requestPasswordReset: async () => {},
  confirmPasswordReset: async () => {},
  cancelPasswordReset: () => {},
  signOut: async () => {},
  syncNow: async () => {},
  deleteAccount: async () => {},
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
  if (lower.includes('expired') || (lower.includes('invalid') && (lower.includes('token') || lower.includes('otp') || lower.includes('code')))) {
    return 'Código inválido ou expirado. Peça um novo.';
  }
  if (lower.includes('rate limit') || lower.includes('too many')) {
    return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
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
  const { products, mergeRemoteProducts, setActiveScope } = useProducts();

  const [user, setUser] = useState<SyncUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [awaitingPasswordReset, setAwaitingPasswordReset] = useState(false);
  const [pendingResetEmail, setPendingResetEmail] = useState<string | null>(null);

  // Refs to avoid stale-closure issues in debounced callbacks.
  const userRef = useRef<SyncUser | null>(null);
  userRef.current = user;

  // Keep the latest scope-switcher reachable from the once-only auth listener.
  const setActiveScopeRef = useRef(setActiveScope);
  setActiveScopeRef.current = setActiveScope;

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
    const { data, error: authError } = await sb.auth.signUp({ email, password });
    if (authError) {
      setError(friendlyAuthError(authError.message));
      return;
    }
    // With e-mail confirmation ON, no session is returned yet — ask for the code.
    // (If confirmation is OFF, a session comes back and onAuthStateChange signs in.)
    if (!data.session) {
      setPendingEmail(email);
      setAwaitingConfirmation(true);
    }
  }, []);

  const verifyOtp = useCallback(async (token: string) => {
    const sb = getSupabase();
    if (!sb || !pendingEmail) return;
    setError(null);
    const { error: vErr } = await sb.auth.verifyOtp({
      email: pendingEmail,
      token: token.trim(),
      type: 'signup',
    });
    if (vErr) {
      setError(friendlyAuthError(vErr.message));
      return;
    }
    setAwaitingConfirmation(false);
    setPendingEmail(null);
    // onAuthStateChange (SIGNED_IN) sets the user and migrates the guest pantry.
  }, [pendingEmail]);

  const resendOtp = useCallback(async () => {
    const sb = getSupabase();
    if (!sb || !pendingEmail) return;
    setError(null);
    const { error: rErr } = await sb.auth.resend({ type: 'signup', email: pendingEmail });
    if (rErr) setError(friendlyAuthError(rErr.message));
  }, [pendingEmail]);

  const cancelConfirmation = useCallback(() => {
    setAwaitingConfirmation(false);
    setPendingEmail(null);
    setError(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const sb = getSupabase();
    if (!sb) return;
    setError(null);
    const { error: rErr } = await sb.auth.resetPasswordForEmail(email);
    if (rErr) {
      setError(friendlyAuthError(rErr.message));
      return;
    }
    setPendingResetEmail(email);
    setAwaitingPasswordReset(true);
  }, []);

  const confirmPasswordReset = useCallback(async (token: string, newPassword: string) => {
    const sb = getSupabase();
    if (!sb || !pendingResetEmail) return;
    setError(null);
    // Verify the recovery code → establishes a session for the user.
    const { error: vErr } = await sb.auth.verifyOtp({
      email: pendingResetEmail,
      token: token.trim(),
      type: 'recovery',
    });
    if (vErr) {
      setError(friendlyAuthError(vErr.message));
      return;
    }
    // Set the new password on the now-authenticated user.
    const { error: uErr } = await sb.auth.updateUser({ password: newPassword });
    if (uErr) {
      setError(friendlyAuthError(uErr.message));
      return;
    }
    setAwaitingPasswordReset(false);
    setPendingResetEmail(null);
    // onAuthStateChange already signed the user in and switched the pantry scope.
  }, [pendingResetEmail]);

  const cancelPasswordReset = useCallback(() => {
    setAwaitingPasswordReset(false);
    setPendingResetEmail(null);
    setError(null);
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setError(null);
    await sb.auth.signOut();
    // onAuthStateChange will clear `user` and switch back to the guest pantry.
  }, []);

  const deleteAccount = useCallback(async () => {
    const sb = getSupabase();
    const u = userRef.current;
    if (!sb || !u) return;
    setError(null);
    try {
      // Preferred: server-side erasure of the auth user + their data (LGPD).
      const { error: rpcError } = await sb.rpc('delete_my_account');
      if (rpcError) {
        // Fallback when the RPC isn't installed: at least delete the data rows.
        await sb.from('products').delete().eq('user_id', u.id);
      }
    } catch {
      // ignore — we still sign out and wipe local below
    } finally {
      await clearProductsStore(u.id); // remove this account's local cached pantry
      await clearFavoritesStore(u.id); // and its favorites (LGPD: erase all local data)
      await sb.auth.signOut(); // → onAuthStateChange → guest scope
    }
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
        // Session restore (app reopen): load this account's pantry, no migration.
        void setActiveScopeRef.current(u.id);
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
            // Move the guest pantry into the account on first sign-in, then sync.
            void setActiveScopeRef.current(u.id, { migrate: true });
            setTimeout(() => {
              void syncNow();
            }, 300);
          }
        } else {
          setUser(null);
          userRef.current = null;
          // Signed out → back to the guest pantry.
          void setActiveScopeRef.current('guest');
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
        awaitingConfirmation,
        pendingEmail,
        awaitingPasswordReset,
        pendingResetEmail,
        signIn,
        signUp,
        verifyOtp,
        resendOtp,
        cancelConfirmation,
        requestPasswordReset,
        confirmPasswordReset,
        cancelPasswordReset,
        signOut,
        syncNow,
        deleteAccount,
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
