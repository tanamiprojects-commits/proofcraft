export interface VaultQuickTemplate {
  id: string; persona: "dev" | "personal"; projectScale?: "mvp" | "enterprise";
  labelHe: string; labelEn: string;
  category: "crypto_seed" | "api_secrets" | "passwords" | "project_memory";
  targetAsset: string; originSource: string; purposeHe: string; purposeEn: string; actionUrl: string;
}

export const VAULT_QUICK_TEMPLATES: VaultQuickTemplate[] = [
  { id: "p-bank", persona: "personal", labelHe: "בנק / כרטיס אשראי", labelEn: "Bank / Credit Card", category: "passwords", targetAsset: "חשבון בנק ראשי", originSource: "אפליקציית הבנק / סניף", purposeHe: "גישה מאובטחת לניהול חשבון, העברות ודוחות פיננסיים", purposeEn: "Secure access to banking, transfers & statements", actionUrl: "" },
  { id: "p-google", persona: "personal", labelHe: "חשבון Google / אימייל ראשי", labelEn: "Google / Primary Email", category: "passwords", targetAsset: "Google Account & Drive", originSource: "אימות דו-שלבי + קודי גיבוי", purposeHe: "מפתח השחזור המרכזי לכל השירותים והאפליקציות הרשומות", purposeEn: "Master recovery identity for connected apps", actionUrl: "https://google.com" },
  { id: "p-gov", persona: "personal", labelHe: "אזור אישי ממשלתי / קופ״ח", labelEn: "Gov Portal / Health Fund", category: "passwords", targetAsset: "Gov.il / בריאות וביטוח", originSource: "הזדהות לאומית + קוד חד-פעמי", purposeHe: "צפייה במסמכים רפואיים, ביטוח לאומי ואישורים רשמיים", purposeEn: "Access medical records, tax & official certificates", actionUrl: "https://my.gov.il" },
  { id: "p-crypto", persona: "personal", labelHe: "ארנק קריפטו (12/24 מילים)", labelEn: "Crypto Wallet (12/24 Words)", category: "crypto_seed", targetAsset: "Ledger / MetaMask / Trust", originSource: "הופק בעת יצירת הארנק החדש", purposeHe: "ביטוי שחזור קריפטוגרפי מלא לשליטה בנכסים דיגיטליים", purposeEn: "Master cryptographic seed phrase for digital assets", actionUrl: "https://etherscan.io" },
  { id: "d-supa", persona: "dev", projectScale: "mvp", labelHe: "Supabase DB & Auth Keys", labelEn: "Supabase DB & Auth Keys", category: "api_secrets", targetAsset: "Production Database & RLS", originSource: "Supabase -> Settings -> API", purposeHe: "חיבור מסד הנתונים, אימות משתמשים והרשאות שרת", purposeEn: "Database connection, user auth & server service role", actionUrl: "https://supabase.com" },
  { id: "d-vercel", persona: "dev", projectScale: "mvp", labelHe: "Vercel Deploy & Env Secrets", labelEn: "Vercel Deploy & Env Secrets", category: "api_secrets", targetAsset: "Cloud Hosting & Edge", originSource: "Vercel -> Project -> Settings -> Env", purposeHe: "פריסת האפליקציה לייצור וניהול משתני סביבה מוצפנים", purposeEn: "Production deployment & encrypted environment variables", actionUrl: "https://vercel.com" },
  { id: "d-cf", persona: "dev", projectScale: "enterprise", labelHe: "Cloudflare DNS & SSL API", labelEn: "Cloudflare DNS & SSL API", category: "api_secrets", targetAsset: "Domain Routing & Security", originSource: "Cloudflare -> My Profile -> API Tokens", purposeHe: "ניהול רשומות דומיין, תת-דומיינים והגנת תעבורה", purposeEn: "Manage domain DNS records, subdomains & SSL routing", actionUrl: "https://cloudflare.com" },
  { id: "d-ai", persona: "dev", projectScale: "enterprise", labelHe: "מפתח AI / Stripe Payments", labelEn: "AI Model / Stripe Webhook Key", category: "api_secrets", targetAsset: "Core AI & Billing Engine", originSource: "Developer Console -> API Keys", purposeHe: "הפעלת מנועי בינה מלאכותית וסליקת תשלומים מאובטחת", purposeEn: "Power AI inference pipelines & payment webhooks", actionUrl: "" }
];

export const PERSONAL_CIPHER_CLUES: { he: string; en: string }[] = [
  { he: "נוסחת זיכרון: תאריך הלידה של חיית המחמד הראשונה + 4 ספרות אחרונות של הטלפון הישן", en: "Memory Formula: First pet birth date + last 4 digits of old phone" },
  { he: "נוסחת זיכרון: שם הרחוב הראשון שגרתי בו הפוך + שנת סיום התיכון + סימן !", en: "Memory Formula: First street name reversed + graduation year + !" },
  { he: "נוסחת זיכרון: ראשי תיבות של השיר האהוב עליי + יום ההולדת של הילד הבכור", en: "Memory Formula: Initials of favorite song + oldest child birthday" },
  { he: "נוסחת זיכרון: הדגם של הרכב הראשון + שנת הרכישה + אות ראשונה של שם האם", en: "Memory Formula: First car model + purchase year + mother initial" },
  { he: "נוסחת זיכרון: שם היעד הראשון בחו״ל + חודש הלידה שלי + 3 אותיות ראשונות של האתר", en: "Memory Formula: First abroad trip + my birth month + first 3 letters of site" },
  { he: "נוסחת זיכרון: הסיסמה הקבועה שלי + הספרה האחרונה של תעודת הזהות + קידומת העיר", en: "Memory Formula: Base personal phrase + last ID digit + city area code" }
];

export function generateStrongPassword(length = 20): string {
  return generateCustomPassword(length, true, true);
}

export function generateCustomPassword(length = 20, useNumbers = true, useSymbols = true): string {
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  if (useNumbers) chars += "23456789";
  if (useSymbols) chars += "!@#$%^&*_-+=";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}
