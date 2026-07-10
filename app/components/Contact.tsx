"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { Mail, Phone, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.querySelectorAll(".reveal").forEach((el, i) => setTimeout(() => el.classList.add("visible"), i * 120));
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", phone: "", interest: "", message: "" });
  };

  const inputStyle: React.CSSProperties = { width: "100%", background: "#FFFFFF", border: "1px solid rgba(107,138,66,0.15)", outline: "none", padding: "14px 16px", fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "#23221E", transition: "border-color 0.3s", boxSizing: "border-box" };

  const contactLinks = [
    { icon: Mail, label: "Email", value: "jorgeelcasarosarito@gmail.com", href: "mailto:jorgeelcasarosarito@gmail.com" },
    { icon: Phone, label: "WhatsApp · MX", value: "+52 661 125 6107", href: "https://wa.me/526611256107" },
    { icon: Phone, label: "Phone · US", value: "+1 (818) 617-5047", href: "tel:+18186175047" },
  ];

  return (
    <section id="contact" ref={sectionRef} style={{ padding: "112px 24px", background: "#FAF6EE" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 80 }} className="contact-grid">
        {/* Left */}
        <div>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B8A42" }}>{t.labels.contact}</span>
          </div>
          <h2 className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#23221E", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {t.contact.title}
          </h2>
          <p className="reveal" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.38)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 48 }}>
            {t.contact.subtitle}
          </p>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6B8A42" }}>{t.contact.or}</div>
            {contactLinks.map(({ icon: Icon, label, value, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", transition: "all 0.3s" }}>
                <div style={{ width: 40, height: 40, border: "1px solid rgba(107,138,66,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.3s" }}>
                  <Icon size={15} color="rgba(107,138,66,0.55)" />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(35,34,30,0.28)" }}>{label}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgba(35,34,30,0.58)" }}>{value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="reveal">
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 0" }}>
              <CheckCircle size={48} color="#6B8A42" style={{ marginBottom: 24 }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "#23221E" }}>{t.contact.success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input style={inputStyle} placeholder={t.contact.name} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                  onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.45)"}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.12)"} />
                <input style={inputStyle} type="email" placeholder={t.contact.email} value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                  onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.45)"}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.12)"} />
              </div>
              <input style={inputStyle} placeholder={t.contact.phone} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.45)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.12)"} />
              <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} value={form.interest} onChange={e => setForm({...form, interest: e.target.value})}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.45)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.12)"}>
                <option value="" disabled style={{ background: "#FFFFFF" }}>{t.contact.interest}</option>
                {t.contact.options.map(o => <option key={o} value={o} style={{ background: "#FFFFFF" }}>{o}</option>)}
              </select>
              <textarea style={{ ...inputStyle, resize: "none" }} rows={5} placeholder={t.contact.message} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.45)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "rgba(107,138,66,0.12)"} />
              <button type="submit" disabled={sending}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px", background: sending ? "rgba(107,138,66,0.6)" : "#6B8A42", color: "#FAF6EE", border: "none", cursor: sending ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.82rem", letterSpacing: "0.22em", textTransform: "uppercase", transition: "all 0.3s" }}
                onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.background = "#85A857"; }}
                onMouseLeave={e => { if (!sending) (e.currentTarget as HTMLElement).style.background = "#6B8A42"; }}>
                {sending ? t.contact.sending : <>{t.contact.send} <Send size={14} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
