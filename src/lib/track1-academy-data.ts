export interface ExternalServiceStep {
  name: string;
  url: string;
  purpose: string;
  exactSteps: string[];
}

export interface TroubleshootingCase {
  symptom: string;
  fixExplanation: string;
  fixPrompt: string;
}

export interface AcademyModule {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  badgeUnlocked: string;
  assetBuilt: string;
  coreLessonTitle: string;
  coreLessonBody: string;
  roiInsight: string;
  amateurMistake: string;
  proExecution: string;
  externalServices: ExternalServiceStep[];
  readyPrompt: string;
  troubleshooting: TroubleshootingCase[];
  quizQuestion: string;
  quizOptions: string[];
  correctQuizIdx: number;
}

export const TRACK1_NICHES = [
  { label: "Clinics & Healthcare", pitch: "Builds high-converting landing engines and instant appointment booking flows for clinics and practitioners", sampleTitle: "v1.0 — Conversion Landing Engine & Instant Booking Flow for Clinics" },
  { label: "Consulting, Finance & Insurance", pitch: "Designs conversion funnels and automated lead intake pages for advisors, CPAs, and agencies", sampleTitle: "v1.0 — B2B Advisory Lead Funnel & Instant Consultation Booking" },
  { label: "Local Services & Contractors", pitch: "Ships fast mobile-first service pages with zero-backend quote requests for local businesses", sampleTitle: "v1.0 — Instant Service Quote & Dispatch Landing System" },
  { label: "Boutique Brands & Digital Courses", pitch: "Launches high-speed product sales pages with social proof and direct order conversion", sampleTitle: "v1.0 — Direct-to-Consumer Product & Course Launch Page" },
];

