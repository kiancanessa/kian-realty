"use client";
import { useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";
import { useQuiz } from "../lib/QuizContext";
import { ChevronDown, Sparkles } from "lucide-react";

export default function Hero() {
  const { t } = useLang();
  const { openQuiz } = useQuiz();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    setTimeout(() => {
      el.style.transition = "opacity 1.2s ease, transform 1.2s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
  }, []);

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgb(var(--bg)) 0%, rgb(var(--bg-alt)) 50%, rgba(var(--accent),0.18) 100%)" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(var(--accent),0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent),0.4) 1px, transparent 1px)",
        backgroundSize: "80px 80px" }} />

      {/* Radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(var(--accent),0.07) 0%, transparent 70%)" }} />

      {/* Video (when you have one) */}
      <video autoPlay muted loop playsInline poster="/images/hero-poster.jpg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}>
        {/* <source src="/videos/hero.mp4" type="video/mp4" /> */}
      </video>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32, opacity: 0, animation: "fadeIn 1s ease 0.2s forwards" }}>
          <div className="sage-line" />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            {t.hero.tagline}
          </span>
          <div className="sage-line" />
        </div>

        {/* Headline */}
        <h1 ref={headlineRef} style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1, marginBottom: 28, fontSize: "clamp(3rem, 9vw, 8rem)", letterSpacing: "-0.02em" }}>
          {t.hero.headline.split("\n").map((line, i) => (
            <span key={i} style={{ display: "block" }}>
              {i === 1
                ? <em className="sage-shimmer" style={{ fontStyle: "normal" }}>{line}</em>
                : <span style={{ color: "rgb(var(--ink))" }}>{line}</span>}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "rgba(var(--ink),0.45)", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7, fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)", letterSpacing: "0.02em" }}>
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "center" }}>
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
        <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <button onClick={openQuiz} className="quiz-cta"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "15px 32px", border: "none", borderRadius: 999, background: "rgb(var(--accent))", cursor: "pointer", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"; }}>
            <Sparkles size={15} /> {t.nav.cta}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(var(--ink),0.3)" }}>
          {t.hero.scroll}
        </span>
        <ChevronDown size={16} style={{ color: "rgb(var(--accent))", animation: "scrollDown 2s ease-in-out infinite" }} />
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, rgb(var(--bg)), transparent)" }} />
    </section>
  );
}
