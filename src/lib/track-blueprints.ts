export interface TrackBlueprint {
  level: number;
  versionTag: string;
  badgeTitle: string;
  hebrewTitle: string;
  whoIsItFor: string;
  whatYouGetSummary: string;
  freeToolsChain: { name: string; url: string; role: string }[];
  projectIdeaTitle: string;
  evolutionExplanation: string;
  threeStepPrompts: { stepLabel: string; prompt: string }[];
  proTips: string[];
  readyPortfolioTitleExample: string;
  readyPortfolioDescExample: string;
  samplePreviewHeadline: string;
  samplePreviewProjects: { title: string; tag: string; desc: string }[];
}

export const TRACK_BLUEPRINTS: Record<number, TrackBlueprint> = {
  1: {
    level: 1,
    versionTag: "v1.0 · MVP & WhatsApp Ordering",
    badgeTitle: "Junior AI Builder",
    hebrewTitle: "מסלול 1: מפתח זעיר (MVP & Landing)",
    whoIsItFor: "למתחילים שרוצים להקים תוך יום דף נחיתה עסקי ממיר עם מנוע הזמנות חכם ללא שרת ולהשיג לקוחות ראשונים.",
    whatYouGetSummary: "פרופיל Junior מאומת + נכס v1.0 (דף נחיתה עם הזמנות WhatsApp) + תעודה רשמית.",
    freeToolsChain: [
      { name: "Google AI Studio", url: "https://aistudio.google.com", role: "כתיבת קופי שיווקי ואפיון הדף (חינם)" },
      { name: "Lovable / Bolt.new", url: "https://lovable.dev", role: "בניית דף הנחיתה המעוצב מפרומפט (חינם)" },
      { name: "Vercel", url: "https://vercel.com", role: "פריסה לאוויר וקבלת לינק HTTPS חי (חינם)" },
    ],
    projectIdeaTitle: "v1.0: דף נחיתה עסקי ממיר עם הזמנות WhatsApp ללא שרת",
    evolutionExplanation: "זהו הבסיס של המוצר העסקי שלך: דף מהיר שמוכר שירות/מוצר ומעביר את פרטי ההזמנה של הלקוח ישירות לוואטסאפ של בעל העסק — בלי צורך בשרת או סליקה בשלב הראשון.",
    threeStepPrompts: [
      { stepLabel: "פקודה 1: בניית השלד והעיצוב", prompt: "בנה דף נחיתה מודרני ורספונסיבי בעברית (RTL) עבור [תחום העסק]. כלול כותרת ראשית ממירה, 3 כרטיסי חבילות שירות עם מחירים, המלצות לקוחות וכפתור נגישות צף." },
      { stepLabel: "פקודה 2: מנוע הזמנות WhatsApp ללא שרת", prompt: "הוסף לדף טופס הזמנה חכם ללא שרת: הלקוח בוחר שירות, מזין שם וטלפון, ובלחיצה נפתח קישור WhatsApp עם הודעה מובנית הכוללת את כל פרטי ההזמנה." },
      { stepLabel: "פקודה 3: ליטוש מובייל והכנה להשקה", prompt: "בדוק תצוגת מובייל מלאה ללא גלילה אופקית, הוסף תגיות Meta ו-OpenGraph לשיתוף מרשים בוואטסאפ, וודא שכל הכפתורים קריאים ונגישים." },
    ],
    proTips: [
      "השתמש בתגיות OpenGraph כדי שכשבעל העסק שולח את הלינק בוואטסאפ תופיע תצוגה מקדימה יוקרתית.",
      "כווץ כל תמונה ב-TinyPNG לפני ההעלאה כדי שהדף ייטען בפחות משנייה במובייל.",
      "הוסף בראש הדף כפתור חיוג/וואטסאפ מהיר — 70% מהגולשים בישראל נכנסים מהנייד.",
    ],
    readyPortfolioTitleExample: "v1.0 — דף נחיתה עסקי עם מנוע הזמנות WhatsApp ללא שרת",
    readyPortfolioDescExample: "דף נחיתה רספונסיבי בעברית (RTL) הכולל תצוגת שירותים, נגישות ומנוע הזמנות חכם המעביר פרטי לקוח ישירות לוואטסאפ ללא תחזוקת שרת.",
    samplePreviewHeadline: "בונה דפי נחיתה ומערכות הזמנה חכמות לעסקים",
    samplePreviewProjects: [
      { title: "v1.0 — דף נחיתה ממיר עם הזמנות WhatsApp", tag: "נכס מסלול 1 · חי באוויר", desc: "מנוע הזמנות ללא שרת + עיצוב מותאם מובייל." },
    ],
  },
  2: {
    level: 2,
    versionTag: "v2.0 · Cloud DB & User Accounts",
    badgeTitle: "Full-Stack AI Builder",
    hebrewTitle: "מסלול 2: מפתח פול-סטאק (SaaS & DB)",
    whoIsItFor: "לבונים שרוצים לשדרג דפי נחיתה למערכות SaaS אמיתיות עם מסד נתונים בענן, הרשמת משתמשים ואזור אישי.",
    whatYouGetSummary: "פרופיל Full-Stack + נכסים v1.0 + v2.0 (מערכת ענן עם Supabase) + תעודה רשמית.",
    freeToolsChain: [
      { name: "Cursor AI", url: "https://cursor.com", role: "פיתוח אפליקציית Next.js Full-Stack (תוכנית חינם)" },
      { name: "Supabase Free", url: "https://supabase.com", role: "מסד נתונים PostgreSQL והרשמת משתמשים (חינם)" },
      { name: "Vercel", url: "https://vercel.com", role: "אירוח האפליקציה באוויר (חינם)" },
    ],
    projectIdeaTitle: "v2.0: שדרוג הפרויקט למערכת SaaS עם מסד נתונים ואזור לקוח",
    evolutionExplanation: "כאן אתה לוקח את הפרויקט העסקי ומחבר אותו לענן: במקום שההזמנות יישלחו רק בהודעה, הן נשמרות בטבלת PostgreSQL מאובטחת, והלקוחות יכולים להירשם ולעקוב אחר הסטטוס.",
    threeStepPrompts: [
      { stepLabel: "פקודה 1: בניית סכמת SQL והרשאות RLS", prompt: "צור שאילתת SQL ל-Supabase הכוללת טבלת profiles וטבלת orders עם קישור ל-auth.users ומדיניות RLS כך שכל משתמש רואה רק את ההזמנות שלו." },
      { stepLabel: "פקודה 2: חיבור הרשמה ושמירה בענן", prompt: "חבר את טופס ההזמנה בדף לשמירה ישירה בטבלת orders ב-Supabase, והוסף מסך התחברות והרשמה שבו הלקוח רואה את היסטוריית ההזמנות שלו." },
      { stepLabel: "פקודה 3: תמיכה דו-לשונית (עברית/אנגלית)", prompt: "הוסף מתג החלפת שפה חי בין עברית (RTL ברירת מחדל) לאנגלית (LTR) השומר את העדפת המשתמש." },
    ],
    proTips: [
      "לעולם אל תחשוף את מפתח ה-service_role בצד הלקוח — השתמש רק במפתח הציבורי (ANON_KEY).",
      "הפעל Row Level Security (RLS) על כל טבלה מיד עם יצירתה.",
      "הוסף הודעות חיווי ברורות (Toast) בכל שמירה או שגיאה כדי שהמשתמש ירגיש ביטחון.",
    ],
    readyPortfolioTitleExample: "v2.0 — מערכת ניהול הזמנות ולקוחות בענן (Full-Stack SaaS)",
    readyPortfolioDescExample: "שדרוג המוצר לאפליקציית Full-Stack עם הרשמת משתמשים, שמירת נתונים בזמן אמת ב-Supabase, אבטחת RLS ודו-לשוניות.",
    samplePreviewHeadline: "מפתח Full-Stack AI · מערכות SaaS ומסדי נתונים",
    samplePreviewProjects: [
      { title: "v1.0 — דף נחיתה ממיר ללא שרת", tag: "אבן דרך 1", desc: "מנוע הזמנות WhatsApp." },
      { title: "v2.0 — מערכת ניהול לקוחות בענן (Supabase)", tag: "אבן דרך 2 · Full-Stack", desc: "PostgreSQL + Auth + RLS." },
    ],
  },
  3: {
    level: 3,
    versionTag: "v3.0 · Payments, Automation & Web3",
    badgeTitle: "Systems & Web3 Architect",
    hebrewTitle: "מסלול 3: ארכיטקט מערכות, סליקה ו-Web3",
    whoIsItFor: "למפתחים שרוצים להפוך אפליקציה לעסק מרוויח עם סליקת אשראי/קריפטו, התראות אוטומטיות ואבטחת Cloudflare.",
    whatYouGetSummary: "פרופיל ארכיטקט + נכסים v1.0–v3.0 (סליקה מאומתת ואוטומציה) + תעודת Architect.",
    freeToolsChain: [
      { name: "Cloudflare Free", url: "https://cloudflare.com", role: "אבטחת DNS, חומת אש ו-SSL חינם" },
      { name: "PayPal Sandbox / Telegram API", url: "https://paypal.com", role: "סליקת בדיקות והתראות בוט חינם" },
      { name: "Remix IDE + MetaMask", url: "https://ethereum.org", role: "חוזה חכם וארנק ברשת Testnet (חינם)" },
    ],
    projectIdeaTitle: "v3.0: שדרוג המוצר לסליקת תשלומים, Webhooks והתראות אוטומטיות",
    evolutionExplanation: "בשלב זה המערכת מתחילה להכניס כסף: הלקוח משלם אונליין, השרת מאמת את העסקה דרך Webhook מאובטח, מעדכן הרשאות אוטומטית ושולח התראה מיידית לבעל העסק בטלגרם.",
    threeStepPrompts: [
      { stepLabel: "פקודה 1: בניית Webhook מאומת לעדכון תשלום", prompt: "צור נתיב API ב-Next.js (/api/webhook) שמקבל אישור עסקה מספק הסליקה (או חוזה חכם ברשת Testnet), מאמת את חתימת הבקשה ומעדכן סטטוס הזמנה ל-paid ב-Supabase." },
      { stepLabel: "פקודה 2: התראה מיידית לבעל העסק בטלגרם", prompt: "הוסף לפונקציית האישור שליחת הודעה אוטומטית ל-Telegram Bot API של בעל העסק עם שם הלקוח, הסכום ופרטי העסקה." },
      { stepLabel: "פקודה 3: חומת אש והגנת API", prompt: "הוסף הגבלת קצב בקשות (Rate Limiting) ובדיקת תקינות קלטים בשרת כדי למנוע הצפת בקשות." },
    ],
    proTips: [
      "לעולם אל תפתח גישה למוצר בתשלום רק על סמך הגעה לדף תודה בדפדפן — סמוך רק על Webhook חתום.",
      "בדוק תמיד עסקאות ב-PayPal Sandbox או ברשת Base Testnet לפני מעבר לכסף אמיתי.",
      "חבר את הדומיין דרך Cloudflare להפעלת SSL וחסימת בוטים אוטומטית.",
    ],
    readyPortfolioTitleExample: "v3.0 — פלטפורמה מסחרית עם סליקה, Webhooks והתראות טלגרם",
    readyPortfolioDescExample: "אינטגרציה מלאה של סליקה מאומתת, עדכון הרשאות אוטומטי בשרת והתראות בזמן אמת לבעל העסק.",
    samplePreviewHeadline: "ארכיטקט מערכות AI, סליקה, אוטומציה ו-Web3",
    samplePreviewProjects: [
      { title: "v1.0 — דף נחיתה ממיר", tag: "אבן דרך 1", desc: "הזמנות WhatsApp." },
      { title: "v2.0 — אפליקציית SaaS בענן", tag: "אבן דרך 2", desc: "מסד נתונים והרשאות." },
      { title: "v3.0 — מנוע סליקה והתראות Webhook", tag: "אבן דרך 3 · Commerce", desc: "סליקה מאומתת + Telegram API." },
    ],
  },
  4: {
    level: 4,
    versionTag: "v4.0 · Full Enterprise Production",
    badgeTitle: "Senior Enterprise Architect",
    hebrewTitle: "מסלול 4: מפתח בכיר לארגונים (Enterprise)",
    whoIsItFor: "לבונים שרוצים להציג שליטה מלאה ברמת ייצור ארגונית: דשבורד מנהל, נגישות חוקית, מעטפת משפטית וניטור שגיאות.",
    whatYouGetSummary: "פרופיל Senior הבכיר ביותר + כל 4 אבני הדרך (v1.0–v4.0) + חתימת הסמכה בכירה.",
    freeToolsChain: [
      { name: "Sentry Free", url: "https://sentry.io", role: "ניטור שגיאות וביצועים בזמן אמת (חינם)" },
      { name: "Resend Free", url: "https://resend.com", role: "שליחת מיילים וקבלות אוטומטית (חינם)" },
      { name: "Google Lighthouse & A11y", url: "https://google.com", role: "בדיקות נגישות, SEO ומהירות ייצור (חינם)" },
    ],
    projectIdeaTitle: "v4.0: הפיכת המוצר לפלטפורמה ארגונית שלמה (Admin + A11y + Legal)",
    evolutionExplanation: "השלב הסופי שבו המוצר מוכן למכירה לארגונים ולקוחות גדולים: דשבורד שליטה מלא לבעל העסק (Admin CMS), יומן ביקורת, תפריט נגישות, תמיכה שקטה ומסמכים משפטיים מלאים.",
    threeStepPrompts: [
      { stepLabel: "פקודה 1: דשבורד Admin CMS ו-Audit Log", prompt: "בנה עמוד /admin מוגן הרשאות המאפשר לבעל העסק לנהל משתמשים, לעדכן מחירים ותוכן בזמן אמת ולצפות ביומן פעולות (Audit Log)." },
      { stepLabel: "פקודה 2: הטמעת מעטפת חוקית, נגישות ותמיכה שקטה", prompt: "הוסף כפתור נגישות תקני, תמיכה שקטה באתר ופוטר מלא הכולל אודות, יצירת קשר, מחירון, שאלות נפוצות, תנאי שימוש, מדיניות פרטיות, מדיניות שמירת/מחיקת מסמכים, מדיניות ביטולים והצהרת נגישות." },
      { stepLabel: "פקודה 3: אימות Build סופי וניטור ייצור", prompt: "הרץ בדיקת npm run build נקייה עם 0 שגיאות TypeScript, הטמע ניטור שגיאות ווודא ביצועים מקסימליים במובייל ובמחשב." },
    ],
    proTips: [
      "ספק ללקוח תיקיית מסירה מסודרת ב-Google Drive הכוללת הסבר על משתני הסביבה והניהול השוטף.",
      "הטמע שליחת קבלות ומיילים אוטומטיים דרך Resend עם רשומות SPF/DKIM מאומתות ב-Cloudflare.",
      "הקפד על יומן ביקורת (Audit Log) לכל פעולת מנהל רגישה.",
    ],
    readyPortfolioTitleExample: "v4.0 — פלטפורמה ארגונית שלמה (Admin CMS + A11y + Legal)",
    readyPortfolioDescExample: "מוצר קצה-לקצה הכולל ניהול תוכן ומחירים ללא קוד, דו-לשוניות, נגישות חוקית, תמיכה שקטה, מעטפת משפטית וניטור ייצור.",
    samplePreviewHeadline: "Senior Enterprise AI Architect · בניית פלטפורמות מקצה לקצה",
    samplePreviewProjects: [
      { title: "v1.0 — דף נחיתה והזמנות WhatsApp", tag: "אבן דרך 1", desc: "MVP ללא שרת." },
      { title: "v2.0 — מערכת SaaS בענן", tag: "אבן דרך 2", desc: "מסד נתונים והרשאות." },
      { title: "v3.0 — מנוע סליקה ואוטומציה", tag: "אבן דרך 3", desc: "Webhooks והתראות." },
      { title: "v4.0 — פלטפורמת Enterprise מלאה", tag: "אבן דרך 4 · Senior Certified", desc: "Admin CMS + נגישות + מעטפת חוקית." },
    ],
  },
};
