"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import type { Announcement } from "../../lib/announcements";
import { ANNOUNCEMENT_TEMPLATES } from "../../lib/announcements";
import AnnouncementEditor, { emptyAnnouncementForm, announcementToForm, type AnnouncementFormState } from "./AnnouncementEditor";

export default function AdminAnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (form: AnnouncementFormState) => {
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

  const templateLabel = (key: string) => ANNOUNCEMENT_TEMPLATES.find(t => t.key === key)?.label ?? key;

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Anuncios
          </h1>
          {editingId === null && (
            <button onClick={() => setEditingId("new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nuevo anuncio
            </button>
          )}
        </div>

        {editingId === "new" && (
          <AnnouncementEditor initial={emptyAnnouncementForm()} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        )}
        {typeof editingId === "number" && (
          <AnnouncementEditor
            key={editingId}
            initial={announcementToForm(announcements.find(a => a.id === editingId)!)}
            onSave={save}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && announcements.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay anuncios creados.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {announcements.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{a.content.en.title || "(sin título)"}</span>
                  {a.active && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                      Activo
                    </span>
                  )}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.05em", color: "rgba(var(--ink),0.4)", border: "1px solid rgba(var(--ink),0.15)", padding: "2px 8px" }}>
                    {templateLabel(a.template)}
                  </span>
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
                <button onClick={() => setEditingId(a.id)}
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
