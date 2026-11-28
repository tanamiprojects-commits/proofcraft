"use client";

import { useEffect, useState } from "react";

export type StudioLang = "en" | "he";

const LANG_STORAGE_KEY = "pc_studio_lang_v2";
const LANG_EVENT_NAME = "pc_lang_changed";

export function detectNaturalVisitorLang(): StudioLang {
  if (typeof window === "undefined") return "he";
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === "he" || saved === "en") return saved;

  // Automatic detection for local Israel vs Global visitors
  const navLang = (navigator.language || "").toLowerCase();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (navLang.startsWith("he") || navLang.startsWith("iw") || tz === "Asia/Jerusalem" || tz === "Israel") {
    return "he";
  }
  return "en";
}

export function getStoredStudioLang(): StudioLang {
  return detectNaturalVisitorLang();
}

export function setStoredStudioLang(lang: StudioLang): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent(LANG_EVENT_NAME, { detail: lang }));
}

export function useStudioLang(): {
  lang: StudioLang;
  isHe: boolean;
  dir: "ltr" | "rtl";
  setLang: (next: StudioLang) => void;
  toggleLang: () => void;
  t: (enText: string, heText: string) => string;
} {
  const [lang, setLangState] = useState<StudioLang>("he");

  useEffect(() => {
    const initial = detectNaturalVisitorLang();
    setLangState(initial);
    document.documentElement.lang = initial;
    document.documentElement.dir = initial === "he" ? "rtl" : "ltr";

    const handler = (e: Event) => {
      const custom = e as CustomEvent<StudioLang>;
      if (custom.detail === "en" || custom.detail === "he") {
        setLangState(custom.detail);
      }
    };
    window.addEventListener(LANG_EVENT_NAME, handler);
    return () => window.removeEventListener(LANG_EVENT_NAME, handler);
  }, []);

  const setLang = (next: StudioLang) => {
    setLangState(next);
    setStoredStudioLang(next);
  };

  const toggleLang = () => setLang(lang === "en" ? "he" : "en");
  const isHe = lang === "he";
  const dir = isHe ? "rtl" : "ltr";
  const t = (enText: string, heText: string) => (isHe ? heText : enText);

  return { lang, isHe, dir, setLang, toggleLang, t };
}
