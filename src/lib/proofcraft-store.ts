export interface VerificationStep {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badgeName: string;
  assetUnlocked: string;
  points: number;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "url" | "select";
    options?: string[];
    minLength?: number;
  }[];
}

export interface BuilderProfile {
  fullName: string;
  headline: string;
  yearsWithAI: string;
  primaryTools: string;
  architectureCase: string;
  projectTitle: string;
  projectLiveUrl: string;
  projectProblemSolved: string;
  debuggingStory: string;
  portfolioPitch: string;
  targetAudience: string;
  shareOnFeed: boolean;
  completedStepIds: string[];
  adminVerified: boolean;
  certificateId: string;
  updatedAt: string;
}

export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: "step-identity",
    number: 1,
    title: "Builder Identity & AI Stack",
    subtitle: "Define your core engineering focus, AI experience, and production toolset.",
    badgeName: "AI-Native Builder",
    assetUnlocked: "Verified Builder Identity Card",
    points: 15,
    fields: [
      { key: "fullName", label: "Full Name", placeholder: "e.g., Alex Mercer", type: "text", minLength: 2 },
      { key: "headline", label: "Engineering Headline", placeholder: "Full-Stack AI Systems & SaaS Builder", type: "text", minLength: 8 },
      { key: "yearsWithAI", label: "AI Engineering Experience", placeholder: "Select experience", type: "select", options: ["1-2 Years", "2-3 Years", "3+ Years Production AI Engineering"] },
      { key: "primaryTools", label: "Active Tools & Stack", placeholder: "Cursor, Next.js, TypeScript, Supabase, Vercel", type: "text", minLength: 4 },
    ],
  },
  {
    id: "step-architecture",
    number: 2,
    title: "System Architecture Proof",
    subtitle: "Demonstrate normalized database design, screen hierarchy, and RLS permissions.",
    badgeName: "System Architect",
    assetUnlocked: "Architecture Case Study Section",
    points: 20,
    fields: [
      { key: "architectureCase", label: "Describe your system architecture, data model, and user flows", placeholder: "Detail core entities, auth roles, and RLS isolation...", type: "textarea", minLength: 25 },
    ],
  },
  {
    id: "step-deployment",
    number: 3,
    title: "Live Production Deployment Proof",
    subtitle: "Attach a real deployed production application as an anchor in your portfolio.",
    badgeName: "Shipped & Live",
    assetUnlocked: "First Verified Live Portfolio Asset",
    points: 20,
    fields: [
      { key: "projectTitle", label: "Project Title", placeholder: "AI Booking & Operations SaaS", type: "text", minLength: 3 },
      { key: "projectLiveUrl", label: "Live Production HTTPS URL", placeholder: "https://...", type: "url", minLength: 6 },
      { key: "projectProblemSolved", label: "What business problem does this solve?", placeholder: "Describe the market problem and engineered solution...", type: "textarea", minLength: 20 },
    ],
  },
  {
    id: "step-debugging",
    number: 4,
    title: "Debugging & Root-Cause Resolution Proof",
    subtitle: "Document a complex integration or security bug you diagnosed and resolved.",
    badgeName: "Problem Solver",
    assetUnlocked: "Engineering Reliability Badge",
    points: 15,
    fields: [
      { key: "debuggingStory", label: "Describe the issue and how you engineered the fix", placeholder: "Explain the root cause and verification steps...", type: "textarea", minLength: 25 },
    ],
  },
  {
    id: "step-portfolio",
    number: 5,
    title: "Commercial Value Proposition",
    subtitle: "Package your engineering capabilities into a clear offer for clients or hiring teams.",
    badgeName: "Market Ready",
    assetUnlocked: "Shareable Public Verified Portfolio",
    points: 15,
    fields: [
      { key: "portfolioPitch", label: "Your value proposition for clients or partners", placeholder: "I engineer production AI web apps and automated workflows in days...", type: "textarea", minLength: 20 },
      { key: "targetAudience", label: "Primary Goal", placeholder: "Select goal", type: "select", options: ["B2B SaaS Clients & Technical Hiring Teams", "Senior AI Engineering Roles", "Startup Co-Founder / Venture Building"] },
    ],
  },
  {
    id: "step-community",
    number: 6,
    title: "Community Proof Feed & Credential Lock",
    subtitle: "Share your live asset with fellow builders for peer review and organic reach.",
    badgeName: "Certified ProofCrafter",
    assetUnlocked: "Official Builder Credential + Feed Spotlight",
    points: 15,
    fields: [],
  },
];

export const DEFAULT_PROFILE: BuilderProfile = {
  fullName: "",
  headline: "",
  yearsWithAI: "3+ Years Production AI Engineering",
  primaryTools: "",
  architectureCase: "",
  projectTitle: "",
  projectLiveUrl: "",
  projectProblemSolved: "",
  debuggingStory: "",
  portfolioPitch: "",
  targetAudience: "B2B SaaS Clients & Technical Hiring Teams",
  shareOnFeed: true,
  completedStepIds: [],
  adminVerified: false,
  certificateId: "PC-2026-8841",
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = "proofcraft_builder_profile_v1";

export function loadBuilderProfile(): BuilderProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveBuilderProfile(profile: BuilderProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
  } catch {}
}
