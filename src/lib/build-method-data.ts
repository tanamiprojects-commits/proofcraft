import { supabase } from "./supabase";

export interface PromptLibraryItem {
  id: string;
  method_stage: number;
  category: string;
  tool_tag: string;
  complexity: string;
  title: string;
  when_to_use: string;
  prompt_template: string;
  is_active: boolean;
}

export interface BuildMethodStage {
  stage: number;
  title: string;
  subtitle: string;
  proofcraft_example: string;
  client_application: string;
  demo_route?: string;
  demo_label?: string;
  plug_and_play_prompt?: string;
  is_active?: boolean;
}

export const BUILD_METHOD_STAGES: BuildMethodStage[] = [
  {
    stage: 1,
    title: "שלב 1: תדרוך הצ׳אט ואפיון DB (SQL + RLS)",
    subtitle: "מגדירים לצ׳אט לעבוד בפקודות PowerShell אטומיות קצרות, מפצחים את המודל העסקי ומקימים טבלאות ענן מאובטחות.",
    proofcraft_example: "ב-ProofCraft הקמנו קודם את טבלאות profiles ו-method_stages עם מדיניות RLS ב-Supabase.",
    client_application: "העתק את הפרומפט, ענה לצ׳אט על 4 שאלות על הרעיון שלך והרץ את ה-SQL שתקבל.",
    demo_route: "/admin",
    demo_label: "המחשה: תשתית נתונים (/admin)",
    plug_and_play_prompt: "אני בונה מוצר Web חדש מאפס בשיטת ProofCraft (Next.js + Supabase + PowerShell). עבוד איתי רק בפקודות PowerShell קצרות (Out-File -Encoding utf8) לקובץ אחד בכל פעם. שאל אותי עכשיו 4 שאלות קצרות על הרעיון המקורי שלי כדי לאפיין את טבלאות ה-SQL והרשאות ה-RLS לפני שורת קוד אחת.",
  },
  {
    stage: 2,
    title: "שלב 2: מעטפת אפליקציה, שפות וחוקיות (App Shell)",
    subtitle: "בניית ניווט קבוע (Header + Tab Bar), מתג שפה חי (עברית RTL + אנגלית LTR), נגישות, תמיכה שקטה ופוטר משפטי.",
    proofcraft_example: "ב-ProofCraft בנינו את AppShell.tsx כך שכל עמוד מקבל אוטומטית ניווט, שפות, נגישות ותקנון.",
    client_application: "הפעל את הפרומפט והרץ את פקודת ה-PowerShell כדי להקים את שלד המוצר והמעטפת המסחרית.",
    demo_route: "/",
    demo_label: "המחשה: מעטפת ופוטר (/)",
    plug_and_play_prompt: "כתוב פקודת PowerShell היוצרת את מעטפת האפליקציה (src\\components\\AppShell.tsx): 1) Header עם לוגו ומתג שפה חי עברית (RTL) / אנגלית (LTR), 2) תפריט תחתון רספונסיבי, 3) כפתור נגישות, תמיכה שקטה באתר, ו-Footer מלא (אודות, יצירת קשר, מחירון, שאלות נפוצות, תנאי שימוש, פרטיות, שמירת מסמכים, ביטולים והצהרת נגישות).",
  },
  {
    stage: 3,
    title: "שלב 3: בניית מסכי הליבה וחוויית משתמש (Core UX)",
    subtitle: "פיתוח המנוע המרכזי בחלוקה לכרטיסים ממוקדים, מד התקדמות ויזואלי, דוגמאות מוכנות ומילוי מהיר בלחיצה.",
    proofcraft_example: "ב-ProofCraft בנינו כך את /workspace עם מד התקדמות 4-עמודי וסנכרון אוטומטי לענן.",
    client_application: "בקש מהצ׳אט לבנות כל מסך ליבה בנפרד דרך פקודת PowerShell ובדוק בדפדפן.",
    demo_route: "/workspace",
    demo_label: "המחשה: מסך פעולה ומד התקדמות (/workspace)",
    plug_and_play_prompt: "כתוב פקודת PowerShell היוצרת את מסך הפעילות המרכזי של המוצר שלי: חלק את התהליך לשלבים נקיים (משימה אחת בכל פעם), הוסף מד התקדמות בזמן אמת, דוגמה חיה להמחשה, ומילוי מהיר בלחיצה — עם שמירה אוטומטית ב-Supabase והודעות Toast.",
  },
  {
    stage: 4,
    title: "שלב 4: מרכז שליטה וניהול ללא קוד (Admin CMS)",
    subtitle: "דשבורד מנהל מוגן הרשאות לשליטה בתוכן, מחירים, משתמשים וסטטיסטיקות בזמן אמת מהענן.",
    proofcraft_example: "ב-ProofCraft בנינו את /admin עם כרטיסי KPI, עריכת כלים ופרומפטים ויומן ביקורת (Audit Log).",
    client_application: "הדבק את הפרומפט כדי להוסיף מערכת ניהול מלאה לרעיון שלך.",
    demo_route: "/admin",
    demo_label: "המחשה: מרכז ניהול (/admin)",
    plug_and_play_prompt: "כתוב פקודת PowerShell היוצרת דשבורד ניהול מוגן הרשאות (src\\app\\admin\\page.tsx): ודא שרק אדמין ניגש למסך, הצג כרטיסי KPI עליונים, ואפשר להוסיף, לערוך ולמחוק תוכן, מחירים והודעות ב-Supabase בזמן אמת עם תיעוד ב-audit_logs.",
  },
  {
    stage: 5,
    title: "שלב 5: חילוץ משגיאות ואימות Build (Error-to-Fix)",
    subtitle: "פתרון כירורגי של שגיאות TypeScript/Build בטרמינל בלי למחוק קוד עובד, ואבטחת ייצור.",
    proofcraft_example: "בכל שלב ב-ProofCraft הרצנו npm run build ותיקנו שגיאות נקודתיות עד ל-0 שגיאות.",
    client_application: "כשמופיעה שגיאה בטרמינל, העתק את הפרומפט והדבק מתחת את שורת השגיאה.",
    demo_route: "/toolkit",
    demo_label: "המחשה: אבטחה וכלים (/toolkit)",
    plug_and_play_prompt: "הרצתי npm run build וקיבלתי את השגיאה הבאה. נתח את שורש הבעיה בקובץ ובשורה המדויקים וספק פקודת PowerShell קצרה שמתקנת רק את השגיאה ומריצה שוב npm run build לאימות (מבלי לשכתב קבצים תקינים אחרים):",
  },
  {
    stage: 6,
    title: "שלב 6: עלייה לאוויר, קהילה ושיווק (Launch)",
    subtitle: "פריסת המוצר לכתובת ציבורית חיה (HTTPS), מנגנון הוכחה חברתית ושיתוף ללקוחות ראשונים.",
    proofcraft_example: "ב-ProofCraft חיברנו קיר אימות קהילתי (/feed) ותיק עבודות מאומת (/portfolio/live).",
    client_application: "הדבק את הפרומפט לקבלת פקודות העלייה לאוויר (GitHub + Vercel) ומנוע השיתוף.",
    demo_route: "/portfolio/live",
    demo_label: "המחשה: תיק עבודות ושיתוף (/portfolio/live)",
    plug_and_play_prompt: "הפרויקט שלי עובר npm run build בהצלחה. הכן לי: 1) פקודת PowerShell להוספת תגיות OpenGraph וכפתורי שיתוף ל-WhatsApp ו-LinkedIn, 2) שאילתת SQL לבדיקת אבטחת RLS לפני חשיפה, 3) פקודות Git להעלאה ל-GitHub וחיבור ל-Vercel.",
  },
];

