export default function Logo({ size = 36, strokeColor = "#23221E" }: { size?: number; strokeColor?: string }) {
  return (
    <svg width={size} height={size * (170 / 210)} viewBox="0 0 210 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {/* Roof block on the tall peak: bounded on the right by its left slope */}
        <clipPath id="ecr-roof-clip">
          <polygon points="10,8 100,8 55,90 10,90" />
        </clipPath>
        {/* Small roof cap echoed on the short peak's tip */}
        <clipPath id="ecr-notch-clip">
          <polygon points="150,42 133,78 167,78" />
        </clipPath>
      </defs>

      <g clipPath="url(#ecr-roof-clip)">
        <g stroke="#6B8A42" strokeWidth={9}>
          <line x1="-10" y1="100" x2="30" y2="-10" />
          <line x1="6" y1="100" x2="46" y2="-10" />
          <line x1="22" y1="100" x2="62" y2="-10" />
          <line x1="38" y1="100" x2="78" y2="-10" />
          <line x1="54" y1="100" x2="94" y2="-10" />
          <line x1="70" y1="100" x2="110" y2="-10" />
        </g>
      </g>
      <g clipPath="url(#ecr-notch-clip)">
        <rect x="120" y="35" width="60" height="50" fill="#6B8A42" />
      </g>

      {/* Short peak */}
      <polygon points="150,42 112,145 205,145" fill="none" stroke={strokeColor} strokeWidth={6} strokeLinejoin="round" />
      {/* Tall peak */}
      <polygon points="100,8 25,145 172,145" fill="none" stroke={strokeColor} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
}
