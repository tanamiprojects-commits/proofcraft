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
    artifactPromptTitle: "הדבק את הצהרת הערך, קהל היעד ומבנה הבלוקים של דף הנחיתה שהפקת:",
    artifactPlaceholder: "לדוגמה: כותרת ראשית (Hero), 3 נקודות כאב עסקיות, הוכחה חברתית, טופס לידים המחובר לוואטסאפ...",
    requiredSignals: ["hero", "whatsapp", "לקוח", "בעיה"],
    minChars: 45,
    missingSignalHint: "הפלט חייב לכלול התייחסות למבנה Hero, פתרון בעיית הלקוח וחיבור WhatsApp.",
    rationaleOptions: [
      "מיקדתי את המסר בבעיה עסקית מדידה ובכפתור הנעה לפעולה יחיד (Single CTA) להגדלת אחוזי ההמרה.",
      "הפרדתי בין שכבת הערך העסקי להוכחה החברתית כדי לבנות אמון תוך 5 שניות.",
    ],
    auditChecklist: [
      "הגדרתי הצעת ערך ברורה בשפה פשוטה ללא ז׳רגון טכני מיותר",
      "וידאתי שלכל סקשן בדף יש מטרה עסקית מדידה",
    ],
  },
  "t1-mod2": {
    moduleId: "t1-mod2",
    artifactPromptTitle: "הדבק קטע קוד או פלט טרמינל המאמת תמיכת RTL ורספונסיביות (dir=\"rtl\" / CSS):",
    artifactPlaceholder: "הדבק כאן קטע מ-globals.css או מקובץ הקומפוננטה הכולל dir=\"rtl\", ניגודיות ופריסת מובייל...",
    requiredSignals: ["rtl", "padding", "color", "grid", "flex"],
    minChars: 40,
    missingSignalHint: "הדבק קטע קוד/CSS אמיתי המכיל הגדרת rtl ופריסת רספונסיביות (flex/grid/padding).",
    rationaleOptions: [
      "יישמתי ארכיטקטורת Mobile-First עם כיווניות RTL תקנית וניגודיות גבוהה לקריאות מושלמת בנייד.",
      "מנעתי גלילה אופקית והטמעתי כפתורי אגודל רחבים למניעת טעויות לחיצה.",
    ],
    auditChecklist: [
      "בדקתי שאין חיתוך טקסט או גלילה אופקית ברוחב מסך 360px",
      "אימתתי ניגודיות גבוהה בין הטקסט לרקע הכהה",
    ],
  },
  "t1-mod3": {
    moduleId: "t1-mod3",
    artifactPromptTitle: "הדבק את פלט הבנייה (npm run build) או מבנה קישור ה-WhatsApp הדינמי שלך:",
    artifactPlaceholder: "לדוגמה: Compiled successfully / https://wa.me... + כתובת האתר החי ב-Vercel",
    requiredSignals: ["compiled", "wa.me", "https://", "route", "vercel"],
    minChars: 35,
    missingSignalHint: "הדבק פלט אימות בנייה (Compiled / Route) או מבנה קישור wa.me / HTTPS תקין.",
    rationaleOptions: [
      "חיברתי טופס הזמנה דינמי שמייצר הודעת WhatsApp מובנית עם פרטי הלקוח ללא צורך בשרת כבד.",
      "אימתתי בניית Production נקייה (0 שגיאות) לפני העלאה ל-Vercel.",
    ],
    auditChecklist: [
      "בדקתי שקישור ה-WhatsApp פותח הודעה תקינה בעברית ללא שיבוש תווים",
      "האתר באוויר תחת פרוטוקול HTTPS מאובטח",
    ],
  },
  "t2-mod1": {
    moduleId: "t2-mod1",
    artifactPromptTitle: "הדבק את פקודת ה-CREATE TABLE של מסד הנתונים שבנית ב-Supabase:",
    artifactPlaceholder: "create table public.leads ( id uuid primary key, user_id uuid references auth.users(id)... );",
    requiredSignals: ["create table", "uuid", "user_id", "references"],
    minChars: 55,
    missingSignalHint: "הדבק שאילתת SQL אמיתית הכוללת CREATE TABLE, מפתח UUID וקישור user_id.",
    rationaleOptions: [
      "נרמלתי את הטבלאות וקישרתי כל רשומה ל-user_id עם מחיקת CASCADE לשמירה על שלמות הנתונים.",
      "הגדרתי טיפוסי נתונים מדויקים וערכי ברירת מחדל למניעת רשומות פגומות.",
    ],
    auditChecklist: [
      "הטבלאות נוצרו בהצלחה ב-Supabase Table Editor",
      "כל טבלה מכילה מפתח ראשי UUID וחותמת זמן created_at",
    ],
  },
  "t2-mod2": {
    moduleId: "t2-mod2",
    artifactPromptTitle: "הדבק את חוקי ה-Row Level Security (RLS Policy) שהפעלת על הטבלאות:",
    artifactPlaceholder: "alter table ... enable row level security; create policy ... using (auth.uid() = user_id);",
    requiredSignals: ["row level security", "create policy", "auth.uid()"],
    minChars: 55,
    missingSignalHint: "הפלט חייב לכלול ENABLE ROW LEVEL SECURITY, CREATE POLICY ובדיקת auth.uid().",
    rationaleOptions: [
      "הפרדתי הרשאות ברמת השורה (RLS) כך שכל משתמש ניגש אך ורק לרשומות השייכות ל-auth.uid() שלו.",
      "חסמתי גישה אנונימית לכתיבה ומחיקה ישירה מול מסד הנתונים.",
    ],
    auditChecklist: [
      "וידאתי ש-RLS מופעל (Enabled) על כל טבלאות המשתמשים",
      "בדקתי שמשתמש א׳ אינו יכול לקרוא או לערוך נתונים של משתמש ב׳",
    ],
  },
  "t3-mod1": {
    moduleId: "t3-mod1",
    artifactPromptTitle: "הדבק את קוד אימות החתימה הקריפטוגרפית (HMAC / Webhook Route Handler) בשרת:",
    artifactPlaceholder: "import crypto from 'crypto'; const sig = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)...",
    requiredSignals: ["crypto", "process.env", "request", "response", "secret"],
    minChars: 60,
    missingSignalHint: "הדבק קטע קוד אמיתי של Route Handler המשתמש ב-process.env ואימות חתימה/סוד בצד השרת.",
    rationaleOptions: [
      "אימתתי את חתימת ה-Webhook בצד השרת מול משתנה סביבה סודי (process.env) לפני עדכון הרשאה.",
      "מנעתי זיוף תשלומים מצד הדפדפן על ידי הסתמכות בלעדית על קריאת שרת מאומתת.",
    ],
    auditChecklist: [
      "אף מפתח סודי אינו חשוף בקוד הלקוח (ללא קידומת NEXT_PUBLIC_)",
      "השרת מחזיר קוד שגיאה 401 לכל בקשה ללא חתימה תקינה",
    ],
  },
  "t4-mod1": {
    moduleId: "t4-mod1",
    artifactPromptTitle: "הדבק את סכמת ה-Multi-Tenant RBAC ויומן הביקורת (organizations / org_members / audit_logs):",
    artifactPlaceholder: "create table public.organizations ... create table public.org_members (role text check (role in ('owner','admin','member')))...",
    requiredSignals: ["organizations", "org_members", "role", "audit_logs", "policy"],
    minChars: 75,
    missingSignalHint: "בשלב זה נדרשת סכמת SQL הכוללת organizations, org_members, הגדרת תפקידים (role) ו-audit_logs.",
    rationaleOptions: [
      "תכננתי ארכיטקטורת Multi-Tenant עם בידוד נתונים מוחלט בין ארגונים והפרדת הרשאות Owner/Admin/Member.",
      "הטמעתי יומן ביקורת (Audit Log) אוטומטי לכל פעולה רגישה של מנהלי ארגון.",
    ],
    auditChecklist: [
      "אומת בידוד מוחלט בין נתוני ארגון א׳ לארגון ב׳ ברמת ה-RLS",
      "כל שינוי הרשאה מתועד אוטומטית ב-audit_logs",
    ],
  },
};

