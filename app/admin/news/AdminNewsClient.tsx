"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import type { Post } from "../../lib/posts";
import { POST_TEMPLATES } from "../../lib/posts";
import PostEditor, { emptyPostForm, postToForm, type PostFormState } from "./PostEditor";

export default function AdminNewsClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/news")
      .then(res => res.json())
      .then(data => setPosts(data.posts ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (form: PostFormState) => {
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

  const templateLabel = (key: string) => POST_TEMPLATES.find(t => t.key === key)?.label ?? key;

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Noticias
          </h1>
          {editingId === null && (
            <button onClick={() => setEditingId("new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nueva noticia
            </button>
          )}
        </div>

        {editingId === "new" && (
          <PostEditor initial={emptyPostForm()} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        )}
        {typeof editingId === "number" && (
          <PostEditor
            key={editingId}
            initial={postToForm(posts.find(p => p.id === editingId)!)}
            onSave={save}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && posts.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay noticias creadas.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{p.content.en.title || "(sin título)"}</span>
                  {p.published && (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                      Publicada
                    </span>
                  )}
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.05em", color: "rgba(var(--ink),0.4)", border: "1px solid rgba(var(--ink),0.15)", padding: "2px 8px" }}>
                    {templateLabel(p.template)}
                  </span>
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
                <button onClick={() => setEditingId(p.id)}
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
