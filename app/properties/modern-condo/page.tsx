"use client";
import { Bed, Bath, Square, Wifi, Dumbbell, Car, ShieldCheck } from "lucide-react";
import PropertyDetail from "../../components/PropertyDetail";

const IMAGES = [
  { src: "/images/properties/condo/1-exterior.jpg", label: { en: "Pool & Garden", es: "Alberca y Jardín" } },
  { src: "/images/properties/condo/2-bathroom.jpg", label: { en: "Bathroom", es: "Baño" } },
  { src: "/images/properties/condo/3-bedroom.jpg", label: { en: "Bedroom", es: "Recámara" } },
];

export default function ModernCondoPage() {
  return (
    <PropertyDetail
      badge={{ en: "For Rent", es: "En Renta" }}
      title={{ en: "Modern Condo", es: "Departamento Moderno" }}
      address="Playas de Rosarito, Baja California"
      images={IMAGES}
      priceLabel={{ en: "Monthly Rent · USD", es: "Renta Mensual · USD" }}
      price={{ en: "$1,800/mo", es: "$1,800/mes" }}
      priceNote={{ en: "Priced in US Dollars", es: "Precio en dólares americanos" }}
      specs={[
        { icon: Bed, val: "2", label: { en: "Bedrooms", es: "Recámaras" } },
        { icon: Bath, val: "2", label: { en: "Bathrooms", es: "Baños" } },
        { icon: Square, val: "110", label: { en: "m²", es: "m²" } },
      ]}
      description={{
        en: "A bright, low-maintenance condo in a quiet residential development in Playas de Rosarito. Ideal as a primary residence, a weekend getaway, or a turnkey rental investment.",
        es: "Un departamento luminoso y de bajo mantenimiento en un tranquilo desarrollo residencial en Playas de Rosarito. Ideal como residencia principal, escapada de fin de semana, o inversión de renta lista para operar.",
      }}
      amenities={[
        { icon: Wifi, label: { en: "High-speed internet ready", es: "Listo para internet de alta velocidad" } },
        { icon: Dumbbell, label: { en: "Shared gym & pool", es: "Gimnasio y alberca compartidos" } },
        { icon: Car, label: { en: "Assigned parking", es: "Estacionamiento asignado" } },
        { icon: ShieldCheck, label: { en: "24/7 gated security", es: "Seguridad las 24 horas" } },
      ]}
      highlights={[
        { en: "Move-in ready", es: "Listo para habitar" },
        { en: "Shared garden & common areas", es: "Jardín y áreas comunes compartidas" },
        { en: "Low HOA fees", es: "Cuotas de mantenimiento bajas" },
        { en: "5 minutes to the beach", es: "5 minutos de la playa" },
      ]}
      locationTitle={{ en: "Prime Location · Playas de Rosarito", es: "Ubicación Privilegiada · Playas de Rosarito" }}
      nearby={[
        { emoji: "🏖️", text: { en: "5 min to the beach", es: "5 min de la playa" } },
        { emoji: "🛒", text: { en: "Walking distance to supermarkets", es: "A pie de supermercados" } },
        { emoji: "🍽️", text: { en: "Close to popular restaurants", es: "Cerca de excelentes restaurantes" } },
        { emoji: "🌎", text: { en: "40 min to the US border", es: "40 min a la frontera con EE.UU." } },
      ]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110943.85506978478!2d-117.13505673203128!3d32.33292814013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b5d5cc7a3101%3A0xbf24fb6f27f22a6d!2sRosarito%2C%20Baja%20California%2C%20Mexico!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
      messagePlaceholder={{ en: "I'm interested in this condo...", es: "Me interesa este departamento..." }}
    />
  );
}
