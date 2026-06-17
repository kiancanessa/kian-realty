"use client";
import { useState } from "react";
import { MapPin, Bed, Bath, Square, Wifi, Car, Wind, WashingMachine, ArrowLeft, X, ChevronLeft, ChevronRight, Phone, Mail, Check } from "lucide-react";
import Link from "next/link";

const IMAGES = [
  { src: "/images/k38-apartment/depa4.jpeg", label: "Ocean View" },
  { src: "/images/k38-apartment/depa1.jpeg", label: "Kitchen" },
  { src: "/images/k38-apartment/depa2.jpeg", label: "Dining Room" },
  { src: "/images/k38-apartment/depa3.jpeg", label: "Living Room" },
  { src: "/images/k38-apartment/depa7.jpeg", label: "Bedroom 1" },
  { src: "/images/k38-apartment/depa10.jpeg", label: "Bedroom 2" },
  { src: "/images/k38-apartment/depa9.jpeg", label: "Bathroom" },
  { src: "/images/k38-apartment/depa11.jpeg", label: "Shower" },
  { src: "/images/k38-apartment/depa5.jpeg", label: "Patio" },
  { src: "/images/k38-apartment/depa6.jpeg", label: "Panoramic View" },
  { src: "/images/k38-apartment/depa8.jpeg", label: "Kitchen Detail" },
  { src: "/images/k38-apartment/cochera.jpg", label: "Private Garage" },
];

const HIGHLIGHTS_EN = [
  "High-speed fiber optic internet",
  "Fully furnished & move-in ready",
  "Private covered garage parking",
  "Ground-floor access",
  "Easy access to public transport",
  "Secure & peaceful location",
];

const HIGHLIGHTS_ES = [
  "Internet de fibra óptica de alta velocidad",
  "Totalmente amueblado y listo para habitar",
  "Cochera privada techada",
  "Acceso en planta baja",
  "Fácil acceso al transporte público",
  "Zona tranquila y segura",
];

const NEARBY_EN = [
  { emoji: "🏄", text: "Seconds from K38 surf break" },
  { emoji: "🛒", text: "Minutes from Calimax Puerto Nuevo" },
  { emoji: "🍽️", text: "Close to popular restaurants" },
  { emoji: "🚗", text: "Less than 20 min from Downtown Rosarito" },
  { emoji: "🌎", text: "Convenient drive to US border & San Diego" },
];

const NEARBY_ES = [
  { emoji: "🏄", text: "Segundos del punto de surf K38" },
  { emoji: "🛒", text: "Minutos de Calimax Puerto Nuevo" },
  { emoji: "🍽️", text: "Cerca de excelentes restaurantes" },
  { emoji: "🚗", text: "Menos de 20 min del centro de Rosarito" },
  { emoji: "🌎", text: "Acceso rápido a la frontera y San Diego" },
];

