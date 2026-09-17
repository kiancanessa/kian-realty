"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export const INTRO_DONE_EVENT = "ecr:intro-done";

declare global {
  interface Window { __ecrIntroDone?: boolean }
}

function markIntroDone() {
  window.__ecrIntroDone = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

/** Opening animation: the logo draws itself, then the curtain lifts.
 *
 *  Rendered in the server HTML rather than after hydration — waiting for React
 *  would show the page first and drop the curtain on top of it half a second
 *  later. The inline script in layout.tsx decides before first paint whether
 *  it should play at all (once per session, never with reduced motion) and
 *  marks <html> accordingly; this component only runs the clock. */
export default function IntroCurtain() {
  const [lifting, setLifting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-intro")) {
      setDone(true);
      root.classList.remove("intro-lock");
      markIntroDone();
      return;
    }

    const lift = setTimeout(() => setLifting(true), 1500);
    const end = setTimeout(() => {
      setDone(true);
      root.classList.remove("intro-lock");
      markIntroDone();
    }, 2300);

    return () => {
      clearTimeout(lift);
      clearTimeout(end);
      root.classList.remove("intro-lock");
    };
  }, []);

  if (done) return null;

  return (
    <div className={`intro-curtain${lifting ? " is-lifting" : ""}`} aria-hidden>
      <div className="intro-mark">
        <Logo size={150} />
        <div className="intro-word">
          <span className="intro-word-main">El Casa Rosarito</span>
          <span className="intro-word-sub">Management &amp; Development Group</span>
        </div>
      </div>
    </div>
  );
}
