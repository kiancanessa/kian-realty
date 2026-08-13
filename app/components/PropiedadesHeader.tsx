"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLang } from "../lib/LangContext";

export default function PropiedadesHeader() {
  const { t } = useLang();
  const router = useRouter();

  // Go back where they came from, but fall back to home when this page was
  // opened directly (shared link, new tab) and there is no history to pop.
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <>
      <button
        onClick={goBack}
        aria-label={t.property.goBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28,
          padding: "9px 18px 9px 14px", borderRadius: 999, cursor: "pointer",
          border: "1px solid rgba(var(--accent),0.25)", background: "transparent",
          color: "rgb(var(--accent))", fontFamily: "'Jost', sans-serif",
          fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase",
          transition: "background 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.background = "rgba(var(--accent),0.06)";
          el.style.borderColor = "rgb(var(--accent))";
          el.style.transform = "translateX(-3px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.background = "transparent";
          el.style.borderColor = "rgba(var(--accent),0.25)";
          el.style.transform = "translateX(0)";
        }}
      >
        <ArrowLeft size={15} /> {t.property.goBack}
      </button>

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
