// The rental-yield calculator page, in both languages.
//
// The calculator only does arithmetic on the numbers the visitor sets. It
// carries no rates, taxes or prices of its own: the values it opens with are
// round examples, labelled as such. Only erasable TypeScript, no imports.

export type ExpenseKey = "taxes" | "hoa" | "trust" | "insurance" | "management" | "other";

export type CalcContent = {
  title: string;
  h1: string;
  description: string;
  intro: string[];
  currencyNote: string;
  steps: { property: string; propertyHint: string; rent: string; rentHint: string; expenses: string; expensesHint: string };
  fields: {
    currency: string; price: string; closing: string; closingHint: string; rent: string; occupancy: string; occupancyHint: string;
    taxes: string; hoa: string; trust: string; insurance: string; management: string; other: string;
    perYear: string; perMonth: string;
  };
  /** The result in one plain sentence. `keep` is out of every 100 collected; `years` is null when the investment is not recovered. */
  summary: { kept: (keep: string, years: string | null) => string; empty: string };
  donut: { title: string; sub: string; center: string; net: string; categories: Record<ExpenseKey, string>; aria: (keep: string) => string };
  kpi: { netIncome: string; netYield: string; netYieldHint: string; payback: string; paybackHint: string; years: string; none: string };
  timeline: {
    title: string; sub: string; invested: string; recovered: string; year: string; explore: string;
    readout: (year: number, amount: string, pct: string) => string; badge: (year: number) => string;
    never: string; needPrice: string; aria: (years: string) => string; legendNot: string; legendYes: string;
  };
  warnings: { noExpenses: string; negative: string };
  mini: { yield: string; payback: string; see: string };
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
      "Calcula con controles deslizables cuánto rinde una propiedad de renta en Rosarito y en cuántos años recuperas tu inversión. Gráficas claras, gratis, en español e inglés.",
    intro: [
      "Mueve los controles y mira, al instante, cuánto te dejaría una propiedad de renta al año y en cuánto tiempo recuperarías lo invertido. Los números son tuyos: la calculadora solo hace la aritmética.",
      "Los valores con los que se abre son ejemplos redondos para que veas cómo funciona. Cámbialos por los de la propiedad que estás analizando.",
    ],
    currencyNote: "La moneda solo cambia el símbolo: escribe tus cifras en la moneda que elijas.",
    steps: {
      property: "La propiedad", propertyHint: "¿Cuánto cuesta y cuánto sumarías en costos de compra?",
      rent: "La renta", rentHint: "¿Cuánto cobrarías al mes y qué parte del año estaría rentada?",
      expenses: "Los gastos", expensesHint: "Opcional, pero hace el resultado más real. Si no los sabes, déjalos en 0.",
    },
    fields: {
      currency: "Moneda", price: "Precio de compra", closing: "Costos de compra", closingHint: "Notario, impuestos, fideicomiso y demás. Pídenos el desglose de la propiedad.",
      rent: "Renta mensual", occupancy: "Ocupación", occupancyHint: "Parte del año que estaría rentada.",
      taxes: "Predial", hoa: "Cuota de mantenimiento", trust: "Fideicomiso", insurance: "Seguro", management: "Administración", other: "Otros gastos",
      perYear: "al año", perMonth: "al mes",
    },
    summary: {
      kept: (keep, years) => `De cada 100 que cobras de renta, te quedan ${keep}.${years ? ` Recuperarías tu inversión en unos ${years} años.` : ""}`,
      empty: "Escribe el precio y la renta para ver el resultado.",
    },
    donut: {
      title: "¿A dónde va la renta?", sub: "Reparto de lo que cobras en un año", center: "de la renta es tuyo", net: "Te queda a ti",
      categories: { taxes: "Predial", hoa: "Cuota de mantenimiento", trust: "Fideicomiso", insurance: "Seguro", management: "Administración", other: "Otros" },
      aria: keep => `De cada 100 que cobras de renta, te quedan ${keep}.`,
    },
    kpi: {
      netIncome: "Te queda al año", netYield: "Rendimiento neto", netYieldHint: "lo que te queda ÷ lo que invertiste",
      payback: "Recuperas en", paybackHint: "lo que invertiste ÷ lo que te queda al año", years: "años", none: "—",
    },
    timeline: {
      title: "¿Cuándo recuperas tu inversión?", sub: "Lo que llevas acumulado cada año, frente a lo que invertiste",
      invested: "Lo que invertiste", recovered: "Ya recuperado", year: "Año", explore: "Explora año por año",
      readout: (year, amount, pct) => `En el año ${year} llevas ${amount} acumulados: ${pct} de lo que invertiste.`,
      badge: year => `Año ${year}`,
      never: "Con estos números la inversión no se recupera: los gastos igualan o superan la renta.",
      needPrice: "Pon el precio de la propiedad para ver cuándo recuperas tu inversión.",
      aria: years => `Gráfica de barras: lo que acumulas cada año frente a lo que invertiste. ${years}`,
      legendNot: "Aún no recuperado", legendYes: "Ya recuperado y ganancia",
    },
    warnings: {
      noExpenses: "Aún no pusiste gastos: el resultado se ve más alto de lo que sería. Agrega predial, cuota de mantenimiento, fideicomiso, seguro y administración.",
      negative: "Con estos datos los gastos superan el ingreso: la propiedad no se pagaría sola.",
    },
    mini: { yield: "Rendimiento neto", payback: "Recuperas en", see: "Ver resultado" },
    cta: {
      title: "¿Quieres analizar una propiedad real?",
      text: "Cuéntanos cuál estás evaluando y te ayudamos a completar los números con datos reales.",
      whatsapp: "Escribir por WhatsApp",
      message: (price, rent, net) => `Hola, usé la calculadora de rentabilidad (precio ${price}, renta mensual ${rent}, rendimiento neto ${net}) y me gustaría analizar una propiedad.`,
    },
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Qué es el rendimiento neto?", a: "Es lo que te queda al año, después de pagar los gastos, comparado con todo lo que invertiste (el precio más los costos de compra). Si invertiste 100 y te quedan 6 al año, el rendimiento neto es 6 %." },
      { q: "¿Qué ocupación debo usar?", a: "Depende del tipo de renta y de la zona. Usa un valor prudente y prueba varios (bajo, medio y alto) para ver cuánto cambia el resultado." },
      { q: "¿Qué gastos se olvidan con más frecuencia?", a: "El predial, la cuota de mantenimiento, la cuota anual del fideicomiso, el seguro, la administración y el mantenimiento y las reparaciones. Ponlos todos para que el resultado sea realista." },
    ],
    disclaimer: "Es una simulación con los datos que tú escribes. No es una oferta, asesoría financiera ni garantía de rendimiento: las rentas, la ocupación y los gastos reales pueden ser distintos.",
    related: "También te puede interesar",
  },
  en: {
    title: "Rosarito rental yield calculator",
    h1: "Rental yield calculator",
    description:
      "Use simple sliders to see what a rental property in Rosarito yields and how many years it takes to recover your investment. Clear charts, free, in English and Spanish.",
    intro: [
      "Move the sliders and see, instantly, what a rental property would leave you each year and how long it would take to recover what you invested. The numbers are yours: the calculator only does the arithmetic.",
      "The values it opens with are round examples so you can see how it works. Replace them with those of the property you are looking at.",
    ],
    currencyNote: "The currency only changes the symbol: enter your figures in the currency you choose.",
    steps: {
      property: "The property", propertyHint: "How much does it cost and how much would you add in purchase costs?",
      rent: "The rent", rentHint: "How much would you charge per month and how much of the year would it be rented?",
      expenses: "The expenses", expensesHint: "Optional, but it makes the result more real. If you do not know them, leave them at 0.",
    },
    fields: {
      currency: "Currency", price: "Purchase price", closing: "Purchase costs", closingHint: "Notary, taxes, trust and the rest. Ask us for the breakdown for the property.",
      rent: "Monthly rent", occupancy: "Occupancy", occupancyHint: "Share of the year it would be rented.",
      taxes: "Property tax", hoa: "Maintenance fee", trust: "Trust", insurance: "Insurance", management: "Management", other: "Other expenses",
      perYear: "per year", perMonth: "per month",
    },
    summary: {
      kept: (keep, years) => `Of every 100 you collect in rent, you keep ${keep}.${years ? ` You would recover your investment in about ${years} years.` : ""}`,
      empty: "Enter the price and the rent to see the result.",
    },
    donut: {
      title: "Where does the rent go?", sub: "How a year of rent is split", center: "of the rent is yours", net: "You keep",
      categories: { taxes: "Property tax", hoa: "Maintenance fee", trust: "Trust", insurance: "Insurance", management: "Management", other: "Other" },
      aria: keep => `Of every 100 you collect in rent, you keep ${keep}.`,
    },
    kpi: {
      netIncome: "You keep per year", netYield: "Net yield", netYieldHint: "what you keep ÷ what you invested",
      payback: "You recover in", paybackHint: "what you invested ÷ what you keep per year", years: "years", none: "—",
    },
    timeline: {
      title: "When do you recover your investment?", sub: "What you have accumulated each year, against what you invested",
      invested: "What you invested", recovered: "Already recovered", year: "Year", explore: "Explore year by year",
      readout: (year, amount, pct) => `By year ${year} you have accumulated ${amount}: ${pct} of what you invested.`,
      badge: year => `Year ${year}`,
      never: "With these numbers the investment is not recovered: expenses equal or exceed the rent.",
      needPrice: "Enter the property's price to see when you recover your investment.",
      aria: years => `Bar chart: what you accumulate each year against what you invested. ${years}`,
      legendNot: "Not yet recovered", legendYes: "Recovered and profit",
    },
    warnings: {
      noExpenses: "You have not entered any expenses yet: the result looks higher than it would be. Add property tax, maintenance fee, trust, insurance and management.",
      negative: "With these numbers expenses exceed income: the property would not pay for itself.",
    },
    mini: { yield: "Net yield", payback: "You recover in", see: "See result" },
    cta: {
      title: "Want to analyze a real property?",
      text: "Tell us which one you are evaluating and we will help you fill in the numbers with real data.",
      whatsapp: "Message us on WhatsApp",
      message: (price, rent, net) => `Hi, I used the rental yield calculator (price ${price}, monthly rent ${rent}, net yield ${net}) and I'd like to analyze a property.`,
    },
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "What is net yield?", a: "It is what you keep each year after paying the expenses, compared with everything you invested (the price plus purchase costs). If you invested 100 and keep 6 a year, the net yield is 6%." },
      { q: "Which occupancy should I use?", a: "It depends on the type of rental and the area. Use a prudent value and try several (low, medium and high) to see how much the result changes." },
      { q: "Which expenses are most often forgotten?", a: "Property tax, maintenance fee, the trust's annual fee, insurance, management, and upkeep and repairs. Include them all so that the result is realistic." },
    ],
    disclaimer: "This is a simulation with the numbers you enter. It is not an offer, financial advice or a guarantee of returns: actual rents, occupancy and expenses may differ.",
    related: "You may also like",
  },
};
