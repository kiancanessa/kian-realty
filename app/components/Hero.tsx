"use client";
import { useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const { t } = useLang();
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
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #FAF6EE 0%, #F0E7D8 50%, #E7E4CE 100%)" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(107,138,66,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(107,138,66,0.4) 1px, transparent 1px)",
        backgroundSize: "80px 80px" }} />

      {/* Radial glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(107,138,66,0.07) 0%, transparent 70%)" }} />

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
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase", color: "#6B8A42" }}>
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
                : <span style={{ color: "#23221E" }}>{line}</span>}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: "rgba(35,34,30,0.45)", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7, fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)", letterSpacing: "0.02em" }}>
          {t.hero.sub}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <a href="#featured"
            style={{ padding: "16px 36px", background: "#6B8A42", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#85A857"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(107,138,66,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#6B8A42"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            {t.hero.cta1} →
          </a>
          <a href="#contact"
            style={{ padding: "16px 36px", border: "1px solid rgba(35,34,30,0.2)", color: "rgba(35,34,30,0.65)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#6B8A42"; (e.currentTarget as HTMLElement).style.color = "#6B8A42"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(35,34,30,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(35,34,30,0.65)"; }}>
            {t.hero.cta2}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(35,34,30,0.3)" }}>
          {t.hero.scroll}
        </span>
        <ChevronDown size={16} style={{ color: "#6B8A42", animation: "scrollDown 2s ease-in-out infinite" }} />
      </div>

      {/* Bottom fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, #FAF6EE, transparent)" }} />
    </section>
  );
}
