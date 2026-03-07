import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, AlertTriangle, CheckCircle2, Info } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display text-sm tracking-widest text-primary glow-text-blue">
            REVERSE POWER FLOW MONITORING
          </h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="py-2 px-4 rounded-md font-display text-xs tracking-wider neon-border bg-card hover:bg-muted transition-colors text-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK TO DASHBOARD
        </button>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        <div className="glow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-display text-xs tracking-widest text-primary">POWER FLOW DIAGRAM</h3>
          </div>
          <svg viewBox="0 0 700 200" className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glowAB">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="abGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(195 100% 50% / 0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>

            <rect width="700" height="200" fill="url(#abGrid)" />

            {/* House + Solar node */}
            <g transform="translate(120, 100)" filter="url(#glowAB)">
              <circle r="50" fill="hsl(220 25% 8%)" stroke="#facc15" strokeWidth="1.5" />
              <circle r="55" fill="none" stroke="hsl(45 100% 55% / 0.15)" strokeWidth="1" />
              {/* House + solar icon */}
              <g transform="translate(-16, -18)">
                <polygon points="16,0 0,12 32,12" fill="none" stroke="#facc15" strokeWidth="1" />
                <rect x="4" y="12" width="24" height="16" fill="none" stroke="#facc15" strokeWidth="1" />
                <rect x="12" y="16" width="8" height="12" fill="none" stroke="#facc15" strokeWidth="0.8" />
                {/* Solar panel on roof */}
                <rect x="8" y="2" width="16" height="6" fill="none" stroke="#facc15" strokeWidth="0.8" opacity="0.7" />
                <line x1="13" y1="2" x2="13" y2="8" stroke="#facc15" strokeWidth="0.5" opacity="0.5" />
                <line x1="19" y1="2" x2="19" y2="8" stroke="#facc15" strokeWidth="0.5" opacity="0.5" />
              </g>
              <text y="42" textAnchor="middle" fill="#facc15" fontSize="7" fontFamily="Orbitron" letterSpacing="1">HOUSE + SOLAR</text>
            </g>

            {/* Flow Line */}
            <line x1="220" y1="100" x2="480" y2="100" stroke="hsl(195 100% 50% / 0.15)" strokeWidth="3" />
            <line
              x1="220" y1="100" x2="480" y2="100"
              stroke={flowColor}
              strokeWidth="3"
              strokeDasharray="8 12"
              strokeDashoffset={isReversed ? animOffset : -animOffset}
              opacity="0.8"
            />

            {/* Direction label */}
            <g transform="translate(350, 70)">
              <rect x="-65" y="-10" width="130" height="20" rx="10" fill="hsl(220 25% 8% / 0.9)" stroke={`${isReversed ? "hsl(40 100% 55% / 0.4)" : "hsl(195 100% 50% / 0.3)"}`} strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill={flowColor} fontSize="8" fontFamily="Share Tech Mono" letterSpacing="1">
                {isReversed ? "REVERSE FLOW" : "NORMAL FLOW"}
              </text>
            </g>

            {/* Grid node */}
            <g transform="translate(550, 100)" filter="url(#glowAB)">
              <circle r="50" fill="hsl(220 25% 8%)" stroke="#0ea5e9" strokeWidth="1.5" />
              <circle r="55" fill="none" stroke="hsl(195 100% 50% / 0.15)" strokeWidth="1" />
              {/* Power tower icon */}
              <g transform="translate(-12, -20)">
                <line x1="12" y1="0" x2="12" y2="30" stroke="#0ea5e9" strokeWidth="1.5" />
                <line x1="4" y1="30" x2="20" y2="30" stroke="#0ea5e9" strokeWidth="1.2" />
                <line x1="2" y1="6" x2="22" y2="6" stroke="#0ea5e9" strokeWidth="1.2" />
                <line x1="5" y1="16" x2="19" y2="16" stroke="#0ea5e9" strokeWidth="1" />
                <circle cx="4" cy="6" r="2" fill="none" stroke="#0ea5e9" strokeWidth="0.8" />
                <circle cx="20" cy="6" r="2" fill="none" stroke="#0ea5e9" strokeWidth="0.8" />
              </g>
              <text y="42" textAnchor="middle" fill="#0ea5e9" fontSize="8" fontFamily="Orbitron" letterSpacing="1">GRID</text>
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
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${systemActive ? "border-neon-green/40 bg-neon-green/5" : "border-neon-amber/40 bg-neon-amber/5"} transition-all duration-500`}>
                {!systemActive ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-neon-amber shrink-0 mt-0.5" />
                    <div>
                      <div className="font-display text-sm text-neon-amber">REVERSE POWER FLOW DETECTED</div>
                      <p className="text-xs text-muted-foreground mt-1">Solar export exceeding load demand. Activating countermeasures...</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                    <div>
                      <div className="font-display text-sm text-neon-green">ANTI-BACKFLOW SYSTEM ACTIVE</div>
                      <p className="text-xs text-muted-foreground mt-1">Solar export limited. Feeder stabilized. Grid protected.</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!isReversed && (
              <div className="p-4 rounded-lg border border-neon-blue/30 bg-neon-blue/5 flex items-start gap-3">
                <Info className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                <div>
                  <div className="font-display text-sm text-neon-blue">NORMAL OPERATION</div>
                  <p className="text-xs text-muted-foreground mt-1">Power flowing from grid to loads. No reverse flow detected.</p>
                </div>
              </div>
            )}
          </div>

          <div className="glow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-display text-xs tracking-widest text-primary">SYSTEM RESPONSE</h3>
            </div>
            <div className="space-y-3">
              {["Detect reverse flow", "Limit solar export", "Stabilize feeder voltage", "Protect grid infrastructure"].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${(i === 0 ? isReversed : systemActive) ? "bg-neon-green animate-pulse-glow" : "bg-muted"}`} />
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
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
