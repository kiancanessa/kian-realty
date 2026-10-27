// The search pages: one per thing people look for, in both languages, each
// filled from the live inventory.
//
// The copy states only what is true of every listing or of the business. It
// says nothing about the character of a neighbourhood, prices or tax rates:
// those change, or need the agency's own word. The numbers on a page (how many
// properties, of which kind) are counted from the inventory each hour.
import type { PropertyCard } from "./easybroker";
import type { Lang, PageKey } from "./seoSlugs";

export type Faq = { q: string; a: string };
export type Copy = { title: string; h1: string; description: string; intro: string[]; faqs: Faq[] };
export type LandingKey = Exclude<PageKey, "guia">;

export type Landing = {
  key: LandingKey;
  kind: "topic" | "zone";
  matches: (c: PropertyCard) => boolean;
  copy: Record<Lang, Copy>;
  related: PageKey[];
  /** Shows the "what would it yield" callout: for pages about buying a place that could be rented out. */
  invest?: boolean;
};

const isSale = (c: PropertyCard) => c.operation === "sale";
const SEAFRONT = /frente al mar|frente a la playa|frente al oc[eé]ano|oceanfront|beachfront|ocean ?front/i;

// ── Questions that come up on almost every page ─────────────────────────────
const FOREIGN: Record<Lang, Faq> = {
  es: {
    q: "¿Puede un extranjero comprar propiedad en Rosarito?",
    a: "Sí. Rosarito está dentro de la zona restringida (hasta 50 km de la costa), donde los extranjeros adquieren la propiedad a través de un fideicomiso bancario, que les permite usarla, rentarla, venderla y heredarla. Lo explicamos paso a paso en nuestra guía.",
  },
  en: {
    q: "Can a foreigner buy property in Rosarito?",
    a: "Yes. Rosarito sits inside Mexico's restricted zone (within 50 km of the coast), where foreigners hold property through a bank trust (fideicomiso), which lets them use, rent, sell and leave the property to heirs. We explain it step by step in our guide.",
  },
};
const BILINGUAL: Record<Lang, Faq> = {
  es: { q: "¿Me atienden en inglés?", a: "Sí. Somos una agencia bilingüe: te atendemos en español o en inglés durante todo el proceso." },
  en: { q: "Do you work in English?", a: "Yes. We are a bilingual agency: we help you in English or Spanish through the whole process." },
};

