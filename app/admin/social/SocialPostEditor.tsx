"use client";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Check, X, Upload } from "lucide-react";
import type { SocialPost, SocialNetwork, SocialPostType, SocialMediaType } from "../../lib/social-posts";
import { NETWORK_LABELS } from "../../lib/social-posts";

export type SocialFormState = {
  post_type: SocialPostType;
  caption: string;
  media_urls: string[];
  media_type: SocialMediaType;
  scheduled_at: string;
  networks: SocialNetwork[];
  publish_as_news: boolean;
  status: "draft" | "pending";
};

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time, so the
// UTC timestamp from Postgres has to be shifted before it can be shown.
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

function defaultScheduledAt(): string {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  return toLocalInputValue(d.toISOString());
}

export function emptySocialForm(): SocialFormState {
  return {
    post_type: "feed",
    caption: "",
    media_urls: [],
    media_type: "image",
    scheduled_at: defaultScheduledAt(),
    networks: ["facebook", "instagram"],
    publish_as_news: false,
    status: "pending",
  };
}

export function socialPostToForm(p: SocialPost): SocialFormState {
  return {
    post_type: p.post_type,
    caption: p.caption,
    media_urls: p.media_urls ?? [],
    media_type: p.media_type,
    scheduled_at: toLocalInputValue(p.scheduled_at),
    networks: (p.targets ?? []).map(t => t.network),
    publish_as_news: p.publish_as_news,
    status: p.status === "draft" ? "draft" : "pending",
  };
}

const labelStyle = {
  display: "block", marginBottom: 6, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
  letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(var(--ink),0.5)",
};

const inputStyle = {
  width: "100%", padding: "10px 12px", background: "rgb(var(--bg))",
  border: "1px solid rgba(var(--accent),0.2)", color: "rgb(var(--ink))",
  fontFamily: "'Jost', sans-serif", fontSize: "0.85rem",
};

export default function SocialPostEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: SocialFormState;
  onSave: (form: SocialFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<SocialFormState>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isStory = form.post_type === "story";
  const igOnlyStory = isStory && form.networks.includes("instagram");
  const fbStorySelected = isStory && form.networks.includes("facebook");

  const toggleNetwork = (network: SocialNetwork) => {
    setForm(prev => ({
      ...prev,
      networks: prev.networks.includes(network)
        ? prev.networks.filter(n => n !== network)
        : [...prev.networks, network],
    }));
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const blob = await upload(`social/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/social/upload",
      });
      setForm(prev => ({
        ...prev,
        media_urls: [blob.url],
        media_type: file.type.startsWith("video/") ? "video" : "image",
      }));
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const canSave =
    form.media_urls.length > 0 && form.networks.length > 0 && form.scheduled_at !== "" && !uploading;

  return (
    <div style={{ marginBottom: 32, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--bg-alt))", padding: 24 }}>
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <label style={labelStyle}>Tipo de publicación</label>
          <div style={{ display: "flex", gap: 6 }}>
            {([["feed", "Feed"], ["story", "Historia"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setForm(prev => ({ ...prev, post_type: key }))}
                style={{
                  padding: "7px 16px", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: `1px solid ${form.post_type === key ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`,
                  background: form.post_type === key ? "rgb(var(--accent))" : "transparent",
                  color: form.post_type === key ? "#FAF6EE" : "rgb(var(--ink))",
                }}>
                {label}
              </button>
            ))}
          </div>
          <p style={{ marginTop: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)" }}>
            {isStory ? "Formato vertical 9:16." : "Formato entre 4:5 y 1.91:1."}
          </p>
        </div>

        <div>
          <label style={labelStyle}>Redes destino</label>
          <div style={{ display: "flex", gap: 6 }}>
            {(["facebook", "instagram"] as const).map(network => (
              <button key={network} onClick={() => toggleNetwork(network)}
                style={{
                  padding: "7px 16px", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: `1px solid ${form.networks.includes(network) ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`,
                  background: form.networks.includes(network) ? "rgb(var(--accent))" : "transparent",
                  color: form.networks.includes(network) ? "#FAF6EE" : "rgb(var(--ink))",
                }}>
                {NETWORK_LABELS[network]}
              </button>
            ))}
          </div>
          {fbStorySelected && (
            <p style={{ marginTop: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--error))" }}>
              Las historias de Facebook aún no se publican por API — esa se marcará como fallida y hay que subirla a mano
              desde Meta Business Suite.
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Imagen o video</label>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", cursor: uploading ? "wait" : "pointer",
            border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))",
            fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            <Upload size={14} />
            {uploading ? "Subiendo…" : form.media_urls.length > 0 ? "Cambiar archivo" : "Subir archivo"}
            <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" hidden
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
          {uploadError && (
            <p style={{ marginTop: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgb(var(--error))" }}>
              {uploadError}
            </p>
          )}
          {form.media_urls[0] && (
            <div style={{ marginTop: 12 }}>
              {form.media_type === "video" ? (
                <video src={form.media_urls[0]} controls style={{ maxWidth: 240, border: "1px solid rgba(var(--accent),0.15)" }} />
              ) : (
                // Blob URLs are external and arbitrary, so next/image would need
                // a remotePatterns entry per host — a plain img keeps it simple.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.media_urls[0]} alt="Vista previa" style={{ maxWidth: 240, border: "1px solid rgba(var(--accent),0.15)" }} />
              )}
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>Texto de la publicación</label>
          <textarea value={form.caption} rows={5}
            onChange={e => setForm(prev => ({ ...prev, caption: e.target.value }))}
            placeholder="Escribe el copy con emojis y hashtags…"
            style={{ ...inputStyle, resize: "vertical" }} />
          {igOnlyStory && (
            <p style={{ marginTop: 6, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.55)" }}>
              Instagram no acepta texto en historias — este copy se ignorará para la historia de Instagram.
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Fecha y hora de publicación</label>
          <input type="datetime-local" value={form.scheduled_at}
            onChange={e => setForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
            style={{ ...inputStyle, maxWidth: 260 }} />
          <p style={{ marginTop: 6, fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)" }}>
            Se publica en la primera revisión automática después de esa hora (cada 30 minutos).
          </p>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--ink))" }}>
          <input type="checkbox" checked={form.publish_as_news}
            onChange={e => setForm(prev => ({ ...prev, publish_as_news: e.target.checked }))} />
          Publicar también como noticia en el sitio
        </label>

        <div>
          <label style={labelStyle}>Al guardar</label>
          <div style={{ display: "flex", gap: 6 }}>
            {([["pending", "Programar"], ["draft", "Guardar como borrador"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setForm(prev => ({ ...prev, status: key }))}
                style={{
                  padding: "7px 16px", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  border: `1px solid ${form.status === key ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`,
                  background: form.status === key ? "rgb(var(--accent))" : "transparent",
                  color: form.status === key ? "#FAF6EE" : "rgb(var(--ink))",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <button onClick={() => onSave(form)} disabled={saving || !canSave}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "none",
            background: canSave ? "rgb(var(--accent))" : "rgba(var(--accent),0.4)", color: "#FAF6EE",
            cursor: saving || !canSave ? "not-allowed" : "pointer",
            fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
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
