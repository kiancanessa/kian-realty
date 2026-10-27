// The rental-yield calculator page, in both languages.
//
// The calculator only does arithmetic on the numbers the visitor types in. It
// carries no rates, taxes or prices of its own: the values it opens with are
// round examples, labelled as such. Only erasable TypeScript, no imports.

export type CalcContent = {
  title: string;
  h1: string;
  description: string;
  intro: string[];
  fields: {
    currency: string; price: string; closing: string; closingHint: string; rent: string; occupancy: string; occupancyHint: string;
    taxes: string; hoa: string; trust: string; insurance: string; management: string; other: string;
    inputsTitle: string; expensesTitle: string; perYear: string; perMonth: string;
  };
  results: {
    title: string; gross: string; expenses: string; net: string; grossYield: string; grossYieldHint: string;
    netYield: string; netYieldHint: string; payback: string; paybackHint: string; years: string; none: string;
    noExpenses: string; negative: string;
  };
  cta: { title: string; text: string; whatsapp: string; message: (price: string, rent: string, net: string) => string };
  faqTitle: string;
  faqs: { q: string; a: string }[];
  disclaimer: string;
  related: string;
};

export const CALC: Record<"es" | "en", CalcContent> = {
  es: {
    title: "Calculadora de rentabilidad para inversión en Rosarito",
    h1: "Calculadora de rentabilidad",
    description:
      "Calcula el rendimiento bruto y neto de una propiedad de renta en Rosarito con tus propios datos: precio, renta, ocupación y gastos. Gratis, en español e inglés.",
    intro: [
      "Escribe el precio de una propiedad, la renta que esperas y tus gastos, y mira cuánto rinde al año y en cuánto tiempo recuperarías lo invertido. Los números son tuyos: la calculadora solo hace la aritmética.",
      "Los valores con los que se abre son ejemplos redondos para que veas cómo funciona. Cámbialos por los de la propiedad que estás analizando.",
    ],
    fields: {
      currency: "Moneda", price: "Precio de compra", closing: "Costos de compra", closingHint: "Notario, impuestos, fideicomiso y demás. Suma lo que te presupuesten; pídenos el desglose de la propiedad.",
      rent: "Renta mensual esperada", occupancy: "Ocupación (%)", occupancyHint: "Porcentaje del año que estaría rentada.",
      taxes: "Predial", hoa: "Cuota de mantenimiento", trust: "Cuota anual del fideicomiso", insurance: "Seguro", management: "Administración (% de la renta cobrada)", other: "Otros gastos",
      inputsTitle: "Tus datos", expensesTitle: "Gastos", perYear: "al año", perMonth: "al mes",
    },
    results: {
      title: "Resultado", gross: "Ingreso anual por renta", expenses: "Gastos anuales", net: "Ingreso neto anual",
      grossYield: "Rendimiento bruto", grossYieldHint: "Ingreso anual por renta ÷ precio",
      netYield: "Rendimiento neto", netYieldHint: "Ingreso neto ÷ (precio + costos de compra)",
      payback: "Años para recuperar la inversión", paybackHint: "(precio + costos de compra) ÷ ingreso neto", years: "años", none: "—",
      noExpenses: "Aún no pusiste gastos: el rendimiento neto se ve más alto de lo que sería. Completa predial, cuota de mantenimiento, fideicomiso, seguro y administración.",
      negative: "Con estos datos los gastos superan el ingreso: la propiedad no se pagaría sola.",
    },
    cta: {
      title: "¿Quieres analizar una propiedad real?",
      text: "Cuéntanos cuál estás evaluando y te ayudamos a completar los números con datos reales.",
      whatsapp: "Escribir por WhatsApp",
      message: (price, rent, net) => `Hola, usé la calculadora de rentabilidad (precio ${price}, renta mensual ${rent}, rendimiento neto ${net}) y me gustaría analizar una propiedad.`,
    },
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Qué es el rendimiento bruto y el neto?", a: "El bruto compara lo que cobras de renta en un año con el precio de la propiedad. El neto descuenta antes los gastos y compara lo que realmente te queda con todo lo que invertiste (precio más costos de compra)." },
      { q: "¿Qué ocupación debo usar?", a: "Depende del tipo de renta y de la zona. Usa un valor prudente y prueba varios (bajo, medio y alto) para ver cuánto cambia el resultado." },
      { q: "¿Qué gastos se olvidan con más frecuencia?", a: "El predial, la cuota de mantenimiento, la cuota anual del fideicomiso, el seguro, la administración y el mantenimiento y las reparaciones. Ponlos todos para que el rendimiento neto sea realista." },
    ],
    disclaimer: "Es una simulación con los datos que tú escribes. No es una oferta, asesoría financiera ni garantía de rendimiento: las rentas, la ocupación y los gastos reales pueden ser distintos.",
    related: "También te puede interesar",
  },
  en: {
    title: "Rosarito rental yield calculator",
    h1: "Rental yield calculator",
    description:
      "Work out the gross and net yield of a rental property in Rosarito with your own numbers: price, rent, occupancy and expenses. Free, in English and Spanish.",
    intro: [
      "Enter a property's price, the rent you expect and your expenses, and see what it yields per year and how long it would take to recover what you invested. The numbers are yours: the calculator only does the arithmetic.",
      "The values it opens with are round examples so you can see how it works. Replace them with those of the property you are looking at.",
    ],
    fields: {
      currency: "Currency", price: "Purchase price", closing: "Purchase costs", closingHint: "Notary, taxes, trust and the rest. Add up what you are quoted; ask us for the breakdown for the property.",
      rent: "Expected monthly rent", occupancy: "Occupancy (%)", occupancyHint: "Share of the year it would be rented.",
      taxes: "Property tax", hoa: "Maintenance fee", trust: "Annual trust fee", insurance: "Insurance", management: "Management (% of rent collected)", other: "Other expenses",
      inputsTitle: "Your numbers", expensesTitle: "Expenses", perYear: "per year", perMonth: "per month",
    },
    results: {
      title: "Result", gross: "Annual rental income", expenses: "Annual expenses", net: "Annual net income",
      grossYield: "Gross yield", grossYieldHint: "Annual rental income ÷ price",
      netYield: "Net yield", netYieldHint: "Net income ÷ (price + purchase costs)",
      payback: "Years to recover the investment", paybackHint: "(price + purchase costs) ÷ net income", years: "years", none: "—",
      noExpenses: "You have not entered any expenses yet: the net yield looks higher than it would be. Fill in property tax, maintenance fee, trust, insurance and management.",
      negative: "With these numbers expenses exceed income: the property would not pay for itself.",
    },
    cta: {
      title: "Want to analyze a real property?",
      text: "Tell us which one you are evaluating and we will help you fill in the numbers with real data.",
      whatsapp: "Message us on WhatsApp",
      message: (price, rent, net) => `Hi, I used the rental yield calculator (price ${price}, monthly rent ${rent}, net yield ${net}) and I'd like to analyze a property.`,
    },
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What are gross and net yield?", a: "Gross compares a year of rent with the price of the property. Net first subtracts expenses and then compares what is actually left with everything you put in (price plus purchase costs)." },
      { q: "Which occupancy should I use?", a: "It depends on the type of rental and the area. Use a prudent value and try several (low, medium and high) to see how much the result changes." },
      { q: "Which expenses are most often forgotten?", a: "Property tax, maintenance fee, the trust's annual fee, insurance, management, and upkeep and repairs. Include them all so that the net yield is realistic." },
    ],
    disclaimer: "This is a simulation with the numbers you enter. It is not an offer, financial advice or a guarantee of returns: actual rents, occupancy and expenses may differ.",
    related: "You may also like",
  },
};
