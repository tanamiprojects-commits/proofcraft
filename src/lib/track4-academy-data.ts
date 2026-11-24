import { AcademyModule } from "./track1-academy-data";

export const TRACK4_PRESETS = [
  { label: "Enterprise Multi-Tenant AI Workspace", headline: "Senior AI Systems Architect · Multi-Tenant RBAC, Audit Logs & AI Copilot", projectTitle: "v4.0 — Enterprise Multi-Tenant AI Copilot with RBAC & Audit Trail", projectSummary: "Full-spectrum multi-organization SaaS with Owner/Admin/Member RBAC and immutable audit logs." },
  { label: "B2B Compliance & Governance OS", headline: "Senior AI Systems Architect · Zero-Trust Tenant Isolation & Governance", projectTitle: "v4.0 — Multi-Tenant Governance & Compliance Control Plane", projectSummary: "Organization-isolated PostgreSQL architecture with automated compliance audit logging." },
  { label: "AI Agency & White-Label Platform", headline: "Senior AI Systems Architect · Scalable Multi-Client AI Infrastructure", projectTitle: "v4.0 — White-Label Multi-Tenant AI Delivery Platform", projectSummary: "Role-gated workspaces, usage metering, and verified executive reporting." },
];

export const TRACK4_MODULES: AcademyModule[] = [
  {
    id: "t4-mod1",
    stepNumber: 1,
    title: "Module 1: Multi-Tenant RBAC & Immutable Audit Log Schema",
    subtitle: "Architect organizations, org_members roles (Owner/Admin/Member), and audit_logs in PostgreSQL.",
    badgeUnlocked: "Multi-Tenant Architect",
    assetBuilt: "Enterprise RBAC & Audit Schema",
    coreLessonTitle: "True Enterprise SaaS Requires Organization-Level Isolation",
    coreLessonBody: "Enterprise customers require team workspaces where Owners control billing, Admins manage members, and every privileged action is recorded in an immutable audit_logs table.",
    roiInsight: "Multi-tenant RBAC and audit logging unlock $10,000+ B2B enterprise contracts.",
    amateurMistake: "Using a single boolean is_admin flag globally instead of organization-scoped membership roles.",
    proExecution: "Create organizations, org_members (role in ('owner','admin','member')), and audit_logs tables protected by membership-based RLS policies.",
    externalServices: [
      { name: "Supabase Enterprise Schema", url: "https://supabase.com", purpose: "Deploy Multi-Tenant RBAC & Audit Log tables", exactSteps: ["Create organizations & org_members tables", "Add role check constraints & audit_logs", "Submit SQL schema in Station 3"] },
    ],
    readyPrompt: "Write a PostgreSQL migration creating public.organizations, public.org_members with role check ('owner','admin','member'), and public.audit_logs with strict RLS policies.",
    troubleshooting: [
      { symptom: "Infinite recursion in org_members RLS policy", fixExplanation: "Use a SECURITY DEFINER helper function to check organization membership cleanly.", fixPrompt: "Refactor the org_members RLS policy to use a SECURITY DEFINER membership lookup function." },
    ],
    quizQuestion: "Why is an immutable audit_logs table essential in multi-tenant enterprise software?",
    quizOptions: ["It provides verifiable accountability for every role change, billing update, and sensitive data action", "It replaces database backups", "It allows anonymous users to edit organization settings"],
    correctQuizIdx: 0,
  },
  {
    id: "t4-mod2",
    stepNumber: 2,
    title: "Module 2: Context-Aware AI Copilot with Tenant Guardrails",
    subtitle: "Connect server-side AI workflows scoped strictly to the active organization's permissions.",
    badgeUnlocked: "AI Systems Engineer",
    assetBuilt: "Tenant-Scoped AI Copilot",
    coreLessonTitle: "Zero Cross-Tenant Data Leakage in AI Workflows",
    coreLessonBody: "When an AI Copilot queries project data or generates executive summaries, the server handler must verify active org_id membership before assembling context.",
    roiInsight: "Combines generative AI productivity with enterprise-grade compliance and data privacy.",
    amateurMistake: "Passing unverified org_id parameters from client requests without checking org_members.",
    proExecution: "Authenticate the user session server-side, verify active organization membership, log the AI execution in audit_logs, and return structured insights.",
    externalServices: [
      { name: "Google AI Studio / OpenAI API", url: "https://google.com", purpose: "Configure server-side AI model endpoints", exactSteps: ["Store API key server-side in .env.local", "Enforce org_id membership check in API route", "Submit verified handler code in Station 3"] },
    ],
    readyPrompt: "Build a server-side Next.js API route for an AI Copilot that verifies user membership in org_members before querying organization data and writes an entry to audit_logs.",
    troubleshooting: [
      { symptom: "AI endpoint returns 403 for valid org admin", fixExplanation: "Ensure org_id header or body parameter matches the user's active membership row.", fixPrompt: "Debug org_members lookup to verify user_id and org_id match before invoking the AI provider." },
    ],
    quizQuestion: "What must a server-side AI Copilot route verify before retrieving organization data?",
    quizOptions: ["That the authenticated user holds an active role in org_members for that specific org_id", "Only that the request came from a desktop browser", "That the API key is stored in localStorage"],
    correctQuizIdx: 0,
  },
  {
    id: "t4-mod3",
    stepNumber: 3,
    title: "Module 3: Flagship 4/4 Production Release & Executive Handover (v4.0)",
    subtitle: "Complete all 4 architecture tiers (v1.0–v4.0) and publish your Certified Graduate portfolio.",
    badgeUnlocked: "Certified Senior AI Architect (v4.0)",
    assetBuilt: "Complete 4-System Production Portfolio",
    coreLessonTitle: "Proof-of-Execution at Senior Engineering Scale",
    coreLessonBody: "With v1.0, v2.0, v3.0, and v4.0 live in production and backed by verified technical artifacts, your portfolio proves complete full-stack AI engineering mastery.",
    roiInsight: "Positions you in the top tier of AI systems architects for senior roles and enterprise retainers.",
    amateurMistake: "Stopping at prototypes instead of shipping a complete, audited 4-system portfolio.",
    proExecution: "Verify clean production build, lock your live v4.0 URL into your Verified Portfolio, and share your public credential with hiring leaders and clients.",
    externalServices: [
      { name: "Vercel Enterprise Production", url: "https://vercel.com", purpose: "Deploy flagship v4.0 multi-tenant platform", exactSteps: ["Verify all server secrets in Vercel", "Confirm 0 build/TypeScript errors", "Lock v4.0 URL in Station 3"] },
    ],
    readyPrompt: "Run a complete production audit (npm run build, RLS policy check, and environment secret scan) and deploy flagship v4.0 to Vercel.",
    troubleshooting: [
      { symptom: "Build fails on unused TypeScript imports", fixExplanation: "Remove unused variables and run npm run build locally before pushing.", fixPrompt: "Clean up TypeScript warnings and verify zero errors with npm run build." },
    ],
    quizQuestion: "What distinguishes a ProofCraft v4.0 Certified Portfolio from a traditional resume?",
    quizOptions: ["Four live HTTPS production systems backed by verified technical artifacts and architectural rationale", "A static PDF listing unverified skills", "Localhost screenshots without live URLs"],
    correctQuizIdx: 0,
  },
];

export const TRACK4_CLOSING_KIT = {
  recommendedPricing: "$8,000 – $25,000+ per enterprise multi-tenant AI platform",
  salesPitchTemplate: "I architect enterprise multi-tenant AI platforms with RBAC, PostgreSQL RLS, and full audit governance — backed by 4 live production systems.",
  handoverChecklist: ["Multi-tenant RBAC & RLS verified", "Audit logging active on all admin actions", "All 4 portfolio tiers (v1.0–v4.0) live in production"],
};
