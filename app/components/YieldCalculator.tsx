"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Hourglass, PiggyBank, TrendingUp } from "lucide-react";
import { CALC, type ExpenseKey } from "../lib/calcContent";
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

// How far each slider reaches. A typed number can go beyond it; this is only
// the span of the control. Pesos use a wider span (x20) so the control stays
// as usable as in dollars: it is not an exchange rate, and nothing is converted.
const RANGES: Record<Field, { min: number; max: number; step: number; scales: boolean }> = {
  price: { min: 50000, max: 1500000, step: 5000, scales: true },
  closing: { min: 0, max: 150000, step: 1000, scales: true },
  rent: { min: 300, max: 8000, step: 50, scales: true },
  occupancy: { min: 10, max: 100, step: 5, scales: false },
  taxes: { min: 0, max: 5000, step: 50, scales: true },
  hoa: { min: 0, max: 1000, step: 10, scales: true },
  trust: { min: 0, max: 2000, step: 50, scales: true },
  insurance: { min: 0, max: 3000, step: 50, scales: true },
  management: { min: 0, max: 30, step: 1, scales: false },
  other: { min: 0, max: 10000, step: 100, scales: true },
};
const PESO_SPAN = 20;

const EXPENSES: { field: Field; key: ExpenseKey; per: "perYear" | "perMonth" | null; color: string }[] = [
  { field: "taxes", key: "taxes", per: "perYear", color: "#B0472B" },
  { field: "hoa", key: "hoa", per: "perMonth", color: "#A87A3E" },
  { field: "trust", key: "trust", per: "perYear", color: "#5A4A8A" },
  { field: "insurance", key: "insurance", per: "perYear", color: "#2B6E7A" },
  { field: "management", key: "management", per: null, color: "#8A5A2B" },
  { field: "other", key: "other", per: "perYear", color: "#8A8578" },
];

const num = (v: string, max = Infinity) => Math.min(max, Math.max(0, Number.parseFloat(v) || 0));
const TWEEN_MS = 650;

// ── Motion ────────────────────────────────────────────────────────────────
const REDUCED = "(prefers-reduced-motion: reduce)";
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    cb => { const mq = window.matchMedia(REDUCED); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

type Nums = {
  price: number; closing: number; gross: number; taxes: number; hoa: number; trust: number; insurance: number; mgmt: number; other: number;
  net: number; netYield: number; payback: number;
};
const ZERO: Nums = { price: 0, closing: 0, gross: 0, taxes: 0, hoa: 0, trust: 0, insurance: 0, mgmt: 0, other: 0, net: 0, netYield: 0, payback: 0 };

/** Every number on the result moves to its new value together, from wherever
 *  it is right now, so changing a slider mid-animation never jumps. */
function useTweened(target: Nums, ms: number): Nums {
  const [shown, setShown] = useState<Nums>(target);
  const current = useRef<Nums>(target);
  const signature = JSON.stringify(target);

  useEffect(() => {
    const from = current.current;
    const to = JSON.parse(signature) as Nums;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = ms <= 0 ? 1 : Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const next = Object.fromEntries((Object.keys(to) as (keyof Nums)[]).map(key => [key, from[key] + (to[key] - from[key]) * e])) as Nums;
      current.current = next;
      setShown(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [signature, ms]);

  return shown;
}

/** Whether the element is on screen; with `once`, whether it ever has been. */
function useInView(ref: React.RefObject<Element | null>, threshold: number, once = false): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(prev => (once ? prev || e.isIntersecting : e.isIntersecting)), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

// ── Inputs ────────────────────────────────────────────────────────────────
function SliderField({ label, unit, hint, value, onChange, range, prefix, suffix }: {
  label: string; unit?: string; hint?: string; value: string; onChange: (v: string) => void;
  range: { min: number; max: number; step: number }; prefix?: string; suffix?: string;
}) {
  const id = useId();
  const n = Number.parseFloat(value);
  const clamped = Math.min(range.max, Math.max(range.min, Number.isFinite(n) ? n : range.min));
  const p = ((clamped - range.min) / (range.max - range.min)) * 100;
  return (
    <div className="yc-field">
      <div className="yc-field-top">
        <label htmlFor={id}>{label}{unit && <span className="yc-unit"> · {unit}</span>}</label>
        <div className="yc-valuebox">
          {prefix && <span aria-hidden>{prefix}</span>}
          <input id={id} type="number" inputMode="decimal" min={0} step="any" value={value} onChange={e => onChange(e.target.value)} />
          {suffix && <span aria-hidden>{suffix}</span>}
        </div>
      </div>
      <input className="yc-range" type="range" min={range.min} max={range.max} step={range.step} value={clamped}
        onChange={e => onChange(e.target.value)} aria-label={label} style={{ "--p": `${p}%` } as React.CSSProperties} />
      {hint && <p className="yc-hint">{hint}</p>}
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint: string; children: React.ReactNode }) {
  return (
    <fieldset className="yc-step">
      <legend><span className="yc-step-n" aria-hidden>{n}</span>{title}</legend>
      <p className="yc-step-hint">{hint}</p>
      {children}
    </fieldset>
  );
}

// ── Charts ────────────────────────────────────────────────────────────────
type Slice = { key: string; label: string; value: number; color: string };

function Donut({ slices, keptPct, center, aria }: { slices: Slice[]; keptPct: number; center: string; aria: string }) {
  const R = 74, C = 2 * Math.PI * R;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  // Where each arc starts: the length of all the ones before it.
  const starts = slices.map((_, i) => (slices.slice(0, i).reduce((s, x) => s + x.value, 0) / total) * C);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={aria} className="yc-donut">
      <circle cx="100" cy="100" r={R} fill="none" strokeWidth="26" style={{ stroke: "rgba(var(--accent),0.12)" }} />
      <g transform="rotate(-90 100 100)">
        {slices.map((s, i) => {
          const len = (s.value / total) * C;
          const gap = slices.length > 1 ? 2 : 0;
          return <circle key={s.key} cx="100" cy="100" r={R} fill="none" strokeWidth="26"
            style={{ stroke: s.color }} strokeDasharray={`${Math.max(0, len - gap)} ${C}`} strokeDashoffset={-starts[i]} />;
        })}
      </g>
      <text x="100" y="101" textAnchor="middle" style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 38, fill: "rgb(var(--ink))" }}>{Math.round(keptPct)}%</text>
      <text x="100" y="121" textAnchor="middle" style={{ fontFamily: "'Jost', sans-serif", fontSize: 9.5, fill: "rgba(var(--ink),0.65)" }}>{center}</text>
    </svg>
  );
}

