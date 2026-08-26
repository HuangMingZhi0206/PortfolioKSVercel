/**
 * Decorative lotus artwork used across the site.
 * Blue petals edged with gold, gold back petals, gold stamens —
 * drawn with soft asymmetric curves so it feels organic, not geometric.
 */

/** Full lotus flower with layered blue & gold petals over rippling water. */
export const Lotus = ({ className = '', opacity = 1 }) => (
  <svg
    viewBox="0 0 240 170"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lotus-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EBDDB4" />
        <stop offset="100%" stopColor="#C6A75E" />
      </linearGradient>
      <linearGradient id="lotus-gold-soft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F2E8C9" />
        <stop offset="100%" stopColor="#D4B878" />
      </linearGradient>
      <linearGradient id="lotus-center" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#93BBE0" />
        <stop offset="55%" stopColor="#4A86BE" />
        <stop offset="100%" stopColor="#2E6BAA" />
      </linearGradient>
      <linearGradient id="lotus-inner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#C4DAF0" />
        <stop offset="100%" stopColor="#3F7CB8" />
      </linearGradient>
      <linearGradient id="lotus-ripple" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#C6A75E" stopOpacity="0" />
        <stop offset="50%" stopColor="#93BBE0" />
        <stop offset="100%" stopColor="#C6A75E" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Outer gold petals — wide, reclining toward the water */}
    <g>
      <path
        d="M113 132 C 84 128, 54 112, 37 83 Q 34 77 40 79 C 73 90, 101 110, 113 132 Z"
        fill="url(#lotus-gold-soft)"
        opacity="0.8"
      />
      <path
        d="M127 132 C 156 128, 186 112, 203 83 Q 206 77 200 79 C 167 90, 139 110, 127 132 Z"
        fill="url(#lotus-gold-soft)"
        opacity="0.8"
      />
    </g>

    {/* Back gold petals, peeking between the blue ones */}
    <g fill="url(#lotus-gold)" opacity="0.9">
      <path
        d="M120 132 C 104 114, 100 82, 117 50 Q 120 45 124 52 C 138 82, 134 114, 120 132 Z"
        transform="rotate(-21 120 132)"
      />
      <path
        d="M120 132 C 104 114, 100 82, 117 50 Q 120 45 124 52 C 138 82, 134 114, 120 132 Z"
        transform="rotate(21 120 132)"
      />
    </g>

    {/* Inner blue petals, cupping inward */}
    <g stroke="#C6A75E" strokeWidth="1" strokeOpacity="0.35">
      <path
        d="M117 131 C 94 120, 76 96, 68 61 Q 67 55 72 58 C 98 74, 112 100, 117 131 Z"
        fill="url(#lotus-inner)"
      />
      <path
        d="M123 131 C 146 120, 164 96, 172 61 Q 173 55 168 58 C 142 74, 128 100, 123 131 Z"
        fill="url(#lotus-inner)"
      />
    </g>

    {/* Center petal */}
    <path
      d="M120 132 C 100 112, 97 74, 115 40 Q 120 32 125 40 C 143 74, 140 112, 120 132 Z"
      fill="url(#lotus-center)"
      stroke="#C6A75E"
      strokeWidth="1"
      strokeOpacity="0.4"
    />

    {/* Gold stamens */}
    <g fill="#C6A75E">
      <circle cx="112" cy="119" r="2" opacity="0.9" />
      <circle cx="120" cy="115" r="2.5" />
      <circle cx="128" cy="119" r="2" opacity="0.9" />
    </g>

    {/* Water ripples — gold fading into blue */}
    <g strokeLinecap="round" fill="none">
      <path d="M58 148 Q 120 162 182 148" stroke="url(#lotus-ripple)" strokeWidth="2.5" />
      <path d="M80 158 Q 120 168 160 158" stroke="url(#lotus-ripple)" strokeWidth="2" opacity="0.7" />
    </g>
  </svg>
)

/** Minimal three-petal mark with a gold water line, used as the logo. */
export const LotusMark = ({ size = 26, className = '' }) => (
  <svg
    viewBox="0 0 40 34"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M20 27 C 15.5 21, 15 11.5, 19 4.5 Q 20 3 21 4.5 C 25 11.5, 24.5 21, 20 27 Z"
      fill="currentColor"
    />
    <path
      d="M19 27 C 13.5 24, 8.5 18.5, 6.5 10.5 Q 6 8.5 8 9.5 C 14 13, 17.5 20, 19 27 Z"
      fill="currentColor"
      opacity="0.55"
    />
    <path
      d="M21 27 C 26.5 24, 31.5 18.5, 33.5 10.5 Q 34 8.5 32 9.5 C 26 13, 22.5 20, 21 27 Z"
      fill="currentColor"
      opacity="0.55"
    />
    <circle cx="20" cy="24" r="1.6" fill="#C6A75E" />
    <path
      d="M8 30.5 Q 20 34.5 32 30.5"
      stroke="#C6A75E"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
)
