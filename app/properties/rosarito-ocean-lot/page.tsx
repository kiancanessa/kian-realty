"use client";
import { Ruler, Zap, Droplets, FileCheck } from "lucide-react";
import PropertyDetail from "../../components/PropertyDetail";

const IMAGES = [
  { src: "/images/properties/land/1-beach.jpg", label: { en: "Beach Frontage", es: "Frente de Playa" } },
  { src: "/images/properties/land/2-sunset.jpg", label: { en: "Ocean View", es: "Vista al Mar" } },
  { src: "/images/properties/land/3-coastline.jpg", label: { en: "Coastline", es: "Costa" } },
];

export default function RosaritoOceanLotPage() {
  return (
    <PropertyDetail
      badge={{ en: "Land For Sale", es: "Terreno En Venta" }}
      title={{ en: "Ocean-View Lot", es: "Terreno con Vista al Mar" }}
      address="Km 42, Rosarito, Baja California"
      images={IMAGES}
      priceLabel={{ en: "Sale Price · USD", es: "Precio de Venta · USD" }}
      price={{ en: "$95,000", es: "$95,000" }}
      priceNote={{ en: "Priced in US Dollars", es: "Precio en dólares americanos" }}
      specs={[
        { icon: Ruler, val: "500", label: { en: "m² Lot", es: "m² Terreno" } },
        { icon: Ruler, val: "20×25", label: { en: "Dimensions (m)", es: "Dimensiones (m)" } },
      ]}
      description={{
        en: "A flat, buildable ocean-view lot south of downtown Rosarito — a rare opportunity to design and build your dream coastal home from the ground up. Deed in order, utilities at the street, and just minutes from the highway.",
        es: "Un terreno plano y edificable con vista al mar al sur del centro de Rosarito — una oportunidad única para diseñar y construir la casa costera de tus sueños desde cero. Escritura en regla, servicios sobre la calle, y a minutos de la carretera.",
      }}
      amenities={[
        { icon: Zap, label: { en: "Electricity at the street", es: "Electricidad sobre la calle" } },
        { icon: Droplets, label: { en: "Water access available", es: "Acceso a agua disponible" } },
        { icon: FileCheck, label: { en: "Clear title / deed in order", es: "Escritura en regla" } },
      ]}
      highlights={[
        { en: "Flat, easy-to-build terrain", es: "Terreno plano, fácil de construir" },
        { en: "Unobstructed ocean views", es: "Vista al mar sin obstrucciones" },
        { en: "5 minutes from the toll highway", es: "5 minutos de la carretera de cuota" },
        { en: "Deed in order, ready to transfer", es: "Escritura en regla, lista para transferir" },
        { en: "No HOA restrictions", es: "Sin restricciones de HOA" },
      ]}
      locationTitle={{ en: "Prime Location · Km 42", es: "Ubicación Privilegiada · Km 42" }}
      nearby={[
        { emoji: "🌊", text: { en: "2 min walk to the beach", es: "2 min caminando a la playa" } },
        { emoji: "🛣️", text: { en: "5 min to the toll highway", es: "5 min a la carretera de cuota" } },
        { emoji: "🛒", text: { en: "15 min to downtown Rosarito", es: "15 min al centro de Rosarito" } },
        { emoji: "🌎", text: { en: "55 min to the US border", es: "55 min a la frontera con EE.UU." } },
      ]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110943.85506978478!2d-117.13505673203128!3d32.33292814013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b5d5cc7a3101%3A0xbf24fb6f27f22a6d!2sRosarito%2C%20Baja%20California%2C%20Mexico!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
      messagePlaceholder={{ en: "I'm interested in this lot...", es: "Me interesa este terreno..." }}
    />
  );
}
