import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

let memGov = { enabled: true, notice: "", requireAdminForReset: true };
let memTickets: unknown[] = [];

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return url && key ? createClient(url, key) : null;
}

export async function GET() {
  try {
    const db = getDb();
    if (db) {
      const { data: g } = await db.from("site_settings").select("value").eq("key", "vault_governance").maybeSingle();
      const { data: t } = await db.from("site_settings").select("value").eq("key", "vault_reset_tickets").maybeSingle();
      if (g?.value) memGov = g.value;
      if (Array.isArray(t?.value)) memTickets = t.value;
    }
  } catch {}
  return NextResponse.json({ governance: memGov, tickets: memTickets });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const key = body.key === "vault_reset_tickets" ? "vault_reset_tickets" : "vault_governance";
    if (key === "vault_governance") memGov = body.value;
    else memTickets = body.value;
    const db = getDb();
    if (db) {
      const { data: exists } = await db.from("site_settings").select("key").eq("key", key).maybeSingle();
      if (exists) await db.from("site_settings").update({ value: body.value, updated_at: new Date().toISOString() }).eq("key", key);
      else await db.from("site_settings").insert({ key, value: body.value, updated_at: new Date().toISOString() });
    }
    return NextResponse.json({ ok: true, value: body.value });
  } catch (e: unknown) {
    return NextResponse.json({ ok: true, fallback: true, error: String(e) });
  }
}
