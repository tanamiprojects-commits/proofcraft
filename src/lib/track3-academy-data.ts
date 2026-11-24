import { AcademyModule } from "./track1-academy-data";

export const TRACK3_PRESETS = [
  {
    label: "💳 מערכת מסחרית עם סליקה והתראות טלגרם",
    headline: "ארכיטקט מערכות סליקה, Webhooks מאובטחים ואוטומציה עסקית בזמן אמת",
    v3Title: "v3.0 — מנוע סליקה מאומת, Webhooks והתראות Telegram API בזמן אמת",
    v3Summary: "אינטגרציה מלאה של סליקה מאומתת בשרת, פתיחת הרשאות אוטומטית לאחר תשלום, והתראות מיידיות לבעל העסק בטלגרם.",
  },
  {
    label: "⛓️ פלטפורמת Web3 + תשלומים היברידיים",
    headline: "ארכיטקט מערכות Web3, חוזים חכמים ותשלומים דיגיטליים מאובטחים",
    v3Title: "v3.0 — אינטגרציית ארנק Web3, אימות עסקאות Testnet ואוטומציית קבלות",
    v3Summary: "חיבור ארנקי קריפטו, אימות עסקאות על גבי הבלוקצ׳יין והנפקת אישורים וקבלות אוטומטית.",
  },
  {
    label: "🤖 מרכז אוטומציה עסקית (Webhooks + Resend + Cloudflare)",
    headline: "מפתח מערכות אוטומציה, API מאובטחים ואבטחת Cloudflare לעסקים צומחים",
    v3Title: "v3.0 — מנוע אוטומציה עסקית: Webhooks, מיילים אוטומטיים וחומת אש Cloudflare",
    v3Summary: "אוטומציה מלאה של תהליכי מכירה ושירות כולל חסימת בוטים, הגבלת קצב בקשות והפקת מיילים אוטומטית.",
  },
];

