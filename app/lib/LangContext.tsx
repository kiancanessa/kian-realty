"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, translations } from "./translations";
import { langOfPath, twinPath } from "./seoSlugs";

type LangContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof translations)["en"];
};

const LangContext = createContext<LangContextType | null>(null);

// Most links on this site load the next page from scratch, which would reset
// the language to English. The visitor's last language is kept on the device.
const LANG_KEY = "ecr-lang";
function readLang(): Locale | null {
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === "es" || v === "en" ? v : null;
  } catch {
    return null;
  }
}
function saveLang(l: Locale): void {
  try { localStorage.setItem(LANG_KEY, l); } catch { /* it just is not remembered */ }
}

/** The language of the site. An address that belongs to a language (/es, /es/…,
 *  /en/…) decides it; everywhere else it is the visitor's choice, English at
 *  first. Switching language on a page that has a twin goes to the twin, so
 *  the address always matches what is on the screen. */
export function LangProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pathLang = langOfPath(pathname);
  const [choice, setChoice] = useState<Locale>(pathLang ?? "en");
  const [seenPathLang, setSeenPathLang] = useState(pathLang);

  // Arriving on a /es or /en address makes that the visitor's language from
  // here on, on the pages that have no language of their own. Only when the
  // address changes: while a language switch is still navigating, the old
  // address must not undo the choice that was just made.
  if (pathLang !== seenPathLang) {
    setSeenPathLang(pathLang);
    if (pathLang) setChoice(pathLang);
  }

  // A language-specific address is remembered; anywhere else the remembered
  // language is restored (after load: the server cannot know it).
  useEffect(() => {
    if (pathLang) { saveLang(pathLang); return; }
    const saved = readLang();
    // Restoring a stored choice is exactly what an effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setChoice(saved);
  }, [pathLang]);

  const setLocale = (next: Locale) => {
    setChoice(next);
    saveLang(next);
    const twin = twinPath(pathname, next);
    if (twin) router.push(twin);
  };

  // Screen readers and translation tools read this.
  useEffect(() => { document.documentElement.lang = choice; }, [choice]);

  return (
    <LangContext.Provider value={{ locale: choice, setLocale, t: translations[choice] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
