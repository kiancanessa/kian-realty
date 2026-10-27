"use client";
import { useState } from "react";
import { CALC } from "../lib/calcContent";
import { JORGE_WHATSAPP } from "../lib/contact";
import { whatsappLink } from "../lib/sendInquiry";
import type { Lang } from "../lib/seoSlugs";

type Field = "price" | "closing" | "rent" | "occupancy" | "taxes" | "hoa" | "trust" | "insurance" | "management" | "other";

// Round examples, so the tool shows something on opening. Expenses start at
// zero on purpose: any figure there would read as a statement about costs.
const EXAMPLE: Record<Field, string> = {
  price: "300000", closing: "0", rent: "1800", occupancy: "90",
  taxes: "0", hoa: "0", trust: "0", insurance: "0", management: "0", other: "0",
};

const num = (v: string, max = Infinity) => Math.min(max, Math.max(0, Number.parseFloat(v) || 0));

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", minHeight: 46, padding: "0 14px", background: "rgb(var(--bg))", color: "rgb(var(--ink))",
  border: "1px solid rgba(var(--accent),0.3)", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "1rem", fontVariantNumeric: "tabular-nums",
};
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(var(--ink),0.75)", marginBottom: 6 };
const hintStyle: React.CSSProperties = { display: "block", fontSize: "0.74rem", color: "rgba(var(--ink),0.55)", marginTop: 4, lineHeight: 1.4 };

export default function YieldCalculator({ lang }: { lang: Lang }) {
  const c = CALC[lang];
  const [currency, setCurrency] = useState<"USD" | "MXN">("USD");
  const [v, setV] = useState<Record<Field, string>>(EXAMPLE);
  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) => setV(prev => ({ ...prev, [k]: e.target.value }));

  const money = (n: number) => new Intl.NumberFormat(lang === "es" ? "es-MX" : "en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  const pct = (n: number) => `${new Intl.NumberFormat(lang === "es" ? "es-MX" : "en-US", { maximumFractionDigits: 1 }).format(n)}%`;

  const price = num(v.price), closing = num(v.closing), rent = num(v.rent), occ = num(v.occupancy, 100);
  const gross = rent * 12 * (occ / 100);
  const expenses = num(v.taxes) + num(v.hoa) * 12 + num(v.trust) + num(v.insurance) + num(v.other) + gross * (num(v.management, 100) / 100);
  const net = gross - expenses;
  const invested = price + closing;
  const grossYield = price > 0 ? (gross / price) * 100 : null;
  const netYield = invested > 0 ? (net / invested) * 100 : null;
  const payback = net > 0 && invested > 0 ? invested / net : null;
  const noExpenses = expenses === 0;

  const field = (k: Field, label: string, hint?: string, suffix?: string) => (
    <label key={k} style={{ display: "block" }}>
      <span style={labelStyle}>{label}{suffix ? <span style={{ color: "rgba(var(--ink),0.5)" }}> · {suffix}</span> : null}</span>
      <input type="number" inputMode="decimal" min={0} step="any" value={v[k]} onChange={set(k)} style={inputStyle} />
      {hint && <span style={hintStyle}>{hint}</span>}
    </label>
  );

  const row = (label: string, value: string, hint?: string, strong = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderTop: "1px solid rgba(var(--accent),0.15)" }}>
      <div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", color: "rgb(var(--ink))" }}>{label}</div>
        {hint && <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.55)", marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: strong ? "1.8rem" : "1.35rem", color: strong ? "rgb(var(--accent))" : "rgb(var(--ink))", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );

  const message = c.cta.message(money(price), money(rent), netYield === null ? c.results.none : pct(netYield));

  return (
    <div style={{ display: "grid", gap: 32, margin: "40px 0", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "start" }}>
      <form onSubmit={e => e.preventDefault()} aria-label={c.fields.inputsTitle}
        style={{ padding: "28px", border: "1px solid rgba(var(--accent),0.2)", background: "rgb(var(--surface))", display: "grid", gap: 16 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", color: "rgb(var(--ink))", margin: 0 }}>{c.fields.inputsTitle}</h2>
        <label style={{ display: "block" }}>
          <span style={labelStyle}>{c.fields.currency}</span>
          <select value={currency} onChange={e => setCurrency(e.target.value as "USD" | "MXN")} style={{ ...inputStyle, appearance: "auto" }}>
            <option value="USD">USD</option><option value="MXN">MXN</option>
          </select>
        </label>
        {field("price", c.fields.price)}
        {field("closing", c.fields.closing, c.fields.closingHint)}
        {field("rent", c.fields.rent, undefined, c.fields.perMonth)}
        {field("occupancy", c.fields.occupancy, c.fields.occupancyHint)}
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.25rem", color: "rgb(var(--ink))", margin: "8px 0 0" }}>{c.fields.expensesTitle}</h3>
        {field("taxes", c.fields.taxes, undefined, c.fields.perYear)}
        {field("hoa", c.fields.hoa, undefined, c.fields.perMonth)}
        {field("trust", c.fields.trust)}
        {field("insurance", c.fields.insurance, undefined, c.fields.perYear)}
        {field("management", c.fields.management)}
        {field("other", c.fields.other, undefined, c.fields.perYear)}
      </form>

      <div style={{ position: "sticky", top: 100 }}>
        <section aria-labelledby="calc-result" aria-live="polite" style={{ padding: "28px", border: "1px solid rgba(var(--accent),0.3)", background: "rgb(var(--surface))" }}>
          <h2 id="calc-result" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", color: "rgb(var(--ink))", margin: "0 0 8px" }}>{c.results.title}</h2>
          {row(c.results.gross, money(gross))}
          {row(c.results.expenses, money(expenses))}
          {row(c.results.net, money(net))}
          {row(c.results.grossYield, grossYield === null ? c.results.none : pct(grossYield), c.results.grossYieldHint)}
          {row(c.results.netYield, netYield === null ? c.results.none : pct(netYield), c.results.netYieldHint, true)}
          {row(c.results.payback, payback === null ? c.results.none : `${payback.toFixed(1)} ${c.results.years}`, c.results.paybackHint)}
          {noExpenses && <p role="note" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", lineHeight: 1.6, color: "rgb(var(--ink))", margin: "14px 0 0", padding: "12px 14px", borderLeft: "3px solid rgb(var(--accent))", background: "rgba(var(--accent),0.08)" }}>{c.results.noExpenses}</p>}
          {!noExpenses && net <= 0 && <p role="note" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", lineHeight: 1.6, color: "rgb(var(--ink))", margin: "14px 0 0", padding: "12px 14px", borderLeft: "3px solid rgb(var(--error))" }}>{c.results.negative}</p>}
        </section>

        <section data-placement="calculator" style={{ marginTop: 20, padding: "24px 28px", border: "1px solid rgba(var(--accent),0.2)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.35rem", color: "rgb(var(--ink))", margin: "0 0 6px" }}>{c.cta.title}</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(var(--ink),0.72)", margin: "0 0 16px" }}>{c.cta.text}</p>
          <a href={whatsappLink(JORGE_WHATSAPP, message)} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", padding: "13px 24px", background: "#25D366", color: "#08260f", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {c.cta.whatsapp}
          </a>
        </section>
      </div>
    </div>
  );
}
