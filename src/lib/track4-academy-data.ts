import { AcademyModule } from "./track1-academy-data";

export const TRACK4_PRESETS = [
  {
    label: "🏢 פלטפורמת SaaS רב-ארגונית + AI Copilot",
    headline: "Senior AI Systems Architect · מוביל הקמת פלטפורמות SaaS ארגוניות וסוכני AI",
    v4Title: "v4.0 — פלטפורמת Enterprise רב-סניפית עם AI Copilot מובנה ו-Audit Logs",
    v4Summary: "ארכיטקטורת Enterprise מלאה הכוללת ניהול צוותים והרשאות RBAC, סוכן AI חכם לניתוח נתונים, סליקה מאומתת ויומן ביקורת ארגוני.",
  },
  {
    label: "🛒 מרקטפלייס / פלטפורמת B2B מרובת ספקים",
    headline: "ארכיטקט מערכות B2B, מרקטפלייס ותשלומים מבוזרים ברמת Enterprise",
    v4Title: "v4.0 — פלטפורמת B2B Marketplace עם ניהול ספקים, סליקה ודשבורד הנהלה",
    v4Summary: "מערכת מסחרית מרובת צדדים הכוללת אימות ספקים, ניהול עמלות וסליקה אוטומטית, אבטחת RLS מתקדמת ואנליטיקה בזמן אמת.",
  },
  {
    label: "🧠 מערכת אוטומציה ובינה מלאכותית לארגונים",
    headline: "יועץ וארכיטקט AI בכיר · בניית מערכות ליבה חכמות ואוטומציה מקצה לקצה",
    v4Title: "v4.0 — מערכת ליבה ארגונית מבוססת AI, אוטומציית Webhooks ו-SLA מלא",
    v4Summary: "פתרון ארגוני מקיף המשלב דפי המרה, מסד נתונים מאובטח, סליקה, אוטומציית התראות ועוזר AI מותאם אישית.",
  },
];

