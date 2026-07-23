"use client";
import { useState } from "react";
import { Monitor, Smartphone, Check, X } from "lucide-react";
import NewsCard from "../../components/templates/NewsCard";
import type { Post, PostContent, PostLocaleContent, PostTemplateKey } from "../../lib/posts";
import { POST_TEMPLATES, EMPTY_POST_CONTENT } from "../../lib/posts";
import type { Locale } from "../../lib/translations";

export type PostFormState = {
  content: PostContent;
  image_url: string;
  template: PostTemplateKey;
};

export function emptyPostForm(): PostFormState {
  return {
    content: { en: { ...EMPTY_POST_CONTENT.en }, es: { ...EMPTY_POST_CONTENT.es } },
    image_url: "",
    template: "image",
  };
}

export function postToForm(p: Post): PostFormState {
  return { content: p.content, image_url: p.image_url ?? "", template: p.template };
}

export default function PostEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: PostFormState;
  onSave: (form: PostFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PostFormState>(initial);
  const [locale, setLocale] = useState<Locale>("en");
  const [mobile, setMobile] = useState(false);

  const updateField = (l: Locale, key: keyof PostLocaleContent, value: string) => {
    setForm(prev => ({ ...prev, content: { ...prev.content, [l]: { ...prev.content[l], [key]: value } } }));
  };

  return (
    <div style={{ marginBottom: 32, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--bg-alt))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(var(--accent),0.12)" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {POST_TEMPLATES.map(tpl => (
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
          <div style={{ display: "flex", border: "1px solid rgba(var(--accent),0.25)", borderRadius: 999, padding: 3, gap: 2, marginLeft: 8 }}>
            {(["en", "es"] as const).map(lang => (
              <button key={lang} onClick={() => setLocale(lang)}
                style={{ padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase",
                  background: locale === lang ? "rgb(var(--accent))" : "transparent", color: locale === lang ? "#FAF6EE" : "rgba(var(--ink),0.5)" }}>
                {lang}
              </button>
            ))}
          </div>
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

      <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "rgb(var(--bg))" }}>
        <div style={{ width: mobile ? 320 : 380, transition: "width 0.3s" }}>
          <NewsCard
            content={form.content}
            imageUrl={form.image_url || null}
            template={form.template}
            locale={locale}
            dateLabel={new Date().toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
            editable
            onFieldChange={updateField}
            onImageUrlChange={v => setForm(prev => ({ ...prev, image_url: v }))}
          />
        </div>
      </div>

      <p style={{ padding: "0 20px", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center" }}>
        Haz clic directamente sobre el título o el texto para editarlo — usa el botón EN/ES para editar cada idioma.
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
