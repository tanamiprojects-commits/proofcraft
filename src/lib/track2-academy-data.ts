import { AcademyModule } from "./track1-academy-data";

export const TRACK2_PRESETS = [
  {
    label: "📅 מערכת ניהול תורים ולקוחות (CRM)",
    headline: "מפתח מערכות SaaS, ניהול תורים ו-CRM בענן לעסקים ונותני שירות",
    v2Title: "v2.0 — מערכת ניהול תורים ולקוחות בענן (Full-Stack SaaS + RLS)",
    v2Summary: "שדרוג המוצר למערכת SaaS מלאה הכוללת הרשמת משתמשים, ניהול יומן תורים בזמן אמת ב-Supabase והפרדת הרשאות RLS.",
  },
  {
    label: "🎓 פורטל לקוחות / אזור אישי לקורס",
    headline: "בונה פורטלים מאובטחים ואזורי לקוחות אישיים עם Supabase Auth",
    v2Title: "v2.0 — פורטל לקוחות ואזור אישי מאובטח בענן (Auth + Database)",
    v2Summary: "אזור אישי ללקוחות רשומים עם מעקב התקדמות, שמירת נתונים בענן ואבטחת RLS ברמת משתמש.",
  },
  {
    label: "📦 מערכת הזמנות ומלאי חכמה לעסק",
    headline: "ארכיטקט אפליקציות Full-Stack לניהול הזמנות, מלאי ודוחות בזמן אמת",
    v2Title: "v2.0 — מערכת ניהול הזמנות ומלאי חיה לעסק (PostgreSQL + Cloud Sync)",
    v2Summary: "מערכת ענן לניהול קטלוג מוצרים, מעקב הזמנות לקוחות ועדכון סטטוסים בזמן אמת.",
  },
];

