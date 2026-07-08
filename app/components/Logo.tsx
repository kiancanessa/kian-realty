export default function Logo({ size = 36, strokeColor = "#23221E" }: { size?: number; strokeColor?: string }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath id="ecr-roof-clip">
          <polygon points="34,8 6,58 62,58" />
        </clipPath>
      </defs>
      <g clipPath="url(#ecr-roof-clip)">
        <g stroke="#6B8A42" strokeWidth={7}>
          <line x1="-10" y1="72" x2="32" y2="-2" />
          <line x1="4" y1="72" x2="46" y2="-2" />
          <line x1="18" y1="72" x2="60" y2="-2" />
          <line x1="32" y1="72" x2="74" y2="-2" />
          <line x1="46" y1="72" x2="88" y2="-2" />
        </g>
      </g>
      <polygon points="34,8 6,58 62,58" fill="none" stroke={strokeColor} strokeWidth={4} strokeLinejoin="round" />
      <polygon points="90,30 62,58 118,58" fill="none" stroke={strokeColor} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  );
}
