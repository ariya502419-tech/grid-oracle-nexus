import { useEffect, useState } from "react";

interface GridDiagramProps {
  solarOutput: number;
  isReversed: boolean;
}

const GridDiagram = ({ solarOutput, isReversed }: GridDiagramProps) => {
  const [animOffset, setAnimOffset] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimOffset((prev) => (prev + 1) % 100);
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const flowColor = isReversed ? "#f59e0b" : "#0ea5e9";
  const nodePulse = 0.6 + Math.sin(pulsePhase) * 0.4;

  return (
    <div className="glow-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="8" r="6" stroke="#0ea5e9" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="8" cy="8" r="1.5" fill="#0ea5e9" />
        </svg>
        <h2 className="font-display text-xs tracking-widest text-primary glow-text-blue">
          DIGITAL TWIN — GRID NETWORK TOPOLOGY
        </h2>
      </div>

      <div className="flex-1 relative">
        <svg viewBox="0 0 900 340" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Grid background pattern */}
            <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(195 100% 50% / 0.04)" strokeWidth="0.5" />
            </pattern>
            <pattern id="gridPatternLg" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="hsl(195 100% 50% / 0.08)" strokeWidth="0.5" />
            </pattern>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Transformer icon */}
            <symbol id="transformerIcon" viewBox="0 0 40 40">
              <circle cx="15" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="25" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="10" x2="5" y2="30" stroke="currentColor" strokeWidth="1.5" />
              <line x1="35" y1="10" x2="35" y2="30" stroke="currentColor" strokeWidth="1.5" />
            </symbol>
          </defs>

          {/* Background grids */}
          <rect width="900" height="340" fill="url(#gridPattern)" />
          <rect width="900" height="340" fill="url(#gridPatternLg)" />

          {/* ===== CONNECTION LINES (drawn first, behind nodes) ===== */}
          
          {/* Solar → Feeder line */}
          <line x1="175" y1="120" x2="370" y2="120" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="2" />
          <line x1="175" y1="120" x2="370" y2="120" stroke={flowColor} strokeWidth="2" strokeDasharray="6 10" strokeDashoffset={isReversed ? animOffset : -animOffset} opacity="0.7" filter="url(#lineGlow)" />

          {/* Feeder → Transformer line */}
          <line x1="520" y1="120" x2="680" y2="120" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="2" />
          <line x1="520" y1="120" x2="680" y2="120" stroke={flowColor} strokeWidth="2" strokeDasharray="6 10" strokeDashoffset={isReversed ? animOffset : -animOffset} opacity="0.7" filter="url(#lineGlow)" />

          {/* Transformer → Load junction */}
          <line x1="780" y1="145" x2="780" y2="210" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="2" />
          <line x1="780" y1="145" x2="780" y2="210" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="6 10" strokeDashoffset={-animOffset} opacity="0.7" filter="url(#lineGlow)" />

          {/* Load distribution lines */}
          <line x1="780" y1="210" x2="660" y2="280" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="1.5" />
          <line x1="780" y1="210" x2="660" y2="280" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 8" strokeDashoffset={-animOffset} opacity="0.5" filter="url(#lineGlow)" />
          
          <line x1="780" y1="210" x2="780" y2="280" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="1.5" />
          <line x1="780" y1="210" x2="780" y2="280" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 8" strokeDashoffset={-animOffset} opacity="0.5" filter="url(#lineGlow)" />
          
          <line x1="780" y1="210" x2="850" y2="260" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="1.5" />
          <line x1="780" y1="210" x2="850" y2="260" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 8" strokeDashoffset={-animOffset} opacity="0.5" filter="url(#lineGlow)" />

          {/* ===== NODE 1: SOLAR GENERATION ===== */}
          <g transform="translate(110, 120)">
            {/* Outer ring */}
            <circle r="52" fill="none" stroke="hsl(45 100% 55% / 0.15)" strokeWidth="1" />
            {/* Node background */}
            <circle r="42" fill="hsl(220 25% 8%)" stroke={`hsl(45 100% 55% / ${0.3 + nodePulse * 0.3})`} strokeWidth="1.5" filter="url(#nodeGlow)" />
            {/* Solar panel icon */}
            <g transform="translate(-16, -20)">
              {/* Panel frame */}
              <rect x="0" y="0" width="32" height="24" rx="2" fill="none" stroke="#facc15" strokeWidth="1.2" />
              {/* Panel cells */}
              <line x1="11" y1="0" x2="11" y2="24" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              <line x1="21" y1="0" x2="21" y2="24" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              <line x1="0" y1="8" x2="32" y2="8" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              <line x1="0" y1="16" x2="32" y2="16" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              {/* Sun rays */}
              <circle cx="30" cy="-8" r="4" fill="none" stroke={`hsl(45 100% 60% / ${nodePulse})`} strokeWidth="1" />
              <circle cx="30" cy="-8" r="1.5" fill={`hsl(45 100% 60% / ${nodePulse})`} />
              <line x1="30" y1="-16" x2="30" y2="-14" stroke={`hsl(45 100% 60% / ${nodePulse * 0.8})`} strokeWidth="0.8" />
              <line x1="36" y1="-12" x2="38" y2="-14" stroke={`hsl(45 100% 60% / ${nodePulse * 0.8})`} strokeWidth="0.8" />
              <line x1="24" y1="-12" x2="22" y2="-14" stroke={`hsl(45 100% 60% / ${nodePulse * 0.8})`} strokeWidth="0.8" />
            </g>
            <text y="35" textAnchor="middle" fill="#facc15" fontSize="8" fontFamily="Orbitron" letterSpacing="1">SOLAR GEN</text>
            <text y="46" textAnchor="middle" fill="hsl(45 100% 55% / 0.7)" fontSize="8" fontFamily="Share Tech Mono">{solarOutput.toFixed(0)} kW</text>
          </g>

          {/* ===== NODE 2: DISTRIBUTION FEEDER ===== */}
          <g transform="translate(445, 120)">
            <circle r="60" fill="none" stroke="hsl(195 100% 50% / 0.12)" strokeWidth="1" />
            <circle r="48" fill="hsl(220 25% 8%)" stroke={`hsl(195 100% 50% / ${0.3 + nodePulse * 0.3})`} strokeWidth="1.5" filter="url(#nodeGlow)" />
            {/* Power line tower icon */}
            <g transform="translate(-14, -22)">
              {/* Tower structure */}
              <line x1="14" y1="0" x2="14" y2="32" stroke="#0ea5e9" strokeWidth="1.5" />
              <line x1="6" y1="32" x2="22" y2="32" stroke="#0ea5e9" strokeWidth="1.2" />
              {/* Cross arms */}
              <line x1="2" y1="6" x2="26" y2="6" stroke="#0ea5e9" strokeWidth="1.2" />
              <line x1="5" y1="16" x2="23" y2="16" stroke="#0ea5e9" strokeWidth="1" />
              {/* Insulators */}
              <circle cx="4" cy="6" r="2" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.8" />
              <circle cx="24" cy="6" r="2" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.8" />
              <circle cx="7" cy="16" r="1.5" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.8" />
              <circle cx="21" cy="16" r="1.5" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.8" />
              {/* Power lines extending */}
              <line x1="0" y1="6" x2="-4" y2="4" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.5" />
              <line x1="28" y1="6" x2="32" y2="4" stroke="#0ea5e9" strokeWidth="0.6" opacity="0.5" />
            </g>
            <text y="40" textAnchor="middle" fill="#0ea5e9" fontSize="7" fontFamily="Orbitron" letterSpacing="1">DISTRIBUTION</text>
            <text y="50" textAnchor="middle" fill="#0ea5e9" fontSize="7" fontFamily="Orbitron" letterSpacing="1">FEEDER NETWORK</text>
          </g>

          {/* ===== NODE 3: TRANSFORMER ===== */}
          <g transform="translate(740, 120)">
            <circle r="52" fill="none" stroke="hsl(180 100% 50% / 0.12)" strokeWidth="1" />
            <circle r="42" fill="hsl(220 25% 8%)" stroke={`hsl(180 100% 50% / ${0.3 + nodePulse * 0.3})`} strokeWidth="1.5" filter="url(#nodeGlow)" />
            {/* Transformer schematic */}
            <g transform="translate(-16, -16)">
              {/* Coils */}
              <circle cx="12" cy="16" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
              <circle cx="22" cy="16" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.2" />
              {/* Core lines */}
              <line x1="16" y1="4" x2="16" y2="28" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4" />
              <line x1="18" y1="4" x2="18" y2="28" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4" />
              {/* Electric pulse */}
              <circle cx="17" cy="16" r={`${3 + nodePulse * 2}`} fill={`hsl(180 100% 50% / ${nodePulse * 0.3})`} />
            </g>
            <text y="36" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="Orbitron" letterSpacing="1">STEP-DOWN</text>
            <text y="46" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="Orbitron" letterSpacing="1">TRANSFORMER</text>
          </g>

          {/* ===== LOAD NODES ===== */}
          {/* Residential */}
          <g transform="translate(640, 290)">
            <circle r="28" fill="hsl(220 25% 8%)" stroke="hsl(150 80% 45% / 0.3)" strokeWidth="1" filter="url(#nodeGlow)" />
            <g transform="translate(-10, -14)">
              {/* House icon */}
              <polygon points="10,0 0,8 20,8" fill="none" stroke="#10b981" strokeWidth="1" />
              <rect x="3" y="8" width="14" height="12" fill="none" stroke="#10b981" strokeWidth="1" />
              <rect x="8" y="12" width="5" height="8" fill="none" stroke="#10b981" strokeWidth="0.8" />
            </g>
            <text y="22" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="Share Tech Mono">RESIDENTIAL</text>
          </g>
          
          {/* Industrial */}
          <g transform="translate(780, 300)">
            <circle r="28" fill="hsl(220 25% 8%)" stroke="hsl(150 80% 45% / 0.3)" strokeWidth="1" filter="url(#nodeGlow)" />
            <g transform="translate(-12, -14)">
              {/* Factory icon */}
              <rect x="0" y="8" width="24" height="14" fill="none" stroke="#10b981" strokeWidth="1" />
              <polygon points="0,8 6,0 12,8" fill="none" stroke="#10b981" strokeWidth="0.8" />
              <polygon points="12,8 18,2 24,8" fill="none" stroke="#10b981" strokeWidth="0.8" />
              <rect x="4" y="14" width="3" height="4" fill="none" stroke="#10b981" strokeWidth="0.6" />
              <rect x="10" y="12" width="3" height="4" fill="none" stroke="#10b981" strokeWidth="0.6" />
            </g>
            <text y="22" textAnchor="middle" fill="#10b981" fontSize="6" fontFamily="Share Tech Mono">INDUSTRIAL</text>
          </g>

          {/* Street Lighting */}
          <g transform="translate(860, 270)">
            <circle r="22" fill="hsl(220 25% 8%)" stroke="hsl(150 80% 45% / 0.3)" strokeWidth="1" filter="url(#nodeGlow)" />
            <g transform="translate(-6, -12)">
              {/* Lamp icon */}
              <line x1="6" y1="4" x2="6" y2="18" stroke="#10b981" strokeWidth="1.2" />
              <circle cx="6" cy="3" r="3" fill={`hsl(150 80% 45% / ${nodePulse * 0.5})`} stroke="#10b981" strokeWidth="0.8" />
              <line x1="2" y1="18" x2="10" y2="18" stroke="#10b981" strokeWidth="1" />
            </g>
            <text y="18" textAnchor="middle" fill="#10b981" fontSize="5" fontFamily="Share Tech Mono">LIGHTING</text>
          </g>

          {/* Consumer Loads label */}
          <text x="760" y="332" textAnchor="middle" fill="hsl(150 80% 45% / 0.6)" fontSize="7" fontFamily="Orbitron" letterSpacing="2">CONSUMER LOADS</text>

          {/* Junction node */}
          <circle cx="780" cy="210" r="5" fill={flowColor} opacity={nodePulse * 0.8} filter="url(#nodeGlow)" />
          <circle cx="780" cy="210" r="2" fill={flowColor} />

          {/* Flow direction indicator */}
          <g transform="translate(290, 80)">
            <rect x="-80" y="-12" width="160" height="24" rx="12" fill="hsl(220 25% 8% / 0.9)" stroke={`${isReversed ? "hsl(40 100% 55% / 0.4)" : "hsl(195 100% 50% / 0.3)"}`} strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fill={flowColor} fontSize="9" fontFamily="Share Tech Mono" letterSpacing="1">
              {isReversed ? "◂◂ REVERSE POWER FLOW ◂◂" : "▸▸ NORMAL POWER FLOW ▸▸"}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GridDiagram;
