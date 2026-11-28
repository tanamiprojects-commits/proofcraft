"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Info } from "lucide-react";
import { TRACK1_MODULES, TRACK1_NICHES, TRACK1_CLOSING_KIT } from "@/lib/track1-academy-data";
import { BuilderProfile } from "@/lib/proofcraft-store";
import { TrackProjectEntry, syncProfileToCloud } from "@/lib/cloud-store";
import { sanitizeExternalUrl } from "@/lib/security-utils";
import { useStudioLang } from "@/lib/i18n-engine";
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
  const { isHe, t } = useStudioLang();
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [liveUrl, setLiveUrl] = useState(trackProjects["1"]?.url || profile.projectLiveUrl || "");
  const preset = TRACK1_NICHES[selectedPresetIdx] || TRACK1_NICHES[0];

  const presets = TRACK1_NICHES.map((p) => ({
    label: p.label,
    headline: p.pitch,
    projectTitle: p.sampleTitle,
    projectSummary: p.pitch,
  }));

  const fillDemoUrl = () => {
    const demo = "https://tanami360.com";
    setLiveUrl(demo);
    onNotify(t("Sample verified URL inserted! You can replace it anytime with your own link.", "קישור דוגמה מאומת הוזן! תוכל להחליף אותו בכל רגע בקישור משלך."));
  };

  return (
    <div>
      {/* Beginner-Friendly Quick Action Strip */}
      <div className="card-surface" style={{ padding: "12px 14px", marginBottom: 12, border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#e2e8f0" }}>
          <Info size={16} color="#34d399" />
          <span>
            <strong style={{ color: "#34d399" }}>{t("Beginner Guide (3 Steps):", "מדריך מהיר למתחילים (3 צעדים):")}</strong>{" "}
            {t(
              "1) Pick a niche & enter your name · 2) Answer the short check · 3) Paste your live link (or use the sample link) to lock your badge.",
              "1) בחר תחום והזן שם מלא · 2) ענה על שאלת ההבנה הקצרה · 3) הדבק קישור חי (או לחץ על קישור לדוגמה) לנעילת ההסמכה."
            )}
          </span>
        </div>
        <button type="button" onClick={fillDemoUrl} className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#34d399", borderColor: "rgba(52,211,153,0.35)" }}>
          <Sparkles size={13} /> {t("Insert Sample Live Link", "הזן קישור חי לדוגמה")}
        </button>
      </div>

      <SpaciousMilestoneCanvas
        userId={userId}
        trackNumber={1}
        trackLabel={isHe ? "בונה AI מוסמך · v1.0 (חינם)" : "Junior AI Builder · v1.0"}
        accentColor="#34d399"
        modules={TRACK1_MODULES}
        presets={presets}
        closingKit={TRACK1_CLOSING_KIT}
        fullName={profile.fullName}
        onNameChange={(name) => setProfile((p) => ({ ...p, fullName: name }))}
        headline={profile.headline || preset.pitch}
        primaryTools={profile.primaryTools}
        quickToolsList={["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel", "Claude / Gemini"]}
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
          onNotify(t(`Specialization preset applied: ${ch.label}`, `תבנית התמחות הוחלה: ${ch.label}`));
        }}
        completedStepIds={profile.completedStepIds}
        liveUrlInput={liveUrl}
        onLiveUrlChange={setLiveUrl}
        urlPlaceholder="https://your-project.vercel.app"
        onCompleteModule={async (mod, quizChoice, onNext) => {
          if (quizChoice !== mod.correctQuizIdx) {
            return t(
              "Please select the correct answer in the Engineering Scenario Check to verify this milestone.",
              "אנא בחר את התשובה הנכונה בשאלת ההבנה כדי לאמת את אבן הדרך."
            );
          }
          if (mod.stepNumber === 1 && !(profile.fullName || "").trim()) {
            return t(
              "Please enter your full name in Station 2 before locking Milestone #1.",
              "אנא הזן את שמך המלא לפני נעילת אבן דרך #1."
            );
          }
          if (mod.stepNumber === 3) {
            const check = sanitizeExternalUrl(liveUrl);
            if (!check.valid) {
              return check.error || t("Please enter a valid live HTTPS deployment URL.", "אנא הזן קישור HTTPS תקין לאתר החי או לפרויקט.");
            }
            const nextProj = { ...trackProjects, "1": { title: preset.sampleTitle, url: check.cleanUrl, summary: preset.pitch, verifiedAt: new Date().toISOString() } };
            setTrackProjects(nextProj);
            const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-1", "step-2", "step-3", "step-4", "step-5"]));
            const nextProf = { ...profile, headline: preset.pitch, projectTitle: preset.sampleTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.pitch, completedStepIds: nextCompleted };
            setProfile(nextProf);
            await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
            onNotify(t("Project #1 (v1.0) locked into your Verified Portfolio!", "פרויקט #1 (v1.0) ננעל בהצלחה בתיק העבודות המאומת שלך!"));
            onNext();
            return null;
          }
          const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id]));
          const nextProf = { ...profile, headline: profile.headline || preset.pitch, completedStepIds: nextCompleted };
          setProfile(nextProf);
          await syncProfileToCloud(userId, nextProf);
          onNotify(t(`${mod.badgeUnlocked} badge added to your profile!`, `התג "${mod.badgeUnlocked}" נוסף לפרופיל שלך!`));
          onNext();
          return null;
        }}
        onNotify={onNotify}
      />
    </div>
  );
}