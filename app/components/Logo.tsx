export default function Logo({ size = 36, strokeColor = "#3A3A38" }: { size?: number; strokeColor?: string }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        {/* Roof cap: just the upper third of the tall peak, not the whole triangle */}
        <clipPath id="ecr-roof-clip">
          <polygon points="34,6 20,32 48,32" />
        </clipPath>
      </defs>
      <g clipPath="url(#ecr-roof-clip)">
        <g stroke="#6B8A42" strokeWidth={7}>
          <line x1="-6" y1="60" x2="30" y2="-6" />
          <line x1="6" y1="60" x2="42" y2="-6" />
          <line x1="18" y1="60" x2="54" y2="-6" />
          <line x1="30" y1="60" x2="66" y2="-6" />
          <line x1="42" y1="60" x2="78" y2="-6" />
        </g>
      </g>
      {/* Tall peak */}
      <polygon points="34,6 6,58 62,58" fill="none" stroke={strokeColor} strokeWidth={5} strokeLinejoin="round" />
      {/* Short peak, overlapping to the right */}
      <polygon points="88,28 60,58 118,58" fill="none" stroke={strokeColor} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
}
