import { resolveVipGrantForUser } from "./vip-access-engine";
import { supabase, ADMIN_EMAIL } from "./supabase";
import { BuilderProfile, DEFAULT_PROFILE, VERIFICATION_STEPS, loadBuilderProfile, saveBuilderProfile } from "./proofcraft-store";
import { DEV_TOOLS } from "./dev-toolkit-data";

export interface CareerTrack {
  level: number;
  slug: string;
  title: string;
  english_badge: string;
  description: string;
  required_steps_count: number;
  required_tools_count: number;
  price_ils: number;
  marketing_pitch: string;
  upgrade_pitch: string;
  deliverable_project_title: string;
  deliverable_project_guide: string;
  deliverable_ready_prompt: string;
}

export interface TrackProjectEntry {
  title: string;
  url: string;
  summary: string;
  verifiedAt: string;
}

export interface DynamicStep {
  id: string;
  step_number: number;
  title: string;
  subtitle: string;
  badge_name: string;
  asset_unlocked: string;
  points: number;
  checklist: string[];
  pro_example: string;
  is_active: boolean;
  verification_mode?: "auto_pattern" | "peer_verified" | "admin_verified" | "standard";
  expected_patterns?: string[];
  challenge_prompt?: string;
  min_track_level?: number;
  quiz_question?: string;
  quiz_options?: string[];
  quiz_correct_index?: number;
}

export interface CloudDevTool {
  id: string;
  stage_number: number;
  stage_title: string;
  name: string;
  category: string;
  short_desc: string;
  full_explanation: string;
  actions_list: string[];
  pricing_summary: string;
  user_requirements: string[];
  core_capabilities: string[];
  official_url: string;
  verification_label: string;
  is_active: boolean;
}

export interface PlatformSettings {
  id: number;
  export_price_ils: number;
  platform_tagline: string;
  announcement_text: string;
}

export function calculateUpgradePrice(track: CareerTrack, purchasedTrackLevel: number, totalPaidIls: number): {
  finalPrice: number;
  isUpgradeDiscount: boolean;
  savedAmount: number;
} {
  if (purchasedTrackLevel >= track.level) {
    return { finalPrice: 0, isUpgradeDiscount: false, savedAmount: track.price_ils };
  }
  if (purchasedTrackLevel > 0 && totalPaidIls > 0) {
    const diff = Math.max(10, track.price_ils - totalPaidIls);
    return { finalPrice: diff, isUpgradeDiscount: true, savedAmount: track.price_ils - diff };
  }
  return { finalPrice: track.price_ils, isUpgradeDiscount: false, savedAmount: 0 };
}

export function evaluateStepVerification(
  step: DynamicStep,
  userOutput: string,
  selectedQuizIdx: number | null,
  hasPeerEngagement: boolean,
  isAdminVerified: boolean
): { passed: boolean; reason: string; badgeType: string } {
  if (step.quiz_question && step.quiz_options && step.quiz_options.length > 0) {
    if (selectedQuizIdx === null || selectedQuizIdx !== (step.quiz_correct_index ?? 0)) {
      return {
        passed: false,
        reason: "Selected answer is inaccurate — review the engineering brief above and select the verified solution.",
        badgeType: "Answer Required",
      };
    }
  }

  const mode = step.verification_mode || "standard";
  const clean = userOutput.trim().toLowerCase();

  if (mode === "admin_verified") {
    return isAdminVerified
      ? { passed: true, reason: "Officially verified and signed by ProofCraft Governance", badgeType: "Admin-Certified 🏅" }
      : { passed: false, reason: "All milestones completed! Awaiting final verification signature in /admin", badgeType: "Pending Admin Review" };
  }

  if (mode === "peer_verified") {
    return hasPeerEngagement
      ? { passed: true, reason: "Automatically verified via live community feed engagement!", badgeType: "Peer-Verified 🤝" }
      : { passed: false, reason: "Published to Builder Feed — auto-verifies upon peer review", badgeType: "Pending Peer Review" };
  }

  const patterns = (step.expected_patterns || []).map((p) => p.toLowerCase()).filter(Boolean);
  if (patterns.length > 0) {
    const matched = patterns.some((pat) => clean.includes(pat));
    if (!matched || clean.length < 6) {
      return {
        passed: false,
        reason: "Submitted technical output does not yet match this milestone's rubric requirements.",
        badgeType: "Artifact Precision Needed",
      };
    }
    return { passed: true, reason: "Engineering scenario and practical artifact verified!", badgeType: "Auto-Verified ⚡" };
  }

  return clean.length >= 4
    ? { passed: true, reason: "Milestone verified successfully!", badgeType: "Verified ✓" }
    : { passed: false, reason: "Please enter complete execution proof before verifying.", badgeType: "Missing Content" };
}

export async function fetchCareerTracks(): Promise<CareerTrack[]> {
  const { data } = await supabase.from("career_tracks").select("*").order("level", { ascending: true });
  return (data as CareerTrack[]) || [];
}

