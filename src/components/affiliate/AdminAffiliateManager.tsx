"use client";

import React, { useEffect, useState } from "react";
import { Shield, Plus, Save, Trash2, ExternalLink, Sparkles, DollarSign, TrendingUp, CheckCircle2, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AffLink, AffNetwork, AffPromptItem } from "@/lib/affiliate-store";
import { DEFAULT_GOVERNANCE, HubGovernanceConfig } from "@/components/affiliate/AffiliateBeginnerAcademy";

interface ExtendedNetwork extends AffNetwork {
  is_custom?: boolean;
  approval_status?: string;
}

export default function AdminAffiliateManager({ onNotify }: { onNotify: (msg: string) => void }) {
  const [networks, setNetworks] = useState<ExtendedNetwork[]>([]);
  const [prompts, setPrompts] = useState<AffPromptItem[]>([]);
  const [links, setLinks] = useState<AffLink[]>([]);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [proPriceUsd, setProPriceUsd] = useState<number>(29);
  const [proPriceIls, setProPriceIls] = useState<number>(99);
  const [gov, setGov] = useState<HubGovernanceConfig>(DEFAULT_GOVERNANCE);
  const [newFaqQHe, setNewFaqQHe] = useState("");
  const [newFaqAHe, setNewFaqAHe] = useState("");
  const [newFaqQEn, setNewFaqQEn] = useState("");
  const [newFaqAEn, setNewFaqAEn] = useState("");
  const [loading, setLoading] = useState(true);

  const [pCat, setPCat] = useState("Social Ad Copy");
  const [pTool, setPTool] = useState("ChatGPT / Claude");
  const [pUrl, setPUrl] = useState("https://chatgpt.com");
  const [pTitleEn, setPTitleEn] = useState("");
  const [pTitleHe, setPTitleHe] = useState("");
  const [pBodyEn, setPBodyEn] = useState("");
  const [pBodyHe, setPBodyHe] = useState("");
  const [pProOnly, setPProOnly] = useState(false);

  const loadAdminAffData = async () => {
    setLoading(true);
    const [nRes, pRes, lRes, sRes, rRes, gRes] = await Promise.all([
      supabase.from("aff_networks").select("*").order("sort_order", { ascending: true }),
      supabase.from("aff_prompt_vault").select("*").order("sort_order", { ascending: true }),
      supabase.from("aff_links").select("*").order("created_at", { ascending: false }).limit(80),
      supabase.from("site_settings").select("*").eq("key", "affiliate_pro_pricing").single(),
      supabase.from("profiles").select("id", { count: "exact", head: true }).not("affiliate_referral_code", "is", null),
      supabase.from("site_settings").select("*").eq("key", "affiliate_hub_governance").single(),
    ]);
    if (nRes.data) setNetworks(nRes.data as ExtendedNetwork[]);
    if (pRes.data) setPrompts(pRes.data as AffPromptItem[]);
    if (lRes.data) setLinks(lRes.data as AffLink[]);
    if (typeof rRes.count === "number") setReferralCount(rRes.count);
    if (sRes.data?.value) {
      setProPriceUsd(Number(sRes.data.value.usd || 29));
      setProPriceIls(Number(sRes.data.value.ils || 99));
    }
    if (gRes.data?.value) setGov({ ...DEFAULT_GOVERNANCE, ...gRes.data.value });
    setLoading(false);
  };

  useEffect(() => { loadAdminAffData(); }, []);

  const saveGovernance = async (nextGov: HubGovernanceConfig = gov) => {
    await supabase.from("site_settings").upsert({ key: "affiliate_hub_governance", value: nextGov });
    setGov(nextGov);
    onNotify("Track 1 Beginner Academy & Governance synced live!");
  };

  const addCustomFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQHe.trim() || !newFaqAHe.trim()) return;
    const next = {
      ...gov,
      custom_faqs: [...gov.custom_faqs, { q_he: newFaqQHe.trim(), a_he: newFaqAHe.trim(), q_en: newFaqQEn.trim() || newFaqQHe.trim(), a_en: newFaqAEn.trim() || newFaqAHe.trim() }],
    };
    setNewFaqQHe(""); setNewFaqAHe(""); setNewFaqQEn(""); setNewFaqAEn("");
    await saveGovernance(next);
  };

  const removeFaq = async (idx: number) => {
    const next = { ...gov, custom_faqs: gov.custom_faqs.filter((_, i) => i !== idx) };
    await saveGovernance(next);
  };
  const saveProPricing = async () => {
    await supabase.from("site_settings").upsert({ key: "affiliate_pro_pricing", value: { usd: proPriceUsd, ils: proPriceIls } });
    onNotify(`Affiliate Pro pricing saved ($${proPriceUsd} / ₪${proPriceIls})!`);
  };

  const toggleNetworkActive = async (net: ExtendedNetwork) => {
    await supabase.from("aff_networks").update({ is_active: !net.is_active }).eq("id", net.id);
    await loadAdminAffData();
    onNotify(`Updated ${net.name_en} visibility.`);
  };

  const approveCustomNetwork = async (netId: string, name: string) => {
    await supabase.from("aff_networks").update({ approval_status: "approved", is_active: true }).eq("id", netId);
    await loadAdminAffData();
    onNotify(`Approved custom network: ${name}`);
  };

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitleEn.trim() || !pBodyEn.trim()) return;
    await supabase.from("aff_prompt_vault").insert({
      category: pCat, tool_name: pTool, tool_url: pUrl, title_en: pTitleEn.trim(), title_he: pTitleHe.trim() || pTitleEn.trim(),
      prompt_template_en: pBodyEn.trim(), prompt_template_he: pBodyHe.trim() || pBodyEn.trim(), output_type: "ad_copy", is_pro_only: pProOnly, sort_order: prompts.length + 1,
    });
    setPTitleEn(""); setPTitleHe(""); setPBodyEn(""); setPBodyHe("");
    await loadAdminAffData();
    onNotify("New AI Bridge prompt added!");
  };

  const setLinkModeration = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("aff_links").update({ moderation_status: status, is_public_deal: status === "approved" }).eq("id", id);
    await loadAdminAffData();
    onNotify(`Deal link ${status.toUpperCase()}!`);
  };

  const deleteLink = async (id: string) => {
    await supabase.from("aff_links").delete().eq("id", id);
    await loadAdminAffData();
    onNotify("Removed affiliate link.");
  };

  if (loading) return <div style={{ padding: 24, color: "#94a3b8" }}>Loading Affiliate Hub Governance...</div>;

  const publicDealsCount = links.filter((l) => l.is_public_deal).length;
  const totalClicksCount = links.reduce((acc, l) => acc + Number(l.click_count || 0), 0);
  const pendingNetworks = networks.filter((n) => n.is_custom && n.approval_status === "pending");

  return (
    <div dir="ltr" style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card-surface" style={{ padding: 18, border: "1px solid rgba(52, 211, 153, 0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <BookOpen size={16} color="#34d399" />
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}>Track 1 Beginner Academy & Live Hub Governance (No-Code)</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <input type="text" dir="rtl" value={gov.hero_notice_he} onChange={(e) => setGov({ ...gov, hero_notice_he: e.target.value })} placeholder="באנר הנחיה ראשי בעברית" className="input-dark" style={{ fontSize: 12 }} />
          <input type="text" value={gov.hero_notice_en} onChange={(e) => setGov({ ...gov, hero_notice_en: e.target.value })} placeholder="Hero Mission Banner (EN)" className="input-dark" style={{ fontSize: 12 }} />
        </div>
        <button type="button" onClick={() => saveGovernance()} className="btn-primary" style={{ width: "auto", height: 34, padding: "0 14px", fontSize: 12, marginBottom: 14 }}>
          <Save size={13} /> Save Live Mission Banner
        </button>
        <form onSubmit={addCustomFaq} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          <input type="text" dir="rtl" value={newFaqQHe} onChange={(e) => setNewFaqQHe(e.target.value)} placeholder="שאלה חדשה למתחילים (עברית)" className="input-dark" style={{ fontSize: 12 }} />
          <input type="text" value={newFaqQEn} onChange={(e) => setNewFaqQEn(e.target.value)} placeholder="New Beginner Question (EN)" className="input-dark" style={{ fontSize: 12 }} />
          <textarea rows={2} dir="rtl" value={newFaqAHe} onChange={(e) => setNewFaqAHe(e.target.value)} placeholder="תשובה ברורה למתחילים (עברית)" className="input-dark" style={{ fontSize: 12 }} />
          <textarea rows={2} value={newFaqAEn} onChange={(e) => setNewFaqAEn(e.target.value)} placeholder="Clear Beginner Answer (EN)" className="input-dark" style={{ fontSize: 12 }} />
          <button type="submit" className="btn-primary" style={{ width: "auto", height: 34, fontSize: 12 }}><Plus size={13} /> Add FAQ to Track 1</button>
        </form>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {gov.custom_faqs.map((fq, idx) => (
            <div key={idx} style={{ padding: 8, borderRadius: 8, background: "#0a0b0e", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span dir="rtl" style={{ fontSize: 12, color: "#cbd5e1" }}>{fq.q_he}</span>
              <button type="button" onClick={() => removeFaq(idx)} className="btn-ghost" style={{ height: 26, padding: "0 8px", color: "#f87171" }}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="card-surface" style={{ padding: 18, border: "1px solid rgba(56, 189, 248, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <TrendingUp size={16} color="#38bdf8" /><h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}>Organic Growth & Viral Telemetry</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 11, color: "#94a3b8" }}>Public Deals Live</div><div style={{ fontSize: 20, fontWeight: 900, color: "#34d399" }}>{publicDealsCount}</div></div>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 11, color: "#94a3b8" }}>Pending Networks</div><div style={{ fontSize: 20, fontWeight: 900, color: pendingNetworks.length > 0 ? "#fbbf24" : "#f8fafc" }}>{pendingNetworks.length}</div></div>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 11, color: "#94a3b8" }}>Total Tracked Clicks</div><div style={{ fontSize: 20, fontWeight: 900, color: "#38bdf8" }}>{totalClicksCount}</div></div>
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e" }}><div style={{ fontSize: 11, color: "#94a3b8" }}>Referral Profiles</div><div style={{ fontSize: 20, fontWeight: 900, color: "#818cf8" }}>{referralCount}</div></div>
        </div>
        {pendingNetworks.map((pn) => (
          <div key={pn.id} style={{ marginTop: 10, padding: 10, borderRadius: 10, background: "rgba(251, 191, 36, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#fde68a" }}>Pending Network: {pn.name_en}</span>
            <button type="button" onClick={() => approveCustomNetwork(pn.id, pn.name_en)} className="btn-primary" style={{ width: "auto", height: 30, fontSize: 11 }}><CheckCircle2 size={12} /> Approve</button>
          </div>
        ))}
      </div>

      <div className="card-surface" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc" }}><DollarSign size={16} style={{ display: "inline", color: "#34d399" }} /> Affiliate Pro Pricing</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="number" value={proPriceUsd} onChange={(e) => setProPriceUsd(Number(e.target.value) || 29)} className="input-dark" style={{ width: 85, height: 36 }} />
          <input type="number" value={proPriceIls} onChange={(e) => setProPriceIls(Number(e.target.value) || 99)} className="input-dark" style={{ width: 85, height: 36 }} />
          <button type="button" onClick={saveProPricing} className="btn-primary" style={{ width: "auto", height: 36, fontSize: 12 }}><Save size={13} /> Save</button>
        </div>
      </div>

      <div className="card-surface" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 10 }}><Shield size={16} style={{ display: "inline", color: "#38bdf8", marginRight: 6 }} />Partner Networks ({networks.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {networks.map((n) => (
            <div key={n.id} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><strong style={{ fontSize: 13, color: "#f8fafc" }}>{n.name_en}</strong> <span style={{ fontSize: 11, color: "#38bdf8" }}>({n.commission_range})</span></div>
              <button type="button" onClick={() => toggleNetworkActive(n)} className="btn-ghost" style={{ height: 30, fontSize: 11, color: n.is_active ? "#34d399" : "#f87171" }}>{n.is_active ? "ACTIVE" : "DISABLED"}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 10 }}><Sparkles size={16} style={{ display: "inline", color: "#fbbf24", marginRight: 6 }} />AI Bridge Prompt Vault ({prompts.length})</h3>
        <form onSubmit={handleAddPrompt} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input type="text" value={pTitleEn} onChange={(e) => setPTitleEn(e.target.value)} placeholder="Prompt Title (EN)" className="input-dark" style={{ fontSize: 12 }} />
          <input type="text" value={pTitleHe} onChange={(e) => setPTitleHe(e.target.value)} placeholder="כותרת פרומפט (עברית)" className="input-dark" style={{ fontSize: 12 }} />
          <input type="text" value={pTool} onChange={(e) => setPTool(e.target.value)} placeholder="Tool Name" className="input-dark" style={{ fontSize: 12 }} />
          <input type="url" value={pUrl} onChange={(e) => setPUrl(e.target.value)} placeholder="https://..." className="input-dark" style={{ fontSize: 12 }} />
          <textarea rows={2} value={pBodyEn} onChange={(e) => setPBodyEn(e.target.value)} placeholder="English template" className="input-dark" style={{ fontSize: 12 }} />
          <textarea rows={2} value={pBodyHe} onChange={(e) => setPBodyHe(e.target.value)} placeholder="תבנית בעברית" className="input-dark" style={{ fontSize: 12 }} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1" }}><input type="checkbox" checked={pProOnly} onChange={(e) => setPProOnly(e.target.checked)} /> Pro Only</label>
          <button type="submit" className="btn-primary" style={{ height: 36, fontSize: 12 }}><Plus size={13} /> Add Prompt</button>
        </form>
      </div>

      <div className="card-surface" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#f8fafc", marginBottom: 10 }}>Live Smart Links Audit ({links.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
          {links.map((lk) => (
            <div key={lk.id} style={{ padding: 10, borderRadius: 10, background: "#0a0b0e", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12 }}><strong style={{ color: "#f8fafc" }}>{lk.product_title}</strong> <span style={{ color: "#38bdf8" }}>({lk.network_slug} · {lk.click_count} clicks)</span></div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => setLinkModeration(lk.id, "approved")} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 10.5, color: "#34d399" }}>Approve</button>
                <button type="button" onClick={() => setLinkModeration(lk.id, "rejected")} className="btn-ghost" style={{ height: 28, padding: "0 8px", fontSize: 10.5, color: "#fbbf24" }}>Block</button>
                <a href={`/affiliate/deal/${lk.slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ height: 28, padding: "0 8px" }}><ExternalLink size={12} /></a>
                <button type="button" onClick={() => deleteLink(lk.id)} className="btn-ghost" style={{ height: 28, padding: "0 8px", color: "#f87171" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}