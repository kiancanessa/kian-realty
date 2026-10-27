import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Avisos de propiedades",
  robots: { index: false, follow: false },
};

const TEXT = {
  es: {
    confirmed: ["¡Listo, quedaste suscrito!", "Te avisaremos cuando haya propiedades nuevas o bajen de precio. En cada mensaje encontrarás un enlace para dejar de recibirlos."],
    unsubscribed: ["Ya no recibirás estos avisos", "Cancelamos tu suscripción. Si fue un error, puedes volver a suscribirte desde la página de propiedades."],
    invalid: ["Este enlace ya no es válido", "Puede haber caducado o ya haberse usado. Si quieres recibir avisos, suscríbete de nuevo desde la página de propiedades."],
    home: "Ir al inicio", homeHref: "/es",
  },
  en: {
    confirmed: ["Done, you are subscribed!", "We will let you know when there are new properties or price drops. Every message has a link to stop receiving them."],
    unsubscribed: ["You will no longer receive these alerts", "We cancelled your subscription. If it was a mistake, you can subscribe again from the properties page."],
    invalid: ["This link is no longer valid", "It may have expired or already been used. If you want alerts, subscribe again from the properties page."],
    home: "Go to the home page", homeHref: "/",
  },
} as const;

type Props = { searchParams: Promise<{ status?: string; lang?: string }> };

export default async function AlertStatusPage({ searchParams }: Props) {
  const { status, lang } = await searchParams;
  const t = TEXT[lang === "en" ? "en" : "es"];
  const [title, text] = status === "confirmed" ? t.confirmed : status === "unsubscribed" ? t.unsubscribed : t.invalid;

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      <main style={{ padding: "180px 24px 120px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: 18 }}>{title}</h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(var(--ink),0.75)", marginBottom: 32 }}>{text}</p>
          <a href={t.homeHref} style={{ display: "inline-block", padding: "14px 28px", background: "rgb(var(--accent))", color: "#FAF6EE", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>{t.home}</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
