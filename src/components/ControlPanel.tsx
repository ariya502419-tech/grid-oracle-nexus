import { useNavigate } from "react-router-dom";
import { Sun, Shield, Gauge, SlidersHorizontal, Play, Loader2 } from "lucide-react";

interface ControlPanelProps {
  mpptActive: boolean;
  antiBackflowActive: boolean;
  voltageStabActive: boolean;
  onRunDemo: () => void;
  demoRunning: boolean;
}

const StatusCard = ({
  title,
  icon: Icon,
  active,
  description,
  onClick,
  index,
}: {
  title: string;
  icon: React.ElementType;
  active: boolean;
  description: string;
  onClick: () => void;
  index: number;
}) => (
  <div className={`glow-card p-4 transition-all duration-500 ${active ? "neon-border-green" : ""}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? "bg-neon-green/15 border border-neon-green/30" : "bg-muted border border-border"}`}>
        <Icon className={`w-4 h-4 ${active ? "text-neon-green" : "text-muted-foreground"}`} />
      </div>
      <div>
        <span className="font-display text-[10px] tracking-widest text-foreground uppercase block">{title}</span>
        <div className="flex items-center gap-2 mt-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-neon-green animate-pulse-glow" : "bg-muted-foreground"}`} />
          <span className={`font-mono text-[10px] ${active ? "text-neon-green" : "text-muted-foreground"}`}>
            {active ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>
    </div>
    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{description}</p>
    <button
      onClick={onClick}
      className="w-full py-2 px-3 rounded-md text-xs font-display tracking-wider neon-border bg-card hover:bg-muted transition-colors text-primary"
    >
      OPEN DETAILS
    </button>
  </div>
);

const ControlPanel = ({ mpptActive, antiBackflowActive, voltageStabActive, onRunDemo, demoRunning }: ControlPanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="glow-card p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <h2 className="font-display text-xs tracking-widest text-primary glow-text-blue">
          SMART CONTROLS
        </h2>
      </div>

      <StatusCard
        icon={Sun}
        title="MPPT Optimization"
        active={mpptActive}
        description="Maximum Power Point Tracking for solar arrays"
        onClick={() => navigate("/mppt")}
        index={1}
      />
      <StatusCard
        icon={Shield}
        title="Anti-Backflow Detection"
        active={antiBackflowActive}
        description="Monitors and prevents reverse power flow"
        onClick={() => navigate("/anti-backflow")}
        index={2}
      />
      <StatusCard
        icon={Gauge}
        title="Voltage Stabilization"
        active={voltageStabActive}
        description="Maintains grid voltage within safe limits"
        onClick={() => navigate("/voltage")}
        index={3}
      />

      <button
        onClick={onRunDemo}
        disabled={demoRunning}
        className={`mt-auto py-3 px-4 rounded-lg font-display text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
          demoRunning
            ? "bg-neon-amber/20 text-neon-amber border border-neon-amber/40 cursor-wait"
            : "bg-neon-blue/20 text-neon-blue border border-neon-blue/40 hover:bg-neon-blue/30"
        }`}
      >
        {demoRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            DEMO RUNNING...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            RUN DEMO SCENARIO
          </>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;
