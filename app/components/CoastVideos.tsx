"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useLang } from "../lib/LangContext";

// Where each clip sits in the mosaic on a desktop. The pier is the widest,
// most "this is Rosarito" shot, so it gets the big tile; surf is the one
// vertical clip. Phones get a swipeable row instead (see globals.css).
const AREA: Record<string, string> = {
  muelle: "coast-a",
  surf: "coast-b",
  playa: "coast-c",
  atardecer: "coast-d",
};

/** "Vive Rosarito": short clips of the coast, as a mosaic.
 *
 *  Clips come from `scripts/videos-rosarito.py`. Each one plays only while it
 *  is on screen and pauses when it leaves, so four videos never run at once
 *  off-screen. With reduced motion or data saver nothing autoplays — the
 *  poster stays, with its play button. Every clip has its own pause button:
 *  moving content longer than 5 s needs a way to stop it (WCAG 2.2.2). */
export default function CoastVideos() {
  const { t } = useLang();
  const c = t.coast;

  return (
    <section id="rosarito" aria-labelledby="coast-title" className="coast-section">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="coast-head">
          <div data-reveal style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent-light))" }}>
              {c.eyebrow}
            </span>
          </div>
          <h2 id="coast-title" data-reveal="line" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.3rem, 5vw, 4.2rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#FAF6EE", maxWidth: 820, textWrap: "balance" }}>
            <span className="reveal-text">{c.title}</span>
          </h2>
          <p data-reveal style={{ "--reveal-delay": "150ms", fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(250,246,238,0.62)", maxWidth: 440 } as React.CSSProperties}>
            {c.lead}
          </p>
        </div>

        <ul className="coast-grid">
          {c.clips.map((clip, i) => (
            <li key={clip.slug} className={`coast-tile ${AREA[clip.slug] ?? ""}`} data-reveal="media"
              style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}>
              <Clip slug={clip.slug} title={clip.title} caption={clip.caption} playLabel={c.play} pauseLabel={c.pause} />
            </li>
          ))}
        </ul>

        <p style={{ marginTop: 18, fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(250,246,238,0.34)", textAlign: "right" }}>
          {c.credit}
        </p>
      </div>
    </section>
  );
}

function Clip({ slug, title, caption, playLabel, pauseLabel }: { slug: string; title: string; caption: string; playLabel: string; pauseLabel: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  // If the visitor paused it, coming back into view does not restart it.
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const auto = !reduced && !saveData;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && auto && !userPaused.current) video.play().catch(() => {});
        else if (!entry.isIntersecting) video.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(video);

    // Progress bar written straight to the DOM, never through React state.
    let frame = 0;
    const tick = () => {
      if (barRef.current && video.duration) barRef.current.style.scale = `${video.currentTime / video.duration} 1`;
      frame = requestAnimationFrame(tick);
    };
    const onPlay = () => { setPlaying(true); cancelAnimationFrame(frame); frame = requestAnimationFrame(tick); };
    const onPause = () => { setPlaying(false); cancelAnimationFrame(frame); };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { userPaused.current = false; video.play().catch(() => {}); }
    else { userPaused.current = true; video.pause(); }
  };

  const label = (playing ? pauseLabel : playLabel).replace("{name}", title);

  return (
    <figure className="coast-figure">
      <video
        ref={videoRef}
        src={`/videos/rosarito/${slug}.mp4`}
        poster={`/videos/rosarito/${slug}.webp`}
        muted loop playsInline preload="none" disablePictureInPicture
        aria-hidden="true"
        className="coast-video"
      />
      <div aria-hidden="true" className="coast-shade" />

      <button type="button" onClick={toggle} aria-label={label} className="coast-toggle">
        {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
      </button>

      <figcaption className="coast-caption">
        <span className="coast-title">{title}</span>
        <span className="coast-sub">{caption}</span>
        <span aria-hidden="true" className="coast-bar"><span ref={barRef} /></span>
      </figcaption>
    </figure>
  );
}
