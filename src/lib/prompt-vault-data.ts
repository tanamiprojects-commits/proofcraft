export interface VaultPromptItem {
  id: string; stageNumber: number; category: string; categoryHe: string;
  title: string; titleHe: string; goal: string; goalHe: string;
  howToUse: string; howToUseHe: string; expectedResult: string; expectedResultHe: string;
  powershellReadyPrompt: string; securityNote: string; securityNoteHe: string; sampleOutput: string;
}

export const PROMPT_VAULT_CATALOG: VaultPromptItem[] = [
  {
    id: "vp-1", stageNumber: 1, category: "1. Product Architecture & Spec", categoryHe: "1. ארכיטקטורת מוצר ואפיון",
    title: "Full System Spec, Normalized DB Schema & User Flows", titleHe: "אפיון מערכת מלא, סכימת מסד נתונים וזרימות משתמש",
    goal: "Turn a raw product idea into a production technical spec with separation of concerns and RLS.",
    goalHe: "הפיכת רעיון גולמי למפרט הנדסי מלא עם הפרדת שכבות ואבטחת RLS מהרגע הראשון.",
    howToUse: "Paste at the start of a new project chat together with your product goal and target users.",
    howToUseHe: "הדבק בתחילת שיחה חדשה יחד עם תיאור הרעיון וקהל היעד כדי שהצ'אט יבנה מפת דרכים מסודרת לפני כתיבת קוד.",
    expectedResult: "A complete 4-table PostgreSQL schema, API route map, and step-by-step build order.",
    expectedResultHe: "תרשים טבלאות PostgreSQL מנורמל, מפת נתיבי API ותוכנית בנייה מדורגת.",
    powershellReadyPrompt: "Follow the ProofCraft method: design a complete system architecture including normalized PostgreSQL tables, user roles, server-side API flows, and a modular PowerShell execution roadmap.",
    securityNote: "Never embed private keys in public specs.", securityNoteHe: "לעולם אל תכלול מפתחות פרטיים במסמכי אפיון.",
    sampleOutput: "Normalized 4-table PostgreSQL schema + user_id RLS policies + secured /api route map."
  },
  {
    id: "vp-2", stageNumber: 2, category: "2. UI/UX & Obsidian Design System", categoryHe: "2. עיצוב ממשק ומערכת Obsidian",
    title: "Fintech Dark UI System with High Contrast & Responsive Layout", titleHe: "מערכת עיצוב פינטק כהה עם ניגודיות גבוהה ורספונסיביות מלאה",
    goal: "Create an airy, AA-contrast interface optimized for mobile and desktop viewports.",
    goalHe: "יצירת ממשק מרווח ויוקרתי המותאם בצורה מושלמת למסכי טלפון נייד ומחשב.",
    howToUse: "Run this before building pages so all cards, buttons, and grids share unified design tokens.",
    howToUseHe: "הגש פרומפט זה לפני בניית הדפים כדי לקבע מערכת עיצוב אחידה ללא גלילה אופקית במובייל.",
    expectedResult: "Updated globals.css with dark fintech tokens, responsive grids, and accessible contrast.",
    expectedResultHe: "קובץ globals.css מעודכן עם משתני צבע, כרטיסים מרווחים ותאימות מלאה למובייל.",
    powershellReadyPrompt: "Generate a PowerShell script updating src\\app\\globals.css to a fintech dark design system (#F8FAFC on #0A0B0E), spacious cards, responsive grids, and zero horizontal overflow.",
    securityNote: "Never use dangerouslySetInnerHTML for user content.", securityNoteHe: "אין להשתמש ב-dangerouslySetInnerHTML לתוכן משתמשים.",
    sampleOutput: "Unified Design Tokens in globals.css with 14.5:1 contrast ratio."
  },
  {
    id: "vp-3", stageNumber: 3, category: "3. Modular Feature Execution", categoryHe: "3. פיתוח רכיבים מודולריים",
    title: "Zero-Manual Modular Component Delivery via UTF-8 PowerShell", titleHe: "יצירת רכיבי קוד שלמים ב-PowerShell בקידוד UTF-8 ללא BOM",
    goal: "Write clean TypeScript/React components directly via UTF-8 without BOM PowerShell scripts.",
    goalHe: "כתיבת רכיבי React/TypeScript מלאים ישירות לתיקיית הפרויקט ללא שגיאות קידוד עברית.",
    howToUse: "Use whenever adding a new feature so the AI delivers full files instead of partial snippets.",
    howToUseHe: "השתמש בפרומפט זה בכל הוספת פיצ'ר כדי לקבל קבצים מלאים ומוכנים להרצה ללא קטעים חסרים.",
    expectedResult: "A complete component file written in UTF-8 without BOM plus a passing npm run build check.",
    expectedResultHe: "קובץ רכיב מלא שנכתב ב-UTF-8 ללא BOM ועובר בדיקת npm run build ב-0 שגיאות.",
    powershellReadyPrompt: "Write a complete PowerShell command using [System.Text.UTF8Encoding]::new($false) that creates a modular React/TypeScript component, wires it into the page, and runs npm run build to verify zero errors.",
    securityNote: "Always use UTF-8 without BOM.", securityNoteHe: "כתוב קבצים תמיד בקידוד UTF-8 ללא BOM.",
    sampleOutput: "Component created in src\\components + npm run build verified."
  },
  {
    id: "vp-4", stageNumber: 4, category: "4. Cloud Database & RLS Security", categoryHe: "4. מסד נתונים ענן ואבטחת RLS",
    title: "Hermetic User Data Isolation & Anti-Cheat Trigger Enforcement", titleHe: "בידוד נתוני משתמשים הרמטי והגנה מפני זיוף הרשאות",
    goal: "Ensure every user accesses only their own rows and cannot spoof admin roles or paid tiers.",
    goalHe: "הבטחה שכל משתמש ניגש רק לרשומות שלו ואינו יכול לעקוף הרשאות אדמין או רמות מנוי.",
    howToUse: "Paste into your AI chat when creating new Supabase tables to generate airtight SQL policies.",
    howToUseHe: "הדבק בצ'אט בעת יצירת טבלאות חדשות ב-Supabase כדי לקבל מדיניות SQL מאובטחת מוכנה להרצה.",
    expectedResult: "Executable SQL migration with Row-Level Security policies and column protection triggers.",
    expectedResultHe: "קוד SQL מוכן להרצה הכולל מדיניות RLS וטריגר אבטחה ברמת השרת.",
    powershellReadyPrompt: "Write a complete Supabase SQL migration enabling Row-Level Security (RLS) on all tables and creating a SECURITY DEFINER trigger preventing standard users from modifying is_admin or purchased_track_level.",
    securityNote: "Never leave a Supabase table without RLS.", securityNoteHe: "אין להשאיר טבלה ב-Supabase ללא הפעלת RLS.",
    sampleOutput: "RLS policies active + sensitive column protection trigger verified."
  },
  {
    id: "vp-5", stageNumber: 5, category: "5. Terminal & .env Security", categoryHe: "5. אבטחת טרמינל וקובצי .env",
    title: "Secret Isolation, .gitignore Lock & Server-Only Key Enforcement", titleHe: "בידוד סודות, נעילת .gitignore ואכיפת מפתחות שרת בלבד",
    goal: "Prevent leaking API keys, database passwords, or tokens to GitHub or client bundles.",
    goalHe: "מניעה מוחלטת של דליפת מפתחות API, סיסמאות או טוקנים ל-GitHub או לקוד הדפדפן.",
    howToUse: "Run this audit prompt before every GitHub upload or production deployment.",
    howToUseHe: "הפעל פרומפט ביקורת זה לפני כל העלאת קבצים ל-GitHub כדי לוודא שאף מפתח סודי לא נחשף.",
    expectedResult: "Verification that .env.local is ignored by Git and zero private keys exist in client code.",
    expectedResultHe: "אימות שקובץ .env.local חסום ב-.gitignore ושאין מפתחות פרטיים בקוד הלקוח.",
    powershellReadyPrompt: "Write a PowerShell security check verifying .env.local is excluded in .gitignore, creating a safe .env.example template without real values, and auditing src/ to ensure no secret key without NEXT_PUBLIC_ is exposed in client code.",
    securityNote: "Secret keys must never start with NEXT_PUBLIC_.", securityNoteHe: "מפתחות סודיים לעולם לא יתחילו ב-NEXT_PUBLIC_.",
    sampleOutput: ".env.local locked in .gitignore + client secret scan passed."
  },
  {
    id: "vp-6", stageNumber: 6, category: "6. Verified Payments & Webhooks", categoryHe: "6. סליקה מאומתת ו-Webhooks",
    title: "Cryptographic HMAC Signature Verification & Real-Time Alerts", titleHe: "אימות חתימת HMAC קריפטוגרפית ועדכון הרשאות אוטומטי",
    goal: "Process payments and webhook automations without allowing client-side URL spoofing.",
    goalHe: "עיבוד תשלומים ואוטומציות בצד השרת בלבד ללא אפשרות לזיוף פרמטרים בדפדפן.",
    howToUse: "Use when connecting payment providers so tier upgrades happen strictly after server validation.",
    howToUseHe: "השתמש בעת חיבור מערכת סליקה כדי ששדרוג חשבון יתבצע רק לאחר אימות חתימה בשרת.",
    expectedResult: "A secured Next.js API Route Handler verifying HMAC signatures and updating Supabase.",
    expectedResultHe: "נתיב שרת מאובטח המאמת חתימת Webhook ומעדכן את הרשאות המשתמש במסד הנתונים.",
    powershellReadyPrompt: "Write a PowerShell script creating a server Route Handler (src\\app\\api\\webhooks\\payment\\route.ts) that verifies HMAC-SHA256 signatures against process.env.WEBHOOK_SECRET, upgrades user access in Supabase, and triggers an instant admin alert.",
    securityNote: "Trust only server-verified signed webhooks.", securityNoteHe: "סמוך אך ורק על Webhooks חתומים בצד השרת.",
    sampleOutput: "HMAC-verified /api/webhooks/payment endpoint active."
  },
  {
    id: "vp-7", stageNumber: 7, category: "7. Vercel Production Deployment", categoryHe: "7. פריסת ייצור ב-Vercel",
    title: "Production Release, Environment Variables & HTTPS Link Gate", titleHe: "בדיקת בנייה מלאה, משתני סביבה ופריסה חיה בייצור",
    goal: "Deploy a live HTTPS production app protected against XSS and unverified links.",
    goalHe: "העלאת גרסת ייצור יציבה ומהירה לאוויר לאחר אימות בנייה וסינון קישורים לא מאובטחים.",
    howToUse: "Run before pushing to production to verify all routes compile cleanly with zero TypeScript errors.",
    howToUseHe: "הרץ לפני העלאה לייצור כדי לוודא שכל הנתיבים נבנים בהצלחה עם 0 שגיאות.",
    expectedResult: "Clean production build output and verified HTTP 200 status across all live endpoints.",
    expectedResultHe: "פלט בנייה נקי ב-0 שגיאות ובדיקת זמינות HTTP 200 לכל דפי האתר החי.",
    powershellReadyPrompt: "Write a PowerShell release script that runs a full production build check, verifies required environment variables, and pushes a clean commit to GitHub main for automatic Vercel deployment.",
    securityNote: "Configure all .env.local secrets in Vercel Dashboard.", securityNoteHe: "הגדר את כל משתני הסביבה בלוח הבקרה של Vercel.",
    sampleOutput: "Production build passed with 0 errors + live HTTPS deployment verified."
  },
  {
    id: "vp-8", stageNumber: 8, category: "8. Organic Growth & Ethical Outreach", categoryHe: "8. צמיחה אורגנית ושיווק אתי",
    title: "High-Converting Value Proposition & Disclosure-Safe Outreach", titleHe: "כתיבת הצעת ערך ממירה ותסריטי הפצה עם גילוי נאות",
    goal: "Turn your live production asset into client leads using non-spammy outreach workflows.",
    goalHe: "הפיכת המוצר החי ללידים ולקוחות באמצעות תוכן מבוסס ערך וגילוי נאות חוקי.",
    howToUse: "Paste together with your live portfolio or deal link to generate compliant outreach copy.",
    howToUseHe: "הדבק יחד עם קישור הפורטפוליו או הדיל שלך כדי ליצור נוסחי הפצה אמינים וחוקיים.",
    expectedResult: "3 tailored outreach messages for WhatsApp, LinkedIn, and direct founder DMs.",
    expectedResultHe: "3 תסריטי פנייה מותאמים לוואטסאפ, לינקדאין והודעה ישירה עם הנעה לפעולה.",
    powershellReadyPrompt: "Follow the ProofCraft method: write 3 high-trust organic outreach scripts (direct founder DM, LinkedIn engineering breakdown post, and value-first technical comment) linking to my live Verified Portfolio with proper affiliate/ad disclosure.",
    securityNote: "Include clear disclosure (#ad / גילוי נאות) on affiliate promotions.", securityNoteHe: "צרף גילוי נאות ברור בכל המלצת שותפים.",
    sampleOutput: "3 ready-to-send organic client acquisition scripts."
  },
  {
    id: "vp-9", stageNumber: 9, category: "9. Session Handoff & Context Continuity", categoryHe: "9. סיכום חלון שיחה והמשך רציף",
    title: "Master Session Handoff Blueprint Generator (Zero Context Loss)", titleHe: "סיכום מקצועי של חלון שיחה והעברת הקשר מלא לסשן חדש",
    goal: "Compress the entire technical history, Git commit state, file paths, and exact next step into a structured handoff prompt.",
    goalHe: "דחיסת כל ההיסטוריה הטכנית, מצב ה-Git, נתיבי הקבצים ונקודת הזינוק המדויקת למסמך העברת הקשר מלא לפתיחת חלון שיחה חדש.",
    howToUse: "Run at the end of a long AI chat session, then paste the summary as Message #1 in a new chat window.",
    howToUseHe: "הפעל בסיום חלון שיחה ארוך, והדבק את הסיכום שיתקבל כהודעה הראשונה בחלון השיחה החדש כדי להמשיך מאותה נקודה.",
    expectedResult: "A structured Master Handoff Blueprint with stack, rules, commits, solved bugs, and exact next command.",
    expectedResultHe: "מסמך העברת הקשר מלא הכולל מחסנית טכנולוגית, כללי עבודה, היסטוריית גרסאות, תקלות שנפתרו ופקודת ההמשך.",
    powershellReadyPrompt: "Create a complete Master Handoff Blueprint summarizing everything built in this session: project path, tech stack, latest Git commit hash, all modified/created files, solved technical pitfalls, mandatory coding rules, and the exact next step to execute.",
    securityNote: "Ensure zero API keys or passwords appear in the summary.", securityNoteHe: "ודא שאף מפתח API או סיסמה לא נכללים בסיכום.",
    sampleOutput: "Complete Master Handoff Blueprint ready for Message #1."
  },
  {
    id: "vp-10", stageNumber: 10, category: "10. Truncated Command Recovery", categoryHe: "10. שחזור פקודה שנחתכה בטרמינל",
    title: "Truncated Output Recovery & Safe Split-Command Rebuilder", titleHe: "שחזור פקודה שנחתכה בהודעה אחרונה והמשך מהמצב התקין",
    goal: "Recover immediately when a long terminal command or code block gets cut off during copy-paste.",
    goalHe: "התאוששות מיידית כאשר פקודת PowerShell או בלוק קוד נחתכים באמצע ההדבקה, תוך המשך מדויק מהנקודה התקינה האחרונה.",
    howToUse: "Copy the last 15 lines from your terminal output and paste them below this prompt.",
    howToUseHe: "העתק את 15 השורות האחרונות מתוך הטרמינל שלך והדבק אותן מתחת לפרומפט זה כדי להשלים רק את החלק החסר.",
    expectedResult: "Diagnosis of the exact cut-off point plus short (<30 lines) safe PowerShell chunks.",
    expectedResultHe: "אבחון נקודת החיתוך ופיצול מחדש לפקודות קצרות ובטוחות עם אימות הצלחה בסיום.",
    powershellReadyPrompt: "My previous terminal command was truncated during paste. Based on the last terminal output pasted below, identify the exact last completed step, do NOT duplicate already-written code, and regenerate only the remaining steps split into short PowerShell commands (under 30 lines each) using UTF-8 without BOM.",
    securityNote: "Split scripts over 30 lines into short safe chunks.", securityNoteHe: "פצל תמיד פקודות מעל 30 שורות לחלקים קצרים ובטוחים.",
    sampleOutput: "Exact cut-off diagnosis + short safe scripts."
  },
  {
    id: "vp-11", stageNumber: 11, category: "11. Full-Platform Master Handover", categoryHe: "11. העברת הקשר של פלטפורמה שלמה",
    title: "Enterprise Full-Platform Master Blueprint & Admin Handover Generator", titleHe: "מחולל מסמך העברת הקשר מלא של פלטפורמה שלמה (Master Blueprint)",
    goal: "Generate an exhaustive end-to-end engineering, operational, security, and legal Master Blueprint of an entire live platform.",
    goalHe: "הפקת מסמך העברת הקשר מלא מקצה לקצה הכולל את כל ההיסטוריה מיום הרעיון, מפת הקבצים, תקנון העבודה, מצב הייצור וה-Admin OS.",
    howToUse: "Run at the end of a major milestone and paste the resulting Master Blueprint into any fresh AI chat window.",
    howToUseHe: "הפעל בסיום אבן דרך מרכזית והדבק את מסמך ה-Master Blueprint שייווצר כהודעה הראשונה בכל חלון שיחה חדש.",
    expectedResult: "A comprehensive 7-section Master Platform Blueprint for immediate maintenance or upgrades.",
    expectedResultHe: "מסמך Master Blueprint בן 7 פרקים המאפשר לכל צ'אט חדש להמשיך לתחזק ולשדרג מאותה שנייה.",
    powershellReadyPrompt: "Act as Principal Systems Architect & Lead DevOps Engineer. Generate a complete, exhaustive Master Handover Blueprint for our live platform so we can continue maintenance, security audits, or feature upgrades in a brand-new AI chat session with 100% context continuity.",
    securityNote: "Verify zero .env.local secrets are included.", securityNoteHe: "ודא שאף מפתח סודי מ-.env.local לא נכלל במסמך.",
    sampleOutput: "Complete 7-Section Master Platform Blueprint ready for Message #1."
  }
];