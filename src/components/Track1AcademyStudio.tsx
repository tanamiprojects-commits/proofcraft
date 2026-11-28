"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, Info, Rocket, BookOpen, Compass } from "lucide-react";
import { TRACK1_MODULES, TRACK1_NICHES, TRACK1_CLOSING_KIT } from "@/lib/track1-academy-data";
import { BuilderProfile } from "@/lib/proofcraft-store";
import { TrackProjectEntry, syncProfileToCloud } from "@/lib/cloud-store";
import { sanitizeExternalUrl } from "@/lib/security-utils";
import { useStudioLang } from "@/lib/i18n-engine";
import { isSampleOrDemoUrl, saveActiveBuilderContext } from "@/lib/builder-context-bridge";
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
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const preset = TRACK1_NICHES[selectedPresetIdx] || TRACK1_NICHES;
  const isDemoMode = isSampleOrDemoUrl(liveUrl);

  useEffect(() => {
    saveActiveBuilderContext({
      nicheLabel: preset.label,
      projectTitle: profile.projectTitle || preset.sampleTitle,
      projectSummary: profile.headline || preset.pitch,
      liveUrl,
    });
  }, [preset, profile.projectTitle, profile.headline, liveUrl]);

  const presets = TRACK1_NICHES.map((p) => ({
    label: p.label,
    headline: p.pitch,
    projectTitle: p.sampleTitle,
    projectSummary: p.pitch,
  }));

  const fillDemoUrl = () => {
    const demo = "https://://tanami360.com";
    setLiveUrl(demo);
    onNotify(t("Sandbox demo link inserted! Replace with your own Vercel/GitHub URL anytime for full verification.", "קישור תרגול (Sandbox) הוזן! תוכל להחליף אותו בכל רגע בקישור משלך לאימות מלא."));
  };
  return (
    <div>
      {/* Beginner-Friendly Quick Action Strip + Sandbox vs Verified Indicator */}
      <div className="card-surface" style={{ padding: "12px 14px", marginBottom: 12, border: "1px solid rgba(52, 211, 153, 0.3)", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#e2e8f0", flexWrap: "wrap" }}>
            <Info size={16} color="#34d399" />
            <span>
              <strong style={{ color: "#34d399" }}>{t("Beginner Guide (3 Steps):", "מדריך מהיר למתחילים (3 צעדים):")}</strong>{" "}
              {t("1) Pick niche & enter name · 2) Answer check · 3) Paste live URL.", "1) בחר תחום והזן שם · 2) ענה על שאלת הבנה · 3) הדבק קישור חי.")}
            </span>
            {liveUrl.trim() && (
              <span className="badge-pill" style={{ fontSize: 10.5, background: isDemoMode ? "rgba(251, 191, 36, 0.16)" : "rgba(52, 211, 153, 0.16)", color: isDemoMode ? "#fbbf24" : "#34d399" }}>
                {isDemoMode ? t("Sandbox Demo Link", "מצב תרגול (Demo)") : t("Verified Live Domain ✓", "דומיין חי מאומת ✓")}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setShowDeployGuide((v) => !v)} className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#38bdf8", borderColor: "rgba(56,189,248,0.35)" }}>
              <Rocket size={13} /> {t("How to Deploy Free (3 Min)", "איך מעלים לאוויר בחינם?")}
            </button>
            <button type="button" onClick={fillDemoUrl} className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#fbbf24", borderColor: "rgba(251,191,36,0.35)" }}>
              <Sparkles size={13} /> {t("Try Sandbox Link", "קישור תרגול (Demo)")}
            </button>
            <Link href="/method" className="btn-ghost" style={{ height: 32, fontSize: 11.5, color: "#a5b4fc", borderColor: "rgba(129,140,248,0.38)" }}>
              <Compass size={13} /> {t("Open Prompts for This Project", "פרומפטים לפרויקט זה")}
            </Link>
          </div>
        </div>

        {showDeployGuide && (
          <div style={{ padding: 12, borderRadius: 10, background: "#0a0b0e", border: "1px solid rgba(56,189,248,0.25)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, fontSize: 12, color: "#cbd5e1" }}>
            <div><strong style={{ color: "#38bdf8" }}>1. GitHub:</strong> {t("Create a free repository and upload your project files.", "פתח מאגר חינמי ב-GitHub והעלה את קבצי הפרויקט שלך.")}</div>
            <div><strong style={{ color: "#34d399" }}>2. Vercel:</strong> {t("Connect GitHub to Vercel (1-click) to get a live https://*.vercel.app link.", "חבר את GitHub ל-Vercel בלחיצה וקבל קישור חי מסוג https://*.vercel.app.")}</div>
            <div><strong style={{ color: "#fbbf24" }}>3. Verify Here:</strong> {t("Paste your live Vercel URL below to upgrade from Sandbox to Verified.", "הדבק כאן את הקישור החי מ-Vercel כדי לשדרג ממצב תרגול לפרויקט מאומת.")}</div>
          </div>
        )}
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
          onNotify(t(`Specialization preset applied: ${ch.label}`, `תבנית התמחות הוחלה והועברה לכספת הפרומפטים: ${ch.label}`));
        }}
        completedStepIds={profile.completedStepIds}
        liveUrlInput={liveUrl}
        onLiveUrlChange={setLiveUrl}
        urlPlaceholder="https://vercel.app"
        onCompleteModule={async (mod, quizChoice, onNext) => {
          if (quizChoice !== mod.correctQuizIdx) {
            return t("Please select the correct answer in the Engineering Scenario Check to verify this milestone.", "אנא בחר את התשובה הנכונה בשאלת ההבנה כדי לאמת את אבן הדרך.");
          }
          if (mod.stepNumber === 1 && !(profile.fullName || "").trim()) {
            return t("Please enter your full name before locking Milestone #1.", "אנא הזן את שמך המלא לפני נעילת אבן דרך #1.");
          }
          if (mod.stepNumber === 3) {
            const check = sanitizeExternalUrl(liveUrl);
            if (!check.valid) return check.error || t("Please enter a valid live HTTPS deployment URL.", "אנא הזן קישור HTTPS תקין לאתר החי או לפרויקט.");
            const demoFlag = isSampleOrDemoUrl(check.cleanUrl);
            const summaryPrefix = demoFlag ? (isHe ? "[מצב תרגול] " : "[Sandbox Demo] ") : "";
            const nextProj = { ...trackProjects, "1": { title: preset.sampleTitle, url: check.cleanUrl, summary: `${summaryPrefix}${preset.pitch}`, verifiedAt: new Date().toISOString() } };
            setTrackProjects(nextProj);
            const nextCompleted = Array.from(new Set([...profile.completedStepIds, mod.id, "step-1", "step-2", "step-3", "step-4", "step-5"]));
            const nextProf = { ...profile, headline: preset.pitch, projectTitle: preset.sampleTitle, projectLiveUrl: check.cleanUrl, projectProblemSolved: preset.pitch, completedStepIds: nextCompleted };
            setProfile(nextProf);
            await syncProfileToCloud(userId, nextProf, { track_projects: nextProj });
            onNotify(demoFlag ? t("Sandbox demo locked! Replace with your own live URL anytime.", "פרויקט תרגול (Sandbox) ננעל! תוכל להחליף לקישור אמיתי משלך בכל עת.") : t("Verified Live Project #1 locked into your Portfolio!", "פרויקט חי מאומת #1 ננעל בהצלחה בתיק העבודות שלך!"));
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