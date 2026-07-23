"use client";
import { useEffect, useState } from "react";
import { Hammer } from "lucide-react";
import { useLang } from "../lib/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Project, ProjectContent } from "../lib/projects";

type PublicProject = Pick<Project, "id" | "image_url" | "content" | "created_at">;

export default function DevelopmentPage() {
  const { locale, t } = useLang();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      <div style={{ padding: "140px 24px 96px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              {t.services.development.title}
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.development.title}
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 620, marginBottom: 56 }}>
            {t.development.subtitle}
          </p>

          {!loading && projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed rgba(var(--accent),0.25)" }}>
              <Hammer size={28} color="rgba(var(--accent),0.4)" style={{ marginBottom: 16 }} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.5)", maxWidth: 380, margin: "0 auto 24px" }}>
                {t.development.empty}
              </p>
              <a href="/#contact" style={{ display: "inline-block", padding: "12px 28px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {t.development.cta}
              </a>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
            {projects.map(p => {
              const c: ProjectContent[typeof locale] = p.content[locale];
              return (
                <div key={p.id} style={{ border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden" }}>
                  <div style={{ height: 220, background: "rgb(var(--bg-alt))" }}>
                    {p.image_url && (
                      <img src={p.image_url} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))", marginBottom: 10 }}>
                      {c.title}
                    </h3>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.6)", lineHeight: 1.65, marginBottom: 18, whiteSpace: "pre-line" }}>
                      {c.description}
                    </p>
                    {c.results && (
                      <div style={{ borderTop: "1px solid rgba(var(--accent),0.1)", paddingTop: 14 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", marginBottom: 4 }}>
                          {locale === "es" ? "Resultado" : "Result"}
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgb(var(--accent))" }}>
                          {c.results}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
