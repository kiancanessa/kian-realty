const PALETTE = [
  "#6B8A42", "#47592B", "#8A8578", "#B0472B", "#2B6E7A",
  "#8A5A2B", "#5A4A8A", "#2B7A5C", "#A87A3E", "#6B4A6E",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export default function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: colorFor(name), color: "#FAF6EE",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: size * 0.38,
        letterSpacing: "0.02em",
      }}
    >
      {initials(name)}
    </div>
  );
}