export function getRubricForModule(moduleId: string, stepNumber: number): ModuleVerificationRule {
  if (VERIFICATION_RUBRIC[moduleId]) return VERIFICATION_RUBRIC[moduleId];
  return {
    moduleId,
    artifactPromptTitle: `הדבק את פלט הביצוע הטכני או הקוד המאומת של שלב ${stepNumber} מתוך סביבת העבודה שלך:`,
    artifactPlaceholder: "הדבק כאן פלט טרמינל (PowerShell), שאילתת SQL מאומתת, או קטע קוד מרכזי שביצעת בשלב זה...",
    requiredSignals: ["const", "export", "create", "select", "https", "import", "return", "function"],
    minChars: 50,
    missingSignalHint: "הדבק פלט ביצוע אמיתי (קוד, שאילתת SQL, פלט טרמינל או קישור HTTPS מאומת) באורך 50 תווים לפחות.",
    rationaleOptions: [
      "יישמתי הפרדת רשויות מלאה בין ממשק המשתמש ללוגיקת השרת ואבטחת הנתונים.",
      "אימתתי תקינות ביצועים, טיפול בשגיאות ואבטחת קלטים לפני העברה לייצור.",
    ],
    auditChecklist: [
      "ביצעתי את המשימה בפועל בסביבת הפיתוח והענן שלי",
      "אימתתי שאין שגיאות קומפילציה או חשיפת מפתחות פרטיים",
    ],
  };
}
