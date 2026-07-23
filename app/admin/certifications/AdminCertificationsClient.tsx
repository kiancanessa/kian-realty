"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import type { Certification } from "../../lib/certifications";
import CertificationEditor, { emptyCertificationForm, certificationToForm, type CertificationFormState } from "./CertificationEditor";

export default function AdminCertificationsClient() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/certifications")
      .then(res => res.json())
      .then(data => setCertifications(data.certifications ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (form: CertificationFormState) => {
    setSaving(true);
    if (editingId === "new") {
      await fetch("/api/admin/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else if (editingId !== null) {
      await fetch(`/api/admin/certifications/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditingId(null);
    load();
  };

  const setPublished = async (id: number, published: boolean) => {
    await fetch(`/api/admin/certifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    load();
  };

  const remove = async (id: number) => {
    await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Certificaciones
          </h1>
          {editingId === null && (
            <button onClick={() => setEditingId("new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nueva certificación
            </button>
          )}
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 32 }}>
          Sellos de certificación — visibles en la página principal. El orden de publicación es el orden en que se muestran.
        </p>

        {editingId === "new" && (
          <CertificationEditor initial={emptyCertificationForm()} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        )}
        {typeof editingId === "number" && (
          <CertificationEditor
            key={editingId}
            initial={certificationToForm(certifications.find(c => c.id === editingId)!)}
            onSave={save}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && certifications.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay certificaciones registradas.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {certifications.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {c.image_url && (
                  <img src={c.image_url} alt="" style={{ width: 36, height: 36, objectFit: "contain", borderRadius: "50%", background: "#0E2620" }} />
                )}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{c.content.en.name || "(sin nombre)"}</span>
                    {c.published && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                        Publicado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!c.published && (
                  <button onClick={() => setPublished(c.id, true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Check size={13} /> Publicar
                  </button>
                )}
                {c.published && (
                  <button onClick={() => setPublished(c.id, false)}
                    style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Despublicar
                  </button>
                )}
                <button onClick={() => setEditingId(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => remove(c.id)}
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
