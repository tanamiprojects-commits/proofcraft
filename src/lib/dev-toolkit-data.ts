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
  { num: 1, title: "1. אפיון וארכיטקטורה", icon: "📐" },
  { num: 2, title: "2. עיצוב UI/UX", icon: "🎨" },
  { num: 3, title: "3. פיתוח ו-AI Coding", icon: "💻" },
  { num: 4, title: "4. מסד נתונים ואימות", icon: "🗄️" },
  { num: 5, title: "5. אבטחה, QA וביצועים", icon: "🛡️" },
  { num: 6, title: "6. פריסה, סליקה ושיווק", icon: "🚀" },
];

export const DEV_TOOLS: DevToolItem[] = [
  {
    id: "tool-claude-gemini",
    stageNumber: 1,
    stageTitle: "אפיון וארכיטקטורה",
    name: "Claude 3.7 / Gemini Pro",
    category: "ארכיטקטורת מערכת ואפיון PRD",
    shortDesc: "תכנון מבנה נתונים, זרימת משתמשים (User Flow) ומסמך דרישות לפני שורת קוד אחת.",
    fullExplanation: "כלי החשיבה והתכנון המובילים לפירוק רעיון עסקי למסכים, טבלאות מסד נתונים, הרשאות אבטחה ותסריטי קצה.",
    actionsYouCanDo: ["כתיבת מסמך אפיון טכני (PRD)", "תכנון סכמת SQL והרשאות RLS", "זיהוי כשלי אבטחה בשלב התכנון"],
    pricingByVolume: [
      { tier: "חינם (Free)", cost: "$0 / חודש", volumeDetails: "שימוש יומי מוגבל בהודעות — מספיק לאפיון ראשוני של MVP" },
      { tier: "מקצועי (Pro)", cost: "$20 / חודש", volumeDetails: "חלון הקשר ענק (200K–1M טוקנים) לניתוח קוד מלא ומסמכים ארוכים" },
      { tier: "API לפי נפח", cost: "$1.25–$15 למיליון טוקנים", volumeDetails: "תשלום לפי שימוש בפועל בתוך האפליקציה שלך" },
    ],
    userRequirements: ["יכולת ניסוח דרישות עסקיות ברורות", "הבנה בסיסית של ישויות (משתמשים, מוצרים, הזמנות)"],
    coreCapabilities: ["ניתוח הקשר רחב במיוחד", "הפקת תרשימי ארכיטקטורה וקוד SQL תקני", "ביקורת קוד ואבטחה"],
    officialUrl: "https://claude.ai",
    verificationActionLabel: "אימתתי אפיון וארכיטקטורה מלאה למוצר",
  },
  {
    id: "tool-v0-stitch",
    stageNumber: 2,
    stageTitle: "עיצוב UI/UX",
    name: "v0 by Vercel / Figma",
    category: "עיצוב ממשקים ו-Design System",
    shortDesc: "יצירת רכיבי UI רספונסיביים, מערכות עיצוב ו-Wireframes ברמת הפקה.",
    fullExplanation: "מאפשר לתרגם תיאור טקסטואלי או סקיצה לממשק משתמש מודרני (React / CSS) תוך הקפדה על RTL, ניגודיות ונגישות.",
    actionsYouCanDo: ["בניית דפי נחיתה ודשבורדים", "הגדרת Design Tokens (צבעים, טיפוגרפיה)", "בדיקת תצוגת מובייל ודסקטופ"],
    pricingByVolume: [
      { tier: "חינם (Free)", cost: "$0 / חודש", volumeDetails: "עד 200 קרדיטים בחודש לבניית מסכים ראשוניים" },
      { tier: "פרימיום (Premium)", cost: "$20 / חודש", volumeDetails: "אלפי קרדיטים, ייצוא מלא וסנכרון פרויקטים" },
    ],
    userRequirements: ["היכרות עם עקרונות היררכיה ויזואלית", "הגדרת כיווניות RTL ונגישות לבעלי מוגבלויות"],
    coreCapabilities: ["הפקת קוד ממשק נקי בזמן אמת", "תצוגה מקדימה אינטראקטיבית", "תמיכה ברכיבים נגישים"],
    officialUrl: "https://v0.dev",
    verificationActionLabel: "בניתי ועיצבתי ממשק מלא מותאם מובייל ונגישות",
  },
  {
    id: "tool-cursor-vscode",
    stageNumber: 3,
    stageTitle: "פיתוח ו-AI Coding",
    name: "Cursor AI / VS Code",
    category: "סביבת פיתוח חכמה (AI IDE)",
    shortDesc: "עורך הקוד המרכזי שבו AI כותב, עורך ומסנכרן קבצים מרובים בפרויקט.",
    fullExplanation: "סביבת הפיתוח המתקדמת ביותר לבוני AI — מכירה את כל תיקיות הפרויקט שלך, מתקנת שגיאות טרמינל ומריצה בדיקות.",
    actionsYouCanDo: ["בניית אפליקציות Full-Stack מקצה לקצה", "תיקון באגים אוטומטי (Composer / Agent)", "ניהול גרסאות עם Git"],
    pricingByVolume: [
      { tier: "חינם (Hobby)", cost: "$0 / חודש", volumeDetails: "2,000 השלמות קוד + 50 בקשות איטיות בחודש" },
      { tier: "מקצועי (Pro)", cost: "$20 / חודש", volumeDetails: "500 בקשות מהירות למודלים המובילים + השלמות ללא הגבלה" },
      { tier: "עסקי (Business)", cost: "$40 / משתמש", volumeDetails: "פרטיות קוד מלאה (Zero Data Retention) וניהול צוות" },
    ],
    userRequirements: ["הבנת מבנה תיקיות של פרויקט Web", "יכולת קריאת שגיאות בטרמינל והכוונת ה-AI לפתרון"],
    coreCapabilities: ["עריכת מספר קבצים במקביל", "אינדוקס מלא של כל הקוד בפרויקט", "הרצת פקודות טרמינל חכמה"],
    officialUrl: "https://cursor.com",
    verificationActionLabel: "פיתחתי והרצתי בהצלחה קוד עובד בסביבת AI IDE",
  },
  {
    id: "tool-supabase",
    stageNumber: 4,
    stageTitle: "מסד נתונים ואימות",
    name: "Supabase (PostgreSQL + Auth)",
    category: "תשתית Backend, מסד נתונים והרשאות",
    shortDesc: "מסד נתונים בענן, הרשמה/התחברות מאובטחת (Auth) ואחסון קבצים בזמן אמת.",
    fullExplanation: "מחליף הקמת שרת מסורתי: מספק טבלאות PostgreSQL, מנגנון הרשמה עם Google/אימייל, ומדיניות אבטחת שורות (RLS).",
    actionsYouCanDo: ["שמירת פרופילי משתמשים ונתוני אפליקציה", "ניהול הרשאות אדמין מול משתמש רגיל (RLS)", "סנכרון נתונים בזמן אמת (Realtime)"],
    pricingByVolume: [
      { tier: "חינם (Free)", cost: "$0 / חודש", volumeDetails: "עד 500MB מסד נתונים + 50,000 משתמשים פעילים בחודש (אידיאלי להשקה)" },
      { tier: "מקצועי (Pro)", cost: "$25 / חודש", volumeDetails: "8GB מסד נתונים + 100,000 משתמשים + גיבויים יומיים אוטומטיים" },
      { tier: "צמיחה (Team/Scale)", cost: "$599+ / חודש", volumeDetails: "ביצועים ייעודיים, עמידה בתקני SOC2/HIPAA ותמיכה 24/7" },
    ],
    userRequirements: ["הבנת מפתחות API (Project URL ו-Anon Key)", "הגדרת מדיניות RLS כדי למנוע דליפת נתונים בין משתמשים"],
    coreCapabilities: ["מסד נתונים רלציוני מלא (SQL)", "מערכת אימות משתמשים מובנית", "ממשק ניהול טבלאות ויזואלי"],
    officialUrl: "https://supabase.com",
    verificationActionLabel: "חיברתי מסד נתונים בענן והגדרתי הרשאות משתמשים",
  },
  {
    id: "tool-github-security",
    stageNumber: 5,
    stageTitle: "אבטחה, QA וביצועים",
    name: "GitHub + OWASP & Build QA",
    category: "בקרת איכות, אבטחת מידע וניהול גרסאות",
    shortDesc: "גיבוי קוד בענן, סריקת מפתחות סודיים, ובדיקות תקינות לפני חשיפה ללקוחות.",
    fullExplanation: "מונע קריסות באוויר ודליפת מפתחות API. כולל בדיקות TypeScript, הגנה על משתני סביבה (.env) ובדיקת הרשאות.",
    actionsYouCanDo: ["שמירת גרסאות וגיבוי קוד מלא בענן", "בדיקת חסינות קלטים (Validation) ומניעת XSS/SQLi", "הרצת Build ייצור ללא שגיאות"],
    pricingByVolume: [
      { tier: "חינם (Free)", cost: "$0 / חודש", volumeDetails: "מאגרי קוד פרטיים וציבוריים ללא הגבלה + 2,000 דקות CI/CD בחודש" },
      { tier: "צוותי (Team)", cost: "$4 / משתמש", volumeDetails: "סריקות אבטחה מתקדמות והגנה על ענפי קוד" },
    ],
    userRequirements: ["הקפדה לא להעלות קובץ .env.local לקוד הציבורי", "בדיקת כל מסך במובייל ובדסקטופ לפני מסירה ללקוח"],
    coreCapabilities: ["היסטוריית שינויים מלאה וחזרה לאחור בלחיצה", "זיהוי אוטומטי של מפתחות סודיים שנחשפו", "אוטומציית בדיקות"],
    officialUrl: "https://github.com",
    verificationActionLabel: "ביצעתי בדיקות אבטחה, הרשאות ו-Build נקי למוצר",
  },
  {
    id: "tool-vercel-payments",
    stageNumber: 6,
    stageTitle: "פריסה, סליקה ושיווק",
    name: "Vercel + LemonSqueezy / Stripe",
    category: "העלאה לאוויר, דומיין, סליקה ושיווק אורגני",
    shortDesc: "הפיכת הקוד לאתר חי עם HTTPS מהיר תוך שניות וחיבור סליקת אשראי גלובלית.",
    fullExplanation: "Vercel מעלה את האפליקציה לאוויר אוטומטית מ-GitHub, ו-LemonSqueezy/Stripe מאפשרים לגבות תשלום מלקוחות בעולם.",
    actionsYouCanDo: ["פריסת האפליקציה לשרת חי עם תעודת SSL", "חיבור דומיין עסקי מותאם אישית", "פתיחת דפי תשלום וסליקה למוצר"],
    pricingByVolume: [
      { tier: "חינם (Hobby)", cost: "$0 / חודש", volumeDetails: "100GB תעבורה בחודש + פריסות ללא הגבלה (מספיק לאלפי מבקרים)" },
      { tier: "מקצועי (Pro)", cost: "$20 / חודש", volumeDetails: "1TB תעבורה, אנליטיקס מתקדם ושימוש מסחרי מלא" },
      { tier: "עמלת סליקה", cost: "2.9%–5% לעסקה", volumeDetails: "אין דמי הקמה — משלמים עמלה רק כשלקוח משלם לך בפועל" },
    ],
    userRequirements: ["הזנת משתני הסביבה (Environment Variables) בהגדרות השרת", "יצירת תיק עבודות מאומת ושיתופו בקהילות רלוונטיות"],
    coreCapabilities: ["פריסה תוך 30 שניות מרגע עדכון הקוד", "מהירות טעינה עולמית (Edge CDN)", "גביית תשלומים וחשבוניות אוטומטיות"],
    officialUrl: "https://vercel.com",
    verificationActionLabel: "העליתי מוצר חי לאוויר והכנתי תשתית לשיווק וסליקה",
  },
];
