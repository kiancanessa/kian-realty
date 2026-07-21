import type { CSSProperties } from "react";

export const GLASS: CSSProperties = {
  background: "rgba(var(--surface),0.32)",
  backdropFilter: "blur(28px) saturate(200%)",
  WebkitBackdropFilter: "blur(28px) saturate(200%)",
  border: "1px solid rgba(255,255,255,0.3)",
};

// More opaque variant for surfaces that sit over a dark dimming scrim
// (e.g. a modal backdrop) — a light-mode card needs real body behind it,
// not a see-through blend with the dark overlay, or text contrast breaks.
export const GLASS_SOLID: CSSProperties = {
  background: "rgba(var(--surface),0.92)",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.3)",
};
