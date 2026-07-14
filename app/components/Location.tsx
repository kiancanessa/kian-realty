"use client";
import { useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";

export default function Location() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 100));
      });
    }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="location" ref={sectionRef} style={{ padding: "112px 24px", background: "rgb(var(--bg-alt))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{t.labels.location}</span>
            <div className="sage-line" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.location.title}
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.38)", fontSize: "0.88rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            {t.location.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="location-grid">
          {/* Map */}
          <div className="reveal" style={{ border: "1px solid rgba(var(--accent),0.12)", overflow: "hidden", height: 420, position: "relative" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110943.85506978478!2d-117.13505673203128!3d32.33292814013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b5d5cc7a3101%3A0xbf24fb6f27f22a6d!2sRosarito%2C%20Baja%20California%2C%20Mexico!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              width="100%" height="100%"
              style={{ border: 0, filter: "saturate(0.85) contrast(0.95)" }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"
            />
          </div>

          {/* Nearby */}
          <div className="reveal">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 24 }}>{t.labels.nearby}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {t.location.nearby.map((place, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(var(--accent),0.1)", paddingRight: i % 2 === 0 ? 24 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "1.1rem" }}>{place.emoji}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.58)" }}>{place.name}</span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(var(--accent),0.6)", letterSpacing: "0.06em", whiteSpace: "nowrap", marginLeft: 8 }}>{place.dist}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(var(--accent),0.1)", display: "flex", gap: 32 }}>
              {t.location.highlights.map((h, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", color: "rgb(var(--accent))", fontWeight: 300 }}>{h.value}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(var(--ink),0.38)", lineHeight: 1.4, marginTop: 2 }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
