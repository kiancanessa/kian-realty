import Navbar from "./Navbar";
import Footer from "./Footer";
import GuideDownload from "./GuideDownload";
import { GUIDE, GUIDE_UPDATED } from "../lib/guideContent";
import { CHROME } from "../lib/landingPages";
import { LINK_LABELS, pagePath, type Lang, type PageKey } from "../lib/seoSlugs";
import { whatsappLink } from "../lib/sendInquiry";
import { VERONICA_WHATSAPP } from "../lib/contact";

const SITE = "https://elcasarosaritogroup.com";
const RELATED: PageKey[] = ["casas", "condominios", "terrenos", "frente-al-mar"];

const h2: React.CSSProperties = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.1rem)", color: "rgb(var(--ink))", margin: "52px 0 16px" };
const p: React.CSSProperties = { fontFamily: "'Jost', sans-serif", fontSize: "1.02rem", lineHeight: 1.85, color: "rgba(var(--ink),0.78)", marginBottom: 16 };

/** The guide to buying property in Mexico, as a page. Its text lives in
 *  lib/guideContent.ts, shared with the PDF. */
export default function GuidePage({ lang }: { lang: Lang }) {
  const g = GUIDE[lang];
  const ui = CHROME[lang];
  const url = `${SITE}${pagePath("guia", lang)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: lang === "es" ? `${SITE}/es` : SITE },
        { "@type": "ListItem", position: 2, name: g.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "Article", headline: g.h1, description: g.description, inLanguage: lang, url,
      datePublished: GUIDE_UPDATED, dateModified: GUIDE_UPDATED,
      author: { "@type": "Organization", name: "El Casa Rosarito", url: SITE },
      publisher: { "@type": "Organization", name: "El Casa Rosarito", url: SITE },
      mainEntityOfPage: url,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <main style={{ padding: "140px 24px 96px" }}>
        <article style={{ maxWidth: 780, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(var(--ink),0.5)", marginBottom: 28 }}>
            <a href={lang === "es" ? "/es" : "/"} style={{ color: "inherit" }}>{ui.home}</a>
            <span aria-hidden> / </span>
            <span aria-current="page">{g.h1}</span>
          </nav>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.3rem, 5vw, 3.6rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>
            {g.h1}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em", color: "rgb(var(--accent))", marginBottom: 32 }}>{g.updated}</p>

          {g.intro.map(t => <p key={t} style={p}>{t}</p>)}

          <GuideDownload lang={lang} />

          {g.sections.map(s => (
            <section key={s.h2}>
              <h2 style={h2}>{s.h2}</h2>
              {s.paragraphs?.map(t => <p key={t} style={p}>{t}</p>)}
              {s.bullets && (
                <ul style={{ ...p, paddingLeft: 22 }}>
                  {s.bullets.map(b => <li key={b} style={{ marginBottom: 8 }}>{b}</li>)}
                </ul>
              )}
              {s.steps && (
                <ol style={{ ...p, paddingLeft: 24 }}>
                  {s.steps.map(b => <li key={b} style={{ marginBottom: 12, paddingLeft: 6 }}>{b}</li>)}
                </ol>
              )}
            </section>
          ))}

          {/* From the guide to the person who answers the legal questions it raises. */}
          <section aria-labelledby="guide-legal" data-placement="legal-advisor"
            style={{ margin: "56px 0 0", padding: "32px", border: "1px solid rgba(var(--accent),0.3)", background: "rgb(var(--surface))" }}>
            <h2 id="guide-legal" style={{ ...h2, margin: "0 0 10px" }}>{g.legal.title}</h2>
            <p style={{ ...p, maxWidth: 600 }}>{g.legal.text}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={whatsappLink(VERONICA_WHATSAPP, g.legal.whatsappMessage)} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "14px 26px", background: "#25D366", color: "#08260f", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {g.legal.whatsapp}
              </a>
              <a href={pagePath("asesoria-legal", lang)}
                style={{ display: "inline-block", padding: "14px 26px", border: "1px solid rgb(var(--accent))", color: "rgb(var(--accent))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {g.legal.page}
              </a>
            </div>
          </section>

          <p style={{ ...p, margin: "40px 0 56px", padding: "20px 24px", borderLeft: "3px solid rgb(var(--accent))", background: "rgb(var(--surface))", fontSize: "0.9rem" }}>{g.disclaimer}</p>

          <section aria-labelledby="guide-related">
            <h2 id="guide-related" style={{ ...h2, margin: "0 0 16px" }}>{ui.related}</h2>
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
        </article>
      </main>
      <Footer />
    </div>
  );
}
