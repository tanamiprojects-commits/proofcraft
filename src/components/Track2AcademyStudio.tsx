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
    projectTitle: p.projectTitle,
    projectSummary: p.projectSummary,
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
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.projectTitle, projectProblemSolved: ch.projectSummary }));
        onNotify(`Selected ${ch.label} SaaS architecture preset!`);
      }}
      completedStepIds={profile.completedStepIds}
      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://your-saas.vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "Please select the correct engineering scenario answer to verify this milestone.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "Enter a valid live HTTPS URL for your v2.0 Cloud SaaS deployment.";
          const nextProj = { ...trackProjects, "2": { title: preset.projectTitle, url: check.cleanUrl, summary: preset.projectSummary, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-6", "step-7"]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.projectTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.projectSummary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("Project #2 (v2.0 Cloud SaaS) locked into your Verified Portfolio!");
          onNext();
          return null;
        }
        const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id]));
        const nextProf = { ...profile, headline: preset.headline, completedStepIds: nextCompleted };
        setProfile(nextProf);
        await syncProfileToCloud(userId, nextProf);
        onNotify(`${mod.badgeUnlocked} badge added to your profile!`);
        onNext();
        return null;
      }}
      onNotify={onNotify}
    />
  );
}
