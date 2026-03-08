import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plug, ArrowLeft, BarChart3, Sun, Square, AlertTriangle, CheckCircle2 } from "lucide-react";

const VoltageStabilization = () => {
  const navigate = useNavigate();
  const [solarIncrease, setSolarIncrease] = useState(false);
  const [voltage, setVoltage] = useState(230);
  const [regulatorActive, setRegulatorActive] = useState(false);
  const [voltageHistory, setVoltageHistory] = useState<number[]>(Array(25).fill(230));

  useEffect(() => {
    if (solarIncrease) {
      let v = 230;
      const riseInterval = setInterval(() => {
        v += 2;
        if (v >= 250) {
          clearInterval(riseInterval);
          setVoltage(250);
          setTimeout(() => {
            setRegulatorActive(true);
            let rv = 250;
            const dropInterval = setInterval(() => {
              rv -= 2;
              if (rv <= 230) {
                clearInterval(dropInterval);
                setVoltage(230);
              } else {
                setVoltage(rv);
              }
            }, 200);
          }, 1500);
        } else {
          setVoltage(v);
        }
      }, 200);
      return () => clearInterval(riseInterval);
    } else {
      setVoltage(230);
      setRegulatorActive(false);
    }
  }, [solarIncrease]);

  useEffect(() => {
    setVoltageHistory((prev) => [...prev.slice(-24), voltage]);
  }, [voltage]);

  const isHigh = voltage > 240;
  const maxV = 260;
  const minV = 210;
  const meterPercent = ((voltage - minV) / (maxV - minV)) * 100;

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 neon-border bg-card/80">
        <h1 className="font-display text-sm tracking-widest text-primary glow-text-blue flex items-center gap-2">
          <Plug size={16} /> SMART VOLTAGE CONTROL SYSTEM
        </h1>
        <button
          onClick={() => navigate("/")}
          className="py-2 px-4 rounded-md font-display text-xs tracking-wider neon-border bg-card hover:bg-muted transition-colors text-primary flex items-center gap-2"
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </button>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="glow-card p-6 flex flex-col items-center">
            <h3 className="font-display text-xs tracking-widest text-primary mb-6">VOLTAGE METER</h3>

            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <filter id="glowV">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(220 25% 15%)" strokeWidth="12" strokeDasharray="377 503" strokeDashoffset="-63" strokeLinecap="round" />
                <circle
                  cx="100" cy="100" r="80"
                  fill="none"
                  stroke={isHigh ? "hsl(0 100% 60%)" : regulatorActive ? "hsl(150 80% 45%)" : "hsl(195 100% 50%)"}
                  strokeWidth="12"
                  strokeDasharray={`${meterPercent * 3.77} 503`}
                  strokeDashoffset="-63"
                  strokeLinecap="round"
                  filter="url(#glowV)"
                  className="transition-all duration-300"
                />
                <text x="100" y="95" textAnchor="middle" fill="hsl(200 100% 90%)" fontSize="32" fontFamily="Orbitron" fontWeight="bold">
                  {voltage.toFixed(0)}
                </text>
                <text x="100" y="120" textAnchor="middle" fill="hsl(200 30% 55%)" fontSize="14" fontFamily="Share Tech Mono">
                  VOLTS
                </text>
              </svg>
            </div>

            <div className={`mt-4 px-4 py-2 rounded-lg text-sm font-display tracking-wider flex items-center gap-2 ${
              isHigh
                ? "bg-neon-red/10 text-neon-red border border-neon-red/30"
                : regulatorActive
                ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                : "bg-neon-blue/10 text-neon-blue border border-neon-blue/30"
            }`}>
              {isHigh ? <><AlertTriangle size={14} /> OVERVOLTAGE WARNING</> : regulatorActive ? <><CheckCircle2 size={14} /> VOLTAGE STABILIZED</> : <><CheckCircle2 size={14} /> NORMAL — 230V</>}
            </div>
          </div>

          <button
            onClick={() => setSolarIncrease(!solarIncrease)}
            className={`py-3 px-4 rounded-lg font-display text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
              solarIncrease
                ? "bg-neon-red/20 text-neon-red border border-neon-red/40 hover:bg-neon-red/30"
                : "bg-neon-amber/20 text-neon-amber border border-neon-amber/40 hover:bg-neon-amber/30"
            }`}
          >
            {solarIncrease ? <><Square size={14} /> RESET SIMULATION</> : <><Sun size={14} /> SIMULATE SOLAR INCREASE</>}
          </button>

          <div className="glow-card p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              When solar generation increases rapidly, voltage can rise above safe limits (240V+).
              The <span className="text-neon-green font-semibold">Smart Voltage Regulator</span> detects overvoltage and automatically adjusts reactive power to bring voltage back to the nominal 230V range.
            </p>
          </div>
        </div>

        <div className="glow-card p-6 flex flex-col">
          <h3 className="font-display text-xs tracking-widest text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> VOLTAGE HISTORY
          </h3>
          <div className="flex-1 relative min-h-[300px]">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-neon-red/20 relative">
                <span className="absolute -top-3 right-0 font-mono text-[10px] text-neon-red">250V</span>
              </div>
              <div className="border-t border-neon-amber/20 relative">
                <span className="absolute -top-3 right-0 font-mono text-[10px] text-neon-amber">240V</span>
              </div>
              <div className="border-t border-neon-green/20 relative">
                <span className="absolute -top-3 right-0 font-mono text-[10px] text-neon-green">230V</span>
              </div>
              <div className="border-t border-border relative">
                <span className="absolute -top-3 right-0 font-mono text-[10px] text-muted-foreground">220V</span>
              </div>
              <div className="border-t border-border relative">
                <span className="absolute -top-3 right-0 font-mono text-[10px] text-muted-foreground">210V</span>
              </div>
            </div>

            <div className="absolute inset-0 flex items-end gap-0.5 pt-4 pb-0">
              {voltageHistory.map((v, i) => {
                const h = ((v - minV) / (maxV - minV)) * 100;
                const color = v > 245 ? "bg-neon-red/70" : v > 235 ? "bg-neon-amber/60" : "bg-neon-green/60";
                return (
                  <div
                    key={i}
                    className={`flex-1 ${color} rounded-t-sm transition-all duration-300`}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-green/60" />
              <span className="font-mono text-xs text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-amber/60" />
              <span className="font-mono text-xs text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-red/70" />
              <span className="font-mono text-xs text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoltageStabilization;
