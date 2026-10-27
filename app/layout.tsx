import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "./lib/LangContext";
import { ThemeProvider } from "./lib/ThemeContext";
import { FavoritesProvider } from "./lib/FavoritesContext";
import { QuizProvider } from "./lib/QuizContext";
import PublicWidgets from "./components/PublicWidgets";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsScripts from "./components/AnalyticsScripts";

export const metadata: Metadata = {
  metadataBase: new URL("https://elcasarosaritogroup.com"),
  // "/" is the English site (and the x-default); the Spanish one is "/es" and
  // has its own title and description, see app/[lang]/page.tsx.
  title: {
    default: "El Casa Rosarito · Homes, Condos & Land for Sale in Rosarito, Baja California",
    template: "%s | El Casa Rosarito",
  },
  description:
    "Homes, condos and land for sale and rent in Rosarito, Baja California. Bilingual, fully licensed real estate agency — El Casa Rosarito.",
  keywords: [
    "casas en venta Rosarito", "departamentos en renta Rosarito", "terrenos en venta Rosarito",
    "Rosarito real estate", "Rosarito homes for sale", "Baja California real estate",
    "El Casa Rosarito", "bienes raíces Rosarito", "inmobiliaria Rosarito",
  ],
  alternates: { canonical: "/", languages: { en: "/", es: "/es", "x-default": "/" } },
  robots: { index: true, follow: true },
  // Search Console ownership tag. Not needed if the domain is verified through DNS.
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
  openGraph: {
    title: "El Casa Rosarito · Homes, Condos & Land for Sale in Rosarito, Baja California",
    description: "Bilingual real estate agency in Rosarito, Baja California. Homes, condos and land for sale and rent.",
    url: "https://elcasarosaritogroup.com",
    siteName: "El Casa Rosarito",
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_MX"],
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
    streetAddress: "Local 19 Módulo A, Quinta Plaza",
    addressLocality: "Playas de Rosarito",
    addressRegion: "Baja California",
    postalCode: "22703",
    addressCountry: "MX",
  },
  geo: { "@type": "GeoCoordinates", latitude: 32.3482054, longitude: -117.0618127 },
  hasMap: "https://maps.app.goo.gl/Qp3g7CKCrx1EC82Z8",
  knowsLanguage: ["es", "en"],
  sameAs: ["https://www.facebook.com/share/1KXb7Lm8g9/", "https://maps.app.goo.gl/Qp3g7CKCrx1EC82Z8"],
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
            // `js` lets CSS hide what JS will animate in, and only then.
            __html: `document.documentElement.classList.add('js');`
              + `try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}`
              // Decide before first paint whether the opening animation plays:
              // once per session, and never for reduced motion.
              + `try{var r=document.documentElement;if(sessionStorage.getItem('introSeen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('no-intro');}else{sessionStorage.setItem('introSeen','1');r.classList.add('intro-lock');}}catch(e){document.documentElement.classList.add('no-intro');}`,
          }}
        />
      </head>
      <body className="grain">
        <ThemeProvider>
          <LangProvider>
            <FavoritesProvider>
              <QuizProvider>
                {children}
                <PublicWidgets />
              </QuizProvider>
            </FavoritesProvider>
          </LangProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
