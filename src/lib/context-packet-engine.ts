import { ContextStudioConfig, PacketCategory, SmartAssetRecommendation, SupportedLang } from './context-packet-types';
export * from './context-packet-types';

export const DEFAULT_ECOSYSTEM_RECOMMENDATIONS: SmartAssetRecommendation[] = [
  {
    id: 'vault-secret-guard',
    triggerKeywords: ['API_KEY', 'SECRET', 'TOKEN', 'SUPABASE_', 'Bearer ', 'sk-', 'password', 'סיסמה', '.env'],
    titleHe: 'זוהו מפתחות או סודות בפלט — שמור אותם בכספת Zero-Knowledge',
    titleEn: 'Secrets detected — Store safely in Zero-Knowledge Vault',
    descHe: 'הצפנה מקומית בדפדפן (AES-GCM) וייצוא שורות .env בלחיצה ללא חשיפה בשרת.',
    descEn: 'Client-side AES-GCM encryption and 1-click .env export with zero server exposure.',
    href: '/vault',
    badgeHe: 'אבטחת מפתחים',
    badgeEn: 'Developer Security',
    enabled: true,
  },
  {
    id: 'proofcraft-portfolio-sync',
    triggerKeywords: ['npm run build', 'git commit', 'deployed', 'vercel', 'LOCKED', 'הושלם', 'הצלחה'],
    titleHe: 'סיימת שלב בנייה? תעד אותו כראיית ביצוע מאומתת בתיק העבודות',
    titleEn: 'Finished a build milestone? Log it as verified Proof-of-Execution',
    descHe: 'הפוך את ההתקדמות הטכנית שלך לאסמכתא מקצועית חתומה ב-/portfolio.',
    descEn: 'Turn your technical milestone into a verified credential in /portfolio.',
    href: '/portfolio',
    badgeHe: 'תיק עבודות מאומת',
    badgeEn: 'Verified Portfolio',
    enabled: true,
  },
  {
    id: 'tanami360-toolkit-sync',
    triggerKeywords: ['form', 'טופס', 'lead', 'אוטומציה', 'automation', 'SaaS', 'workspace'],
    titleHe: 'רוצה לחבר טפסים חכמים או מרחב עבודה? המשך ב-Workspace & Tanami360',
    titleEn: 'Connect smart forms or workspace? Continue in Workspace & Tanami360',
    descHe: 'כלי AI משולבים לבניית טפסים, אוטומציה וניהול פרויקטים דיגיטליים.',
    descEn: 'Integrated AI tools for smart forms, automation, and project workflows.',
    href: '/workspace',
    badgeHe: 'מרחב עבודה מסונכרן',
    badgeEn: 'Synced Workspace',
    enabled: true,
  },
];

export const DEFAULT_STUDIO_CONFIG: ContextStudioConfig = {
  enabled: true,
  defaultChunkLimit: 12000,
  autoDetectLanguage: true,
  enableSmartEcosystemLinks: true,
  recommendations: DEFAULT_ECOSYSTEM_RECOMMENDATIONS,
};

