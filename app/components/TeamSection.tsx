"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ArrowRight, Mail, MessageCircle, X, Check } from "lucide-react";
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
function Portrait({ photo, name, rounded, focus }: { photo?: string; name: string; rounded: number; focus?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgb(var(--bg-alt))", borderRadius: rounded }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "rgba(var(--accent),0.55)" }}>
        {initials(name)}
      </span>
      {photo && (
        <Image
          className="team-member-photo"
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 420px"
          style={{ objectFit: "cover", objectPosition: focus, borderRadius: rounded, opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
    </div>
  );
}

/** Longer, structured copy that does not fit a roster card — e.g. a
 *  services pitch with a headline and a list of reasons. */
type MemberProfile = { headline?: string; listTitle?: string; points?: { title: string; text: string }[] };
type TeamMember = { name: string; role: string; photo?: string; bio: string; whatsapp?: string; email?: string; profile?: MemberProfile };

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
              <Portrait photo={member.photo} name={member.name} rounded={16} focus={member.photo ? PHOTO_FOCUS[member.photo] ?? DEFAULT_FOCUS : undefined} />
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

// Where the face sits in each photo, for the 4:5 crop. Most portraits are
// framed from the chest up and read best anchored near the top; these are not.
const PHOTO_FOCUS: Record<string, string> = {
  "/images/team/ulises.jpeg": "50% 55%",
  "/images/team/veronica.jpg": "50% 62%",
  "/images/team/leticia.jpeg": "50% 30%",
};
const DEFAULT_FOCUS = "50% 22%";

/** One portrait in the roster grid. The whole tile opens the profile; the
 *  WhatsApp shortcut sits beside the button, not inside it, so it stays a
 *  real link. */
function MemberTile({ member, index }: { member: TeamMember; index: number }) {
  const { t } = useLang();
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <article className="team-tile" data-reveal="media" style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}>
      <button type="button" className="team-tile-open" onClick={() => setProfileOpen(true)}
        aria-label={`${t.about.teamProfileCta}: ${member.name}`}>
        <span className="team-tile-photo">
          <Portrait photo={member.photo} name={member.name} rounded={0} focus={member.photo ? PHOTO_FOCUS[member.photo] ?? DEFAULT_FOCUS : undefined} />
        </span>
        <span className="team-tile-shade" aria-hidden />
        <span className="team-tile-text">
          <span className="team-tile-name">{member.name}</span>
          <span className="team-tile-role">{member.role}</span>
          <span className="team-tile-more" aria-hidden>{t.about.teamProfileCta} <ArrowRight size={13} /></span>
        </span>
      </button>
      {member.whatsapp && (
        <a className="team-tile-wa" href={`https://wa.me/${member.whatsapp}`} target="_blank" rel="noopener noreferrer"
          aria-label={`WhatsApp — ${member.name}`}>
          <MessageCircle size={17} />
        </a>
      )}
      {profileOpen && <ProfileDialog member={member} onClose={closeProfile} closeLabel={t.about.teamProfileClose} />}
    </article>
  );
}

export default function TeamSection() {
  const { t } = useLang();
  const team = t.about.team;
  const [lead, ...rest] = team;

  const leadRef = useRef<HTMLDivElement>(null);

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
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 18 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              {t.about.teamTitle}
            </span>
            <div className="sage-line" />
          </div>
          <h2 data-reveal="line" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.2vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "rgb(var(--ink))" }}>
            <span className="reveal-text">{t.about.teamHeading}</span>
          </h2>
          <p className="team-hint" style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(var(--ink),0.45)", marginTop: 12 }}>
            {t.about.teamHint}
          </p>
        </div>

        <div className="team-layout" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
          {/* ---- Lead card ---- */}
          <div className="team-lead-col" data-reveal>
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
                      <Portrait photo={lead.photo} name={lead.name} rounded={24} focus="50% 20%" />
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

          {/* ---- Everyone else, all visible at once ---- */}
          <div className="team-grid">
            {rest.map((member, i) => (
              <MemberTile key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
