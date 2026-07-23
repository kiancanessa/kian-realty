"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil, X } from "lucide-react";
import type { Post, PostContent } from "../../lib/posts";
import { EMPTY_POST_CONTENT } from "../../lib/posts";

type FormState = { content: PostContent; image_url: string };

const emptyForm = (): FormState => ({
  content: { en: { ...EMPTY_POST_CONTENT.en }, es: { ...EMPTY_POST_CONTENT.es } },
  image_url: "",
});

export default function AdminNewsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/news")
      .then(res => res.json())
      .then(data => setPosts(data.posts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startCreate = () => {
    setForm(emptyForm());
    setEditingId("new");
  };

  const startEdit = (p: Post) => {
    setForm({ content: p.content, image_url: p.image_url ?? "" });
    setEditingId(p.id);
  };

  const cancelEdit = () => setEditingId(null);

  const updateField = (locale: "en" | "es", key: "title" | "body", value: string) => {
    setForm(prev => ({ ...prev, content: { ...prev.content, [locale]: { ...prev.content[locale], [key]: value } } }));
  };

  const save = async () => {
    setSaving(true);
    if (editingId === "new") {
      await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else if (editingId !== null) {
      await fetch(`/api/admin/news/${editingId}`, {
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
    await fetch(`/api/admin/news/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    load();
  };

  const remove = async (id: number) => {
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
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
            Noticias
          </h1>
          {editingId === null && (
            <button onClick={startCreate}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nueva noticia
            </button>
          )}
        </div>

        {editingId !== null && (
          <div style={{ marginBottom: 32, padding: 24, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--surface))" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "rgb(var(--ink))" }}>
                {editingId === "new" ? "Nueva noticia" : "Editar noticia"}
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
                  <div>
                    <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>Título</label>
                    <input style={inputStyle} value={form.content[locale].title} onChange={e => updateField(locale, "title", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>Texto</label>
                    <textarea rows={5} style={{ ...inputStyle, resize: "none" }} value={form.content[locale].body} onChange={e => updateField(locale, "body", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", color: "rgba(var(--ink),0.5)", marginBottom: 4 }}>
                URL de imagen (opcional)
              </label>
              <input style={inputStyle} value={form.image_url} onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))} />
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
        {!loading && posts.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay noticias creadas.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{p.content.en.title || "(sin título)"}</span>
                  {p.published && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                      Publicada
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.4)" }}>
                  {new Date(p.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!p.published && (
                  <button onClick={() => setPublished(p.id, true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Check size={13} /> Publicar
                  </button>
                )}
                {p.published && (
                  <button onClick={() => setPublished(p.id, false)}
                    style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Despublicar
                  </button>
                )}
                <button onClick={() => startEdit(p)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => remove(p.id)}
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
