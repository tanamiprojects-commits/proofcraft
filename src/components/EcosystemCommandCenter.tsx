"use client";
import React, { useEffect, useState } from "react";
import { Activity, ExternalLink, Globe, Layers, RefreshCw, ShieldCheck, Sliders, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStudioLang } from "@/lib/i18n-engine";
import { VipGrantRecord } from "@/lib/vip-access-engine";
import { VaultResetTicket } from "@/lib/vault-admin-sync";

interface NodeStatus {
  id: string; name: string; roleHe: string; roleEn: string;
  publicUrl: string; adminUrl: string; online: boolean | null; ms: number | null;
  mode?: "active" | "maintenance";
}

export default function EcosystemCommandCenter() {
  const { isHe } = useStudioLang();
  const mainSite = "https://" + "tanami360.com";
  const subSite = "https://" + "studio" + ".tanami360.com";

  const defaultNodes: NodeStatus[] = [
    { id: "proofcraft", name: "ProofCraft Fintech OS", roleHe: "חדר בקרה ראשי · בנייה, שותפים ורשת אורגנית", roleEn: "Master OS · Builder, Affiliate & Organic Ring", publicUrl: subSite, adminUrl: "/admin", online: null, ms: null, mode: "active" },
    { id: "tanami360", name: "Tanami360 & SmartForm AI", roleHe: "פלטפורמת מסמכים, קטלוג שירותים וזכויות", roleEn: "Civic Documents, Catalog & Rights", publicUrl: mainSite, adminUrl: `${mainSite}/admin`, online: null, ms: null, mode: "active" },
    { id: "studio-biz", name: "Tanami360 Studio (Herzliya)", roleHe: "כרטיס ביקור עסקי, פרויקטים ולידים לסטודיו", roleEn: "Executive Studio, Projects & Client Leads", publicUrl: `${mainSite}/studio`, adminUrl: `${mainSite}/admin`, online: null, ms: null, mode: "active" },
  ];

  const [nodes, setNodes] = useState<NodeStatus[]>(defaultNodes);
  const [checking, setChecking] = useState(false);
  const [syncState, setSyncState] = useState<string>("");
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeUrl, setNewNodeUrl] = useState("");
  const [newNodeAdmin, setNewNodeAdmin] = useState("");
  const [vaultEnabled, setVaultEnabled] = useState(true);
  const [vaultNotice, setVaultNotice] = useState("");
  const [recoveryUnlockCode, setRecoveryUnlockCode] = useState("");
  const [requireAdminReset, setRequireAdminReset] = useState(true);
  const [vaultTickets, setVaultTickets] = useState<VaultResetTicket[]>([]);
  const [vipGrants, setVipGrants] = useState<VipGrantRecord[]>([]);
  const [vipEmail, setVipEmail] = useState("");
  const [vipLevel, setVipLevel] = useState<2 | 3 | 4>(4);
  const [vipLabel, setVipLabel] = useState("");
  const [vipCopied, setVipCopied] = useState("");
  const persistNodes = async (next: NodeStatus[]) => {
    setNodes(next);
    localStorage.setItem("pc_admin_custom_nodes_v1", JSON.stringify(next));
    setSyncState(isHe ? "מסנכרן לענן..." : "Syncing...");
    const cleanForCloud = next.map(({ online, ms, ...rest }) => rest);
    await supabase.from("site_settings").upsert({ key: "ecosystem_nodes", value: cleanForCloud, updated_at: new Date().toISOString() });
    setSyncState(isHe ? "מסונכרן בענן ✓" : "Cloud Synced ✓");
    setTimeout(() => setSyncState(""), 2500);
  };

  const probeList = async (list: NodeStatus[]) => {
    setChecking(true);
    const updated = await Promise.all(
      list.map(async (n) => {
        const t0 = performance.now();
        try {
          await fetch(n.publicUrl, { mode: "no-cors", cache: "no-store" });
          return { ...n, online: true, ms: Math.round(performance.now() - t0) };
        } catch {
          return { ...n, online: false, ms: null };
        }
      })
    );
    setNodes(updated);
    setChecking(false);
  };

  useEffect(() => {
    (async () => {
      let initial = defaultNodes;
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "ecosystem_nodes").single();
        if (Array.isArray(data?.value) && data.value.length > 0) initial = data.value;
        else {
          const saved = localStorage.getItem("pc_admin_custom_nodes_v1");
          if (saved) initial = JSON.parse(saved);
        }
      } catch {}
      setNodes(initial);
      try { const { data: vg } = await supabase.from("site_settings").select("value").eq("key", "vip_access_grants").single(); if (Array.isArray(vg?.value)) setVipGrants(vg.value);
      try { const { data: vt } = await supabase.from("site_settings").select("value").eq("key", "vault_reset_tickets").single(); if (Array.isArray(vt?.value)) setVaultTickets(vt.value); } catch {} } catch {}
      try { const { data: vSet } = await supabase.from("site_settings").select("value").eq("key", "vault_governance").single(); if (vSet?.value) { setVaultEnabled(vSet.value.enabled !== false); setVaultNotice(vSet.value.notice || ""); setRequireAdminReset(vSet.value.requireAdminForReset !== false); } } catch {}
      probeList(initial);
    })();
  }, []);

    const saveVipGrants = async (next: VipGrantRecord[]) => {
    setVipGrants(next);
    await supabase.from("site_settings").upsert({ key: "vip_access_grants", value: next, updated_at: new Date().toISOString() });
    setSyncState(isHe ? "הרשאות VIP סונכרנו לענן ✓" : "VIP Grants Synced ✓");
    setTimeout(() => setSyncState(""), 2500);
  };
  const addVipGrant = () => {
    if (!vipEmail.trim() && !vipLabel.trim()) return;
    const code = "VIP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const rec: VipGrantRecord = { id: `vip-${Date.now()}`, email: vipEmail.trim().toLowerCase(), inviteCode: code, grantedLevel: vipLevel, label: vipLabel.trim() || (isHe ? "שגריר / VIP מאושר" : "Approved VIP"), active: true, createdAt: new Date().toISOString() };
    saveVipGrants([rec, ...vipGrants]);
    setVipEmail(""); setVipLabel("");
  };
  const toggleVipActive = (id: string) => saveVipGrants(vipGrants.map((g) => (g.id === id ? { ...g, active: !g.active } : g)));
  const removeVipGrant = (id: string) => saveVipGrants(vipGrants.filter((g) => g.id !== id));
    const updateVaultTickets = async (next: VaultResetTicket[]) => {
    setVaultTickets(next);
    await fetch("/api/vault-governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "vault_reset_tickets", value: next }) });
    setSyncState(isHe ? "תור אימות הכספת סונכרן ✓" : "Vault Verification Queue Synced ✓");
    setTimeout(() => setSyncState(""), 2500);
  };
  const approveVaultTicket = (id: string) => {
    const code = "VLT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setRecoveryUnlockCode(code);
    updateVaultTickets(vaultTickets.map((t) => (t.id === id ? { ...t, status: "approved", approvalCode: code } : t)));
  };
  const rejectVaultTicket = (id: string) => updateVaultTickets(vaultTickets.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)));
  const issueBlindRecoveryCode = async () => { const code = "REC-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + Date.now().toString(36).toUpperCase(); setRecoveryUnlockCode(code); await supabase.from("site_settings").upsert({ key: "vault_recovery_auth", value: { code, issuedAt: new Date().toISOString() }, updated_at: new Date().toISOString() }); setSyncState(isHe ? "קוד אישור שחזור הונפק ✓" : "Blind Recovery Code Issued ✓"); setTimeout(() => setSyncState(""), 2500); };
      const persistVaultGovToCloud = async (enabledVal: boolean, noticeVal: string, reqAdminVal: boolean) => {
    setRequireAdminReset(reqAdminVal);
    const payload = { enabled: enabledVal, notice: noticeVal, requireAdminForReset: reqAdminVal };
    const r = await fetch("/api/vault-governance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "vault_governance", value: payload }) });
    const j = await r.json();
    if (!r.ok || j.error) { setSyncState(isHe ? `שגיאה: ${j.error || "שמירה נכשלה"}` : `Error: ${j.error}`); }
    else { setSyncState(reqAdminVal ? (isHe ? "נשמר בשרת: אכיפת אישור אדמין פעילה ✓" : "Saved: Admin Lock ON ✓") : (isHe ? "נשמר בשרת: איפוס פתוח למשתמש ✓" : "Saved: Admin Lock OFF ✓")); }
    setTimeout(() => setSyncState(""), 3000);
  };
  const saveVaultGov = async (enabledVal: boolean, noticeVal: string) => { setVaultEnabled(enabledVal); setVaultNotice(noticeVal); await persistVaultGovToCloud(enabledVal, noticeVal, requireAdminReset); };
  const addCustomNode = () => {
    if (!newNodeName.trim() || !newNodeUrl.trim()) return;
    const pub = newNodeUrl.trim().startsWith("http") ? newNodeUrl.trim() : `https://${newNodeUrl.trim()}`;
    const adm = newNodeAdmin.trim() ? (newNodeAdmin.trim().startsWith("http") ? newNodeAdmin.trim() : `https://${newNodeAdmin.trim()}`) : `${pub}/admin`;
    const next: NodeStatus[] = [...nodes, { id: `node-${Date.now()}`, name: newNodeName.trim(), roleHe: "פלטפורמה מנוהלת באקוסיסטם", roleEn: "Managed Ecosystem Node", publicUrl: pub, adminUrl: adm, online: null, ms: null, mode: "active" }];
    persistNodes(next);
    setNewNodeName(""); setNewNodeUrl(""); setNewNodeAdmin("");
  };

  const toggleNodeMode = (id: string) => persistNodes(nodes.map((n) => (n.id === id ? { ...n, mode: n.mode === "maintenance" ? "active" : "maintenance" } : n)));
  const removeNode = (id: string) => persistNodes(nodes.filter((n) => n.id !== id));

  return (
    <section className="card-hero" style={{ padding: 20, marginBottom: 18, borderColor: "rgba(56, 189, 248, 0.35)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
        <div>
          <span className="badge-pill" style={{ background: "rgba(56, 189, 248, 0.16)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)", fontSize: 11 }}>
            <ShieldCheck size={12} /> {isHe ? "חדר בקרה מאוחד · שליטה וסנכרון ענן מלא" : "CLOUD-SYNCED MASTER ADMIN COMMAND CENTER"}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{isHe ? "ניהול ושליטה מרכזית בכל הפלטפורמות ובאתר הסטודיו" : "Central Management Across All Platforms & Studio Site"}</h2>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {syncState && <span style={{ fontSize: 11.5, fontWeight: 700, color: "#34d399" }}>{syncState}</span>}
          <button type="button" onClick={() => probeList(nodes)} disabled={checking} className="btn-ghost" style={{ height: 34, padding: "0 12px", fontSize: 12, color: "#34d399", borderColor: "rgba(52,211,153,0.35)" }}>
            <RefreshCw size={13} /> {checking ? (isHe ? "סורק שרתים..." : "Probing...") : (isHe ? "בדיקת דופק חיה" : "Live Health Probe")}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 10, borderRadius: 12, background: "rgba(201,151,28,0.08)", border: "1px solid rgba(201,151,28,0.28)", marginBottom: 14, alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fbbf24" }}><Sliders size={12} style={{ display: "inline", marginInlineEnd: 4 }} />{isHe ? "שליטה מהירה ב-Tanami360 ובסטודיו:" : "Quick Studio & Main Site Controls:"}</span>
        <a href={`${mainSite}/admin`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#f8fafc" }}>{isHe ? "ניהול פניות ולידים (Studio & Contact)" : "Studio Leads & Contact"}</a>
        <a href={`${mainSite}/studio/projects`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#f8fafc" }}>{isHe ? "תצוגת פרויקטים חיים" : "Live Projects Showcase"}</a>
        <a href={`${mainSite}/catalog`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#f8fafc" }}>{isHe ? "קטלוג שירותים" : "Services Catalog"}</a>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 10, borderRadius: 12, background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.25)", marginBottom: 14, alignItems: "center" }}><span style={{ fontSize: 11.5, fontWeight: 800, color: "#38bdf8" }}>{isHe ? "מוקדי תשתית ואבטחה (גישה מהירה):" : "Cloud & Infra Consoles:"}</span><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }}>Vercel</a><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }}>Supabase</a><a href="https://cloudflare.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }}>Cloudflare DNS</a><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11 }}>GitHub</a><a href="https://google.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#34d399" }}>Google Search Console</a></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 12 }}>
        {nodes.map((node) => (
          <div key={node.id} style={{ padding: 14, borderRadius: 14, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: node.online === false ? "#f87171" : "#34d399", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Activity size={12} /> {node.online === null ? "READY" : node.online ? `ONLINE (${node.ms}ms)` : "OFFLINE"}
                </span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button type="button" onClick={() => toggleNodeMode(node.id)} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, cursor: "pointer", background: node.mode === "maintenance" ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.14)", color: node.mode === "maintenance" ? "#fbbf24" : "#34d399", border: "none", fontWeight: 700 }}>
                    {node.mode === "maintenance" ? "MAINTENANCE" : "ACTIVE"}
                  </button>
                  {node.id.startsWith("node-") && <button type="button" onClick={() => removeNode(node.id)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><Trash2 size={13} /></button>}
                </div>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 900, color: "#f8fafc", marginTop: 6 }}>{node.name}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{isHe ? node.roleHe : node.roleEn}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
              <a href={node.publicUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#cbd5e1" }}><Globe size={12} /> {isHe ? "אתר חי" : "Live Site"}</a>
              {node.adminUrl.startsWith("http") ? (
                <a href={node.adminUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 30, padding: "0 10px", fontSize: 11.5, color: "#38bdf8", borderColor: "rgba(56,189,248,0.35)" }}><ExternalLink size={12} /> {isHe ? "ממשק ניהול" : "Open Admin"}</a>
              ) : (
                <span className="badge-pill" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", fontSize: 11 }}>{isHe ? "פעיל כאן" : "Active Hub"}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <input value={newNodeName} onChange={(e) => setNewNodeName(e.target.value)} placeholder={isHe ? "שם פלטפורמה חדשה" : "New Platform Name"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
        <input value={newNodeUrl} onChange={(e) => setNewNodeUrl(e.target.value)} placeholder="https://tanami360.com" className="input-dark" style={{ height: 34, fontSize: 12 }} />
        <input value={newNodeAdmin} onChange={(e) => setNewNodeAdmin(e.target.value)} placeholder={isHe ? "כתובת אדמין (אופציונלי)" : "Admin URL (optional)"} className="input-dark" style={{ height: 34, fontSize: 12 }} />
        <button type="button" onClick={addCustomNode} className="btn-primary" style={{ height: 34, fontSize: 12, width: "auto" }}>{isHe ? "+ חבר פלטפורמה (סנכרון ענן)" : "+ Connect Platform (Cloud Sync)"}</button>
      </div>
      <div style={{ padding: 14, borderRadius: 14, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.32)", marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <strong style={{ fontSize: 13.5, color: "#fbbf24" }}>{isHe ? "מרכז שליטה ואימות לכספת Zero-Knowledge (ללא חשיפה לתוכן המשתמשים):" : "Zero-Knowledge Vault Governance & Identity Verification (100% Blind):"}</strong>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" onClick={() => saveVaultGov(!vaultEnabled, vaultNotice)} className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: vaultEnabled ? "#34d399" : "#f87171" }}>{vaultEnabled ? (isHe ? "כספת: פעילה" : "Vault: ACTIVE") : (isHe ? "כספת: מושבתת" : "Vault: PAUSED")}</button>
            <button type="button" onClick={async () => { const nextReq = !requireAdminReset; setRequireAdminReset(nextReq); await persistVaultGovToCloud(vaultEnabled, vaultNotice, nextReq); }} className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: requireAdminReset ? "#38bdf8" : "#94a3b8" }}>{requireAdminReset ? (isHe ? "אכיפת אישור אדמין לאיפוס: פעילה" : "Admin Reset Lock: ON") : (isHe ? "אכיפת אישור אדמין: כבויה" : "Admin Reset Lock: OFF")}</button>
            <a href="/vault" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 11, color: "#38bdf8" }}>{isHe ? "פתח כספת ↗" : "Open Vault ↗"}</a>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <input value={vaultNotice} onChange={(e) => setVaultNotice(e.target.value)} placeholder={isHe ? "הודעת אבטחה עליונה בכספת (אופציונלי)..." : "Top security banner notice in Vault..."} className="input-dark" style={{ flex: 1, minWidth: 220, height: 32, fontSize: 11.5 }} />
          <button type="button" onClick={() => saveVaultGov(vaultEnabled, vaultNotice)} className="btn-primary" style={{ height: 32, padding: "0 12px", fontSize: 11.5, width: "auto" }}>{isHe ? "שמור מדיניות" : "Save Policy"}</button>
        </div>
        {vaultTickets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#cbd5e1" }}>{isHe ? "בקשות משתמשים להחלפת / איפוס סיסמת כספת (אמת זהות לפני אישור):" : "User Password Reset Requests (Verify Identity Before Approving):"}</div>
            {vaultTickets.map((tk) => (
              <div key={tk.id} style={{ padding: "8px 12px", borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 11.5 }}>
                <div><strong style={{ color: "#f8fafc" }}>{tk.userEmail}</strong> · <span style={{ color: "#38bdf8" }}>{tk.requestType === "recover_with_key" ? (isHe ? "שחזור עם קוד אישי" : "Key Recovery") : (isHe ? "איפוס מלא מאפס" : "Full Wipe Reset")}</span> · <span style={{ color: "#94a3b8" }}>{tk.verificationNote}</span> {tk.approvalCode && <code style={{ color: "#34d399", marginInlineStart: 6 }}>[{tk.approvalCode}]</code>}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {tk.status === "pending" ? (<><button type="button" onClick={() => approveVaultTicket(tk.id)} className="btn-primary" style={{ height: 26, padding: "0 10px", fontSize: 10.5, width: "auto" }}>{isHe ? "אשר והנפק קוד אימות" : "Approve & Issue Code"}</button><button type="button" onClick={() => rejectVaultTicket(tk.id)} className="btn-ghost" style={{ height: 26, padding: "0 8px", fontSize: 10.5, color: "#f87171" }}>{isHe ? "דחה" : "Reject"}</button></>) : (<span style={{ fontSize: 11, fontWeight: 800, color: tk.status === "approved" ? "#34d399" : "#f87171" }}>{tk.status.toUpperCase()}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}