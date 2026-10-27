// The guide to buying property in Mexico as a foreigner: the text of the web
// page and of the PDF, in both languages. One source for both, so they cannot
// disagree (scripts/guide-pdf.mjs reads this very file).
//
// It is general information and says so. It gives no rates or amounts: those
// change and vary by municipality and bank, and belong in a quote for a
// specific property. Keep it that way, and keep the date below current.
// Only erasable TypeScript here (no enums, no imports): Node runs it directly.

export type GuideSection = {
  h2: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type Guide = {
  title: string;
  h1: string;
  description: string;
  intro: string[];
  updated: string;
  sections: GuideSection[];
  disclaimer: string;
  pdf: string;
  form: {
    title: string; text: string; name: string; email: string; phone: string; submit: string; sending: string;
    privacy: string; privacyLink: string; thanks: string; download: string; error: string; whatsapp: string;
    again: string; message: string;
  };
  cta: { title: string; text: string; whatsapp: string; whatsappMessage: string };
};

export const GUIDE_UPDATED = "2026-10-26";

export const GUIDE: Record<"es" | "en", Guide> = {
  es: {
    title: "Cómo comprar propiedad en México siendo extranjero",
    h1: "Cómo comprar propiedad en México siendo extranjero",
    description:
      "Guía para comprar casa, condominio o terreno en México siendo extranjero: zona restringida, fideicomiso bancario, pasos de la compra, documentos y costos a considerar.",
    intro: [
      "Sí, un extranjero puede comprar propiedad en México. Lo que cambia, sobre todo en la costa, es la forma de adquirirla. Esta guía resume cómo funciona, paso a paso, y qué revisar antes de pagar.",
      "Es información general para orientarte. Cada compra tiene sus particularidades, y las reglas y los montos cambian: antes de firmar, confírmalo con un notario público y con tu asesor.",
    ],
    updated: "Actualizada el 26 de octubre de 2026",
    sections: [
      {
        h2: "¿Qué es la zona restringida?",
        paragraphs: [
          "La Constitución mexicana establece una franja donde los extranjeros no pueden tener directamente la propiedad de un inmueble: hasta 50 kilómetros desde la costa y 100 kilómetros desde las fronteras. Rosarito, al estar en la costa de Baja California, queda dentro de ella.",
          "Eso no impide comprar. Dentro de la zona restringida, la propiedad se adquiere a través de un fideicomiso bancario.",
        ],
      },
      {
        h2: "El fideicomiso bancario",
        paragraphs: [
          "Un banco mexicano actúa como fiduciario y mantiene el título de la propiedad a favor del comprador, que es el beneficiario del fideicomiso. En la práctica, el comprador puede usar y ocupar la propiedad, rentarla, venderla, transmitirla y designar a quién se la hereda.",
          "El fideicomiso para vivienda se otorga hasta por 50 años y es renovable. El banco cobra por constituirlo y una cuota anual; los montos dependen de cada banco. El notario público tramita el permiso que corresponde ante la Secretaría de Relaciones Exteriores.",
        ],
      },
      {
        h2: "Los pasos de la compra",
        steps: [
          "Define tu presupuesto y lo que buscas: tipo de propiedad, zona y uso (vivir, rentar o invertir).",
          "Visita y elige. Con tu agente revisas opciones y, si te interesa una, haces una oferta.",
          "Promesa de compraventa y apartado: se acuerdan precio, condiciones y fechas, y se entrega un anticipo que el contrato debe proteger.",
          "Revisión legal: título de propiedad, certificado de libertad de gravamen, predial y servicios al corriente, y que quien vende sea el dueño y pueda venderla.",
          "Avalúo y notario: se hace el avalúo y el notario público prepara la escritura y calcula impuestos y derechos.",
          "Fideicomiso: si la propiedad está en la zona restringida, se constituye con el banco.",
          "Firma y pago: se firma la escritura ante notario, se paga el saldo y se cubren impuestos y derechos.",
          "Registro y entrega: la escritura se inscribe en el Registro Público de la Propiedad, se entregan las llaves y los servicios pasan a tu nombre.",
        ],
      },
      {
        h2: "Qué se revisa antes de pagar",
        bullets: [
          "La escritura (título) a nombre de quien vende.",
          "El certificado de libertad de gravamen: que no haya hipotecas ni embargos.",
          "El predial pagado y la clave catastral.",
          "Si es un terreno: que no sea ejidal, o que esté regularizado, y su uso de suelo.",
          "Si es un condominio: el reglamento, la cuota de mantenimiento y que esté al corriente.",
          "La identificación y facultades de quien vende, y la autorización de su cónyuge cuando corresponda.",
          "Agua y luz al corriente.",
        ],
      },
      {
        h2: "Costos a considerar",
        paragraphs: [
          "Además del precio hay honorarios del notario, el impuesto sobre adquisición de inmuebles (su tasa depende del municipio y del estado), derechos de registro, el avalúo y, si aplica, el costo de constituir el fideicomiso. Pide siempre un desglose por escrito antes de hacer una oferta.",
          "Después de comprar hay gastos anuales: el predial, la cuota anual del fideicomiso y, en un condominio, la cuota de mantenimiento.",
        ],
      },
      {
        h2: "¿Se puede financiar?",
        paragraphs: [
          "El financiamiento para extranjeros suele ser más limitado que en Estados Unidos. Muchas compras se pagan de contado; algunos desarrolladores y vendedores ofrecen planes de pago, y existen opciones bancarias. Consulta con un asesor financiero antes de comprometerte. Los pagos de inmuebles se hacen por transferencia bancaria, y el notario te indica cómo.",
        ],
      },
      {
        h2: "Cómo te ayudamos",
        paragraphs: [
          "Somos una agencia bilingüe en Playas de Rosarito. Te acompañamos desde la primera visita hasta la entrega de llaves, te ayudamos a pedir y revisar los documentos y a coordinar el trámite con el notario y el banco. Además diseñamos y construimos, por si prefieres hacer tu casa en un terreno.",
        ],
      },
    ],
    disclaimer:
      "Esta guía es informativa y no sustituye asesoría legal, fiscal ni financiera. Las leyes, los montos y los trámites cambian y varían por municipio: confírmalo con un notario público antes de firmar.",
    pdf: "/guias/guia-comprar-propiedad-mexico-es.pdf",
    form: {
      title: "Descarga la guía en PDF",
      text: "Déjanos tus datos y te mostramos la descarga. Si quieres, te escribimos para resolver las dudas de tu caso.",
      name: "Tu nombre", email: "Tu correo", phone: "WhatsApp (opcional)",
      submit: "Descargar la guía", sending: "Enviando…",
      privacy: "Usamos tus datos solo para darte la guía y responderte.", privacyLink: "Aviso de privacidad",
      thanks: "Gracias. Tu guía está lista:", download: "Descargar PDF",
      error: "No pudimos registrar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp.", whatsapp: "Escribir por WhatsApp",
      again: "Si lo prefieres, también puedes leerla aquí en la página.",
      message: "Descarga de la guía para comprar propiedad en México (versión en español).",
    },
    cta: {
      title: "¿Quieres revisar tu caso con nosotros?",
      text: "Cuéntanos qué propiedad te interesa y te explicamos los pasos y el desglose de costos de esa propiedad en concreto.",
      whatsapp: "Escribir por WhatsApp",
      whatsappMessage: "Hola, leí su guía para comprar propiedad en México y me gustaría revisar mi caso.",
    },
  },
  en: {
    title: "Buying property in Mexico as a foreigner: guide",
    h1: "How to buy property in Mexico as a foreigner",
    description:
      "A guide to buying a house, condo or land in Mexico as a foreign buyer: the restricted zone, the bank trust (fideicomiso), the steps of the purchase, documents and costs to consider.",
    intro: [
      "Yes, a foreigner can buy property in Mexico. What changes, especially on the coast, is how it is acquired. This guide summarizes how it works, step by step, and what to check before you pay.",
      "It is general information to orient you. Every purchase has its own details, and rules and amounts change: before you sign, confirm everything with a notary public and your advisor.",
    ],
    updated: "Updated October 26, 2026",
    sections: [
      {
        h2: "What is the restricted zone?",
        paragraphs: [
          "Mexico's Constitution sets a strip where foreigners cannot directly own real estate: up to 50 kilometres from the coast and 100 kilometres from the borders. Rosarito, on the coast of Baja California, is inside it.",
          "That does not stop you from buying. Inside the restricted zone, property is acquired through a bank trust (fideicomiso).",
        ],
      },
      {
        h2: "The bank trust (fideicomiso)",
        paragraphs: [
          "A Mexican bank acts as trustee and holds the title to the property for the buyer, who is the beneficiary of the trust. In practice, the buyer can use and occupy the property, rent it, sell it, transfer it and name who inherits it.",
          "A residential trust is granted for up to 50 years and is renewable. The bank charges to set it up and an annual fee; the amounts depend on the bank. The notary public handles the permit required from the Ministry of Foreign Affairs.",
        ],
      },
      {
        h2: "The steps of the purchase",
        steps: [
          "Set your budget and what you are looking for: type of property, area and use (to live in, rent or invest).",
          "Visit and choose. With your agent you review options and, when one fits, you make an offer.",
          "Purchase promise and deposit: price, conditions and dates are agreed, and a deposit is paid that the contract must protect.",
          "Legal review: title, certificate of no liens, property tax and utilities up to date, and that the seller owns the property and is able to sell it.",
          "Appraisal and notary: the appraisal is done and the notary public prepares the deed and calculates taxes and fees.",
          "Trust: if the property is in the restricted zone, it is set up with the bank.",
          "Signing and payment: the deed is signed before the notary, the balance is paid and taxes and fees are covered.",
          "Registration and handover: the deed is recorded in the Public Registry of Property, you receive the keys and the utilities move to your name.",
        ],
      },
      {
        h2: "What is checked before you pay",
        bullets: [
          "The deed (title) in the seller's name.",
          "The certificate of no liens: no mortgages or seizures.",
          "Property tax paid and the cadastral key.",
          "For land: that it is not ejido land, or has been regularized, and its land use.",
          "For a condo: the rules, the maintenance fee and that it is up to date.",
          "The seller's identification and authority to sell, and their spouse's consent where it applies.",
          "Water and electricity up to date.",
        ],
      },
      {
        h2: "Costs to consider",
        paragraphs: [
          "On top of the price there are notary fees, the property acquisition tax (its rate depends on the municipality and the state), registry fees, the appraisal and, when it applies, the cost of setting up the trust. Always ask for a written breakdown before you make an offer.",
          "After buying there are yearly costs: property tax, the trust's annual fee and, in a condo, the maintenance fee.",
        ],
      },
      {
        h2: "Can it be financed?",
        paragraphs: [
          "Financing for foreigners is usually more limited than in the United States. Many purchases are paid in cash; some developers and sellers offer payment plans, and there are bank options. Talk to a financial advisor before you commit. Real estate payments are made by bank transfer, and the notary tells you how.",
        ],
      },
      {
        h2: "How we help",
        paragraphs: [
          "We are a bilingual agency in Playas de Rosarito. We go with you from the first visit to the handover of the keys, help you request and review the documents, and coordinate the paperwork with the notary and the bank. We also design and build, in case you prefer to build your home on a lot.",
        ],
      },
    ],
    disclaimer:
      "This guide is informational and does not replace legal, tax or financial advice. Laws, amounts and procedures change and vary by municipality: confirm them with a notary public before you sign.",
    pdf: "/guias/guia-comprar-propiedad-mexico-en.pdf",
    form: {
      title: "Download the guide as a PDF",
      text: "Leave your details and we show you the download. If you like, we will write to answer the questions about your case.",
      name: "Your name", email: "Your email", phone: "WhatsApp (optional)",
      submit: "Download the guide", sending: "Sending…",
      privacy: "We use your details only to give you the guide and reply to you.", privacyLink: "Privacy notice",
      thanks: "Thank you. Your guide is ready:", download: "Download PDF",
      error: "We could not save your details. Please try again or message us on WhatsApp.", whatsapp: "Message us on WhatsApp",
      again: "If you prefer, you can also read it right here on the page.",
      message: "Download of the guide to buying property in Mexico (English version).",
    },
    cta: {
      title: "Want to go over your case with us?",
      text: "Tell us which property interests you and we will explain the steps and the cost breakdown for that specific property.",
      whatsapp: "Message us on WhatsApp",
      whatsappMessage: "Hi, I read your guide to buying property in Mexico and I'd like to go over my case.",
    },
  },
};
