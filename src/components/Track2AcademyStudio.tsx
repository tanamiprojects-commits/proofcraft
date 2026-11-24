"use client";

import React, { useState } from "react";
import { TRACK2_MODULES, TRACK2_PRESETS, TRACK2_CLOSING_KIT } from "@/lib/track2-academy-data";
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

export default function Track2AcademyStudio({ userId, profile, setProfile, trackProjects, setTrackProjects, onNotify }: Props) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [liveUrl, setLiveUrl] = useState(trackProjects["2"]?.url || "");
  const preset = TRACK2_PRESETS[selectedPresetIdx];

  const presets = TRACK2_PRESETS.map((p) => ({
    label: p.label,
    headline: p.headline,
    projectTitle: p.v2Title,
    projectSummary: p.v2Summary,
  }));

  return (
    <SpaciousMilestoneCanvas
      userId={userId}
      trackNumber={2}
      trackLabel="Full-Stack AI Builder · v2.0"
      accentColor="#38bdf8"
      modules={TRACK2_MODULES}
      presets={presets}
      closingKit={TRACK2_CLOSING_KIT}
      fullName={profile.fullName}
      headline={profile.headline || preset.headline}
      primaryTools={profile.primaryTools}
      quickToolsList={["Supabase PostgreSQL", "Row Level Security (RLS)", "Supabase Auth", "CRUD Cloud Sync", "CSV Export"]}
      onToggleTool={(tl) => {
        const curr = profile.primaryTools || "";
        if (!curr.toLowerCase().includes(tl.toLowerCase())) {
          setProfile((p) => ({ ...p, primaryTools: curr ? `${curr}, ${tl}` : tl }));
        }
      }}
      selectedPresetIdx={selectedPresetIdx}
      onApplyPreset={(idx) => {
        setSelectedPresetIdx(idx);
        const ch = TRACK2_PRESETS[idx];
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.v2Title, projectProblemSolved: ch.v2Summary }));
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
          if (!check.valid) return check.error || "הזן קישור HTTPS תקין של אפליקציית v2.0.";
          const nextProj = { ...trackProjects, "2": { title: preset.v2Title, url: check.cleanUrl, summary: preset.v2Summary, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-6", "step-7"]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.v2Title, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.v2Summary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("🎉 עבודה #2 (v2.0 SaaS) נוספה לתיק העבודות לצד v1.0!");
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
