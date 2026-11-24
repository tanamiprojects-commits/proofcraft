import { AcademyModule } from "./track1-academy-data";

export const TRACK3_PRESETS = [
  { label: "Automated SaaS Billing Engine", headline: "Systems Architect · HMAC Webhook Verification & Automated Billing", projectTitle: "v3.0 — Server-Verified Payment Webhook & Subscription Engine", projectSummary: "Cryptographically verified Next.js Route Handlers with automated tier provisioning." },
  { label: "Real-Time Operations & Alert Bot", headline: "Systems Architect · Event Pipelines & Instant Webhook Alerts", projectTitle: "v3.0 — Automated Event Pipeline & Real-Time Ops Bot", projectSummary: "Server-side webhook ingestion with signature validation and instant notifications." },
  { label: "API Integration & Sync Bridge", headline: "Systems Architect · Secure Server-to-Server API Automation", projectTitle: "v3.0 — Zero-Trust API Sync & Automated Fulfillment Engine", projectSummary: "Idempotent server API routes with rate limiting and secret isolation." },
];

export const TRACK3_MODULES: AcademyModule[] = [
  {
    id: "t3-mod1",
    stepNumber: 1,
    title: "Module 1: Cryptographic HMAC Signature Verification",
    subtitle: "Verify incoming payment and API webhooks server-side using crypto.createHmac.",
    badgeUnlocked: "Webhook Security Architect",
    assetBuilt: "HMAC-Verified Route Handler",
    coreLessonTitle: "Never Trust Client-Side Payment Redirects",
    coreLessonBody: "Any browser query parameter like ?paid=true can be forged in 5 seconds. Production billing systems verify an HMAC-SHA256 signature on the server using a private WEBHOOK_SECRET.",
    roiInsight: "Eliminates revenue leakage and prevents unauthorized access to paid product tiers.",
    amateurMistake: "Updating user subscription status from a client-side useEffect hook after checkout redirect.",
    proExecution: "Create a server Route Handler (app/api/webhooks/payment/route.ts) that validates the raw request signature against process.env.WEBHOOK_SECRET before updating Supabase.",
    externalServices: [
      { name: "Stripe / LemonSqueezy Webhooks", url: "https://stripe.com", purpose: "Configure signed webhook endpoints & test events", exactSteps: ["Create webhook endpoint URL", "Copy signing secret to .env.local", "Paste Route Handler code in Station 3"] },
    ],
    readyPrompt: "Create a Next.js App Router POST Route Handler at src/app/api/webhooks/payment/route.ts that verifies an HMAC-SHA256 signature using process.env.WEBHOOK_SECRET and returns 401 on invalid signatures.",
    troubleshooting: [
      { symptom: "Signature mismatch on valid webhook payload", fixExplanation: "Read the raw text body with await request.text() before computing the HMAC digest.", fixPrompt: "Update the webhook route handler to compute HMAC-SHA256 over the exact raw request.text() payload." },
    ],
    quizQuestion: "Why must payment fulfillment run inside a server Route Handler with HMAC verification?",
    quizOptions: ["Because client-side redirects can be spoofed, whereas server HMAC proves the payment provider sent the event", "To make the browser page load slower", "So API secrets can be stored in localStorage"],
    correctQuizIdx: 0,
  },
  {
    id: "t3-mod2",
    stepNumber: 2,
    title: "Module 2: Idempotent Fulfillment & Real-Time Alerts",
    subtitle: "Prevent duplicate webhook processing and trigger instant operational notifications.",
    badgeUnlocked: "Automation Pipeline Engineer",
    assetBuilt: "Idempotent Event Processor",
    coreLessonTitle: "Handle Retries Safely with Event IDs",
    coreLessonBody: "Payment gateways automatically retry webhooks if a network timeout occurs. Storing processed event IDs ensures a user is never double-charged or double-provisioned.",
    roiInsight: "Automated fulfillment + instant admin alerts cut manual operations overhead to zero.",
    amateurMistake: "Processing every incoming POST request blindly without checking if event_id was already handled.",
    proExecution: "Log unique webhook event IDs in PostgreSQL, update user entitlement atomically, and dispatch an automated notification.",
    externalServices: [
      { name: "Vercel Function Logs", url: "https://vercel.com", purpose: "Inspect real-time server webhook execution logs", exactSteps: ["Trigger test webhook payload", "Verify 200 OK response in Vercel logs", "Submit proof artifact in Station 3"] },
    ],
    readyPrompt: "Add idempotency checking by event_id and structured JSON logging to my Next.js payment webhook Route Handler.",
    troubleshooting: [
      { symptom: "Webhook times out after 10 seconds", fixExplanation: "Return HTTP 200 immediately after signature verification and database update.", fixPrompt: "Optimize webhook handler execution order so database upsert completes before returning NextResponse.json({ received: true })." },
    ],
    quizQuestion: "What does idempotency guarantee in a webhook automation pipeline?",
    quizOptions: ["Re-receiving the same event_id multiple times produces the exact same result without duplicate side effects", "Every request is rejected with HTTP 500", "Webhooks run only in the user's browser"],
    correctQuizIdx: 0,
  },
  {
    id: "t3-mod3",
    stepNumber: 3,
    title: "Module 3: Live Production API & Edge Protection (v3.0)",
    subtitle: "Enforce server-only secret isolation, rate limiting, and deploy v3.0 live.",
    badgeUnlocked: "v3.0 Systems Architect",
    assetBuilt: "Live Revenue-Ready Automation System",
    coreLessonTitle: "Zero-Secret Exposure in Production",
    coreLessonBody: "Audit your repository to ensure server keys never carry the NEXT_PUBLIC_ prefix and deploy your v3.0 system to production.",
    roiInsight: "Demonstrates to B2B clients that you can safely engineer payment and API infrastructure.",
    amateurMistake: "Prefixing a private webhook or service role key with NEXT_PUBLIC_.",
    proExecution: "Keep all secrets server-only in Vercel Environment Variables, verify live endpoint response, and lock Project #3 in your portfolio.",
    externalServices: [
      { name: "Vercel Production Runtime", url: "https://vercel.com", purpose: "Verify live /api/webhooks endpoint over HTTPS", exactSteps: ["Verify server env vars in Vercel", "Test live HTTPS endpoint", "Lock v3.0 URL in Station 3"] },
    ],
    readyPrompt: "Audit all environment variables across src/ to confirm zero secret keys use NEXT_PUBLIC_, and verify clean production build.",
    troubleshooting: [
      { symptom: "process.env.WEBHOOK_SECRET is undefined in Vercel", fixExplanation: "Add the variable in Vercel Dashboard -> Settings -> Environment Variables and redeploy.", fixPrompt: "Add server-side environment check with clear 500 configuration error if WEBHOOK_SECRET is missing." },
    ],
    quizQuestion: "Which prefix exposes an environment variable to the public browser bundle in Next.js?",
    quizOptions: ["NEXT_PUBLIC_", "SERVER_ONLY_", "PRIVATE_KEY_"],
    correctQuizIdx: 0,
  },
];

export const TRACK3_CLOSING_KIT = {
  recommendedPricing: "$4,000 – $9,500 per automated billing & API architecture",
  salesPitchTemplate: "I engineer server-verified payment webhooks, API pipelines, and automated fulfillment systems with zero-trust security.",
  handoverChecklist: ["HMAC-SHA256 verification active", "Idempotency tested on duplicate events", "All secrets isolated server-side"],
};
