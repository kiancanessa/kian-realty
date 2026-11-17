"use client";
import { Sparkles } from "lucide-react";
import { useLang } from "../lib/LangContext";

/** "Exclusive" marker for the agency's own inventory (EasyBroker and the ones
 *  published from the admin). Allied listings arrive with a neutral "REF-" id
 *  and get no marker, so nothing tells the visitor whose they are. */
export default function ExclusiveBadge({ id, top, left }: { id: string; top: number; left: number }) {
  const { t } = useLang();
  if (id.startsWith("REF-")) return null;
  return (
    <div style={{
      position: "absolute", top, left, display: "flex", alignItems: "center", gap: 6, padding: "4px 12px",
      background: "rgba(10,10,10,0.78)", border: "1px solid rgba(var(--accent-light),0.75)", color: "#FAF6EE",
      fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
    }}>
      <Sparkles size={11} color="rgb(var(--accent-light))" aria-hidden /> {t.property.exclusive}
    </div>
  );
}