export async function fetchDynamicSteps(): Promise<DynamicStep[]> {
  const { data, error } = await supabase.from("verification_steps").select("*").eq("is_active", true).order("step_number", { ascending: true });
  if (!error && data && data.length > 0) return data as DynamicStep[];
  return VERIFICATION_STEPS.map((s) => ({
    id: s.id, step_number: s.number, title: s.title, subtitle: s.subtitle,
    badge_name: s.badgeName, asset_unlocked: s.assetUnlocked, points: s.points,
    checklist: [], pro_example: "", is_active: true,
  }));
}

export async function fetchCloudDevTools(): Promise<CloudDevTool[]> {
  const { data, error } = await supabase.from("dev_tools").select("*").eq("is_active", true).order("stage_number", { ascending: true });
  if (!error && data && data.length > 0) return data as CloudDevTool[];
  return DEV_TOOLS.map((t) => ({
    id: t.id, stage_number: t.stageNumber, stage_title: t.stageTitle, name: t.name,
    category: t.category, short_desc: t.shortDesc, full_explanation: t.fullExplanation,
    actions_list: t.actionsYouCanDo, pricing_summary: "", user_requirements: t.userRequirements,
    core_capabilities: t.coreCapabilities, official_url: t.officialUrl,
    verification_label: t.verificationActionLabel, is_active: true,
  }));
}

export async function fetchPlatformSettings(): Promise<PlatformSettings> {
  const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).single();
  return data || { id: 1, export_price_ils: 39, platform_tagline: "", announcement_text: "" };
}
export async function getActiveUserProfile(): Promise<{
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
  profile: BuilderProfile;
  completedTools: string[];
  unlockedItems: string[];
  currentTrackLevel: number;
  purchasedTrackLevel: number;
  totalPaidIls: number;
  trackProjects: Record<string, TrackProjectEntry>;
}> {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  const vipGrant = await resolveVipGrantForUser(user?.email || null);
  if (!user) {
    return {
      userId: null, email: null, isAdmin: false, profile: loadBuilderProfile(),
      completedTools: [], unlockedItems: [], currentTrackLevel: 1,
      purchasedTrackLevel: vipGrant ? vipGrant.grantedLevel : 0, totalPaidIls: 0, trackProjects: {},
    };
  }

  
  const { data: row } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!row) {
    return {
      userId: user.id, email: user.email || null,
      isAdmin: (user.email || "").toLowerCase() === ADMIN_EMAIL,
      profile: { ...DEFAULT_PROFILE, fullName: user.user_metadata?.full_name || "" },
      completedTools: [], unlockedItems: [], currentTrackLevel: 1,
      purchasedTrackLevel: vipGrant ? vipGrant.grantedLevel : 0, totalPaidIls: 0, trackProjects: {},
    };
  }

  const mapped: BuilderProfile = {
    fullName: row.full_name || "",
    headline: row.headline || "",
    yearsWithAI: row.years_with_ai || "3+ Years Production AI Engineering",
    primaryTools: row.primary_tools || "",
    architectureCase: row.architecture_case || "",
    projectTitle: row.project_title || "",
    projectLiveUrl: row.project_live_url || "",
    projectProblemSolved: row.project_problem_solved || "",
    debuggingStory: row.debugging_story || "",
    portfolioPitch: row.portfolio_pitch || "",
    targetAudience: row.target_audience || "B2B SaaS Clients & Technical Hiring Teams",
    shareOnFeed: row.share_on_feed ?? true,
    completedStepIds: row.completed_step_ids || [],
    adminVerified: row.admin_verified ?? false,
    certificateId: row.certificate_id || "PC-2026-8841",
    updatedAt: row.updated_at || new Date().toISOString(),
  };

  return {
    userId: user.id,
    email: user.email || null,
    isAdmin: Boolean(row.is_admin) || (user.email || "").toLowerCase() === ADMIN_EMAIL,
    profile: mapped,
    completedTools: row.completed_tools || [],
    unlockedItems: row.unlocked_items || [],
    currentTrackLevel: row.current_track_level || 1,
    purchasedTrackLevel: row.purchased_track_level || 0,
    totalPaidIls: row.total_paid_ils || 0,
    trackProjects: (row.track_projects as Record<string, TrackProjectEntry>) || {},
  };
}

export async function syncProfileToCloud(
  userId: string | null,
  profile: BuilderProfile,
  extra?: {
    completed_tools?: string[];
    unlocked_items?: string[];
    export_unlocked?: boolean;
    current_track_level?: number;
    purchased_track_level?: number;
    total_paid_ils?: number;
    track_projects?: Record<string, TrackProjectEntry>;
  }
): Promise<void> {
  saveBuilderProfile(profile);
  if (!userId) return;

  await supabase.from("profiles").update({
    full_name: profile.fullName,
    headline: profile.headline,
    years_with_ai: profile.yearsWithAI,
    primary_tools: profile.primaryTools,
    architecture_case: profile.architectureCase,
    project_title: profile.projectTitle,
    project_live_url: profile.projectLiveUrl,
    project_problem_solved: profile.projectProblemSolved,
    debugging_story: profile.debuggingStory,
    portfolio_pitch: profile.portfolioPitch,
    target_audience: profile.targetAudience,
    share_on_feed: profile.shareOnFeed,
    completed_step_ids: profile.completedStepIds,
    admin_verified: profile.adminVerified,
    ...(extra || {}),
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
}
