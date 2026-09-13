"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Mail, MessageCircle, ChevronDown, X, Check } from "lucide-react";
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

/** Longer, structured copy that does not fit a roster card — e.g. a
 *  services pitch with a headline and a list of reasons. */
type MemberProfile = { headline?: string; listTitle?: string; points?: { title: string; text: string }[] };
type TeamMember = { name: string; role: string; photo?: string; bio: string; whatsapp?: string; email?: string; profile?: MemberProfile };

// Past this length a bio no longer reads as a card blurb: the card shows the
// opening lines and the full text moves to the profile dialog. Decided by
// length rather than by measuring overflow, because the bio sits inside a
// collapsed reveal where it has no height to measure.
const BIO_EXCERPT_CHARS = 150;

const actionButton: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  // A basis wide enough for the label: two buttons share a row on a desktop
  // card and stack on a phone, instead of squeezing their text out of the pill.
  flex: "1 1 124px", height: 46, borderRadius: 999,
  border: "1px solid rgba(var(--accent),0.28)", color: "rgb(var(--accent))", background: "transparent",
  textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem",
  fontWeight: 500, letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: "pointer",
};
const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.background = "rgb(var(--accent))";
  e.currentTarget.style.color = "#FAF6EE";
};
const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.color = "rgb(var(--accent))";
};

function ContactLinks({ member, tabbable }: { member: TeamMember; tabbable: boolean }) {
  return (
    <>
      {member.whatsapp && (
        <a className="team-action" style={actionButton} href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer"
          aria-label={`WhatsApp — ${member.name}`} tabIndex={tabbable ? undefined : -1}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <MessageCircle size={17} /> WhatsApp
        </a>
      )}
      {member.email && (
        <a className="team-action" style={actionButton} href={`mailto:${member.email}`}
          aria-label={`Email — ${member.name}`} tabIndex={tabbable ? undefined : -1}
          onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
          <Mail size={17} /> Email
        </a>
      )}
    </>
  );
}

/** The full profile, in a dialog.
 *
 *  Portaled to <body>: the roster wheel is a transformed, overflow-hidden
 *  track, and a `position: fixed` element inside a transformed ancestor is
 *  positioned — and clipped — relative to that ancestor, not the viewport. */
