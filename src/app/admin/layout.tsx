import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מרכז שליטה ובקרה (Admin) | ProofCraft Studio OS & Tanami360",
  description: "פאנל ניהול מרכזי, אימות תיקי עבודות, ניהול יוצרים, פניות תמיכה וקמפיינים מסחריים.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}