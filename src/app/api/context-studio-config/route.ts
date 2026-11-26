import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ContextStudioConfig, DEFAULT_STUDIO_CONFIG } from '@/lib/context-packet-engine';

let inMemoryConfig: ContextStudioConfig = { ...DEFAULT_STUDIO_CONFIG };

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'context_studio_config').maybeSingle();
      if (data?.value && typeof data.value === 'object') {
        inMemoryConfig = { ...DEFAULT_STUDIO_CONFIG, ...(data.value as Partial<ContextStudioConfig>) };
      }
    }
    return NextResponse.json({ ok: true, config: inMemoryConfig });
  } catch {
    return NextResponse.json({ ok: true, config: inMemoryConfig });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    inMemoryConfig = { ...inMemoryConfig, ...(body?.config || {}) };
    const supabase = getSupabaseAdmin();
    let persistedToDb = false;
    if (supabase) {
      const { error } = await supabase.from('site_settings').upsert(
        { key: 'context_studio_config', value: inMemoryConfig, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      if (!error) persistedToDb = true;
    }
    return NextResponse.json({ ok: true, config: inMemoryConfig, persistedToDb });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Invalid payload' }, { status: 400 });
  }
}