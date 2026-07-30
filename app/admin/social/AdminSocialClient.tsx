"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import type { SocialPost, SocialNetwork } from "../../lib/social-posts";
import { NETWORK_LABELS, STATUS_LABELS } from "../../lib/social-posts";
import SocialPostEditor, { emptySocialForm, socialPostToForm, type SocialFormState } from "./SocialPostEditor";

const STATUS_COLORS: Record<string, string> = {
  draft: "rgba(var(--ink),0.4)",
  pending: "rgb(var(--accent))",
  publishing: "rgb(var(--accent))",
  done: "rgb(var(--accent))",
  failed: "rgb(var(--error))",
};

export default function AdminSocialClient() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPosts = () =>
    fetch("/api/admin/social/posts")
      .then(res => res.json())
      .then(data => setPosts(data.posts ?? []))
      .finally(() => setLoading(false));

  const load = () => {
    setLoading(true);
    fetchPosts();
  };

  // `loading` already starts true, so the first fetch skips the spinner toggle —
  // that keeps setState out of the effect body synchronously.
  useEffect(() => {
    fetchPosts();
  }, []);

  const save = async (form: SocialFormState) => {
    setSaving(true);
    // datetime-local has no timezone, so convert to an absolute instant before
    // sending — otherwise Postgres would read it as UTC and shift the schedule.
    const payload = { ...form, scheduled_at: new Date(form.scheduled_at).toISOString() };
    const url = editingId === "new" ? "/api/admin/social/posts" : `/api/admin/social/posts/${editingId}`;
    const res = await fetch(url, {
      method: editingId === "new" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`No se pudo guardar: ${data.error ?? res.status}`);
      return;
    }
    setEditingId(null);
    load();
  };

  const retry = async (id: number, network: SocialNetwork) => {
    await fetch(`/api/admin/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retryNetwork: network }),
    });
    load();
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/social/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("No se puede eliminar una publicación que ya salió.");
      return;
    }
    load();
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Redes sociales
          </h1>
          {editingId === null && (
            <button onClick={() => setEditingId("new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nueva publicación
            </button>
          )}
        </div>

        {editingId === "new" && (
          <SocialPostEditor initial={emptySocialForm()} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        )}
        {typeof editingId === "number" && (
          <SocialPostEditor
            key={editingId}
            initial={socialPostToForm(posts.find(p => p.id === editingId)!)}
            onSave={save}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && posts.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay publicaciones programadas.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map(p => {
            const editable = p.status === "draft" || p.status === "pending";
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: 18, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14, minWidth: 0 }}>
                  {p.media_urls?.[0] && p.media_type === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.media_urls[0]} alt="" style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: STATUS_COLORS[p.status], border: `1px solid ${STATUS_COLORS[p.status]}`, padding: "2px 8px" }}>
                        {STATUS_LABELS[p.status]}
                      </span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", border: "1px solid rgba(var(--ink),0.15)", padding: "2px 8px" }}>
                        {p.post_type === "story" ? "Historia" : "Feed"}
                      </span>
                      {p.publish_as_news && (
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", border: "1px solid rgba(var(--ink),0.15)", padding: "2px 8px" }}>
                          + Noticia
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "8px 0 4px", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))", maxWidth: 460, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.caption || "(sin texto)"}
                    </p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.4)" }}>
                      {new Date(p.scheduled_at).toLocaleString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      {(p.targets ?? []).map(t => (
                        <span key={t.id} title={t.error_message ?? undefined}
                          style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: t.status === "failed" ? "rgb(var(--error))" : "rgba(var(--ink),0.5)" }}>
                          {NETWORK_LABELS[t.network]}: {t.status === "done" ? "✓" : t.status === "failed" ? "✕" : "…"}
                          {t.status === "failed" && (
                            <button onClick={() => retry(p.id, t.network)} title="Reintentar"
                              style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: "rgb(var(--error))", padding: 0 }}>
                              <RefreshCw size={11} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {editable && (
                    <button onClick={() => setEditingId(p.id)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer" }}>
                      <Pencil size={13} />
                    </button>
                  )}
                  {p.status !== "done" && (
                    <button onClick={() => remove(p.id)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--error),0.35)", color: "rgb(var(--error))", cursor: "pointer" }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
