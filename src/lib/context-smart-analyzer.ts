export type SurgicalFilterMode = "full_with_summary" | "errors_only" | "assets_only" | "clean_compact";

export interface ExtractedAsset {
  kind: "secret" | "email" | "url" | "file";
  labelHe: string;
  labelEn: string;
  value: string;
}

export interface SmartAnalysisReport {
  detectedKindHe: string;
  detectedKindEn: string;
  explanationHe: string;
  explanationEn: string;
  errorLines: string[];
  assets: ExtractedAsset[];
  filteredText: string;
  originalLineCount: number;
  filteredLineCount: number;
  savedPercent: number;
  executiveBriefHe: string;
  executiveBriefEn: string;
}

export async function validateAndInspectMediaFile(file: File, isHe: boolean): Promise<{ ok: boolean; error?: string; summaryText?: string }> {
  const name = file.name.toLowerCase();
  if (/\.(exe|bat|cmd|sh|ps1|dll|msi|vbs|scr)$/i.test(name)) {
    return { ok: false, error: isHe ? "קובץ הרצה נחסם מטעמי אבטחה." : "Executable file blocked for security." };
  }
  const isImg = /\.(png|jpe?g|webp)$/i.test(name);
  const isVid = /\.(mp4|webm|mov)$/i.test(name);
  if (!isImg && !isVid) {
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: isHe ? "קובץ טקסט חורג מ-5MB." : "Text file exceeds 5MB limit." };
    const headBuf = await file.slice(0, 512).arrayBuffer();
    const bytes = new Uint8Array(headBuf);
    if (bytes.includes(0)) return { ok: false, error: isHe ? "זוהה קובץ בינארי לא נתמך." : "Unsupported binary file blocked." };
    return { ok: true };
  }
  if (file.size > 25 * 1024 * 1024) return { ok: false, error: isHe ? "קובץ מדיה חורג מ-25MB." : "Media file exceeds 25MB limit." };
  const sigBuf = await file.slice(0, 12).arrayBuffer();
  const b = new Uint8Array(sigBuf);
  const validPng = b.at(0) === 0x89 && b.at(1) === 0x50 && b.at(2) === 0x4E && b.at(3) === 0x47;
  const validJpg = b.at(0) === 0xFF && b.at(1) === 0xD8 && b.at(2) === 0xFF;
  const validWebp = b.at(0) === 0x52 && b.at(1) === 0x49 && b.at(2) === 0x46 && b.at(3) === 0x46;
  const validMp4 = b.at(4) === 0x66 && b.at(5) === 0x74 && b.at(6) === 0x79 && b.at(7) === 0x70;
  const validWebm = b.at(0) === 0x1A && b.at(1) === 0x45 && b.at(2) === 0xDF && b.at(3) === 0xA3;
  if ((isImg && !validPng && !validJpg && !validWebp) || (isVid && !validMp4 && !validWebm)) {
    return { ok: false, error: isHe ? "חתימת הקובץ אינה תואמת לסיומת — נחסם להגנה." : "File signature mismatch — blocked by security shield." };
  }
  const objUrl = URL.createObjectURL(file);
  try {
    if (isImg) {
      return await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 24; canvas.height = 24;
          const ctx = canvas.getContext("2d");
          const hexSet = new Set<string>();
          if (ctx) {
            ctx.drawImage(img, 0, 0, 24, 24);
            const px = ctx.getImageData(0, 0, 24, 24).data;
            for (let i = 0; i < px.length; i += 64) {
              const hex = `#${[px[i], px[i + 1], px[i + 2]].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
              if (hexSet.size < 5) hexSet.add(hex);
            }
          }
          const ratio = img.width > img.height ? "Landscape (16:9)" : img.height > img.width ? "Vertical (9:16 Reels/Story)" : "Square (1:1)";
          URL.revokeObjectURL(objUrl);
          resolve({
            ok: true,
            summaryText: `[IMAGE SPECIFICATION]\nFile: ${file.name}\nResolution: ${img.width}x${img.height}px (${ratio})\nSize: ${(file.size / 1024).toFixed(1)} KB\nDominant Palette (HEX): ${Array.from(hexSet).join(", ")}\nEXIF Privacy Note: Strip metadata before public upload.`,
          });
        };
        img.onerror = () => { URL.revokeObjectURL(objUrl); resolve({ ok: false, error: isHe ? "תמונה פגומה." : "Corrupted image." }); };
        img.src = objUrl;
      });
    }
    return await new Promise((resolve) => {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.onloadedmetadata = () => {
        const ratio = vid.videoHeight > vid.videoWidth ? "Vertical 9:16 (TikTok / Reels Ready)" : "Horizontal 16:9 (YouTube / Web)";
        const dur = Math.round(vid.duration || 0);
        URL.revokeObjectURL(objUrl);
        resolve({
          ok: true,
          summaryText: `[VIDEO SPECIFICATION]\nFile: ${file.name}\nResolution: ${vid.videoWidth}x${vid.videoHeight}px (${ratio})\nDuration: ${dur}s | Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB\nDistribution Fit: ${vid.videoHeight > vid.videoWidth ? "Ideal for Track 1 Reels/TikTok Affiliate Funnels" : "Ideal for Tutorial & Landing Page Embed"}`,
        });
      };
      vid.onerror = () => { URL.revokeObjectURL(objUrl); resolve({ ok: false, error: isHe ? "סרטון לא תקין." : "Invalid video." }); };
      vid.src = objUrl;
    });
  } catch {
    URL.revokeObjectURL(objUrl);
    return { ok: false, error: isHe ? "שגיאה בבדיקת הקובץ." : "File inspection error." };
  }
}
export function analyzeAndFilterContext(raw: string, mode: SurgicalFilterMode): SmartAnalysisReport {
  const cleanAnsi = raw.replace(/\x1b\[[0-9;]*m/g, "");
  const lines = cleanAnsi.split(/\r?\n/);
  const originalLineCount = lines.length;

  const errorRegex = /(error\s*ts\d+|error:|failed|exception|turbopack build failed|cannot find|module not found|syntaxerror|typeerror|exited with 1)/i;
  const secretRegex = /(?:SUPABASE_[A-Z0-9_]+|API_KEY|SECRET|TOKEN|PASSWORD|Bearer\s+[A-Za-z0-9._-]+|sk-[A-Za-z0-9]{16,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+)/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const urlRegex = /https?:\/\/[^\s"'<>`)]+/g;
  const fileRegex = /(?:src|app|components|lib)[\\/][a-zA-Z0-9_.\-\\/]+\.(?:tsx?|jsx?|css|json|sql|md)/g;

  const errorLines: string[] = [];
  const errorIndices = new Set<number>();
  const assets: ExtractedAsset[] = [];
  const seenAssets = new Set<string>();

  const pushAsset = (kind: ExtractedAsset["kind"], labelHe: string, labelEn: string, val: string) => {
    const clean = val.trim().slice(0, 160);
    if (!clean || seenAssets.has(`${kind}:${clean}`) || assets.length >= 45) return;
    seenAssets.add(`${kind}:${clean}`);
    assets.push({ kind, labelHe, labelEn, value: clean });
  };

  lines.forEach((ln, idx) => {
    const t = ln.trim();
    if (!t) return;
    if (errorRegex.test(t)) {
      if (errorLines.length < 25) errorLines.push(`L${idx + 1}: ${t.slice(0, 180)}`);
      for (let w = Math.max(0, idx - 3); w <= Math.min(lines.length - 1, idx + 4); w++) errorIndices.add(w);
    }
    (t.match(secretRegex) || []).forEach((m) => pushAsset("secret", "מפתח / טוקן רגיש", "Secret / Token", m));
    (t.match(emailRegex) || []).forEach((m) => pushAsset("email", "כתובת אימייל", "Email Address", m));
    (t.match(urlRegex) || []).forEach((m) => pushAsset("url", "קישור / URL", "URL / Endpoint", m));
    (t.match(fileRegex) || []).forEach((m) => pushAsset("file", "קובץ מערכת", "Source File", m.replace(/\\/g, "/")));
  });

  const isMedia = cleanAnsi.startsWith("[IMAGE SPECIFICATION]") || cleanAnsi.startsWith("[VIDEO SPECIFICATION]");
  const hasPs = /PS\s+[A-Z]:\\/i.test(cleanAnsi) || /npm run build/i.test(cleanAnsi);
  const hasCode = /import\s+.*from\s+["']|export\s+(default\s+)?function|const\s+\w+\s*=/m.test(cleanAnsi);
  const secretsCount = assets.filter((a) => a.kind === "secret").length;

  const detectedKindHe = isMedia ? "מפרט מדיה מנותח (תמונה / סרטון)" : errorLines.length > 0 ? "לוג שגיאות ובנייה" : hasPs ? "פלט טרמינל ופקודות מערכת" : hasCode ? "קוד מקור וארכיטקטורה" : "מסמך הקשר או נתונים";
  const detectedKindEn = isMedia ? "Analyzed Media Specification (Image / Video)" : errorLines.length > 0 ? "Build / Runtime Error Log" : hasPs ? "Terminal & CLI Output" : hasCode ? "Source Code Architecture" : "Context Document or Data";

  const explanationHe = errorLines.length > 0
    ? `אותרו ${errorLines.length} שורות שגיאה מתוך ${originalLineCount.toLocaleString()} שורות. בחר בסינון "רק שגיאות" כדי להעביר לצ׳אט החכם בדיוק את שורש התקלה.`
    : secretsCount > 0
      ? `אותרו ${secretsCount} מפתחות או טוקנים רגישים! הם יוסתרו אוטומטית בהעתקה לצ׳אט, ומומלץ לשמור אותם בכספת המוצפנת (/vault).`
      : `התוכן נסרק ונארז עם תקציר מנהלים מובנה כדי שהצ׳אט החכם יבין את כל ההקשר בשנייה.`;

  const explanationEn = errorLines.length > 0
    ? `Detected ${errorLines.length} error line(s) across ${originalLineCount.toLocaleString()} lines. Use "Errors Only" filter for instant root-cause resolution.`
    : secretsCount > 0
      ? `Found ${secretsCount} sensitive key(s)/token(s). They are auto-masked before AI export—store them in the Encrypted Vault.`
      : `Content structured with an executive summary header for immediate AI comprehension.`;

  let outLines: string[] = lines;
  if (mode === "errors_only") {
    outLines = errorIndices.size > 0
      ? Array.from(errorIndices).sort((a, b) => a - b).map((i) => `${i + 1} | ${lines[i]}`)
      : lines.filter((l) => l.trim().length > 0).slice(0, 120);
  } else if (mode === "assets_only") {
    outLines = assets.length > 0 ? assets.map((a) => `[${a.labelEn}] ${a.value}`) : ["No secrets, emails, URLs, or file paths detected."];
  } else if (mode === "clean_compact") {
    const seen = new Set<string>();
    outLines = lines.filter((l) => {
      const tr = l.trim();
      if (!tr || (tr.length > 15 && seen.has(tr))) return false;
      seen.add(tr);
      return true;
    });
  }

  const filteredText = outLines.join("\n");
  const filteredLineCount = outLines.length;
  const savedPercent = originalLineCount > 0 ? Math.max(0, Math.round((1 - filteredLineCount / originalLineCount) * 100)) : 0;

  const executiveBriefHe = [
    `### ניתוח הקשר וסיכום מנהלים אוטומטי`,
    `- **סוג הפלט:** ${detectedKindHe}`,
    `- **היקף:** ${originalLineCount.toLocaleString()} שורות → **בפלט המסונן:** ${filteredLineCount.toLocaleString()} שורות (חיסכון של ${savedPercent}%)`,
    `- **פרטים שחולצו:** ${assets.length} פריטים (מפתחות: ${secretsCount}, קבצים: ${assets.filter((a) => a.kind === "file").length}, קישורים: ${assets.filter((a) => a.kind === "url").length})`,
    errorLines.length > 0 ? `- **שגיאות שאותרו (${errorLines.length}):**\n  - ${errorLines.slice(0, 6).join("\n  - ")}` : "- **סטטוס שגיאות:** תקין (0 שגיאות).",
  ].join("\n");

  const executiveBriefEn = [
    `### Smart Context Auto-Triage Summary`,
    `- **Detected Type:** ${detectedKindEn}`,
    `- **Volume:** ${originalLineCount.toLocaleString()} lines → **Filtered:** ${filteredLineCount.toLocaleString()} lines (${savedPercent}% saved)`,
    `- **Extracted Items:** ${assets.length} items (Secrets: ${secretsCount}, Files: ${assets.filter((a) => a.kind === "file").length}, URLs: ${assets.filter((a) => a.kind === "url").length})`,
    errorLines.length > 0 ? `- **Errors Found (${errorLines.length}):**\n  - ${errorLines.slice(0, 6).join("\n  - ")}` : "- **Error Status:** Clean (0 errors).",
  ].join("\n");

  return {
    detectedKindHe, detectedKindEn, explanationHe, explanationEn,
    errorLines, assets, filteredText, originalLineCount, filteredLineCount,
    savedPercent, executiveBriefHe, executiveBriefEn,
  };
}