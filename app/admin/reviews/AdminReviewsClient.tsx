"use client";
import { useEffect, useState } from "react";
import { Check, X, Mail } from "lucide-react";
import Avatar from "../../components/Avatar";
import StarRating from "../../components/StarRating";

type Review = {
  id: number;
  type: "testimonial" | "property";
  property_id: string | null;
  property_title: string | null;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const TABS = ["pending", "approved", "rejected", "all"] as const;
const TAB_LABEL: Record<(typeof TABS)[number], string> = {
  pending: "Pendientes", approved: "Aprobadas", rejected: "Rechazadas", all: "Todas",
};

export default function AdminReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/reviews")
      .then(res => res.json())
      .then(data => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    setBusyId(id);
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    setBusyId(null);
  };

  const visible = tab === "all" ? reviews : reviews.filter(r => r.status === tab);
  const pendingCount = reviews.filter(r => r.status === "pending").length;

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))", marginBottom: 32 }}>
          Reseñas
        </h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {TABS.map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              style={{
                padding: "8px 16px", border: "1px solid rgba(var(--accent),0.25)", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase",
                background: tab === tb ? "rgb(var(--accent))" : "transparent",
                color: tab === tb ? "#FAF6EE" : "rgb(var(--ink))",
              }}>
              {TAB_LABEL[tb]}{tb === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}

        {!loading && visible.length === 0 && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>No hay reseñas en esta categoría.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {visible.map(r => (
            <div key={r.id} style={{ padding: 24, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={r.name} size={40} />
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgb(var(--ink))" }}>{r.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "rgba(var(--ink),0.45)" }}>
                      <Mail size={11} /> {r.email}
                    </div>
                  </div>
                </div>
                <StarRating value={r.rating} size={15} />
              </div>

              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.88rem", color: "rgba(var(--ink),0.7)", lineHeight: 1.6, marginBottom: 14 }}>
                {r.comment}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)" }}>
                  <span>{r.type === "property" ? (r.property_title || r.property_id) : "Testimonio general"}</span>
                  <span>·</span>
                  <span>{new Date(r.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</span>
                  <span>·</span>
                  <span style={{ color: r.status === "approved" ? "rgb(var(--accent))" : r.status === "rejected" ? "rgb(var(--error))" : "rgba(var(--ink),0.5)" }}>
                    {r.status === "approved" ? "Aprobada" : r.status === "rejected" ? "Rechazada" : "Pendiente"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {r.status !== "approved" && (
                    <button disabled={busyId === r.id} onClick={() => updateStatus(r.id, "approved")}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      <Check size={13} /> Aprobar
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button disabled={busyId === r.id} onClick={() => updateStatus(r.id, "rejected")}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--error),0.4)", color: "rgb(var(--error))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      <X size={13} /> Rechazar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