function ProfileDialog({ member, onClose, closeLabel }: { member: TeamMember; onClose: () => void; closeLabel: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `profile-${member.name.replace(/\W+/g, "-")}`;

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const { profile } = member;

  return createPortal(
    <div
      className="team-profile-backdrop"
      // React bubbles portal events through the component tree, so without
      // this a click in the dialog would also toggle the card that opened it.
      onClick={e => { e.stopPropagation(); onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 230, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(10,10,8,0.72)" }}
    >
      <div
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="team-profile-panel"
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: "min(640px, 100%)", maxHeight: "88dvh", overflowY: "auto", borderRadius: 26, background: "rgb(var(--surface))", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel}
          style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(var(--accent),0.2)", background: "rgb(var(--surface))", color: "rgb(var(--ink))", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={17} />
        </button>

        <div style={{ padding: "28px 28px 30px" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", paddingRight: 40, marginBottom: 22 }}>
            <div style={{ position: "relative", width: 76, height: 92, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
              <Portrait photo={member.photo} name={member.name} rounded={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 id={titleId} style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.45rem, 5vw, 1.8rem)", lineHeight: 1.2, color: "rgb(var(--ink))", marginBottom: 4 }}>
                {member.name}
              </h3>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)" }}>{member.role}</div>
            </div>
          </div>

          {profile?.headline && (
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", color: "rgb(var(--accent))", lineHeight: 1.3, marginBottom: 12 }}>
              {profile.headline}
            </div>
          )}

          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(var(--ink),0.72)" }}>
            {member.bio}
          </p>

          {profile?.points && profile.points.length > 0 && (
            <div style={{ marginTop: 24 }}>
              {profile.listTitle && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)", marginBottom: 14 }}>
                  {profile.listTitle}
                </div>
              )}
              <ul style={{ listStyle: "none", display: "grid", gap: 14 }}>
                {profile.points.map(pt => (
                  <li key={pt.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, marginTop: 1, borderRadius: "50%", background: "rgba(var(--accent),0.14)", color: "rgb(var(--accent))", flexShrink: 0 }}>
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", lineHeight: 1.65, color: "rgba(var(--ink),0.72)" }}>
                      <strong style={{ color: "rgb(var(--ink))", fontWeight: 600 }}>{pt.title}.</strong> {pt.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(member.whatsapp || member.email) && (
            <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
              <ContactLinks member={member} tabbable />
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** One roster card. Rendered twice per roster (once per wheel copy). */
function MemberCard({ member, ariaHidden }: { member: TeamMember; ariaHidden?: boolean }) {
  const { t } = useLang();
  // Hover opens the card on a desktop, but a phone has no hover — without this
  // the bio and the WhatsApp button are simply unreachable there. The wheel's
  // drag handler already ignores movement under its threshold, so a tap that
  // never turns into a drag lands here.
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  const hasContact = !!(member.whatsapp || member.email);
  const hasProfile = !!member.profile || member.bio.length > BIO_EXCERPT_CHARS;

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`team-member-card${open ? " is-open" : ""}`}
      onClick={e => {
        // Let the links and buttons inside do their own job.
        if ((e.target as HTMLElement).closest("a, button")) return;
        setOpen(o => !o);
      }}
      style={{ display: "flex", gap: 22, alignItems: "flex-start", padding: 22, border: "1px solid rgba(var(--accent),0.12)", background: "rgba(var(--surface),0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", flexShrink: 0 }}
    >
      <div style={{ position: "relative", width: 104, height: 124, borderRadius: 18, overflow: "hidden", flexShrink: 0 }}>
        <Portrait photo={member.photo} name={member.name} rounded={18} />
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.5rem", color: "rgb(var(--ink))", lineHeight: 1.25, marginBottom: 6 }}>
          {member.name}
        </h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.48)", lineHeight: 1.5 }}>
            {member.role}
          </span>
          <ChevronDown className="team-caret" size={17} color="rgba(var(--accent),0.65)" style={{ flexShrink: 0 }} />
        </div>

        <div className="team-reveal">
          <div>
            <p className={hasProfile ? "team-bio-excerpt" : undefined}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.92rem", lineHeight: 1.7, color: "rgba(var(--ink),0.6)", marginTop: 14 }}>
              {member.bio}
            </p>
            {(hasContact || hasProfile) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 16 }}>
                <ContactLinks member={member} tabbable={!ariaHidden} />
                {hasProfile && (
                  <button type="button" className="team-action" style={actionButton}
                    tabIndex={ariaHidden ? -1 : undefined}
                    onClick={() => setProfileOpen(true)}
                    onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                    {t.about.teamProfileCta} <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {profileOpen && <ProfileDialog member={member} onClose={closeProfile} closeLabel={t.about.teamProfileClose} />}
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
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <a
                        href="#contact"
                        style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "15px 30px", borderRadius: 999, background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s ease, transform 0.3s ease" }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent-light))"; el.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.transform = "translateY(0)"; }}
                      >
                        {t.about.teamLeadCta} <ArrowRight size={14} />
                      </a>
                      {lead.whatsapp && (
                        <a
                          href={`https://wa.me/${lead.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp — ${lead.name}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 26px", borderRadius: 999, border: "1px solid rgba(var(--accent),0.35)", background: "transparent", color: "rgb(var(--accent))", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.3s ease, color 0.3s ease, transform 0.3s ease" }}
                          onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgb(var(--accent))"; el.style.color = "#FAF6EE"; el.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "rgb(var(--accent))"; el.style.transform = "translateY(0)"; }}
                        >
                          <MessageCircle size={15} /> WhatsApp
                        </a>
                      )}
                    </div>
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
