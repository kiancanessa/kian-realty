"use client";
import { useEffect, useState } from "react";
import { Mail, Phone, Home, MessageSquare } from "lucide-react";
import Avatar from "../../components/Avatar";

type Inquiry = {
  id: number;
  source: "contact" | "property";
  name: string;
  email: string;
  phone: string | null;
  interest: string | null;
  property_id: string | null;
  property_title: string | null;
  message: string | null;
  created_at: string;
};

export default function AdminContactsClient() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then(res => res.json())
      .then(data => setInquiries(data.inquiries ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))", marginBottom: 8 }}>
          Contactos
        </h1>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 32 }}>
          Consultas recibidas por el formulario general y por propiedades — para seguimiento de ventas.
        </p>

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && inquiries.length === 0 && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>Aún no hay consultas registradas.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inquiries.map(i => (
            <div key={i.id} style={{ padding: 20, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 10, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={i.name} size={36} />
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "rgb(var(--ink))" }}>{i.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.45)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail size={11} /> {i.email}</span>
                      {i.phone && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={11} /> {i.phone}</span>}
                    </div>
                  </div>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.4)" }}>
                  {new Date(i.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              {(i.property_title || i.property_id) && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgb(var(--accent))" }}>
                  <Home size={13} /> {i.property_title || i.property_id}
                </div>
              )}
              {i.interest && (
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", color: "rgba(var(--ink),0.55)", marginBottom: 8 }}>
                  Interés: {i.interest}
                </div>
              )}
              {i.message && (
                <div style={{ display: "flex", gap: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.65)", lineHeight: 1.6 }}>
                  <MessageSquare size={14} color="rgba(var(--accent),0.5)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {i.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