// ── What people search for ──────────────────────────────────────────────────
const TOPICS: Landing[] = [
  {
    key: "casas",
    kind: "topic",
    matches: c => isSale(c) && c.type === "house" && !/edificio|local/i.test(c.propertyType),
    related: ["condominios", "terrenos", "frente-al-mar", "asesoria-legal", "guia"],
    invest: true,
    copy: {
      es: {
        title: "Casas en venta en Rosarito, B.C.",
        h1: "Casas en venta en Rosarito",
        description: "Casas en venta en Rosarito, Baja California, con fotos, precio y ubicación. Agencia inmobiliaria bilingüe con licencia: te atendemos en español e inglés.",
        intro: [
          "Estas son las casas que tenemos en venta en Playas de Rosarito y sus alrededores, tomadas de nuestro inventario y actualizadas cada hora. Cada ficha incluye fotos, precio, superficie y ubicación, y puedes escribirnos por WhatsApp desde la propiedad que te interese.",
          "Somos una agencia bilingüe: te atendemos en español e inglés desde la primera visita hasta la firma. Si vienes de fuera de México, te orientamos sobre cómo funciona la compra en la zona costera y sobre los pasos con notario, avalúo y trámites.",
          "Si todavía no sabes qué buscas, cuéntanos tu presupuesto y lo que necesitas, y te enviamos opciones que se ajusten. También puedes ver todo el inventario con filtros en nuestro buscador.",
        ],
        faqs: [
          FOREIGN.es,
          { q: "¿Cuánto cuesta comprar, además del precio de la casa?", a: "Además del precio hay gastos de escrituración e impuestos que dependen del valor de la propiedad y de la forma de adquirirla. Antes de que hagas una oferta te damos el cálculo para la casa concreta que te interese." },
          { q: "¿Cómo agendo una visita?", a: "Escríbenos por WhatsApp desde la ficha de la propiedad, o por el formulario de contacto, y coordinamos una visita." },
          BILINGUAL.es,
        ],
      },
      en: {
        title: "Homes for sale in Rosarito, Mexico",
        h1: "Homes for sale in Rosarito",
        description: "Homes for sale in Rosarito, Baja California, with photos, price and location. Licensed bilingual real estate agency: we help you in English and Spanish.",
        intro: [
          "These are the homes we have for sale in Playas de Rosarito and the surrounding area, taken from our inventory and refreshed every hour. Each listing shows photos, price, size and location, and you can message us on WhatsApp from the property you like.",
          "We are a bilingual agency: we work with you in English and Spanish from the first visit to the signing. If you are coming from outside Mexico, we explain how buying works along the coast and walk you through the notary, appraisal and paperwork.",
          "If you are not sure what you want yet, tell us your budget and what matters to you and we will send options that fit. You can also browse the whole inventory with filters in our search.",
        ],
        faqs: [
          FOREIGN.en,
          { q: "What does it cost to buy, on top of the price of the home?", a: "On top of the price there are closing costs and taxes that depend on the value of the property and on how it is acquired. Before you make an offer we give you the calculation for the specific home you are considering." },
          { q: "How do I schedule a visit?", a: "Message us on WhatsApp from the property page, or use the contact form, and we will arrange a visit." },
          BILINGUAL.en,
        ],
      },
    },
  },
  {
    key: "condominios",
    kind: "topic",
    matches: c => isSale(c) && c.type === "apartment",
    related: ["frente-al-mar", "casas", "rentas", "calculadora-rentabilidad", "asesoria-legal", "guia"],
    invest: true,
    copy: {
      es: {
        title: "Condominios y departamentos en venta en Rosarito",
        h1: "Condominios y departamentos en venta en Rosarito",
        description: "Condominios y departamentos en venta en Rosarito, Baja California. Fotos, precios y ubicación. Agencia bilingüe con licencia, en español e inglés.",
        intro: [
          "Aquí encuentras los condominios y departamentos que tenemos en venta en Playas de Rosarito, actualizados cada hora desde nuestro inventario. Muchos están en desarrollos con amenidades como alberca, gimnasio o seguridad; en cada ficha vemos qué incluye.",
          "Antes de decidir, conviene revisar el reglamento del condominio, la cuota de mantenimiento y qué cubre, y si el inmueble está al corriente de sus pagos. Te ayudamos a pedir esos documentos y a leerlos contigo.",
          "Atendemos en español y en inglés, y si vienes de fuera de México te explicamos cómo funciona la compra en la zona costera.",
        ],
        faqs: [
          { q: "¿Qué debo revisar antes de comprar un condominio?", a: "El régimen de propiedad en condominio y su reglamento, el monto y lo que cubre la cuota de mantenimiento, que el inmueble esté al corriente de pagos, y las reglas sobre rentarlo." },
          { q: "¿Puedo rentar mi condominio?", a: "Depende del reglamento del condominio. Revísalo antes de comprar si piensas rentarlo; te ayudamos a confirmarlo." },
          FOREIGN.es,
          BILINGUAL.es,
        ],
      },
      en: {
        title: "Condos for sale in Rosarito, Mexico",
        h1: "Condos and apartments for sale in Rosarito",
        description: "Condos and apartments for sale in Rosarito, Baja California. Photos, prices and location. Licensed bilingual agency, in English and Spanish.",
        intro: [
          "Here are the condos and apartments we have for sale in Playas de Rosarito, refreshed every hour from our inventory. Many are in developments with amenities such as a pool, gym or security; each listing shows what is included.",
          "Before you decide, it is worth checking the condominium rules, the maintenance fee and what it covers, and whether the unit is up to date on its payments. We help you request those documents and go through them with you.",
          "We work in English and Spanish, and if you are coming from outside Mexico we explain how buying works along the coast.",
        ],
        faqs: [
          { q: "What should I check before buying a condo?", a: "The condominium regime and its rules, the amount and coverage of the maintenance fee, that the unit is up to date on payments, and the rules on renting it out." },
          { q: "Can I rent out my condo?", a: "It depends on the condominium rules. Check them before buying if you plan to rent it out; we help you confirm." },
          FOREIGN.en,
          BILINGUAL.en,
        ],
      },
    },
  },
  {
    key: "terrenos",
    kind: "topic",
    matches: c => isSale(c) && c.type === "land" && !/local|edificio/i.test(c.propertyType),
    related: ["casas", "frente-al-mar", "asesoria-legal", "guia"],
    copy: {
      es: {
        title: "Terrenos en venta en Rosarito, B.C.",
        h1: "Terrenos en venta en Rosarito",
        description: "Terrenos en venta en Rosarito, Baja California, con medidas, precio y ubicación. Agencia bilingüe con licencia que también diseña y construye.",
        intro: [
          "Estos son los terrenos que tenemos en venta en Playas de Rosarito y sus alrededores, tomados de nuestro inventario y actualizados cada hora. En cada ficha verás la ubicación, la superficie y el precio.",
          "Comprar un terreno exige revisar bien el papel antes que el paisaje: escrituras a nombre del vendedor, que el predio sea de propiedad privada (no ejidal) o esté regularizado, uso de suelo, predial y clave catastral al corriente, servicios y acceso. Lo revisamos contigo antes de que avances.",
          "Además de venderlos, diseñamos y construimos: si quieres ver cómo sería tu casa en el terreno que elijas, lo platicamos.",
        ],
        faqs: [
          { q: "¿Qué debo revisar antes de comprar un terreno?", a: "Que las escrituras estén a nombre del vendedor, que no sea terreno ejidal (o que esté regularizado), el uso de suelo, que el predial y la clave catastral estén al corriente, las medidas y colindancias, y los servicios y el acceso." },
          { q: "¿Puedo construir en el terreno?", a: "Depende del uso de suelo y de las restricciones de la zona. Lo verificamos antes de comprar, y si lo necesitas también diseñamos y construimos." },
          FOREIGN.es,
          BILINGUAL.es,
        ],
      },
      en: {
        title: "Land for sale in Rosarito, Mexico",
        h1: "Land for sale in Rosarito",
        description: "Land for sale in Rosarito, Baja California, with size, price and location. Licensed bilingual agency that also designs and builds.",
        intro: [
          "These are the lots we have for sale in Playas de Rosarito and the surrounding area, taken from our inventory and refreshed every hour. Each listing shows the location, the size and the price.",
          "Buying land means checking the paperwork before the view: a deed in the seller's name, that the land is privately owned (not ejido land) or has been regularized, land use, property tax and cadastral key up to date, utilities and access. We go through it with you before you move forward.",
          "Besides selling land, we design and build: if you want to see what your home would look like on the lot you choose, let's talk.",
        ],
        faqs: [
          { q: "What should I check before buying land?", a: "That the deed is in the seller's name, that it is not ejido land (or has been regularized), land use, that property tax and the cadastral key are up to date, the size and boundaries, and utilities and access." },
          { q: "Can I build on the lot?", a: "It depends on land use and the rules of the area. We verify it before you buy, and if you need it we also design and build." },
          FOREIGN.en,
          BILINGUAL.en,
        ],
      },
    },
  },
  {
    key: "frente-al-mar",
    kind: "topic",
    matches: c => SEAFRONT.test(c.title),
    related: ["condominios", "casas", "terrenos", "asesoria-legal", "guia"],
    invest: true,
    copy: {
      es: {
        title: "Propiedades frente al mar en Rosarito",
        h1: "Propiedades frente al mar en Rosarito",
        description: "Propiedades frente al mar en Rosarito, Baja California: casas, condominios y terrenos. Fotos, precios y ubicación. Agencia bilingüe con licencia.",
        intro: [
          "Estas son las propiedades frente al mar que tenemos en Rosarito, tomadas de nuestro inventario y actualizadas cada hora. Hay casas, condominios y terrenos; en cada ficha vemos la ubicación y lo que incluye.",
          "En una propiedad frente al mar conviene mirar cosas que en otra no importan: los límites con la zona federal de playa, el tipo de suelo y su estabilidad, el drenaje y los seguros. Te ayudamos a revisarlo, con la asesoría que haga falta.",
          "Atendemos en español y en inglés, y si vienes de fuera de México te explicamos cómo funciona la compra en la zona costera.",
        ],
        faqs: [
          { q: "¿Se puede comprar la playa?", a: "No. Los primeros 20 metros desde la línea de marea más alta son zona federal marítimo terrestre, de uso público: no se venden. Lo que se compra es la propiedad que colinda con ella." },
          { q: "¿Qué debo revisar en una propiedad frente al mar?", a: "Los límites con la zona federal, las características y estabilidad del suelo (con estudio de suelo cuando se construye), el drenaje, el seguro y que los documentos estén en orden." },
          FOREIGN.es,
          BILINGUAL.es,
        ],
      },
      en: {
        title: "Oceanfront property in Rosarito, Mexico",
        h1: "Oceanfront property in Rosarito",
        description: "Oceanfront property in Rosarito, Baja California: homes, condos and land. Photos, prices and location. Licensed bilingual agency.",
        intro: [
          "These are the oceanfront properties we have in Rosarito, taken from our inventory and refreshed every hour. There are homes, condos and land; each listing shows the location and what is included.",
          "With an oceanfront property there are things to look at that do not matter elsewhere: the boundary with the federal beach zone, the type and stability of the ground, drainage and insurance. We help you review them, with the professional advice that is needed.",
          "We work in English and Spanish, and if you are coming from outside Mexico we explain how buying works along the coast.",
        ],
        faqs: [
          { q: "Can I buy the beach?", a: "No. The first 20 metres from the highest tide line are federal maritime-terrestrial zone, for public use: they are not for sale. What you buy is the property next to it." },
          { q: "What should I check on an oceanfront property?", a: "The boundary with the federal zone, the ground and its stability (with a soil study when building), drainage, insurance and that the documents are in order." },
          FOREIGN.en,
          BILINGUAL.en,
        ],
      },
    },
  },
  {
    key: "rentas",
    kind: "topic",
    matches: c => c.operation === "rental",
    related: ["condominios", "casas", "guia"],
    copy: {
      es: {
        title: "Casas y departamentos en renta en Rosarito",
        h1: "Casas y departamentos en renta en Rosarito",
        description: "Casas y departamentos en renta en Rosarito, Baja California. Fotos, precios y ubicación. Agencia bilingüe con licencia, en español e inglés.",
        intro: [
          "Estas son las casas y departamentos que tenemos en renta en Playas de Rosarito, tomados de nuestro inventario y actualizados cada hora. En cada ficha verás fotos, precio y ubicación.",
          "Si buscas una renta, escríbenos con lo que necesitas: fechas, presupuesto, número de personas y zona. Te decimos qué hay disponible y te ayudamos a verlo.",
          "Atendemos en español y en inglés.",
        ],
        faqs: [
          { q: "¿Tienen rentas de largo plazo y temporales?", a: "Hay opciones de renta de largo plazo y, en algunos casos, temporal. Cada ficha lo indica; si no ves lo que necesitas, escríbenos." },
          { q: "¿Puedo rentar si vivo fuera de México?", a: "Sí. Escríbenos con tus fechas, presupuesto y número de personas y te decimos qué hay disponible." },
          BILINGUAL.es,
        ],
      },
      en: {
        title: "Rentals in Rosarito, Mexico",
        h1: "Homes and apartments for rent in Rosarito",
        description: "Homes and apartments for rent in Rosarito, Baja California. Photos, prices and location. Licensed bilingual agency, in English and Spanish.",
        intro: [
          "These are the homes and apartments we have for rent in Playas de Rosarito, taken from our inventory and refreshed every hour. Each listing shows photos, price and location.",
          "If you are looking for a rental, write to us with what you need: dates, budget, number of people and area. We tell you what is available and help you see it.",
          "We work in English and Spanish.",
        ],
        faqs: [
          { q: "Do you have long-term and short-term rentals?", a: "There are long-term options and, in some cases, temporary ones. Each listing says which; if you do not see what you need, write to us." },
          { q: "Can I rent if I live outside Mexico?", a: "Yes. Write to us with your dates, budget and number of people and we will tell you what is available." },
          BILINGUAL.en,
        ],
      },
    },
  },
];

