"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { useLang } from "../lib/LangContext";

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

type TeamMember = { name: string; role: string; photo?: string; bio: string; whatsapp?: string; email?: string };

/** One roster card. Rendered twice per roster (once per wheel copy). */
function MemberCard({ member, ariaHidden }: { member: TeamMember; ariaHidden?: boolean }) {
  const button: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    flex: 1, minWidth: 0, height: 46, borderRadius: 999,
    border: "1px solid rgba(var(--accent),0.28)", color: "rgb(var(--accent))",
    textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem",
    fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap",
  };
  const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.background = "rgb(var(--accent))";
    el.style.color = "#FAF6EE";
  };
  const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.background = "transparent";
    el.style.color = "rgb(var(--accent))";
  };

  // Peter and Eduardo have no personal contact channel yet, so no action row
  // for them at all — a lone empty panel would read as broken, not minimal.
  const hasContact = !!(member.whatsapp || member.email);

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="team-member-card"
      style={{ display: "flex", gap: 22, alignItems: "flex-start", padding: 22, border: "1px solid rgba(var(--accent),0.12)", background: "rgba(var(--surface),0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", flexShrink: 0 }}
    >
      <div style={{ position: "relative", width: 104, height: 124, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
        <Portrait photo={member.photo} name={member.name} rounded={18} />
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", color: "rgb(var(--ink))", lineHeight: 1.25, marginBottom: 6 }}>
          {member.name}
        </h4>
        <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.48)", lineHeight: 1.5 }}>
          {member.role}
        </div>

        <div className="team-reveal">
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(var(--ink),0.6)", paddingTop: 14 }}>
              {member.bio}
            </p>
            {hasContact && (
              <div style={{ display: "flex", gap: 10, paddingTop: 16 }}>
                {member.whatsapp && (
                  <a className="team-action" style={button} href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    aria-label={`WhatsApp — ${member.name}`} tabIndex={ariaHidden ? -1 : undefined}
                    onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                    <MessageCircle size={17} /> WhatsApp
                  </a>
                )}
                {member.email && (
                  <a className="team-action" style={button} href={`mailto:${member.email}`}
                    aria-label={`Email — ${member.name}`} tabIndex={ariaHidden ? -1 : undefined}
                    onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                    <Mail size={17} /> Email
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// Percent of the track travelled per pixel of wheel/drag movement. 50% is one
// full roster, so a ~1400px gesture turns the wheel exactly once.
const WHEEL_PERCENT_PER_PX = 50 / 1400;
// Movement below this is treated as a tap, so cards stay clickable.
const DRAG_THRESHOLD_PX = 6;

export default function TeamSection() {
  const { t } = useLang();
  const team = t.about.team;
  const [lead, ...rest] = team;

  const gridRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const leadCardRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // The loop distance needs no JS — the stylesheet makes -50% exact. All that
  // is left is publishing the lead card's height so the wheel can end level
  // with it on desktop; the stylesheet decides whether to use it, since
  // branching on matchMedia here raced the resize and left a stale height.
  useEffect(() => {
    const leadCard = leadCardRef.current;
    if (!leadCard) return;

    const sync = () => {
      const leadH = leadCard.offsetHeight;
      if (leadH > 0) wheelRef.current?.style.setProperty("--lead-h", `${leadH}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(leadCard);
    window.addEventListener("resize", sync);
    return () => { ro.disconnect(); window.removeEventListener("resize", sync); };
  }, [t]);

  // The wheel is driven only by the pointer that is actually over it, never by
  // page scroll — otherwise the cards slide past while you are just navigating
  // down the page and never settle long enough to read.
  //
  // Position is a percentage of the track. The track is exactly two copies of
  // the roster, so wrapping at 50% lands on the duplicate with no measurement.
  useEffect(() => {
    const wheelEl = wheelRef.current;
    const track = trackRef.current;
    if (!wheelEl || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let offset = 0;
    const wrap = (v: number) => ((v % 50) + 50) % 50;
    const apply = () => { track.style.transform = `translate3d(0, -${offset}%, 0)`; };
    apply();

    // Wheel/trackpad: turn the roster and hold the page still, but only while
    // the cursor is over this section. Anywhere else the page scrolls normally.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      offset = wrap(offset + e.deltaY * WHEEL_PERCENT_PER_PX);
      apply();
    };

    // Phones have no hover, so there the roster is browsed by dragging it.
    let startY = 0, lastY = 0, tracking = false, dragging = false;
    const onPointerDown = (e: PointerEvent) => {
      tracking = true; dragging = false; startY = lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!tracking) return;
      // Stay out of the way until it is clearly a drag, so taps still open cards.
      if (!dragging && Math.abs(e.clientY - startY) < DRAG_THRESHOLD_PX) return;
      // Capture keeps the drag alive if the finger leaves the card, but throws
      // for a pointer the element never owned — losing capture is survivable.
      if (!dragging) {
        dragging = true;
        try { wheelEl.setPointerCapture(e.pointerId); } catch { /* drag still works */ }
      }
      offset = wrap(offset + (lastY - e.clientY) * WHEEL_PERCENT_PER_PX);
      lastY = e.clientY;
      apply();
    };
    const endDrag = (e: PointerEvent) => {
      tracking = false;
      if (dragging && wheelEl.hasPointerCapture(e.pointerId)) {
        try { wheelEl.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      }
      dragging = false;
    };

    wheelEl.addEventListener("wheel", onWheel, { passive: false });
    wheelEl.addEventListener("pointerdown", onPointerDown);
    wheelEl.addEventListener("pointermove", onPointerMove);
    wheelEl.addEventListener("pointerup", endDrag);
    wheelEl.addEventListener("pointercancel", endDrag);
    return () => {
      wheelEl.removeEventListener("wheel", onWheel);
      wheelEl.removeEventListener("pointerdown", onPointerDown);
      wheelEl.removeEventListener("pointermove", onPointerMove);
      wheelEl.removeEventListener("pointerup", endDrag);
      wheelEl.removeEventListener("pointercancel", endDrag);
    };
  }, []);

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
                <div className="lead-card" ref={leadCardRef} style={{ padding: 2 }}>
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

          {/* ---- Circular roster wheel ---- */}
          <div className="team-member">
            <div className="team-wheel" ref={wheelRef}>
              {/* Two copies so the wheel can turn without a visible seam; the
                  second is decorative, hence aria-hidden. */}
              <div className="team-wheel-track" ref={trackRef}>
                {[0, 1].map(copy => (
                  <div className="team-wheel-copy" key={copy} aria-hidden={copy === 1 || undefined}>
                    {rest.map(member => (
                      <MemberCard
                        key={`${copy}-${member.name}`}
                        member={member}
                        ariaHidden={copy === 1}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
