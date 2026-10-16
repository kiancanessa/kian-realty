"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { useSession } from "../lib/useSession";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import GoogleG from "./GoogleG";
import { Quote, CheckCircle, ArrowUpRight } from "lucide-react";
import { GOOGLE_PROFILE_URL, GOOGLE_WRITE_REVIEW_URL } from "../lib/googleLinks";

type Review = {
  id: number; name: string; rating: number; comment_en: string; comment_es: string; language: "en" | "es";
  source: "site" | "google"; author_url: string | null; photo_url: string | null;
};
type GoogleSummary = { rating: number; total: number };

/** Google's own profile picture when it sent one; the initials otherwise (and
 *  if the picture fails to load). */
function ReviewerAvatar({ name, photoUrl, size }: { name: string; photoUrl: string | null; size: number }) {
  const [broken, setBroken] = useState(false);
  if (!photoUrl || broken) return <Avatar name={name} size={size} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={photoUrl} alt="" width={size} height={size} referrerPolicy="no-referrer" onError={() => setBroken(true)}
    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
}

const googleLinkStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", transition: "all 0.3s",
  fontFamily: "'Jost', sans-serif", color: "rgb(var(--ink))",
};

export default function Testimonials() {
  const { t, locale } = useLang();
  const { user } = useSession();
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [google, setGoogle] = useState<GoogleSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", comment: "" });
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/reviews?type=testimonial")
      .then(res => res.json())
      .then(data => { setReviews(data.reviews ?? []); setGoogle(data.google ?? null); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 100));
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgb(var(--surface))", border: "1px solid rgba(var(--accent),0.15)",
    outline: "none", padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.88rem",
    color: "rgb(var(--ink))", boxSizing: "border-box",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "testimonial", name: user?.name ?? form.name, email: user?.email ?? form.email, rating, comment: form.comment, language: locale }),
      });
      if (res.ok) setSent(true); else setFailed(true);
    } catch {
      setFailed(true);
    }
    setSending(false);
  };

  return (
    <section id="testimonials" ref={sectionRef} style={{ padding: "112px 24px", background: "rgb(var(--bg-alt))" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              {t.testimonials.title}
            </span>
            <div className="sage-line" />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.testimonials.title}
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.38)", maxWidth: 520, margin: "0 auto", fontSize: "0.88rem", lineHeight: 1.7 }}>
            {t.testimonials.subtitle}
          </p>

          {/* What Google shows for us, and a way to read the rest there. */}
          {google && (
            <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.testimonials.seeOnGoogle}: ${google.rating.toFixed(1)}`}
              style={{ ...googleLinkStyle, marginTop: 28, padding: "10px 20px", border: "1px solid rgba(var(--accent),0.2)", background: "rgb(var(--surface))", flexWrap: "wrap", justifyContent: "center" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgb(var(--accent))"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.2)"}>
              <GoogleG size={18} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", lineHeight: 1 }}>{google.rating.toFixed(1)}</span>
              <StarRating value={Math.round(google.rating)} size={14} />
              <span style={{ fontSize: "0.8rem", color: "rgba(var(--ink),0.55)" }}>
                {google.total === 1 ? t.testimonials.googleReviewsOne : t.testimonials.googleReviewsMany.replace("{n}", String(google.total))}
              </span>
              <ArrowUpRight size={14} color="rgb(var(--accent))" aria-hidden />
            </a>
          )}
        </div>

        {/* Cards */}
        {reviews.length > 0 ? (
          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 48 }}>
            {reviews.map(r => (
              <div key={r.id} className="reveal" style={{ position: "relative", padding: 32, border: "1px solid rgba(var(--accent),0.1)", background: "rgb(var(--surface))" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                  <Quote size={22} color="rgba(var(--accent),0.35)" />
                  {r.source === "google" && (
                    <a href={r.author_url || GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer"
                      style={{ ...googleLinkStyle, gap: 6, fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
                      <GoogleG size={13} /> {t.testimonials.googleBadge}
                    </a>
                  )}
                </div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.65)", lineHeight: 1.7, marginBottom: 20 }}>
                  {locale === "es" ? r.comment_es : r.comment_en}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <ReviewerAvatar name={r.name} photoUrl={r.photo_url} size={34} />
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgb(var(--ink))" }}>{r.name}</span>
                  </div>
                  <StarRating value={r.rating} size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="reveal" style={{ textAlign: "center", padding: "40px 24px", marginBottom: 48, border: "1px dashed rgba(var(--accent),0.2)" }}>
            <Quote size={28} color="rgba(var(--accent),0.35)" style={{ marginBottom: 14 }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", color: "rgba(var(--ink),0.45)", maxWidth: 420, margin: "0 auto" }}>
              {t.testimonials.empty}
            </p>
          </div>
        )}

        {/* Write a review */}
        <div className="reveal" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: showForm || sent ? 28 : 0 }}>
          {!showForm && !sent && (
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setShowForm(true)}
                style={{ padding: "16px 40px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"}>
                {t.testimonials.writeReview}
              </button>
            </div>
          )}

          <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer"
            style={{ ...googleLinkStyle, padding: "15px 32px", border: "1px solid rgba(var(--accent),0.35)", background: "transparent", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgb(var(--accent))"; el.style.background = "rgb(var(--surface))"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(var(--accent),0.35)"; el.style.background = "transparent"; }}>
            <GoogleG size={16} /> {t.testimonials.writeOnGoogle} <ArrowUpRight size={14} color="rgb(var(--accent))" aria-hidden />
          </a>
          </div>

          {sent && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircle size={40} color="rgb(var(--accent))" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "rgb(var(--ink))" }}>{t.testimonials.formSuccess}</p>
            </div>
          )}

          {showForm && !sent && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, padding: 32, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--surface))" }}>
              {failed && (
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--error))" }}>{t.testimonials.formError}</p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
                  {t.property.yourRating}
                </span>
                <StarRating value={rating} onChange={setRating} size={22} />
              </div>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px" }}>
                  <Avatar name={user.name} size={30} />
                  <div>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))" }}>{user.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.45)" }}>{user.email}</div>
                  </div>
                </div>
              ) : (
                <>
                  <input style={inputStyle} placeholder={t.testimonials.formName} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  <input style={inputStyle} type="email" placeholder={t.testimonials.formEmail} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </>
              )}
              <textarea style={{ ...inputStyle, resize: "none" }} rows={4} placeholder={t.testimonials.formComment} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} required />
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.4)" }}>{t.testimonials.formNote}</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" disabled={sending}
                  style={{ flex: 1, padding: "14px", background: sending ? "rgba(var(--accent),0.6)" : "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: sending ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  {sending ? t.testimonials.formSending : t.testimonials.formSubmit}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "14px 20px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t.testimonials.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