// ── Where people search ─────────────────────────────────────────────────────
// A neighbourhood page says what is for sale there, counted from the inventory,
// and nothing about the neighbourhood itself.
type Zone = { key: LandingKey; name: string; match: RegExp };
const ZONES: Zone[] = [
  { key: "punta-azul", name: "Punta Azul", match: /punta azul/i },
  { key: "el-morro", name: "El Morro", match: /el morro/i },
  { key: "plaza-del-mar", name: "Plaza del Mar", match: /plaza del mar/i },
  { key: "mar-de-calafia", name: "Mar de Calafia", match: /mar de calafia/i },
  { key: "terrazas-del-mar", name: "Terrazas del Mar", match: /terrazas del mar/i },
];

function zonePage(z: Zone): Landing {
  return {
    key: z.key,
    kind: "zone",
    matches: c => z.match.test(c.location),
    related: ["casas", "terrenos", "condominios", "guia"],
    invest: true,
    copy: {
      es: {
        title: `Propiedades en ${z.name}, Rosarito`,
        h1: `Propiedades en ${z.name}, Rosarito`,
        description: `Propiedades en venta y renta en ${z.name}, Playas de Rosarito, Baja California. Fotos, precios y ubicación. Agencia bilingüe con licencia.`,
        intro: [
          `Estas son las propiedades que tenemos en ${z.name}, en Playas de Rosarito, Baja California, tomadas de nuestro inventario y actualizadas cada hora. En cada ficha verás fotos, precio y ubicación.`,
          "Si quieres conocer la zona antes de decidir, escríbenos y coordinamos una visita. Atendemos en español y en inglés.",
        ],
        faqs: [FOREIGN.es, BILINGUAL.es],
      },
      en: {
        title: `${z.name} real estate, Rosarito`,
        h1: `Properties in ${z.name}, Rosarito`,
        description: `Properties for sale and rent in ${z.name}, Playas de Rosarito, Baja California. Photos, prices and location. Licensed bilingual agency.`,
        intro: [
          `These are the properties we have in ${z.name}, in Playas de Rosarito, Baja California, taken from our inventory and refreshed every hour. Each listing shows photos, price and location.`,
          "If you want to see the area before deciding, write to us and we will arrange a visit. We work in English and Spanish.",
        ],
        faqs: [FOREIGN.en, BILINGUAL.en],
      },
    },
  };
}

