"use client";
import { useState, useEffect } from "react";
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, Phone, Mail, Bed, Bath, Car, Square, ExternalLink, Check, MessageSquare, Quote } from "lucide-react";
import Link from "next/link";
import type { EBPropertyDetail } from "../lib/easybroker";
import { primaryOperation } from "../lib/easybroker";
import { useLang } from "../lib/LangContext";
import { useSession } from "../lib/useSession";
import { sendInquiry, whatsappLink } from "../lib/sendInquiry";
import StarRating from "./StarRating";
import Avatar from "./Avatar";
import FavoriteButton from "./FavoriteButton";

type PropertyReview = { id: number; name: string; rating: number; comment_en: string; comment_es: string; language: "en" | "es" };

const WHATSAPP_NUMBER = "526611256107";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}`;
const EMAIL_HREF = "mailto:jorgeelcasarosarito@gmail.com";

export default function EasyBrokerDetail({ property }: { property: EBPropertyDetail }) {
  const { t, locale } = useLang();
  const { user } = useSession();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", comment: "" });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewFailed, setReviewFailed] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?type=property&property_id=${encodeURIComponent(property.public_id)}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews ?? []))
      .catch(() => {});
  }, [property.public_id]);

  const images = property.property_images.length > 0
    ? property.property_images
    : property.title_image_full
      ? [{ title: null, url: property.title_image_full }]
      : [];

  const op = primaryOperation(property.operations);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => (i !== null ? (i - 1 + images.length) % images.length : null));
  const nextImg = () => setLightbox(i => (i !== null ? (i + 1) % images.length : null));

  const waMessage = `Hola, soy ${form.name || "..."}. Me interesa: ${property.title} (${property.public_id}).\n${form.message}`.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(false);
    const ok = await sendInquiry({
      subject: `Consulta por "${property.title}" — El Casa Rosarito`,
      from_name: "El Casa Rosarito Website",
      replyto: form.email,
      name: form.name,
      email: form.email,
      phone: form.phone,
      property: `${property.title} (${property.public_id})`,
      message: form.message,
    });
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "property", name: form.name, email: form.email, phone: form.phone, propertyId: property.public_id, propertyTitle: property.title, message: form.message }),
    }).catch(() => {});
    if (ok) setSent(true); else setFailed(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSending(true);
    setReviewFailed(false);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "property",
          propertyId: property.public_id,
          propertyTitle: property.title,
          name: user?.name ?? reviewForm.name,
          email: user?.email ?? reviewForm.email,
          rating: reviewRating,
          comment: reviewForm.comment,
          language: locale,
        }),
      });
      if (res.ok) setReviewSent(true); else setReviewFailed(true);
    } catch {
      setReviewFailed(true);
    }
    setReviewSending(false);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(var(--surface),0.7)", border: "1px solid rgba(var(--accent),0.15)",
    outline: "none", padding: "12px 16px", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", color: "rgb(var(--ink))", boxSizing: "border-box",
  };

  const specs = [
    property.bedrooms ? { icon: Bed, val: String(property.bedrooms), label: t.property.beds } : null,
    property.bathrooms ? { icon: Bath, val: String(property.bathrooms), label: t.property.baths } : null,
    property.parking_spaces ? { icon: Car, val: String(property.parking_spaces), label: t.property.parking } : null,
    property.construction_size ? { icon: Square, val: `${property.construction_size}`, label: t.property.builtArea } : property.lot_size ? { icon: Square, val: `${property.lot_size}`, label: t.property.lotArea } : null,
  ].filter((s): s is { icon: typeof Bed; val: string; label: string } => s !== null);

  const { latitude: lat, longitude: lng } = property.location_detail;
  // Google's iframe embed requires an API key we don't have and blocks the
  // key-less "output=embed" trick with X-Frame-Options. OpenStreetMap's
  // embed works with no key and no framing restrictions.
  const mapUrl = lat && lng
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.008},${lng + 0.01},${lat + 0.008}&marker=${lat},${lng}`
    : null;
  const mapLinkUrl = lat && lng ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}` : null;

  return (
    <div style={{ background: "rgb(var(--bg))", minHeight: "100vh", color: "rgb(var(--ink))", fontFamily: "'Jost', sans-serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(var(--bg),0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(var(--accent),0.1)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/propiedades" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(var(--ink),0.5)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em", transition: "color 0.3s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgb(var(--accent))"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(var(--ink),0.5)"}>
          <ArrowLeft size={14} /> {t.property.backToListings}
        </Link>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: "rgb(var(--ink))" }}>
          El Casa Rosarito · <span style={{ color: "rgb(var(--accent))" }}>Real Estate</span>
        </span>
        <div style={{ width: 60 }} />
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", height: "70vh", minHeight: 400, overflow: "hidden", cursor: images.length ? "pointer" : "default", background: "rgb(var(--bg-alt))" }}
        onClick={() => images.length && openLightbox(0)}>
        {images[0] && (
          <img src={images[0].url} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.7) 100%)" }} />
        <div style={{ position: "absolute", top: 24, left: 24, background: "rgb(var(--accent))", color: "#FAF6EE", padding: "6px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600 }}>
          {op ? (op.type === "rental" ? t.property.forRent : t.property.forSale) : t.property.consult}
        </div>
        <FavoriteButton propertyId={property.public_id} propertyTitle={property.title} propertyImage={images[0]?.url} size={18} style={{ position: "absolute", top: 20, right: 20 }} />
        {images.length > 0 && (
          <div style={{ position: "absolute", bottom: 24, right: 24, background: "rgba(10,10,10,0.8)", border: "1px solid rgba(var(--accent),0.3)", padding: "8px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgb(var(--accent))", letterSpacing: "0.15em" }}>
            {t.property.viewAllPhotos.replace("{n}", String(images.length))}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 24, left: 24 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAF6EE", lineHeight: 1, marginBottom: 8 }}>
            {property.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} color="rgb(var(--accent-light))" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(250,246,238,0.8)", letterSpacing: "0.08em" }}>
              {property.location}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ background: "rgb(var(--bg-alt))", padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto", borderBottom: "1px solid rgba(var(--accent),0.08)" }}>
          {images.slice(1).map((img, i) => (
            <div key={i} onClick={() => openLightbox(i + 1)} style={{ flexShrink: 0, width: 90, height: 64, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(var(--accent),0.1)", transition: "border-color 0.3s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.5)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.1)"}>
              <img src={img.url} alt={img.title ?? property.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"} />
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "1fr", gap: 48 }} className="listing-layout">
        {/* Left: details */}
        <div>
          {/* Price + specs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(var(--accent),0.1)" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 8 }}>
                {op?.type === "rental" ? t.property.monthlyRent : t.property.salePrice} · {op?.currency ?? "USD"}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "rgb(var(--ink))", fontWeight: 300, lineHeight: 1 }}>
                {op?.formatted_amount ?? t.property.priceOnRequest}
              </div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(var(--ink),0.4)", marginTop: 6 }}>
                {t.property.typeLabels[property.property_type] ?? property.property_type}
              </div>
            </div>
            {specs.length > 0 && (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {specs.map(({ icon: Icon, val, label }, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <Icon size={18} color="rgb(var(--accent))" style={{ marginBottom: 6 }} />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "rgb(var(--ink))", fontWeight: 300, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(var(--ink),0.35)", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "rgb(var(--ink))", marginBottom: 16 }}>
              {t.property.aboutThisProperty}
            </h2>
            {property.description.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} style={{ color: "rgba(var(--ink),0.55)", lineHeight: 1.85, fontSize: "0.92rem", marginBottom: 12 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Location */}
          {mapUrl && (
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "rgb(var(--ink))", marginBottom: 16 }}>
                {t.labels.location}
              </h3>
              <div style={{ border: "1px solid rgba(var(--accent),0.12)", overflow: "hidden", height: 280, marginBottom: 8 }}>
                <iframe
                  src={mapUrl}
                  width="100%" height="100%"
                  style={{ border: 0, filter: "saturate(0.85) contrast(0.95)" }}
                  loading="lazy" title={t.labels.location}
                />
              </div>
              {mapLinkUrl && (
                <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(var(--ink),0.4)", letterSpacing: "0.06em", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgb(var(--accent))"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(var(--ink),0.4)"}>
                  {t.property.viewLargerMap} →
                </a>
              )}
            </div>
          )}

          {/* Reviews */}
          <div style={{ marginBottom: 40, paddingTop: 32, borderTop: "1px solid rgba(var(--accent),0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "rgb(var(--ink))" }}>
                  {t.property.reviewsTitle}
                </h3>
                {reviews.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StarRating value={Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)} size={14} />
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(var(--ink),0.55)" }}>
                      {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length})
                    </span>
                  </div>
                )}
              </div>
              {!showReviewForm && !reviewSent && (
                <button onClick={() => setShowReviewForm(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  <MessageSquare size={13} /> {t.property.leaveReview}
                </button>
              )}
            </div>

            {reviews.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: 18, border: "1px solid rgba(var(--accent),0.1)", background: "rgba(var(--bg-alt),0.5)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={r.name} size={30} />
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgb(var(--ink))" }}>{r.name}</span>
                      </div>
                      <StarRating value={r.rating} size={13} />
                    </div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.65)", lineHeight: 1.6 }}>
                      <Quote size={13} color="rgba(var(--accent),0.4)" style={{ marginRight: 4, verticalAlign: "-1px" }} />
                      {locale === "es" ? r.comment_es : r.comment_en}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {reviews.length === 0 && !showReviewForm && !reviewSent && (
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.4)", lineHeight: 1.6 }}>
                {t.property.reviewsEmpty}
              </p>
            )}

            {reviewSent && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Check size={20} color="rgb(var(--accent))" />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgb(var(--ink))" }}>{t.property.reviewSent}</span>
              </div>
            )}

            {showReviewForm && !reviewSent && (
              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
                {reviewFailed && (
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgb(var(--error))" }}>{t.testimonials.formError}</p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
                    {t.property.yourRating}
                  </span>
                  <StarRating value={reviewRating} onChange={setReviewRating} size={20} />
                </div>
                {user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px" }}>
                    <Avatar name={user.name} size={26} />
                    <div>
                      <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgb(var(--ink))" }}>{user.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "rgba(var(--ink),0.45)" }}>{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <input style={inp} placeholder={t.testimonials.formName} value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} required />
                    <input style={inp} type="email" placeholder={t.testimonials.formEmail} value={reviewForm.email} onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })} required />
                  </>
                )}
                <textarea style={{ ...inp, resize: "none" }} rows={3} placeholder={t.property.yourComment} value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" disabled={reviewSending}
                    style={{ flex: 1, padding: "12px", background: reviewSending ? "rgba(var(--accent),0.6)" : "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: reviewSending ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {reviewSending ? t.testimonials.formSending : t.property.submitReview}
                  </button>
                  <button type="button" onClick={() => setShowReviewForm(false)}
                    style={{ padding: "12px 18px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {t.testimonials.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* EasyBroker source link — absent on the agency's own listings,
              which have no external page to point at. */}
          {property.public_url && (
            <a href={property.public_url} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(var(--ink),0.4)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgb(var(--accent))"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(var(--ink),0.4)"}>
              {t.property.viewOnEasyBroker} <ExternalLink size={13} />
            </a>
          )}
        </div>

        {/* Right: contact card */}
        <div>
          <div style={{ position: "sticky", top: 80, border: "1px solid rgba(var(--accent),0.15)", background: "rgb(var(--bg-alt))", padding: 32 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgb(var(--accent))", marginBottom: 6 }}>
              {t.property.listedBy}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "rgb(var(--ink))", fontWeight: 300, marginBottom: 4 }}>
              El Casa Rosarito
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.35)", letterSpacing: "0.15em", marginBottom: 24 }}>
              {t.about.role}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.3s", justifyContent: "center" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"}>
                <Phone size={14} /> WhatsApp
              </a>
              <a href={EMAIL_HREF}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s", justifyContent: "center" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(var(--accent),0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(var(--accent))"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(var(--accent),0.3)"; }}>
                <Mail size={14} /> Email
              </a>
            </div>

            <div style={{ borderTop: "1px solid rgba(var(--accent),0.1)", paddingTop: 24 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(var(--ink),0.4)", marginBottom: 16 }}>
                {t.property.sendMessage}
              </div>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Check size={32} color="rgb(var(--accent))" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgb(var(--ink))", marginBottom: 16 }}>
                    {t.property.messageSent}
                  </div>
                  <a href={whatsappLink(WHATSAPP_NUMBER, waMessage)} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    <Phone size={13} /> {t.contact.alsoWhatsApp}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {failed && (
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgb(var(--error))", lineHeight: 1.5 }}>{t.contact.error}</p>
                  )}
                  <input style={inp} placeholder={t.property.namePlaceholder} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.15)"} />
                  <input style={inp} type="email" placeholder={t.property.emailPlaceholder} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.15)"} />
                  <input style={inp} placeholder={t.property.phonePlaceholder} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.15)"} />
                  <textarea style={{ ...inp, resize: "none" }} rows={3}
                    placeholder={t.property.interestedIn.replace("{title}", property.title)}
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(var(--accent),0.15)"} />
                  <button type="submit" style={{ padding: "14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent-light))"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgb(var(--accent))"}>
                    {t.property.sendInquiry}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={closeLightbox}>
          <button onClick={e => { e.stopPropagation(); closeLightbox(); }}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", padding: 8, display: "flex" }}>
            <X size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); prevImg(); }}
            style={{ position: "absolute", left: 20, background: "rgba(var(--accent),0.1)", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", padding: "12px", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <img src={images[lightbox].url} alt={images[lightbox].title ?? property.title}
            style={{ maxHeight: "88vh", maxWidth: "90vw", objectFit: "contain" }}
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); nextImg(); }}
            style={{ position: "absolute", right: 20, background: "rgba(var(--accent),0.1)", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", padding: "12px", display: "flex" }}>
            <ChevronRight size={24} />
          </button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(250,246,238,0.5)" }}>
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Responsive layout style */}
      <style>{`
        @media (min-width: 1024px) {
          .listing-layout {
            grid-template-columns: 1.6fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
