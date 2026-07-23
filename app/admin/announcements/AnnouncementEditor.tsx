"use client";
import { useState } from "react";
import { Monitor, Smartphone, Check, X } from "lucide-react";
import AnnouncementCard from "../../components/templates/AnnouncementCard";
import type { Announcement, AnnouncementContent, AnnouncementLocaleContent, AnnouncementTemplateKey } from "../../lib/announcements";
import { ANNOUNCEMENT_TEMPLATES, EMPTY_CONTENT } from "../../lib/announcements";
import type { Locale } from "../../lib/translations";

export type AnnouncementFormState = {
  content: AnnouncementContent;
  video_url: string;
  image_url: string;
  template: AnnouncementTemplateKey;
};

export function emptyAnnouncementForm(): AnnouncementFormState {
  return {
    content: { ...EMPTY_CONTENT, en: { ...EMPTY_CONTENT.en }, es: { ...EMPTY_CONTENT.es } },
    video_url: "",
    image_url: "",
    template: "classic",
  };
}

export function announcementToForm(a: Announcement): AnnouncementFormState {
  return { content: a.content, video_url: a.video_url ?? "", image_url: a.image_url ?? "", template: a.template };
}

export default function AnnouncementEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: AnnouncementFormState;
  onSave: (form: AnnouncementFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<AnnouncementFormState>(initial);
  const [locale, setLocale] = useState<Locale>("en");
  const [mobile, setMobile] = useState(false);

  const updateField = (l: Locale, key: keyof AnnouncementLocaleContent, value: string) => {
    setForm(prev => ({ ...prev, content: { ...prev.content, [l]: { ...prev.content[l], [key]: value } } }));
  };
  const updateActivities = (l: Locale, activities: string[]) => {
    setForm(prev => ({ ...prev, content: { ...prev.content, [l]: { ...prev.content[l], activities } } }));
  };
  const updateMeta = (patch: { image_url?: string; video_url?: string; ctaUrl?: string }) => {
    setForm(prev => ({
      ...prev,
      image_url: patch.image_url !== undefined ? patch.image_url : prev.image_url,
      video_url: patch.video_url !== undefined ? patch.video_url : prev.video_url,
      content: patch.ctaUrl !== undefined ? { ...prev.content, ctaUrl: patch.ctaUrl } : prev.content,
    }));
  };

  return (
    <div style={{ marginBottom: 32, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--bg-alt))" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(var(--accent),0.12)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ANNOUNCEMENT_TEMPLATES.map(tpl => (
            <button key={tpl.key} onClick={() => setForm(prev => ({ ...prev, template: tpl.key }))}
              style={{
                padding: "7px 14px", border: `1px solid ${form.template === tpl.key ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`, cursor: "pointer",
                fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase",
                background: form.template === tpl.key ? "rgb(var(--accent))" : "transparent",
                color: form.template === tpl.key ? "#FAF6EE" : "rgb(var(--ink))",
              }}>
              {tpl.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setMobile(false)} aria-label="Desktop"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: `1px solid ${!mobile ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`, background: !mobile ? "rgb(var(--accent))" : "transparent", color: !mobile ? "#FAF6EE" : "rgb(var(--ink))", cursor: "pointer" }}>
            <Monitor size={15} />
          </button>
          <button onClick={() => setMobile(true)} aria-label="Mobile"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: `1px solid ${mobile ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`, background: mobile ? "rgb(var(--accent))" : "transparent", color: mobile ? "#FAF6EE" : "rgb(var(--ink))", cursor: "pointer" }}>
            <Smartphone size={15} />
          </button>
        </div>
      </div>

      {/* Live editable preview */}
      <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "rgba(10,10,8,0.72)" }}>
        <div style={{ width: mobile ? 360 : "min(600px, 100%)", transition: "width 0.3s" }}>
          <AnnouncementCard
            content={form.content}
            videoUrl={form.video_url || null}
            imageUrl={form.image_url || null}
            ctaUrl={form.content.ctaUrl}
            template={form.template}
            locale={locale}
            onLocaleChange={setLocale}
            editable
            onFieldChange={updateField}
            onActivitiesChange={updateActivities}
            onMetaChange={updateMeta}
            forceMobile={mobile}
          />
        </div>
      </div>

      <p style={{ padding: "0 20px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center" }}>
        Haz clic directamente sobre cualquier texto para editarlo — usa el botón EN/ES para editar cada idioma.
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
