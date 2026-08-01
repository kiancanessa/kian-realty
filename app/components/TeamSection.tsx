"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { SOCIAL_LINKS } from "../lib/social";

const WHATSAPP_HREF = "https://wa.me/526611256107";
const EMAIL_HREF = "mailto:jorgeelcasarosarito@gmail.com";

function initials(name: string) {
  return name
    .replace(/^Lic\.\s*/i, "")
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("");
}

/** Photo with an initials placeholder underneath while the image loads. */
function Portrait({ photo, name, rounded }: { photo?: string; name: string; rounded: number }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!photo) return;
    setLoaded(false);
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = photo;
  }, [photo]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(var(--bg-alt))", borderRadius: rounded }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "rgba(var(--accent),0.55)" }}>
        {initials(name)}
      </span>
      {loaded && photo && (
        <img
          className="team-member-photo"
          src={photo}
          alt={name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: rounded }}
        />
      )}
    </div>
  );
}

export default function TeamSection() {
  const { t } = useLang();
  const team = t.about.team;
  const [lead, ...rest] = team;

  const gridRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);

  // Reveal each member card once, then leave it on screen.
  useEffect(() => {
    const nodes = gridRef.current?.querySelectorAll(".team-member");
    if (!nodes?.length) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target); // stays visible; no re-trigger
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, [team.length]);

  // Parallax tilt + cursor glow, both written as CSS custom properties inside a
  // rAF so pointermove never triggers a React re-render.
  const frame = useRef<number | null>(null);
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = leadRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const relX = x / rect.width - 0.5;
      const relY = y / rect.height - 0.5;
      el.style.setProperty("--tilt-y", `${relX * 6}deg`);
      el.style.setProperty("--tilt-x", `${-relY * 6}deg`);
      el.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
      el.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = leadRef.current;
    if (!el) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  const chip: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 34, height: 34, borderRadius: "50%",
    border: "1px solid rgba(var(--accent),0.28)", color: "rgb(var(--accent))",
    textDecoration: "none", flexShrink: 0,
  };

  return (
    <div style={{ position: "relative", maxWidth: 1280, margin: "96px auto 0", paddingTop: 72, borderTop: "1px solid rgba(var(--accent),0.1)", overflow: "hidden" }}>
      {/* Ambient background depth */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="team-blob team-blob-a" style={{ top: "4%", left: "-6%", width: 420, height: 420, background: "rgba(var(--accent),0.16)" }} />
        <div className="team-blob team-blob-b" style={{ top: "42%", right: "-8%", width: 480, height: 480, background: "rgba(var(--accent-light),0.13)" }} />
        <div className="team-blob team-blob-c" style={{ bottom: "2%", left: "28%", width: 380, height: 380, background: "rgba(var(--accent-dark),0.10)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 48, textAlign: "center" }}>
          {t.about.teamTitle}
        </div>

        <div ref={gridRef} className="team-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
          {/* ---- Lead card ---- */}
          <div className="team-lead-col">
            <div className="lead-float">
              <div
                ref={leadRef}
                className="lead-parallax"
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
              >
                <div className="lead-card" style={{ padding: 2 }}>
                  <div className="lead-glow" aria-hidden />
                  <div style={{ padding: "36px 34px 34px" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 24, overflow: "hidden", marginBottom: 28 }}>
                      <Portrait photo={lead.photo} name={lead.name} rounded={24} />
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 12 }}>
                      {lead.role}
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.9rem, 3vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.01em", color: "rgb(var(--ink))", marginBottom: 18 }}>
                      {lead.name}
                    </h3>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(var(--ink),0.55)", marginBottom: 30 }}>
                      {lead.bio}
                    </p>
                    <a
                      href="#contact"
                      style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "15px 30px", borderRadius: 999, background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s ease, transform 0.3s ease" }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent-light))"; el.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.transform = "translateY(0)"; }}
                    >
                      {t.about.teamLeadCta} <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Cascading stack ---- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {rest.map((member, i) => (
              <div key={member.name} className="team-member" style={{ ["--i" as string]: i }}>
                <div
                  className="team-member-card"
                  style={{ display: "flex", gap: 22, alignItems: "flex-start", padding: 22, border: "1px solid rgba(var(--accent),0.12)", background: "rgba(var(--surface),0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                >
                  <div style={{ position: "relative", width: 104, height: 124, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
                    <Portrait photo={member.photo} name={member.name} rounded={18} />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.3rem", color: "rgb(var(--ink))", lineHeight: 1.25, marginBottom: 5 }}>
                      {member.name}
                    </h4>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgba(var(--ink),0.42)", lineHeight: 1.5 }}>
                      {member.role}
                    </div>

                    <div className="team-reveal">
                      <div>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.83rem", lineHeight: 1.7, color: "rgba(var(--ink),0.58)", paddingTop: 14 }}>
                          {member.bio}
                        </p>
                        <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
                          <a className="team-action" style={chip} href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp — ${member.name}`}
                            onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.color = "#FAF6EE"; }}
                            onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "rgb(var(--accent))"; }}>
                            <MessageCircle size={15} />
                          </a>
                          <a className="team-action" style={chip} href={EMAIL_HREF} aria-label={`Email — ${member.name}`}
                            onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.color = "#FAF6EE"; }}
                            onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "rgb(var(--accent))"; }}>
                            <Mail size={15} />
                          </a>
                          {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                            <a key={name} className="team-action" style={chip} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                              onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.color = "#FAF6EE"; }}
                              onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "rgb(var(--accent))"; }}>
                              <Icon size={15} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
