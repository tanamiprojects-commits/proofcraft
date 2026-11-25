export interface VaultPromptItem {
  id: string;
  stageNumber: number;
  category: string;
  categoryHe: string;
  title: string;
  titleHe: string;
  goal: string;
  goalHe: string;
  howToUse: string;
  howToUseHe: string;
  expectedResult: string;
  expectedResultHe: string;
  powershellReadyPrompt: string;
  securityNote: string;
  securityNoteHe: string;
  sampleOutput: string;
}

export const PROMPT_VAULT_CATALOG: VaultPromptItem[] = [
  {
    id: "vp-1",
    stageNumber: 1,
    category: "1. Product Architecture & Spec",
    categoryHe: "1. ׳׳¨׳›׳™׳˜׳§׳˜׳•׳¨׳× ׳׳•׳¦׳¨ ׳•׳׳₪׳™׳•׳",
    title: "Full System Spec, Normalized DB Schema & User Flows",
    titleHe: "׳׳₪׳™׳•׳ ׳׳¢׳¨׳›׳× ׳׳׳, ׳¡׳›׳™׳׳× ׳׳¡׳“ ׳ ׳×׳•׳ ׳™׳ ׳•׳–׳¨׳™׳׳•׳× ׳׳©׳×׳׳©",
    goal: "Turn a raw product idea into a production technical spec with separation of concerns and RLS.",
    goalHe: "׳”׳₪׳™׳›׳× ׳¨׳¢׳™׳•׳ ׳’׳•׳׳׳™ ׳׳׳₪׳¨׳˜ ׳”׳ ׳“׳¡׳™ ׳׳׳ ׳¢׳ ׳”׳₪׳¨׳“׳× ׳©׳›׳‘׳•׳× ׳•׳׳‘׳˜׳—׳× RLS ׳׳”׳¨׳’׳¢ ׳”׳¨׳׳©׳•׳.",
    howToUse: "Paste this at the start of a new project chat together with your product goal and target users.",
    howToUseHe: "׳”׳“׳‘׳§ ׳‘׳×׳—׳™׳׳× ׳©׳™׳—׳” ׳—׳“׳©׳” ׳™׳—׳“ ׳¢׳ ׳×׳™׳׳•׳¨ ׳”׳¨׳¢׳™׳•׳ ׳•׳§׳”׳ ׳”׳™׳¢׳“ ׳›׳“׳™ ׳©׳”׳¦'׳׳˜ ׳™׳‘׳ ׳” ׳׳₪׳× ׳“׳¨׳›׳™׳ ׳׳¡׳•׳“׳¨׳× ׳׳₪׳ ׳™ ׳›׳×׳™׳‘׳× ׳§׳•׳“.",
    expectedResult: "A complete 4-table PostgreSQL schema, API route map, and step-by-step build order.",
    expectedResultHe: "׳×׳¨׳©׳™׳ ׳˜׳‘׳׳׳•׳× PostgreSQL ׳׳ ׳•׳¨׳׳, ׳׳₪׳× ׳ ׳×׳™׳‘׳™ API ׳•׳×׳•׳›׳ ׳™׳× ׳‘׳ ׳™׳™׳” ׳׳“׳•׳¨׳’׳×.",
    powershellReadyPrompt: "Follow the ProofCraft method: design a complete system architecture including normalized PostgreSQL tables, user roles, server-side API flows, and a modular PowerShell execution roadmap.",
    securityNote: "Never embed private keys in public specs; separate client-safe keys from server-only secrets from day one.",
    securityNoteHe: "׳׳¢׳•׳׳ ׳׳ ׳×׳›׳׳•׳ ׳׳₪׳×׳—׳•׳× ׳₪׳¨׳˜׳™׳™׳ ׳‘׳׳¡׳׳›׳™ ׳׳₪׳™׳•׳; ׳”׳₪׳¨׳“ ׳‘׳™׳ ׳׳₪׳×׳—׳•׳× ׳׳§׳•׳— ׳׳׳₪׳×׳—׳•׳× ׳©׳¨׳× ׳׳”׳™׳•׳ ׳”׳¨׳׳©׳•׳.",
    sampleOutput: "Normalized 4-table PostgreSQL schema + user_id RLS policies + secured /api route map."
  },
  {
    id: "vp-2",
    stageNumber: 2,
    category: "2. UI/UX & Obsidian Design System",
    categoryHe: "2. ׳¢׳™׳¦׳•׳‘ ׳׳׳©׳§ ׳•׳׳¢׳¨׳›׳× Obsidian",
    title: "Fintech Dark UI System with High Contrast & Responsive Layout",
    titleHe: "׳׳¢׳¨׳›׳× ׳¢׳™׳¦׳•׳‘ ׳₪׳™׳ ׳˜׳§ ׳›׳”׳” ׳¢׳ ׳ ׳™׳’׳•׳“׳™׳•׳× ׳’׳‘׳•׳”׳” ׳•׳¨׳¡׳₪׳•׳ ׳¡׳™׳‘׳™׳•׳× ׳׳׳׳”",
    goal: "Create an airy, AA-contrast interface optimized for mobile and desktop viewports.",
    goalHe: "׳™׳¦׳™׳¨׳× ׳׳׳©׳§ ׳׳¨׳•׳•׳— ׳•׳™׳•׳§׳¨׳×׳™ ׳”׳׳•׳×׳׳ ׳‘׳¦׳•׳¨׳” ׳׳•׳©׳׳׳× ׳׳׳¡׳›׳™ ׳˜׳׳₪׳•׳ ׳ ׳™׳™׳“ ׳•׳׳—׳©׳‘.",
    howToUse: "Run this before building pages so all cards, buttons, and grids share unified design tokens.",
    howToUseHe: "׳”׳’׳© ׳₪׳¨׳•׳׳₪׳˜ ׳–׳” ׳׳₪׳ ׳™ ׳‘׳ ׳™׳™׳× ׳”׳“׳₪׳™׳ ׳›׳“׳™ ׳׳§׳‘׳¢ ׳׳¢׳¨׳›׳× ׳¢׳™׳¦׳•׳‘ ׳׳—׳™׳“׳” ׳׳׳ ׳’׳׳™׳׳” ׳׳•׳₪׳§׳™׳× ׳‘׳׳•׳‘׳™׳™׳.",
    expectedResult: "Updated globals.css with dark fintech tokens, responsive grids, and accessible contrast.",
    expectedResultHe: "׳§׳•׳‘׳¥ globals.css ׳׳¢׳•׳“׳›׳ ׳¢׳ ׳׳©׳×׳ ׳™ ׳¦׳‘׳¢, ׳›׳¨׳˜׳™׳¡׳™׳ ׳׳¨׳•׳•׳—׳™׳ ׳•׳×׳׳™׳׳•׳× ׳׳׳׳” ׳׳׳•׳‘׳™׳™׳.",
    powershellReadyPrompt: "Generate a PowerShell script updating src\\app\\globals.css to a fintech dark design system (#F8FAFC on #0A0B0E), spacious cards, responsive grids, and zero horizontal overflow.",
    securityNote: "Never use dangerouslySetInnerHTML to render user-submitted content.",
    securityNoteHe: "׳׳™׳ ׳׳”׳©׳×׳׳© ׳‘-dangerouslySetInnerHTML ׳׳”׳¦׳’׳× ׳×׳•׳›׳ ׳©׳”׳•׳–׳ ׳¢׳ ׳™׳“׳™ ׳׳©׳×׳׳©׳™׳.",
    sampleOutput: "Unified Design Tokens in globals.css with 14.5:1 contrast ratio and full mobile-desktop parity."
  },
  {
    id: "vp-3",
    stageNumber: 3,
    category: "3. Modular Feature Execution",
    categoryHe: "3. ׳₪׳™׳×׳•׳— ׳¨׳›׳™׳‘׳™׳ ׳׳•׳“׳•׳׳¨׳™׳™׳",
    title: "Zero-Manual Modular Component Delivery via UTF-8 PowerShell",
    titleHe: "׳™׳¦׳™׳¨׳× ׳¨׳›׳™׳‘׳™ ׳§׳•׳“ ׳©׳׳׳™׳ ׳‘-PowerShell ׳‘׳§׳™׳“׳•׳“ UTF-8 ׳׳׳ BOM",
    goal: "Write clean TypeScript/React components directly via UTF-8 without BOM PowerShell scripts.",
    goalHe: "׳›׳×׳™׳‘׳× ׳¨׳›׳™׳‘׳™ React/TypeScript ׳׳׳׳™׳ ׳™׳©׳™׳¨׳•׳× ׳׳×׳™׳§׳™׳™׳× ׳”׳₪׳¨׳•׳™׳§׳˜ ׳׳׳ ׳©׳’׳™׳׳•׳× ׳§׳™׳“׳•׳“ ׳¢׳‘׳¨׳™׳×.",
    howToUse: "Use whenever adding a new feature so the AI delivers full files instead of partial snippets.",
    howToUseHe: "׳”׳©׳×׳׳© ׳‘׳₪׳¨׳•׳׳₪׳˜ ׳–׳” ׳‘׳›׳ ׳”׳•׳¡׳₪׳× ׳₪׳™׳¦'׳¨ ׳›׳“׳™ ׳׳§׳‘׳ ׳§׳‘׳¦׳™׳ ׳׳׳׳™׳ ׳•׳׳•׳›׳ ׳™׳ ׳׳”׳¨׳¦׳” ׳׳׳ ׳§׳˜׳¢׳™׳ ׳—׳¡׳¨׳™׳.",
    expectedResult: "A complete component file written in UTF-8 without BOM plus a passing npm run build check.",
    expectedResultHe: "׳§׳•׳‘׳¥ ׳¨׳›׳™׳‘ ׳׳׳ ׳©׳ ׳›׳×׳‘ ׳‘-UTF-8 ׳׳׳ BOM ׳•׳¢׳•׳‘׳¨ ׳‘׳“׳™׳§׳× npm run build ׳‘-0 ׳©׳’׳™׳׳•׳×.",
    powershellReadyPrompt: "Write a complete PowerShell command using [System.Text.UTF8Encoding]::new($false) that creates a modular React/TypeScript component, wires it into the page, and runs npm run build to verify zero errors.",
    securityNote: "Always write files using UTF-8 without BOM to prevent character corruption across platforms.",
    securityNoteHe: "׳›׳×׳•׳‘ ׳§׳‘׳¦׳™׳ ׳×׳׳™׳“ ׳‘׳§׳™׳“׳•׳“ UTF-8 ׳׳׳ BOM ׳›׳“׳™ ׳׳׳ ׳•׳¢ ׳©׳™׳‘׳•׳©׳™ ׳×׳•׳•׳™׳ ׳‘׳¢׳‘׳¨׳™׳×.",
    sampleOutput: "Component created in src\\components + npm run build verified with 0 TypeScript errors."
  },
  {
    id: "vp-4",
    stageNumber: 4,
    category: "4. Cloud Database, Supabase & RLS Security",
    categoryHe: "4. ׳׳¡׳“ ׳ ׳×׳•׳ ׳™׳ ׳¢׳ ׳ ׳•׳׳‘׳˜׳—׳× RLS",
    title: "Hermetic User Data Isolation & Anti-Cheat Trigger Enforcement",
    titleHe: "׳‘׳™׳“׳•׳“ ׳ ׳×׳•׳ ׳™ ׳׳©׳×׳׳©׳™׳ ׳”׳¨׳׳˜׳™ ׳•׳”׳’׳ ׳” ׳׳₪׳ ׳™ ׳–׳™׳•׳£ ׳”׳¨׳©׳׳•׳×",
    goal: "Ensure every user accesses only their own rows and cannot spoof admin roles or paid tiers.",
    goalHe: "׳”׳‘׳˜׳—׳” ׳©׳›׳ ׳׳©׳×׳׳© ׳ ׳™׳’׳© ׳¨׳§ ׳׳¨׳©׳•׳׳•׳× ׳©׳׳• ׳•׳׳™׳ ׳• ׳™׳›׳•׳ ׳׳¢׳§׳•׳£ ׳”׳¨׳©׳׳•׳× ׳׳“׳׳™׳ ׳׳• ׳¨׳׳•׳× ׳׳ ׳•׳™.",
    howToUse: "Paste into your AI chat when creating new Supabase tables to generate airtight SQL policies.",
    howToUseHe: "׳”׳“׳‘׳§ ׳‘׳¦'׳׳˜ ׳‘׳¢׳× ׳™׳¦׳™׳¨׳× ׳˜׳‘׳׳׳•׳× ׳—׳“׳©׳•׳× ׳‘-Supabase ׳›׳“׳™ ׳׳§׳‘׳ ׳׳“׳™׳ ׳™׳•׳× SQL ׳׳׳•׳‘׳˜׳—׳× ׳׳•׳›׳ ׳” ׳׳”׳¨׳¦׳”.",
    expectedResult: "Executable SQL migration with Row-Level Security policies and column protection triggers.",
    expectedResultHe: "׳§׳•׳“ SQL ׳׳•׳›׳ ׳׳”׳¨׳¦׳” ׳”׳›׳•׳׳ ׳׳“׳™׳ ׳™׳•׳× RLS ׳•׳˜׳¨׳™׳’׳¨ ׳׳‘׳˜׳—׳” ׳‘׳¨׳׳× ׳”׳©׳¨׳×.",
    powershellReadyPrompt: "Write a complete Supabase SQL migration enabling Row-Level Security (RLS) on all tables and creating a SECURITY DEFINER trigger preventing standard users from modifying is_admin or purchased_track_level.",
    securityNote: "Never leave a Supabase table without Enable RLS and explicit SELECT/INSERT/UPDATE policies.",
    securityNoteHe: "׳׳™׳ ׳׳”׳©׳׳™׳¨ ׳˜׳‘׳׳” ׳‘-Supabase ׳׳׳ ׳”׳₪׳¢׳׳× RLS ׳•׳׳“׳™׳ ׳™׳•׳× ׳’׳™׳©׳” ׳׳₪׳•׳¨׳©׳×.",
    sampleOutput: "RLS policies active + sensitive column protection trigger verified in Supabase SQL Editor."
  },
  {
    id: "vp-5",
    stageNumber: 5,
    category: "5. Terminal, API Keys, Tokens & .env Security",
    categoryHe: "5. ׳׳‘׳˜׳—׳× ׳˜׳¨׳׳™׳ ׳, ׳׳₪׳×׳—׳•׳× API ׳•׳§׳•׳‘׳¦׳™ .env",
    title: "Secret Isolation, .gitignore Lock & Server-Only Key Enforcement",
    titleHe: "׳‘׳™׳“׳•׳“ ׳¡׳•׳“׳•׳×, ׳ ׳¢׳™׳׳× .gitignore ׳•׳׳›׳™׳₪׳× ׳׳₪׳×׳—׳•׳× ׳©׳¨׳× ׳‘׳׳‘׳“",
    goal: "Prevent leaking API keys, database passwords, or tokens to GitHub or client bundles.",
    goalHe: "׳׳ ׳™׳¢׳” ׳׳•׳—׳׳˜׳× ׳©׳ ׳“׳׳™׳₪׳× ׳׳₪׳×׳—׳•׳× API, ׳¡׳™׳¡׳׳׳•׳× ׳׳• ׳˜׳•׳§׳ ׳™׳ ׳-GitHub ׳׳• ׳׳§׳•׳“ ׳”׳“׳₪׳“׳₪׳.",
    howToUse: "Run this audit prompt before every GitHub upload or production deployment.",
    howToUseHe: "׳”׳₪׳¢׳ ׳₪׳¨׳•׳׳₪׳˜ ׳‘׳™׳§׳•׳¨׳× ׳–׳” ׳׳₪׳ ׳™ ׳›׳ ׳”׳¢׳׳׳× ׳§׳‘׳¦׳™׳ ׳-GitHub ׳›׳“׳™ ׳׳•׳•׳“׳ ׳©׳׳£ ׳׳₪׳×׳— ׳¡׳•׳“׳™ ׳׳ ׳ ׳—׳©׳£.",
    expectedResult: "Verification that .env.local is ignored by Git and zero private keys exist in client code.",
    expectedResultHe: "׳׳™׳׳•׳× ׳©׳§׳•׳‘׳¥ .env.local ׳—׳¡׳•׳ ׳‘-.gitignore ׳•׳©׳׳™׳ ׳׳₪׳×׳—׳•׳× ׳₪׳¨׳˜׳™׳™׳ ׳‘׳§׳•׳“ ׳”׳׳§׳•׳—.",
    powershellReadyPrompt: "Write a PowerShell security check verifying .env.local is excluded in .gitignore, creating a safe .env.example template without real values, and auditing src/ to ensure no secret key without NEXT_PUBLIC_ is exposed in client code.",
    securityNote: "Golden Rule: Secret keys (SERVICE_ROLE_KEY, GEMINI_API_KEY, WEBHOOK_SECRET) must never start with NEXT_PUBLIC_ or be committed to Git.",
    securityNoteHe: "׳›׳׳ ׳‘׳¨׳–׳: ׳׳₪׳×׳—׳•׳× ׳¡׳•׳“׳™׳™׳ ׳׳¢׳•׳׳ ׳׳ ׳™׳×׳—׳™׳׳• ׳‘-NEXT_PUBLIC_ ׳•׳׳¢׳•׳׳ ׳׳ ׳™׳•׳¢׳׳• ׳-GitHub.",
    sampleOutput: ".env.local locked in .gitignore + client secret scan passed + server keys isolated in Route Handlers."
  },
  {
    id: "vp-6",
    stageNumber: 6,
    category: "6. Verified Payments, Webhooks & Automation",
    categoryHe: "6. סליקה מאומתת, Webhooks ואוטומציה",
    title: "Cryptographic HMAC Signature Verification & Real-Time Alerts",
    titleHe: "אימות חתימת HMAC קריפטוגרפית ועדכון הרשאות אוטומטי",
    goal: "Process payments and webhook automations without allowing client-side URL spoofing.",
    goalHe: "עיבוד תשלומים ואוטומציות בצד השרת בלבד ללא אפשרות לזיוף פרמטרים בדפדפן.",
    howToUse: "Use when connecting payment providers so tier upgrades happen strictly after server signature validation.",
    howToUseHe: "השתמש בעת חיבור מערכת סליקה כדי ששדרוג חשבון יתבצע רק לאחר אימות חתימה בשרת.",
    expectedResult: "A secured Next.js API Route Handler verifying HMAC signatures and updating Supabase.",
    expectedResultHe: "נתיב שרת מאובטח המאמת חתימת Webhook ומעדכן את הרשאות המשתמש במסד הנתונים.",
    powershellReadyPrompt: "Write a PowerShell script creating a server Route Handler (src\\app\\api\\webhooks\\payment\\route.ts) that verifies HMAC-SHA256 signatures against process.env.WEBHOOK_SECRET, upgrades user access in Supabase, and triggers an instant admin alert.",
    securityNote: "Trust only server-verified signed webhooks — never unlock paid tiers based on browser query parameters.",
    securityNoteHe: "סמוך אך ורק על Webhooks חתומים בצד השרת — לעולם אל תפתח גישה לפי פרמטרים בכתובת הדפדפן.",
    sampleOutput: "HMAC-verified /api/webhooks/payment endpoint + automated purchase notification active."
  },
  {
    id: "vp-7",
    stageNumber: 7,
    category: "7. Vercel Production Deployment & HTTPS",
    categoryHe: "7. פריסת ייצור ב-Vercel ואבטחת HTTPS",
    title: "Production Release, Environment Variables & HTTPS Link Gate",
    titleHe: "בדיקת בנייה מלאה, משתני סביבה ופריסה חיה בייצור",
    goal: "Deploy a live HTTPS production app protected against XSS and unverified links.",
    goalHe: "העלאת גרסת ייצור יציבה ומהירה לאוויר לאחר אימות בנייה וסינון קישורים לא מאובטחים.",
    howToUse: "Run before pushing to production to verify all routes compile cleanly with zero TypeScript errors.",
    howToUseHe: "הרץ לפני העלאה לייצור כדי לוודא שכל הנתיבים נבנים בהצלחה עם 0 שגיאות.",
    expectedResult: "Clean production build output and verified HTTP 200 status across all live endpoints.",
    expectedResultHe: "פלט בנייה נקי ב-0 שגיאות ובדיקת זמינות HTTP 200 לכל דפי האתר החי.",
    powershellReadyPrompt: "Write a PowerShell release script that runs a full production build check, verifies required environment variables, and pushes a clean commit to GitHub main for automatic Vercel deployment.",
    securityNote: "Configure all .env.local secrets in Vercel Dashboard -> Settings -> Environment Variables before deploying.",
    securityNoteHe: "הגדר את כל משתני הסביבה מ-.env.local בלוח הבקרה של Vercel לפני הפריסה.",
    sampleOutput: "Production build passed with 0 errors + live HTTPS deployment verified on Vercel."
  },
  {
    id: "vp-8",
    stageNumber: 8,
    category: "8. Organic Growth & Ethical Outreach",
    categoryHe: "8. צמיחה אורגנית ושיווק אתי",
    title: "High-Converting Value Proposition & Disclosure-Safe Outreach",
    titleHe: "כתיבת הצעת ערך ממירה ותסריטי הפצה עם גילוי נאות",
    goal: "Turn your live production asset into client leads using non-spammy outreach workflows.",
    goalHe: "הפיכת המוצר החי ללידים ולקוחות באמצעות תוכן מבוסס ערך וגילוי נאות חוקי.",
    howToUse: "Paste together with your live portfolio or deal link to generate compliant outreach copy.",
    howToUseHe: "הדבק יחד עם קישור הפורטפוליו או הדיל שלך כדי ליצור נוסחי הפצה אמינים וחוקיים.",
    expectedResult: "3 tailored outreach messages for WhatsApp, LinkedIn, and direct founder DMs.",
    expectedResultHe: "3 תסריטי פנייה מותאמים לוואטסאפ, לינקדאין והודעה ישירה עם הנעה לפעולה.",
    powershellReadyPrompt: "Follow the ProofCraft method: write 3 high-trust organic outreach scripts (direct founder DM, LinkedIn engineering breakdown post, and value-first technical comment) linking to my live Verified Portfolio with proper affiliate/ad disclosure.",
    securityNote: "Share only verified HTTPS links and include clear disclosure (#ad / גילוי נאות) on affiliate promotions.",
    securityNoteHe: "שתף רק קישורי HTTPS מאומתים וצרף גילוי נאות ברור בכל המלצת שותפים.",
    sampleOutput: "3 ready-to-send organic client acquisition scripts with clear calls to action."
  },
  {
    id: "vp-9",
    stageNumber: 9,
    category: "9. Session Handoff & Context Continuity",
    categoryHe: "9. סיכום חלון שיחה והמשך רציף ללא איבוד הקשר",
    title: "Master Session Handoff Blueprint Generator (Zero Context Loss)",
    titleHe: "סיכום מקצועי של חלון שיחה והעברת הקשר מלא לסשן חדש",
    goal: "Compress the entire technical history, Git commit state, file paths, and exact next step into a structured handoff prompt for a fresh AI chat window.",
    goalHe: "דחיסת כל ההיסטוריה הטכנית, מצב ה-Git, נתיבי הקבצים ונקודת הזינוק המדויקת למסמך העברת הקשר מלא לפתיחת חלון שיחה חדש.",
    howToUse: "Run this at the end of a long AI chat session before opening a new window, then paste the generated summary as the first message in the new chat.",
    howToUseHe: "הפעל פרומפט זה בסיום חלון שיחה ארוך, והדבק את הסיכום שיתקבל כהודעה הראשונה בחלון השיחה החדש כדי להמשיך בדיוק מאותה נקודה.",
    expectedResult: "A structured Master Handoff Blueprint containing tech stack, active rules, recent commits, solved bugs, and the exact next command.",
    expectedResultHe: "מסמך העברת הקשר מלא הכולל מחסנית טכנולוגית, כללי עבודה, היסטוריית גרסאות, תקלות שנפתרו ופקודת ההמשך המדויקת.",
    powershellReadyPrompt: "Create a complete Master Handoff Blueprint summarizing everything built in this session: project path, tech stack, latest Git commit hash, all modified/created files, solved technical pitfalls, mandatory coding rules, and the exact next step to execute. Format it as a ready-to-paste prompt for a new AI chat session so we continue seamlessly with zero context loss.",
    securityNote: "Review the generated handoff summary to ensure zero API keys or passwords are included before pasting.",
    securityNoteHe: "ודא שהסיכום שנוצר אינו מכיל מפתחות API או סיסמאות לפני שמירתו או הדבקתו.",
    sampleOutput: "Complete Master Handoff Blueprint ready to paste as Message #1 in a fresh AI session."
  },
  {
    id: "vp-10",
    stageNumber: 10,
    category: "10. Truncated Command & Terminal Recovery",
    categoryHe: "10. שחזור פקודה שנחתכה והכנתה מחדש מהמצב התקין",
    title: "Truncated Output Recovery & Safe Split-Command Rebuilder",
    titleHe: "שחזור פקודה שנחתכה בהודעה אחרונה והמשך מהמצב התקין בטרמינל",
    goal: "Recover immediately when a long terminal command or code block gets cut off during copy-paste, without duplicating or corrupting files.",
    goalHe: "התאוששות מיידית כאשר פקודת PowerShell או בלוק קוד נחתכים באמצע ההדבקה, תוך המשך מדויק מהנקודה התקינה האחרונה בטרמינל.",
    howToUse: "Copy the last 15 lines from your terminal output and paste them right below this prompt so the AI rebuilds only the remaining part in short safe chunks.",
    howToUseHe: "העתק את 15 השורות האחרונות מתוך הטרמינל שלך והדבק אותן מתחת לפרומפט זה כדי שהצ'אט ישלים רק את החלק החסר בפקודות קצרות ובטוחות.",
    expectedResult: "Diagnosis of the exact cut-off point plus short (<50 lines) ASCII-safe PowerShell chunks with a final verification check.",
    expectedResultHe: "אבחון מדויק של נקודת החיתוך ופיצול מחדש לפקודות קצרות ובטוחות הכוללות אימות הצלחה בסיום.",
    powershellReadyPrompt: "My previous terminal command was truncated during paste. Based on the last terminal output pasted below, identify the exact last completed step, do NOT duplicate already-written code, and regenerate only the remaining steps split into short PowerShell commands (under 50 lines each) using UTF-8 without BOM and ending with a clear verification check.",
    securityNote: "Always split PowerShell scripts over 55 lines into Part A and Part B and avoid raw angle brackets in search anchors.",
    securityNoteHe: "פצל תמיד פקודות מעל 55 שורות לחלק א׳ וחלק ב׳ והימנע מתווי סוגריים משולשים בעוגני חיפוש.",
    sampleOutput: "Exact cut-off diagnosis + Part A / Part B short safe PowerShell scripts + verified build check."
  }
];