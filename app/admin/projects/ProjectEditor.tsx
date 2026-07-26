"use client";
import { useState } from "react";
import { Check, X, Plus, Trash2 } from "lucide-react";
import Editable from "../../components/admin/Editable";
import ProjectGallery from "../../components/ProjectGallery";
import type { Project, ProjectContent, ProjectLocaleContent } from "../../lib/projects";
import { EMPTY_PROJECT_CONTENT } from "../../lib/projects";
import type { Locale } from "../../lib/translations";

export type ProjectFormState = {
  content: ProjectContent;
  images: string[];
};

export function emptyProjectForm(): ProjectFormState {
  return {
    content: { en: { ...EMPTY_PROJECT_CONTENT.en }, es: { ...EMPTY_PROJECT_CONTENT.es } },
    images: [],
  };
}

export function projectToForm(p: Project): ProjectFormState {
  return { content: p.content, images: p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []) };
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

  const setImageAt = (i: number, value: string) => {
    setForm(prev => { const images = [...prev.images]; images[i] = value; return { ...prev, images }; });
  };
  const addImage = () => setForm(prev => ({ ...prev, images: [...prev.images, ""] }));
  const removeImage = (i: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const c = form.content[locale];
  const galleryImages = form.images.filter(s => s.trim() !== "");

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
        <div style={{ width: "min(560px, 100%)", border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden" }}>
          <ProjectGallery images={galleryImages} alt={c.title || "project"} height={260} />
          <div style={{ padding: 24 }}>
            <Editable value={c.title} onChange={v => updateField(locale, "title", v)}
              placeholder={locale === "es" ? "Título del proyecto" : "Project title"}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))", marginBottom: 10, display: "block" }} />
            <Editable value={c.description} onChange={v => updateField(locale, "description", v)} multiline
              placeholder={locale === "es" ? "Descripción del proyecto" : "Project description"}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.62)", lineHeight: 1.6, marginBottom: 14, display: "block" }} />
            <div style={{ borderTop: "1px solid rgba(var(--accent),0.1)", paddingTop: 12 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", marginBottom: 4 }}>
                {locale === "es" ? "Estatus" : "Status"}
              </div>
              <Editable value={c.results} onChange={v => updateField(locale, "results", v)}
                placeholder={locale === "es" ? "ej. En construcción · Entrega 2026" : "e.g. Under construction · Delivery 2026"}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--accent))" }} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ padding: "0 20px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center" }}>
        Haz clic directamente sobre el título, la descripción o el estatus para editarlo.
      </p>

      {/* Image list */}
      <div style={{ padding: "20px", borderTop: "1px solid rgba(var(--accent),0.12)" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(var(--ink),0.45)", marginBottom: 12 }}>
          Fotos del proyecto ({galleryImages.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {form.images.map((url, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={url} placeholder={`URL de la imagen ${i + 1}…`}
                onChange={e => setImageAt(i, e.target.value)}
                style={{ flex: 1, padding: "8px 12px", background: "rgb(var(--surface))", border: "1px solid rgba(var(--accent),0.15)", outline: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgb(var(--ink))" }} />
              <button onClick={() => removeImage(i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "transparent", border: "1px solid rgba(var(--error),0.3)", color: "rgb(var(--error))", cursor: "pointer", flexShrink: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addImage}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px dashed rgba(var(--accent),0.4)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <Plus size={13} /> Agregar foto
        </button>
      </div>

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
