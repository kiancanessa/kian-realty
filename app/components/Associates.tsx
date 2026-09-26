"use client";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../lib/LangContext";

/** The agencies and businesses El Casa Rosarito works alongside.
 *
 *  Deliberately separate from the catalogue: by agreement, a listing never
 *  says which agency it comes from, so this is the one place the alliance is
 *  shown. Adding a partner is a new entry in `associates.items` (both
 *  languages) and a square logo in public/images/associates. */
export default function Associates() {
  const { t } = useLang();
  const a = t.associates;

  return (
    <section id="associates" aria-labelledby="associates-title" style={{ padding: "96px 24px", background: "rgb(var(--bg))" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div data-reveal style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              {a.eyebrow}
            </span>
            <div className="sage-line" />
          </div>
          <h2 id="associates-title" data-reveal="line" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "rgb(var(--ink))" }}>
            <span className="reveal-text">{a.title}</span>
          </h2>
          <p data-reveal style={{ "--reveal-delay": "120ms", fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(var(--ink),0.55)", maxWidth: 520, margin: "14px auto 0" } as React.CSSProperties}>
            {a.lead}
          </p>
        </div>

        <ul className="associates-grid">
          {a.items.map((item, i) => (
            <li key={item.slug} data-reveal style={{ "--reveal-delay": `${i * 110}ms` } as React.CSSProperties}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="associate-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logo} alt="" aria-hidden width={72} height={72} className="associate-logo" />
                <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", lineHeight: 1.15, color: "rgb(var(--ink))" }}>
                    {item.name}
                  </span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", lineHeight: 1.5, color: "rgba(var(--ink),0.55)" }}>
                    {item.tagline}
                  </span>
                  <span className="associate-visit">
                    {a.visit} <ArrowUpRight size={14} aria-hidden />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
