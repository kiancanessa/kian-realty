"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil, X } from "lucide-react";
import type { Announcement, AnnouncementContent, AnnouncementLocaleContent } from "../../lib/announcements";
import { EMPTY_CONTENT } from "../../lib/announcements";

type FormState = { content: AnnouncementContent; video_url: string };

const emptyForm = (): FormState => ({
  content: { ...EMPTY_CONTENT, en: { ...EMPTY_CONTENT.en }, es: { ...EMPTY_CONTENT.es } },
  video_url: "",
});

const FIELD_LABELS: { key: keyof AnnouncementLocaleContent; label: string; multiline?: boolean }[] = [
  { key: "eyebrow", label: "Texto superior (categoría)" },
  { key: "title", label: "Título" },
  { key: "subtitle", label: "Subtítulo" },
  { key: "dates", label: "Fechas" },
  { key: "venue", label: "Lugar" },
  { key: "activitiesTitle", label: "Título de actividades" },
  { key: "priceLabel", label: "Etiqueta de precio" },
  { key: "price", label: "Precio" },
  { key: "priceNote", label: "Nota de precio", multiline: true },
  { key: "cta", label: "Texto del botón" },
];

export default function AdminAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startCreate = () => {
    setForm(emptyForm());
    setEditingId("new");
  };

  const startEdit = (a: Announcement) => {
    setForm({ content: a.content, video_url: a.video_url ?? "" });
    setEditingId(a.id);
  };

  const cancelEdit = () => setEditingId(null);

  const updateField = (locale: "en" | "es", key: keyof AnnouncementLocaleContent, value: string) => {
    setForm(prev => ({
      ...prev,
      content: { ...prev.content, [locale]: { ...prev.content[locale], [key]: value } },
    }));
  };

  const updateActivities = (locale: "en" | "es", value: string) => {
    setForm(prev => ({
      ...prev,
      content: { ...prev.content, [locale]: { ...prev.content[locale], activities: value.split(",").map(s => s.trim()).filter(Boolean) } },
    }));
  };

  const save = async () => {
    setSaving(true);
    if (editingId === "new") {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else if (editingId !== null) {
      await fetch(`/api/admin/announcements/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditingId(null);
    load();
  };

  const setActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    load();
  };

  const remove = async (id: number) => {
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    load();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(var(--bg-alt),1)", border: "1px solid rgba(var(--accent),0.2)",
    outline: "none", padding: "10px 12px", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem",
    color: "rgb(var(--ink))", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Anuncios
          </h1>
          {editingId === null && (
            <button onClick={startCreate}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nuevo anuncio
            </button>
          )}
        </div>

        {editingId !== null && (
          <div style={{ marginBottom: 32, padding: 24, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--surface))" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "rgb(var(--ink))" }}>
                {editingId === "new" ? "Nuevo anuncio" : "Editar anuncio"}
              </h2>
              <button onClick={cancelEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(var(--ink),0.5)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 16 }}>
              {(["en", "es"] as const).map(locale => (
                <div key={locale} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
                    {locale === "en" ? "Inglés" : "Español"}
                  </div>
                  {FIELD_LABELS.map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>{f.label}</label>
                      {f.multiline ? (
                        <textarea rows={2} style={{ ...inputStyle, resize: "none" }} value={form.content[locale][f.key] as string}
                          onChange={e => updateField(locale, f.key, e.target.value)} />
                      ) : (
                        <input style={inputStyle} value={form.content[locale][f.key] as string}
                          onChange={e => updateField(locale, f.key, e.target.value)} />
                      )}
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>Actividades (separadas por coma)</label>
                    <input style={inputStyle} value={form.content[locale].activities.join(", ")}
                      onChange={e => updateActivities(locale, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
                  Enlace del botón (ej. mailto:correo@ejemplo.com?subject=... o https://...)
                </label>
                <input style={inputStyle} value={form.content.ctaUrl}
                  onChange={e => setForm(prev => ({ ...prev, content: { ...prev.content, ctaUrl: e.target.value } }))} />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
                  URL del video (opcional, ej. /videos/archivo.mp4)
                </label>
                <input style={inputStyle} value={form.video_url} onChange={e => setForm(prev => ({ ...prev, video_url: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} disabled={saving}
                style={{ padding: "10px 20px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button onClick={cancelEdit}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}

        {!loading && announcements.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay anuncios creados.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {announcements.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{a.content.en.title || "(sin título)"}</span>
                  {a.active && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                      Activo
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.4)" }}>{a.content.en.dates}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!a.active && (
                  <button onClick={() => setActive(a.id, true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Check size={13} /> Publicar
                  </button>
                )}
                {a.active && (
                  <button onClick={() => setActive(a.id, false)}
                    style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Despublicar
                  </button>
                )}
                <button onClick={() => startEdit(a)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => remove(a.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--error),0.35)", color: "rgb(var(--error))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