function YearBars({ net, invested, years, payYear, selected, onPick, compact, label }: {
  net: number; invested: number; years: number; payYear: number | null; selected: number; onPick: (y: number) => void;
  compact: (n: number) => string; label: (y: number) => string;
}) {
  const W = 640, H = 300, X0 = 68, X1 = 628, Y0 = 26, Y1 = 262;
  const w = X1 - X0, h = Y1 - Y0;
  const top = Math.max(invested * 1.12, net * years * 1.04, 1);
  const y = (v: number) => Y1 - Math.min(1, Math.max(0, v / top)) * h;
  const slot = w / years, gap = Math.min(6, slot * 0.28);
  const step = years <= 12 ? 1 : years <= 24 ? 2 : 5;
  const investedY = y(invested);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="yc-bars" aria-hidden>
      {[0.25, 0.5, 0.75, 1].map(f => <line key={f} x1={X0} x2={X1} y1={Y1 - f * h} y2={Y1 - f * h} style={{ stroke: "rgba(var(--ink),0.08)" }} />)}
      <line x1={X0} x2={X1} y1={Y1} y2={Y1} style={{ stroke: "rgba(var(--ink),0.3)" }} />

      {Array.from({ length: years }, (_, i) => {
        const year = i + 1;
        const cum = net * year;
        const barH = Math.max(0, Y1 - y(cum));
        const done = cum >= invested;
        return (
          <g key={year} onClick={() => onPick(year)} style={{ cursor: "pointer" }}>
            <rect x={X0 + i * slot} y={Y0} width={slot} height={h} fill="transparent" />
            <rect className="yc-bar" x={X0 + i * slot + gap / 2} y={Y1 - barH} width={Math.max(1, slot - gap)} height={barH} rx={Math.min(4, slot / 4)}
              style={{ fill: done ? "rgb(var(--accent))" : "rgba(var(--accent),0.4)", animationDelay: `${i * 22}ms`, stroke: year === selected ? "rgb(var(--ink))" : "none", strokeWidth: 2 }} />
            {year % step === 0 || year === 1 ? (
              <text x={X0 + i * slot + slot / 2} y={Y1 + 18} textAnchor="middle"
                style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, fill: year === selected ? "rgb(var(--ink))" : "rgba(var(--ink),0.6)", fontWeight: year === selected ? 600 : 400 }}>{year}</text>
            ) : null}
          </g>
        );
      })}

      {/* What was invested: the bars have to climb past this line. */}
      <line x1={X0} x2={X1} y1={investedY} y2={investedY} strokeDasharray="6 5" strokeWidth="2" style={{ stroke: "rgb(var(--ink))" }} />
      <text x={X0 - 8} y={investedY + 4} textAnchor="end" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: "rgb(var(--ink))" }}>{compact(invested)}</text>
      <text x={X0 - 8} y={Y1 + 4} textAnchor="end" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: "rgba(var(--ink),0.55)" }}>0</text>

      {payYear && payYear <= years && (() => {
        const cx = X0 + (payYear - 1) * slot + slot / 2;
        const ty = Math.max(14, y(net * payYear) - 22);
        const text = label(payYear);
        const tw = text.length * 6.6 + 18;
        const px = Math.min(Math.max(cx - tw / 2, X0), X1 - tw);
        return (
          <g className="yc-badge">
            <rect x={px} y={ty - 13} width={tw} height={22} rx={11} style={{ fill: "rgb(var(--ink))" }} />
            <text x={px + tw / 2} y={ty + 2} textAnchor="middle" style={{ fontFamily: "'Jost', sans-serif", fontSize: 11.5, fontWeight: 500, fill: "rgb(var(--bg))" }}>{text}</text>
          </g>
        );
      })()}
    </svg>
  );
}

