"use client";

import React, { useState } from "react";
import { TRACK4_MODULES, TRACK4_PRESETS, TRACK4_CLOSING_KIT } from "@/lib/track4-academy-data";
import { BuilderProfile } from "@/lib/proofcraft-store";
import { TrackProjectEntry, syncProfileToCloud } from "@/lib/cloud-store";
import { sanitizeExternalUrl } from "@/lib/security-utils";
import SpaciousMilestoneCanvas from "./SpaciousMilestoneCanvas";

interface Props {
  userId: string | null;
  profile: BuilderProfile;
  setProfile: React.Dispatch<React.SetStateAction<BuilderProfile>>;
  trackProjects: Record<string, TrackProjectEntry>;
  setTrackProjects: React.Dispatch<React.SetStateAction<Record<string, TrackProjectEntry>>>;
  onNotify: (msg: string) => void;
}

export default function Track4AcademyStudio({ userId, profile, setProfile, trackProjects, setTrackProjects, onNotify }: Props) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [liveUrl, setLiveUrl] = useState(trackProjects["4"]?.url || "");
  const preset = TRACK4_PRESETS[selectedPresetIdx];

  const presets = TRACK4_PRESETS.map((p) => ({
    label: p.label,
    headline: p.headline,
    projectTitle: p.v4Title,
    projectSummary: p.v4Summary,
  }));

  return (
    <SpaciousMilestoneCanvas
      userId={userId}
      trackNumber={4}
      trackLabel="Senior AI Systems Architect · v4.0"
      accentColor="#fbbf24"
      modules={TRACK4_MODULES}
      presets={presets}
      closingKit={TRACK4_CLOSING_KIT}
      fullName={profile.fullName}
      onNameChange={(name) => setProfile((p) => ({ ...p, fullName: name }))}
      headline={profile.headline || preset.headline}
      primaryTools={profile.primaryTools}
      quickToolsList={["Multi-Tenant RBAC", "Gemini AI Copilot", "Audit Logs", "Vercel Edge Caching", "Enterprise SLA"]}
      onToggleTool={(tl) => {
        const curr = profile.primaryTools || "";
        if (!curr.toLowerCase().includes(tl.toLowerCase())) {
          setProfile((p) => ({ ...p, primaryTools: curr ? `${curr}, ${tl}` : tl }));
        }
      }}
      selectedPresetIdx={selectedPresetIdx}
      onApplyPreset={(idx) => {
        setSelectedPresetIdx(idx);
        const ch = TRACK4_PRESETS[idx];
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.v4Title, projectProblemSolved: ch.v4Summary }));
        onNotify(`✓ התמחות ${ch.label} הוגדרה!`);
      }}
      completedStepIds={profile.completedStepIds}

      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "בחר את התשובה הנכונה בבדיקת ההבנה כדי לאמת את המודול.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "הזן קישור HTTPS תקין של מערכת הדגל v4.0.";
          const nowIso = new Date().toISOString();
          const nextProj: Record<string, TrackProjectEntry> = {
            "1": trackProjects["1"] || { title: "v1.0 — דף נחיתה ממיר ומנוע הזמנות WhatsApp", url: check.cleanUrl, summary: "שכבת המרה מהירה בעברית (RTL).", verifiedAt: nowIso },
            "2": trackProjects["2"] || { title: "v2.0 — מערכת SaaS וניהול לקוחות (Supabase + RLS)", url: check.cleanUrl, summary: "מסד נתונים מנורמל ואבטחת RLS.", verifiedAt: nowIso },
            "3": trackProjects["3"] || { title: "v3.0 — מנוע סליקה, Webhooks ואוטומציית Telegram", url: check.cleanUrl, summary: "סליקה מאומתת וחומת אש Cloudflare.", verifiedAt: nowIso },
            "4": { title: preset.v4Title, url: check.cleanUrl, summary: preset.v4Summary, verifiedAt: nowIso },
          };
          setTrackProjects(nextProj);
          const allIds = ["t1-mod1","t1-mod2","t1-mod3","t1-mod4","t2-mod1","t2-mod2","t2-mod3","t2-mod4","t3-mod1","t3-mod2","t3-mod3","t3-mod4","t4-mod1","t4-mod2","t4-mod3","step-1","step-2","step-3","step-4","step-5","step-6","step-7","step-8"];
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, ...allIds]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.v4Title, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.v4Summary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("🎉 תיק עבודות מלא (4/4 עבודות) ופרופיל Senior Architect סונכרנו!");
          onNext();
          return null;
        }
        const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id]));
        const nextProf = { ...profile, headline: preset.headline, completedStepIds: nextCompleted };
        setProfile(nextProf);
        await syncProfileToCloud(userId, nextProf);
        onNotify(`✓ ${mod.badgeUnlocked} נוסף לפרופיל!`);
        onNext();
        return null;
      }}
      onNotify={onNotify}
    />
  );
}
