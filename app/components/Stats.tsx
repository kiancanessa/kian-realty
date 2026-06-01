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

export default function Stats() {
  const { t } = useLang();
  const stats = [
    { value: 120, suffix: "+", label: t.stats.coast },
    { value: 48,  suffix: "",  label: t.stats.listings },
    { value: 200, suffix: "+", label: t.stats.clients },
    { value: 5,   suffix: "+", label: t.stats.exp },
  ];
  return (
    <section style={{ borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", background: "rgba(20,20,20,0.5)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }} className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#C9A84C", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              <CountUp target={s.value} />{s.suffix}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
