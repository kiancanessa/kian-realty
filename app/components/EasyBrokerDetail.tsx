"use client";
import { useState } from "react";
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, Phone, Mail, Bed, Bath, Car, Square, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import type { EBPropertyDetail } from "../lib/easybroker";
import { primaryOperation } from "../lib/easybroker";
import { useLang } from "../lib/LangContext";

const WHATSAPP_HREF = "https://wa.me/526611256107";
const EMAIL_HREF = "mailto:jorgeelcasarosarito@gmail.com";

export default function EasyBrokerDetail({ property }: { property: EBPropertyDetail }) {
  const { t } = useLang();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(107,138,66,0.15)",
    outline: "none", padding: "12px 16px", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", color: "#23221E", boxSizing: "border-box",
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
    <div style={{ background: "#FAF6EE", minHeight: "100vh", color: "#23221E", fontFamily: "'Jost', sans-serif" }}>
      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,246,238,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(107,138,66,0.1)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/propiedades" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(35,34,30,0.5)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em", transition: "color 0.3s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#6B8A42"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(35,34,30,0.5)"}>
          <ArrowLeft size={14} /> {t.property.backToListings}
        </Link>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: "#23221E" }}>
          El Casa Rosarito · <span style={{ color: "#6B8A42" }}>Real Estate</span>
        </span>
        <div style={{ width: 60 }} />
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", height: "70vh", minHeight: 400, overflow: "hidden", cursor: images.length ? "pointer" : "default", background: "#F0E7D8" }}
        onClick={() => images.length && openLightbox(0)}>
        {images[0] && (
          <img src={images[0].url} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.7) 100%)" }} />
        <div style={{ position: "absolute", top: 24, left: 24, background: "#6B8A42", color: "#FAF6EE", padding: "6px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600 }}>
          {op ? (op.type === "rental" ? t.property.forRent : t.property.forSale) : t.property.consult}
        </div>
        {images.length > 0 && (
          <div style={{ position: "absolute", bottom: 24, right: 24, background: "rgba(10,10,10,0.8)", border: "1px solid rgba(107,138,66,0.3)", padding: "8px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#6B8A42", letterSpacing: "0.15em" }}>
            {t.property.viewAllPhotos.replace("{n}", String(images.length))}
          </div>
        )}
        <div style={{ position: "absolute", bottom: 24, left: 24 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAF6EE", lineHeight: 1, marginBottom: 8 }}>
            {property.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} color="#85A857" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(250,246,238,0.8)", letterSpacing: "0.08em" }}>
              {property.location}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ background: "#F0E7D8", padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto", borderBottom: "1px solid rgba(107,138,66,0.08)" }}>
          {images.slice(1).map((img, i) => (
            <div key={i} onClick={() => openLightbox(i + 1)} style={{ flexShrink: 0, width: 90, height: 64, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(107,138,66,0.1)", transition: "border-color 0.3s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.5)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.1)"}>
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
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(107,138,66,0.1)" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B8A42", marginBottom: 8 }}>
                {op?.type === "rental" ? t.property.monthlyRent : t.property.salePrice} · {op?.currency ?? "USD"}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#23221E", fontWeight: 300, lineHeight: 1 }}>
                {op?.formatted_amount ?? t.property.priceOnRequest}
              </div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(35,34,30,0.4)", marginTop: 6 }}>
                {t.property.typeLabels[property.property_type] ?? property.property_type}
              </div>
            </div>
            {specs.length > 0 && (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {specs.map(({ icon: Icon, val, label }, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <Icon size={18} color="#6B8A42" style={{ marginBottom: 6 }} />
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#23221E", fontWeight: 300, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(35,34,30,0.35)", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "#23221E", marginBottom: 16 }}>
              {t.property.aboutThisProperty}
            </h2>
            {property.description.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} style={{ color: "rgba(35,34,30,0.55)", lineHeight: 1.85, fontSize: "0.92rem", marginBottom: 12 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Location */}
          {mapUrl && (
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "#23221E", marginBottom: 16 }}>
                {t.labels.location}
              </h3>
              <div style={{ border: "1px solid rgba(107,138,66,0.12)", overflow: "hidden", height: 280, marginBottom: 8 }}>
                <iframe
                  src={mapUrl}
                  width="100%" height="100%"
                  style={{ border: 0, filter: "saturate(0.85) contrast(0.95)" }}
                  loading="lazy" title={t.labels.location}
                />
              </div>
              {mapLinkUrl && (
                <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(35,34,30,0.4)", letterSpacing: "0.06em", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#6B8A42"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(35,34,30,0.4)"}>
                  {t.property.viewLargerMap} →
                </a>
              )}
            </div>
          )}

          {/* EasyBroker source link */}
          <a href={property.public_url} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(35,34,30,0.4)", fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#6B8A42"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(35,34,30,0.4)"}>
            {t.property.viewOnEasyBroker} <ExternalLink size={13} />
          </a>
        </div>

        {/* Right: contact card */}
        <div>
          <div style={{ position: "sticky", top: 80, border: "1px solid rgba(107,138,66,0.15)", background: "#F0E7D8", padding: 32 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B8A42", marginBottom: 6 }}>
              {t.property.listedBy}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#23221E", fontWeight: 300, marginBottom: 4 }}>
              El Casa Rosarito
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(35,34,30,0.35)", letterSpacing: "0.15em", marginBottom: 24 }}>
              {t.about.role}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "#6B8A42", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.3s", justifyContent: "center" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#85A857"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#6B8A42"}>
                <Phone size={14} /> WhatsApp
              </a>
              <a href={EMAIL_HREF}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", border: "1px solid rgba(107,138,66,0.3)", color: "#6B8A42", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s", justifyContent: "center" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(107,138,66,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#6B8A42"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,138,66,0.3)"; }}>
                <Mail size={14} /> Email
              </a>
            </div>

            <div style={{ borderTop: "1px solid rgba(107,138,66,0.1)", paddingTop: 24 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(35,34,30,0.4)", marginBottom: 16 }}>
                {t.property.sendMessage}
              </div>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Check size={32} color="#6B8A42" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#23221E" }}>
                    {t.property.messageSent}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input style={inp} placeholder={t.property.namePlaceholder} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.15)"} />
                  <input style={inp} type="email" placeholder={t.property.emailPlaceholder} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.15)"} />
                  <input style={inp} placeholder={t.property.phonePlaceholder} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.15)"} />
                  <textarea style={{ ...inp, resize: "none" }} rows={3}
                    placeholder={t.property.interestedIn.replace("{title}", property.title)}
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.15)"} />
                  <button type="submit" style={{ padding: "14px", background: "#6B8A42", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#85A857"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#6B8A42"}>
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
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(107,138,66,0.3)", color: "#6B8A42", cursor: "pointer", padding: 8, display: "flex" }}>
            <X size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); prevImg(); }}
            style={{ position: "absolute", left: 20, background: "rgba(107,138,66,0.1)", border: "1px solid rgba(107,138,66,0.3)", color: "#6B8A42", cursor: "pointer", padding: "12px", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <img src={images[lightbox].url} alt={images[lightbox].title ?? property.title}
            style={{ maxHeight: "88vh", maxWidth: "90vw", objectFit: "contain" }}
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); nextImg(); }}
            style={{ position: "absolute", right: 20, background: "rgba(107,138,66,0.1)", border: "1px solid rgba(107,138,66,0.3)", color: "#6B8A42", cursor: "pointer", padding: "12px", display: "flex" }}>
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
