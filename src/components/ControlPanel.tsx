import { useNavigate } from "react-router-dom";

interface ControlPanelProps {
  mpptActive: boolean;
  antiBackflowActive: boolean;
  voltageStabActive: boolean;
  onRunDemo: () => void;
  demoRunning: boolean;
}

const StatusCard = ({
  title,
  icon,
  active,
  description,
  onClick,
}: {
  title: string;
  icon: string;
  active: boolean;
  description: string;
  onClick: () => void;
}) => (
  <div className={`glow-card p-4 transition-all duration-500 ${active ? "neon-border-green" : ""}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="font-display text-[10px] tracking-widest text-foreground uppercase">{title}</span>
    </div>
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-2 h-2 rounded-full ${active ? "bg-neon-green animate-pulse-glow" : "bg-muted-foreground"}`} />
      <span className={`font-mono text-xs ${active ? "text-neon-green" : "text-muted-foreground"}`}>
        {active ? "ACTIVE" : "STANDBY"}
      </span>
    </div>
    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{description}</p>
    <button
      onClick={onClick}
      className="w-full py-2 px-3 rounded-md text-xs font-display tracking-wider neon-border bg-card hover:bg-muted transition-colors text-primary"
    >
      OPEN DETAILS →
    </button>
  </div>
);

const ControlPanel = ({ mpptActive, antiBackflowActive, voltageStabActive, onRunDemo, demoRunning }: ControlPanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="glow-card p-4 flex flex-col gap-3 h-full">
      <h2 className="font-display text-xs tracking-widest text-primary glow-text-blue">
        🎛 SMART CONTROLS
      </h2>

      <StatusCard
        icon="1️⃣"
        title="MPPT Optimization"
        active={mpptActive}
        description="Maximum Power Point Tracking for solar arrays"
        onClick={() => navigate("/mppt")}
      />
      <StatusCard
        icon="2️⃣"
        title="Anti-Backflow Detection"
        active={antiBackflowActive}
        description="Monitors and prevents reverse power flow"
        onClick={() => navigate("/anti-backflow")}
      />
      <StatusCard
        icon="3️⃣"
        title="Voltage Stabilization"
        active={voltageStabActive}
        description="Maintains grid voltage within safe limits"
        onClick={() => navigate("/voltage")}
      />

      <button
        onClick={onRunDemo}
        disabled={demoRunning}
        className={`mt-auto py-3 px-4 rounded-lg font-display text-xs tracking-widest transition-all ${
          demoRunning
            ? "bg-neon-amber/20 text-neon-amber border border-neon-amber/40 cursor-wait"
            : "bg-neon-blue/20 text-neon-blue border border-neon-blue/40 hover:bg-neon-blue/30"
        }`}
      >
        {demoRunning ? "⏳ DEMO RUNNING..." : "▶ RUN DEMO SCENARIO"}
      </button>
    </div>
  );
};

export default ControlPanel;
