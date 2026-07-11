import type { Metadata } from "next";
import PropertyDetail from "../../components/PropertyDetail";

const IMAGES = [
  { src: "/images/properties/getaway/1-exterior.jpg", label: { en: "Infinity Pool", es: "Alberca Infinita" } },
  { src: "/images/properties/getaway/2-living.jpg", label: { en: "Living Room", es: "Sala" } },
  { src: "/images/properties/getaway/3-bedroom.jpg", label: { en: "Bedroom", es: "Recámara" } },
];

export const metadata: Metadata = {
  title: "Beachfront House for Sale in Popotla, Rosarito",
  description: "3-bed, 2-bath beachfront home for sale in Popotla, Rosarito — $320,000. Infinity pool, unobstructed Pacific views, recently renovated. Contact El Casa Rosarito.",
  alternates: { canonical: "/properties/beachfront-getaway" },
  openGraph: {
    title: "Beachfront House for Sale in Popotla, Rosarito",
    description: "3-bed, 2-bath beachfront home in Popotla — $320,000. Unobstructed Pacific views.",
    images: ["/images/properties/getaway/1-exterior.jpg"],
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: "Beachfront Getaway, Popotla, Rosarito",
  description: "3-bed, 2-bath beachfront home for sale in Popotla, Rosarito, Baja California with an infinity pool and unobstructed Pacific views.",
  url: "https://elcasarosaritogroup.com/properties/beachfront-getaway",
  image: "https://elcasarosaritogroup.com/images/properties/getaway/1-exterior.jpg",
  address: { "@type": "PostalAddress", addressLocality: "Popotla, Rosarito", addressRegion: "Baja California", addressCountry: "MX" },
  offers: { "@type": "Offer", price: "320000", priceCurrency: "USD" },
};

export default function BeachfrontGetawayPage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    <PropertyDetail
      badge={{ en: "Hot Deal", es: "Oferta" }}
      title={{ en: "Beachfront Getaway", es: "Escape Frente a la Playa" }}
      address="Popotla, Rosarito, Baja California"
      images={IMAGES}
      priceLabel={{ en: "Sale Price · USD", es: "Precio de Venta · USD" }}
      price={{ en: "$320,000", es: "$320,000" }}
      priceNote={{ en: "Priced in US Dollars", es: "Precio en dólares americanos" }}
      specs={[
        { icon: "bed", val: "3", label: { en: "Bedrooms", es: "Recámaras" } },
        { icon: "bath", val: "2", label: { en: "Bathrooms", es: "Baños" } },
        { icon: "square", val: "200", label: { en: "m²", es: "m²" } },
      ]}
      description={{
        en: "Tucked into the quiet fishing village of Popotla, this beachfront home pairs a relaxed getaway feel with genuinely modern finishes — an infinity pool, sun terrace, and unobstructed Pacific views make it a standout value at this price point.",
        es: "Ubicada en el tranquilo pueblo pesquero de Popotla, esta casa frente al mar combina un ambiente relajado de escape con acabados verdaderamente modernos — alberca infinita, terraza y vista despejada al Pacífico la convierten en una excelente oportunidad a este precio.",
      }}
      amenities={[
        { icon: "waves", label: { en: "Infinity pool", es: "Alberca infinita" } },
        { icon: "car", label: { en: "Private driveway parking", es: "Estacionamiento privado" } },
        { icon: "flame", label: { en: "Outdoor fire pit", es: "Fogatero exterior" } },
      ]}
      highlights={[
        { en: "Unobstructed Pacific Ocean views", es: "Vista despejada al Océano Pacífico" },
        { en: "Recently renovated interiors", es: "Interiores recientemente renovados" },
        { en: "Quiet fishing-village setting", es: "Entorno tranquilo de pueblo pesquero" },
        { en: "Great value for the price point", es: "Excelente valor por el precio" },
      ]}
      locationTitle={{ en: "Prime Location · Popotla", es: "Ubicación Privilegiada · Popotla" }}
      nearby={[
        { emoji: "🎣", text: { en: "Steps from the fishing pier", es: "A pasos del muelle pesquero" } },
        { emoji: "🍽️", text: { en: "Home to Rosarito's best lobster spots", es: "Los mejores lugares de langosta de Rosarito" } },
        { emoji: "🚗", text: { en: "25 min to downtown Rosarito", es: "25 min al centro de Rosarito" } },
        { emoji: "🌎", text: { en: "50 min to the US border", es: "50 min a la frontera con EE.UU." } },
      ]}
      mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110943.85506978478!2d-117.13505673203128!3d32.33292814013765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d8b5d5cc7a3101%3A0xbf24fb6f27f22a6d!2sRosarito%2C%20Baja%20California%2C%20Mexico!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
      messagePlaceholder={{ en: "I'm interested in this home...", es: "Me interesa esta casa..." }}
    />
    </>
  );
}
