export function sanitizePlainText(input: string, maxLength = 300): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/javascript:|data:|vbscript:/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeCodeArtifact(input: string, maxLength = 2500): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeExternalUrl(rawUrl: string): { valid: boolean; cleanUrl: string; error?: string } {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) return { valid: false, cleanUrl: "", error: "נא להזין כתובת אתר תקינה." };
  if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
    return { valid: false, cleanUrl: "", error: "פרוטוקול קישור חסום מטעמי אבטחה." };
  }
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProto);
    if (parsed.protocol !== "https:") {
      return { valid: false, cleanUrl: "", error: "מטעמי אבטחה, מותרים קישורים מאובטחים (HTTPS) בלבד." };
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.startsWith("10.")) {
      return { valid: false, cleanUrl: "", error: "לא ניתן לפרסם כתובות רשת מקומית פנימית." };
    }
    if (!host.includes(".")) {
      return { valid: false, cleanUrl: "", error: "נא להזין שם דומיין מלא ותקין." };
    }
    if (/\.(exe|bat|cmd|msi|scr|ps1|vbs|zip|rar|7z|dmg|apk)$/i.test(parsed.pathname)) {
      return { valid: false, cleanUrl: "", error: "חל איסור על קישורים להורדת קבצים." };
    }
    return { valid: true, cleanUrl: parsed.toString() };
  } catch {
    return { valid: false, cleanUrl: "", error: "מבנה הקישור אינו תקין." };
  }
}

export function checkClientRateLimit(actionKey: string, cooldownMs: number): { allowed: boolean; waitSec: number } {
  if (typeof window === "undefined") return { allowed: true, waitSec: 0 };
  const last = Number(localStorage.getItem(`pc_rl_${actionKey}`) || "0");
  const diff = Date.now() - last;
  if (diff < cooldownMs) {
    return { allowed: false, waitSec: Math.ceil((cooldownMs - diff) / 1000) };
  }
  localStorage.setItem(`pc_rl_${actionKey}`, String(Date.now()));
  return { allowed: true, waitSec: 0 };
}
