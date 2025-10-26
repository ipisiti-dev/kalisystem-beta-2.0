import { supabase } from './supabase';

const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

async function getUserId(): Promise<string | null> {
  try {
    // Handle both v1 and v2 supabase client shapes
    // v2: supabase.auth.getUser(); v1: supabase.auth.user()
    // @ts-ignore
    if (typeof supabase.auth?.getUser === 'function') {
      // @ts-ignore
      const { data } = await supabase.auth.getUser();
      // @ts-ignore
      return data?.user?.id ?? null;
    }
    // @ts-ignore
    return supabase.auth?.user?.id ?? null;
  } catch {
    return null;
  }
}

async function getItemRemote(key: string) {
  const user_id = await getUserId();
  let q = supabase.from('app_kv').select('value').eq('key', key);
  if (user_id) q = q.eq('user_id', user_id);
  const { data, error } = await q.single();
  if (error && error.code !== 'PGRST116') {
    // PGRST116: no rows found for select single - treat as null
    throw error;
  }
  return data?.value ?? null;
}

async function setItemRemote(key: string, value: any) {
  const user_id = await getUserId();
  const payload: any = { key, value, updated_at: new Date().toISOString() };
  if (user_id) payload.user_id = user_id;
  const { error } = await supabase.from('app_kv').upsert(payload, { onConflict: 'key' });
  if (error) throw error;
}

async function removeItemRemote(key: string) {
  const user_id = await getUserId();
  let q: any = supabase.from('app_kv').delete().eq('key', key);
  if (user_id) q = q.eq('user_id', user_id);
  const { error } = await q;
  if (error) throw error;
}

export async function getItem(key: string): Promise<string | null> {
  if (!isBrowser) return null;
  try {
    const remote = await getItemRemote(key);
    if (remote === null) return null;
    return typeof remote === 'string' ? remote : JSON.stringify(remote);
  } catch (e) {
    // fallback to localStorage
    try { return window.localStorage.getItem(key); } catch { return null; }
  }
}

export async function setItem(key: string, value: string | object): Promise<void> {
  if (!isBrowser) return;
  const payload = typeof value === 'string' ? value : JSON.parse(JSON.stringify(value));
  try {
    await setItemRemote(key, payload);
    try { window.localStorage.setItem(key, typeof payload === 'string' ? payload : JSON.stringify(payload)); } catch {}
  } catch (e) {
    try { window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch {}
  }
}

export async function removeItem(key: string): Promise<void> {
  if (!isBrowser) return;
  try {
    await removeItemRemote(key);
    try { window.localStorage.removeItem(key); } catch {}
  } catch (e) {
    try { window.localStorage.removeItem(key); } catch {}
  }
}

export default {
  getItem,
  setItem,
  removeItem,
};
