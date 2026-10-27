"use client";
import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { sendInquiry, whatsappLink } from "../lib/sendInquiry";
import { JORGE_WHATSAPP } from "../lib/contact";
import type { Lang } from "../lib/seoSlugs";
import { GUIDE } from "../lib/guideContent";

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "14px 16px", background: "rgb(var(--bg))", color: "rgb(var(--ink))",
  border: "1px solid rgba(var(--accent),0.25)", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.92rem",
};

/** Asks for a name and email, saves them as a lead like any other contact, and
 *  then shows the PDF. The guide is also on the page, so nobody is made to
 *  trade their email to read it; this is the convenient copy. */
export default function GuideDownload({ lang }: { lang: Lang }) {
  const f = GUIDE[lang].form;
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "guide", name: form.name, email: form.email, phone: form.phone,
          interest: "Guía para comprar en México", message: f.message, meta: { lang },
        }),
      });
      if (!res.ok) throw new Error("not saved");
      setState("done");
      // The team's email, as with the contact form. The lead is already saved.
      sendInquiry({
        subject: `Descarga de guía: ${form.name} — El Casa Rosarito`, from_name: "El Casa Rosarito Website",
        replyto: form.email, name: form.name, email: form.email, phone: form.phone, message: f.message,
      }).catch(() => {});
    } catch {
      setState("error");
    }
  };

  return (
    <section aria-labelledby="guide-form-title" style={{ margin: "40px 0 56px", padding: "32px", border: "1px solid rgba(var(--accent),0.25)", background: "rgb(var(--surface))" }}>
      <h2 id="guide-form-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.8rem", color: "rgb(var(--ink))", marginBottom: 8 }}>{f.title}</h2>

      {state === "done" ? (
        <div role="status">
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "1rem", color: "rgb(var(--ink))", margin: "8px 0 18px" }}>{f.thanks}</p>
          <a href={GUIDE[lang].pdf} download
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 28px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            <Download size={16} aria-hidden /> {f.download}
          </a>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.6)", marginTop: 16 }}>{f.again}</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(var(--ink),0.7)", margin: "0 0 4px" }}>{f.text}</p>
          <label>
            <span className="rv-sr">{f.name}</span>
            <input style={input} placeholder={f.name} value={form.name} autoComplete="name" required onChange={e => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            <span className="rv-sr">{f.email}</span>
            <input style={input} type="email" placeholder={f.email} value={form.email} autoComplete="email" required onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            <span className="rv-sr">{f.phone}</span>
            <input style={input} type="tel" placeholder={f.phone} value={form.phone} autoComplete="tel" onChange={e => setForm({ ...form, phone: e.target.value })} />
          </label>
          {state === "error" && (
            <p role="alert" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--error))", margin: 0 }}>
              {f.error}{" "}
              <a href={whatsappLink(JORGE_WHATSAPP, GUIDE[lang].cta.whatsappMessage)} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>{f.whatsapp}</a>
            </p>
          )}
          <button type="submit" disabled={state === "sending"}
            style={{ padding: "16px 28px", minHeight: 48, background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: state === "sending" ? "wait" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            {state === "sending" ? f.sending : f.submit}
          </button>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgba(var(--ink),0.55)", margin: 0 }}>
            {f.privacy} <Link href="/privacidad" style={{ color: "rgb(var(--accent))" }}>{f.privacyLink}</Link>
          </p>
        </form>
      )}
    </section>
  );
}
