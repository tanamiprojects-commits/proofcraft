import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ארגז כלי AI, ענן ושיווק מאומתים (32 כלים) | ProofCraft Studio OS",
  description: "מטריצת 32 כלי AI, ענן, מסדי נתונים, אבטחה וקריאייטיב שנבדקו ואומתו לייצור — כולל פרומפטים מוכנים וסנכרון לתיק העבודות.",
  openGraph: {
    title: "מטריצת כלי AI וענן מאומתים | ProofCraft Studio OS",
    description: "32 אינטגרציות ייצור מאומתות לאורך 6 שלבי הפיתוח — עם מדריכים, פרומפטים וקישורי שותפים.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function ToolkitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}