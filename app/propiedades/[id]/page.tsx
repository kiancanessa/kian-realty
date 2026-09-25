import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EasyBrokerDetail from "../../components/EasyBrokerDetail";
import { getProperty, primaryOperation, type EBPropertyDetail } from "../../lib/easybroker";
import { isOwnPropertyId, getOwnProperty, ownToDetail } from "../../lib/ownProperties";
import { isBolsaId, getPartnerProperty, type PartnerInfo } from "../../lib/bolsa/consume";

type Props = { params: Promise<{ id: string }> };

// Own listings — and an allied agency's, through the shared pool — are mapped
// into the EasyBroker detail shape, so everything downstream (metadata,
// JSON-LD, the detail component) stays source-agnostic.
type Loaded = { property: EBPropertyDetail; partner?: PartnerInfo };

async function loadProperty(id: string): Promise<Loaded | null> {
  if (isBolsaId(id)) {
    const found = await getPartnerProperty(id);
    return found ? { property: found.property, partner: found.partner } : null;
  }
  if (isOwnPropertyId(id)) {
    const row = await getOwnProperty(id);
    return row ? { property: ownToDetail(row) } : null;
  }
  const property = await getProperty(id);
  return property ? { property } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const loaded = await loadProperty(id);
  if (!loaded) return { title: "Propiedad no encontrada" };
  const { property, partner } = loaded;

  const op = primaryOperation(property.operations);
  const priceText = op?.formatted_amount ?? "Precio a consultar";
  const description = `${property.property_type} en ${op?.type === "rental" ? "renta" : "venta"} en ${property.location} — ${priceText}. ${property.description.slice(0, 120)}…`;

  // An allied agency's listing lives on their site: it points there as the
  // canonical page and stays out of the index, so the same house never
  // competes against itself in search results.
  if (partner) {
    return {
      title: `${property.title} — ${property.location}`,
      description,
      alternates: { canonical: property.public_url || undefined },
      robots: { index: false, follow: true },
    };
  }

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
  const loaded = await loadProperty(id);
  if (!loaded) notFound();
  const { property, partner } = loaded;

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
      <EasyBrokerDetail property={property} partner={partner} />
    </>
  );
}
