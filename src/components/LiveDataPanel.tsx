import { useEffect, useState } from "react";
import { Sun, Zap, Home, ArrowLeft, ArrowRight, Battery, BarChart3 } from "lucide-react";

interface LiveDataPanelProps {
  solarOutput: number;
  voltage: number;
  loadDemand: number;
  isReversed: boolean;
  systemStatus: string;
}

const DataCard = ({ label, value, unit, color, icon }: { label: string; value: string; unit: string; color: string; icon: React.ReactNode }) => {
  const colorClasses: Record<string, string> = {
    blue: "border-neon-blue/40 shadow-[0_0_15px_hsl(195_100%_50%/0.1)]",
    green: "border-neon-green/40 shadow-[0_0_15px_hsl(150_80%_45%/0.1)]",
    amber: "border-neon-amber/40 shadow-[0_0_15px_hsl(40_100%_55%/0.1)]",
    cyan: "border-neon-cyan/40 shadow-[0_0_15px_hsl(180_100%_50%/0.1)]",
    red: "border-neon-red/40 shadow-[0_0_15px_hsl(0_100%_60%/0.1)]",
  };
  const textClasses: Record<string, string> = {
    blue: "text-neon-blue",
    green: "text-neon-green",
    amber: "text-neon-amber",
    cyan: "text-neon-cyan",
    red: "text-neon-red",
  };

  return (
    <div className={`bg-card border rounded-lg p-3 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={textClasses[color]}>{icon}</span>
        <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono text-2xl font-bold ${textClasses[color]}`}>{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color === "blue" ? "bg-neon-blue" : color === "green" ? "bg-neon-green" : color === "amber" ? "bg-neon-amber" : color === "red" ? "bg-neon-red" : "bg-neon-cyan"}`}
          style={{ width: `${Math.min(100, parseFloat(value) / (unit === "V" ? 2.6 : unit === "kW" ? 1.2 : 1) )}%` }}
        />
      </div>
    </div>
  );
};

const LiveDataPanel = ({ solarOutput, voltage, loadDemand, isReversed, systemStatus }: LiveDataPanelProps) => {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory((prev) => [...prev.slice(-15), solarOutput]);
  }, [solarOutput]);

  const maxH = Math.max(...history, 1);

  return (
    <div className="glow-card p-4 flex flex-col gap-3 h-full">
      <h2 className="font-display text-xs tracking-widest text-primary glow-text-blue flex items-center gap-2">
        <BarChart3 size={14} /> LIVE GRID DATA
      </h2>

      <DataCard icon={<Sun size={16} />} label="Solar Generation" value={solarOutput.toFixed(1)} unit="kW" color="amber" />
      <DataCard icon={<Zap size={16} />} label="Feeder Voltage" value={voltage.toFixed(1)} unit="V" color="blue" />
      <DataCard icon={<Home size={16} />} label="Load Demand" value={loadDemand.toFixed(1)} unit="kW" color="green" />
      <DataCard icon={isReversed ? <ArrowLeft size={16} /> : <ArrowRight size={16} />} label="Power Flow" value={isReversed ? "REVERSE" : "FORWARD"} unit="" color={isReversed ? "amber" : "cyan"} />
      <DataCard icon={<Battery size={16} />} label="Grid Stability" value={systemStatus.toUpperCase()} unit="" color={systemStatus === "stable" ? "green" : "red"} />

      {/* Mini sparkline */}
      <div className="mt-auto">
        <span className="font-display text-[10px] text-muted-foreground tracking-widest">SOLAR OUTPUT TREND</span>
        <div className="flex items-end gap-0.5 h-12 mt-1">
          {history.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-neon-amber/60 rounded-t-sm transition-all duration-300"
              style={{ height: `${(v / maxH) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveDataPanel;
