"use client";
import { useLang } from "../lib/LangContext";
import { CONSENT_KEY, trackingConfigured } from "../lib/analytics";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EMAIL = "jorgeelcasarosarito@gmail.com";
const PHONE = "+52 661 125 6107";
const ADDRESS = "Local 19 Módulo A, Quinta Plaza, 22703 Playas de Rosarito, B.C.";

type Section = { title: string; body: string[] };

const CONTENT: Record<"es" | "en", { title: string; updated: string; sections: Section[]; cookiesButton: string }> = {
  es: {
    title: "Aviso de Privacidad",
    updated: "Última actualización: 26 de octubre de 2026",
    cookiesButton: "Cambiar mi preferencia de cookies",
    sections: [
      {
        title: "Quién es el responsable",
        body: [`El Casa Rosarito es responsable del tratamiento de tus datos personales. Domicilio: ${ADDRESS} Correo: ${EMAIL}. Teléfono y WhatsApp: ${PHONE}.`],
      },
      {
        title: "Qué datos recabamos",
        body: [
          "Cuando nos escribes por el formulario de contacto, el de una propiedad o el cuestionario: nombre, correo, teléfono (si lo das), tu mensaje, la propiedad que te interesa y tus respuestas (operación, tipo, presupuesto y tiempo).",
          "Si creas una cuenta: nombre, correo y contraseña (se guarda cifrada), y las propiedades que marcas como favoritas.",
          "Si marcas una propiedad como de tu interés sin cuenta: tu correo y esa propiedad.",
          "Si te suscribes a los avisos de propiedades: tu correo y la página de propiedades que te interesa. Puedes darte de baja desde cualquier mensaje.",
          "Si descargas la guía: tu nombre, tu correo y, si lo das, tu WhatsApp.",
          "Los números que escribes en la calculadora de rentabilidad se quedan en tu navegador: no los guardamos.",
        ],
      },
      {
        title: "Para qué los usamos",
        body: [
          "Responder tu consulta y darte seguimiento sobre la propiedad que te interesa, por correo, teléfono o WhatsApp.",
          "Avisarte de propiedades parecidas, si lo pides.",
          "Mejorar el sitio: entender qué páginas se visitan y qué funciona.",
        ],
      },
      {
        title: "Con quién los compartimos",
        body: [
          "Con nuestro equipo, que recibe un aviso interno de cada consulta, y con las agencias aliadas únicamente cuando tu consulta es sobre una de sus propiedades.",
          "Con proveedores que hacen posible el sitio: alojamiento (Vercel), base de datos (Neon), envío de formularios (Web3Forms) y el catálogo de propiedades (EasyBroker). Si aceptas las cookies de análisis y publicidad, también Google y Meta.",
          "No vendemos tus datos.",
        ],
      },
      {
        title: "Cookies y medición",
        body: [
          "Medimos visitas y rendimiento con herramientas que no usan cookies (Vercel Analytics y Speed Insights).",
          "Google Analytics y Meta Pixel usan cookies para saber qué páginas funcionan y mostrar nuestros anuncios a quien pueda interesarle. Solo se activan si las aceptas; si las rechazas no se guarda nada en tu dispositivo con ese fin. Puedes cambiar de decisión cuando quieras.",
        ],
      },
      {
        title: "Tus derechos",
        body: [
          `Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso (derechos ARCO), y retirar tu consentimiento, escribiendo a ${EMAIL}. Responderemos en un plazo máximo de 20 días hábiles.`,
        ],
      },
      {
        title: "Cambios a este aviso",
        body: ["Si cambia, publicaremos la nueva versión en esta página con su fecha de actualización."],
      },
    ],
  },
  en: {
    title: "Privacy Notice",
    updated: "Last updated: October 26, 2026",
    cookiesButton: "Change my cookie preference",
    sections: [
      {
        title: "Who is responsible",
        body: [`El Casa Rosarito is responsible for processing your personal data. Address: ${ADDRESS} Email: ${EMAIL}. Phone and WhatsApp: ${PHONE}.`],
      },
      {
        title: "What data we collect",
        body: [
          "When you write to us through the contact form, a property's form, or the quiz: your name, email, phone (if you give it), your message, the property you are interested in, and your answers (operation, type, budget and timing).",
          "If you create an account: your name, email and password (stored encrypted), and the properties you save as favorites.",
          "If you mark a property as of interest without an account: your email and that property.",
          "If you subscribe to property alerts: your email and the properties page you are interested in. You can unsubscribe from any message.",
          "If you download the guide: your name, your email and, if you give it, your WhatsApp.",
          "The numbers you type into the rental yield calculator stay in your browser: we do not save them.",
        ],
      },
      {
        title: "What we use it for",
        body: [
          "To answer your inquiry and follow up about the property you are interested in, by email, phone or WhatsApp.",
          "To let you know about similar properties, if you ask us to.",
          "To improve the site: understanding which pages are visited and what works.",
        ],
      },
      {
        title: "Who we share it with",
        body: [
          "With our team, who receive an internal alert for each inquiry, and with allied agencies only when your inquiry is about one of their properties.",
          "With providers that make the site possible: hosting (Vercel), database (Neon), form delivery (Web3Forms) and the property catalog (EasyBroker). If you accept analytics and advertising cookies, also Google and Meta.",
          "We do not sell your data.",
        ],
      },
      {
        title: "Cookies and measurement",
        body: [
          "We measure visits and performance with tools that do not use cookies (Vercel Analytics and Speed Insights).",
          "Google Analytics and the Meta Pixel use cookies to learn which pages work and to show our ads to people who may be interested. They only run if you accept; if you decline, nothing is stored on your device for that purpose. You can change your mind at any time.",
        ],
      },
      {
        title: "Your rights",
        body: [
          `You can access, correct or delete your data, object to its use (ARCO rights), and withdraw your consent by writing to ${EMAIL}. We will reply within 20 business days.`,
        ],
      },
      {
        title: "Changes to this notice",
        body: ["If it changes, we will publish the new version on this page with its update date."],
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useLang();
  const c = CONTENT[locale];

  // Forgetting the choice shows the cookie question again on the next load.
  const reopen = () => {
    try { localStorage.removeItem(CONSENT_KEY); } catch { /* nothing stored to forget */ }
    location.assign("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      <main style={{ padding: "140px 24px 96px" }}>
        <article style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="sage-line" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgb(var(--accent))" }}>
              El Casa Rosarito
            </span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", letterSpacing: "-0.02em", marginBottom: 12 }}>
            {c.title}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(var(--ink),0.5)", marginBottom: 48 }}>{c.updated}</p>

          {c.sections.map(s => (
            <section key={s.title} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.6rem", color: "rgb(var(--ink))", marginBottom: 12 }}>{s.title}</h2>
              {s.body.map(p => (
                <p key={p} style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(var(--ink),0.78)", marginBottom: 10 }}>{p}</p>
              ))}
            </section>
          ))}

          {trackingConfigured && (
            <button type="button" onClick={reopen}
              style={{ marginTop: 8, padding: "14px 24px", minHeight: 44, background: "transparent", color: "rgb(var(--accent))", border: "1px solid rgba(var(--accent),0.5)", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "0.74rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {c.cookiesButton}
            </button>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
