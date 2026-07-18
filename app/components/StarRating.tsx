"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const interactive = !!onChange;
  const active = hover || value;

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{ background: "none", border: "none", padding: 0, cursor: interactive ? "pointer" : "default", display: "flex", lineHeight: 0 }}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}>
          <Star
            size={size}
            color="rgb(var(--accent))"
            fill={active >= i ? "rgb(var(--accent))" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