export const LANDINGS: Landing[] = [...TOPICS, ...ZONES.map(zonePage)];

export function getLanding(key: string): Landing | undefined {
  return LANDINGS.find(l => l.key === key);
}

/** What the page says about its own contents, counted from what it lists. */
export function describeStock(cards: PropertyCard[], lang: Lang): string {
  const count = (f: (c: PropertyCard) => boolean) => cards.filter(f).length;
  const houses = count(c => c.type === "house");
  const condos = count(c => c.type === "apartment");
  const land = count(c => c.type === "land");
  const parts: string[] = [];
  if (lang === "es") {
    if (houses) parts.push(`${houses} ${houses === 1 ? "casa" : "casas"}`);
    if (condos) parts.push(`${condos} ${condos === 1 ? "condominio o departamento" : "condominios o departamentos"}`);
    if (land) parts.push(`${land} ${land === 1 ? "terreno" : "terrenos"}`);
  } else {
    if (houses) parts.push(`${houses} ${houses === 1 ? "home" : "homes"}`);
    if (condos) parts.push(`${condos} ${condos === 1 ? "condo or apartment" : "condos or apartments"}`);
    if (land) parts.push(`${land} ${land === 1 ? "lot" : "lots"}`);
  }
  // A breakdown only says something when there is more than one kind.
  return parts.length > 1 ? parts.join(" · ") : "";
}

