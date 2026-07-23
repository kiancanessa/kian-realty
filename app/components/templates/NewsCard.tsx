"use client";
import { Newspaper, Quote } from "lucide-react";
import Editable from "../admin/Editable";
import type { PostContent, PostLocaleContent, PostTemplateKey } from "../../lib/posts";
import type { Locale } from "../../lib/translations";

export default function NewsCard({
  content, imageUrl, template, locale, dateLabel,
  editable = false, onFieldChange, onImageUrlChange,
}: {
  content: PostContent;
  imageUrl: string | null;
  template: PostTemplateKey;
  locale: Locale;
  dateLabel?: string;
  editable?: boolean;
  onFieldChange?: (locale: Locale, field: keyof PostLocaleContent, value: string) => void;
  onImageUrlChange?: (v: string) => void;
}) {
  const c = content[locale];

  const field = (key: keyof PostLocaleContent, style: React.CSSProperties, multiline?: boolean, placeholder?: string) =>
    editable ? (
      <Editable value={c[key]} onChange={v => onFieldChange?.(locale, key, v)} multiline={multiline} placeholder={placeholder} style={style} />
    ) : (
      <div style={style}>{c[key]}</div>
    );

  if (template === "text") {
    return (
      <div style={{ border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", padding: 28, borderLeft: "3px solid rgb(var(--accent))" }}>
        <Quote size={20} color="rgba(var(--accent),0.4)" style={{ marginBottom: 12 }} />
        {dateLabel && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.35)", marginBottom: 10 }}>{dateLabel}</div>
        )}
        {field("title", { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))", marginBottom: 10 }, false, locale === "es" ? "Título" : "Title")}
        {field("body", { fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.62)", lineHeight: 1.7 }, true, locale === "es" ? "Texto" : "Body")}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden" }}>
      <div style={{ position: "relative", height: 160, background: "rgb(var(--bg-alt))" }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Newspaper size={24} color="rgba(var(--accent),0.4)" />
          </div>
        )}
        {editable && (
          <input value={imageUrl ?? ""} placeholder={locale === "es" ? "URL de imagen (opcional)…" : "Image URL (optional)…"} onChange={e => onImageUrlChange?.(e.target.value)}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 10px", background: "rgba(10,10,8,0.65)", color: "#FAF6EE", border: "none", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem" }} />
        )}
      </div>
      <div style={{ padding: 24 }}>
        {dateLabel && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.35)", marginBottom: 8 }}>{dateLabel}</div>
        )}
        {field("title", { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "rgb(var(--ink))", marginBottom: 10 }, false, locale === "es" ? "Título" : "Title")}
        {field("body", { fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.6)", lineHeight: 1.6 }, true, locale === "es" ? "Texto" : "Body")}
      </div>
    </div>
  );
}
