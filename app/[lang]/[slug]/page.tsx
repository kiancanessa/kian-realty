import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LandingGrid from "../../components/LandingGrid";
import GuidePage from "../../components/GuidePage";
import { GUIDE } from "../../lib/guideContent";
import { getAllListings } from "../../lib/listings";
import { orderProperties, type PropertyCard } from "../../lib/easybroker";
import { whatsappLink } from "../../lib/sendInquiry";
import { JORGE_WHATSAPP } from "../../lib/contact";
import {
  LANGS, LINK_LABELS, PAGE_SLUGS, isLang, keyFromSlug, pagePath, type Lang, type PageKey,
} from "../../lib/seoSlugs";
import { CHROME, LANDINGS, describeStock, getLanding, type Landing } from "../../lib/landingPages";

const SITE = "https://elcasarosaritogroup.com";
const MAX_LISTED = 24;

// The inventory changes through the day; the page follows it hourly.
export const revalidate = 3600;
export const dynamicParams = false;

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return [
    ...LANDINGS.flatMap(l => LANGS.map(lang => ({ lang, slug: PAGE_SLUGS[l.key][lang] }))),
    ...LANGS.map(lang => ({ lang, slug: PAGE_SLUGS.guia[lang] })),
  ];
}

type Resolved = { kind: "guide"; lang: Lang } | { kind: "landing"; lang: Lang; landing: Landing };

async function resolve(params: Props["params"]): Promise<Resolved | null> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return null;
  const key = keyFromSlug(lang, slug);
  if (key === "guia") return { kind: "guide", lang };
  const landing = key ? getLanding(key) : undefined;
  return landing ? { kind: "landing", lang, landing } : null;
}

function languageAlternates(key: PageKey) {
  return { es: pagePath(key, "es"), en: pagePath(key, "en"), "x-default": pagePath(key, "en") };
}

async function stockFor(landing: Landing): Promise<PropertyCard[]> {
  const all = (await getAllListings()).map(l => l.card);
  return orderProperties(all.filter(landing.matches));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  if (!found) return {};
  const { lang } = found;
  if (found.kind === "guide") {
    const g = GUIDE[lang];
    return {
      title: g.title,
      description: g.description,
      alternates: { canonical: pagePath("guia", lang), languages: languageAlternates("guia") },
      openGraph: {
        title: g.title, description: g.description, url: `${SITE}${pagePath("guia", lang)}`, siteName: "El Casa Rosarito", type: "article",
        locale: lang === "es" ? "es_MX" : "en_US", alternateLocale: [lang === "es" ? "en_US" : "es_MX"],
      },
    };
  }
  const { landing } = found;
  const copy = landing.copy[lang];
  const url = `${SITE}${pagePath(landing.key, lang)}`;
  const stock = await stockFor(landing);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: pagePath(landing.key, lang), languages: languageAlternates(landing.key) },
    // A page with nothing to show is not worth a place in search results.
    robots: stock.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: copy.title, description: copy.description, url, siteName: "El Casa Rosarito", type: "website",
      locale: lang === "es" ? "es_MX" : "en_US", alternateLocale: [lang === "es" ? "en_US" : "es_MX"],
    },
  };
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "rgb(var(--ink))", marginBottom: 20,
};
const bodyText: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif", fontSize: "0.98rem", lineHeight: 1.85, color: "rgba(var(--ink),0.75)", marginBottom: 16,
};
const linkStyle: React.CSSProperties = { color: "rgb(var(--accent))", textUnderlineOffset: 3 };

