import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "סטודיו חבילות הקשר, פענוח OCR וניתוח פלטים לצ׳אט AI | ProofCraft Studio OS",
  description: "הפוך פלטי טרמינל, קוד מקור, תמונות וסרטונים לחבילת הקשר מובנית עם הסתרת מפתחות אוטומטית וניתוח שגיאות חכם לצ׳אט AI.",
  openGraph: {
    title: "ProofCraft Context Packet Studio — אריזת הקשר ופענוח OCR חכם",
    description: "סריקה מקומית בדפדפן, חילוץ שגיאות ומפתחות, ויצירת חבילות .md מובנות עד 15,000+ שורות.",
    url: "https://tanami360.com",
    siteName: "ProofCraft Studio OS",
  },
};

export default function ContextStudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}