import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מתודולוגיית ProofCraft וכספת הפרומפטים החכמה | Tanami360",
  description:
    "שיטת 11 השלבים להנדסת AI, פרומפטים מוכנים להדבקה בכל צ'אט חכם, העברת הקשר מלאה (Master Handover), ושחזור פקודות שנחתכו.",
  openGraph: {
    title: "מתודולוגיית ProofCraft וכספת הפרומפטים החכמה | Tanami360",
    description:
      "כספת פרומפטים מקצועית ב-11 שלבים לבניית מערכות AI, ניהול הקשר מלא ואבטחת אפס-סודות.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS & Tanami360",
    locale: "he_IL",
    type: "website",
  },
};

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}