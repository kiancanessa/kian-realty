import Navbar from "./Navbar";
import Footer from "./Footer";
import YieldCalculator from "./YieldCalculator";
import { CALC } from "../lib/calcContent";
import { CHROME } from "../lib/landingPages";
import { LINK_LABELS, pagePath, type Lang, type PageKey } from "../lib/seoSlugs";

const SITE = "https://elcasarosaritogroup.com";
const RELATED: PageKey[] = ["rentas", "condominios", "casas", "asesoria-legal"];

const body: React.CSSProperties = { fontFamily: "'Jost', sans-serif", fontSize: "1.02rem", lineHeight: 1.85, color: "rgba(var(--ink),0.78)", marginBottom: 16 };
const h2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.1rem)", color: "rgb(var(--ink))", margin: "56px 0 18px" };

/** The rental-yield calculator, with the text around it. */
export default function CalcPage({ lang }: { lang: Lang }) {
  const c = CALC[lang];
  const ui = CHROME[lang];
  const url = `${SITE}${pagePath("calculadora-rentabilidad", lang)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: lang === "es" ? `${SITE}/es` : SITE },
        { "@type": "ListItem", position: 2, name: c.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "WebApplication", name: c.title, description: c.description, url, inLanguage: lang,
      applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "RealEstateAgent", name: "El Casa Rosarito", url: SITE },
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <main style={{ padding: "140px 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(var(--ink),0.5)", marginBottom: 28 }}>
            <a href={lang === "es" ? "/es" : "/"} style={{ color: "inherit" }}>{ui.home}</a>
            <span aria-hidden> / </span>
            <span aria-current="page">{c.h1}</span>
          </nav>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.3rem, 5vw, 3.6rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 24 }}>{c.h1}</h1>
          <div style={{ maxWidth: 760 }}>{c.intro.map(t => <p key={t} style={body}>{t}</p>)}</div>

          <YieldCalculator lang={lang} />

          <section aria-labelledby="calc-faq" style={{ maxWidth: 820 }}>
            <h2 id="calc-faq" style={h2}>{c.faqTitle}</h2>
            {c.faqs.map(f => (
              <details key={f.q} style={{ borderTop: "1px solid rgba(var(--accent),0.18)", padding: "4px 0" }}>
                <summary style={{ cursor: "pointer", padding: "16px 0", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "1rem", color: "rgb(var(--ink))" }}>{f.q}</summary>
                <p style={{ ...body, paddingBottom: 12 }}>{f.a}</p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid rgba(var(--accent),0.18)" }} />
          </section>

          <p style={{ ...body, margin: "40px 0", padding: "18px 22px", borderLeft: "3px solid rgb(var(--accent))", background: "rgb(var(--surface))", fontSize: "0.88rem" }}>{c.disclaimer}</p>

          <section aria-labelledby="calc-related">
            <h2 id="calc-related" style={{ ...h2, margin: "0 0 16px" }}>{c.related}</h2>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 12, listStyle: "none", padding: 0 }}>
              {RELATED.map(k => (
                <li key={k}>
                  <a href={pagePath(k, lang)} style={{ display: "inline-block", padding: "12px 20px", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--ink))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem" }}>
                    {LINK_LABELS[k][lang]}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
