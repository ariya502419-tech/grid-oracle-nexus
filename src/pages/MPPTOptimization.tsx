import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, ArrowLeft, TrendingUp, Zap } from "lucide-react";

const MPPTOptimization = () => {
  const navigate = useNavigate();
  const [sunlight, setSunlight] = useState(50);
  const [history, setHistory] = useState<{ withMppt: number; withoutMppt: number }[]>([]);

  const withMppt = sunlight * 0.92;
  const withoutMppt = sunlight * 0.65;

  useEffect(() => {
    setHistory((prev) => [
      ...prev.slice(-20),
      { withMppt: sunlight * 0.92, withoutMppt: sunlight * 0.65 },
    ]);
  }, [sunlight]);

  const maxH = Math.max(...history.map((h) => h.withMppt), 1);

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 neon-border bg-card/80">
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-neon-amber" />
          <h1 className="font-display text-sm tracking-widest text-primary glow-text-blue">
            SOLAR MPPT OPTIMIZATION SYSTEM
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

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="glow-card p-6">
            <div className="text-center mb-6">
              {/* Solar panel SVG icon */}
              <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                <defs>
                  <filter id="solarGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <rect x="15" y="25" width="50" height="35" rx="3" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <line x1="32" y1="25" x2="32" y2="60" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <line x1="48" y1="25" x2="48" y2="60" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <line x1="15" y1="37" x2="65" y2="37" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <line x1="15" y1="48" x2="65" y2="48" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <circle cx="62" cy="16" r="8" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.6" filter="url(#solarGlow)" />
                <circle cx="62" cy="16" r="3" fill="#facc15" opacity="0.8" />
                <line x1="62" y1="4" x2="62" y2="8" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <line x1="72" y1="10" x2="70" y2="12" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
                <line x1="72" y1="22" x2="70" y2="20" stroke="#facc15" strokeWidth="0.8" opacity="0.5" />
              </svg>
              <h2 className="font-display text-lg text-foreground mt-2">Solar Panel Array</h2>
            </div>

            <label className="font-display text-xs tracking-widest text-muted-foreground mb-2 block">
              SUNLIGHT INTENSITY
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={sunlight}
              onChange={(e) => setSunlight(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-neon-amber"
            />
            <div className="flex justify-between mt-1">
              <span className="font-mono text-xs text-muted-foreground">10%</span>
              <span className="font-mono text-sm text-neon-amber">{sunlight}%</span>
              <span className="font-mono text-xs text-muted-foreground">100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glow-card p-4 border-neon-red/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3 h-3 text-neon-red" />
                <span className="font-display text-[10px] tracking-widest text-muted-foreground">WITHOUT MPPT</span>
              </div>
              <div className="font-mono text-3xl text-neon-red mt-2">{withoutMppt.toFixed(1)}</div>
              <span className="text-xs text-muted-foreground">kW output</span>
              <div className="mt-2 text-xs text-neon-red font-mono">65% efficiency</div>
            </div>
            <div className="glow-card-green p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 text-neon-green" />
                <span className="font-display text-[10px] tracking-widest text-muted-foreground">WITH MPPT</span>
              </div>
              <div className="font-mono text-3xl text-neon-green mt-2">{withMppt.toFixed(1)}</div>
              <span className="text-xs text-muted-foreground">kW output</span>
              <div className="mt-2 text-xs text-neon-green font-mono">92% efficiency</div>
            </div>
          </div>

          <div className="glow-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-neon-green font-semibold">MPPT</span> continuously adjusts the solar operating point to extract maximum power. 
              It tracks the voltage-current curve in real-time, ensuring the system always operates at peak efficiency regardless of changing sunlight and temperature conditions.
            </p>
          </div>
        </div>

        <div className="glow-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-display text-xs tracking-widest text-primary">OUTPUT COMPARISON</h3>
          </div>
          <div className="flex-1 flex items-end gap-1 min-h-[300px]">
            {history.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end h-full">
                <div
                  className="w-full bg-neon-green/60 rounded-t-sm transition-all duration-300"
                  style={{ height: `${(h.withMppt / maxH) * 100}%` }}
                />
                <div
                  className="w-full bg-neon-red/40 rounded-t-sm transition-all duration-300"
                  style={{ height: `${(h.withoutMppt / maxH) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-green/60" />
              <span className="font-mono text-xs text-muted-foreground">With MPPT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-red/40" />
              <span className="font-mono text-xs text-muted-foreground">Without MPPT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MPPTOptimization;
