import React from 'react';

interface RaceCarProps {
  color: string;
  accentColor: string;
  teamNumber: number;
  teamName: string;
  isMoving?: boolean;
  isBoosting?: boolean;
}

export const RaceCar: React.FC<RaceCarProps> = ({
  color,
  accentColor,
  teamNumber,
  isMoving = false,
  isBoosting = false,
}) => {
  return (
    <div className="relative flex items-center select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))' }}>
      {/* Boost or Exhaust Flames */}
      {(isBoosting || isMoving) && (
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-0">
          <span className={`inline-block animate-ping text-base ${isBoosting ? 'text-amber-400 scale-125' : 'text-orange-500'}`}>
            🔥
          </span>
        </div>
      )}

      {/* SVG Formula / Kart Car */}
      <svg
        viewBox="0 0 160 70"
        className="w-20 h-10 md:w-24 md:h-12 lg:w-28 lg:h-14 transition-transform duration-200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`car-grad-${teamNumber}`} x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor={color} />
            <stop offset="0.7" stopColor={color} />
            <stop offset="1" stopColor={accentColor} />
          </linearGradient>
          <linearGradient id="wheel-grad" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Rear Wing / Spoiler */}
        <path d="M12 18H32V24H12Z" fill="#0f172a" />
        <path d="M8 12H30V18H8Z" fill={color} stroke="#0f172a" strokeWidth="1.5" />
        <path d="M18 24L22 36H14L10 24H18Z" fill="#334155" />

        {/* Main Body Aero Chassis */}
        <path
          d="M20 40C20 34 26 30 38 28L80 26C95 26 115 30 135 37L148 41C154 43 158 46 158 50C158 54 154 56 146 56H25C20 56 18 52 18 46V40H20Z"
          fill={`url(#car-grad-${teamNumber})`}
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Front Wing / Nose Cone */}
        <path
          d="M136 44L156 46C158 48 158 52 154 54L136 54V44Z"
          fill="#0f172a"
        />
        <path
          d="M142 38L158 48L140 50L135 40L142 38Z"
          fill={accentColor}
        />

        {/* Cockpit & Driver Helmet */}
        <ellipse cx="78" cy="31" rx="14" ry="7" fill="#020617" />
        {/* Helmet */}
        <circle cx="78" cy="27" r="7" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <path d="M78 24H83V28H78V24Z" fill="#0284c7" /> {/* Visor */}

        {/* Racing Number Badge */}
        <circle cx="106" cy="42" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
        <text
          x="106"
          y="46"
          fill="#0f172a"
          fontSize="11"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="system-ui"
        >
          {teamNumber}
        </text>

        {/* Side Pod Decals */}
        <path d="M50 36L72 35L68 44L46 44Z" fill="rgba(255,255,255,0.3)" />

        {/* Wheels (Rear and Front) */}
        {/* Rear Wheel */}
        <rect x="24" y="38" width="22" height="26" rx="5" fill="url(#wheel-grad)" stroke="#475569" strokeWidth="1.5" />
        <circle cx="35" cy="51" r="5" fill="#94a3b8" />
        <circle cx="35" cy="51" r="2.5" fill="#f8fafc" />

        {/* Front Wheel */}
        <rect x="114" y="38" width="20" height="26" rx="5" fill="url(#wheel-grad)" stroke="#475569" strokeWidth="1.5" />
        <circle cx="124" cy="51" r="4.5" fill="#94a3b8" />
        <circle cx="124" cy="51" r="2.5" fill="#f8fafc" />

        {/* Speed lines */}
        <line x1="50" y1="52" x2="100" y2="52" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.8" />
      </svg>
    </div>
  );
};