export const TRACK3_MODULES: AcademyModule[] = [
  {
    id: "t3-mod1",
    stepNumber: 1,
    title: "מודול 1: ארכיטקטורת סליקה מאומתת ו-Webhooks (Server-Side Trust)",
    subtitle: "למה לעולם לא פותחים גישה למוצר על סמך דף 'תודה' בדפדפן, ואיך בונים Webhook חתום ומאובטח.",
    badgeUnlocked: "סליקה ו-Webhooks מאומתים",
    assetBuilt: "ארכיטקטורת תשלומים v3.0 + שדרוג כותרת פרופיל לארכיטקט",
    coreLessonTitle: "חוק האפס-אמון בדפדפן (Zero-Trust Client Verification)",
    coreLessonBody: "משתמש מתוחכם יכול לנווט ידנית לכתובת /thank-you בדפדפן בלי לשלם שקל. בארכיטקטורה מקצועית, השרת של ספק הסליקה (PayPal / Stripe / Meshulam) שולח בקשת POST מאחורי הקלעים לנתיב /api/webhook בשרת שלנו. רק לאחר שהשרת מאמת את חתימת הבקשה ואת הסכום — הוא מעדכן ב-Supabase שהעסקה שולמה.",
    roiInsight: "קפיצת מדרגה עסקית: ברגע שהמערכת שלך יודעת לגבות כסף אמיתי אוטומטית 24/7, ערך ההקמה ללקוח קופץ ל-₪7,000–₪12,000!",
    amateurMistake: "מעדכן את סטטוס התשלום מתוך קוד הדפדפן (Client-Side) — פרצת אבטחה שמאפשרת גישה בחינם.",
    proExecution: "מקים API Route מאובטח בשרת שמאמת חתימה קריפטוגרפית, מונע כפילויות (Idempotency) ומעדכן הרשאות בענן.",
    externalServices: [
      {
        name: "PayPal Developer Sandbox (חינם)",
        url: "https://paypal.com",
        purpose: "יצירת חשבון בדיקות לסליקה וסימולציית Webhooks ללא חיוב אמיתי.",
        exactSteps: [
          "התחבר ל-PayPal Developer -> היכנס ל-'Apps & Credentials' -> צור אפליקציית Sandbox.",
          "העתק את ה-Client ID וה-Secret ושמור אותם רק בקובץ .env.local (לעולם לא בקוד גלוי!).",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft: כתוב פקודת PowerShell (עם Out-File -Encoding utf8) היוצרת נתיב שרת src\\app\\api\\payment-webhook\\route.ts שמקבל אישור עסקה, מאמת את תקינות הבקשה והסכום, בודק שהעסקה לא עובדה כבר (Idempotency), ומעדכן ב-Supabase את סטטוס המשתמש ל-paid.",
    troubleshooting: [
      {
        symptom: "ה-Webhook מחזיר שגיאת 401 או לא מגיע לשרת המקומי",
        fixExplanation: "שרת חיצוני לא רואה את localhost:3000 עד שמעלים ל-Vercel או משתמשים במנהרת בדיקה.",
        fixPrompt: "העלה את נתיב ה-Webhook ל-Vercel והגדר את כתובת ה-https:// בהגדרות ה-Sandbox.",
      },
    ],
    quizQuestion: "מה הדרך הבטוחה והמקצועית היחידה לאשר שהלקוח אכן שילם לפני פתיחת המוצר?",
    quizOptions: [
      "אימות בקשת Webhook חתומה בצד השרת ועדכון מסד הנתונים משם",
      "בדיקה שהלקוח הגיע לעמוד התודה בדפדפן",
      "הסתמכות על צילום מסך בוואטסאפ",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t3-mod2",
    stepNumber: 2,
    title: "מודול 2: אוטומציה בזמן אמת — התראות Telegram API וקבלות Resend",
    subtitle: "חיבור המערכת לשליחת התראה מיידית לנייד של בעל העסק בטלגרם ומייל מעוצב ללקוח בכל רכישה.",
    badgeUnlocked: "אוטומציית API & Bots",
    assetBuilt: "תג אוטומציה ובוטים עסקיים בפרופיל",
    coreLessonTitle: "אוטומציה עסקית שחוסכת שעות עבודה (Event-Driven Architecture)",
    coreLessonBody: "במקום שבעל העסק יבדוק כל שעה אם נכנסה הזמנה, השרת מפעיל שרשרת אירועים אוטומטית ברגע שהתשלום אושר: 1) שולח הודעת טלגרם מעוצבת לבעל העסק עם שם הלקוח, המוצר והסכום; 2) שולח מייל אישור וקבלה מעוצבת ללקוח דרך Resend API.",
    roiInsight: "ערך מיידי לבעל עסק: בעלי עסקים מתאהבים ברגע שהם מקבלים התראת '💰 נכנס תשלום חדש' לנייד בזמן אמת.",
    amateurMistake: "שומר מפתחות API או טוקנים של בוט טלגרם בתוך קוד ה-Frontend שגלוי לכל דפדפן.",
    proExecution: "מריץ את הקריאות ל-Telegram API ול-Resend אך ורק מתוך פונקציית שרת עם משתני סביבה מוצפנים.",
    externalServices: [
      {
        name: "Telegram BotFather (חינם)",
        url: "https://t.me",
        purpose: "יצירת בוט התראות עסקי וקבלת API Token תוך 30 שניות.",
        exactSteps: [
          "פתח בטלגרם את @BotFather, שלח /newbot ובחר שם לבוט.",
          "העתק את ה-Token שקיבלת ושמור אותו ב-.env.local תחת TELEGRAM_BOT_TOKEN.",
        ],
      },
      {
        name: "Resend Email API (חינם עד 3,000 מיילים/חודש)",
        url: "https://resend.com",
        purpose: "שליחת מיילים טרנזקציוניים ואישורי הזמנה ללקוחות.",
        exactSteps: [
          "הירשם ב-Resend -> צור API Key חדש והוסף אותו כ-RESEND_API_KEY.",
        ],
      },
    ],
    readyPrompt: "כתוב פקודת PowerShell היוצרת מודול שרת src\\lib\\business-automations.ts ששולח במקביל (Promise.all): 1) התראת Telegram Bot מעוצבת לבעל העסק עם פרטי העסקה, ו-2) מייל אישור HTML מעוצב ללקוח דרך Resend API.",
    troubleshooting: [
      {
        symptom: "הודעת הטלגרם מחזירה שגיאת chat not found",
        fixExplanation: "הבוט לא יכול לשלוח הודעה למשתמש לפני שהמשתמש לחץ 'Start' בשיחה מול הבוט.",
        fixPrompt: "פתח שיחה עם הבוט שיצרת בטלגרם, לחץ Start, ושלוף את ה-Chat ID המדויק דרך getUpdates.",
      },
    ],
    quizQuestion: "מדוע אסור לשמור את TELEGRAM_BOT_TOKEN או RESEND_API_KEY בקוד צד-לקוח (Client Component)?",
    quizOptions: [
      "כל גולש יכול לפתוח DevTools בדפדפן, לגנוב את המפתחות ולהשתמש בהם על חשבונך",
      "כי טלגרם לא עובד בדפדפן",
      "כי זה מאט את העיצוב",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t3-mod3",
    stepNumber: 3,
    title: "מודול 3: אבטחת חומת אש Cloudflare, הגבלת קצב (Rate Limit) ונכס v3.0",
    subtitle: "הגנה מפני בוטים, מתקפות ספאם והוספת מערכת הסליקה והאוטומציה כעבודה עצמאית #3 בתיק העבודות.",
    badgeUnlocked: "Cloudflare WAF & Web3 Ready",
    assetBuilt: "נכס עצמאי #3 בתיק העבודות (v3.0 Automation & Payments)",
    coreLessonTitle: "שכבת הגנה היקפית (Edge Security & Rate Limiting)",
    coreLessonBody: "ברגע שמערכת סולקת כסף או שולחת מיילים והתראות טלגרם, בוטים אוטומטיים מנסים להציף את נתיבי ה-API. חיבור הדומיין ל-Cloudflare WAF + הוספת כותרות אבטחה והגבלת קצב בקשות מונעים הצפות ומגנים על המערכת. במקביל, אנו שומרים את עבודות #1 (v1.0) ו-#2 (v2.0) ומוסיפים את המערכת הזו כעבודה #3 עצמאית בתיק!",
    roiInsight: "עמידות עסקית: לקוחות גדולים שואלים 'מה קורה אם תוקפים את האתר?'. התשובה שלך: 'המערכת מוגנת מאחורי Cloudflare WAF + RLS + Rate Limiting'.",
    amateurMistake: "משאיר נתיבי API חשופים ללא מגבלת בקשות וללא כותרות אבטחה, ודורס את העבודות הקודמות בתיק.",
    proExecution: "מגדיר כותרות אבטחה מחמירות ב-next.config.ts, מחבר Cloudflare, ומעלה את נכס v3.0 כעבודה עצמאית שלישית.",
    externalServices: [
      {
        name: "Cloudflare Dashboard (חינם)",
        url: "https://cloudflare.com",
        purpose: "הפעלת חומת אש (WAF), הגנת DDoS והאצת CDN גלובלית.",
        exactSteps: [
          "הוסף את הדומיין שלך ל-Cloudflare ועדכן את שרתי ה-Nameservers.",
          "היכנס ל-'Security' -> 'Bots' והפעל את 'Bot Fight Mode'.",
        ],
      },
      {
        name: "Base Sepolia Explorer (חינם · Web3)",
        url: "https://basescan.org",
        purpose: "אימות שקיפות עסקאות Web3 / בלוקצ׳יין ברשת בדיקות.",
        exactSteps: [
          "הדבק כתובת ארנק או מזהה עסקה (Tx Hash) כדי לוודא שקיפות מלאה על גבי הרשת.",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft: כתוב פקודת PowerShell המעדכנת את next.config.ts להוספת כותרות אבטחה מחמירות (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy) ומוסיפה פונקציית Rate Limiter פשוטה להגנה על נתיבי ה-API.",
    troubleshooting: [
      {
        symptom: "Cloudflare מציג שגיאת Too Many Redirects (לולאת הפניות)",
        fixExplanation: "מצב SSL ב-Cloudflare מוגדר על Flexible במקום Full (Strict) מול Vercel.",
        fixPrompt: "היכנס ב-Cloudflare ל-'SSL/TLS' -> 'Overview' ושנה את מצב ההצפנה ל-'Full (strict)'.",
      },
    ],
    quizQuestion: "מדוע אנו מפעילים Cloudflare WAF וכותרות אבטחה לפני חשיפת מערכת סליקה לציבור?",
    quizOptions: [
      "לחסימת בוטים, מניעת התקפות XSS/Clickjacking והגנה על נתיבי ה-API",
      "כדי לשנות את גופן האתר",
      "כי בלי זה אי אפשר לכתוב עברית",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t3-mod4",
    stepNumber: 4,
    title: "מודול 4: חקר מקרה קהילתי + סגירת עסקאות מסחריות של ₪7,000–₪12,000",
    subtitle: "שיתוף ארכיטקטורת v3.0 בקיר הקהילה, קבלת ביקורת עמיתים והפקת תיק עבודות עם 3 עבודות עצמאיות.",
    badgeUnlocked: "Systems & Web3 Architect Certified",
    assetBuilt: "פרופיל ארכיטקט + 3 עבודות מאומתות + הצעת מחיר מסחרית",
    coreLessonTitle: "מכירת מערכות מניבות (Revenue-Generating Systems)",
    coreLessonBody: "במסלול 3 אתה כבר לא מוכר 'אתר' — אתה מוכר מכונת מכירות ואוטומציה שחוסכת לעסק עובד אדמיניסטרציה שלם ומגדילה את הגבייה. תיק העבודות שלך מציג כעת 3 מערכות שונות ועצמאיות (דף ממיר, מערכת SaaS, ומנוע סליקה ואוטומציה) שממצבות אותך בליגה של מפתחים בכירים.",
    roiInsight: "תמחור ארכיטקט: ₪7,000–₪12,000 הקמה + ₪550/חודש תחזוקת אוטומציות וניטור.",
    amateurMistake: "מתמחר לפי שעות עבודה במקום לפי הערך העסקי והחיסכון שהאוטומציה מייצרת ללקוח.",
    proExecution: "מציג 3 עבודות חיות בתיק, משתף מקרה בוחן בקיר הקהילה ומגיש הצעת מחיר מבוססת ערך.",
    externalServices: [
      {
        name: "Sentry Error Monitoring (חינם)",
        url: "https://sentry.io",
        purpose: "ניטור שגיאות בזמן אמת בייצור כדי לתקן תקלות לפני שהלקוח מרגיש.",
        exactSteps: [
          "צור פרויקט Next.js חדש ב-Sentry והוסף את ה-DSN למשתני הסביבה ב-Vercel.",
        ],
      },
    ],
    readyPrompt: "כתוב עבורי הצעת מחיר מסחרית מנצחת לבעל עסק בינוני להקמת מערכת סליקה, אוטומציית טלגרם/מיילים ואבטחת Cloudflare (v3.0), כולל פירוט החזר ההשקעה (ROI) ותחזוקה שוטפת.",
    troubleshooting: [
      {
        symptom: "לקוח שואל איך נדע אם יש תקלה באוטומציה באמצע הלילה",
        fixExplanation: "חיבור Sentry + התראות טלגרם מתריע אוטומטית על כל חריגה.",
        fixPrompt: "הוסף בלוק try/catch ב-Webhook ששולח התראת שגיאה מיידית לערוץ הניטור של המנהל בטלגרם.",
      },
    ],
    quizQuestion: "מה מציג תיק העבודות שלך בסיום מסלול 3?",
    quizOptions: [
      "3 עבודות עצמאיות ומאומתות ברמות מורכבות עולות (דף ממיר, SaaS בענן, ומנוע סליקה ואוטומציה)",
      "רק קישור אחד כללי",
      "רק תעודה בלי פרויקטים",
    ],
    correctQuizIdx: 0,
  },
];

export const TRACK3_CLOSING_KIT = {
  recommendedPricing: "הקמת מערכת סליקה ואוטומציה (v3.0): ₪7,000 – ₪12,000 + ₪550/חודש תחזוקה וניטור",
  salesPitchTemplate: "היי [שם בעל העסק], אני ארכיטקט מערכות AI ואוטומציה. אני בונה לעסקים מערכות סליקה מאובטחות שסוגרות עסקאות 24/7, שולחות קבלה אוטומטית ללקוח והתראה מיידית אליך לטלגרם, מאחורי חומת אש של Cloudflare. מוזמן לראות 3 מערכות חיות שבניתי בתיק העבודות המאומת שלי: [קישור לתיק העבודות] — נשמח לתאם שיחת אפיון קצרה!",
  handoverChecklist: [
    "הרצת עסקת בדיקה מלאה ב-Sandbox/Production ואימות קבלת התראת טלגרם ומייל קבלה.",
    "וידוא הפעלת Cloudflare WAF ו-SSL Full (Strict).",
    "הצעת שדרוג עתידית (Upsell): מערכת רב-סניפית, ניהול הרשאות צוות ו-AI Copilot ארגוני (ידע ממסלול 4).",
  ],
};
