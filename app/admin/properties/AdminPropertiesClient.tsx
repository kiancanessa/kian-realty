"use client";
import { useEffect, useState } from "react";
import { Plus, Check, Trash2, Pencil, ExternalLink, MapPin } from "lucide-react";
import PropertyEditor, { emptyPropertyForm, propertyToForm, type PropertyFormState } from "./PropertyEditor";

type PropertyRow = {
  id: number;
  published: boolean;
  title: string;
  description: string | null;
  location: string;
  operation: "sale" | "rental";
  property_type: string;
  price: string | number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  lot_size: string | number | null;
  construction_size: string | number | null;
  images: string[];
  latitude: string | number | null;
  longitude: string | number | null;
  created_at: string;
};

export default function AdminPropertiesClient() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/properties")
      .then(res => res.json())
      .then(data => setProperties(data.properties ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const save = async (form: PropertyFormState) => {
    setSaving(true);
    const url = editingId === "new" ? "/api/admin/properties" : `/api/admin/properties/${editingId}`;
    await fetch(url, {
      method: editingId === "new" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditingId(null);
    load();
  };

  const setPublished = async (id: number, published: boolean) => {
    await fetch(`/api/admin/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    load();
  };

  const remove = async (id: number, title: string) => {
    if (!window.confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    load();
  };

  const priceLabel = (p: PropertyRow) => {
    if (p.price === null || p.price === "") return "Precio a consultar";
    const amount = Number(p.price).toLocaleString("en-US");
    return p.operation === "rental" ? `$${amount} ${p.currency}/mes` : `$${amount} ${p.currency}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "2rem", color: "rgb(var(--ink))" }}>
            Propiedades propias
          </h1>
          {editingId === null && (
            <button onClick={() => setEditingId("new")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Plus size={15} /> Nueva propiedad
            </button>
          )}
        </div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", color: "rgba(var(--ink),0.5)", marginBottom: 32, lineHeight: 1.6 }}>
          Propiedades exclusivas del sitio web, que no vienen de EasyBroker. Aparecen mezcladas con las de EasyBroker
          en el inicio y en /propiedades, con los mismos filtros, búsqueda y formulario de contacto.
        </p>

        {editingId === "new" && (
          <PropertyEditor initial={emptyPropertyForm()} onSave={save} onCancel={() => setEditingId(null)} saving={saving} />
        )}
        {typeof editingId === "number" && (
          <PropertyEditor
            key={editingId}
            initial={propertyToForm(properties.find(p => p.id === editingId)!)}
            onSave={save}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        )}

        {loading && <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.5)" }}>Cargando…</p>}
        {!loading && properties.length === 0 && editingId === null && (
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(var(--ink),0.45)" }}>
            Aún no hay propiedades propias. Crea la primera con “Nueva propiedad”.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {properties.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 14, border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", flexWrap: "wrap" }}>
              <div style={{ width: 84, height: 64, flexShrink: 0, background: "rgb(var(--bg-alt))", overflow: "hidden" }}>
                {p.images[0]
                  ? <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(var(--accent),0.35)" }}><MapPin size={18} /></div>}
              </div>

              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgb(var(--ink))" }}>{p.title}</span>
                  {p.published ? (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.4)", padding: "2px 8px" }}>
                      Publicada
                    </span>
                  ) : (
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", border: "1px solid rgba(var(--ink),0.2)", padding: "2px 8px" }}>
                      Borrador
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(var(--ink),0.42)", marginTop: 3 }}>
                  {p.property_type} · {p.operation === "rental" ? "Renta" : "Venta"} · {priceLabel(p)} · {p.images.length} foto{p.images.length === 1 ? "" : "s"}
                </div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", color: "rgba(var(--ink),0.45)" }}>{p.location}</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.published && (
                  <a href={`/propiedades/ECR-${p.id}`} target="_blank" rel="noopener noreferrer" title="Ver en el sitio"
                    style={{ display: "flex", alignItems: "center", padding: "8px 12px", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", textDecoration: "none" }}>
                    <ExternalLink size={13} />
                  </a>
                )}
                {p.published ? (
                  <button onClick={() => setPublished(p.id, false)}
                    style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Despublicar
                  </button>
                ) : (
                  <button onClick={() => setPublished(p.id, true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgb(var(--accent))", color: "#FAF6EE", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <Check size={13} /> Publicar
                  </button>
                )}
                <button onClick={() => setEditingId(p.id)} title="Editar"
                  style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--accent))", cursor: "pointer" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => remove(p.id, p.title)} title="Eliminar"
                  style={{ padding: "8px 14px", background: "transparent", border: "1px solid rgba(var(--error),0.35)", color: "rgb(var(--error))", cursor: "pointer" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
