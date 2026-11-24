import { AcademyModule } from "./track1-academy-data";

export const TRACK2_PRESETS = [
  { label: "B2B Client Portal SaaS", headline: "Full-Stack AI Builder · Multi-User Client Portals & Supabase RLS", projectTitle: "v2.0 — Multi-Tenant Client Portal with PostgreSQL & RLS", projectSummary: "Cloud SaaS portal with authenticated user workspaces and row-level data isolation." },
  { label: "AI CRM & Lead Pipeline", headline: "Full-Stack AI Builder · Cloud CRM & Automated Lead Pipelines", projectTitle: "v2.0 — Cloud CRM & Real-Time Lead Management App", projectSummary: "Normalized PostgreSQL CRM with instant status sync and user authentication." },
  { label: "Booking & Operations OS", headline: "Full-Stack AI Builder · Cloud Scheduling & Operations Software", projectTitle: "v2.0 — Cloud Scheduling & Operations Management Platform", projectSummary: "Persistent cloud SaaS platform with role-based permissions and audit trails." },
];

export const TRACK2_MODULES: AcademyModule[] = [
  {
    id: "t2-mod1",
    stepNumber: 1,
    title: "Module 1: Normalized PostgreSQL Schema & Relational Integrity",
    subtitle: "Design clean relational tables with UUID primary keys and foreign-key user ownership.",
    badgeUnlocked: "Database Architect",
    assetBuilt: "Normalized PostgreSQL Schema",
    coreLessonTitle: "Relational Data Integrity Scales Cleanly",
    coreLessonBody: "Every multi-user SaaS starts with normalized tables linked to auth.users(id) via UUID foreign keys and ON DELETE CASCADE rules.",
    roiInsight: "A clean relational schema prevents data corruption and cuts future feature development time in half.",
    amateurMistake: "Storing unrelated arrays inside a single JSON blob without user_id ownership columns.",
    proExecution: "Create explicit tables with uuid primary keys, user_id references auth.users(id), and indexed timestamps.",
    externalServices: [
      { name: "Supabase SQL Editor", url: "https://supabase.com", purpose: "Execute normalized CREATE TABLE migrations", exactSteps: ["Open SQL Editor in Supabase", "Run CREATE TABLE with UUID & user_id", "Copy executed SQL into Station 3"] },
    ],
    readyPrompt: "Write a normalized PostgreSQL CREATE TABLE migration for Supabase with UUID primary keys, user_id references auth.users(id) on delete cascade, and created_at timestamps.",
    troubleshooting: [
      { symptom: "Foreign key constraint error on insert", fixExplanation: "Ensure the user is authenticated and their UUID exists in auth.users.", fixPrompt: "Verify user_id foreign key reference to auth.users(id) and check active session UID." },
    ],
    quizQuestion: "Why should user-owned SaaS tables reference auth.users(id) with ON DELETE CASCADE?",
    quizOptions: ["To enforce relational ownership and prevent orphaned records", "To bypass authentication checks", "To make all rows public by default"],
    correctQuizIdx: 0,
  },
  {
    id: "t2-mod2",
    stepNumber: 2,
    title: "Module 2: Row-Level Security (RLS) & Zero-Trust Data Isolation",
    subtitle: "Enforce database-level policies so users can only access their own records.",
    badgeUnlocked: "RLS Security Engineer",
    assetBuilt: "Zero-Trust RLS Policy Suite",
    coreLessonTitle: "Never Rely on Frontend Filtering for Security",
    coreLessonBody: "Because the Supabase anon key is public in the browser, Row-Level Security (RLS) policies on PostgreSQL are your true security perimeter.",
    roiInsight: "Enterprise and B2B clients require strict tenant data isolation before signing any SaaS contract.",
    amateurMistake: "Leaving tables with RLS disabled or writing USING (true) policies on sensitive user tables.",
    proExecution: "Enable RLS on every table and enforce CREATE POLICY rules checking auth.uid() = user_id for SELECT, INSERT, UPDATE, and DELETE.",
    externalServices: [
      { name: "Supabase Auth & Policies", url: "https://supabase.com", purpose: "Enable RLS & audit table policies", exactSteps: ["Enable RLS on target tables", "Create auth.uid() = user_id policies", "Paste policy SQL into Station 3"] },
    ],
    readyPrompt: "Write Supabase SQL commands to enable Row-Level Security (RLS) and create strict SELECT, INSERT, and UPDATE policies enforcing auth.uid() = user_id.",
    troubleshooting: [
      { symptom: "Empty array returned after enabling RLS", fixExplanation: "You enabled RLS without creating a SELECT policy for authenticated users.", fixPrompt: "Add a CREATE POLICY for SELECT using (auth.uid() = user_id) on the table." },
    ],
    quizQuestion: "Where is data access control enforced in a Supabase + Next.js SaaS architecture?",
    quizOptions: ["At the PostgreSQL database layer via Row-Level Security (RLS)", "Only by hiding buttons in React JSX", "Inside client-side localStorage"],
    correctQuizIdx: 0,
  },
  {
    id: "t2-mod3",
    stepNumber: 3,
    title: "Module 3: Authenticated Cloud App Deployment (v2.0)",
    subtitle: "Connect Supabase Auth sessions to your Next.js UI and deploy v2.0 live.",
    badgeUnlocked: "v2.0 Cloud SaaS Builder",
    assetBuilt: "Live Multi-User SaaS App",
    coreLessonTitle: "End-to-End Authenticated User Journeys",
    coreLessonBody: "Combine email/password authentication, persistent PostgreSQL CRUD, and live Vercel deployment into Project #2 in your Verified Portfolio.",
    roiInsight: "Shipping a live authenticated SaaS app separates full-stack engineers from static site builders.",
    amateurMistake: "Committing .env.local keys to GitHub instead of adding them in Vercel Environment Variables.",
    proExecution: "Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, deploy v2.0, and lock the live URL.",
    externalServices: [
      { name: "Vercel Environment Settings", url: "https://vercel.com", purpose: "Configure production env vars & deploy v2.0", exactSteps: ["Add Supabase URL & Anon Key in Vercel", "Deploy production branch", "Lock live v2.0 URL in Station 3"] },
    ],
    readyPrompt: "Connect Supabase client auth state to my Next.js workspace so authenticated users can create, read, and update their own RLS-protected rows.",
    troubleshooting: [
      { symptom: "Auth redirect fails in production", fixExplanation: "Add your Vercel production domain to Supabase Auth -> URL Configuration.", fixPrompt: "Verify Site URL and Redirect URLs in Supabase Authentication settings." },
    ],
    quizQuestion: "How should Supabase environment variables be configured for production on Vercel?",
    quizOptions: ["Added in Vercel Project Settings -> Environment Variables (never committed to Git)", "Hardcoded directly inside src/lib/supabase.ts", "Uploaded in a public README file"],
    correctQuizIdx: 0,
  },
];

export const TRACK2_CLOSING_KIT = {
  recommendedPricing: "$2,500 – $6,000 per custom cloud SaaS MVP",
  salesPitchTemplate: "I build secure, multi-user cloud SaaS applications with PostgreSQL and Row-Level Security — verified in production.",
  handoverChecklist: ["RLS enabled on all tables", "Auth flow tested in production", "Zero secret keys exposed in repository"],
};
