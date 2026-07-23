"use client";
import { useState, useEffect } from "react";
import { Locale } from "../lib/translations";
import type { AnnouncementContent } from "../lib/announcements";
import { GLASS, GLASS_SOLID } from "../lib/glass";
import { X, Calendar, MapPin, PlayCircle } from "lucide-react";

type ActiveAnnouncement = { id: number; video_url: string | null; content: AnnouncementContent };

const UI_TEXT = {
  en: { watchVideo: "Watch Event Video", close: "Close" },
  es: { watchVideo: "Ver Video del Evento", close: "Cerrar" },
};

function seenKey(id: number) {
  return `announcementSeen_${id}`;
}

export default function EventAnnouncement() {
  const [announcement, setAnnouncement] = useState<ActiveAnnouncement | null>(null);
  const [locale, setLocale] = useState<Locale>("en");
  const [visible, setVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    fetch("/api/announcements/active")
      .then(res => res.json())
      .then(data => setAnnouncement(data.announcement ?? null))
      .catch(() => setAnnouncement(null));
  }, []);

  useEffect(() => {
    if (!announcement) return;
    if (sessionStorage.getItem(seenKey(announcement.id))) return;
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, [announcement]);

  const dismiss = () => {
    setVisible(false);
    if (announcement) sessionStorage.setItem(seenKey(announcement.id), "1");
  };

  if (!announcement || !visible) return null;

  const t = announcement.content[locale];
  const ui = UI_TEXT[locale];

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,10,8,0.72)" }}
      onClick={dismiss}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...GLASS_SOLID,
          position: "relative", width: "min(600px, 100%)", maxHeight: "90vh", overflowY: "auto",
          borderRadius: 30,
          boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      >
        <div style={{ padding: "32px 32px 32px" }}>
          {/* Top row: eyebrow (wraps to its own line if needed) + language switch + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div className="sage-line" style={{ width: 32, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
                {t.eyebrow}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
              <div style={{ ...GLASS, display: "flex", borderRadius: 999, padding: 3, gap: 2 }}>
                {(["en", "es"] as const).map(lang => (
                  <button key={lang} onClick={() => setLocale(lang)}
                    style={{ padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s",
                      background: locale === lang ? "rgb(var(--accent))" : "transparent",
                      color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.5)",
                      fontWeight: locale === lang ? 600 : 400,
                    }}>
                    {lang}
                  </button>
                ))}
              </div>
              <button onClick={dismiss} aria-label={ui.close}
                style={{ ...GLASS, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgb(var(--ink))", flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(1.9rem, 5vw, 2.6rem)", letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: 8 }}>
            {t.title}
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontStyle: "italic", color: "rgba(var(--ink),0.5)", fontSize: "0.9rem", marginBottom: 28 }}>
            {t.subtitle}
          </p>

          <div className="event-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            {/* Left: details */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Calendar size={15} color="rgb(var(--accent))" />
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgb(var(--ink))", fontWeight: 500 }}>{t.dates}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={15} color="rgb(var(--accent))" />
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.65)" }}>{t.venue}</span>
                </div>
              </div>

              {t.activities.length > 0 && (
                <>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(var(--ink),0.45)", marginBottom: 10 }}>
                    {t.activitiesTitle}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {t.activities.map((a, i) => (
                      <span key={i} style={{ ...GLASS, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--ink))", padding: "6px 12px", borderRadius: 999 }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: price + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(t.priceLabel || t.price) && (
                <div style={{ ...GLASS, borderRadius: 18, padding: "16px 18px" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
                    {t.priceLabel}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "rgb(var(--accent))", marginBottom: 8 }}>{t.price}</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.66rem", color: "rgba(var(--ink),0.45)", lineHeight: 1.5 }}>
                    {t.priceNote}
                  </p>
                </div>
              )}

              {announcement.content.ctaUrl && t.cta && (
                <a href={announcement.content.ctaUrl} target={announcement.content.ctaUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ textAlign: "center", padding: "14px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  {t.cta}
                </a>
              )}
              {announcement.video_url && (
                <button onClick={() => setVideoOpen(true)}
                  style={{ ...GLASS, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 18px", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  <PlayCircle size={15} /> {ui.watchVideo}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {videoOpen && announcement.video_url && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 220, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.92)", padding: 20 }}
          onClick={() => setVideoOpen(false)}
        >
          <button onClick={() => setVideoOpen(false)} aria-label={ui.close}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#FAF6EE", cursor: "pointer", padding: 8, display: "flex" }}>
            <X size={20} />
          </button>
          <video
            src={announcement.video_url}
            controls
            autoPlay
            style={{ maxWidth: "min(420px, 90vw)", maxHeight: "85vh" }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
