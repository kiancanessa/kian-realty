"use client";
import { useEffect, useState } from "react";
import { useLang } from "../lib/LangContext";
import { Newspaper } from "lucide-react";
import type { PostContent } from "../lib/posts";

type PublicPost = { id: number; image_url: string | null; content: PostContent; created_at: string };

export default function News() {
  const { locale, t } = useLang();
  const [posts, setPosts] = useState<PublicPost[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setPosts(data.posts ?? []))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section style={{ padding: "96px 24px", background: "rgb(var(--bg))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div className="sage-line" />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            {t.news.title}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em", marginBottom: 12 }}>
          {t.news.title}
        </h2>
        <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.4)", fontSize: "0.88rem", marginBottom: 48 }}>
          {t.news.subtitle}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {posts.map(p => {
            const c = p.content[locale];
            return (
              <div key={p.id} style={{ border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden" }}>
                {p.image_url ? (
                  <div style={{ height: 160, background: "rgb(var(--bg-alt))" }}>
                    <img src={p.image_url} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(var(--bg-alt))" }}>
                    <Newspaper size={24} color="rgba(var(--accent),0.4)" />
                  </div>
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.35)", marginBottom: 8 }}>
                    {new Date(p.created_at).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "rgb(var(--ink))", marginBottom: 10 }}>
                    {c.title}
                  </h3>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.6)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {c.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
