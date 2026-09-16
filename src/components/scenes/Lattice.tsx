/**
 * The mashrabiya-style eight-fold lattice the dawn light passes through.
 * A pattern, not a building — and never architectural or religious imagery.
 *
 * One <pattern> tile, repeated. Held at very low contrast so it reads as texture.
 */
export function Lattice({ className = "" }: { className?: string }) {
  return (
    <svg className={`lattice ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="e2w-lattice" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {/* eight-point star built from two squares and the connecting octagon */}
            <rect x="30" y="30" width="60" height="60" />
            <rect x="30" y="30" width="60" height="60" transform="rotate(45 60 60)" />
            <circle cx="60" cy="60" r="42" />
            <path d="M60 0 L60 18 M60 102 L60 120 M0 60 L18 60 M102 60 L120 60" />
            <path d="M0 0 L18 18 M120 0 L102 18 M0 120 L18 102 M120 120 L102 102" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#e2w-lattice)" />
    </svg>
  );
}
