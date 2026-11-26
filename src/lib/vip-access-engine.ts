import { supabase } from "./supabase";

export interface VipGrantRecord {
  id: string;
  email: string;
  inviteCode: string;
  grantedLevel: 2 | 3 | 4;
  label: string;
  active: boolean;
  createdAt: string;
}

export async function resolveVipGrantForUser(email: string | null): Promise<VipGrantRecord | null> {
  try {
    let savedCode = "";
    if (typeof window !== "undefined") {
      const urlCode = new URLSearchParams(window.location.search).get("vip");
      if (urlCode && urlCode.trim()) {
        savedCode = urlCode.trim().toUpperCase();
        localStorage.setItem("pc_vip_invite_code", savedCode);
      } else {
        savedCode = (localStorage.getItem("pc_vip_invite_code") || "").toUpperCase();
      }
    }
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail && !savedCode) return null;

    const { data } = await supabase.from("site_settings").select("value").eq("key", "vip_access_grants").single();
    const list: VipGrantRecord[] = Array.isArray(data?.value) ? data.value : [];
    const match = list.find((g) => g.active && ((cleanEmail && g.email.toLowerCase() === cleanEmail) || (savedCode && g.inviteCode.toUpperCase() === savedCode)));
    return match || null;
  } catch {
    return null;
  }
}
