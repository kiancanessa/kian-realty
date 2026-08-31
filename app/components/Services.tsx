"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "../lib/LangContext";
import { Home, TrendingUp, Key, BarChart2, Scale, Hammer, ArrowRight } from "lucide-react";

type ServiceKey = "buy" | "sell" | "rent" | "invest" | "legal" | "development";

// Drop a photo at these paths to replace the icon placeholder — the card picks
// it up automatically, no code change needed.
const ITEMS: { icon: typeof Home; key: ServiceKey; photo: string }[] = [
  { icon: Home, key: "buy", photo: "/images/services/buy.jpg" },
  { icon: TrendingUp, key: "sell", photo: "/images/services/sell.jpg" },
  { icon: Key, key: "rent", photo: "/images/services/rent.jpg" },
  { icon: BarChart2, key: "invest", photo: "/images/services/invest.jpg" },
  { icon: Scale, key: "legal", photo: "/images/services/legal.jpg" },
  { icon: Hammer, key: "development", photo: "/images/services/development.jpg" },
];

/** Photo when one exists, otherwise a large icon on the brand gradient, so the
 *  section looks finished before any photography has been supplied. */
function ServiceVisual({ photo, icon: Icon, alt }: { photo: string; icon: typeof Home; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const img = new window.Image();
    img.onload = () => { if (alive) setLoaded(true); };
    img.src = photo;
    return () => { alive = false; };
  }, [photo]);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, rgba(var(--accent),0.30), rgba(var(--accent-dark),0.55))" }} />
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={54} color="rgba(250,246,238,0.5)" strokeWidth={1} />
        </div>
      )}
      {loaded && (
        <img className="svc-photo" src={photo} alt={alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </>
  );
}

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

  const LINKS: Partial<Record<ServiceKey, { href: string; label: string }>> = {
    sell: { href: "/ventas", label: t.services.viewSales },
    development: { href: "/desarrollo", label: t.services.viewProjects },
  };

  return (
    <section id="services" ref={sectionRef} style={{ padding: "112px 24px", background: "rgb(var(--bg))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>{t.labels.services}</span>
            <div className="sage-line" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.services.title}
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.38)", maxWidth: 500, margin: "0 auto", fontSize: "0.88rem", lineHeight: 1.7 }}>
            {t.services.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {ITEMS.map(({ icon: Icon, key, photo }, i) => {
            const link = LINKS[key];
            const cardStyle: React.CSSProperties = {
              position: "relative", aspectRatio: "4 / 5", textDecoration: "none",
              display: "block", cursor: link ? "pointer" : "default",
            };

            const inner = (
              <>
                <ServiceVisual photo={photo} icon={Icon} alt={t.services[key].title} />

                {/* Scrim keeps the copy legible over any photograph. */}
                <div className="svc-scrim" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,8,0.92) 12%, rgba(10,10,8,0.45) 48%, rgba(10,10,8,0.12) 100%)" }} />

                <div style={{ position: "absolute", top: 18, right: 22, fontFamily: "'Cormorant Garamond', serif", fontSize: "3.4rem", fontWeight: 300, color: "rgba(250,246,238,0.13)", userSelect: "none", lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 24px 24px" }}>
                  <div style={{ width: 38, height: 38, border: "1px solid rgba(250,246,238,0.35)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon size={16} color="#FAF6EE" />
                  </div>

                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FAF6EE", fontSize: "1.6rem", fontWeight: 400, lineHeight: 1.2 }}>
                    {t.services[key].title}
                  </h3>

                  <div className="svc-reveal">
                    <div>
                      <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(250,246,238,0.72)", fontSize: "0.82rem", lineHeight: 1.65, paddingTop: 10 }}>
                        {t.services[key].desc}
                      </p>
                      {link && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                          {link.label} <ArrowRight size={13} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );

            return link
              ? <Link key={key} href={link.href} className="reveal svc-card" style={cardStyle}>{inner}</Link>
              : <div key={key} className="reveal svc-card" style={cardStyle}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
