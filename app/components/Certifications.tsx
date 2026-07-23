"use client";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useLang } from "../lib/LangContext";
import type { Certification } from "../lib/certifications";

type PublicCertification = Pick<Certification, "id" | "image_url" | "content">;

export default function Certifications() {
  const { locale, t } = useLang();
  const [items, setItems] = useState<PublicCertification[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/certifications")
      .then(res => res.json())
      .then(data => setItems(data.certifications ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 140));
      });
    }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section ref={sectionRef} style={{ padding: "0 24px 96px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div className="sage-line" />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
            {t.certifications.title}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {items.map(item => {
            const c = item.content[locale] ?? item.content.en;
            return (
              <div key={item.id} className="reveal certification-card" style={{
                display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap",
                background: "#0E2620", borderRadius: 20, padding: "48px 56px",
                transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ flex: "1 1 380px" }}>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "1.05rem", color: "#FAF6EE", marginBottom: 18 }}>
                    {locale === "es" ? "Certificados por" : "All certified by"}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.15rem)", color: "#FAF6EE", marginBottom: 18, lineHeight: 1.2 }}>
                    {c.name}
                  </h3>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(250,246,238,0.55)", lineHeight: 1.8, maxWidth: 540 }}>
                    {c.description}
                  </p>
                </div>
                <div className="badge-pulse" style={{ flexShrink: 0, width: 130, height: 130, borderRadius: "50%", background: "rgba(var(--accent),0.14)", border: "1px solid rgba(var(--accent),0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <BadgeCheck size={58} color="rgb(var(--accent))" strokeWidth={1.3} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
