"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "../lib/LangContext";
import { pagePath } from "../lib/seoSlugs";

const TEXT = {
  es: {
    title: "¿Cuánto rendiría esta propiedad?",
    withRent: "Abre la calculadora con el precio y la renta publicados de esta propiedad ya puestos. Ajusta la ocupación y los gastos y mira cuánto te quedaría al año.",
    noRent: "Abre la calculadora con el precio de esta propiedad ya puesto, agrega la renta que esperas y mira cuánto te quedaría al año.",
    cta: "Calcular rendimiento",
  },
  en: {
    title: "What would this property yield?",
    withRent: "Open the calculator with this property's listed price and rent already filled in. Adjust the occupancy and the expenses and see what you would keep each year.",
    noRent: "Open the calculator with this property's price already filled in, add the rent you expect and see what you would keep each year.",
    cta: "Calculate the yield",
  },
} as const;

/** At the end of a property for sale: the calculator, opened with this
 *  property's own numbers. A property listed for rent only has no purchase
 *  price to work from, so the page does not show this for those. */
export default function PropertyReturnCard({ id, price, currency, rent }: { id: string; price: number; currency: string; rent: number | null }) {
  const { locale } = useLang();
  const t = TEXT[locale];
  const query = new URLSearchParams({ price: String(Math.round(price)), ref: id });
  if (currency === "USD" || currency === "MXN") query.set("currency", currency);
  if (rent) query.set("rent", String(Math.round(rent)));

  return (
    <section aria-labelledby="return-card-title" style={{ padding: "0 24px 64px", background: "rgb(var(--bg))" }}>
      <div className="ib ib--single">
        <div className="ib-copy">
          <h2 id="return-card-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.7rem, 3vw, 2.3rem)", lineHeight: 1.15, color: "rgb(var(--ink))", margin: "0 0 12px" }}>{t.title}</h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "rgba(var(--ink),0.72)", maxWidth: 560, margin: "0 0 22px" }}>{rent ? t.withRent : t.noRent}</p>
          <Link href={`${pagePath("calculadora-rentabilidad", locale)}?${query.toString()}`} data-cta="calc-property" className="ib-cta">
            {t.cta} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
