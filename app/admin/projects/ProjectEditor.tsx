"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import Editable from "../../components/admin/Editable";
import type { Project, ProjectContent, ProjectLocaleContent } from "../../lib/projects";
import { EMPTY_PROJECT_CONTENT } from "../../lib/projects";
import type { Locale } from "../../lib/translations";

export type ProjectFormState = {
  content: ProjectContent;
  image_url: string;
};

export function emptyProjectForm(): ProjectFormState {
  return {
    content: { en: { ...EMPTY_PROJECT_CONTENT.en }, es: { ...EMPTY_PROJECT_CONTENT.es } },
    image_url: "",
  };
}

export function projectToForm(p: Project): ProjectFormState {
  return { content: p.content, image_url: p.image_url ?? "" };
}

export default function ProjectEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: ProjectFormState;
  onSave: (form: ProjectFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProjectFormState>(initial);
  const [locale, setLocale] = useState<Locale>("en");

  const updateField = (l: Locale, key: keyof ProjectLocaleContent, value: string) => {
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
        <div style={{ width: "min(480px, 100%)", border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden" }}>
          <div style={{ position: "relative", height: 220, background: "rgb(var(--bg-alt))" }}>
            {form.image_url && <img src={form.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            <input value={form.image_url} placeholder={locale === "es" ? "Pega la URL de la imagen…" : "Paste image URL…"}
              onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px", background: "rgba(10,10,8,0.65)", color: "#FAF6EE", border: "none", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem" }} />
          </div>
          <div style={{ padding: 24 }}>
            <Editable value={c.title} onChange={v => updateField(locale, "title", v)}
              placeholder={locale === "es" ? "Título del proyecto" : "Project title"}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))", marginBottom: 10, display: "block" }} />
            <Editable value={c.description} onChange={v => updateField(locale, "description", v)} multiline
              placeholder={locale === "es" ? "Descripción del proyecto" : "Project description"}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.62)", lineHeight: 1.6, marginBottom: 14, display: "block" }} />
            <div style={{ borderTop: "1px solid rgba(var(--accent),0.1)", paddingTop: 12 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", marginBottom: 4 }}>
                {locale === "es" ? "Resultado" : "Result"}
              </div>
              <Editable value={c.results} onChange={v => updateField(locale, "results", v)}
                placeholder={locale === "es" ? "ej. 50+ casas entregadas" : "e.g. 50+ homes delivered"}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--accent))" }} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ padding: "0 20px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center" }}>
        Haz clic directamente sobre el título, la descripción o el resultado para editarlo.
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
