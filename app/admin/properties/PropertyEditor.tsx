"use client";
import { useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  ImagePlus, X, Star, Loader2, Monitor, Smartphone, Check, ChevronLeft, ChevronRight, GripVertical,
} from "lucide-react";
import { PROPERTY_TYPES } from "../../lib/propertyTypes";
import { PLACEHOLDER_IMAGE, formatOwnPrice, numOrNull } from "../../lib/propertyFormat";
import { categoryFor } from "../../lib/easybroker";
import type { PropertyCard } from "../../lib/easybroker";
import PropertyCardTile from "../../components/PropertyCardTile";

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

/** The form as the public grid will see it. Goes through the same formatter
 *  the server uses, so the preview price can't drift from the real one. */
function formToCard(form: PropertyFormState): PropertyCard {
  return {
    id: "preview",
    title: form.title.trim() || "Título de la propiedad",
    location: form.location.trim() || "Ubicación",
    price: formatOwnPrice(numOrNull(form.price), form.currency, form.operation),
    operation: form.operation,
    type: categoryFor(form.propertyType),
    propertyType: form.propertyType,
    bedrooms: numOrNull(form.bedrooms),
    bathrooms: numOrNull(form.bathrooms),
    parkingSpaces: numOrNull(form.parkingSpaces),
    constructionSize: numOrNull(form.constructionSize),
    lotSize: numOrNull(form.lotSize),
    image: form.images[0] ?? PLACEHOLDER_IMAGE,
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

/** A titled block of the form, so the page reads as a few short steps rather
 *  than one long wall of inputs. */
function Section({ step, title, hint, children }: { step: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section style={{ border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: hint ? 4 : 16 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgb(var(--accent))", letterSpacing: "0.1em" }}>
          {String(step).padStart(2, "0")}
        </span>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: "rgb(var(--ink))" }}>
          {title}
        </h3>
      </div>
      {hint && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", color: "rgba(var(--ink),0.45)", lineHeight: 1.6, marginBottom: 16 }}>
          {hint}
        </p>
      )}
      <div style={{ display: "grid", gap: 16 }}>{children}</div>
    </section>
  );
}

type CheckItem = { label: string; done: boolean; required: boolean };

/** What still needs filling in. Required items gate the Save button; the rest
 *  are the fields that make a listing actually sell. */
function checklistFor(form: PropertyFormState): CheckItem[] {
  return [
    { label: "Título", done: form.title.trim() !== "", required: true },
    { label: "Ubicación", done: form.location.trim() !== "", required: true },
    { label: "Al menos una foto", done: form.images.length > 0, required: false },
    { label: "Precio", done: form.price.trim() !== "", required: false },
    { label: "Descripción", done: form.description.trim() !== "", required: false },
    {
      label: "Recámaras, baños o metros",
      done: [form.bedrooms, form.bathrooms, form.constructionSize, form.lotSize].some(v => v.trim() !== ""),
      required: false,
    },
  ];
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
  const [mobile, setMobile] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropping, setDropping] = useState(false);

  const set = <K extends keyof PropertyFormState>(key: K, value: PropertyFormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleFiles = async (files: FileList | File[]) => {
    const picked = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (picked.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Sequential rather than parallel: keeps the resulting image order
      // predictable, which matters because images[0] is the cover photo.
      const urls: string[] = [];
      for (const file of picked) {
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

  // The cover photo is simply images[0], so every reorder is a move within the
  // array — "make cover" is just a move to position 0.
  const moveImage = (from: number, to: number) =>
    setForm(prev => {
      if (to < 0 || to >= prev.images.length || from === to) return prev;
      const images = [...prev.images];
      const [picked] = images.splice(from, 1);
      images.splice(to, 0, picked);
      return { ...prev, images };
    });

  const checklist = checklistFor(form);
  const missingRequired = checklist.some(c => c.required && !c.done);
  const canSave = !missingRequired && !uploading && !saving;
  const doneCount = checklist.filter(c => c.done).length;

  const previewWidth = mobile ? 340 : 420;

  return (
    <div style={{ border: "1px solid rgba(var(--accent),0.2)", background: "rgb(var(--bg-alt))", marginBottom: 24 }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "14px 20px", borderBottom: "1px solid rgba(var(--accent),0.12)" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(var(--ink),0.5)" }}>
          {doneCount} de {checklist.length} campos listos
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--ink),0.4)", marginRight: 4 }}>
            Vista previa
          </span>
          <button type="button" onClick={() => setMobile(false)} aria-label="Escritorio"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: `1px solid ${!mobile ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`, background: !mobile ? "rgb(var(--accent))" : "transparent", color: !mobile ? "#FAF6EE" : "rgb(var(--ink))", cursor: "pointer" }}>
            <Monitor size={15} />
          </button>
          <button type="button" onClick={() => setMobile(true)} aria-label="Celular"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, border: `1px solid ${mobile ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`, background: mobile ? "rgb(var(--accent))" : "transparent", color: mobile ? "#FAF6EE" : "rgb(var(--ink))", cursor: "pointer" }}>
            <Smartphone size={15} />
          </button>
        </div>
      </div>

      <div className="prop-editor-layout" style={{ display: "grid", gap: 20, padding: 20 }}>
        {/* ---------- Live preview ---------- */}
        <aside className="prop-editor-preview">
          <div style={{ position: "sticky", top: 20 }}>
            <div style={{ padding: "26px 20px 30px", background: "rgba(10,10,8,0.72)", display: "flex", justifyContent: "center" }}>
              {/* The real card component, so what you see is literally what the
                  site renders. Clicks are swallowed in the capture phase —
                  otherwise the wrapping <Link> would navigate away mid-edit. */}
              <div
                onClickCapture={e => { e.preventDefault(); e.stopPropagation(); }}
                style={{ width: previewWidth, maxWidth: "100%", transition: "width 0.3s", cursor: "default" }}
              >
                <PropertyCardTile p={formToCard(form)} inquireLabel="Ver detalles" />
              </div>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", color: "rgba(var(--ink),0.45)", textAlign: "center", padding: "10px 12px 16px", lineHeight: 1.6 }}>
              Así se verá en el inicio y en /propiedades, mezclada con las de EasyBroker.
            </p>

            {/* Checklist */}
            <div style={{ border: "1px solid rgba(var(--accent),0.12)", background: "rgb(var(--surface))", padding: 16 }}>
              <span style={label}>Antes de publicar</span>
              <ul style={{ listStyle: "none", display: "grid", gap: 7 }}>
                {checklist.map(c => (
                  <li key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Jost', sans-serif", fontSize: "0.8rem", color: c.done ? "rgb(var(--ink))" : "rgba(var(--ink),0.42)" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, flexShrink: 0, borderRadius: "50%", border: c.done ? "none" : "1px solid rgba(var(--ink),0.25)", background: c.done ? "rgb(var(--accent))" : "transparent", color: "#FAF6EE" }}>
                      {c.done && <Check size={10} strokeWidth={3} />}
                    </span>
                    {c.label}
                    {c.required && !c.done && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
                        obligatorio
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* ---------- Form ---------- */}
        <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
          <Section step={1} title="Fotos" hint="Arrastra las fotos aquí. La primera es la portada — la que sale en la tarjeta. Arrástralas entre sí para reordenarlas.">
            <div>
              <div
                onDragOver={e => { e.preventDefault(); if (dragFrom === null) setDropping(true); }}
                onDragLeave={() => setDropping(false)}
                onDrop={e => {
                  setDropping(false);
                  if (dragFrom !== null) return;          // reordering, not a file drop
                  e.preventDefault();
                  if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
                }}
                style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10,
                  padding: 10, marginBottom: 12,
                  border: `1px dashed ${dropping ? "rgb(var(--accent))" : "rgba(var(--accent),0.25)"}`,
                  background: dropping ? "rgba(var(--accent),0.06)" : "transparent",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                {form.images.map((url, i) => (
                  <div
                    key={url + i}
                    draggable
                    onDragStart={() => setDragFrom(i)}
                    onDragEnd={() => setDragFrom(null)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); if (dragFrom !== null) moveImage(dragFrom, i); setDragFrom(null); }}
                    style={{
                      position: "relative", aspectRatio: "4/3", overflow: "hidden", cursor: "grab",
                      border: i === 0 ? "2px solid rgb(var(--accent))" : "1px solid rgba(var(--accent),0.15)",
                      opacity: dragFrom === i ? 0.4 : 1,
                    }}
                  >
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />

                    <span style={{ position: "absolute", top: 4, left: 4, display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, background: "rgba(10,10,8,0.55)", color: "#FAF6EE" }}>
                      <GripVertical size={11} />
                    </span>

                    {i === 0 && (
                      <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgb(var(--accent))", color: "#FAF6EE", fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "3px 0" }}>
                        Portada
                      </span>
                    )}

                    <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 4 }}>
                      {i !== 0 && (
                        <button type="button" onClick={() => moveImage(i, 0)} title="Hacer portada"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", cursor: "pointer" }}>
                          <Star size={12} />
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(i)} title="Quitar"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "none", borderRadius: "50%", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", cursor: "pointer" }}>
                        <X size={12} />
                      </button>
                    </div>

                    {/* Touch devices can't drag — these always work. */}
                    <div style={{ position: "absolute", bottom: i === 0 ? 18 : 4, left: 4, display: "flex", gap: 4 }}>
                      <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0} title="Mover antes"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, border: "none", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", opacity: i === 0 ? 0.3 : 1, cursor: i === 0 ? "default" : "pointer" }}>
                        <ChevronLeft size={12} />
                      </button>
                      <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.images.length - 1} title="Mover después"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, border: "none", background: "rgba(10,10,8,0.6)", color: "#FAF6EE", opacity: i === form.images.length - 1 ? 0.3 : 1, cursor: i === form.images.length - 1 ? "default" : "pointer" }}>
                        <ChevronRight size={12} />
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
          </Section>

          <Section step={2} title="Lo básico">
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
          </Section>

          <Section step={3} title="Detalles" hint="Estos son los datos que salen debajo del título en la tarjeta y sirven para los filtros de búsqueda.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <Field text="Recámaras"><input style={input} type="number" value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} /></Field>
              <Field text="Baños"><input style={input} type="number" value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} /></Field>
              <Field text="Estacionamientos"><input style={input} type="number" value={form.parkingSpaces} onChange={e => set("parkingSpaces", e.target.value)} /></Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field text="m² construcción"><input style={input} type="number" value={form.constructionSize} onChange={e => set("constructionSize", e.target.value)} /></Field>
              <Field text="m² terreno"><input style={input} type="number" value={form.lotSize} onChange={e => set("lotSize", e.target.value)} /></Field>
            </div>
          </Section>

          <Section step={4} title="Descripción" hint="Aparece en la página de la propiedad, debajo de las fotos.">
            <textarea style={{ ...input, resize: "vertical", minHeight: 130 }} value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe la propiedad: acabados, amenidades, ubicación, lo que la hace especial…" />
          </Section>

          <Section step={5} title="Mapa" hint="Opcional. Con estas coordenadas la página de la propiedad muestra el mapa. Para obtenerlas: en Google Maps, clic derecho sobre el punto y copia los dos números.">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field text="Latitud"><input style={input} value={form.latitude} onChange={e => set("latitude", e.target.value)} placeholder="32.3345" /></Field>
              <Field text="Longitud"><input style={input} value={form.longitude} onChange={e => set("longitude", e.target.value)} placeholder="-117.0353" /></Field>
            </div>
          </Section>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "0 20px 20px" }}>
        <button onClick={onCancel} disabled={saving}
          style={{ padding: "11px 20px", background: "transparent", border: "1px solid rgba(var(--accent),0.3)", color: "rgba(var(--ink),0.6)", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Cancelar
        </button>
        <button onClick={() => onSave(form)} disabled={!canSave}
          title={missingRequired ? "Falta el título o la ubicación" : undefined}
          style={{ padding: "11px 24px", background: canSave ? "rgb(var(--accent))" : "rgba(var(--accent),0.4)", border: "none", color: "#FAF6EE", cursor: canSave ? "pointer" : "not-allowed", fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