/** Text around the content that is the same on every search page. */
export const CHROME: Record<Lang, {
  home: string; available: (n: number) => string; none: string; viewAll: string;
  ctaTitle: string; ctaText: string; whatsapp: string; contact: string;
  faq: string; related: string; guideTitle: string; guideText: string; guideLink: string;
  calcTitle: string; calcText: string; calcLink: string;
  whatsappMessage: (h1: string) => string;
}> = {
  es: {
    home: "Inicio",
    available: n => (n === 1 ? "1 propiedad disponible ahora" : `${n} propiedades disponibles ahora`),
    none: "Ahora mismo no tenemos propiedades de este tipo publicadas. Escríbenos y te avisamos cuando haya, o mira todo el inventario.",
    viewAll: "Ver todas las propiedades",
    ctaTitle: "¿No encuentras lo que buscas?",
    ctaText: "Cuéntanos qué necesitas y te enviamos opciones. Respondemos en español e inglés.",
    whatsapp: "Escribir por WhatsApp",
    contact: "Formulario de contacto",
    faq: "Preguntas frecuentes",
    related: "También te puede interesar",
    guideTitle: "Guía para comprar propiedad en México",
    guideText: "Fideicomiso, zona restringida y pasos de la compra, explicados para extranjeros.",
    guideLink: "Leer la guía",
    calcTitle: "¿Pensando en rentarla? Calcula cuánto rendiría",
    calcText: "Pon el precio y la renta que esperas y mira, con controles sencillos, cuánto te quedaría al año y en cuánto tiempo recuperarías tu inversión.",
    calcLink: "Probar la calculadora",
    whatsappMessage: h1 => `Hola, vi la página "${h1}" en su sitio y me gustaría más información.`,
  },
  en: {
    home: "Home",
    available: n => (n === 1 ? "1 property available now" : `${n} properties available now`),
    none: "We do not have properties of this kind listed right now. Write to us and we will let you know when we do, or browse the whole inventory.",
    viewAll: "View all properties",
    ctaTitle: "Can't find what you're looking for?",
    ctaText: "Tell us what you need and we will send you options. We reply in English and Spanish.",
    whatsapp: "Message us on WhatsApp",
    contact: "Contact form",
    faq: "Frequently asked questions",
    related: "You may also like",
    guideTitle: "Guide to buying property in Mexico",
    guideText: "Bank trust, restricted zone and the steps of the purchase, explained for foreign buyers.",
    guideLink: "Read the guide",
    calcTitle: "Thinking of renting it out? See what it would yield",
    calcText: "Enter the price and the rent you expect and see, with simple sliders, what you would keep each year and how long it would take to recover your investment.",
    calcLink: "Try the calculator",
    whatsappMessage: h1 => `Hi, I saw the page "${h1}" on your site and I'd like more information.`,
  },
};
