"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/LangContext";
import { useQuiz } from "../lib/QuizContext";
import { ChevronDown, Pause, Play, Sparkles } from "lucide-react";
import { INTRO_DONE_EVENT } from "./IntroCurtain";

/** Waves over the rocks off Rosarito, a seamless loop (scripts/videos-rosarito.py). */
const HERO_POSTER = "/videos/hero-waves.webp";

/** Background video: the poster paints with the page, the video is chosen
 *  and loaded in the browser (720p on phones) and fades in over the poster
 *  once it can play, so there is no jump. Not loaded at all with reduced
 *  motion or data saver. Paused off-screen and in a hidden tab, and there is
 *  a pause button — endless motion needs a way to stop it (WCAG 2.2.2). */
function useHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return;

    // Set from here rather than in the markup, so the server never tells a
    // visitor who will not see the video to download it.
    video.src = window.matchMedia("(max-width: 767px)").matches ? "/videos/hero-waves-720.mp4" : "/videos/hero-waves-1080.mp4";
    // Enabling from the effect is the point: the server cannot know whether
    // this visit gets the video.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    const onReady = () => setReady(true);
    video.addEventListener("canplay", onReady, { once: true });

    const play = () => { if (!userPaused.current) video.play().catch(() => {}); };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : video.pause()), { threshold: 0.1 });
    io.observe(video);
    const onVisibility = () => (document.hidden ? video.pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("canplay", onReady);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { userPaused.current = false; video.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; video.pause(); setPaused(true); }
  };

  return { videoRef, enabled, ready, paused, toggle };
}

export default function Hero() {
  const { t } = useLang();
  const { openQuiz } = useQuiz();
  const { videoRef, enabled, ready, paused, toggle } = useHeroVideo();

  // The entrance waits for the opening curtain; played underneath it, nobody
  // would see it.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const go = () => setEntered(true);
    if (window.__ecrIntroDone) { go(); return; }
    window.addEventListener(INTRO_DONE_EVENT, go, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, go);
  }, []);

  return (
    <section className={`hero${entered ? " hero-in" : ""}`} style={{ position: "relative", height: "100svh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Waves. The poster is plain CSS background so it paints with the
          page; the video fades in over it once it can play. The scrim keeps
          the headline legible over the brightest foam. */}
      <div aria-hidden className="hero-media" style={{ backgroundImage: `url(${HERO_POSTER})` }}>
        <video ref={videoRef} muted loop playsInline preload="auto" disablePictureInPicture
          className={`hero-video${ready ? " is-ready" : ""}`} />
        <div className="hero-scrim" />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div className="hero-step" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32, "--step": 0 } as React.CSSProperties}>
          <div className="sage-line" />
          <span className="hero-eyebrow" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            {t.hero.tagline}
          </span>
          <div className="sage-line" />
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1, marginBottom: 28, fontSize: "clamp(3rem, 9vw, 8rem)", letterSpacing: "-0.02em" }}>
          {t.hero.headline.split("\n").map((line, i) => (
            // Each line rises out of its own mask, one after the other.
            <span key={i} className="hero-line">
              <span style={{ "--line": i } as React.CSSProperties}>
                {i === 1
                  ? <em className="sage-shimmer" style={{ fontStyle: "normal" }}>{line}</em>
                  : <span style={{ color: "rgb(var(--ink))" }}>{line}</span>}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p className="hero-step" style={{ "--step": 3, fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "rgba(var(--ink),0.72)", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7, fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)", letterSpacing: "0.02em" } as React.CSSProperties}>
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div className="hero-step" style={{ "--step": 4, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "center" } as React.CSSProperties}>
          <a href="#featured"
            style={{ padding: "16px 36px", background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(var(--accent),0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            {t.hero.cta1} →
          </a>
          <a href="#contact"
            style={{ padding: "16px 36px", border: "1px solid rgba(var(--ink),0.2)", color: "rgba(var(--ink),0.65)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgb(var(--accent))"; (e.currentTarget as HTMLElement).style.color = "rgb(var(--accent))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--ink),0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(var(--ink),0.65)"; }}>
            {t.hero.cta2}
          </a>
        </div>

        {/* Quiz CTA. Repeated here because on phones — most of the traffic —
            the navbar version is hidden behind the burger menu. */}
        <div className="hero-step" style={{ "--step": 5, display: "flex", justifyContent: "center", marginTop: 22 } as React.CSSProperties}>
          <button onClick={openQuiz} className="quiz-cta"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "15px 32px", border: "none", borderRadius: 999, background: "rgb(var(--accent))", cursor: "pointer", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"; }}>
            <Sparkles size={15} /> {t.nav.cta}
          </button>
        </div>
      </div>

      {enabled && (
        <button type="button" onClick={toggle} className="hero-pause" aria-label={paused ? t.hero.playVideo : t.hero.pauseVideo}>
          {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
        </button>
      )}

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(var(--ink),0.6)" }}>
          {t.hero.scroll}
        </span>
        <ChevronDown size={16} style={{ color: "rgb(var(--accent))", animation: "scrollDown 2s ease-in-out infinite" }} />
      </div>

      {/* Bottom fade into the page — dark theme only. On the cream page a
          fade from dark water passes through a muddy grey, so there the
          video simply ends in a clean edge. */}
      <div className="hero-fade" aria-hidden />
    </section>
  );
}
