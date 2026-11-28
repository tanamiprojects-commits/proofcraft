import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ארגז כלי AI, ענן ושיווק מאומתים (6 שלבי ייצור) | ProofCraft Studio OS",
  description: "מטריצת כלי הליבה של AI, ענן, מסדי נתונים, אבטחה וקריאייטיב שנבדקו ואומתו לייצור — כולל פרומפטים מוכנים וסנכרון לתיק העבודות.",
  openGraph: {
    title: "מטריצת כלי AI וענן מאומתים | ProofCraft Studio OS",
    description: "6 כלי ליבה מאומתים לאורך 6 שלבי הפיתוח — עם מדריכים, פרומפטים וקישורי שותפים.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function ToolkitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}