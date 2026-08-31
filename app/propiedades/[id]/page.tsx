import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EasyBrokerDetail from "../../components/EasyBrokerDetail";
import { getProperty, primaryOperation, type EBPropertyDetail } from "../../lib/easybroker";
import { isOwnPropertyId, getOwnProperty, ownToDetail } from "../../lib/ownProperties";

type Props = { params: Promise<{ id: string }> };

// Own listings are mapped into the EasyBroker detail shape, so everything
// downstream (metadata, JSON-LD, the detail component) stays source-agnostic.
async function loadProperty(id: string): Promise<EBPropertyDetail | null> {
  if (isOwnPropertyId(id)) {
    const row = await getOwnProperty(id);
    return row ? ownToDetail(row) : null;
  }
  return getProperty(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await loadProperty(id);
  if (!property) return { title: "Propiedad no encontrada" };

  const op = primaryOperation(property.operations);
  const priceText = op?.formatted_amount ?? "Precio a consultar";
  const description = `${property.property_type} en ${op?.type === "rental" ? "renta" : "venta"} en ${property.location} — ${priceText}. ${property.description.slice(0, 120)}…`;

  return {
    title: `${property.title} — ${property.location}`,
    description,
    alternates: { canonical: `/propiedades/${property.public_id}` },
    openGraph: {
      title: property.title,
      description,
      images: property.property_images[0] ? [property.property_images[0].url] : [],
      type: "website",
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await loadProperty(id);
  if (!property) notFound();

  const op = primaryOperation(property.operations);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 300),
    url: `https://elcasarosaritogroup.com/propiedades/${property.public_id}`,
    image: property.property_images[0]?.url,
    address: { "@type": "PostalAddress", addressLocality: property.location, addressCountry: "MX" },
    ...(op ? { offers: { "@type": "Offer", price: String(op.amount), priceCurrency: op.currency } } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EasyBrokerDetail property={property} />
    </>
  );
}
