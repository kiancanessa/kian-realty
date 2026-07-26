"use client";
import { useEffect, useRef, useState } from "react";
import { Hammer } from "lucide-react";
import { useLang } from "../lib/LangContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectGallery from "../components/ProjectGallery";
import type { Project, ProjectContent } from "../lib/projects";

type PublicProject = Pick<Project, "id" | "image_url" | "images" | "content" | "created_at">;

export default function DevelopmentPage() {
  const { locale, t } = useLang();
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 120));
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [projects.length]);

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      <div ref={sectionRef} style={{ padding: "140px 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              {t.services.development.title}
            </span>
          </div>
          <h1 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.development.title}
          </h1>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 620, marginBottom: 56 }}>
            {t.development.subtitle}
          </p>

          {!loading && projects.length === 0 && (
            <div className="reveal" style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed rgba(var(--accent),0.25)" }}>
              <Hammer size={28} color="rgba(var(--accent),0.4)" style={{ marginBottom: 16 }} />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.5)", maxWidth: 380, margin: "0 auto 24px" }}>
                {t.development.empty}
              </p>
              <a href="/#contact" style={{ display: "inline-block", padding: "12px 28px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {t.development.cta}
              </a>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {projects.map(p => {
              const c: ProjectContent[typeof locale] = p.content[locale];
              const images = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
              return (
                <div key={p.id} className="reveal" style={{
                  display: "grid", gridTemplateColumns: "1fr", gap: 0,
                  border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))", overflow: "hidden",
                  transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 56px rgba(0,0,0,0.14)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <ProjectGallery images={images} alt={c.title} height={460} />
                  <div style={{ padding: "36px 40px 40px" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))", marginBottom: 14 }}>
                      {c.title}
                    </h3>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", color: "rgba(var(--ink),0.6)", lineHeight: 1.75, marginBottom: 22, whiteSpace: "pre-line", maxWidth: 720 }}>
                      {c.description}
                    </p>
                    {c.results && (
                      <div style={{ borderTop: "1px solid rgba(var(--accent),0.1)", paddingTop: 16 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", marginBottom: 6 }}>
                          {locale === "es" ? "Estatus" : "Status"}
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", color: "rgb(var(--accent))" }}>
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
