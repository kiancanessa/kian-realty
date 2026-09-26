import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EasyBrokerDetail from "../../components/EasyBrokerDetail";
import { getProperty, primaryOperation, type EBPropertyDetail } from "../../lib/easybroker";
import { isOwnPropertyId, getOwnProperty, ownToDetail } from "../../lib/ownProperties";
import { isBolsaId, getPartnerProperty } from "../../lib/bolsa/consume";

type Props = { params: Promise<{ id: string }> };

// Own listings — and an allied agency's, through the shared pool — are mapped
// into the EasyBroker detail shape, so everything downstream (metadata,
// JSON-LD, the detail component) stays source-agnostic.
type Loaded = { property: EBPropertyDetail; fromPartner?: boolean };

async function loadProperty(id: string): Promise<Loaded | null> {
  if (isBolsaId(id)) {
    const property = await getPartnerProperty(id);
    return property ? { property, fromPartner: true } : null;
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
  const { property, fromPartner } = loaded;

  const op = primaryOperation(property.operations);
  const priceText = op?.formatted_amount ?? "Precio a consultar";
  const description = `${property.property_type} en ${op?.type === "rental" ? "renta" : "venta"} en ${property.location} — ${priceText}. ${property.description.slice(0, 120)}…`;

  return {
    title: `${property.title} — ${property.location}`,
    description,
    alternates: { canonical: `/propiedades/${property.public_id}` },
    // An allied agency's listing is shown here as part of our catalogue, but
    // the same house is on its owner's site and on the third ally's too: kept
    // out of the index so the three sites never compete for it in search.
    ...(fromPartner ? { robots: { index: false, follow: true } } : {}),
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
  const { property } = loaded;

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
