"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "../lib/LangContext";
import { setConsent, storedConsent, trackingConfigured } from "../lib/analytics";
import { INTRO_DONE_EVENT } from "./IntroCurtain";
import { ANNOUNCEMENT_CLOSED_EVENT, announcementIsOpen } from "./EventAnnouncement";

/** Asks once whether analytics and advertising cookies may be used. Shown only
 *  when those tools are configured, and only to visitors who have not chosen.
 *  Both answers are equally easy to give. On a first visit it waits for the
 *  opening animation and for any announcement to be closed: two prompts at
 *  once is one too many. */
export default function ConsentBanner() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!trackingConfigured || storedConsent() !== null) return;
    let timer: ReturnType<typeof setTimeout>;
    const afterAnnouncement = () => { timer = setTimeout(() => setOpen(true), 700); };
    const show = () => {
      // By now an announcement, if there is one, has opened.
      timer = setTimeout(() => {
        if (announcementIsOpen()) window.addEventListener(ANNOUNCEMENT_CLOSED_EVENT, afterAnnouncement, { once: true });
        else setOpen(true);
      }, 1500);
    };
    if (window.__ecrIntroDone) show();
    else window.addEventListener(INTRO_DONE_EVENT, show, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener(INTRO_DONE_EVENT, show);
      window.removeEventListener(ANNOUNCEMENT_CLOSED_EVENT, afterAnnouncement);
    };
  }, []);

  if (!open) return null;
  const choose = (granted: boolean) => { setConsent(granted); setOpen(false); };

  return (
    <div className="consent" role="region" aria-label={t.consent.label}>
      <p>
        {t.consent.text}{" "}
        <Link href="/privacidad">{t.consent.policy}</Link>
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => choose(false)}>{t.consent.decline}</button>
        <button type="button" onClick={() => choose(true)}>{t.consent.accept}</button>
      </div>
    </div>
  );
}