// ── The calculator ────────────────────────────────────────────────────────
export default function YieldCalculator({ lang }: { lang: Lang }) {
  const c = CALC[lang];
  const reduced = useReducedMotion();
  const locale = lang === "es" ? "es-MX" : "en-US";
  const [currency, setCurrency] = useState<"USD" | "MXN">("USD");
  const [v, setV] = useState<Record<Field, string>>(EXAMPLE);
  const [pickedYear, setPickedYear] = useState<number | null>(null);

  // Opened from a property: its price (and listed rent) arrive filled in.
  const [fromProperty, setFromProperty] = useState<{ id: string; rent: boolean } | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = Number(q.get("price")), r = Number(q.get("rent")), cur = q.get("currency"), id = q.get("ref") ?? "";
    if (!(p > 0)) return;
    /* Reading the address after load is what an effect is for (the page is built ahead of time). */
    /* eslint-disable react-hooks/set-state-in-effect */
    setV(prev => ({ ...prev, price: String(Math.round(p)), ...(r > 0 ? { rent: String(Math.round(r)) } : {}) }));
    if (cur === "USD" || cur === "MXN") setCurrency(cur);
    if (/^[A-Za-z0-9-]{3,24}$/.test(id)) setFromProperty({ id, rent: r > 0 });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const inputsRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultsInView = useInView(resultsRef, 0.2);
  const inputsInView = useInView(inputsRef, 0.1);
  // The result draws itself the first time it comes into view.
  const revealed = useInView(resultsRef, 0.2, true);

  const money = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  // Short on purpose: it has to fit beside the chart ("$300 k"), so no currency code here.
  const compact = (n: number) => `$${new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n)}`;
  const pct = (n: number) => `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n)}%`;
  const span = currency === "MXN" ? PESO_SPAN : 1;
  const rangeOf = (f: Field) => { const r = RANGES[f], k = r.scales ? span : 1; return { min: r.min * k, max: r.max * k, step: r.step * k }; };
  const set = (f: Field) => (value: string) => setV(prev => ({ ...prev, [f]: value }));

  // What the visitor has set.
  const price = num(v.price), closing = num(v.closing), rent = num(v.rent), occ = num(v.occupancy, 100);
  const gross = rent * 12 * (occ / 100);
  const mgmt = gross * (num(v.management, 100) / 100);
  const expenses = num(v.taxes) + num(v.hoa) * 12 + num(v.trust) + num(v.insurance) + num(v.other) + mgmt;
  const net = gross - expenses;
  const invested = price + closing;
  const netYield = invested > 0 ? (net / invested) * 100 : null;
  const payback = net > 0 && invested > 0 ? invested / net : null;

  // What is drawn: the same numbers, moving toward those values.
  const tw = useTweened(revealed ? {
    price, closing, gross, taxes: num(v.taxes), hoa: num(v.hoa) * 12, trust: num(v.trust), insurance: num(v.insurance), mgmt, other: num(v.other),
    net, netYield: netYield ?? 0, payback: payback ?? 0,
  } : ZERO, reduced ? 0 : TWEEN_MS);
  const drawnExpenses = tw.taxes + tw.hoa + tw.trust + tw.insurance + tw.mgmt + tw.other;

  const drawn: Record<ExpenseKey, number> = { taxes: tw.taxes, hoa: tw.hoa, trust: tw.trust, insurance: tw.insurance, management: tw.mgmt, other: tw.other };
  const slices: Slice[] = [
    { key: "net", label: c.donut.net, value: Math.max(0, tw.gross - drawnExpenses), color: "rgb(var(--accent))" },
    ...EXPENSES.map(e => ({ key: e.key, label: c.donut.categories[e.key], color: e.color, value: drawn[e.key] })),
  ].filter(s => s.value > 0.005);
  const sliceTotal = slices.reduce((s, x) => s + x.value, 0) || 1;
  const kept = gross > 0 ? (Math.max(0, net) / gross) * 100 : 0;
  const keptDrawn = tw.gross > 0 ? (Math.max(0, tw.gross - drawnExpenses) / tw.gross) * 100 : 0;

  // The year-by-year chart: how far it reaches depends on when the money comes back.
  const years = payback ? Math.min(40, Math.max(8, Math.ceil(payback) + Math.max(2, Math.ceil(payback * 0.25)))) : 10;
  const payYear = payback ? Math.ceil(payback) : null;
  const year = Math.min(pickedYear ?? (payYear ? Math.min(payYear, years) : Math.min(5, years)), years);
  const accumulated = net * year;
  const chartState: "bars" | "never" | "needPrice" = invested <= 0 ? "needPrice" : net <= 0 ? "never" : "bars";

  const noExpenses = expenses === 0;
  const hasInput = price > 0 || rent > 0;
  const summary = hasInput
    ? c.summary.kept(`${Math.round(kept)}`, payback ? payback.toFixed(1) : null)
    : c.summary.empty;
  const miniOn = inputsInView && !resultsInView;
  const message = c.cta.message(money(price), money(rent), netYield === null ? c.kpi.none : pct(netYield));

  const kpi = (icon: React.ReactNode, label: string, value: string, hint?: string) => (
    <div className="yc-kpi">
      <span className="yc-kpi-icon" aria-hidden>{icon}</span>
      <div className="yc-kpi-label">{label}</div>
      <div className="yc-kpi-value">{value}</div>
      {hint && <div className="yc-kpi-hint">{hint}</div>}
    </div>
  );

  return (
    <div className="yc">
      <form ref={inputsRef} className="yc-inputs" onSubmit={e => e.preventDefault()}>
        {fromProperty && (
          <p className="yc-prefill" role="status">
            {c.prefill.text(fromProperty.id, fromProperty.rent)}{" "}
            <Link href={`/propiedades/${fromProperty.id}`}>{c.prefill.link}</Link>
          </p>
        )}
        <Step n={1} title={c.steps.property} hint={c.steps.propertyHint}>
          <div className="yc-currency" role="radiogroup" aria-label={c.fields.currency}>
            {(["USD", "MXN"] as const).map(code => (
              <button key={code} type="button" role="radio" aria-checked={currency === code} className={currency === code ? "is-on" : ""} onClick={() => setCurrency(code)}>{code}</button>
            ))}
          </div>
          <p className="yc-hint" style={{ marginTop: -4 }}>{c.currencyNote}</p>
          <SliderField label={c.fields.price} value={v.price} onChange={set("price")} range={rangeOf("price")} prefix="$" />
          <SliderField label={c.fields.closing} hint={c.fields.closingHint} value={v.closing} onChange={set("closing")} range={rangeOf("closing")} prefix="$" />
        </Step>
        <Step n={2} title={c.steps.rent} hint={c.steps.rentHint}>
          <SliderField label={c.fields.rent} unit={c.fields.perMonth} value={v.rent} onChange={set("rent")} range={rangeOf("rent")} prefix="$" />
          <SliderField label={c.fields.occupancy} hint={c.fields.occupancyHint} value={v.occupancy} onChange={set("occupancy")} range={rangeOf("occupancy")} suffix="%" />
        </Step>
        <Step n={3} title={c.steps.expenses} hint={c.steps.expensesHint}>
          <div className="yc-expenses">
            {EXPENSES.map(e => (
              <SliderField key={e.field} label={c.fields[e.field]} unit={e.per ? c.fields[e.per] : undefined} value={v[e.field]} onChange={set(e.field)}
                range={rangeOf(e.field)} prefix={e.field === "management" ? undefined : "$"} suffix={e.field === "management" ? "%" : undefined} />
            ))}
          </div>
        </Step>
      </form>

      <div className="yc-results" ref={resultsRef} id="yc-results">
        <div className="yc-pin">
          <section className="yc-card yc-summary" aria-live="polite">
            <p>{summary}</p>
          </section>
          <div className="yc-kpis">
            {kpi(<PiggyBank size={20} />, c.kpi.netIncome, money(tw.net))}
            {kpi(<TrendingUp size={20} />, c.kpi.netYield, netYield === null ? c.kpi.none : pct(tw.netYield), c.kpi.netYieldHint)}
            {kpi(<Hourglass size={20} />, c.kpi.payback, payback === null ? c.kpi.none : `${tw.payback.toFixed(1)} ${c.kpi.years}`, c.kpi.paybackHint)}
          </div>
        </div>

        <section className="yc-card" aria-labelledby="yc-donut-t">
          <h2 id="yc-donut-t">{c.donut.title}</h2>
          <p className="yc-sub">{c.donut.sub}</p>
          <div className="yc-donut-row">
            <Donut slices={slices} keptPct={keptDrawn} center={c.donut.center} aria={c.donut.aria(`${Math.round(kept)}`)} />
            <ul className="yc-legend">
              {slices.map(s => (
                <li key={s.key}>
                  <span className="yc-dot" style={{ background: s.color }} aria-hidden />
                  <span className="yc-legend-name">{s.label}</span>
                  <span className="yc-legend-val">{money(s.value)}<small> · {Math.round((s.value / sliceTotal) * 100)}%</small></span>
                </li>
              ))}
            </ul>
          </div>
          {noExpenses && <p role="note" className="yc-note">{c.warnings.noExpenses}</p>}
          {!noExpenses && net <= 0 && <p role="note" className="yc-note yc-note-bad">{c.warnings.negative}</p>}
        </section>

        <section className="yc-card" aria-labelledby="yc-bars-t">
          <h2 id="yc-bars-t">{c.timeline.title}</h2>
          <p className="yc-sub">{c.timeline.sub}</p>
          {chartState === "bars" ? (
            <>
              <div role="img" aria-label={c.timeline.aria(c.summary.kept(`${Math.round(kept)}`, payback ? payback.toFixed(1) : null))}>
                <YearBars key={String(revealed)} net={tw.net} invested={tw.price + tw.closing} years={years} payYear={payYear} selected={year} onPick={setPickedYear}
                  compact={compact} label={c.timeline.badge} />
              </div>
              <ul className="yc-chart-legend" aria-hidden>
                <li><span className="yc-swatch" style={{ background: "rgba(var(--accent),0.4)" }} />{c.timeline.legendNot}</li>
                <li><span className="yc-swatch" style={{ background: "rgb(var(--accent))" }} />{c.timeline.legendYes}</li>
                <li><span className="yc-swatch yc-swatch-line" />{c.timeline.invested}</li>
              </ul>
              <div className="yc-explore">
                <label htmlFor="yc-year">{c.timeline.explore}</label>
                <input id="yc-year" className="yc-range" type="range" min={1} max={years} step={1} value={year}
                  onChange={e => setPickedYear(Number(e.target.value))} style={{ "--p": `${((year - 1) / Math.max(1, years - 1)) * 100}%` } as React.CSSProperties} />
                <p className="yc-readout" aria-live="polite">
                  {c.timeline.readout(year, money(accumulated), pct(invested > 0 ? (accumulated / invested) * 100 : 0))}
                </p>
              </div>
            </>
          ) : (
            <p className="yc-note yc-note-bad" role="note">{chartState === "never" ? c.timeline.never : c.timeline.needPrice}</p>
          )}
        </section>

        <section data-placement="calculator" className="yc-card yc-cta">
          <h2>{c.cta.title}</h2>
          <p>{c.cta.text}</p>
          <a href={whatsappLink(JORGE_WHATSAPP, message)} target="_blank" rel="noopener noreferrer">{c.cta.whatsapp}</a>
        </section>
      </div>

      {miniOn && (
        <button type="button" className="yc-mini" onClick={() => resultsRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })}>
          <span><small>{c.mini.yield}</small><strong>{netYield === null ? c.kpi.none : pct(netYield)}</strong></span>
          <span><small>{c.mini.payback}</small><strong>{payback === null ? c.kpi.none : `${payback.toFixed(1)} ${c.kpi.years}`}</strong></span>
          <span className="yc-mini-go">{c.mini.see} ↓</span>
        </button>
      )}
    </div>
  );
}
