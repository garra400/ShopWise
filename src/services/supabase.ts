/**
 * Supabase client — lazy singleton.
 *
 * The client is ONLY created when both SUPABASE_URL and SUPABASE_ANON_KEY are
 * present (hasSupabase === true).  When the keys are missing the module never
 * calls createClient, makes zero network requests, and getSupabase() returns
 * null.  All call-sites must guard: `const sb = getSupabase(); if (!sb) return;`
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from '@/config/integrations';
import { Product, ProductSource } from '@/types';

// ---------------------------------------------------------------------------
// Lazy singleton
// ---------------------------------------------------------------------------

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return _client;
}

// ---------------------------------------------------------------------------
// Remote row shape (mirrors the `products` table in supabase_schema.sql)
// ---------------------------------------------------------------------------

export interface ProductRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number | null;
  unit: string | null;
  image: string | null;
  source: string;
  consumed: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function productToRow(p: Product, userId: string): ProductRow {
  return {
    id: p.id,
    user_id: userId,
    name: p.name,
    category: p.category,
    purchase_date: p.purchaseDate,
    expiry_date: p.expiryDate,
    quantity: p.quantity ?? null,
    unit: p.unit ?? null,
    image: p.image ?? null,
    source: p.source,
    consumed: p.consumed,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    purchaseDate: row.purchase_date,
    expiryDate: row.expiry_date,
    quantity: row.quantity ?? undefined,
    unit: row.unit ?? undefined,
    image: row.image ?? undefined,
    source: row.source as ProductSource,
    consumed: row.consumed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
