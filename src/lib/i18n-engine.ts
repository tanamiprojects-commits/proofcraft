"use client";

import { useEffect, useState } from "react";

export type StudioLang = "en" | "he";

const LANG_STORAGE_KEY = "pc_studio_lang_v1";
const LANG_EVENT_NAME = "pc_lang_changed";

export function getStoredStudioLang(): StudioLang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  return saved === "he" ? "he" : "en";
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
  const [lang, setLangState] = useState<StudioLang>("en");

  useEffect(() => {
    const initial = getStoredStudioLang();
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
