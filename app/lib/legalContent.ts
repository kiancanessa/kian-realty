// The legal advisory page, in both languages.
//
// It says only what the site already says about the service and about the
// people who give it (their roles and bios, and the service description on the
// home page). It gives no fees, no timeframes and no promises about outcomes.
// It is a starting point: guides and answers to common questions get added here.
// Only erasable TypeScript, no imports.

export type LegalPageContent = {
  title: string;
  h1: string;
  description: string;
  intro: string[];
  scopeTitle: string;
  scope: string[];
  teamTitle: string;
  veronica: { name: string; role: string; text: string; cta: string; message: string };
  others: { name: string; role: string; text: string; photo: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  guide: { title: string; text: string; link: string };
  disclaimer: string;
};

export const LEGAL: Record<"es" | "en", LegalPageContent> = {
  es: {
    title: "Asesoría legal inmobiliaria en Rosarito",
    h1: "Asesoría legal para tu propiedad en Rosarito",
    description:
      "Asesoría legal para comprar, vender o rentar propiedad en Rosarito, Baja California: contratos, revisión de documentos y acompañamiento en el cierre, con un equipo bilingüe.",
    intro: [
      "Comprar, vender o rentar una propiedad en México implica contratos, permisos y trámites que conviene tener claros desde el principio. En El Casa Rosarito, el equipo legal te acompaña en español y en inglés, desde la primera revisión de documentos hasta la entrega de llaves.",
      "Esta página es el punto de partida: aquí iremos publicando guías y respuestas a las dudas más comunes. Si tienes una pregunta ahora, escríbele directamente a Verónica.",
    ],
    scopeTitle: "En qué te ayudamos",
    scope: [
      "Contratos: revisión y redacción de contratos de compra, venta y renta de propiedades.",
      "Documentos de la propiedad: escrituras, gravámenes, predial, uso de suelo y, en un condominio, el reglamento y las cuotas.",
      "Permisos y trámites: acompañamiento con el notario y, para compradores extranjeros en la zona restringida, con el banco para el fideicomiso.",
      "Cierre: acompañamiento hasta la escrituración y la entrega de la propiedad.",
      "Protección patrimonial: orientación para que la propiedad quede resguardada a tu nombre y a favor de quien tú decidas.",
    ],
    teamTitle: "Quién te atiende",
    veronica: {
      name: "Verónica Ruiz Olvera",
      role: "Gerente de oficina · Asesora legal",
      text: "Es tu primer contacto: coordina la operación y da seguimiento a la documentación legal. Cuéntale qué propiedad o trámite te interesa y qué documentos tienes, y te orienta sobre los siguientes pasos.",
      cta: "Escribir a Verónica por WhatsApp",
      message: "Hola Verónica, vi la página de asesoría legal de El Casa Rosarito y me gustaría que me orientes.",
    },
    others: [
      { name: "Lic. Eduardo L. Molina Herrera", role: "Abogado", text: "Especializado en Derecho civil e inmobiliario.", photo: "/images/team/eduardo.jpeg" },
      { name: "Lic. Jorge L. Juárez Arellano", role: "Presidente", text: "Dirige la firma especializada en bienes raíces y asesoría legal.", photo: "/images/team/jorge.jpg" },
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿Cómo empiezo?", a: "Escríbele a Verónica por WhatsApp contándole qué propiedad o trámite te interesa y qué documentos tienes. Con eso te orienta sobre los siguientes pasos." },
      { q: "¿Qué documentos debo tener a la mano?", a: "Si ya tienes una propiedad en mente: la escritura o título que te muestre quien vende, el recibo del predial y, si es un condominio, el reglamento. Si todavía no, empieza por nuestra guía para comprar en México." },
      { q: "¿Me atienden en inglés?", a: "Sí. El equipo es bilingüe: te atendemos en español o en inglés." },
    ],
    guide: {
      title: "Guía para comprar propiedad en México",
      text: "Zona restringida, fideicomiso, pasos de la compra y documentos a revisar, explicados para extranjeros.",
      link: "Leer la guía",
    },
    disclaimer: "La información de esta página es general y no sustituye la asesoría sobre tu caso concreto.",
  },
  en: {
    title: "Real estate legal advice in Rosarito",
    h1: "Legal advice for your property in Rosarito",
    description:
      "Legal advice for buying, selling or renting property in Rosarito, Baja California: contracts, document review and closing support, from a bilingual team.",
    intro: [
      "Buying, selling or renting property in Mexico involves contracts, permits and paperwork that are best understood from the start. At El Casa Rosarito, the legal team works with you in English and Spanish, from the first review of documents to the handover of the keys.",
      "This page is the starting point: we will publish guides and answers to the most common questions here. If you have a question now, write to Verónica directly.",
    ],
    scopeTitle: "How we help",
    scope: [
      "Contracts: review and drafting of contracts to buy, sell and rent property.",
      "Property documents: deeds, liens, property tax, land use and, in a condo, the rules and fees.",
      "Permits and paperwork: support with the notary and, for foreign buyers in the restricted zone, with the bank for the trust (fideicomiso).",
      "Closing: support through the signing of the deed and the handover of the property.",
      "Asset protection: guidance so that the property is safeguarded in your name and for whoever you choose.",
    ],
    teamTitle: "Who you will work with",
    veronica: {
      name: "Verónica Ruiz Olvera",
      role: "Office manager · Legal advisor",
      text: "She is your first contact: she coordinates the operation and follows up on the legal paperwork. Tell her which property or procedure you are interested in and which documents you have, and she will point you to the next steps.",
      cta: "Message Verónica on WhatsApp",
      message: "Hi Verónica, I saw El Casa Rosarito's legal advisory page and I'd like some guidance.",
    },
    others: [
      { name: "Lic. Eduardo L. Molina Herrera", role: "Attorney at law", text: "Specializing in civil and real estate law.", photo: "/images/team/eduardo.jpeg" },
      { name: "Lic. Jorge L. Juárez Arellano", role: "President", text: "Leads the firm specializing in real estate and legal advisory.", photo: "/images/team/jorge.jpg" },
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "How do I get started?", a: "Message Verónica on WhatsApp telling her which property or procedure you are interested in and which documents you have. She will point you to the next steps." },
      { q: "Which documents should I have at hand?", a: "If you already have a property in mind: the deed or title the seller shows you, the property tax receipt and, for a condo, the rules. If not yet, start with our guide to buying in Mexico." },
      { q: "Do you work in English?", a: "Yes. The team is bilingual: we help you in English or Spanish." },
    ],
    guide: {
      title: "Guide to buying property in Mexico",
      text: "Restricted zone, bank trust, the steps of the purchase and the documents to check, explained for foreign buyers.",
      link: "Read the guide",
    },
    disclaimer: "The information on this page is general and does not replace advice on your specific case.",
  },
};
