import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "./lib/LangContext";
import { ThemeProvider } from "./lib/ThemeContext";
import SocialFloat from "./components/SocialFloat";
import RosaritoGuide from "./components/RosaritoGuide";
import EventAnnouncement from "./components/EventAnnouncement";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://elcasarosaritogroup.com"),
  title: {
    default: "El Casa Rosarito · Casas, Departamentos y Terrenos en Rosarito",
    template: "%s | El Casa Rosarito",
  },
  description:
    "Casas, departamentos y terrenos en venta y renta en Rosarito, Baja California. Agencia inmobiliaria bilingüe con licencia completa — El Casa Rosarito.",
  keywords: [
    "casas en venta Rosarito", "departamentos en renta Rosarito", "terrenos en venta Rosarito",
    "Rosarito real estate", "Rosarito homes for sale", "Baja California real estate",
    "El Casa Rosarito", "bienes raíces Rosarito", "inmobiliaria Rosarito",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "El Casa Rosarito · Casas, Departamentos y Terrenos en Rosarito",
    description: "Agencia inmobiliaria bilingüe en Rosarito, Baja California. Casas, departamentos y terrenos en venta y renta.",
    url: "https://elcasarosaritogroup.com",
    siteName: "El Casa Rosarito",
    type: "website",
    locale: "es_MX",
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "El Casa Rosarito",
  alternateName: "El Casa Rosarito Management & Development Group",
  url: "https://elcasarosaritogroup.com",
  telephone: "+52-661-125-6107",
  email: "jorgeelcasarosarito@gmail.com",
  areaServed: {
    "@type": "City",
    name: "Rosarito",
    containedInPlace: { "@type": "State", name: "Baja California" },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rosarito",
    addressRegion: "Baja California",
    addressCountry: "MX",
  },
  sameAs: ["https://www.facebook.com/share/1KXb7Lm8g9/"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}`,
          }}
        />
      </head>
      <body className="grain">
        <ThemeProvider>
          <LangProvider>
            {children}
            <SocialFloat />
            <RosaritoGuide />
            <EventAnnouncement />
          </LangProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
