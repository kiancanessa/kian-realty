import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyGrid from "../components/PropertyGrid";
import { getAllProperties, toCard } from "../lib/easybroker";

export const metadata: Metadata = {
  title: "Casas, Departamentos y Terrenos en Rosarito",
  description: "Catálogo completo de propiedades en venta y renta en Rosarito, Baja California — casas, departamentos y terrenos, actualizado en tiempo real.",
  alternates: { canonical: "/propiedades" },
};

export default async function PropiedadesPage() {
  const properties = (await getAllProperties()).map(toCard);

  return (
    <main>
      <Navbar />
      <section style={{ padding: "160px 24px 112px", background: "#FAF6EE" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6B8A42" }}>Portafolio</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#23221E", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Todas las Propiedades
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", color: "rgba(35,34,30,0.5)", fontSize: "0.9rem", maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
            Catálogo completo, actualizado directamente desde nuestro sistema de administración de propiedades.
          </p>
          <PropertyGrid properties={properties} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