export const TRACK4_MODULES: AcademyModule[] = [
  {
    id: "t4-mod1",
    stepNumber: 1,
    title: "מודול 1: ארכיטקטורה רב-ארגונית והרשאות צוות (Multi-Tenant & RBAC)",
    subtitle: "איך מתכננים מערכת שבה כל חברה/סניף מנהלים צוות עובדים משלהם בבידוד נתונים מוחלט ותיעוד Audit Log.",
    badgeUnlocked: "Enterprise Multi-Tenant Architect",
    assetBuilt: "מיצוב Senior Architect + ארכיטקטורת Multi-Tenant מלאה",
    coreLessonTitle: "מודל Multi-Tenancy מבוסס Organization ID",
    coreLessonBody: "במערכות B2B וארגונים גדולים, לא מספיק לבדוק user_id בודד. יוצרים טבלת ארגונים (organizations) וטבלת חברי צוות (org_members) עם תפקידים (owner, manager, viewer). מדיניות ה-RLS ב-Supabase מוודאת שכל עובד רואה אך ורק את נתוני הארגון שלו, וכל פעולה רגישה נרשמת ביומן ביקורת (Audit Log).",
    roiInsight: "קפיצה לחוזי Enterprise: חברות בינוניות וארגונים משלמים ₪15,000–₪35,000 על מערכת צוותים מאובטחת + ₪1,200/חודש SLA.",
    amateurMistake: "בונה מערכת שמתאימה רק למשתמש בודד ונאלץ לשכתב את כל מסד הנתונים כשלקוח מבקש להוסיף עובדים.",
    proExecution: "מתכנן מראש היררכיית Organizations -> Roles -> Audit Logs עם RLS ארגוני מלא.",
    externalServices: [
      {
        name: "Supabase Enterprise RLS & Logs",
        url: "https://supabase.com",
        purpose: "הקמת טבלאות ארגונים, תפקידים ויומן ביקורת (Audit Logs).",
        exactSteps: [
          "פתח ב-Supabase את 'SQL Editor' והרץ את סכמת ה-Multi-Tenant שתקבל מהפרומפט.",
          "בדוק ב-'Database' -> 'Logs' את ביצועי השאילתות והאינדקסים.",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft ברמת Senior Architect: כתוב שאילתת SQL מלאה ל-Supabase המקימה ארכיטקטורת Multi-Tenant הכוללת organizations, org_members (עם תפקידי owner/admin/member), ו-audit_logs, כולל מדיניות RLS שמבודדת לחלוטין בין ארגונים.",
    troubleshooting: [
      {
        symptom: "שגיאת infinite recursion detected in policy במדיניות RLS ארגונית",
        fixExplanation: "מדיניות RLS על טבלת org_members בודקת את עצמה בלולאה אינסופית.",
        fixPrompt: "השתמש בפונקציית SQL מסוג SECURITY DEFINER (כגון get_user_org_ids()) כדי לשלוף את מזהי הארגונים של המשתמש ללא רקורסיה.",
      },
    ],
    quizQuestion: "מהו היתרון המרכזי של ארכיטקטורת Multi-Tenant מבוססת org_id?",
    quizOptions: [
      "מאפשרת לארגונים שלמים עם מספר עובדים לעבוד על אותה פלטפורמה בבידוד נתונים מלא ורמת אבטחה ארגונית",
      "מוחקת את הצורך בהתחברות",
      "עובדת רק ללא אינטרנט",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t4-mod2",
    stepNumber: 2,
    title: "מודול 2: הטמעת סוכן AI חכם בתוך המוצר (Embedded AI Copilot API)",
    subtitle: "חיבור מודל AI (Gemini / OpenAI) כחלק אינטגרלי מהמערכת לניתוח נתונים, ניסוח אוטומטי והמלצות חכמות.",
    badgeUnlocked: "AI Product Engineer",
    assetBuilt: "יכולת שילוב AI Copilot במוצרי ייצור",
    coreLessonTitle: "הפיכת המערכת מ'טופס נתונים' ל'מערכת חושבת'",
    coreLessonBody: "ההבדל בין תוכנה רגילה לפלטפורמת AI מובילה הוא הטמעת מודל שפה חכם ישירות בתהליך העבודה של הלקוח (דרך נתיב שרת /api/ai-copilot שמגן על ה-API Key). המשתמש לוחץ על כפתור אחד ומקבל סיכום מנהלים, טיוטת הצעת מחיר או ניתוח חריגות על סמך הנתונים האמיתיים שלו.",
    roiInsight: "בידול מוחלט בשוק: לקוחות מוכנים לשלם פי 2 על מערכת שכוללת עוזר AI מובנה שחוסך להם שעות עבודה.",
    amateurMistake: "קורא ל-Gemini או OpenAI ישירות מהדפדפן וחושף את מפתח ה-API לכל העולם.",
    proExecution: "בונה Route Handler מאובטח בצד השרת עם הגבלת קצב (Rate Limit), אימות משתמש ופלט JSON מובנה.",
    externalServices: [
      {
        name: "Google AI Studio API Keys (חינם להתחלה)",
        url: "https://google.com",
        purpose: "הפקת מפתח API לחיבור Gemini לתוך אפליקציות הייצור שלך.",
        exactSteps: [
          "היכנס ל-Google AI Studio -> לחץ על 'Get API key' -> 'Create API key'.",
          "שמור את המפתח אך ורק תחת GEMINI_API_KEY ב-.env.local וב-Vercel.",
        ],
      },
    ],
    readyPrompt: "כתוב פקודת PowerShell היוצרת נתיב API מאובטח בשרת (src\\app\\api\\ai-copilot\\route.ts) שמקבל נתונים עסקיים מהמשתמש המחובר, שולח אותם ל-Gemini API דרך process.env.GEMINI_API_KEY ומחזיר תובנות עסקיות מובנות בעברית.",
    troubleshooting: [
      {
        symptom: "קריאת ה-AI נתקעת או מחזירה Timeout ב-Vercel",
        fixExplanation: "מודלים כבדים לוקחים זמן עיבוד ארוך יותר מהמגבלה הבסיסית.",
        fixPrompt: "השתמש במודל המהיר gemini-2.5-flash והגדר maxDuration = 30 בראש קובץ ה-route.ts.",
      },
    ],
    quizQuestion: "מדוע אנו מפעילים קריאות ל-AI API אך ורק דרך נתיב שרת (/api/...) ולא ישירות מהדפדפן?",
    quizOptions: [
      "כדי להגן על מפתח ה-API הסודי מפני גניבה, לאמת הרשאות משתמש ולשלוט בעלויות השימוש",
      "כי הדפדפן לא תומך ב-JSON",
      "כי זה עובד רק בלילה",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t4-mod3",
    stepNumber: 3,
    title: "מודול 3: השקת פלטפורמת הדגל (v4.0) וסנכרון מלא של 4 אבני הדרך בתיק",
    subtitle: "איחוד כל השכבות (UI ממיר + SaaS בענן + סליקה ואוטומציה + AI Enterprise) לתיק עבודות שלם ומאומת.",
    badgeUnlocked: "Full-Spectrum Master Builder",
    assetBuilt: "תיק עבודות מלא (כל 4 הנכסים: v1.0, v2.0, v3.0, v4.0) + פרופיל מלא",
    coreLessonTitle: "הוכחת שליטה מקצה לקצה (Full-Spectrum Portfolio Sync)",
    coreLessonBody: "במסלול 4 המערכת מסנכרנת אוטומטית את כל ארבעת הנכסים בתיק העבודות שלך: אם כבר השלמת את מסלולים 1–3, היא שומרת על כל שלושת הפרויקטים הקודמים ומוסיפה את v4.0 כפרויקט הרביעי; ואם התחלת ישר ממסלול 4 — השלמת מודול זה מפתחת ומאכלסת עבורך את כל 4 אבני הדרך המקצועיות בתיק העבודות ובפרופיל האישי!",
    roiInsight: "השפעה מיידית מול לקוחות ומגייסים: פרופיל שמציג 4 מערכות חיות ברמות מורכבות עולות מציב אותך בעשירון העליון של מפתחי ה-AI.",
    amateurMistake: "מציג תיק עבודות חלקי עם פרויקט בודד שלא משקף את מלוא היכולות הטכנולוגיות והעסקיות שלו.",
    proExecution: "מעלה את פלטפורמת הדגל v4.0 לייצור ומסנכרן את כל 4 אבני הדרך בתיק העבודות.",
    externalServices: [
      {
        name: "Vercel Production & Custom Domain",
        url: "https://vercel.com",
        purpose: "פריסת פלטפורמת הדגל v4.0 וחיבור דומיין עסקי מאובטח.",
        exactSteps: [
          "ודא שכל משתני הסביבה (Supabase, Gemini, Payment Webhook, Telegram) מוגדרים ב-Vercel.",
          "הרץ בדיקת אימות מלאה בכתובת החיה והעתק את הקישור לכאן.",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft ברמת Senior Architect: כתוב פקודת PowerShell המוסיפה למערכת דשבורד מנהלים (Executive Analytics + AI Copilot + Audit Logs) ומוודאת ש-npm run build עובר בהצלחה עם 0 שגיאות.",
    troubleshooting: [
      {
        symptom: "פרויקט גדול נכשל בבנייה בגלל שגיאת טיפוסים באחד הקבצים",
        fixExplanation: "הרצת npx tsc --noEmit מאתרת את כל שגיאות ה-TypeScript מראש.",
        fixPrompt: "הרץ בטרמינל npx tsc --noEmit, הדבק את השגיאה המדויקת לצ׳אט, תקן נקודתית והעלה ל-Vercel.",
      },
    ],
    quizQuestion: "מה קורה בתיק העבודות שלך בסיום מודול 3 של מסלול 4?",
    quizOptions: [
      "תיק העבודות מסתנכרן ומציג את כל 4 אבני הדרך (v1.0 עד v4.0) בצורה מלאה ומאומתת",
      "העבודות הקודמות נמחקות",
      "נשמר רק קובץ טקסט מקומי",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t4-mod4",
    stepNumber: 4,
    title: "מודול 4: מנהיגות קהילתית וסגירת חוזי Enterprise (₪15,000–₪35,000+)",
    subtitle: "הובלת הקהילה בקיר הפידבק, קבלת חותמת Senior AI Systems Architect וסגירת עסקאות גדולות.",
    badgeUnlocked: "Senior AI Systems Architect Certified",
    assetBuilt: "הסמכת Senior Architect + ערכת חוזי Enterprise ו-SLA",
    coreLessonTitle: "מבנה הצעת מחיר ו-SLA לחברות וארגונים",
    coreLessonBody: "כדי לסגור עסקאות של ₪15,000–₪35,000 מול חברות, לא שולחים הודעה קצרה בוואטסאפ — מגישים מסמך ארכיטקטורה ו-SLA הכולל: 1) אפיון מערכת ואבטחת מידע (RLS + Cloudflare + Sentry), 2) לוח זמנים של 4 אבני דרך, 3) הסכם רמת שירות (SLA) חודשי לגיבויים, ניטור ושדרוגי AI.",
    roiInsight: "פוטנציאל הכנסה: 2 פרויקטי Enterprise ברבעון = ₪40,000–₪60,000 + הכנסה חודשית קבועה מ-SLA.",
    amateurMistake: "מתחייב לפיתוח פתוח ללא הגדרת אבני דרך וללא הסכם תחזוקה ו-SLA.",
    proExecution: "מגדיר 4 אבני דרך ברורות, מציג תיק עבודות של 4 מערכות חיות וסוגר ריטיינר SLA ארגוני.",
    externalServices: [
      {
        name: "LinkedIn Executive Profile",
        url: "https://linkedin.com",
        purpose: "מיצוב הפרופיל שלך כמוביל פיתוח מערכות AI וארכיטקט Enterprise.",
        exactSteps: [
          "עדכן את הכותרת הראשית בלינקדאין ל-'Senior AI Systems Architect'.",
          "הוסף את הקישור לתיק העבודות המאומת שלך ב-ProofCraft תחת 'Featured'.",
        ],
      },
    ],
    readyPrompt: "כתוב עבורי מסמך הצעת מחיר ו-SLA מקצועי ברמת Enterprise להקמת פלטפורמת AI וניהול ארגונית (v4.0), כולל חלוקה ל-4 אבני דרך, סעיפי אבטחת מידע והסכם תחזוקה חודשי.",
    troubleshooting: [
      {
        symptom: "מנכ״ל או סמנכ״ל טכנולוגיות מבקש הוכחת אבטחה לפני חתימה",
        fixExplanation: "ארגונים בודקים הפרדת נתונים, הצפנה ויומן ביקורת.",
        fixPrompt: "הצג להם את תיעוד ה-Audit Logs, מדיניות ה-RLS ב-Supabase והגנת ה-WAF ב-Cloudflare.",
      },
    ],
    quizQuestion: "מה מבדיל הצעת מחיר ברמת Enterprise מהצעה של פרילנסר מתחיל?",
    quizOptions: [
      "חלוקה לאבני דרך ברורות, פירוט אבטחת מידע ו-Audit Logs, והסכם תחזוקה ו-SLA חודשי",
      "הצעת מחיר נמוכה ככל האפשר ללא חוזה",
      "הבטחה לסיים מערכת ארגונית ב-10 דקות",
    ],
    correctQuizIdx: 0,
  },
];

export const TRACK4_CLOSING_KIT = {
  recommendedPricing: "הקמת פלטפורמת Enterprise / B2B: ₪15,000 – ₪35,000 + ₪1,200/חודש SLA וניטור AI",
  salesPitchTemplate: "שלום [שם המנכ״ל / סמנכ״ל], אני ארכיטקט מערכות AI בכיר. אני מוביל הקמת פלטפורמות SaaS ארגוניות המשלבות ניהול צוותים והרשאות, אוטומציית סליקה, סוכני AI מובנים ואבטחת מידע מחמירה (RLS + Cloudflare + Audit Logs). מוזמן להתרשם מ-4 מערכות ייצור חיות בתיק העבודות המאומת שלי: [קישור לתיק העבודות] — אשמח לתאם שיחת ארכיטקטורה קצרה.",
  handoverChecklist: [
    "מסירת ארכיטקטורת Multi-Tenant מלאה עם הפרדת הרשאות צוות ו-Audit Logs פעיל.",
    "בדיקת עומסים, אבטחת API Keys בצד השרת וניטור שגיאות ב-Sentry.",
    "חתימה על הסכם SLA חודשי לתחזוקה, גיבויים ושדרוגי AI שוטפים.",
  ],
};
