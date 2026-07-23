"use client";
import { X, Calendar, MapPin, PlayCircle, Plus } from "lucide-react";
import { GLASS, GLASS_SOLID } from "../../lib/glass";
import Editable from "../admin/Editable";
import type { AnnouncementContent, AnnouncementLocaleContent, AnnouncementTemplateKey } from "../../lib/announcements";
import type { Locale } from "../../lib/translations";

const UI_TEXT = {
  en: { watchVideo: "Watch Event Video", close: "Close", addActivity: "+ Add", imageHint: "Paste image URL…", videoHint: "Paste video URL (e.g. /videos/file.mp4)…", ctaHint: "Paste button link (mailto:… or https://…)…" },
  es: { watchVideo: "Ver Video del Evento", close: "Cerrar", addActivity: "+ Agregar", imageHint: "Pega la URL de la imagen…", videoHint: "Pega la URL del video (ej. /videos/archivo.mp4)…", ctaHint: "Pega el enlace del botón (mailto:… o https://…)…" },
};

export default function AnnouncementCard({
  content, videoUrl, imageUrl, ctaUrl, template, locale, onLocaleChange,
  editable = false, onFieldChange, onActivitiesChange, onMetaChange,
  onClose, onWatchVideo, forceMobile,
}: {
  content: AnnouncementContent;
  videoUrl: string | null;
  imageUrl: string | null;
  ctaUrl: string;
  template: AnnouncementTemplateKey;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  editable?: boolean;
  onFieldChange?: (locale: Locale, field: keyof AnnouncementLocaleContent, value: string) => void;
  onActivitiesChange?: (locale: Locale, activities: string[]) => void;
  onMetaChange?: (patch: { image_url?: string; video_url?: string; ctaUrl?: string }) => void;
  onClose?: () => void;
  onWatchVideo?: () => void;
  forceMobile?: boolean;
}) {
  const t = content[locale];
  const ui = UI_TEXT[locale];
  const twoCol = forceMobile === undefined ? undefined : !forceMobile;

  const field = (key: keyof AnnouncementLocaleContent, style: React.CSSProperties, placeholder?: string) =>
    editable ? (
      <Editable value={t[key] as string} onChange={v => onFieldChange?.(locale, key, v)} placeholder={placeholder} style={style} />
    ) : (
      <span style={style}>{t[key] as string}</span>
    );

  const activities = t.activities;
  const setActivity = (i: number, v: string) => {
    const next = [...activities];
    next[i] = v;
    onActivitiesChange?.(locale, next);
  };
  const removeActivity = (i: number) => onActivitiesChange?.(locale, activities.filter((_, idx) => idx !== i));
  const addActivity = () => onActivitiesChange?.(locale, [...activities, locale === "es" ? "Nueva actividad" : "New activity"]);

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        ...GLASS_SOLID,
        position: "relative", width: "min(600px, 100%)", maxHeight: editable ? undefined : "90vh", overflowY: editable ? "visible" : "auto",
        borderRadius: 30,
        boxShadow: "0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      <div style={{ padding: "32px 32px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div className="sage-line" style={{ width: 32, flexShrink: 0 }} />
            {field("eyebrow", { fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgb(var(--accent))" }, "EYEBROW")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
            <div style={{ ...GLASS, display: "flex", borderRadius: 999, padding: 3, gap: 2 }}>
              {(["en", "es"] as const).map(lang => (
                <button key={lang} onClick={() => onLocaleChange(lang)}
                  style={{ padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s",
                    background: locale === lang ? "rgb(var(--accent))" : "transparent",
                    color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.5)",
                    fontWeight: locale === lang ? 600 : 400,
                  }}>
                  {lang}
                </button>
              ))}
            </div>
            {onClose && (
              <button onClick={onClose} aria-label={ui.close}
                style={{ ...GLASS, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgb(var(--ink))", flexShrink: 0 }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {template === "image" && (
          <div style={{ position: "relative", height: 180, borderRadius: 18, overflow: "hidden", marginBottom: 20, background: "rgba(var(--accent),0.08)", border: "1px dashed rgba(var(--accent),0.25)" }}>
            {imageUrl && <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            {editable && (
              <input value={imageUrl ?? ""} placeholder={ui.imageHint} onChange={e => onMetaChange?.({ image_url: e.target.value })}
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px", background: "rgba(10,10,8,0.65)", color: "#FAF6EE", border: "none", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem" }} />
            )}
          </div>
        )}

        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: template === "minimal" ? "clamp(1.7rem, 5vw, 2.3rem)" : "clamp(1.9rem, 5vw, 2.6rem)", letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: 8, textAlign: template === "minimal" ? "center" : "left" }}>
          {field("title", { display: "block" }, locale === "es" ? "Título" : "Title")}
        </h2>
        <div style={{ fontFamily: "'Jost', sans-serif", fontStyle: "italic", color: "rgba(var(--ink),0.5)", fontSize: "0.9rem", marginBottom: 28, textAlign: template === "minimal" ? "center" : "left" }}>
          {field("subtitle", {}, locale === "es" ? "Subtítulo" : "Subtitle")}
        </div>

        {template === "classic" && (
          <div className={forceMobile === undefined ? "event-layout" : undefined} style={{ display: "grid", gridTemplateColumns: twoCol === undefined ? "1fr" : twoCol ? "1.15fr 1fr" : "1fr", gap: 24 }}>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Calendar size={15} color="rgb(var(--accent))" style={{ flexShrink: 0 }} />
                  {field("dates", { fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgb(var(--ink))", fontWeight: 500 }, locale === "es" ? "Fechas" : "Dates")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={15} color="rgb(var(--accent))" style={{ flexShrink: 0 }} />
                  {field("venue", { fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.65)" }, locale === "es" ? "Lugar" : "Venue")}
                </div>
              </div>

              {(activities.length > 0 || editable) && (
                <>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(var(--ink),0.45)", marginBottom: 10 }}>
                    {field("activitiesTitle", {}, locale === "es" ? "Título actividades" : "Activities title")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {activities.map((a, i) => (
                      <div key={i} style={{ ...GLASS, position: "relative", display: "flex", alignItems: "center", borderRadius: 999 }}>
                        {editable ? (
                          <Editable value={a} onChange={v => setActivity(i, v)} as="span"
                            style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--ink))", padding: "6px 12px" }} />
                        ) : (
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--ink))", padding: "6px 12px" }}>{a}</span>
                        )}
                        {editable && (
                          <button onClick={() => removeActivity(i)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(var(--error),0.8)", paddingRight: 8, display: "flex" }}>
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                    {editable && (
                      <button onClick={addActivity}
                        style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 999, border: "1px dashed rgba(var(--accent),0.4)", background: "none", cursor: "pointer", color: "rgb(var(--accent))", padding: "6px 12px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem" }}>
                        <Plus size={12} /> {ui.addActivity}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ ...GLASS, borderRadius: 18, padding: "16px 18px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
                  {field("priceLabel", {}, locale === "es" ? "Etiqueta de precio" : "Price label")}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", color: "rgb(var(--accent))", marginBottom: 8 }}>
                  {field("price", {}, locale === "es" ? "Precio" : "Price")}
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.66rem", color: "rgba(var(--ink),0.45)", lineHeight: 1.5 }}>
                  {field("priceNote", { display: "block" }, locale === "es" ? "Nota de precio" : "Price note")}
                </div>
              </div>

              <CtaButton editable={editable} ctaUrl={ctaUrl} onMetaChange={onMetaChange} ui={ui}>
                {field("cta", { color: "#FAF6EE" }, locale === "es" ? "Texto del botón" : "Button text")}
              </CtaButton>
              <VideoButton editable={editable} videoUrl={videoUrl} onMetaChange={onMetaChange} onWatchVideo={onWatchVideo} ui={ui} />
            </div>
          </div>
        )}

        {template === "image" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={14} color="rgb(var(--accent))" style={{ flexShrink: 0 }} />
                {field("dates", { fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))" }, locale === "es" ? "Fechas" : "Dates")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MapPin size={14} color="rgb(var(--accent))" style={{ flexShrink: 0 }} />
                {field("venue", { fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.65)" }, locale === "es" ? "Lugar" : "Venue")}
              </div>
            </div>
            <CtaButton editable={editable} ctaUrl={ctaUrl} onMetaChange={onMetaChange} ui={ui}>
              {field("cta", { color: "#FAF6EE" }, locale === "es" ? "Texto del botón" : "Button text")}
            </CtaButton>
          </div>
        )}

        {template === "minimal" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.7)" }}>
              {field("dates", {}, locale === "es" ? "Fechas" : "Dates")}
              <span style={{ opacity: 0.4 }}>·</span>
              {field("venue", {}, locale === "es" ? "Lugar" : "Venue")}
            </div>
            <div style={{ width: "min(260px, 100%)" }}>
              <CtaButton editable={editable} ctaUrl={ctaUrl} onMetaChange={onMetaChange} ui={ui}>
                {field("cta", { color: "#FAF6EE" }, locale === "es" ? "Texto del botón" : "Button text")}
              </CtaButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CtaButton({ editable, ctaUrl, onMetaChange, ui, children }: {
  editable: boolean; ctaUrl: string; onMetaChange?: (patch: { ctaUrl?: string }) => void;
  ui: typeof UI_TEXT["en"]; children: React.ReactNode;
}) {
  return (
    <div>
      <a href={ctaUrl || "#"} target={ctaUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
        onClick={e => { if (editable) e.preventDefault(); }}
        style={{ display: "block", textAlign: "center", padding: "14px", background: "rgb(var(--accent))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.16em", textTransform: "uppercase", cursor: editable ? "text" : "pointer" }}>
        {children}
      </a>
      {editable && (
        <input value={ctaUrl} placeholder={ui.ctaHint} onChange={e => onMetaChange?.({ ctaUrl: e.target.value })}
          style={{ width: "100%", marginTop: 4, padding: "6px 10px", background: "rgba(var(--bg-alt),1)", border: "1px solid rgba(var(--accent),0.15)", outline: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.6)", boxSizing: "border-box" }} />
      )}
    </div>
  );
}

function VideoButton({ editable, videoUrl, onMetaChange, onWatchVideo, ui }: {
  editable: boolean; videoUrl: string | null; onMetaChange?: (patch: { video_url?: string }) => void;
  onWatchVideo?: () => void; ui: typeof UI_TEXT["en"];
}) {
  if (!editable && !videoUrl) return null;
  return (
    <div>
      <button onClick={() => !editable && onWatchVideo?.()}
        style={{ ...GLASS, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 18px", color: "rgb(var(--accent))", cursor: editable ? "default" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <PlayCircle size={15} /> {ui.watchVideo}
      </button>
      {editable && (
        <input value={videoUrl ?? ""} placeholder={ui.videoHint} onChange={e => onMetaChange?.({ video_url: e.target.value })}
          style={{ width: "100%", marginTop: 4, padding: "6px 10px", background: "rgba(var(--bg-alt),1)", border: "1px solid rgba(var(--accent),0.15)", outline: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.6)", boxSizing: "border-box" }} />
      )}
    </div>
  );
}
