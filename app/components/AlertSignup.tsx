"use client";
import { useState } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import type { Lang } from "../lib/seoSlugs";

const TEXT = {
  es: {
    title: "Recibe aviso de novedades",
    text: "Déjanos tu correo y te avisamos cuando haya propiedades nuevas en esta página o cuando alguna baje de precio. Puedes darte de baja cuando quieras.",
    email: "Tu correo", submit: "Avisarme", sending: "Enviando…",
    email_ok: "Casi listo: te enviamos un correo para confirmar tu suscripción. Revisa tu bandeja de entrada (y el spam).",
    team_ok: "Gracias. Recibimos tu solicitud y el equipo te escribirá para avisarte.",
    error: "No pudimos guardar tu correo. Revisa que esté bien escrito e inténtalo de nuevo.",
    privacy: "Usamos tu correo solo para estos avisos.", policy: "Aviso de privacidad",
  },
  en: {
    title: "Get alerts on what's new",
    text: "Leave your email and we will let you know when there are new properties on this page or when one drops in price. You can unsubscribe at any time.",
    email: "Your email", submit: "Alert me", sending: "Sending…",
    email_ok: "Almost done: we sent you an email to confirm your subscription. Check your inbox (and spam).",
    team_ok: "Thank you. We received your request and the team will write to you.",
    error: "We could not save your email. Check that it is written correctly and try again.",
    privacy: "We use your email only for these alerts.", policy: "Privacy notice",
  },
} as const;

/** "Tell me when there are new ones": subscribes to the alerts of the page it sits on. */
export default function AlertSignup({ lang, pageKey }: { lang: Lang; pageKey: string }) {
  const t = TEXT[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "email" | "team" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/alerts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, pageKey }),
      });
      if (!res.ok) throw new Error("rejected");
      const data = (await res.json()) as { mode?: string };
      setState(data.mode === "email" ? "email" : "team");
    } catch {
      setState("error");
    }
  };

  return (
    <section aria-labelledby="alert-title" style={{ margin: "56px 0 0", padding: "28px 32px", border: "1px solid rgba(var(--accent),0.25)", background: "rgb(var(--surface))" }}>
      <h2 id="alert-title" style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.6rem", color: "rgb(var(--ink))", margin: "0 0 8px" }}>
        <BellRing size={22} color="rgb(var(--accent))" aria-hidden /> {t.title}
      </h2>
      {state === "email" || state === "team" ? (
        <p role="status" style={{ fontFamily: "'Jost', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: "rgb(var(--ink))", margin: 0 }}>
          {state === "email" ? t.email_ok : t.team_ok}
        </p>
      ) : (
        <form onSubmit={submit}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(var(--ink),0.72)", maxWidth: 620, margin: "0 0 16px" }}>{t.text}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 560 }}>
            <label style={{ flex: "1 1 240px" }}>
              <span className="rv-sr">{t.email}</span>
              <input type="email" required autoComplete="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", minHeight: 48, padding: "0 16px", background: "rgb(var(--bg))", color: "rgb(var(--ink))", border: "1px solid rgba(var(--accent),0.3)", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.95rem" }} />
            </label>
            <button type="submit" disabled={state === "sending"}
              style={{ minHeight: 48, padding: "0 26px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: state === "sending" ? "wait" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              {state === "sending" ? t.sending : t.submit}
            </button>
          </div>
          {state === "error" && <p role="alert" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--error))", margin: "12px 0 0" }}>{t.error}</p>}
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgba(var(--ink),0.55)", margin: "12px 0 0" }}>
            {t.privacy} <Link href="/privacidad" style={{ color: "rgb(var(--accent))" }}>{t.policy}</Link>
          </p>
        </form>
      )}
    </section>
  );
}
