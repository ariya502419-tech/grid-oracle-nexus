import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import gridTopology3D from "@/assets/grid-topology-3d.png";

interface GridDiagramProps {
  solarOutput: number;
  isReversed: boolean;
}

const GridDiagram = ({ solarOutput, isReversed }: GridDiagramProps) => {
  const [pulseOpacity, setPulseOpacity] = useState(0.6);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 0.6 ? 1 : 0.6));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glow-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xs tracking-widest text-primary glow-text-blue flex items-center gap-2">
          <Zap size={14} /> DIGITAL TWIN — GRID TOPOLOGY
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isReversed ? "bg-neon-amber animate-pulse-glow" : "bg-neon-green animate-pulse-glow"}`} />
            <span className={`font-mono text-xs ${isReversed ? "text-neon-amber" : "text-neon-green"}`}>
              {isReversed ? "REVERSE FLOW" : "NORMAL FLOW"}
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {solarOutput.toFixed(0)} kW
          </span>
        </div>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden min-h-[280px]">
        {/* 3D Isometric Grid Image */}
        <img
          src={gridTopology3D}
          alt="3D Isometric Smart Grid Topology — Solar Home, Distribution Transformer, Local Distribution Grid"
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Animated overlay glow for flow indication */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-1000"
          style={{
            background: isReversed
              ? `radial-gradient(ellipse at 20% 70%, hsl(40 100% 55% / ${pulseOpacity * 0.15}) 0%, transparent 50%),
                 radial-gradient(ellipse at 50% 50%, hsl(40 100% 55% / ${pulseOpacity * 0.08}) 0%, transparent 40%)`
              : `radial-gradient(ellipse at 20% 70%, hsl(195 100% 50% / ${pulseOpacity * 0.12}) 0%, transparent 50%),
                 radial-gradient(ellipse at 70% 40%, hsl(150 80% 45% / ${pulseOpacity * 0.1}) 0%, transparent 40%)`,
          }}
        />

        {/* Status overlay bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-amber" />
              <span className="font-mono text-[11px] text-neon-amber">Solar Home</span>
            </div>
            <span className="text-muted-foreground text-xs">{isReversed ? "◂" : "▸"}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
              <span className="font-mono text-[11px] text-neon-blue">Transformer</span>
            </div>
            <span className="text-muted-foreground text-xs">▸</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              <span className="font-mono text-[11px] text-neon-green">Distribution Grid</span>
            </div>
          </div>
          <span className={`font-display text-[10px] tracking-wider ${isReversed ? "text-neon-amber" : "text-neon-green"}`}>
            {isReversed ? "⚠ BACKFLOW ACTIVE" : "GRID STABLE"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GridDiagram;