export const TRACK2_MODULES: AcademyModule[] = [
  {
    id: "t2-mod1",
    stepNumber: 1,
    title: "מודול 1: תכנון מסד נתונים מנורמל (PostgreSQL & Relations)",
    subtitle: "איך הופכים דף נחיתה סטטי לאפליקציה אמיתית ששומרת משתמשים, הזמנות והיסטוריה בענן.",
    badgeUnlocked: "ארכיטקטורת PostgreSQL",
    assetBuilt: "הגדרת ארכיטקטורת נתונים v2.0 + שדרוג כותרת פרופיל",
    coreLessonTitle: "הפרדת ישויות וקשרי גומלין (1:N Relations)",
    coreLessonBody: "באפליקציית SaaS אמיתית לעולם לא שומרים הכל בטבלה אחת. מפרידים בין טבלת משתמשים (profiles) לטבלת הפעילות העסקית (orders / bookings) ומחברים ביניהן באמצעות user_id (Foreign Key). כך כל לקוח רואה רק את הנתונים שלו והמערכת רצה במהירות גם עם 50,000 רשומות.",
    roiInsight: "קפיצת מדרגה בתמחור: דף נחיתה נמכר ב-₪1,800; מערכת ניהול לקוחות בענן נמכרת ב-₪4,500–₪6,500 + ריטיינר תחזוקה חודשי!",
    amateurMistake: "שומר נתונים ב-localStorage של הדפדפן — ברגע שהלקוח מחליף טלפון או מנקה היסטוריה, כל המידע נמחק.",
    proExecution: "מקים טבלאות PostgreSQL בענן של Supabase עם מפתחות זרים (Foreign Keys) וחותמות זמן (created_at).",
    externalServices: [
      {
        name: "Supabase SQL Editor (חינם)",
        url: "https://supabase.com",
        purpose: "הקמת טבלאות הנתונים של גרסה v2.0 בענן.",
        exactSteps: [
          "היכנס לפרויקט שלך ב-Supabase -> לחץ בתפריט השמאלי על 'SQL Editor'.",
          "לחץ 'New query', הדבק את שאילתת ה-SQL שתקבל מהפרומפט ולחץ 'Run'.",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft לשדרוג המוצר לגרסה v2.0: כתוב שאילתת SQL מלאה ל-Supabase היוצרת טבלת משתמשים (profiles) וטבלת פעילות עסקית (records) המקושרת ב-user_id עם Foreign Key ואינדקסים למהירות שליפה.",
    troubleshooting: [
      {
        symptom: "שגיאת relation does not exist בעת הרצת ה-SQL",
        fixExplanation: "הפנית לטבלה שעדיין לא נוצרה באותה שאילתה.",
        fixPrompt: "סדר את פקודות ה-CREATE TABLE לפי סדר ההיררכיה (קודם profiles ורק אחר כך הטבלאות המקושרות אליה).",
      },
    ],
    quizQuestion: "למה מחברים טבלאות באמצעות מפתח זר (Foreign Key) במקום לשמור הכל בטבלה אחת?",
    quizOptions: [
      "כדי למנוע כפילויות מידע, לשמור על שלמות הנתונים ולאפשר שליפות מהירות ומאובטחות",
      "כדי שהאתר ייראה צבעוני יותר",
      "אין הבדל בין טבלה אחת למספר טבלאות",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t2-mod2",
    stepNumber: 2,
    title: "מודול 2: הרשאות גישה ואבטחת שורות (Supabase Auth + RLS)",
    subtitle: "הגנה על נתוני הלקוחות כך שכל משתמש ניגש רק למידע שלו ורק בעל העסק רואה את הכל.",
    badgeUnlocked: "אבטחת Auth & RLS",
    assetBuilt: "תג אבטחת מידע והרשאות בפרופיל המקצועי",
    coreLessonTitle: "חוק הברזל של אבטחת ענן: Row Level Security (RLS)",
    coreLessonBody: "בפיתוח מודרני הדפדפן מדבר ישירות עם מסד הנתונים. ללא הפעלת RLS, כל אדם עם מפתח ה-Anon הציבורי יכול לקרוא או למחוק נתונים של משתמשים אחרים. מדיניות RLS בודקת ברמת השרת את auth.uid() ומאשרת פעולה רק לבעל הרשומה או לאדמין.",
    roiInsight: "אמון ארגוני: כשאתה מציג לבעל קליניקה או עסק שכל רשומת לקוח מוגנת ב-RLS והצפנת SSL, אתה עובר מ'פרילנסר' ל'ספק טכנולוגי מאושר'.",
    amateurMistake: "משאיר טבלאות עם RLS כבוי או כותב מדיניות USING (true) שמאפשרת לכל אחד למחוק נתונים.",
    proExecution: "מפעיל ENABLE ROW LEVEL SECURITY על כל טבלה ומגדיר מדיניות SELECT/INSERT/UPDATE מבוססת auth.uid() = user_id.",
    externalServices: [
      {
        name: "Supabase Authentication (חינם)",
        url: "https://supabase.com",
        purpose: "הפעלת התחברות מאובטחת (Email / Google) וניהול סשנים.",
        exactSteps: [
          "בתפריט Supabase היכנס ל-'Authentication' -> 'Providers'.",
          "ודא ש-Email פעיל, והגדר תחת 'URL Configuration' את כתובת האתר שלך.",
        ],
      },
    ],
    readyPrompt: "כתוב פקודת SQL להפעלת Row Level Security על הטבלאות של גרסה v2.0 ב-Supabase, כולל מדיניות המאפשרת לכל משתמש מחובר לצפות ולערוך רק רשומות שבהן auth.uid() = user_id.",
    troubleshooting: [
      {
        symptom: "האפליקציה מחזירה מערך ריק [] למרות שיש נתונים בטבלה",
        fixExplanation: "הפעלת RLS בלי ליצור מדיניות SELECT חוסמת את כל הקריאות כברירת מחדל.",
        fixPrompt: "הוסף מדיניות CREATE POLICY FOR SELECT המאפשרת למשתמש מחובר לקרוא את הרשומות שלו.",
      },
    ],
    quizQuestion: "מה קורה אם מפעילים RLS על טבלה ב-Supabase ולא מגדירים אף מדיניות (Policy)?",
    quizOptions: [
      "כל הגישות לטבלה נחסמות כברירת מחדל עד שמגדירים הרשאה מפורשת",
      "כולם יכולים לערוך את הטבלה בחופשיות",
      "הטבלה נמחקת אוטומטית",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t2-mod3",
    stepNumber: 3,
    title: "מודול 3: בניית ממשק CRUD חי + פריסת נכס v2.0 עצמאי בתיק העבודות",
    subtitle: "חיבור פעולות יצירה, קריאה, עדכון ומחיקה (CRUD) בענן והעלאת גרסה v2.0 כעבודה שנייה עצמאית בתיק.",
    badgeUnlocked: "Full-Stack Cloud App",
    assetBuilt: "נכס עצמאי #2 בתיק העבודות (v2.0 SaaS App)",
    coreLessonTitle: "סנכרון דו-כיווני ללא ריענון דף (Optimistic & Cloud UI)",
    coreLessonBody: "בגרסה v2.0 המשתמש לא רק שולח הודעה לוואטסאפ — הוא מנהל אזור אישי חי: מוסיף רשומות, מעדכן סטטוסים ורואה היסטוריה מלאה שנשמרת בענן. שים לב: בתיק העבודות שלך אנו שומרים את דף הנחיתה v1.0 כעבודה הראשונה, ומוסיפים את המערכת הזו כעבודה שנייה נפרדת!",
    roiInsight: "הוכחת צמיחה מול לקוחות: כשלקוח רואה בתיק שלך גם דף נחיתה ממיר (v1.0) וגם אפליקציית ענן מלאה (v2.0), קל לו לבחור בחבילה היקרה יותר.",
    amateurMistake: "דורס את הפרויקט הקודם במקום להציג 2 עבודות נפרדות שמראות התפתחות מקצועית.",
    proExecution: "שומר את v1.0 כנכס עצמאי, מעלה את אפליקציית v2.0 לכתובת ייצור חיה ומאמת פעולת CRUD מלאה.",
    externalServices: [
      {
        name: "Vercel Environment Variables (חינם)",
        url: "https://vercel.com",
        purpose: "חיבור מפתחות Supabase לשרת הייצור בצורה מוצפנת.",
        exactSteps: [
          "היכנס לפרויקט ב-Vercel -> 'Settings' -> 'Environment Variables'.",
          "הוסף את NEXT_PUBLIC_SUPABASE_URL ואת NEXT_PUBLIC_SUPABASE_ANON_KEY ובצע Redeploy.",
        ],
      },
    ],
    readyPrompt: "עבוד איתי בשיטת ProofCraft: כתוב פקודת PowerShell (עם Out-File -Encoding utf8) היוצרת עמוד אפליקציה אישי (src\\app\\dashboard\\page.tsx) המחובר ל-Supabase עם פעולות יצירה, הצגה ומחיקה (CRUD) של רשומות בזמן אמת.",
    troubleshooting: [
      {
        symptom: "האפליקציה עובדת מקומית אך ב-Vercel מופיעה שגיאת Supabase URL required",
        fixExplanation: "משתני הסביבה מ-.env.local לא הוגדרו בהגדרות הפרויקט ב-Vercel.",
        fixPrompt: "העתק את 2 המשתנים מקובץ .env.local לתוך Environment Variables ב-Vercel ולחץ Redeploy.",
      },
    ],
    quizQuestion: "מדוע חשוב לשמור את נכס v1.0 בנפרד ולהוסיף את v2.0 כעבודה שנייה בתיק העבודות?",
    quizOptions: [
      "כדי להציג ללקוחות מגוון פתרונות מוכחים (גם דף מהיר וגם מערכת ענן) ולמכור חבילות מדורגות",
      "כי מותר רק לינק אחד בכל האתר",
      "כדי למחוק את העבודה הראשונה",
    ],
    correctQuizIdx: 0,
  },
  {
    id: "t2-mod4",
    stepNumber: 4,
    title: "מודול 4: ביקורת עמיתים טכנית + סגירת עסקאות SaaS וריטיינר",
    subtitle: "קבלת ביקורת בונה בקיר הקהילה על אפליקציית v2.0 ושדרוג הפרופיל ל-Full-Stack AI Builder.",
    badgeUnlocked: "Full-Stack AI Builder Certified",
    assetBuilt: "פרופיל Full-Stack + 2 עבודות מאומתות + הצעת ריטיינר",
    coreLessonTitle: "מעבר ממכירה חד-פעמית להכנסה חודשית חוזרת (MRR)",
    coreLessonBody: "עסק שיש לו מערכת ניהול לקוחות בענן צריך ליווי, גיבויים ושדרוגים שוטפים. בוגר מסלול 2 מציע ללקוח הקמה מלאה + חבילת תחזוקה ואירוח מנוהל (Managed Cloud) שמייצרת תזרים חודשי קבוע.",
    roiInsight: "מודל הכנסה: הקמה ₪4,500 + ₪350/חודש תחזוקה וגיבויים. 10 לקוחות כאלה = ₪3,500 הכנסה קבועה מדי חודש.",
    amateurMistake: "מוסר מערכת מורכבת ללקוח בלי הסבר על ניהול משתמשים ובלי חבילת תחזוקה.",
    proExecution: "משתף את v2.0 בקיר הפידבק, תורם ביקורת בונה לעמיתים ומציג פרופיל Full-Stack עם 2 עבודות חיות.",
    externalServices: [
      {
        name: "Supabase Database Backups",
        url: "https://supabase.com",
        purpose: "בדיקת תקינות טבלאות וייצוא גיבוי נתונים עבור הלקוח.",
        exactSteps: [
          "היכנס ב-Supabase ל-'Database' -> 'Backups' וודא שהנתונים מגובים.",
        ],
      },
    ],
    readyPrompt: "כתוב עבורי תסריט הצעת מחיר עסקית לבעל עסק לשדרוג דף הנחיתה שלו למערכת ניהול לקוחות ותורים בענן (v2.0), כולל פירוט החיסכון בזמן, אבטחת המידע וחבילת תחזוקה חודשית.",
    troubleshooting: [
      {
        symptom: "לקוח חושש שהמידע העסקי שלו לא יהיה נגיש לו",
        fixExplanation: "בעלי עסקים רוצים לדעת שתמיד יש להם גישה וייצוא לנתונים שלהם.",
        fixPrompt: "הוסף כפתור 'ייצוא נתונים ל-CSV / Excel' בדשבורד של הלקוח בלחיצה אחת.",
      },
    ],
    quizQuestion: "מה היתרון המרכזי של שדרוג לקוח ממערכת v1.0 למערכת ענן v2.0 עבורך כבונה?",
    quizOptions: [
      "יכולת לגבות מחיר הקמה גבוה פי 2.5 + בניית הכנסה חודשית חוזרת (ריטיינר)",
      "אין הבדל במחיר או בערך",
      "הלקוח מפסיק להשתמש בוואטסאפ",
    ],
    correctQuizIdx: 0,
  },
];

export const TRACK2_CLOSING_KIT = {
  recommendedPricing: "הקמת מערכת SaaS / CRM: ₪3,800 – ₪6,500 + ₪350/חודש תחזוקה, אבטחה וגיבויים",
  salesPitchTemplate: "היי [שם בעל העסק], בנוסף לדפי נחיתה מהירים, אני בונה מערכות ענן מותאמות אישית לניהול לקוחות, תורים והזמנות עם אזור אישי מאובטח (כולל ייצוא לאקסל וגיבוי אוטומטי). מוזמן לראות 2 פרויקטים חיים בתיק העבודות המאומת שלי: [קישור לתיק העבודות] — אשמח להדגים לך איך זה חוסך לעסק שלך שעות עבודה בשבוע!",
  handoverChecklist: [
    "אימות יצירת משתמש חדש (Sign Up) והפרדת הרשאות RLS בייצור.",
    "מסירת גישה לניהול הנתונים והדרכה על ייצוא רשומות.",
    "הצעת שדרוג עתידית (Upsell): חיבור סליקת אשראי אוטומטית והתראות טלגרם (ידע ממסלול 3).",
  ],
};
