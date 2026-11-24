import { StudioLang } from "./i18n-engine";

export interface StrategicTrackGuide {
  level: number;
  badge: string;
  name: string;
  tagline: string;
  priceIls: number;
  priceUsd: number;
  whoIsItFor: string;
  concreteDeliverable: string;
  careerAndMarketImpact: string;
  includedInFree: boolean;
  highlightFlagship?: boolean;
}

export const STRATEGIC_TRACK_GUIDES: StrategicTrackGuide[] = [
  {
    level: 1,
    badge: "FREE FOREVER · LAUNCHPAD",
    name: "Junior AI Builder (v1.0)",
    tagline: "Ship your first live conversion engine + public Verified Portfolio",
    priceIls: 0,
    priceUsd: 0,
    whoIsItFor: "Self-taught builders and creators ready to ship a real production web asset and launch a live portfolio at zero cost.",
    concreteDeliverable: "High-converting landing engine + instant lead workflow + public Verified Portfolio with Project #1 unlocked.",
    careerAndMarketImpact: "Gives you a live production URL to share with clients, recruiters, and founders immediately.",
    includedInFree: true,
  },
  {
    level: 2,
    badge: "CLOUD SAAS TIER · v2.0",
    name: "Full-Stack AI Builder",
    tagline: "Cloud PostgreSQL databases, Auth & Row-Level Security (RLS)",
    priceIls: 179,
    priceUsd: 49,
    whoIsItFor: "Builders transitioning from static pages to persistent multi-user SaaS applications and client portals.",
    concreteDeliverable: "Project #2 in Portfolio: Full-stack cloud SaaS backed by Supabase PostgreSQL and strict RLS policies.",
    careerAndMarketImpact: "Proves real backend data isolation and security engineering to hiring managers and B2B clients.",
    includedInFree: false,
  },
  {
    level: 3,
    badge: "AUTOMATION & PAYMENTS · v3.0",
    name: "Systems & Web3 Architect",
    tagline: "Cryptographic Webhooks, Payment Verification & Bot APIs",
    priceIls: 329,
    priceUsd: 89,
    whoIsItFor: "Consultants and freelancers building automated billing engines, real-time alerts, and API pipelines.",
    concreteDeliverable: "Project #3 in Portfolio: HMAC-verified payment route handlers, automated notifications, and edge protection.",
    careerAndMarketImpact: "Positions you as an end-to-end systems architect capable of handling revenue-critical infrastructure.",
    includedInFree: false,
  },
  {
    level: 4,
    badge: "FLAGSHIP CREDENTIAL · 4 LIVE PROJECTS",
    name: "Senior AI Systems Architect (v4.0)",
    tagline: "Complete 4-Project Verified Portfolio + Enterprise Multi-Tenant AI Copilot",
    priceIls: 549,
    priceUsd: 149,
    whoIsItFor: "Builders aiming for senior AI engineering roles, agency leadership, or enterprise software delivery.",
    concreteDeliverable: "Full 4/4 Production Portfolio (v1.0 + v2.0 + v3.0 + v4.0), Multi-Tenant RBAC, Audit Logs & Certified Credential.",
    careerAndMarketImpact: "The highest proof-of-execution credential on ProofCraft — showcasing full-spectrum engineering mastery.",
    includedInFree: false,
    highlightFlagship: true,
  },
];
export const STRATEGIC_TRACK_GUIDES_HE: StrategicTrackGuide[] = [
  {
    level: 1,
    badge: "חינם לנצח · מסלול הזנק",
    name: "בונה AI מתחיל (v1.0)",
    tagline: "השקת מערכת המרה חיה ראשונה + תיק עבודות ציבורי מאומת",
    priceIls: 0,
    priceUsd: 0,
    whoIsItFor: "מפתחים אוטודידקטים ויזמים שרוצים להעלות נכס אמיתי לאוויר ולפתוח תיק עבודות מאומת בחינם.",
    concreteDeliverable: "דף נחיתה ממיר + מנוע קליטת לידים + תיק עבודות ציבורי מאומת עם פרויקט #1 פתוח.",
    careerAndMarketImpact: "מעניק לך קישור חי בייצור שאפשר לשלוח ללקוחות, מגייסים ושותפים כבר היום.",
    includedInFree: true,
  },
  {
    level: 2,
    badge: "מדרגת SaaS בענן · v2.0",
    name: "מפתח AI Full-Stack",
    tagline: "מסדי נתונים PostgreSQL, אימות משתמשים והגנת RLS",
    priceIls: 179,
    priceUsd: 49,
    whoIsItFor: "בונים שעוברים מדפים סטטיים לאפליקציות SaaS רב-משתמשים ופורטלים עסקיים.",
    concreteDeliverable: "פרויקט #2 בתיק העבודות: אפליקציית ענן מלאה על גבי Supabase PostgreSQL ומדיניות RLS קשיחה.",
    careerAndMarketImpact: "מוכיח יכולת הנדסת אבטחה והפרדת נתונים אמיתית מול מנהלי פיתוח ולקוחות B2B.",
    includedInFree: false,
  },
  {
    level: 3,
    badge: "אוטומציה וסליקה · v3.0",
    name: "ארכיטקט מערכות ו-Webhooks",
    tagline: "אימות תשלומים קריפטוגרפי, Webhooks והתראות בזמן אמת",
    priceIls: 329,
    priceUsd: 89,
    whoIsItFor: "יועצים ופרילנסרים שבונים מנועי סליקה אוטומטיים, בוטים וצינורות API עסקיים.",
    concreteDeliverable: "פרויקט #3 בתיק העבודות: שרתי סליקה מאומתים בחתימת HMAC, אוטומציית התראות והגנת קצה.",
    careerAndMarketImpact: "ממצב אותך כארכיטקט מערכות מקצה לקצה המסוגל לנהל תשתיות הכנסה קריטיות.",
    includedInFree: false,
  },
  {
    level: 4,
    badge: "הסמכת הדגל · 4 מערכות חיות",
    name: "ארכיטקט מערכות AI בכיר (v4.0)",
    tagline: "תיק עבודות מלא של 4 פרויקטים + AI Copilot ארגוני רב-דיירים",
    priceIls: 549,
    priceUsd: 149,
    whoIsItFor: "בונים שמכוונים לתפקידי AI בכירים, ניהול סוכנות פיתוח או אספקת תוכנה לארגונים.",
    concreteDeliverable: "תיק עבודות 4/4 מלא (v1.0–v4.0), הרשאות RBAC רב-ארגוניות, יומן ביקורת ותעודת בוגר מוסמך.",
    careerAndMarketImpact: "תעודת ההוכחה הגבוהה ביותר ב-ProofCraft — מציגה שליטה הנדסית מלאה מקצה לקצה.",
    includedInFree: false,
    highlightFlagship: true,
  },
];

export function getStrategicTrackGuides(lang: StudioLang): StrategicTrackGuide[] {
  return lang === "he" ? STRATEGIC_TRACK_GUIDES_HE : STRATEGIC_TRACK_GUIDES;
}
