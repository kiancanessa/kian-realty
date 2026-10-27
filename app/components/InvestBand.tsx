"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { pagePath } from "../lib/seoSlugs";

const BARS = 14;
const BASE = 182;
const LINE = 100; // height of the "invested" line

/** A band on the home page, right after the featured properties: the moment a
 *  visitor has been looking at homes for sale is the moment to ask what one
 *  would yield. The picture is decorative: bars that climb past a dashed line. */
export default function InvestBand() {
  const { t, locale } = useLang();
  const c = t.invest;

  return (
    <section aria-labelledby="invest-title" style={{ padding: "88px 24px", background: "rgb(var(--bg))" }}>
      <div className="ib" data-reveal>
        <div className="ib-copy">
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{c.eyebrow}</span>
          </div>
          <h2 id="invest-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.1rem)", lineHeight: 1.1, letterSpacing: "-0.015em", color: "rgb(var(--ink))", margin: "0 0 16px" }}>{c.title}</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", lineHeight: 1.75, color: "rgba(var(--ink),0.72)", maxWidth: 480, margin: "0 0 20px" }}>{c.text}</p>
          <ul style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", margin: "0 0 28px", padding: 0, listStyle: "none" }}>
            {c.points.map(p => (
              <li key={p} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Jost', sans-serif", fontSize: "0.84rem", color: "rgba(var(--ink),0.75)" }}>
                <Check size={15} color="rgb(var(--accent))" aria-hidden /> {p}
              </li>
            ))}
          </ul>
          <Link href={pagePath("calculadora-rentabilidad", locale)} data-cta="calc-home-band" className="ib-cta">
            {c.cta} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <svg className="ib-chart" viewBox="0 0 320 200" aria-hidden>
          <line x1="6" x2="314" y1={BASE} y2={BASE} style={{ stroke: "rgba(var(--ink),0.25)" }} />
          {Array.from({ length: BARS }, (_, i) => {
            const h = 14 + i * 10.6;
            return <rect key={i} className="ib-bar" x={10 + i * 22} y={BASE - h} width={16} height={h} rx={3}
              style={{ fill: h >= LINE ? "rgb(var(--accent))" : "rgba(var(--accent),0.38)", "--i": i } as React.CSSProperties} />;
          })}
          <line x1="6" x2="314" y1={BASE - LINE} y2={BASE - LINE} strokeDasharray="6 5" strokeWidth="2" style={{ stroke: "rgb(var(--ink))" }} />
        </svg>
      </div>
    </section>
  );
}
