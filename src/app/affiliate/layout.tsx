import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מרכז השותפים החכם | ProofCraft Studio OS & Tanami360",
  description: "בניית הכנסה מקישורים שיתופיים צעד אחר צעד: בחירת רשתות מאומתות, אימות מזהה, קישורים חכמים, בנק דיגיטלי ואשף קמפיינים.",
  openGraph: {
    title: "מרכז השותפים החכם | ProofCraft Studio OS",
    description: "מערכת 4 תחנות מלאה להקמת נכסי שותפים מאומתים, מעקב ערוצים והפצת קמפיינים.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}