export const CATEGORY_META: Record<PacketCategory, {
  labelHe: string; labelEn: string; fileHeaderHe: string; fileHeaderEn: string;
  filePrefix: string; aiDirectiveHe: string; aiDirectiveEn: string;
}> = {
  terminal_output: {
    labelHe: 'פלט שהתקבל לאחר הרצת פקודה בפאוורשל / טרמינל',
    labelEn: 'Output Received After Running PowerShell / Terminal Command',
    fileHeaderHe: 'פלט שהתקבל לאחר הרצת פקודה בפאוורשל / טרמינל',
    fileHeaderEn: 'Output Received After Running PowerShell / Terminal Command',
    filePrefix: 'terminal-output',
    aiDirectiveHe: 'נתח את פלט הטרמינל. אם יש שגיאה, ספק פקודת PowerShell קצרה לתיקון (UTF-8 without BOM, עם Here-Strings) או קובץ מלא ללא קיצורים.',
    aiDirectiveEn: 'Analyze the terminal output. If an error exists, provide a concise PowerShell fix (UTF-8 without BOM, Here-Strings) or full file replacement.',
  },
  build_debug: {
    labelHe: 'שגיאת בנייה / קוד מקור לניתוח ותיקון מלא',
    labelEn: 'Build Error / Source Code for Full Analysis & Fix',
    fileHeaderHe: 'קובץ הקשר טכני לניתוח קוד ותיקון שגיאות בנייה',
    fileHeaderEn: 'Technical Context Packet for Code Analysis & Build Fix',
    filePrefix: 'build-debug',
    aiDirectiveHe: 'עבור על הקוד ולוג הבנייה. החזר פתרון מדויק עם תכולת קובץ מלאה להעתקה ישירה ללא קיצורים.',
    aiDirectiveEn: 'Review the source code and build log. Return an exact fix with complete file contents ready for copy-paste.',
  },
  master_handoff: {
    labelHe: 'מסמך העברת הקשר הנדסי (פתיחת חלון שיחה חדש)',
    labelEn: 'Engineering Context Handoff Document (New Chat Session)',
    fileHeaderHe: 'מסמך העברת הקשר הנדסי מלא — המשך רצף פיתוח',
    fileHeaderEn: 'Full Engineering Context Handoff — Development Continuity',
    filePrefix: 'master-handoff',
    aiDirectiveHe: 'קלוט את מלוא ההקשר ההנדסי המצורף והמשך ברצף ישירות מהשלב הבא ללא בנייה מחדש מאפס.',
    aiDirectiveEn: 'Ingest the full engineering context below and continue sequentially from the next step without rebuilding.',
  },
  methodology_stage: {
    labelHe: 'תוצר שלב בשיטת ProofCraft (שלבים 1–6)',
    labelEn: 'ProofCraft Methodology Stage Deliverable (Stages 1–6)',
    fileHeaderHe: 'חבילת ביצוע והוכחת יכולת — שיטת ProofCraft',
    fileHeaderEn: 'Execution & Proof-of-Skill Packet — ProofCraft Methodology',
    filePrefix: 'proofcraft-stage',
    aiDirectiveHe: 'בצע בקרת איכות מקצועית על תוצר השלב בשיטת ProofCraft, וודא אבטחה (RLS) וחוויית משתמש, והכן את השלב הבא.',
    aiDirectiveEn: 'Perform a professional QA review on this ProofCraft stage deliverable, verify security (RLS) and UX, and prepare the next stage.',
  },
  structured_prompt: {
    labelHe: 'פקודה מובנית / ספריית פרומפטים לביצוע מדויק',
    labelEn: 'Structured Command / Prompt Packet for Exact Execution',
    fileHeaderHe: 'קובץ הוראות ופקודה מובנית לעיבוד על ידי AI',
    fileHeaderEn: 'Structured Instructions & Command Packet for AI Processing',
    filePrefix: 'ai-command-packet',
    aiDirectiveHe: 'פעל בדיוק לפי ההנחיות, האילוצים והמבנה המוגדרים בקובץ זה ללא חריגה.',
    aiDirectiveEn: 'Execute strictly according to the instructions, constraints, and structure defined in this packet.',
  },
};

export function detectLanguageFromText(text: string, fallback: SupportedLang = 'he'): SupportedLang {
  const sample = text.slice(0, 1500);
  const he = (sample.match(/[\u0590-\u05FF]/g) || []).length;
  const en = (sample.match(/[a-zA-Z]/g) || []).length;
  if (he === 0 && en === 0) return fallback;
  return he >= en * 0.25 ? 'he' : 'en';
}

