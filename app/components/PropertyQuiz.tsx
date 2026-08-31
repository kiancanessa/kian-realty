"use client";
import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Home as HomeIcon, Building2, Trees, CheckCircle } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { sendInquiry } from "../lib/sendInquiry";
import type { PropertyCard } from "../lib/easybroker";

type Operation = "sale" | "rental";
type PropType = "house" | "apartment" | "land" | "any";
type BudgetOption = { label: string; max: number | null };

const TOTAL_STEPS = 5; // operation, type, budget, timeline, contact

function OptionTile({ label, icon: Icon, selected, onClick }: { label: string; icon?: React.ComponentType<{ size?: number }>; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "20px 12px", cursor: "pointer", textAlign: "center",
        border: `1px solid ${selected ? "rgb(var(--accent))" : "rgba(var(--accent),0.2)"}`,
        background: selected ? "rgba(var(--accent),0.1)" : "rgb(var(--surface))",
        color: selected ? "rgb(var(--accent))" : "rgb(var(--ink))",
        fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", fontWeight: selected ? 600 : 400,
        transition: "all 0.25s",
      }}>
      {Icon && <Icon size={22} />}
      {label}
    </button>
  );
}

export default function PropertyQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [propType, setPropType] = useState<PropType | null>(null);
  const [budget, setBudget] = useState<BudgetOption | null | undefined>(undefined);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<PropertyCard[] | null>(null);

  const reset = () => {
    setStep(0); setOperation(null); setPropType(null); setBudget(undefined);
    setTimeline(null); setName(""); setEmail(""); setWhatsapp("");
    setSubmitting(false); setError(false); setResults(null);
  };
  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  if (!open) return null;

  const budgetOptions = operation === "rental" ? t.quiz.budgetOptionsRental : t.quiz.budgetOptionsSale;
  const canAdvance = [!!operation, !!propType, budget !== undefined, !!timeline][step] ?? true;

  const timelineLabel = (v: string | null) => ({
    now: t.quiz.timelineNow, m3: t.quiz.timeline3, m6: t.quiz.timeline6, exploring: t.quiz.timelineExploring,
  }[v ?? ""] ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    try {
      const qs = new URLSearchParams({ operation: operation ?? "", type: propType ?? "any" });
      if (budget?.max) qs.set("budgetMax", String(budget.max));
      const matchRes = await fetch(`/api/properties/match?${qs}`);
      const matchData = await matchRes.json();

      const opLabel = operation === "rental" ? t.quiz.operationRent : t.quiz.operationBuy;
      const typeLabel = { house: t.quiz.typeHouse, apartment: t.quiz.typeApartment, land: t.quiz.typeLand, any: t.quiz.typeAny }[propType ?? "any"];
      const budgetLabel = budget?.label ?? t.quiz.budgetAny;
      const summary = `${opLabel} · ${typeLabel} · ${budgetLabel} · ${timelineLabel(timeline)}`;

      // Same dual-post pattern used by the contact form and the property
      // inquiry form: an immediate Web3Forms email from the client, plus a
      // DB row that also fires the WhatsApp team alert server-side.
      const emailOk = await sendInquiry({
        subject: `Nuevo resultado de quiz — ${name} — El Casa Rosarito`,
        from_name: "El Casa Rosarito Website",
        replyto: email,
        name, email, phone: whatsapp, interest: summary, message: summary,
      });
      fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "quiz", name, email, phone: whatsapp, interest: summary, message: summary,
          meta: { operation, propertyType: propType, budgetMax: budget?.max ?? null, timeline },
        }),
      }).catch(() => {});

      setResults(matchData.properties ?? []);
      if (!emailOk) setError(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 210, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,10,8,0.72)" }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "min(560px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "rgb(var(--bg))", border: "1px solid rgba(var(--accent),0.15)", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}
      >
        <div style={{ position: "relative", padding: "32px 32px 28px" }}>
          <button onClick={handleClose} aria-label={t.quiz.close}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(var(--accent),0.25)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgb(var(--accent))" }}>
            <X size={16} />
          </button>

          {results === null ? (
            <>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 10 }}>
                {t.quiz.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(TOTAL_STEPS))}
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.9rem", color: "rgb(var(--ink))", marginBottom: 24, paddingRight: 30 }}>
                {t.quiz.title}
              </h2>

              {step === 0 && (
                <>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.6)", marginBottom: 18 }}>{t.quiz.operationQ}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <OptionTile label={t.quiz.operationBuy} selected={operation === "sale"} onClick={() => { setOperation("sale"); setBudget(undefined); }} />
                    <OptionTile label={t.quiz.operationRent} selected={operation === "rental"} onClick={() => { setOperation("rental"); setBudget(undefined); }} />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.6)", marginBottom: 18 }}>{t.quiz.typeQ}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <OptionTile label={t.quiz.typeHouse} icon={HomeIcon} selected={propType === "house"} onClick={() => setPropType("house")} />
                    <OptionTile label={t.quiz.typeApartment} icon={Building2} selected={propType === "apartment"} onClick={() => setPropType("apartment")} />
                    <OptionTile label={t.quiz.typeLand} icon={Trees} selected={propType === "land"} onClick={() => setPropType("land")} />
                    <OptionTile label={t.quiz.typeAny} selected={propType === "any"} onClick={() => setPropType("any")} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.6)", marginBottom: 18 }}>{t.quiz.budgetQ}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {budgetOptions.map(opt => (
                      <OptionTile key={opt.label} label={opt.label} selected={budget?.label === opt.label} onClick={() => setBudget(opt)} />
                    ))}
                    <OptionTile label={t.quiz.budgetAny} selected={budget === null} onClick={() => setBudget(null)} />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.6)", marginBottom: 18 }}>{t.quiz.timelineQ}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <OptionTile label={t.quiz.timelineNow} selected={timeline === "now"} onClick={() => setTimeline("now")} />
                    <OptionTile label={t.quiz.timeline3} selected={timeline === "m3"} onClick={() => setTimeline("m3")} />
                    <OptionTile label={t.quiz.timeline6} selected={timeline === "m6"} onClick={() => setTimeline("m6")} />
                    <OptionTile label={t.quiz.timelineExploring} selected={timeline === "exploring"} onClick={() => setTimeline("exploring")} />
                  </div>
                </>
              )}

              {step === 4 && (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.6)", marginBottom: 4 }}>{t.quiz.contactTitle}</p>
                  {error && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--error))" }}>{t.quiz.error}</p>}
                  {(["name", "email", "whatsapp"] as const).map(field => (
                    <input key={field}
                      type={field === "email" ? "email" : "text"}
                      required={field !== "whatsapp"}
                      placeholder={t.quiz[field]}
                      value={field === "name" ? name : field === "email" ? email : whatsapp}
                      onChange={e => (field === "name" ? setName : field === "email" ? setEmail : setWhatsapp)(e.target.value)}
                      style={{ width: "100%", background: "rgb(var(--surface))", border: "1px solid rgba(var(--accent),0.15)", outline: "none", padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgb(var(--ink))", boxSizing: "border-box" }}
                    />
                  ))}
                  <button type="submit" disabled={submitting}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px", marginTop: 6, background: submitting ? "rgba(var(--accent),0.6)" : "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.82rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    {submitting ? t.quiz.submitting : <>{t.quiz.submit} <ArrowRight size={14} /></>}
                  </button>
                </form>
              )}

              {step < 4 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
                  <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: step === 0 ? "default" : "pointer", opacity: step === 0 ? 0 : 1, color: "rgba(var(--ink),0.55)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem" }}>
                    <ArrowLeft size={14} /> {t.quiz.back}
                  </button>
                  <button onClick={() => setStep(s => s + 1)} disabled={!canAdvance}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 26px", background: canAdvance ? "rgb(var(--accent))" : "rgba(var(--accent),0.3)", color: "#FAF6EE", border: "none", cursor: canAdvance ? "pointer" : "not-allowed", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {t.quiz.next} <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle size={22} color="rgb(var(--accent))" />
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1.7rem", color: "rgb(var(--ink))" }}>{t.quiz.resultsTitle}</h2>
              </div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.55)", marginBottom: 22 }}>{t.quiz.resultsSubtitle}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {results.map(p => (
                  <a key={p.id} href={`/propiedades/${p.id}`}
                    style={{ display: "flex", gap: 14, textDecoration: "none", border: "1px solid rgba(var(--accent),0.12)", padding: 12, alignItems: "center" }}>
                    <div style={{ width: 72, height: 60, flexShrink: 0, background: "rgb(var(--surface))", overflow: "hidden" }}>
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgb(var(--ink))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgb(var(--accent))" }}>{p.price ?? t.property.priceOnRequest}</div>
                    </div>
                    <ArrowRight size={16} color="rgb(var(--accent))" style={{ flexShrink: 0 }} />
                  </a>
                ))}
              </div>

              <a href="/propiedades"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                {t.quiz.viewAll} <ArrowRight size={14} />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
