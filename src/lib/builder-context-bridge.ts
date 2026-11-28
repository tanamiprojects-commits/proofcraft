"use client";

export interface ActiveBuilderContext {
  nicheLabel: string;
  projectTitle: string;
  projectSummary: string;
  liveUrl: string;
  isDemoUrl: boolean;
  domainPresetId: "landing" | "saas" | "commerce" | "ai";
  updatedAt: string;
}

const STORAGE_KEY = "pc_active_builder_context_v1";
const DEMO_HOSTS = ["://tanami360.com", "example.com", "localhost"];

export function isSampleOrDemoUrl(url: string): boolean {
  const clean = (url || "").trim().toLowerCase();
  if (!clean) return false;
  return DEMO_HOSTS.some((h) => clean.includes(h));
}

export function inferDomainPresetId(labelOrTitle: string): "landing" | "saas" | "commerce" | "ai" {
  const txt = (labelOrTitle || "").toLowerCase();
  if (txt.includes("pay") || txt.includes("stripe") || txt.includes("commerce") || txt.includes("סליקה") || txt.includes("חנות")) return "commerce";
  if (txt.includes("saas") || txt.includes("cloud") || txt.includes("crm") || txt.includes("מערכת")) return "saas";
  if (txt.includes("landing") || txt.includes("funnel") || txt.includes("נחיתה") || txt.includes("שיווק")) return "landing";
  return "ai";
}

export function readActiveBuilderContext(): ActiveBuilderContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveBuilderContext;
    return parsed && parsed.projectTitle ? parsed : null;
  } catch {
    return null;
  }
}

export function saveActiveBuilderContext(partial: Partial<ActiveBuilderContext>): ActiveBuilderContext | null {
  if (typeof window === "undefined") return null;
  const prev = readActiveBuilderContext();
  const nextTitle = partial.projectTitle ?? prev?.projectTitle ?? "";
  const nextNiche = partial.nicheLabel ?? prev?.nicheLabel ?? "";
  const nextUrl = partial.liveUrl ?? prev?.liveUrl ?? "";
  const next: ActiveBuilderContext = {
    nicheLabel: nextNiche,
    projectTitle: nextTitle,
    projectSummary: partial.projectSummary ?? prev?.projectSummary ?? "",
    liveUrl: nextUrl,
    isDemoUrl: isSampleOrDemoUrl(nextUrl),
    domainPresetId: partial.domainPresetId ?? inferDomainPresetId(`${nextNiche} ${nextTitle}`),
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("proofcraft:builder-context-updated", { detail: next }));
  } catch {}
  return next;
}