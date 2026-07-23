"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import Editable from "../../components/admin/Editable";
import type { Certification, CertificationContent, CertificationLocaleContent } from "../../lib/certifications";
import { EMPTY_CERTIFICATION_CONTENT } from "../../lib/certifications";
import type { Locale } from "../../lib/translations";

export type CertificationFormState = {
  content: CertificationContent;
  image_url: string;
};

export function emptyCertificationForm(): CertificationFormState {
  return {
    content: { en: { ...EMPTY_CERTIFICATION_CONTENT.en }, es: { ...EMPTY_CERTIFICATION_CONTENT.es } },
    image_url: "",
  };
}

export function certificationToForm(c: Certification): CertificationFormState {
  return { content: c.content, image_url: c.image_url ?? "" };
}

export default function CertificationEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: CertificationFormState;
  onSave: (form: CertificationFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<CertificationFormState>(initial);
  const [locale, setLocale] = useState<Locale>("en");

  const updateField = (l: Locale, key: keyof CertificationLocaleContent, value: string) => {
    setForm(prev => ({ ...prev, content: { ...prev.content, [l]: { ...prev.content[l], [key]: value } } }));
  };

  const c = form.content[locale];

  return (
    <div style={{ marginBottom: 32, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--bg-alt))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "16px 20px", borderBottom: "1px solid rgba(var(--accent),0.12)" }}>
        <div style={{ display: "flex", border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, padding: 3, gap: 2 }}>
          {(["en", "es"] as const).map(lang => (
            <button key={lang} onClick={() => setLocale(lang)}
              style={{ padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase",
                background: locale === lang ? "rgb(var(--accent))" : "transparent", color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.5)" }}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px 20px", display: "flex", justifyContent: "center", background: "rgb(var(--bg))" }}>
        <div style={{ width: "min(560px, 100%)", borderRadius: 20, background: "#0E2620", overflow: "hidden", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", padding: "36px 32px" }}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "#FAF6EE", marginBottom: 14 }}>
              {locale === "es" ? "Certificados por" : "All certified by"}
            </div>
            <Editable value={c.name} onChange={v => updateField(locale, "name", v)}
              placeholder={locale === "es" ? "Nombre de la certificación" : "Certification name"}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#FAF6EE", marginBottom: 14, display: "block" }} />
            <Editable value={c.description} onChange={v => updateField(locale, "description", v)} multiline
              placeholder={locale === "es" ? "Qué significa esta certificación" : "What this certification means"}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(250,246,238,0.6)", lineHeight: 1.7, display: "block" }} />
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ width: 100, height: 100, margin: "0 auto", borderRadius: "50%", background: "rgba(250,246,238,0.08)", border: "1px solid rgba(250,246,238,0.25)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {form.image_url ? (
                <img src={form.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(250,246,238,0.4)" }}>Sello</span>
              )}
            </div>
            <input value={form.image_url} placeholder={locale === "es" ? "URL del sello…" : "Seal image URL…"}
              onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
              style={{ width: 130, marginTop: 12, padding: "8px 10px", background: "rgba(250,246,238,0.08)", color: "#FAF6EE", border: "1px solid rgba(250,246,238,0.15)", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", textAlign: "center" }} />
          </div>
        </div>
      </div>

      <p style={{ padding: "0 20px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center" }}>
        Haz clic directamente sobre el nombre o la descripción para editarlo.
      </p>

      <div style={{ display: "flex", gap: 10, padding: 20 }}>
        <button onClick={() => onSave(form)} disabled={saving}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <Check size={15} /> {saving ? "Guardando…" : "Guardar"}
        </button>
        <button onClick={onCancel}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <X size={15} /> Cancelar
        </button>
      </div>
    </div>
  );
}
