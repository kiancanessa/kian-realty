"use client";
import { useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { CheckCircle, ArrowRight } from "lucide-react";

const HIGHLIGHTS = ["Bilingual (English / Spanish)", "Tech-driven marketing approach", "Baja California coast specialist", "Transparent, honest process"];

export default function About() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 120));
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ padding: "112px 24px", background: "#0A0A0A", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 80, alignItems: "center" }} className="about-grid">
        {/* Photo */}
        <div className="reveal" style={{ position: "relative" }}>
          <div style={{ position: "relative", maxWidth: 380, margin: "0 auto", aspectRatio: "3/4", overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, #1E1E1E, #141414)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 80, height: 80, border: "1px solid rgba(201,168,76,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "rgba(201,168,76,0.4)" }}>K</span>
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,168,76,0.28)" }}>Add Photo</span>
            </div>
            <img src="/images/kian.jpg" alt="Kian Saavedra Canessa" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => (e.currentTarget.style.display = "none")} />
            {/* Frame */}
            <div style={{ position: "absolute", bottom: -16, right: -16, width: "100%", height: "100%", border: "1px solid rgba(201,168,76,0.2)", pointerEvents: "none" }} />
          </div>
          {/* Badge */}
          <div style={{ position: "absolute", bottom: 0, left: 0, background: "#C9A84C", padding: "14px 24px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#0A0A0A" }}>Baja California</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#0A0A0A" }}>Coast Specialist</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="gold-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C9A84C" }}>{t.about.title}</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#F5F0E8", fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.01em", marginBottom: 8 }}>
            {t.about.name}
          </h2>
          <div className="reveal" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 32 }}>
            {t.about.role}
          </div>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(245,240,232,0.48)", lineHeight: 1.8, marginBottom: 16, fontSize: "0.9rem" }}>{t.about.bio1}</p>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(245,240,232,0.48)", lineHeight: 1.8, marginBottom: 40, fontSize: "0.9rem" }}>{t.about.bio2}</p>
          <ul className="reveal" style={{ listStyle: "none", padding: 0, marginBottom: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            {HIGHLIGHTS.map((h, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={14} color="#C9A84C" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgba(245,240,232,0.55)" }}>{h}</span>
              </li>
            ))}
          </ul>
          <div className="reveal">
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 32px", background: "#C9A84C", color: "#0A0A0A", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#E8C97A"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#C9A84C"}>
              {t.about.cta} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
