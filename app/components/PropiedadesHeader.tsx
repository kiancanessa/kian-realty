"use client";
import { useLang } from "../lib/LangContext";

export default function PropiedadesHeader() {
  const { t } = useLang();
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div className="sage-line" />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{t.labels.portfolio}</span>
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
        {t.property.allProperties}
      </h1>
      <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)", fontSize: "0.9rem", maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
        {t.property.allPropertiesDesc}
      </p>
    </>
  );
}