export const TRACK1_MODULES: AcademyModule[] = [
  {
    id: "t1-mod1",
    stepNumber: 1,
    title: "Module 1: Conversion Anatomy & Value Positioning",
    subtitle: "Structure a clear business value proposition, pain-point hierarchy, and single primary CTA.",
    badgeUnlocked: "Conversion Architect",
    assetBuilt: "Conversion Spec & Wireframe Blueprint",
    coreLessonTitle: "Clarity Beats Cleverness in the First 5 Seconds",
    coreLessonBody: "High-converting landing engines immediately answer three questions above the fold: what measurable outcome you deliver, who it is built for, and the single next action to take.",
    roiInsight: "Replacing vague slogans with a specific outcome and single CTA typically lifts visitor-to-lead conversion by 2x–3x.",
    amateurMistake: "Cramming 5 competing navigation links, generic buzzwords, and walls of text before showing proof.",
    proExecution: "Lead with a sharp outcome headline, 3 concrete pain-to-solution cards, verified social proof, and a single friction-free lead CTA.",
    externalServices: [
      { name: "Claude / Gemini Studio", url: "https://claude.ai", purpose: "Draft your conversion copy & section architecture", exactSteps: ["Define target client niche", "Generate Hero headline + 3 value blocks", "Copy structured spec into Station 3"] },
    ],
    readyPrompt: "Act as a conversion copywriter: write a Hero headline, subheadline, 3 problem-to-solution blocks, and a single high-trust CTA for my target niche landing engine.",
    troubleshooting: [
      { symptom: "Copy sounds too generic or corporate", fixExplanation: "Anchor the headline on a concrete time or revenue metric.", fixPrompt: "Rewrite the Hero headline to include a specific measurable result and target audience." },
    ],
    quizQuestion: "What drives the highest conversion rate above the fold on a B2B landing page?",
    quizOptions: ["A clear outcome headline + single focused CTA", "Multiple competing links and auto-playing carousels", "Hiding the call-to-action at the bottom of the page"],
    correctQuizIdx: 0,
  },
  {
    id: "t1-mod2",
    stepNumber: 2,
    title: "Module 2: Responsive Obsidian UI & High-Contrast Layout",
    subtitle: "Implement mobile-first grids, AA+ contrast tokens, and zero horizontal overflow.",
    badgeUnlocked: "UI Systems Builder",
    assetBuilt: "Responsive Frontend Component",
    coreLessonTitle: "Mobile-First Precision & Visual Hierarchy",
    coreLessonBody: "Over 70% of initial client traffic arrives on mobile devices. Clean spacing, readable typography, and high contrast establish immediate engineering credibility.",
    roiInsight: "Clients judge software reliability within 3 seconds based on visual alignment and mobile responsiveness.",
    amateurMistake: "Using fixed pixel widths that overflow on 360px screens or low-contrast gray text on dark backgrounds.",
    proExecution: "Use fluid CSS Grid (repeat(auto-fit, minmax(...))), generous card padding, and crisp #F8FAFC typography on #0A0B0E surfaces.",
    externalServices: [
      { name: "v0 by Vercel", url: "https://v0.dev", purpose: "Preview responsive React + Tailwind layouts", exactSteps: ["Generate responsive Hero & feature grid", "Inspect 360px mobile viewport", "Copy CSS/JSX snippet to Station 3"] },
    ],
    readyPrompt: "Build a responsive Next.js landing page component using CSS Grid auto-fit, dark fintech styling (#0A0B0E background, #F8FAFC text), and zero horizontal overflow.",
    troubleshooting: [
      { symptom: "Horizontal scroll bar appears on mobile", fixExplanation: "Check for fixed width elements or missing box-sizing: border-box.", fixPrompt: "Audit my CSS layout to remove fixed widths and enforce max-width: 100% with box-sizing: border-box." },
    ],
    quizQuestion: "Which CSS Grid pattern adapts automatically across mobile and desktop without media-query breakage?",
    quizOptions: ["grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))", "Fixed width: 1200px container", "Hardcoded left/right pixel margins"],
    correctQuizIdx: 0,
  },
  {
    id: "t1-mod3",
    stepNumber: 3,
    title: "Module 3: Dynamic Lead Engine & Live Vercel Deployment",
    subtitle: "Wire structured lead capture links and ship your v1.0 asset to a live HTTPS URL.",
    badgeUnlocked: "v1.0 Production Shipper",
    assetBuilt: "Live HTTPS Production Asset",
    coreLessonTitle: "Shipping Real Software Beats Local Demos",
    coreLessonBody: "A project only counts as proof when it runs on a live HTTPS domain that any client or recruiter can test on their phone.",
    roiInsight: "A live v1.0 URL in your Verified Portfolio lets you pitch and close real client projects immediately.",
    amateurMistake: "Leaving projects on localhost:3000 or deploying with TypeScript build errors.",
    proExecution: "Verify clean production compilation with npm run build, push to GitHub, deploy on Vercel HTTPS, and lock the live URL into your portfolio.",
    externalServices: [
      { name: "Vercel Cloud", url: "https://vercel.com", purpose: "Deploy Next.js app to global HTTPS CDN", exactSteps: ["Import GitHub repository", "Verify build passes cleanly", "Copy live https://*.vercel.app URL"] },
    ],
    readyPrompt: "Run npm run build to verify zero TypeScript errors, then commit and push to GitHub main to trigger an automatic Vercel HTTPS production deployment.",
    troubleshooting: [
      { symptom: "Vercel build fails on TypeScript warning", fixExplanation: "Always run npm run build locally before pushing.", fixPrompt: "Diagnose and fix all TypeScript type errors reported by npm run build." },
    ],
    quizQuestion: "What must be verified before pushing code to trigger a Vercel production deployment?",
    quizOptions: ["Clean local npm run build with 0 errors", "Only checking the homepage in desktop view", "Hardcoding localhost URLs in links"],
    correctQuizIdx: 0,
  },
];

export const TRACK1_CLOSING_KIT = {
  recommendedPricing: "$500 – $1,200 per conversion landing engine",
  salesPitchTemplate: "I build fast, high-converting web landing engines with built-in lead capture — backed by live production proof.",
  handoverChecklist: ["Live HTTPS URL verified", "Mobile responsiveness tested", "Lead capture workflow tested end-to-end"],
};
