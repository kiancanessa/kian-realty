import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LEGAL } from "../lib/legalContent";
import { CHROME } from "../lib/landingPages";
import { pagePath, type Lang } from "../lib/seoSlugs";
import { VERONICA_WHATSAPP } from "../lib/contact";
import { whatsappLink } from "../lib/sendInquiry";

const SITE = "https://elcasarosaritogroup.com";

const h2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "rgb(var(--ink))", margin: "56px 0 18px" };
const body: React.CSSProperties = { fontFamily: "'Jost', sans-serif", fontSize: "1.02rem", lineHeight: 1.85, color: "rgba(var(--ink),0.78)", marginBottom: 16 };

/** Legal advisory: what the service covers, who gives it, and a direct line to
 *  Verónica. The guide to buying in Mexico links here, and this links back. */
export default function LegalPage({ lang }: { lang: Lang }) {
  const c = LEGAL[lang];
  const ui = CHROME[lang];
  const url = `${SITE}${pagePath("asesoria-legal", lang)}`;
  const wa = whatsappLink(VERONICA_WHATSAPP, c.veronica.message);

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: lang === "es" ? `${SITE}/es` : SITE },
        { "@type": "ListItem", position: 2, name: c.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "Service", name: c.title, description: c.description, url, inLanguage: lang,
      serviceType: "Real estate legal advice",
      provider: { "@type": "RealEstateAgent", name: "El Casa Rosarito", url: SITE },
      areaServed: { "@type": "City", name: "Playas de Rosarito" },
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <main style={{ padding: "140px 24px 96px" }}>
        <article style={{ maxWidth: 880, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(var(--ink),0.5)", marginBottom: 28 }}>
            <a href={lang === "es" ? "/es" : "/"} style={{ color: "inherit" }}>{ui.home}</a>
            <span aria-hidden> / </span>
            <span aria-current="page">{c.h1}</span>
          </nav>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.3rem, 5vw, 3.6rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 28 }}>{c.h1}</h1>
          <div style={{ maxWidth: 740 }}>{c.intro.map(t => <p key={t} style={body}>{t}</p>)}</div>

          {/* The first contact, up front. */}
          <section aria-labelledby="legal-contact" data-placement="legal-advisor"
            style={{ margin: "40px 0 8px", padding: "32px", border: "1px solid rgba(var(--accent),0.3)", background: "rgb(var(--surface))", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center" }}>
            <Image src="/images/team/veronica.jpg" alt={c.veronica.name} width={112} height={112}
              style={{ width: 112, height: 112, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: "1 1 320px" }}>
              <h2 id="legal-contact" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.7rem", color: "rgb(var(--ink))", margin: 0 }}>{c.veronica.name}</h2>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgb(var(--accent))", margin: "6px 0 12px" }}>{c.veronica.role}</p>
              <p style={{ ...body, fontSize: "0.95rem", marginBottom: 18 }}>{c.veronica.text}</p>
              <a href={wa} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "14px 26px", background: "#25D366", color: "#08260f", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {c.veronica.cta}
              </a>
            </div>
          </section>

          <h2 style={h2}>{c.scopeTitle}</h2>
          <ul style={{ ...body, paddingLeft: 22 }}>
            {c.scope.map(s => <li key={s} style={{ marginBottom: 10 }}>{s}</li>)}
          </ul>

          <h2 style={h2}>{c.teamTitle}</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {c.others.map(o => (
              <li key={o.name} style={{ display: "flex", gap: 16, alignItems: "center", padding: "18px 20px", border: "1px solid rgba(var(--accent),0.18)" }}>
                <Image src={o.photo} alt="" width={64} height={64} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "rgb(var(--ink))" }}>{o.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgb(var(--accent))", margin: "2px 0 6px" }}>{o.role}</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", lineHeight: 1.5, color: "rgba(var(--ink),0.7)" }}>{o.text}</div>
                </div>
              </li>
            ))}
          </ul>

          <section aria-labelledby="legal-faq">
            <h2 id="legal-faq" style={h2}>{c.faqTitle}</h2>
            {c.faqs.map(f => (
              <details key={f.q} style={{ borderTop: "1px solid rgba(var(--accent),0.18)", padding: "4px 0" }}>
                <summary style={{ cursor: "pointer", padding: "16px 0", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "1rem", color: "rgb(var(--ink))" }}>{f.q}</summary>
                <p style={{ ...body, paddingBottom: 12 }}>{f.a}</p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid rgba(var(--accent),0.18)" }} />
          </section>

          <section style={{ margin: "56px 0 0", padding: "28px 32px", border: "1px solid rgba(var(--accent),0.18)", background: "rgb(var(--surface))" }}>
            <h2 style={{ ...h2, fontSize: "1.5rem", margin: "0 0 8px" }}>{c.guide.title}</h2>
            <p style={{ ...body, maxWidth: 600 }}>{c.guide.text}</p>
            <a href={pagePath("guia", lang)} style={{ color: "rgb(var(--accent))", textUnderlineOffset: 3, fontFamily: "'Jost', sans-serif" }}>{c.guide.link} →</a>
          </section>

          <p style={{ ...body, marginTop: 40, padding: "18px 22px", borderLeft: "3px solid rgb(var(--accent))", background: "rgb(var(--surface))", fontSize: "0.88rem" }}>{c.disclaimer}</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
