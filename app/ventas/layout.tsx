import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades vendidas en Rosarito",
  description: "Casas, departamentos y terrenos que hemos vendido en Rosarito y la costa de Baja California. Resultados reales de El Casa Rosarito.",
  alternates: { canonical: "/ventas" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
