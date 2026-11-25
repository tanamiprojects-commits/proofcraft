import { supabase } from "@/lib/supabase";

export interface WatchdogReport {
  checkedLinks: number;
  flaggedUnsafe: number;
  autoHealedLinks: number;
  pendingModeration: number;
  openTickets: number;
  ranAt: string;
}

export async function runAutonomousMaintenance(silent = true): Promise<WatchdogReport> {
  const nowIso = new Date().toISOString();
  const [{ data: allLinks }, { count: pendingPosts }, { count: openTickets }] = await Promise.all([
    supabase.from("aff_links").select("id, destination_url, health_status").limit(250),
    supabase.from("feed_posts").select("*", { count: "exact", head: true }).eq("is_approved", false),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  let flaggedUnsafe = 0;
  let autoHealedLinks = 0;

  for (const lk of allLinks || []) {
    const url = String(lk.destination_url || "").trim();
    const isHttps = url.startsWith("https://") && url.length >= 12 && !url.includes("javascript:");
    if (!isHttps && lk.health_status === "active") {
      await supabase.from("aff_links").update({ health_status: "needs_update" }).eq("id", lk.id);
      flaggedUnsafe++;
    } else if (isHttps && lk.health_status === "needs_update") {
      await supabase.from("aff_links").update({ health_status: "active" }).eq("id", lk.id);
      autoHealedLinks++;
    }
  }

  if (!silent || flaggedUnsafe > 0 || autoHealedLinks > 0) {
    await supabase.from("admin_audit_logs").insert({
      action_title: "24/7 Autonomous Watchdog Sweep",
      target_info: `Checked ${(allLinks || []).length} links | Flagged: ${flaggedUnsafe} | Healed: ${autoHealedLinks} | Pending Queue: ${pendingPosts || 0}`,
    });
  }

  return {
    checkedLinks: (allLinks || []).length,
    flaggedUnsafe,
    autoHealedLinks,
    pendingModeration: pendingPosts || 0,
    openTickets: openTickets || 0,
    ranAt: nowIso,
  };
}