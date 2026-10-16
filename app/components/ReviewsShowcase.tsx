"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { GOOGLE_PROFILE_URL } from "../lib/googleLinks";
import Avatar from "./Avatar";
import GoogleG from "./GoogleG";

export type Review = {
  id: number; name: string; rating: number; comment_en: string; comment_es: string; language: "en" | "es";
  source: "site" | "google"; author_url: string | null; photo_url: string | null;
};
export type GoogleSummary = { rating: number; total: number };

/** Time on screen before the next review: enough to read it, but never
 *  stuck for half a minute on a long one. */
const readingTime = (text: string) => Math.min(15000, Math.max(6500, 3500 + text.length * 22));
const COUNT_UP_MS = 1100;

const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    cb => { const mq = window.matchMedia(REDUCED); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** 0 → target, once, when it comes into view. */
function useCountUp(target: number, run: boolean, reduced: boolean): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!run || reduced) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / COUNT_UP_MS);
      setValue(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, reduced, target]);
  return reduced ? target : value;
}

/** Google's own profile picture when it sent one; the initials otherwise (and
 *  if the picture fails to load). */
function ReviewerAvatar({ name, photoUrl, size }: { name: string; photoUrl: string | null; size: number }) {
  const [broken, setBroken] = useState(false);
  if (!photoUrl || broken) return <Avatar name={name} size={size} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl} alt="" width={size} height={size} referrerPolicy="no-referrer" onError={() => setBroken(true)}
    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
}