export default function K38ApartmentPage() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const en = lang === "en";

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null);
  const nextImg = () => setLightbox(i => i !== null ? (i + 1) % IMAGES.length : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(30,30,30,0.7)", border: "1px solid rgba(201,168,76,0.15)",
    outline: "none", padding: "12px 16px", fontFamily: "'Jost', sans-serif",
    fontSize: "0.88rem", color: "#F5F0E8", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F5F0E8", fontFamily: "'Jost', sans-serif" }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.1)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(245,240,232,0.5)", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em", transition: "color 0.3s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C9A84C"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.5)"}>
          <ArrowLeft size={14} /> {en ? "Back to listings" : "Volver a listados"}
        </Link>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 300, color: "#F5F0E8" }}>
          Kian Canessa · <span style={{ color: "#C9A84C" }}>Real Estate</span>
        </span>
        <div style={{ display: "flex", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 999, padding: 3, gap: 2 }}>
          {(["en", "es"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "3px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 0.3s", background: lang === l ? "#C9A84C" : "transparent", color: lang === l ? "#0A0A0A" : "rgba(245,240,232,0.4)", fontWeight: lang === l ? 600 : 400 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", height: "70vh", minHeight: 400, overflow: "hidden", cursor: "pointer" }} onClick={() => openLightbox(0)}>
        <img src={IMAGES[0].src} alt="Ocean View" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.7) 100%)" }} />
        {/* Badge */}
        <div style={{ position: "absolute", top: 24, left: 24, background: "#C9A84C", color: "#0A0A0A", padding: "6px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600 }}>
          {en ? "For Rent" : "En Renta"}
        </div>
        {/* Photo count */}
        <div style={{ position: "absolute", bottom: 24, right: 24, background: "rgba(10,10,10,0.8)", border: "1px solid rgba(201,168,76,0.3)", padding: "8px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#C9A84C", letterSpacing: "0.15em" }}>
          {en ? `View all ${IMAGES.length} photos` : `Ver las ${IMAGES.length} fotos`}
        </div>
        {/* Title overlay */}
        <div style={{ position: "absolute", bottom: 24, left: 24 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#F5F0E8", lineHeight: 1, marginBottom: 8 }}>
            {en ? "Ocean View Apartment" : "Departamento Vista al Mar"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={13} color="#C9A84C" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(245,240,232,0.7)", letterSpacing: "0.08em" }}>
              Km 37.5 · Playas de Rosarito, BC 22717
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{ background: "#141414", padding: "12px 24px", display: "flex", gap: 8, overflowX: "auto", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
        {IMAGES.slice(1).map((img, i) => (
          <div key={i} onClick={() => openLightbox(i + 1)} style={{ flexShrink: 0, width: 90, height: 64, overflow: "hidden", cursor: "pointer", border: "1px solid rgba(201,168,76,0.1)", transition: "border-color 0.3s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.1)"}>
            <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "grid", gridTemplateColumns: "1fr", gap: 48 }} className="listing-layout">

        {/* Left: details */}
        <div>
          {/* Price + specs */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 8 }}>
                {en ? "Monthly Rent · USD" : "Renta Mensual · USD"}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5F0E8", fontWeight: 300, lineHeight: 1 }}>
                {en ? "Price on Request" : "Precio a Consultar"}
              </div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: "rgba(245,240,232,0.4)", marginTop: 6 }}>
                {en ? "Priced in US Dollars" : "Precio en dólares americanos"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { icon: Bed, val: "2", label: en ? "Bedrooms" : "Recámaras" },
                { icon: Bath, val: "2", label: en ? "Bathrooms" : "Baños" },
                { icon: Square, val: "180", label: "m²" },
              ].map(({ icon: Icon, val, label }, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <Icon size={18} color="#C9A84C" style={{ marginBottom: 6 }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: "#F5F0E8", fontWeight: 300, lineHeight: 1 }}>{val}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 300, color: "#F5F0E8", marginBottom: 16 }}>
              {en ? "About this property" : "Sobre esta propiedad"}
            </h2>
            <p style={{ color: "rgba(245,240,232,0.55)", lineHeight: 1.85, fontSize: "0.92rem" }}>
              {en
                ? "Live by the ocean. This fully furnished ground-floor apartment offers the perfect blend of comfort, convenience, and coastal living. Whether you're a remote worker, digital nomad, surfer, or frequent commuter to San Diego, this home is designed for your lifestyle."
                : "Vive frente al mar. Este departamento completamente amueblado en planta baja combina comodidad, ubicación y estilo de vida costero. Perfecto para trabajadores remotos, surfistas o personas que viajan frecuentemente a San Diego."}
            </p>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "#F5F0E8", marginBottom: 20 }}>
              {en ? "Amenities" : "Comodidades"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {[
                { icon: Wifi, label: en ? "Fiber optic internet" : "Internet de fibra óptica" },
                { icon: Car, label: en ? "Private garage" : "Cochera privada" },
                { icon: Wind, label: en ? "Gas heating" : "Calefacción de gas" },
                { icon: WashingMachine, label: en ? "Laundry available" : "Lavadero disponible" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid rgba(201,168,76,0.1)", background: "rgba(20,20,20,0.4)" }}>
                  <Icon size={15} color="#C9A84C" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.6)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "#F5F0E8", marginBottom: 20 }}>
              {en ? "Highlights" : "Características"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {(en ? HIGHLIGHTS_EN : HIGHLIGHTS_ES).map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Check size={14} color="#C9A84C" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "0.85rem", color: "rgba(245,240,232,0.55)", lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 300, color: "#F5F0E8", marginBottom: 16 }}>
              {en ? "Prime Location · Km 37.5" : "Ubicación Privilegiada · Km 37.5"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {(en ? NEARBY_EN : NEARBY_ES).map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.emoji}</span>
                  <span style={{ fontSize: "0.88rem", color: "rgba(245,240,232,0.55)" }}>{item.text}</span>
                </div>
              ))}
            </div>
            {/* Map */}
            <div style={{ border: "1px solid rgba(201,168,76,0.12)", overflow: "hidden", height: 280 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.0!2d-117.0599!3d32.2677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b32b3c4f4f4f%3A0x0!2sKm%2037.5%2C%20Tijuana%E2%80%93Ensenada%20Hwy%2C%20Rosarito%2C%20BC!5e0!3m2!1sen!2smx!4v1710000000000"
                width="100%" height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.5) brightness(0.85)" }}
                allowFullScreen loading="lazy" title="K38 Location"
              />
            </div>
          </div>
        </div>

        {/* Right: contact card */}
        <div>
          <div style={{ position: "sticky", top: 80, border: "1px solid rgba(201,168,76,0.15)", background: "#141414", padding: 32 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 6 }}>
              {en ? "Listed by" : "Publicado por"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#F5F0E8", fontWeight: 300, marginBottom: 4 }}>
              Kian Saavedra Canessa
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(245,240,232,0.35)", letterSpacing: "0.15em", marginBottom: 24 }}>
              {en ? "Real Estate Specialist · Baja California" : "Especialista Inmobiliario · Baja California"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              <a href="https://wa.me/526641234567" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "#C9A84C", color: "#0A0A0A", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "background 0.3s", justifyContent: "center" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#E8C97A"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#C9A84C"}>
                <Phone size={14} /> WhatsApp
              </a>
              <a href="mailto:kian@bajarealty.com"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.3s", justifyContent: "center" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.3)"; }}>
                <Mail size={14} /> Email
              </a>
            </div>

            <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)", paddingTop: 24 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.82rem", color: "rgba(245,240,232,0.4)", marginBottom: 16 }}>
                {en ? "Send a message" : "Envía un mensaje"}
              </div>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Check size={32} color="#C9A84C" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "#F5F0E8" }}>
                    {en ? "Message sent!" : "¡Mensaje enviado!"}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input style={inp} placeholder={en ? "Your name" : "Tu nombre"} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)"} />
                  <input style={inp} type="email" placeholder={en ? "Email" : "Correo"} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)"} />
                  <input style={inp} placeholder={en ? "Phone / WhatsApp" : "Teléfono / WhatsApp"} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)"} />
                  <textarea style={{ ...inp, resize: "none" }} rows={3}
                    placeholder={en ? "I'm interested in this apartment..." : "Me interesa este departamento..."}
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)"}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.15)"} />
                  <button type="submit" style={{ padding: "14px", background: "#C9A84C", color: "#0A0A0A", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "background 0.3s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#E8C97A"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#C9A84C"}>
                    {en ? "Send Inquiry" : "Enviar Consulta"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={closeLightbox}>
          <button onClick={e => { e.stopPropagation(); closeLightbox(); }}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", cursor: "pointer", padding: 8, display: "flex" }}>
            <X size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); prevImg(); }}
            style={{ position: "absolute", left: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", cursor: "pointer", padding: "12px", display: "flex" }}>
            <ChevronLeft size={24} />
          </button>
          <img src={IMAGES[lightbox].src} alt={IMAGES[lightbox].label}
            style={{ maxHeight: "88vh", maxWidth: "90vw", objectFit: "contain" }}
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); nextImg(); }}
            style={{ position: "absolute", right: 20, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", cursor: "pointer", padding: "12px", display: "flex" }}>
            <ChevronRight size={24} />
          </button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(245,240,232,0.4)" }}>
            {IMAGES[lightbox].label} · {lightbox + 1} / {IMAGES.length}
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
