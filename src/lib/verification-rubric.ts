export interface ModuleVerificationRule {
  moduleId: string;
  artifactPromptTitle: string;
  artifactPlaceholder: string;
  requiredSignals: string[];
  minChars: number;
  missingSignalHint: string;
  rationaleOptions: string[];
  auditChecklist: string[];
}

export const VERIFICATION_RUBRIC: Record<string, ModuleVerificationRule> = {
  "t1-mod1": {
    moduleId: "t1-mod1",
    artifactPromptTitle: "Paste your landing page value proposition, target audience & section architecture:",
    artifactPlaceholder: "e.g., Hero headline, 3 business pain points, social proof, and lead capture CTA connected to WhatsApp / Email...",
    requiredSignals: ["hero", "cta", "lead", "whatsapp", "value", "client", "לקוח", "בעיה"],
    minChars: 45,
    missingSignalHint: "Your submission must reference the Hero structure, target client problem, and CTA / lead capture flow.",
    rationaleOptions: [
      "Focused the messaging on a measurable business problem with a single primary CTA to maximize conversion rate.",
      "Separated the core value proposition from social proof to establish trust within the first 5 seconds.",
    ],
    auditChecklist: [
      "Defined a clear value proposition in plain language without unnecessary jargon",
      "Verified every page section serves a measurable conversion goal",
    ],
  },
  "t1-mod2": {
    moduleId: "t1-mod2",
    artifactPromptTitle: "Paste a code snippet or CSS output verifying responsive layout & high contrast:",
    artifactPlaceholder: "Paste snippet from globals.css or component JSX showing flex/grid layout, padding, and contrast tokens...",
    requiredSignals: ["padding", "color", "grid", "flex", "rtl", "ltr", "border"],
    minChars: 40,
    missingSignalHint: "Paste real CSS/JSX code containing responsive layout rules (flex, grid, padding, color).",
    rationaleOptions: [
      "Implemented a Mobile-First responsive layout with high-contrast tokens for effortless readability across devices.",
      "Eliminated horizontal overflow and enforced accessible touch targets across mobile viewports.",
    ],
    auditChecklist: [
      "Verified zero text clipping or horizontal scrolling on 360px mobile screens",
      "Confirmed high AA+ contrast ratio on dark obsidian surfaces",
    ],
  },
  "t1-mod3": {
    moduleId: "t1-mod3",
    artifactPromptTitle: "Paste your production build output (npm run build) or live HTTPS deployment URL:",
    artifactPlaceholder: "e.g., Compiled successfully / Route (app) / https://vercel.app",
    requiredSignals: ["compiled", "wa.me", "https://", "route", "vercel"],
    minChars: 35,
    missingSignalHint: "Paste real build verification output (Compiled / Route) or a valid https:// deployment URL.",
    rationaleOptions: [
      "Connected a zero-backend dynamic lead workflow that packages structured client details cleanly.",
      "Verified a clean production build (0 errors) prior to deploying live on Vercel.",
    ],
    auditChecklist: [
      "Tested dynamic lead links and form validation end-to-end",
      "Verified live production deployment under HTTPS",
    ],
  },
  "t2-mod1": {
    moduleId: "t2-mod1",
    artifactPromptTitle: "Paste the CREATE TABLE SQL migration you executed in Supabase:",
    artifactPlaceholder: "create table public.leads ( id uuid primary key, user_id uuid references auth.users(id)... );",
    requiredSignals: ["create table", "uuid", "user_id", "references"],
    minChars: 55,
    missingSignalHint: "Paste real SQL containing CREATE TABLE, a UUID primary key, and a user_id foreign key reference.",
    rationaleOptions: [
      "Normalized the relational tables and bound every record to user_id with ON DELETE CASCADE for data integrity.",
      "Enforced strict column types and default timestamps to prevent malformed records.",
    ],
    auditChecklist: [
      "Tables created cleanly in Supabase Table Editor",
      "Every table includes a UUID primary key and created_at timestamp",
    ],
  },
  "t2-mod2": {
    moduleId: "t2-mod2",
    artifactPromptTitle: "Paste the Row-Level Security (RLS) policies enabled on your tables:",
    artifactPlaceholder: "alter table ... enable row level security; create policy ... using (auth.uid() = user_id);",
    requiredSignals: ["row level security", "create policy", "auth.uid()"],
    minChars: 55,
    missingSignalHint: "Output must include ENABLE ROW LEVEL SECURITY, CREATE POLICY, and an auth.uid() ownership check.",
    rationaleOptions: [
      "Enforced row-level isolation so authenticated users can only read and mutate rows matching their auth.uid().",
      "Blocked unauthenticated direct write/delete operations at the database layer.",
    ],
    auditChecklist: [
      "Confirmed RLS is Enabled on all user-owned tables",
      "Verified Tenant A cannot read or modify Tenant B records",
    ],
  },
  "t3-mod1": {
    moduleId: "t3-mod1",
    artifactPromptTitle: "Paste your server-side cryptographic signature verification code (HMAC / Webhook Route Handler):",
    artifactPlaceholder: "import crypto from 'crypto'; const sig = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)...",
    requiredSignals: ["crypto", "process.env", "request", "response", "secret"],
    minChars: 60,
    missingSignalHint: "Paste real Route Handler code using process.env and server-side signature/secret verification.",
    rationaleOptions: [
      "Verified the incoming webhook signature server-side against process.env secrets prior to granting tier access.",
      "Prevented client-side URL parameter spoofing by trusting only signed server-to-server callbacks.",
    ],
    auditChecklist: [
      "Zero secret keys exposed in client bundles (no NEXT_PUBLIC_ prefix on secrets)",
      "Server returns HTTP 401 on any missing or invalid signature",
    ],
  },
  "t4-mod1": {
    moduleId: "t4-mod1",
    artifactPromptTitle: "Paste your Multi-Tenant RBAC & Audit Log SQL schema (organizations / org_members / audit_logs):",
    artifactPlaceholder: "create table public.organizations ... create table public.org_members (role text check (role in ('owner','admin','member')))...",
    requiredSignals: ["organizations", "org_members", "role", "audit_logs", "policy"],
    minChars: 75,
    missingSignalHint: "This milestone requires SQL defining organizations, org_members, role checks, and audit_logs.",
    rationaleOptions: [
      "Architected strict multi-tenant isolation with Owner/Admin/Member RBAC enforcement at the RLS layer.",
      "Implemented immutable audit logging for every sensitive administrative mutation.",
    ],
    auditChecklist: [
      "Verified complete tenant isolation across organizations via RLS",
      "All privilege changes automatically log to audit_logs",
    ],
  },
};

export function getRubricForModule(moduleId: string, stepNumber: number): ModuleVerificationRule {
  if (VERIFICATION_RUBRIC[moduleId]) return VERIFICATION_RUBRIC[moduleId];
  return {
    moduleId,
    artifactPromptTitle: `Paste your verified technical execution output or code artifact for Stage ${stepNumber}:`,
    artifactPlaceholder: "Paste terminal output, verified SQL migration, or production code implemented in this milestone...",
    requiredSignals: ["const", "export", "create", "select", "https", "import", "return", "function"],
    minChars: 50,
    missingSignalHint: "Paste real execution proof (code, SQL, terminal output, or verified HTTPS link) of at least 50 characters.",
    rationaleOptions: [
      "Maintained clean separation of concerns between UI components, server handlers, and database security.",
      "Verified build integrity, error handling, and input sanitization prior to production release.",
    ],
    auditChecklist: [
      "Executed the deliverable directly in my local and cloud environment",
      "Verified zero TypeScript errors and zero exposed secrets",
    ],
  };
}
