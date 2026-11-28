import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "סטודיו הנדסת AI, בניית מוצרים ותיק עבודות מאומת | ProofCraft Studio OS",
  description: "בנה מערכות AI אמיתיות שלב אחר שלב, הפק תעודת הסמכה רשמית לתיק העבודות, ושמור מפתחות בכספת מוצפנת.",
  openGraph: {
    title: "סטודיו הנדסת AI ובניית נכסים חיים | ProofCraft Studio OS",
    description: "מסלול 1 חינמי לבניית פרופיל ותיק עבודות v1.0, כולל כספת מוצפנת וסטודיו חבילות הקשר.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}