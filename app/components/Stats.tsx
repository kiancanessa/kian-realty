"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../lib/LangContext";

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}</span>;
}

export default function Stats({ activeListings }: { activeListings: number }) {
  const { t } = useLang();
  const stats = [
    { value: 120, suffix: "+", label: t.stats.coast },
    { value: activeListings, suffix: "", label: t.stats.listings },
    { value: 300, suffix: "+", label: t.stats.clients },
    { value: 15,  suffix: "+", label: t.stats.exp },
  ];
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 90));
      });
    }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ borderTop: "1px solid rgba(var(--accent),0.12)", borderBottom: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--bg-alt))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="reveal" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--accent))", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              <CountUp target={s.value} />{s.suffix}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(var(--ink),0.35)", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