function Stars({ value, size, className }: { value: number; size: number; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-flex", gap: size > 14 ? 4 : 2 }} aria-hidden>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= value ? "currentColor" : "none"} strokeWidth={1.5} className="rv-star" style={{ "--s": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

export default function ReviewsShowcase({ reviews, google }: { reviews: Review[]; google: GoogleSummary | null }) {
  const { t, locale } = useLang();
  const tt = t.testimonials;
  const reduced = useReducedMotion();
  const n = reviews.length;

  const rootRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabOn, setTabOn] = useState(true);
  const [entered, setEntered] = useState(false);

  const current = Math.min(active, n - 1);
  const textOf = (r: Review, original: boolean) =>
    (original ? r.language === "en" : locale === "en") ? r.comment_en : r.comment_es;

  // Moves on its own only while it is being looked at: not off-screen, not in a
  // background tab, not while the pointer or keyboard is on it, not while the
  // original text is open, and never with reduced motion. (WCAG 2.2.2)
  const playing = n > 1 && !reduced && !userPaused && !hovered && !focused && inView && tabOn && !showOriginal;

  const go = (to: number, d?: 1 | -1) => {
    const target = ((to % n) + n) % n;
    if (target === current) return;
    setDir(d ?? (target > current ? 1 : -1));
    setPrev(current);
    setActive(target);
    setShowOriginal(false);
  };
  const next = () => go(current + 1, 1);
  const back = () => go(current - 1, -1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) setEntered(true); }, { threshold: 0.3 });
    io.observe(root);
    const onVisibility = () => setTabOn(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  // Keep the chosen review in view inside the strip, without moving the page.
  useEffect(() => {
    const rail = railRef.current;
    const pill = rail?.children[current] as HTMLElement | undefined;
    if (rail && pill) rail.scrollTo({ left: pill.offsetLeft - (rail.clientWidth - pill.clientWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  }, [current, reduced]);

  const score = useCountUp(google?.rating ?? 0, entered, reduced);

  if (n === 0) return null;
  const currentText = textOf(reviews[current], showOriginal);
  const note = (r: Review) => tt.translatedNote.replace("{lang}", r.language === "en" ? tt.langEn : tt.langEs);
  const faces = reviews.slice(0, 5);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduced) return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - box.top}px`);
  };

  return (
    <section ref={rootRef} className={`rv${google ? "" : " rv--solo"}`} data-in={entered} aria-roledescription="carousel" aria-label={tt.carouselLabel}
      onPointerEnter={e => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={e => e.pointerType === "mouse" && setHovered(false)}
      onFocus={e => setFocused(e.target.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onKeyDown={e => {
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); back(); }
      }}>

      {google && (
        <aside className="rv-panel">
          <div className="rv-score" aria-hidden>{score.toFixed(1)}</div>
          <Stars value={Math.round(google.rating)} size={20} className="rv-stars" />
          <p className="rv-total">
            <span className="rv-sr">{tt.ratedOutOf.replace("{rating}", google.rating.toFixed(1))}. </span>
            {google.total === 1 ? tt.googleReviewsOne : tt.googleReviewsMany.replace("{n}", String(google.total))}
          </p>
          <div className="rv-faces" aria-hidden>
            {faces.map((r, i) => (
              <span key={r.id} className="rv-face" style={{ "--s": i } as React.CSSProperties}>
                <ReviewerAvatar name={r.name} photoUrl={r.photo_url} size={36} />
              </span>
            ))}
          </div>
          <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="rv-link">
            <GoogleG size={15} /> {tt.seeOnGoogle} <ArrowUpRight size={14} aria-hidden />
          </a>
        </aside>
      )}

      <div className="rv-main">
        <div className="rv-stage" onPointerMove={onPointerMove}
          onPointerDown={e => { if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY }; }}
          onPointerUp={e => {
            const s = swipe.current; swipe.current = null;
            if (!s) return;
            const dx = e.clientX - s.x, dy = e.clientY - s.y;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) (dx < 0 ? next : back)();
          }}
          onPointerCancel={() => { swipe.current = null; }}>

          <div className="rv-top">
            <span className="rv-badge">
              {reviews[current].source === "google" ? <><GoogleG size={14} /> {tt.googleBadge}</> : <Quote size={14} aria-hidden />}
            </span>
            <div className="rv-controls">
              <span className="rv-count" aria-hidden>{String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
              {n > 1 && (
                <>
                  <button type="button" className="rv-btn" onClick={back} aria-label={tt.prev}><ChevronLeft size={20} aria-hidden /></button>
                  <button type="button" className="rv-btn" onClick={next} aria-label={tt.next}><ChevronRight size={20} aria-hidden /></button>
                  {!reduced && (
                    <button type="button" className="rv-btn" onClick={() => setUserPaused(p => !p)} aria-pressed={userPaused} aria-label={userPaused ? tt.play : tt.pause}>
                      {userPaused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="rv-slides" aria-live={playing ? "off" : "polite"}>
            {reviews.map((r, i) => {
              const isActive = i === current;
              const text = textOf(r, isActive && showOriginal);
              const size = text.length <= 260 ? "lg" : text.length <= 560 ? "md" : "sm";
              return (
                <div key={r.id} data-dir={dir}
                  className={`rv-slide${isActive ? " is-active" : ""}${!isActive && i === prev ? " is-leaving" : ""}`}
                  role="group" aria-roledescription={tt.slideLabel}
                  aria-label={tt.reviewOf.replace("{n}", String(i + 1)).replace("{total}", String(n))}
                  aria-hidden={!isActive} inert={!isActive}>
                  <Quote className="rv-glyph" aria-hidden />
                  <blockquote className={`rv-quote rv-quote--${size} rv-rise`} style={{ "--i": 0 } as React.CSSProperties}>{text}</blockquote>
                  <div className="rv-meta rv-rise" style={{ "--i": 1 } as React.CSSProperties}>
                    <div className="rv-who">
                      <ReviewerAvatar name={r.name} photoUrl={r.photo_url} size={44} />
                      {r.source === "google" ? (
                        <a className="rv-name" href={r.author_url || GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">{r.name}</a>
                      ) : <span className="rv-name">{r.name}</span>}
                    </div>
                    <span className="rv-rating" role="img" aria-label={tt.ratedOutOf.replace("{rating}", String(r.rating))}>
                      <Stars value={r.rating} size={16} />
                    </span>
                  </div>
                  {r.language !== locale && (
                    <p className="rv-note rv-rise" style={{ "--i": 2 } as React.CSSProperties}>
                      <span>{note(r)}</span>
                      <button type="button" onClick={() => setShowOriginal(o => !o)} aria-pressed={showOriginal}>
                        {showOriginal ? tt.viewTranslation : tt.viewOriginal}
                      </button>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {n > 1 && (
          <div className="rv-rail" ref={railRef}>
            {reviews.map((r, i) => (
              <button key={r.id} type="button" className="rv-pill" onClick={() => go(i)}
                aria-current={i === current} aria-label={tt.goTo.replace("{name}", r.name)}>
                <ReviewerAvatar name={r.name} photoUrl={r.photo_url} size={34} />
                <span className="rv-pill-text">
                  <span className="rv-pill-name">{r.name}</span>
                  <span className="rv-pill-meta">
                    <Stars value={r.rating} size={11} />
                    {r.source === "google" && <GoogleG size={11} />}
                  </span>
                </span>
                {i === current && !reduced && (
                  <span key={current} className="rv-pbar" aria-hidden
                    style={{ "--rv-dur": `${readingTime(currentText)}ms`, animationPlayState: playing ? "running" : "paused" } as React.CSSProperties}
                    onAnimationEnd={next} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
