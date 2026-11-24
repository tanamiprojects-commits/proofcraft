export interface LegalDocumentItem {
  id: string;
  title: string;
  badge: string;
  sections: { heading: string; text: string }[];
}

export const FINTECH_LEGAL_DOCS: LegalDocumentItem[] = [
  {
    id: "about",
    title: "About ProofCraft Studio",
    badge: "PLATFORM OVERVIEW",
    sections: [
      { heading: "Proof-of-Execution Standard", text: "ProofCraft Studio is a practical AI product engineering environment and Verified Portfolio OS built for self-taught builders, developers, and consultants." },
      { heading: "4-Tier Architecture Roadmap", text: "Builders start free with v1.0 (Conversion Landing Engine) and progress through v2.0 (Cloud SaaS & RLS), v3.0 (Verified Webhooks & Billing), and v4.0 (Enterprise Multi-Tenant AI Architect)." },
    ],
  },
  {
    id: "pricing",
    title: "Transparent Upgrade-Delta Pricing",
    badge: "PRICING & CREDITS",
    sections: [
      { heading: "Free Launchpad (Track 1)", text: "Track 1 (v1.0) is 100% free forever, including full studio access and a public Verified Portfolio URL." },
      { heading: "100% Upgrade-Delta Credit", text: "Tracks 2 ($49), 3 ($89), and 4 ($149) credit 100% of your previous payments automatically — you only pay the difference when upgrading." },
    ],
  },
  {
    id: "terms",
    title: "Terms of Service",
    badge: "TERMS",
    sections: [
      { heading: "Authentic Artifacts Only", text: "All submitted live URLs, code snippets, and SQL outputs must represent genuine work executed by the account holder." },
      { heading: "Platform Governance", text: "ProofCraft reserves the right to revoke verification badges or suspend accounts submitting spam, phishing links, or forged credentials." },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security Policy",
    badge: "SECURITY & RLS",
    sections: [
      { heading: "Row-Level Security Isolation", text: "Private builder workspaces are protected by PostgreSQL Row-Level Security (RLS). Only explicitly verified portfolio items are publicly visible." },
      { heading: "Zero-Secret Policy", text: "Never submit private API keys or database credentials into public feed posts or milestone artifacts." },
    ],
  },
  {
    id: "refunds",
    title: "Cancellation & Refund Policy",
    badge: "BILLING",
    sections: [
      { heading: "14-Day Satisfaction Guarantee", text: "Paid tier upgrades (Tracks 2–4) are eligible for a full refund within 14 days of purchase if fewer than 50% of track modules have been completed." },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility Statement",
    badge: "WCAG AA+",
    sections: [
      { heading: "High-Contrast & Responsive Support", text: "ProofCraft Studio enforces AA+ contrast ratios, keyboard navigation, responsive mobile/desktop viewports, and built-in text scaling controls." },
    ],
  },
];
