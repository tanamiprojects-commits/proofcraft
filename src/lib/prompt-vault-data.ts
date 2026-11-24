export interface VaultPromptItem {
  id: string;
  stageNumber: number;
  category: string;
  title: string;
  goal: string;
  powershellReadyPrompt: string;
  securityNote: string;
  sampleOutput: string;
}

export const PROMPT_VAULT_CATALOG: VaultPromptItem[] = [
  {
    id: "vp-1",
    stageNumber: 1,
    category: "1. אפיון וארכיטקטורת מוצר",
    title: "אפיון מערכת מלאה, סכמת DB ותזרימי משתמש",
    goal: "הפיכת רעיון גולמי למפרט טכני סגור עם הפרדת רשויות ו-RLS.",
    powershellReadyPrompt: "עבוד איתי בשיטת ProofCraft: בנה אפיון ארכיטקטוני מלא הכולל טבלאות PostgreSQL מנורמלות, הרשאות משתמשים, תזרימי API בצד השרת ותוכנית ביצוע בשלבים מודולריים דרך פקודות PowerShell.",
    securityNote: "אין להטמיע מזהים פרטיים באפיון ציבורי; הגדר מראש הפרדה בין מפתחות לקוח למפתחות שרת.",
    sampleOutput: "✓ סכמת DB בעלת 4 טבלאות מנורמלות + מדיניות RLS לפי user_id + מפת נתיבי /api מאובטחים.",
  },
  {
    id: "vp-2",
    stageNumber: 2,
    category: "2. עיצוב UI/UX ונגישות RTL",
    title: "בניית מערכת עיצוב Obsidian Studio בעברית מלאה",
    goal: "יצירת ממשק פינטק אוורירי, ניגודיות גבוהה (AA) והתאמה מלאה למובייל ולמחשב.",
    powershellReadyPrompt: "כתוב פקודת PowerShell המעדכנת את src\\app\\globals.css למערכת עיצוב כהה ברמת פינטק עם ניגודיות לבן-על-פחם (#F8FAFC על #0A0B0E), כיוון RTL תקין, כרטיסים מרווחים ומניעת גלילה אופקית.",
    securityNote: "אל תשתמש ב-dangerouslySetInnerHTML לעיצוב או הצגת טקסטים של משתמשים.",
    sampleOutput: "✓ מערכת Design Tokens אחידה ב-globals.css עם תמיכה מלאה במובייל ובמחשב וניגודיות 14.5:1.",
  },
  {
    id: "vp-3",
    stageNumber: 3,
    category: "3. פיתוח פיצ׳רים ו-PowerShell Plug & Play",
    title: "הקמת רכיב מודולרי ללא מילוי ידני (Zero-Manual)",
    goal: "כתיבת קוד מלא לקבצים ישירות דרך PowerShell Here-Strings ב-UTF-8 ללא BOM.",
    powershellReadyPrompt: "כתוב פקודת PowerShell מלאה (עם UTF8Encoding($false)) היוצרת רכיב React/TypeScript עצמאי, מחברת אותו לדף הראשי ומריצה npm run build לאימות אפס שגיאות קומפילציה.",
    securityNote: "בדוק תמיד שהקוד נכתב עם קידוד UTF-8 תקני כדי למנוע שיבוש תווים בעברית.",
    sampleOutput: "✓ הקובץ נוצר אוטומטית ב-src\\components + אימות npm run build עבר בהצלחה (0 שגיאות).",
  },
  {
    id: "vp-4",
    stageNumber: 4,
    category: "4. מסדי נתונים, Supabase ואבטחת RLS",
    title: "הגנה הרמטית על נתוני משתמשים ו-Trigger מניעת זיוף",
    goal: "וידוא שכל משתמש ניגש אך ורק לנתונים שלו ואינו יכול לשנות הרשאות או דרגות תשלום.",
    powershellReadyPrompt: "כתוב שאילתת SQL מלאה ל-Supabase המפעילה Row Level Security (RLS) על כל הטבלאות ויוצרת Trigger מסוג SECURITY DEFINER שמונע ממשתמש רגיל לשנות לעצמו הרשאות אדמין או דרגת מנוי.",
    securityNote: "לעולם אל תשאיר טבלה ב-Supabase ללא Enable RLS ומדיניות SELECT/INSERT/UPDATE מפורשת.",
    sampleOutput: "✓ מדיניות RLS פעילה + Trigger הגנה על שדות רגישים אומת ב-Supabase SQL Editor.",
  },
  {
    id: "vp-5",
    stageNumber: 5,
    category: "5. אבטחת טרמינל, מפתחות API, טוקנים ו-.env",
    title: "ניהול סודות, נעילת .gitignore ואימות מפתחות בשרת בלבד",
    goal: "מניעת דליפת API Keys, סיסמאות וטוקנים ל-GitHub או לדפדפן הלקוח בזמן עבודה בטרמינל.",
    powershellReadyPrompt: "כתוב פקודת PowerShell אבטחה שמוודאת שקובץ .env.local מוחרג ב-.gitignore, מנקה היסטוריית פקודות רגישות בטרמינל, ויוצרת תבנית .env.example ללא ערכים אמיתיים, כולל בדיקה שאף מפתח פרטי (ללא NEXT_PUBLIC_) לא נחשף בקוד הלקוח.",
    securityNote: "חוק ברזל: מפתחות סודיים (SERVICE_ROLE_KEY, GEMINI_API_KEY, WEBHOOK_SECRET) לעולם לא יתחילו ב-NEXT_PUBLIC_ ולעולם לא יודבקו בצ׳אט ציבורי או בקוד שעולה ל-GitHub.",
    sampleOutput: "✓ .env.local מוגן ב-.gitignore + סריקת מפתחות עברה נקייה + מפתחות שרת מבודדים ב-Route Handlers.",
  },
  {
    id: "vp-6",
    stageNumber: 6,
    category: "6. סליקה מאומתת, Webhooks ואוטומציה",
    title: "אימות חתימה קריפטוגרפית (HMAC) והתראות Telegram בזמן אמת",
    goal: "חיבור תשלומים ואוטומציות מבלי לאפשר זיוף אישורי תשלום מצד הדפדפן.",
    powershellReadyPrompt: "כתוב פקודת PowerShell היוצרת Route Handler בצד השרת (src\\app\\api\\webhooks\\payment\\route.ts) שמאמת חתימת HMAC-SHA256 מול process.env.WEBHOOK_SECRET, מעדכן הרשאה ב-Supabase ושולח התראת Telegram מיידית למנהל.",
    securityNote: "סמוך אך ורק על Webhook חתום מהשרת הסולק — לעולם אל תעדכן תשלום על סמך פרמטר בכתובת ה-URL בדפדפן.",
    sampleOutput: "✓ נתיב /api/webhooks/payment מאומת חתימה + התראת Telegram אוטומטית בכל רכישה.",
  },
  {
    id: "vp-7",
    stageNumber: 7,
    category: "7. פריסה ל-Vercel, דומיין ואבטחת קישורים",
    title: "העלאה לייצור (Production), הגדרת משתני סביבה ו-CSP",
    goal: "השקת המוצר בכתובת HTTPS חיה עם הגנה מפני XSS וקישורים זדוניים.",
    powershellReadyPrompt: "כתוב פקודת PowerShell שמריצה בדיקת Production Build סופית, בודקת תקינות משתני סביבה, ומכינה פקודות Git נקיות להעלאה ל-GitHub ופריסה אוטומטית ב-Vercel.",
    securityNote: "הזן את כל מפתחות ה-.env.local ידנית בלוח הבקרה של Vercel -> Settings -> Environment Variables.",
    sampleOutput: "✓ Production Build עבר ב-0 שגיאות + פריסה חיה מאובטחת ב-HTTPS.",
  },
  {
    id: "vp-8",
    stageNumber: 8,
    category: "8. שיווק אורגני, קופירייטינג וסגירת לקוחות",
    title: "יצירת הצעת ערך ממירה ותסריטי פנייה ללקוחות",
    goal: "הפיכת הנכס הדיגיטלי למנוע הכנסות עם תסריטי WhatsApp, LinkedIn ותגובות ערך בכתבות.",
    powershellReadyPrompt: "עבוד איתי בשיטת ProofCraft: נסח 3 תסריטי שיווק אורגני לא-ספאמיים (הודעת וואטסאפ אישית לבעל עסק, פוסט סמכות ללינקדאין ותגובה מקצועית מביאת ערך לכתבה טכנולוגית) המפנים לתיק העבודות המאומת שלי.",
    securityNote: "שתף אך ורק קישורי HTTPS מאומתים לתיק העבודות ולנכס החי.",
    sampleOutput: "✓ 3 תסריטי שיווק אורגני מוכנים לשימוש מיידי עם הנעה לפעולה מדויקת.",
  },
];
