import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyGrid from "../components/PropertyGrid";
import PropiedadesHeader from "../components/PropiedadesHeader";
import { getOrderedPropertyCards } from "../lib/listings";

export const metadata: Metadata = {
  title: "Casas, Departamentos y Terrenos en Rosarito",
  description: "Catálogo completo de propiedades en venta y renta en Rosarito, Baja California — casas, departamentos y terrenos, actualizado en tiempo real.",
  alternates: { canonical: "/propiedades" },
};

export default async function PropiedadesPage() {
  const properties = await getOrderedPropertyCards();

  return (
    <main>
      <Navbar />
      <section style={{ padding: "160px 24px 112px", background: "rgb(var(--bg))" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <PropiedadesHeader />
          <PropertyGrid properties={properties} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
