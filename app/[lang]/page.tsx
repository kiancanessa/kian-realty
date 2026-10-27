import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import HomePage from "../components/HomePage";
import { isLang, LANGS } from "../lib/seoSlugs";

// Same inventory as the home page, refreshed on the same schedule.
export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LANGS.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== "es") return {};
  return {
    title: { absolute: "El Casa Rosarito · Casas, Departamentos y Terrenos en Venta y Renta en Rosarito" },
    description:
      "Casas, departamentos y terrenos en venta y renta en Rosarito, Baja California. Agencia inmobiliaria bilingüe con licencia completa — El Casa Rosarito.",
    alternates: { canonical: "/es", languages: { en: "/", es: "/es", "x-default": "/" } },
    openGraph: {
      title: "El Casa Rosarito · Casas, Departamentos y Terrenos en Rosarito",
      description: "Agencia inmobiliaria bilingüe en Rosarito, Baja California. Casas, departamentos y terrenos en venta y renta.",
      url: "https://elcasarosaritogroup.com/es",
      siteName: "El Casa Rosarito",
      type: "website",
      locale: "es_MX",
      alternateLocale: ["en_US"],
    },
  };
}

export default async function LocalizedHome({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  // The English home is "/": one address per page, not two copies.
  if (lang === "en") permanentRedirect("/");
  return <HomePage />;
}
