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
    projectTitle: p.projectTitle,
    projectSummary: p.projectSummary,
  }));

  return (
    <SpaciousMilestoneCanvas
      userId={userId}
      trackNumber={3}
      trackLabel="Systems & Webhooks Architect · v3.0"
      accentColor="#818cf8"
      modules={TRACK3_MODULES}
      presets={presets}
      closingKit={TRACK3_CLOSING_KIT}
      fullName={profile.fullName}
      headline={profile.headline || preset.headline}
      primaryTools={profile.primaryTools}
      quickToolsList={["HMAC-SHA256 Webhooks", "Server Route Handlers", "Stripe / Billing APIs", "Idempotency Keys", "Edge Rate Limiting"]}
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
        setProfile((p) => ({ ...p, headline: ch.headline, projectTitle: ch.projectTitle, projectProblemSolved: ch.projectSummary }));
        onNotify(`Selected ${ch.label} automation preset!`);
      }}
      completedStepIds={profile.completedStepIds}
      liveUrlInput={liveUrl}
      onLiveUrlChange={setLiveUrl}
      urlPlaceholder="https://vercel.app"
      onCompleteModule={async (mod, quizChoice, onNext) => {
        if (quizChoice !== mod.correctQuizIdx) return "Please select the correct engineering scenario answer to verify this milestone.";
        if (mod.stepNumber === 3) {
          const check = sanitizeExternalUrl(liveUrl);
          if (!check.valid) return check.error || "Enter a valid live HTTPS URL for your v3.0 Automation & Billing system.";
          const nextProj = { ...trackProjects, "3": { title: preset.projectTitle, url: check.cleanUrl, summary: preset.projectSummary, verifiedAt: new Date().toISOString() } };
          setTrackProjects(nextProj);
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-8"]));
          const nextProf = { ...profile, headline: preset.headline, projectTitle: preset.projectTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.projectSummary, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
          onNotify("Project #3 (v3.0 Verified Webhooks & APIs) locked into your Verified Portfolio!");
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
