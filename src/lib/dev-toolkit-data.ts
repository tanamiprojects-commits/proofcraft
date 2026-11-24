export interface DevToolItem {
  id: string;
  stageNumber: number;
  stageTitle: string;
  name: string;
  category: string;
  shortDesc: string;
  fullExplanation: string;
  actionsYouCanDo: string[];
  pricingByVolume: { tier: string; cost: string; volumeDetails: string }[];
  userRequirements: string[];
  coreCapabilities: string[];
  officialUrl: string;
  verificationActionLabel: string;
}

export const DEV_STAGES = [
  { num: 1, title: "1. Architecture & Spec", icon: "📐" },
  { num: 2, title: "2. UI/UX Design", icon: "🎨" },
  { num: 3, title: "3. AI & Code Generation", icon: "💻" },
  { num: 4, title: "4. Database & Auth", icon: "🗄️" },
  { num: 5, title: "5. Security, QA & Performance", icon: "🛡️" },
  { num: 6, title: "6. Deployment, Payments & Growth", icon: "🚀" },
];

export const DEV_TOOLS: DevToolItem[] = [
  {
    id: "tool-claude-gemini",
    stageNumber: 1,
    stageTitle: "Architecture & Spec",
    name: "Claude 3.7 / Gemini Pro",
    category: "System Architecture & PRD Specification",
    shortDesc: "Design data schemas, user flows, and technical specifications before writing a single line of code.",
    fullExplanation: "Leading reasoning models for breaking down product concepts into screens, normalized database tables, RLS policies, and edge-case flows.",
    actionsYouCanDo: ["Write technical PRDs", "Design PostgreSQL schemas & RLS policies", "Identify security flaws during planning"],
    pricingByVolume: [
      { tier: "Free", cost: "$0 / mo", volumeDetails: "Daily message quota — sufficient for initial MVP architecture" },
      { tier: "Pro", cost: "$20 / mo", volumeDetails: "Large context window (200K–1M tokens) for full codebase analysis" },
    ],
    userRequirements: ["Free Google or Anthropic account"],
    coreCapabilities: ["System modeling", "SQL schema generation", "Security architecture review"],
    officialUrl: "https://claude.ai",
    verificationActionLabel: "Verify PRD & Schema Blueprint",
  },
  {
    id: "tool-v0-stitch",
    stageNumber: 2,
    stageTitle: "UI/UX Design",
    name: "v0 by Vercel / Figma",
    category: "Rapid UI Prototyping & Design Systems",
    shortDesc: "Generate high-contrast, responsive React & Tailwind interfaces from structured product prompts.",
    fullExplanation: "Accelerates component layout design, responsive grids, and fintech-grade dark UI tokens with instant live previews.",
    actionsYouCanDo: ["Generate responsive React components", "Prototype user flows & dashboards", "Export clean Tailwind/CSS tokens"],
    pricingByVolume: [
      { tier: "Free", cost: "$0 / mo", volumeDetails: "Starter monthly credits for UI generations" },
      { tier: "Premium", cost: "$20 / mo", volumeDetails: "Higher generation limits & custom design systems" },
    ],
    userRequirements: ["Vercel or Figma account"],
    coreCapabilities: ["Component generation", "Responsive layout preview", "Design token export"],
    officialUrl: "https://v0.dev",
    verificationActionLabel: "Verify UI Prototype & Layout",
  },
  {
    id: "tool-cursor-vscode",
    stageNumber: 3,
    stageTitle: "AI & Code Generation",
    name: "Cursor AI / VS Code",
    category: "Agentic Code Editor & Terminal Workflow",
    shortDesc: "Write, refactor, and debug full-stack Next.js & TypeScript applications with multi-file AI context.",
    fullExplanation: "Combines local IDE control with codebase-wide AI indexing, inline diffs, and integrated PowerShell build verification.",
    actionsYouCanDo: ["Edit multi-file React/TypeScript features", "Run local npm run build checks", "Refactor API routes safely"],
    pricingByVolume: [
      { tier: "Hobby", cost: "$0 / mo", volumeDetails: "Core editor + limited fast AI completions" },
      { tier: "Pro", cost: "$20 / mo", volumeDetails: "Unlimited completions & 500 fast premium requests" },
    ],
    userRequirements: ["Node.js 20+ installed locally", "Git CLI configured"],
    coreCapabilities: ["Multi-file AI edits", "Integrated terminal", "TypeScript error resolution"],
    officialUrl: "https://cursor.com",
    verificationActionLabel: "Verify Local Build & Codebase",
  },
  {
    id: "tool-supabase",
    stageNumber: 4,
    stageTitle: "Database & Auth",
    name: "Supabase (PostgreSQL + Auth)",
    category: "Cloud Database & Row-Level Security (RLS)",
    shortDesc: "Managed PostgreSQL database with built-in user authentication and strict row-level access policies.",
    fullExplanation: "Provides persistent cloud storage, OAuth/email login, and SQL security triggers to protect user portfolios and billing tiers.",
    actionsYouCanDo: ["Configure user authentication", "Enforce RLS security policies", "Create RPC functions for analytics"],
    pricingByVolume: [
      { tier: "Free", cost: "$0 / mo", volumeDetails: "500MB database + 50,000 monthly active users" },
      { tier: "Pro", cost: "$25 / mo", volumeDetails: "8GB database + daily automated backups" },
    ],
    userRequirements: ["Free Supabase organization account"],
    coreCapabilities: ["PostgreSQL database", "Row-Level Security", "Real-time subscriptions"],
    officialUrl: "https://supabase.com",
    verificationActionLabel: "Verify Supabase Schema & RLS",
  },
  {
    id: "tool-github-security",
    stageNumber: 5,
    stageTitle: "Security, QA & Performance",
    name: "GitHub + OWASP & Build QA",
    category: "Version Control & Secret Protection",
    shortDesc: "Automated repository version control, .env secret scanning, and TypeScript production build checks.",
    fullExplanation: "Locks source history, blocks accidental secret commits, and triggers automated CI/CD pipelines on every push.",
    actionsYouCanDo: ["Lock .gitignore secret rules", "Run TypeScript strict checks", "Push verified releases to main"],
    pricingByVolume: [
      { tier: "Free", cost: "$0 / mo", volumeDetails: "Unlimited public & private repositories" },
    ],
    userRequirements: ["GitHub account & SSH/HTTPS auth"],
    coreCapabilities: ["Source control", "Secret scanning", "CI/CD webhook triggers"],
    officialUrl: "https://github.com",
    verificationActionLabel: "Verify Clean Repository Push",
  },
  {
    id: "tool-vercel-payments",
    stageNumber: 6,
    stageTitle: "Deployment, Payments & Growth",
    name: "Vercel + LemonSqueezy / Stripe",
    category: "Global Edge Hosting & Verified Billing",
    shortDesc: "Instant global HTTPS deployment on Vercel paired with webhook-verified digital product checkout.",
    fullExplanation: "Deploys Next.js applications to a global edge CDN in seconds and connects cryptographic payment webhooks to unlock tiers.",
    actionsYouCanDo: ["Deploy live HTTPS production domain", "Configure environment secrets", "Verify HMAC payment webhooks"],
    pricingByVolume: [
      { tier: "Hobby", cost: "$0 / mo", volumeDetails: "Global SSL hosting + automatic Git deployments" },
      { tier: "Pro", cost: "$20 / mo", volumeDetails: "Team collaboration + advanced edge analytics" },
    ],
    userRequirements: ["Vercel account linked to GitHub"],
    coreCapabilities: ["Global CDN", "Automatic SSL", "Serverless API functions"],
    officialUrl: "https://vercel.com",
    verificationActionLabel: "Verify Live Production HTTPS URL",
  },
];
