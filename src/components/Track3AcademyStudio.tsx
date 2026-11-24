"use client";

import React, { useState } from "react";
import { TRACK3_MODULES, TRACK3_PRESETS, TRACK3_CLOSING_KIT } from "@/lib/track3-academy-data";
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

export default function Track3AcademyStudio({ userId, profile, setProfile, trackProjects, setTrackProjects, onNotify }: Props) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [liveUrl, setLiveUrl] = useState(trackProjects["3"]?.url || "");
  const preset = TRACK3_PRESETS[selectedPresetIdx];

  const presets = TRACK3_PRESETS.map((p) => ({
    label: p.label,
    headline: p.headline,
    projectTitle: p.v3Title,
    projectSummary: p.v3Summary,
  }));

  return (
    <SpaciousMilestoneCanvas
      userId={userId}
      trackNumber={3}
      trackLabel="Systems & Web3 Architect · v3.0"
      accentColor="#818cf8"
      modules={TRACK3_MODULES}
      presets={presets}
      closingKit={TRACK3_CLOSING_KIT}
      fullName={profile.fullName}
      headline={profile.headline || preset.headline}
      primaryTools={profile.primaryTools}
      quickToolsList={["Signed Webhooks", "Telegram Bot API", "Resend Email API", "Cloudflare WAF", "Web3 / BaseScan", "Sentry"]}
      onToggleTool={(tl) => {
        const curr = profile.primaryTools || "";
        if (!curr.toLowerCase().includes(tl.toLowerCase())) {
          setProfile((p) => ({ ...p, primaryTools: curr ? `${curr}, ${tl}` : tl }));
        }
      }}
      selectedPresetIdx={selectedPresetIdx}
      onApplyPreset={(idx) => {
        setSelectedPresetIdx(idx);
        const ch = TRACK3_PRESETS[idx];
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.v3Title, projectProblemSolved: ch.v3Summary }));
        onNotify(`✓ ארכיטקטורת ${ch.label} הוגדרה!`);
      }}
      completedStepIds={profile.completedStepIds}

      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "בחר את התשובה הנכונה בבדיקת ההבנה כדי לאמת את המודול.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "הזן קישור HTTPS תקין של מערכת v3.0.";
          const nextProj = { ...trackProjects, "3": { title: preset.v3Title, url: check.cleanUrl, summary: preset.v3Summary, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-8"]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.v3Title, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.v3Summary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("🎉 עבודה #3 (v3.0 Automation & Payments) נוספה לתיק העבודות!");
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
