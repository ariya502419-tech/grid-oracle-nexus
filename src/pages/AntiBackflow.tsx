import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft, Home, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const AntiBackflow = () => {
  const navigate = useNavigate();
  const [solarLevel, setSolarLevel] = useState(40);
  const [systemActive, setSystemActive] = useState(false);
  const [animOffset, setAnimOffset] = useState(0);

  const isReversed = solarLevel > 70;

  useEffect(() => {
    const interval = setInterval(() => setAnimOffset((p) => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReversed) {
      const timer = setTimeout(() => setSystemActive(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setSystemActive(false);
    }
  }, [isReversed]);

  const flowColor = isReversed ? (systemActive ? "#10b981" : "#f59e0b") : "#0ea5e9";

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 neon-border bg-card/80">
        <h1 className="font-display text-sm tracking-widest text-primary glow-text-blue flex items-center gap-2">
          <Zap size={16} /> REVERSE POWER FLOW MONITORING
        </h1>
        <button
          onClick={() => navigate("/")}
          className="py-2 px-4 rounded-md font-display text-xs tracking-wider neon-border bg-card hover:bg-muted transition-colors text-primary flex items-center gap-2"
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </button>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        <div className="glow-card p-6">
          <h3 className="font-display text-xs tracking-widest text-primary mb-4">POWER FLOW DIAGRAM</h3>
          <svg viewBox="0 0 700 200" className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glowAB">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* House + Solar */}
            <g transform="translate(120, 100)" filter="url(#glowAB)">
              <rect x="-50" y="-40" width="100" height="80" rx="8" fill="hsl(220 25% 12%)" stroke="#facc15" strokeWidth="1.5" />
              {/* House icon */}
              <polygon points="0,-58 -14,-45 14,-45" fill="none" stroke="#facc15" strokeWidth="1.5" />
              <rect x="-10" y="-45" width="20" height="15" fill="none" stroke="#facc15" strokeWidth="1.5" />
              <text x="0" y="0" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="10" fontFamily="Orbitron">HOUSE +</text>
              <text x="0" y="15" textAnchor="middle" fill="#facc15" fontSize="10" fontFamily="Orbitron">SOLAR</text>
            </g>

            {/* Flow Line */}
            <line x1="220" y1="100" x2="480" y2="100" stroke="hsl(195 100% 50% / 0.2)" strokeWidth="3" />
            <line
              x1="220" y1="100" x2="480" y2="100"
              stroke={flowColor}
              strokeWidth="3"
              strokeDasharray="10 15"
              strokeDashoffset={isReversed ? animOffset : -animOffset}
              opacity="0.8"
            />

            {/* Direction label */}
            <text x="350" y="80" textAnchor="middle" fill={flowColor} fontSize="12" fontFamily="Share Tech Mono">
              {isReversed ? "REVERSE FLOW" : "NORMAL FLOW"}
            </text>

            {/* Grid */}
            <g transform="translate(550, 100)" filter="url(#glowAB)">
              <rect x="-50" y="-40" width="100" height="80" rx="8" fill="hsl(220 25% 12%)" stroke="#0ea5e9" strokeWidth="1.5" />
              {/* Zap icon */}
              <polygon points="0,-58 -6,-46 -1,-46 -4,-34 6,-48 1,-48 4,-58" fill="#0ea5e9" />
              <text x="0" y="5" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="10" fontFamily="Orbitron">GRID</text>
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="glow-card p-6">
              <label className="font-display text-xs tracking-widest text-muted-foreground mb-2 block">
                SOLAR GENERATION LEVEL
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={solarLevel}
                onChange={(e) => setSolarLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-neon-amber"
              />
              <div className="flex justify-between mt-1">
                <span className="font-mono text-xs text-muted-foreground">Low</span>
                <span className="font-mono text-sm text-neon-amber">{solarLevel}%</span>
                <span className="font-mono text-xs text-muted-foreground">High</span>
              </div>
            </div>

            {isReversed && (
              <div className={`p-4 rounded-lg border ${systemActive ? "border-neon-green/40 bg-neon-green/5" : "border-neon-amber/40 bg-neon-amber/5"} transition-all duration-500`}>
                {!systemActive ? (
                  <>
                    <div className="font-display text-sm text-neon-amber flex items-center gap-2"><AlertTriangle size={16} /> REVERSE POWER FLOW DETECTED</div>
                    <p className="text-xs text-muted-foreground mt-1">Solar export exceeding load demand. Activating countermeasures...</p>
                  </>
                ) : (
                  <>
                    <div className="font-display text-sm text-neon-green flex items-center gap-2"><CheckCircle2 size={16} /> ANTI-BACKFLOW SYSTEM ACTIVE</div>
                    <p className="text-xs text-muted-foreground mt-1">Solar export limited. Feeder stabilized. Grid protected.</p>
                  </>
                )}
              </div>
            )}

            {!isReversed && (
              <div className="p-4 rounded-lg border border-neon-blue/30 bg-neon-blue/5">
                <div className="font-display text-sm text-neon-blue flex items-center gap-2"><CheckCircle2 size={16} /> NORMAL OPERATION</div>
                <p className="text-xs text-muted-foreground mt-1">Power flowing from grid to loads. No reverse flow detected.</p>
              </div>
            )}
          </div>

          <div className="glow-card p-6">
            <h3 className="font-display text-xs tracking-widest text-primary mb-4">SYSTEM RESPONSE</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isReversed ? "bg-neon-green animate-pulse-glow" : "bg-muted"}`} />
                <span className="text-sm text-foreground">Detect reverse flow</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${systemActive ? "bg-neon-green animate-pulse-glow" : "bg-muted"}`} />
                <span className="text-sm text-foreground">Limit solar export</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${systemActive ? "bg-neon-green animate-pulse-glow" : "bg-muted"}`} />
                <span className="text-sm text-foreground">Stabilize feeder voltage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${systemActive ? "bg-neon-green animate-pulse-glow" : "bg-muted"}`} />
                <span className="text-sm text-foreground">Protect grid infrastructure</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              The anti-backflow system monitors power direction in real-time. When solar generation exceeds local demand, it automatically limits export to prevent voltage rise and protect grid equipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AntiBackflow;