export const PROMPT_FORMULA_GUIDE = [
  { step: "1. תפקיד ושיטת ביצוע (Role & PowerShell)", desc: "הגדר לצ׳אט: 'עבוד איתי רק בפקודות PowerShell קצרות עם Out-File -Encoding utf8'." },
  { step: "2. משימה ממוקדת לקובץ אחד (Atomic File)", desc: "בקש רכיב או מסך אחד בכל פעם — לעולם לא מערכת שלמה בהודעה אחת." },
  { step: "3. אילוצי איכות ואבטחה (Constraints)", desc: "ציין: 'עברית RTL, תמיכה במובייל, אבטחת RLS, בלי לשכתב קבצים אחרים'." },
  { step: "4. אימות Build מיידי (Verification)", desc: "סיים כל שלב בהרצת npm run build כדי לוודא 0 שגיאות TypeScript." },
];

export async function fetchMethodStages(): Promise<BuildMethodStage[]> {
  const { data, error } = await supabase.from("method_stages").select("*").eq("is_active", true).order("stage", { ascending: true });
  if (!error && data && data.length > 0) return data as BuildMethodStage[];
  return BUILD_METHOD_STAGES;
}

export async function fetchPromptLibrary(): Promise<PromptLibraryItem[]> {
  const { data } = await supabase.from("prompt_library").select("*").eq("is_active", true).order("method_stage", { ascending: true });
  return (data as PromptLibraryItem[]) || [];
}
