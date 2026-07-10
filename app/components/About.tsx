"use client";
import { useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import Logo from "./Logo";

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
    <section id="about" ref={sectionRef} style={{ padding: "112px 24px", background: "#FAF6EE", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 80, alignItems: "center" }} className="about-grid">
        {/* Photo */}
        <div className="reveal" style={{ position: "relative" }}>
          <div style={{ position: "relative", maxWidth: 380, margin: "0 auto", aspectRatio: "3/4", overflow: "hidden" }}>
            <img src="/images/about/coastline.jpg" alt="Rosarito coastline" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.55), transparent 55%)" }} />
            <div style={{ position: "absolute", top: 24, left: 24, background: "rgba(10,10,10,0.55)", border: "1px solid rgba(107,138,66,0.3)", padding: 12, backdropFilter: "blur(4px)" }}>
              <Logo size={40} strokeColor="#FAF6EE" />
            </div>
            {/* Frame */}
            <div style={{ position: "absolute", bottom: -16, right: -16, width: "100%", height: "100%", border: "1px solid rgba(107,138,66,0.2)", pointerEvents: "none" }} />
          </div>
          {/* Badge */}
          <div style={{ position: "absolute", bottom: 0, left: 0, background: "#6B8A42", padding: "14px 24px" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#FAF6EE" }}>Rosarito</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#FAF6EE" }}>Coast Specialists</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B8A42" }}>{t.about.title}</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#23221E", fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.01em", marginBottom: 8 }}>
            {t.about.name}
          </h2>
          <div className="reveal" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#6B8A42", marginBottom: 32 }}>
            {t.about.role}
          </div>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.48)", lineHeight: 1.8, marginBottom: 16, fontSize: "0.9rem" }}>{t.about.bio1}</p>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.48)", lineHeight: 1.8, marginBottom: 40, fontSize: "0.9rem" }}>{t.about.bio2}</p>
          <ul className="reveal" style={{ listStyle: "none", padding: 0, marginBottom: 40, display: "flex", flexDirection: "column", gap: 12 }}>
            {t.about.highlights.map((h, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={14} color="#6B8A42" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgba(35,34,30,0.55)" }}>{h}</span>
              </li>
            ))}
          </ul>
          <div className="reveal">
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 32px", background: "#6B8A42", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.3s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#85A857"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#6B8A42"}>
              {t.about.cta} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="reveal" style={{ maxWidth: 1280, margin: "80px auto 0", paddingTop: 64, borderTop: "1px solid rgba(107,138,66,0.1)" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B8A42", marginBottom: 32, textAlign: "center" }}>
          {t.about.teamTitle}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {t.about.team.map((member, i) => (
            <div key={i} style={{ textAlign: "center", padding: 24, border: "1px solid rgba(107,138,66,0.1)", background: "#FFFFFF" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(107,138,66,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", overflow: "hidden" }}>
                {member.photo ? (
                  <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "#6B8A42" }}>
                    {member.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#23221E", fontWeight: 400, marginBottom: 4 }}>
                {member.name}
              </div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgba(35,34,30,0.4)" }}>
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
