import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "קיר הקהילה, דילים מאומתים ומערכות AI חיות | ProofCraft Studio OS",
  description: "גלה מערכות AI מאומתות ב-HTTPS, דילים חכמים לשותפים ואוספי כלים נבחרים. שתף הוכחות ביצוע וצבור נקודות חשיפה.",
  openGraph: {
    title: "קיר הקהילה והדילים המאומתים | ProofCraft Studio OS",
    description: "מערכות AI חיות, דילים מאומתים לשותפים ואוספי כלים נבחרים עם אימות HTTPS.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}