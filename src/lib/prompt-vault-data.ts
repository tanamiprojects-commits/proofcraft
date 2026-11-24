import { StudioLang } from "./i18n-engine";

export interface VaultPromptItem {
  id: string;
  stageNumber: number;
  category: string;
  title: string;
  goal: string;
  powershellReadyPrompt: string;
  securityNote: string;
  sampleOutput: string;
}

export const PROMPT_VAULT_CATALOG: VaultPromptItem[] = [
  {
    id: "vp-1",
    stageNumber: 1,
    category: "1. Product Architecture & Spec",
    title: "Full System Spec, Normalized DB Schema & User Flows",
    goal: "Turn a raw product idea into a production technical spec with separation of concerns and RLS.",
    powershellReadyPrompt: "Follow the ProofCraft method: design a complete system architecture including normalized PostgreSQL tables, user roles, server-side API flows, and a modular PowerShell execution roadmap.",
    securityNote: "Never embed private keys in public specs; separate client-safe keys from server-only secrets from day one.",
    sampleOutput: "Normalized 4-table PostgreSQL schema + user_id RLS policies + secured /api route map.",
  },
  {
    id: "vp-2",
    stageNumber: 2,
    category: "2. UI/UX & Obsidian Design System",
    title: "Fintech Dark UI System with High Contrast & Responsive Layout",
    goal: "Create an airy, AA-contrast interface optimized for mobile and desktop viewports.",
    powershellReadyPrompt: "Generate a PowerShell script updating src\\app\\globals.css to a fintech dark design system (#F8FAFC on #0A0B0E), spacious cards, responsive grids, and zero horizontal overflow.",
    securityNote: "Never use dangerouslySetInnerHTML to render user-submitted content.",
    sampleOutput: "Unified Design Tokens in globals.css with 14.5:1 contrast ratio and full mobile-desktop parity.",
  },
  {
    id: "vp-3",
    stageNumber: 3,
    category: "3. Modular Feature Execution",
    title: "Zero-Manual Modular Component Delivery via UTF-8 PowerShell",
    goal: "Write clean TypeScript/React components directly via UTF-8 without BOM PowerShell scripts.",
    powershellReadyPrompt: "Write a complete PowerShell command using [System.Text.UTF8Encoding]::new($false) that creates a modular React/TypeScript component, wires it into the page, and runs npm run build to verify zero errors.",
    securityNote: "Always write files using UTF-8 without BOM to prevent character corruption across platforms.",
    sampleOutput: "Component created in src\\components + npm run build verified with 0 TypeScript errors.",
  },
  {
    id: "vp-4",
    stageNumber: 4,
    category: "4. Cloud Database, Supabase & RLS Security",
    title: "Hermetic User Data Isolation & Anti-Cheat Trigger Enforcement",
    goal: "Ensure every user accesses only their own rows and cannot spoof admin roles or paid tiers.",
    powershellReadyPrompt: "Write a complete Supabase SQL migration enabling Row-Level Security (RLS) on all tables and creating a SECURITY DEFINER trigger preventing standard users from modifying is_admin or purchased_track_level.",
    securityNote: "Never leave a Supabase table without Enable RLS and explicit SELECT/INSERT/UPDATE policies.",
    sampleOutput: "RLS policies active + sensitive column protection trigger verified in Supabase SQL Editor.",
  },
  {
    id: "vp-5",
    stageNumber: 5,
    category: "5. Terminal, API Keys, Tokens & .env Security",
    title: "Secret Isolation, .gitignore Lock & Server-Only Key Enforcement",
    goal: "Prevent leaking API keys, database passwords, or tokens to GitHub or client bundles.",
    powershellReadyPrompt: "Write a PowerShell security check verifying .env.local is excluded in .gitignore, creating a safe .env.example template without real values, and auditing src/ to ensure no secret key without NEXT_PUBLIC_ is exposed in client code.",
    securityNote: "Golden Rule: Secret keys (SERVICE_ROLE_KEY, GEMINI_API_KEY, WEBHOOK_SECRET) must never start with NEXT_PUBLIC_ or be committed to Git.",
    sampleOutput: ".env.local locked in .gitignore + client secret scan passed + server keys isolated in Route Handlers.",
  },
  {
    id: "vp-6",
    stageNumber: 6,
    category: "6. Verified Payments, Webhooks & Automation",
    title: "Cryptographic HMAC Signature Verification & Real-Time Alerts",
    goal: "Process payments and webhook automations without allowing client-side URL spoofing.",
    powershellReadyPrompt: "Write a PowerShell script creating a server Route Handler (src\\app\\api\\webhooks\\payment\\route.ts) that verifies HMAC-SHA256 signatures against process.env.WEBHOOK_SECRET, upgrades user access in Supabase, and triggers an instant admin alert.",
    securityNote: "Trust only server-verified signed webhooks — never unlock paid tiers based on browser query parameters.",
    sampleOutput: "HMAC-verified /api/webhooks/payment endpoint + automated purchase notification active.",
  },
  {
    id: "vp-7",
    stageNumber: 7,
    category: "7. Vercel Production Deployment, Domains & CSP",
    title: "Production Release, Environment Variables & HTTPS Link Gate",
    goal: "Deploy a live HTTPS production app protected against XSS and unverified links.",
    powershellReadyPrompt: "Write a PowerShell release script that runs a full production build check, verifies required environment variables, and pushes a clean commit to GitHub main for automatic Vercel deployment.",
    securityNote: "Configure all .env.local secrets in Vercel Dashboard -> Settings -> Environment Variables before deploying.",
    sampleOutput: "Production build passed with 0 errors + live HTTPS deployment verified on Vercel.",
  },
  {
    id: "vp-8",
    stageNumber: 8,
    category: "8. Organic Growth, Copywriting & Client Acquisition",
    title: "High-Converting Value Proposition & Outreach Scripts",
    goal: "Turn your live production asset into client leads using non-spammy outreach workflows.",
    powershellReadyPrompt: "Follow the ProofCraft method: write 3 high-trust organic outreach scripts (direct founder DM, LinkedIn engineering breakdown post, and value-first technical comment) linking to my live Verified Portfolio.",
    securityNote: "Share only verified HTTPS links to your live portfolio and production deployment.",
    sampleOutput: "3 ready-to-send organic client acquisition scripts with clear calls to action.",
  },
];
