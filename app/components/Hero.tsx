"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/LangContext";
import { useQuiz } from "../lib/QuizContext";
import { ChevronDown, Pause, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import { INTRO_DONE_EVENT } from "./IntroCurtain";

/** Waves over the rocks off Rosarito, a seamless loop (scripts/videos-rosarito.py). */
const HERO_POSTER = "/videos/hero-waves.webp";
/** The drone footage has no sound of its own; this is a separate recording
 *  of waves on rocks, looped the same way. */
const HERO_SOUND = "/videos/hero-waves.m4a";
const SOUND_PREF_KEY = "ecr-hero-sound";
const SOUND_VOLUME = 0.55;
const SOUND_FADE_MS = 1200;

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

/** The sea, heard. Never starts by itself: browsers block sound nobody asked
 *  for, and a page that suddenly makes noise is the fastest way to lose a
 *  visitor. It plays once the visitor turns it on, and the choice is
 *  remembered: on the next visit it resumes at their first click or key.
 *  It fades in and out rather than cutting, and goes quiet whenever the
 *  waves do: scrolled past the hero, tab in the background, video paused. */
function useHeroSound(videoRef: React.RefObject<HTMLVideoElement | null>, videoPaused: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef(0);
  const [on, setOn] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  const audible = on && inView && tabVisible && !videoPaused;

  useEffect(() => {
    // A timer, not requestAnimationFrame: frames stop in a background tab,
    // and a fade-out that never finishes is sound that never stops.
    const fadeTo = (audio: HTMLAudioElement, target: number) => {
      clearInterval(fadeRef.current);
      const from = audio.volume;
      const start = performance.now();
      fadeRef.current = window.setInterval(() => {
        const k = Math.min(1, (performance.now() - start) / SOUND_FADE_MS);
        audio.volume = from + (target - from) * k;
        if (k < 1) return;
        clearInterval(fadeRef.current);
        if (target === 0) audio.pause();
      }, 30);
    };

    if (!audible) {
      const audio = audioRef.current;
      if (!audio) return;
      // Leaving the tab cuts at once; everything else fades.
      if (document.hidden) { clearInterval(fadeRef.current); audio.pause(); audio.volume = 0; }
      else fadeTo(audio, 0);
      return;
    }
    if (!audioRef.current) {
      const created = new Audio(HERO_SOUND);
      created.loop = true;
      created.volume = 0;
      audioRef.current = created;
    }
    const audio = audioRef.current;
    const start = () => audio.play().then(() => fadeTo(audio, SOUND_VOLUME));
    // Remembered as on, but nobody has touched this visit yet: the browser
    // lets it start at the first click or key press.
    const resume = () => { start().catch(() => {}); };
    start().catch(() => {
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [audible]);

  useEffect(() => {
    try {
      // Restoring a saved choice is exactly what an effect is for.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(SOUND_PREF_KEY) === "on") setOn(true);
    } catch { /* storage blocked: the sound simply starts off */ }

    const target = videoRef.current;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    if (target) io.observe(target);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(fadeRef.current);
      audioRef.current?.pause();
    };
  }, [videoRef]);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try { localStorage.setItem(SOUND_PREF_KEY, next ? "on" : "off"); } catch { /* not remembered */ }
  };

  return { soundOn: on, toggleSound: toggle };
}

export default function Hero() {
  const { t } = useLang();
  const { openQuiz } = useQuiz();
  const { videoRef, enabled, ready, paused, toggle } = useHeroVideo();
  const { soundOn, toggleSound } = useHeroSound(videoRef, paused);

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
        <div className="hero-controls">
          <button type="button" onClick={toggle} className="hero-pause" aria-label={paused ? t.hero.playVideo : t.hero.pauseVideo}>
            {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
          </button>
          <button type="button" onClick={toggleSound} className={`hero-sound${soundOn ? " is-on" : ""}`}
            aria-pressed={soundOn} aria-label={t.hero.sound}>
            {soundOn ? <Volume2 size={15} aria-hidden /> : <VolumeX size={15} aria-hidden />}
            <span className="hero-sound-bars" aria-hidden><i /><i /><i /></span>
            <span className="hero-sound-label" aria-hidden>{soundOn ? t.hero.soundOffShort : t.hero.soundOnShort}</span>
          </button>
        </div>
      )}

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span className="hero-scroll-label" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(var(--ink),0.6)" }}>
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
