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
    projectTitle: p.projectTitle,
    projectSummary: p.projectSummary,
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
      headline={profile.headline || preset.headline}
      primaryTools={profile.primaryTools}
      quickToolsList={["Multi-Tenant RBAC", "Enterprise AI Copilot", "Immutable Audit Logs", "OWASP Hardening", "4/4 Portfolio Credential"]}
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
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.projectTitle, projectProblemSolved: ch.projectSummary }));
        onNotify(`Selected ${ch.label} Flagship Enterprise preset!`);
      }}
      completedStepIds={profile.completedStepIds}
      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "Please select the correct engineering scenario answer to verify this milestone.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "Enter a valid live HTTPS URL for your v4.0 Enterprise AI Platform.";
          const nextProj = { ...trackProjects, "4": { title: preset.projectTitle, url: check.cleanUrl, summary: preset.projectSummary, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-9", "step-10"]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.projectTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.projectSummary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("Flagship Project #4 (v4.0 Enterprise AI Architect) locked — 4/4 Portfolio Complete!");
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
