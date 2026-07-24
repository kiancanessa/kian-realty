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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {items.map(item => {
            const c = item.content[locale] ?? item.content.en;
            return (
              <div key={item.id} className="reveal certification-card" style={{
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                background: "#0E2620", borderRadius: 20, padding: "44px 32px",
                transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {/* Watermark */}
                <BadgeCheck size={220} strokeWidth={0.8} color="#FAF6EE"
                  style={{ position: "absolute", bottom: -50, right: -50, opacity: 0.05, transform: "rotate(-12deg)", zIndex: 0, pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className="badge-pulse" style={{ flexShrink: 0, width: 110, height: 110, borderRadius: "50%", background: "#FAF6EE", border: "1px solid rgba(var(--accent),0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 18, marginBottom: 24 }}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <BadgeCheck size={50} color="rgb(var(--accent))" strokeWidth={1.3} />
                    )}
                  </div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "#FAF6EE", marginBottom: 14 }}>
                    {locale === "es" ? "Certificados por" : "All certified by"}
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", color: "#FAF6EE", marginBottom: 14, lineHeight: 1.2 }}>
                    {c.name}
                  </h3>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(250,246,238,0.55)", lineHeight: 1.75 }}>
                    {c.description}
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
