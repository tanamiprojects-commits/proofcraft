export interface VaultQuickTemplate {
  id: string; group: "dev" | "daily"; labelHe: string; labelEn: string;
  category: "crypto_seed" | "api_secrets" | "passwords" | "project_memory";
  targetAsset: string; originSource: string; actionUrl: string;
}

export const VAULT_QUICK_TEMPLATES: VaultQuickTemplate[] = [
  { id: "t-crypto", group: "daily", labelHe: "ארנק קריפטו (12/24 מילים)", labelEn: "Crypto Wallet (12/24 Seed)", category: "crypto_seed", targetAsset: "Ledger / MetaMask / Trust", originSource: "הופק בעת יצירת הארנק", actionUrl: "https://etherscan.io" },
  { id: "t-bank", group: "daily", labelHe: "בנק / חשבון פיננסי", labelEn: "Bank / Financial Account", category: "passwords", targetAsset: "חשבון בנק ראשי", originSource: "סניף / אפליקציית הבנק", actionUrl: "" },
  { id: "t-google", group: "daily", labelHe: "חשבון Google / Gmail", labelEn: "Google / Gmail Account", category: "passwords", targetAsset: "Google Workspace & YouTube", originSource: "אימות דו-שלבי + קודי גיבוי", actionUrl: "https://google.com" },
  { id: "t-gov", group: "daily", labelHe: "אזור אישי ממשלתי / קופת חולים", labelEn: "Gov Portal / Health Fund", category: "passwords", targetAsset: "Gov.il / ביטוח לאומי", originSource: "רישום עם ת.ז. וקוד חד-פעמי", actionUrl: "https://my.gov.il" },
  { id: "t-supa", group: "dev", labelHe: "Supabase DB & API Keys", labelEn: "Supabase DB & API Keys", category: "api_secrets", targetAsset: "Production Database", originSource: "Supabase Project Settings -> API", actionUrl: "https://supabase.com" },
  { id: "t-vercel", group: "dev", labelHe: "Vercel Env & Deploy Token", labelEn: "Vercel Env & Deploy Token", category: "api_secrets", targetAsset: "Vercel Cloud Hosting", originSource: "Vercel Dashboard -> Settings -> Tokens", actionUrl: "https://vercel.com" },
  { id: "t-github", group: "dev", labelHe: "GitHub PAT & SSH Recovery", labelEn: "GitHub PAT & SSH Recovery", category: "api_secrets", targetAsset: "GitHub Repositories", originSource: "GitHub -> Settings -> Developer Settings", actionUrl: "https://github.com" },
  { id: "t-cf", group: "dev", labelHe: "Cloudflare DNS & API", labelEn: "Cloudflare DNS & API", category: "api_secrets", targetAsset: "Domain DNS & SSL", originSource: "Cloudflare -> My Profile -> API Tokens", actionUrl: "https://cloudflare.com" }
];
export const PERSONAL_CIPHER_CLUES: { he: string; en: string }[] = [
  { he: "רמז אישי: תאריך הלידה של חיית המחמד הראשונה + 4 ספרות אחרונות של הטלפון הישן", en: "Personal Clue: First pet's birth date + last 4 digits of old phone" },
  { he: "רמז אישי: שם הרחוב הראשון שגרתי בו הפוך + שנת סיום התיכון + סימן !", en: "Personal Clue: First street name reversed + graduation year + !" },
  { he: "רמז אישי: ראשי תיבות של השיר האהוב עליי + יום ההולדת של הילד הבכור", en: "Personal Clue: Initials of favorite song + oldest child's birthday" },
  { he: "רמז אישי: שם המורה האהוב/ה + מספר הבית הראשון + קידומת העיר", en: "Personal Clue: Favorite teacher's name + first house number + city code" },
  { he: "רמז אישי: הדגם של הרכב הראשון + שנת הרכישה + אות ראשונה של שם האם", en: "Personal Clue: First car model + purchase year + mother's initial" },
  { he: "רמז אישי: שם המקום שבו טיילתי לראשונה בחו״ל + חודש הלידה שלי", en: "Personal Clue: First abroad destination + my birth month" },
  { he: "רמז אישי: הסיסמה הקבועה שלי בתוספת 3 האותיות הראשונות של שם האתר", en: "Personal Clue: Base passphrase + first 3 letters of the website name" },
  { he: "רמז אישי: שנת הלידה של סבא/סבתא + שם המאכל האהוב עליי באנגלית", en: "Personal Clue: Grandparent birth year + favorite food in English" },
  { he: "רמז אישי: מספר המזל שלי כפול 3 + שם החבר הכי טוב מהילדות", en: "Personal Clue: Lucky number x3 + childhood best friend's name" },
  { he: "רמז אישי: שם הספר שהשפיע עליי + 4 הספרות האמצעיות של תעודת הזהות הישנה", en: "Personal Clue: Favorite book title + middle 4 digits of old ID" }
];

export function generateStrongPassword(length = 20): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  return out;
}