export function sanitizeTerminalOutput(raw: string): { cleaned: string; maskedSecretsCount: number } {
  let cleaned = raw.replace(/\x1B\[[0-9;]*[mGKHF]/g, '');
  let maskedSecretsCount = 0;
  cleaned = cleaned.replace(
    /((?:API_KEY|SECRET|TOKEN|PASSWORD|SERVICE_ROLE_KEY)\s*[=:]\s*['"]?)([A-Za-z0-9_\-\.]{16,})(['"]?)/gi,
    (_m, p1, _secret, p3) => { maskedSecretsCount += 1; return `${p1}[REDACTED_USE_PROOF_VAULT]${p3}`; }
  );
  return { cleaned: cleaned.trim(), maskedSecretsCount };
}

export function matchSmartRecommendations(rawText: string, recs: SmartAssetRecommendation[]): SmartAssetRecommendation[] {
  const lower = rawText.toLowerCase();
  return recs.filter((r) => r.enabled && r.triggerKeywords.some((kw) => lower.includes(kw.toLowerCase())));
}

export interface GeneratedPacket {
  partIndex: number; totalParts: number; filename: string; content: string; charCount: number; estimatedTokens: number;
}

export function buildContextPackets(params: {
  rawInput: string; category: PacketCategory; lang: SupportedLang;
  projectTitle?: string; stageLabel?: string; chunkLimit?: number; maskSecrets?: boolean;
}) {
  const { rawInput, category, lang, projectTitle = 'ProofCraft & Tanami360', stageLabel = '', chunkLimit = 12000, maskSecrets = false } = params;
  const { cleaned, maskedSecretsCount } = maskSecrets
    ? sanitizeTerminalOutput(rawInput)
    : { cleaned: rawInput.replace(/\x1B\[[0-9;]*[mGKHF]/g, '').trim(), maskedSecretsCount: 0 };

  const safeText = cleaned || (lang === 'he' ? '(טרם הודבק תוכן)' : '(No content pasted yet)');
  const meta = CATEGORY_META[category];
  const dateStamp = new Date().toISOString().slice(0, 10);

  const chunks: string[] = [];
  if (safeText.length <= chunkLimit) {
    chunks.push(safeText);
  } else {
    let cursor = 0;
    while (cursor < safeText.length) {
      let end = Math.min(cursor + chunkLimit, safeText.length);
      if (end < safeText.length) {
        const nl = safeText.lastIndexOf('\n', end);
        if (nl > cursor + chunkLimit * 0.6) end = nl;
      }
      chunks.push(safeText.slice(cursor, end));
      cursor = end;
    }
  }

  const totalParts = chunks.length;
  const packets: GeneratedPacket[] = chunks.map((chunk, idx) => {
    const partNum = idx + 1;
    const isMulti = totalParts > 1;
    const headerTitle = lang === 'he' ? meta.fileHeaderHe : meta.fileHeaderEn;
    const directive = lang === 'he' ? meta.aiDirectiveHe : meta.aiDirectiveEn;
    const partBanner = isMulti
      ? (lang === 'he'
          ? `\n> **חלק ${partNum} מתוך ${totalParts}** — ${partNum < totalParts ? 'המתן לחלק הבא לפני תחילת הביצוע.' : 'חלק אחרון — בצע את ההנחיה במלואה.'}`
          : `\n> **Part ${partNum} of ${totalParts}** — ${partNum < totalParts ? 'Wait for the next part before executing.' : 'Final part — execute the directive completely.'}`)
      : '';
    const stageLine = stageLabel ? (lang === 'he' ? `- **שלב בשיטה:** ${stageLabel}\n` : `- **Stage:** ${stageLabel}\n`) : '';
    const content = lang === 'he'
      ? `# 📋 ${headerTitle}\n\n- **פרויקט:** ${projectTitle}\n${stageLine}- **תאריך:** ${dateStamp}\n- **סיווג:** \`${meta.filePrefix}\`${partBanner}\n\n## 🎯 הנחיית ביצוע לצ'אט החכם\n${directive}\n\n## 📦 תוכן הפלט המלא\n\`\`\`text\n${chunk}\n\`\`\`\n`
      : `# 📋 ${headerTitle}\n\n- **Project:** ${projectTitle}\n${stageLine}- **Date:** ${dateStamp}\n- **Type:** \`${meta.filePrefix}\`${partBanner}\n\n## 🎯 AI Execution Directive\n${directive}\n\n## 📦 Full Output Payload\n\`\`\`text\n${chunk}\n\`\`\`\n`;

    return {
      partIndex: partNum,
      totalParts,
      filename: isMulti ? `${meta.filePrefix}-${dateStamp}-part-${partNum}-of-${totalParts}.md` : `${meta.filePrefix}-${dateStamp}.md`,
      content,
      charCount: content.length,
      estimatedTokens: Math.ceil(content.length / 3.5),
    };
  });

  return {
    packets,
    totalChars: packets.reduce((a, p) => a + p.charCount, 0),
    estimatedTokens: packets.reduce((a, p) => a + p.estimatedTokens, 0),
    maskedSecretsCount,
  };
}