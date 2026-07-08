"use client";
import { Bed, Bath, Square, Waves, Car, Sun, ShieldCheck } from "lucide-react";
import PropertyDetail from "../../components/PropertyDetail";

const IMAGES = [
  { src: "/images/properties/villa/1-exterior.jpg", label: { en: "Pool & Exterior", es: "Alberca y Exterior" } },
  { src: "/images/properties/villa/2-living.jpg", label: { en: "Living Room", es: "Sala" } },
  { src: "/images/properties/villa/3-kitchen.jpg", label: { en: "Kitchen", es: "Cocina" } },
];

export default function OceanfrontVillaPage() {
  return (
    <PropertyDetail
      badge={{ en: "For Sale", es: "En Venta" }}
      title={{ en: "Oceanfront Villa", es: "Villa Frente al Mar" }}
      address="Rosarito Beach, Baja California"
      images={IMAGES}
      priceLabel={{ en: "Sale Price · USD", es: "Precio de Venta · USD" }}
      price={{ en: "$485,000", es: "$485,000" }}
      priceNote={{ en: "Priced in US Dollars", es: "Precio en dólares americanos" }}
      specs={[
        { icon: Bed, val: "4", label: { en: "Bedrooms", es: "Recámaras" } },
        { icon: Bath, val: "3", label: { en: "Bathrooms", es: "Baños" } },
        { icon: Square, val: "280", label: { en: "m²", es: "m²" } },
      ]}
      description={{
        en: "A striking modern villa steps from the sand, built for entertaining and coastal living. Floor-to-ceiling glass, an infinity-edge pool, and open-plan interiors make this one of Rosarito Beach's most desirable oceanfront homes.",
        es: "Una impactante villa moderna a pasos de la arena, pensada para recibir invitados y disfrutar la vida costera. Ventanales de piso a techo, alberca infinita e interiores de planta abierta hacen de esta una de las casas frente al mar más deseables de Rosarito Beach.",
      }}
      amenities={[
        { icon: Waves, label: { en: "Infinity pool", es: "Alberca infinita" } },
        { icon: Car, label: { en: "2-car garage", es: "Cochera para 2 autos" } },
        { icon: Sun, label: { en: "Rooftop terrace", es: "Terraza en azotea" } },
        { icon: ShieldCheck, label: { en: "Gated community", es: "Fraccionamiento privado" } },
      ]}
      highlights={[
        { en: "Direct beach access", es: "Acceso directo a la playa" },
        { en: "Floor-to-ceiling ocean-view windows", es: "Ventanales con vista al mar de piso a techo" },
        { en: "Fully equipped modern kitchen", es: "Cocina moderna totalmente equipada" },
        { en: "Smart home wiring throughout", es: "Cableado domótico en toda la casa" },
        { en: "24/7 gated security", es: "Seguridad privada las 24 horas" },
      ]}
      locationTitle={{ en: "Prime Location · Rosarito Beach", es: "Ubicación Privilegiada · Rosarito Beach" }}
      nearby={[
        { emoji: "🏖️", text: { en: "On the sand", es: "Sobre la arena" } },
        { emoji: "🛒", text: { en: "10 min to downtown Rosarito", es: "10 min al centro de Rosarito" } },
        { emoji: "🍽️", text: { en: "Walking distance to seafood restaurants", es: "A pie de restaurantes de mariscos" } },
        { emoji: "🌎", text: { en: "45 min to the US border", es: "45 min a la frontera con EE.UU." } },
      ]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110943.85506978478!2d-117.13505673203128!3d32.33292814013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b5d5cc7a3101%3A0xbf24fb6f27f22a6d!2sRosarito%2C%20Baja%20California%2C%20Mexico!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
      messagePlaceholder={{ en: "I'm interested in this villa...", es: "Me interesa esta villa..." }}
    />
  );
}
