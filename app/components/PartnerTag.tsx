"use client";
import type { ListingPartner } from "../lib/propertyFormat";
import { useLang } from "../lib/LangContext";

/** Small origin badge on a listing that belongs to an allied agency, so a
 *  visitor always knows whose house they are looking at. On a card it is a
 *  plain tag (the whole card is already a link); on the detail page it can
 *  carry the link to the owner's site. */
export default function PartnerTag({ partner, href, style }: { partner: ListingPartner; href?: string; style?: React.CSSProperties }) {
  const { t } = useLang();
  const label = t.property.partnerListing.replace("{name}", partner.name);

  const content = (
    <>
      {partner.logo && (
        // The logo is served by the partner; a broken one just disappears.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={partner.logo} alt="" aria-hidden width={14} height={14}
          style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0 }} />
      )}
      {label}
    </>
  );

  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 10px", borderRadius: 999,
    background: "rgba(250,246,238,0.92)", color: "rgba(35,34,30,0.75)",
    border: "1px solid rgba(35,34,30,0.12)",
    fontFamily: "'Jost', sans-serif", fontSize: "0.66rem", letterSpacing: "0.04em",
    whiteSpace: "nowrap", textDecoration: "none",
    ...style,
  };

  if (!href) return <span style={base}>{content}</span>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={base}
      onClick={e => e.stopPropagation()}>
      {content}
    </a>
  );
}
