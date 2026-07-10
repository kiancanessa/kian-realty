import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "./lib/LangContext";
import SocialFloat from "./components/SocialFloat";

export const metadata: Metadata = {
  title: "El Casa Rosarito · Real Estate",
  description:
    "Premium real estate in Rosarito and along the Baja California coast. Buy, sell, rent, or invest with El Casa Rosarito — your bilingual local agency.",
  keywords: ["Rosarito real estate", "Rosarito homes", "Mexico beach property", "Baja California real estate", "El Casa Rosarito"],
  openGraph: {
    title: "El Casa Rosarito · Real Estate",
    description: "Premium coastal properties in Rosarito. Buy, sell, rent, or invest with a bilingual local agency.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        <LangProvider>{children}</LangProvider>
        <SocialFloat />
      </body>
    </html>
  );
}