export default async function LandingPage({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  const { lang } = found;
  if (found.kind === "guide") return <GuidePage lang={lang} />;
  const { landing } = found;
  const copy = landing.copy[lang];
  const ui = CHROME[lang];
  const stock = await stockFor(landing);
  const shown = stock.slice(0, MAX_LISTED);
  const summary = describeStock(stock, lang);
  const allHref = "/propiedades";

  const pageUrl = `${SITE}${pagePath(landing.key, lang)}`;
  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: lang === "es" ? `${SITE}/es` : SITE },
        { "@type": "ListItem", position: 2, name: copy.h1, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "CollectionPage", name: copy.h1, description: copy.description, url: pageUrl, inLanguage: lang,
      mainEntity: {
        "@type": "ItemList", numberOfItems: stock.length,
        itemListElement: shown.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/propiedades/${p.id}` })),
      },
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "rgb(var(--bg))" }}>
      <Navbar />
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <main style={{ padding: "140px 24px 96px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(var(--ink),0.5)", marginBottom: 28 }}>
            <a href={lang === "es" ? "/es" : "/"} style={{ color: "inherit" }}>{ui.home}</a>
            <span aria-hidden> / </span>
            <span aria-current="page">{copy.h1}</span>
          </nav>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgb(var(--ink))", fontSize: "clamp(2.3rem, 5vw, 3.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>
            {copy.h1}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.06em", color: "rgb(var(--accent))", marginBottom: 32 }}>
            {ui.available(stock.length)}{summary ? ` — ${summary}` : ""}
          </p>

          <div style={{ maxWidth: 760, marginBottom: 56 }}>
            {copy.intro.map(p => <p key={p} style={bodyText}>{p}</p>)}
          </div>

          {shown.length > 0 ? (
            <>
              <LandingGrid properties={shown} />
              {stock.length > shown.length && (
                <p style={{ ...bodyText, marginTop: 24 }}>
                  <a href={allHref} style={linkStyle}>{ui.viewAll} →</a>
                </p>
              )}
            </>
          ) : (
            <p style={{ ...bodyText, padding: "32px", border: "1px dashed rgba(var(--accent),0.3)" }}>
              {ui.none} <a href={allHref} style={linkStyle}>{ui.viewAll}</a>
            </p>
          )}

          <section style={{ margin: "72px 0", padding: "36px 32px", border: "1px solid rgba(var(--accent),0.18)", background: "rgb(var(--surface))" }}>
            <h2 style={{ ...sectionTitle, marginBottom: 10 }}>{ui.ctaTitle}</h2>
            <p style={{ ...bodyText, maxWidth: 560 }}>{ui.ctaText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={whatsappLink(JORGE_WHATSAPP, ui.whatsappMessage(copy.h1))} target="_blank" rel="noopener noreferrer"
                style={{ padding: "14px 26px", background: "#25D366", color: "#08260f", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {ui.whatsapp}
              </a>
              <a href={lang === "es" ? "/es#contact" : "/#contact"}
                style={{ padding: "14px 26px", border: "1px solid rgb(var(--accent))", color: "rgb(var(--accent))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.76rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {ui.contact}
              </a>
            </div>
          </section>

          <section aria-labelledby="faq-title" style={{ maxWidth: 820, marginBottom: 72 }}>
            <h2 id="faq-title" style={sectionTitle}>{ui.faq}</h2>
            {copy.faqs.map(f => (
              <details key={f.q} style={{ borderTop: "1px solid rgba(var(--accent),0.18)", padding: "4px 0" }}>
                <summary style={{ cursor: "pointer", padding: "16px 0", fontFamily: "'Jost', sans-serif", fontWeight: 500, fontSize: "1rem", color: "rgb(var(--ink))" }}>{f.q}</summary>
                <p style={{ ...bodyText, paddingBottom: 12 }}>{f.a}</p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid rgba(var(--accent),0.18)" }} />
          </section>

          <section aria-labelledby="related-title">
            <h2 id="related-title" style={sectionTitle}>{ui.related}</h2>
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 12, listStyle: "none", padding: 0 }}>
              {landing.related.map((k: PageKey) => (
                <li key={k}>
                  <a href={pagePath(k, lang)} style={{ display: "inline-block", padding: "12px 20px", border: "1px solid rgba(var(--accent),0.3)", color: "rgb(var(--ink))", textDecoration: "none", fontFamily: "'Jost', sans-serif", fontSize: "0.85rem" }}>
                    {LINK_LABELS[k][lang]}
                  </a>
                </li>
              ))}
            </ul>
            <p style={{ ...bodyText, marginTop: 28 }}>
              <strong style={{ fontWeight: 500 }}>{ui.guideTitle}.</strong> {ui.guideText}{" "}
              <a href={pagePath("guia", lang)} style={linkStyle}>{ui.guideLink} →</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
