"use client";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, X, Star, Loader2 } from "lucide-react";
import { PROPERTY_TYPES } from "../../lib/propertyTypes";

export type PropertyFormState = {
  title: string;
  description: string;
  location: string;
  operation: "sale" | "rental";
  propertyType: string;
  price: string;
  currency: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  lotSize: string;
  constructionSize: string;
  images: string[];
  latitude: string;
  longitude: string;
};

export function emptyPropertyForm(): PropertyFormState {
  return {
    title: "", description: "", location: "", operation: "sale", propertyType: "Casa",
    price: "", currency: "USD", bedrooms: "", bathrooms: "", parkingSpaces: "",
    lotSize: "", constructionSize: "", images: [], latitude: "", longitude: "",
  };
}

type PropertyRow = {
  title: string; description: string | null; location: string;
  operation: "sale" | "rental"; property_type: string;
  price: string | number | null; currency: string;
  bedrooms: number | null; bathrooms: number | null; parking_spaces: number | null;
  lot_size: string | number | null; construction_size: string | number | null;
  images: string[]; latitude: string | number | null; longitude: string | number | null;
};

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

export function propertyToForm(p: PropertyRow): PropertyFormState {
  return {
    title: p.title, description: p.description ?? "", location: p.location,
    operation: p.operation, propertyType: p.property_type,
    price: str(p.price), currency: p.currency,
    bedrooms: str(p.bedrooms), bathrooms: str(p.bathrooms), parkingSpaces: str(p.parking_spaces),
    lotSize: str(p.lot_size), constructionSize: str(p.construction_size),
    images: p.images ?? [], latitude: str(p.latitude), longitude: str(p.longitude),
  };
}

const input: React.CSSProperties = {
  width: "100%", background: "rgb(var(--bg-alt))", border: "1px solid rgba(var(--accent),0.15)",
  outline: "none", padding: "11px 13px", fontFamily: "'Jost', sans-serif",
  fontSize: "0.85rem", color: "rgb(var(--ink))", boxSizing: "border-box",
};
const label: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.12em",
  textTransform: "uppercase", color: "rgba(var(--ink),0.45)", marginBottom: 6, display: "block",
};

function Field({ text, children }: { text: string; children: React.ReactNode }) {
  return <div><span style={label}>{text}</span>{children}</div>;
}

export default function PropertyEditor({
  initial, onSave, onCancel, saving,
}: {
  initial: PropertyFormState;
  onSave: (form: PropertyFormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PropertyFormState>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const set = <K extends keyof PropertyFormState>(key: K, value: PropertyFormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    setUploadError(null);
    try {
      // Sequential rather than parallel: keeps the resulting image order
      // predictable, which matters because images[0] is the cover photo.
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(`properties/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/properties/upload",
        });
        urls.push(blob.url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  // The cover photo is simply images[0], so "make cover" is a reorder.
  const makeCover = (i: number) =>
    setForm(prev => {
      const images = [...prev.images];
      const [picked] = images.splice(i, 1);
      return { ...prev, images: [picked, ...images] };
    });

  const canSave = form.title.trim() !== "" && form.location.trim() !== "" && !uploading && !saving;

  return (
    <div style={{ border: "1px solid rgba(var(--accent),0.2)", background: "rgb(var(--surface))", padding: 24, marginBottom: 24 }}>
      <div style={{ display: "grid", gap: 16 }}>
        <Field text="Título *">
          <input style={input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Casa en venta con vista al mar" />
        </Field>

        <Field text="Ubicación *">
          <input style={input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Playas de Rosarito, Baja California" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field text="Operación *">
            <select style={{ ...input, cursor: "pointer" }} value={form.operation} onChange={e => set("operation", e.target.value as "sale" | "rental")}>
              <option value="sale">Venta</option>
              <option value="rental">Renta</option>
            </select>
          </Field>
          <Field text="Tipo *">
            <select style={{ ...input, cursor: "pointer" }} value={form.propertyType} onChange={e => set("propertyType", e.target.value)}>
              {PROPERTY_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <Field text={form.operation === "rental" ? "Precio por mes" : "Precio"}>
            <input style={input} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="400000" />
          </Field>
          <Field text="Moneda">
            <select style={{ ...input, cursor: "pointer" }} value={form.currency} onChange={e => set("currency", e.target.value)}>
              <option value="USD">USD</option>
              <option value="MXN">MXN</option>
            </select>
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <Field text="Recámaras"><input style={input} type="number" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} /></Field>
          <Field text="Baños"><input style={input} type="number" value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} /></Field>
          <Field text="Estacionamientos"><input style={input} type="number" value={form.parkingSpaces} onChange={e => set("parkingSpaces", e.target.value)} /></Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field text="m² construcción"><input style={input} type="number" value={form.constructionSize} onChange={e => set("constructionSize", e.target.value)} /></Field>
          <Field text="m² terreno"><input style={input} type="number" value={form.lotSize} onChange={e => set("lotSize", e.target.value)} /></Field>
        </div>

        <Field text="Descripción">
          <textarea style={{ ...input, resize: "vertical", minHeight: 110 }} value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder="Describe la propiedad: acabados, amenidades, ubicación, lo que la hace especial…" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field text="Latitud (opcional — para el mapa)"><input style={input} value={form.latitude} onChange={e => set("latitude", e.target.value)} placeholder="32.3345" /></Field>
          <Field text="Longitud (opcional)"><input style={input} value={form.longitude} onChange={e => set("longitude", e.target.value)} placeholder="-117.0353" /></Field>
        </div>

        {/* Photos */}
        <div>
          <span style={label}>Fotos — la primera es la portada</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10, marginBottom: 12 }}>
            {form.images.map((url, i) => (
              <div key={url + i} style={{ position: "relative", aspectRatio: "4/3", border: i === 0 ? "2px solid rgb(var(--accent))" : "1px solid rgba(var(--accent),0.15)", overflow: "hidden" }}>
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {i === 0 && (
                  <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "3px 0" }}>
                    Portada
                  </span>
                )}
                <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 4 }}>
                  {i !== 0 && (
                    <button type="button" onClick={() => makeCover(i)} title="Hacer portada"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", cursor: "pointer" }}>
                      <Star size={12} />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} title="Quitar"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", cursor: "pointer" }}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}

            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, aspectRatio: "4/3", border: "1px dashed rgba(var(--accent),0.4)", cursor: uploading ? "wait" : "pointer", color: "rgb(var(--accent))", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", textAlign: "center", padding: 8 }}>
              {uploading ? <Loader2 size={20} className="spin" /> : <ImagePlus size={20} />}
              {uploading ? "Subiendo…" : "Agregar fotos"}
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={uploading}
                onChange={e => { const f = e.target.files; if (f && f.length) handleFiles(f); e.target.value = ""; }} />
            </label>
          </div>
          {uploadError && (
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", color: "rgb(var(--error))" }}>{uploadError}</p>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
          <button onClick={onCancel} disabled={saving}
            style={{ padding: "11px 20px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgba(var(--ink),0.6)", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Cancelar
          </button>
          <button onClick={() => onSave(form)} disabled={!canSave}
            style={{ padding: "11px 24px", background: canSave ? "rgb(var(--accent))" : "rgba(var(--accent),0.4)", border: "none", color: "#FAF6EE", cursor: canSave ? "pointer" : "not-allowed", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
