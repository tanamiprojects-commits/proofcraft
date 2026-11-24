"use client";

import React, { useState } from "react";
import { TRACK1_MODULES, TRACK1_NICHES, TRACK1_CLOSING_KIT } from "@/lib/track1-academy-data";
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

export default function Track1AcademyStudio({ userId, profile, setProfile, trackProjects, setTrackProjects, onNotify }: Props) {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [liveUrl, setLiveUrl] = useState(trackProjects["1"]?.url || profile.projectLiveUrl || "");
  const preset = TRACK1_NICHES[selectedPresetIdx];

  const presets = TRACK1_NICHES.map((p) => ({
    label: p.label,
    headline: p.pitch,
    projectTitle: p.sampleTitle,
    projectSummary: p.pitch,
  }));

  return (
    <SpaciousMilestoneCanvas
      userId={userId}
      trackNumber={1}
      trackLabel="Junior AI Builder · v1.0"
      accentColor="#34d399"
      modules={TRACK1_MODULES}
      presets={presets}
      closingKit={TRACK1_CLOSING_KIT}
      fullName={profile.fullName}
      onNameChange={(name) => setProfile((p) => ({ ...p, fullName: name }))}
      headline={profile.headline || preset.pitch}
      primaryTools={profile.primaryTools}
      quickToolsList={["Next.js", "TypeScript", "RTL Hebrew", "WhatsApp Engine", "Vercel", "Google AI Studio"]}
      onToggleTool={(tl) => {
        const curr = profile.primaryTools || "";
        if (!curr.toLowerCase().includes(tl.toLowerCase())) {
          setProfile((p) => ({ ...p, primaryTools: curr ? `${curr}, ${tl}` : tl }));
        }
      }}
      selectedPresetIdx={selectedPresetIdx}
      onApplyPreset={(idx) => {
        setSelectedPresetIdx(idx);
        const ch = TRACK1_NICHES[idx];
        setProfile((p) => ({ ...p, headline: ch.pitch, projectTitle: ch.sampleTitle, projectProblemSolved: ch.pitch }));
        onNotify(`✓ תבנית ${ch.label} הוגדרה!`);
      }}
      completedStepIds={profile.completedStepIds}

      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "בחר את התשובה הנכונה בבדיקת ההבנה כדי לאמת את המודול.";
        if (mod.stepNumber === 1 && !(profile.fullName || "").trim()) return "הזן את שמך המלא בלשונית 2 (ביצוע וכלים) לפני האימות.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "הזן קישור HTTPS תקין של דף הנחיתה שבנית.";
          const nextProj = { ...trackProjects, "1": { title: preset.sampleTitle, url: check.cleanUrl, summary: preset.pitch, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-1", "step-2", "step-3", "step-4", "step-5"]));
          const nextProf = { ...profile, headline: preset.pitch, projectTitle: preset.sampleTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.pitch, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("🎉 הנכס הראשון (v1.0) ננעל בתיק העבודות שלך!");
          onNext();
          return null;
        }
        const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id]));
        const nextProf = { ...profile, headline: profile.headline || preset.pitch, completedStepIds: nextCompleted };
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
