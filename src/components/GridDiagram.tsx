import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface GridDiagramProps {
  solarOutput: number;
  isReversed: boolean;
}

const GridDiagram = ({ solarOutput, isReversed }: GridDiagramProps) => {
  const [animOffset, setAnimOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const flowColor = isReversed ? "#f59e0b" : "#0ea5e9";

  return (
    <div className="glow-card p-6 h-full flex flex-col">
      <h2 className="font-display text-xs tracking-widest text-primary mb-4 glow-text-blue flex items-center gap-2">
        <Zap size={14} /> DIGITAL TWIN — GRID TOPOLOGY
      </h2>

      <div className="flex-1 relative">
        <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background grid */}
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(195 100% 50% / 0.05)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={flowColor} stopOpacity="0" />
              <stop offset="50%" stopColor={flowColor} stopOpacity="1" />
              <stop offset="100%" stopColor={flowColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="800" height="300" fill="url(#smallGrid)" />

          {/* Solar Panel */}
          <g transform="translate(80, 100)" filter="url(#glow)">
            <rect x="-35" y="-35" width="70" height="70" rx="8" fill="hsl(220 25% 12%)" stroke={solarOutput > 50 ? "#facc15" : "#0ea5e9"} strokeWidth="1.5" />
            {/* Sun icon as SVG */}
            <circle cx="0" cy="-48" r="8" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <line x1="0" y1="-60" x2="0" y2="-56" stroke="#facc15" strokeWidth="1.5" />
            <line x1="0" y1="-40" x2="0" y2="-36" stroke="#facc15" strokeWidth="1.5" />
            <line x1="-12" y1="-48" x2="-8" y2="-48" stroke="#facc15" strokeWidth="1.5" />
            <line x1="8" y1="-48" x2="12" y2="-48" stroke="#facc15" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="10" fontFamily="Orbitron">SOLAR</text>
            <text x="0" y="20" textAnchor="middle" fill="#facc15" fontSize="9" fontFamily="Share Tech Mono">{solarOutput.toFixed(0)} kW</text>
          </g>

          {/* Flow line Solar → Feeder */}
          <line x1="150" y1="100" x2="300" y2="100" stroke="hsl(195 100% 50% / 0.2)" strokeWidth="2" />
          <line
            x1="150" y1="100" x2="300" y2="100"
            stroke={flowColor}
            strokeWidth="2"
            strokeDasharray="8 12"
            strokeDashoffset={isReversed ? animOffset : -animOffset}
            opacity="0.8"
          />

          {/* Distribution Feeder */}
          <g transform="translate(350, 100)" filter="url(#glow)">
            <rect x="-45" y="-35" width="90" height="70" rx="8" fill="hsl(220 25% 12%)" stroke="#0ea5e9" strokeWidth="1.5" />
            {/* Zap icon */}
            <polygon points="0,-55 -5,-45 -1,-45 -3,-35 5,-47 1,-47 3,-55" fill="#0ea5e9" />
            <text x="0" y="0" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="9" fontFamily="Orbitron">DISTRIBUTION</text>
            <text x="0" y="14" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="9" fontFamily="Orbitron">FEEDER</text>
          </g>

          {/* Flow line Feeder → Transformer */}
          <line x1="440" y1="100" x2="560" y2="100" stroke="hsl(195 100% 50% / 0.2)" strokeWidth="2" />
          <line
            x1="440" y1="100" x2="560" y2="100"
            stroke={flowColor}
            strokeWidth="2"
            strokeDasharray="8 12"
            strokeDashoffset={isReversed ? animOffset : -animOffset}
            opacity="0.8"
          />

          {/* Transformer */}
          <g transform="translate(610, 100)" filter="url(#glow)">
            <rect x="-40" y="-35" width="80" height="70" rx="8" fill="hsl(220 25% 12%)" stroke="#22d3ee" strokeWidth="1.5" />
            {/* Plug icon */}
            <circle cx="-6" cy="-48" r="6" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
            <circle cx="6" cy="-48" r="6" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="9" fontFamily="Orbitron">TRANSFORMER</text>
          </g>

          {/* Flow line Transformer → Loads (L-shaped path) */}
          <path d="M 650 100 L 700 100 L 700 220" stroke="hsl(195 100% 50% / 0.2)" strokeWidth="2" fill="none" />
          <path
            d="M 650 100 L 700 100 L 700 220"
            stroke="#0ea5e9"
            strokeWidth="2"
            strokeDasharray="8 12"
            strokeDashoffset={-animOffset}
            opacity="0.8"
            fill="none"
          />

          {/* Loads */}
          <g transform="translate(700, 255)" filter="url(#glow)">
            <rect x="-35" y="-30" width="70" height="60" rx="8" fill="hsl(220 25% 12%)" stroke="#10b981" strokeWidth="1.5" />
            {/* House icon */}
            <polygon points="0,-48 -10,-38 10,-38" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <rect x="-8" y="-38" width="16" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <text x="0" y="5" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="10" fontFamily="Orbitron">LOADS</text>
          </g>

          {/* Flow direction label */}
          <text x="400" y="260" textAnchor="middle" fill={isReversed ? "#f59e0b" : "#0ea5e9"} fontSize="11" fontFamily="Share Tech Mono">
            {isReversed ? "WARNING: REVERSE POWER FLOW DETECTED" : "NORMAL POWER FLOW"}
          </text>
        </svg>
      </div>
    </div>
  );
};

export default GridDiagram;
