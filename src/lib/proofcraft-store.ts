export interface VerificationStep {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badgeName: string;
  assetUnlocked: string;
  points: number;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "url" | "select";
    options?: string[];
    minLength?: number;
  }[];
}

export interface BuilderProfile {
  fullName: string;
  headline: string;
  yearsWithAI: string;
  primaryTools: string;
  architectureCase: string;
  projectTitle: string;
  projectLiveUrl: string;
  projectProblemSolved: string;
  debuggingStory: string;
  portfolioPitch: string;
  targetAudience: string;
  shareOnFeed: boolean;
  completedStepIds: string[];
  adminVerified: boolean;
  certificateId: string;
  updatedAt: string;
}

export const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: "step-identity",
    number: 1,
    title: "זהות מקצועית ומחסנית כלי AI",
    subtitle: "הגדרת המומחיות, שנות הניסיון וסט הכלים שאיתם אתה בונה מערכות.",
    badgeName: "AI-Native Builder",
    assetUnlocked: "כרטיס זהות מקצועית בפרופיל",
    points: 15,
    fields: [
      { key: "fullName", label: "שם מלא", placeholder: "לדוגמה: דניאל כהן", type: "text", minLength: 2 },
      { key: "headline", label: "כותרת מקצועית", placeholder: "בונה פלטפורמות Web ואוטומציות מבוססות AI", type: "text", minLength: 8 },
      { key: "yearsWithAI", label: "ותק בנייה עם AI", placeholder: "בחר ותק", type: "select", options: ["1-2 שנים", "2-3 שנים", "מעל 3 שנים (חלוץ בתחום)"] },
      { key: "primaryTools", label: "כלים וסביבות עבודה", placeholder: "Base44, VS Code, Cursor, Next.js, Supabase", type: "text", minLength: 4 },
    ],
  },
  {
    id: "step-architecture",
    number: 2,
    title: "הוכחת אפיון וארכיטקטורת מערכת",
    subtitle: "הראה שאתה יודע לפרק רעיון למבנה נתונים, מסכים והרשאות.",
    badgeName: "System Architect",
    assetUnlocked: "סעיף מתודולוגיה וארכיטקטורה בפרופיל",
    points: 20,
    fields: [
      { key: "architectureCase", label: "תאר מערכת שבנית: חלוקת מסכים, מסד נתונים וזרימת משתמש", placeholder: "פרט בקצרה על הישויות, ניהול המשתמשים וזרימת המידע...", type: "textarea", minLength: 25 },
    ],
  },
  {
    id: "step-deployment",
    number: 3,
    title: "הוכחת מוצר חי (Live Project Proof)",
    subtitle: "הזן פרויקט אמיתי שבנית והעלית לאוויר כעוגן בתיק העבודות.",
    badgeName: "Shipped & Live",
    assetUnlocked: "פרויקט ראשון מאומת בתיק העבודות",
    points: 20,
    fields: [
      { key: "projectTitle", label: "שם הפרויקט", placeholder: "מערכת לניהול תורים והזמנות לעסקים", type: "text", minLength: 3 },
      { key: "projectLiveUrl", label: "קישור לפרויקט החי או GitHub", placeholder: "https://...", type: "url", minLength: 6 },
      { key: "projectProblemSolved", label: "איזו בעיה עסקית הפרויקט פותר?", placeholder: "תאר את הצורך בשוק ואת הפתרון שבנית...", type: "textarea", minLength: 20 },
    ],
  },
  {
    id: "step-debugging",
    number: 4,
    title: "הוכחת שליטה ופתרון תקלות (Debugging)",
    subtitle: "תאר באג מורכב או שגיאת אינטגרציה שזיהית ופתרת מול ה-AI.",
    badgeName: "Problem Solver",
    assetUnlocked: "תג אמינות טכנית למעסיקים ולקוחות",
    points: 15,
    fields: [
      { key: "debuggingStory", label: "תיאור התקלה ואיך הובלת את ה-AI לפתרון", placeholder: "תאר את השגיאה ואיך פתרת אותה...", type: "textarea", minLength: 25 },
    ],
  },
  {
    id: "step-portfolio",
    number: 5,
    title: "אריזה עסקית לתיק עבודות ומשקיעים",
    subtitle: "הפיכת העבודה הטכנית להצעת ערך ברורה שמוכרת את היכולות שלך.",
    badgeName: "Market Ready",
    assetUnlocked: "עמוד תיק עבודות מלא מוכן לשיתוף",
    points: 15,
    fields: [
      { key: "portfolioPitch", label: "הצעת הערך שלך ללקוחות או שותפים", placeholder: "אני הופך רעיונות עסקיים למוצרי MVP עובדים תוך ימים...", type: "textarea", minLength: 20 },
      { key: "targetAudience", label: "מטרה עיקרית", placeholder: "בחר מטרה", type: "select", options: ["גיוס לקוחות לפיתוח פלטפורמות", "חיפוש משרה / שיתוף פעולה", "מציאת משקיעים למיזם"] },
    ],
  },
  {
    id: "step-community",
    number: 6,
    title: "פרסום בקיר הפידבק וחתימת אימות",
    subtitle: "שיתוף היצירה בקהילה לקבלת ביקורת בונה וחשיפה אורגנית.",
    badgeName: "Certified ProofCrafter",
    assetUnlocked: "תעודת הסמכה רשמית + כניסה לקיר הפידבק",
    points: 15,
    fields: [],
  },
];

export const DEFAULT_PROFILE: BuilderProfile = {
  fullName: "",
  headline: "",
  yearsWithAI: "מעל 3 שנים (חלוץ בתחום)",
  primaryTools: "",
  architectureCase: "",
  projectTitle: "",
  projectLiveUrl: "",
  projectProblemSolved: "",
  debuggingStory: "",
  portfolioPitch: "",
  targetAudience: "גיוס לקוחות לפיתוח פלטפורמות",
  shareOnFeed: true,
  completedStepIds: [],
  adminVerified: false,
  certificateId: "PC-2026-8841",
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = "proofcraft_builder_profile_v1";

export function loadBuilderProfile(): BuilderProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveBuilderProfile(profile: BuilderProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
  } catch {}
}
