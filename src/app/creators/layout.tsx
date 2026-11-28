import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אינדקס בוני AI מאומתים וחנויות שותפים | ProofCraft Studio OS",
  description: "גלה יוצרים, ארכיטקטי מערכות AI וחנויות דילים מאומתות עם תעודות הסמכה והוכחות ביצוע אמיתיות.",
  openGraph: {
    title: "אינדקס יוצרים וחנויות מאומתות | ProofCraft Studio OS",
    description: "סקור תיקי עבודות מאומתים, תעודות הסמכה רשמיות וחנויות שותפים בפלטפורמת ProofCraft & Tanami360.",
    url: "https://tanami360.com/creators",
    siteName: "ProofCraft Studio OS",
  },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}