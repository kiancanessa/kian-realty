import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desarrollo y construcción en Rosarito",
  description: "Diseño arquitectónico, construcción y remodelación en Rosarito, B.C. Proyectos completados por El Casa Rosarito, del primer plano a la entrega de llaves.",
  alternates: { canonical: "/desarrollo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
