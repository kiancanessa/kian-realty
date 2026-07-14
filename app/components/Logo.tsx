export default function Logo({ size = 36, strokeColor = "rgb(var(--ink))" }: { size?: number; strokeColor?: string }) {
  return (
    <svg width={size} height={size * (158 / 210)} viewBox="0 0 210 158" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {/* Stripe block bounded on the right by the tall peak's own left slope */}
        <clipPath id="ecr-roof-clip">
          <polygon points="5,5 108,5 73,95 5,95" />
        </clipPath>
        {/* Painted tip on the small peak */}
        <clipPath id="ecr-tip-clip">
          <polygon points="150,62 131,98 169,98" />
        </clipPath>
      </defs>

      <g clipPath="url(#ecr-roof-clip)">
        <g stroke="rgb(var(--accent))" strokeWidth={9}>
          <line x1="-10" y1="100" x2="30" y2="-10" />
          <line x1="6" y1="100" x2="46" y2="-10" />
          <line x1="22" y1="100" x2="62" y2="-10" />
          <line x1="38" y1="100" x2="78" y2="-10" />
          <line x1="54" y1="100" x2="94" y2="-10" />
          <line x1="70" y1="100" x2="110" y2="-10" />
        </g>
      </g>
      <g clipPath="url(#ecr-tip-clip)">
        <rect x="120" y="55" width="60" height="50" fill="rgb(var(--accent))" />
      </g>

      {/* Small peak */}
      <polygon points="150,62 100,158 200,158" fill="none" stroke={strokeColor} strokeWidth={6} strokeLinejoin="round" />
      {/* Tall peak */}
      <polygon points="108,5 48,158 168,158" fill="none" stroke={strokeColor} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
}
