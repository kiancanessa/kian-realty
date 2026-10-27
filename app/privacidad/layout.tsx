import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Cómo El Casa Rosarito recaba, usa y protege tus datos personales, y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
