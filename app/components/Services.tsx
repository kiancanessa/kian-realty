"use client";
import { useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";
import { Home, TrendingUp, Key, BarChart2, Scale, Hammer } from "lucide-react";

export default function Services() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((el, i) => {
            setTimeout(() => el.classList.add("visible"), i * 120);
          });
        }
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    { icon: Home, key: "buy" as const },
    { icon: TrendingUp, key: "sell" as const },
    { icon: Key, key: "rent" as const },
    { icon: BarChart2, key: "invest" as const },
    { icon: Scale, key: "legal" as const },
    { icon: Hammer, key: "development" as const },
  ];

  return (
    <section id="services" ref={sectionRef} style={{ padding: "112px 24px", background: "#FAF6EE" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B8A42" }}>{t.labels.services}</span>
            <div className="sage-line" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#23221E", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.services.title}
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.38)", maxWidth: 500, margin: "0 auto", fontSize: "0.88rem", lineHeight: 1.7 }}>
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {items.map(({ icon: Icon, key }, i) => (
            <div key={i} className="reveal" style={{ position: "relative", padding: 32, border: "1px solid rgba(107,138,66,0.1)", background: "#FFFFFF", overflow: "hidden", cursor: "default", transition: "border-color 0.4s, background 0.4s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(107,138,66,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.1)"; (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}>
              {/* Number */}
              <div style={{ position: "absolute", top: 16, right: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: "4rem", fontWeight: 300, color: "rgba(107,138,66,0.06)", userSelect: "none" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ width: 40, height: 40, border: "1px solid rgba(107,138,66,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <Icon size={17} color="rgba(107,138,66,0.7)" />
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#23221E", fontSize: "1.5rem", fontWeight: 400, marginBottom: 12 }}>
                {t.services[key].title}
              </h3>
              <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.38)", fontSize: "0.83rem", lineHeight: 1.7 }}>
                {t.services[key].desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
