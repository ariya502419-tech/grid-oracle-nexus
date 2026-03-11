import { useState, useEffect, useCallback, useRef } from "react";
import { Brain, Activity, Zap, Shield, Battery, Sun, Filter, Gauge, Play, Loader2, AlertTriangle, CheckCircle2, Radio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIGridAgentProps {
  solarOutput: number;
  voltage: number;
  loadDemand: number;
  isReversed: boolean;
  systemStatus: string;
}

interface DecisionLog {
  id: number;
  message: string;
  type: "info" | "warning" | "action" | "success";
  timestamp: string;
}

const DECISION_MESSAGES: { message: string; type: DecisionLog["type"] }[] = [
  { message: "AI detected overvoltage due to high solar injection", type: "warning" },
  { message: "AI activated Volt-VAR control to stabilize voltage", type: "action" },
  { message: "AI recommended battery dispatch to absorb excess generation", type: "action" },
  { message: "AI limited solar export by 5% to prevent reverse power flow", type: "action" },
  { message: "Monitoring transformer loading — currently within safe limits", type: "info" },
  { message: "AI optimized reactive power injection for voltage support", type: "success" },
  { message: "Harmonic distortion detected — activating filter compensation", type: "warning" },
  { message: "AI forecasting stable grid conditions for next 15 minutes", type: "success" },
  { message: "AI adjusted transformer tap position to regulate voltage", type: "action" },
  { message: "Grid congestion risk elevated — preparing load shedding plan", type: "warning" },
];

const CONTROL_ACTIONS = [
  { label: "Volt-VAR Optimization", icon: <Gauge size={13} /> },
  { label: "Transformer Tap Adjust", icon: <Zap size={13} /> },
  { label: "Battery Storage Dispatch", icon: <Battery size={13} /> },
  { label: "Solar Curtailment", icon: <Sun size={13} /> },
  { label: "Harmonic Filter", icon: <Filter size={13} /> },
];

const AIGridAgent = ({ solarOutput, voltage, isReversed, systemStatus }: AIGridAgentProps) => {
  const [agentStatus, setAgentStatus] = useState<"Active" | "Learning" | "Warning">("Active");
  const [stabilityScore, setStabilityScore] = useState(82);
  const [hostingCapacity, setHostingCapacity] = useState(72);
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [activeControls, setActiveControls] = useState<boolean[]>([false, false, false, false, false]);
  const [predictions, setPredictions] = useState({ voltageStability: "Low", reverseFlow: "Low", congestion: "Low" });
  const [simRunning, setSimRunning] = useState(false);
  const logIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getNow = () => new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const addLog = useCallback((msg: string, type: DecisionLog["type"]) => {
    logIdRef.current += 1;
    setLogs((prev) => [...prev.slice(-30), { id: logIdRef.current, message: msg, type, timestamp: getNow() }]);
  }, []);

  // Passive monitoring — react to grid state
  useEffect(() => {
    if (simRunning) return;
    if (isReversed) {
      setAgentStatus("Warning");
      setPredictions({ voltageStability: "High", reverseFlow: "High", congestion: "Medium" });
    } else if (systemStatus === "warning") {
      setAgentStatus("Learning");
      setPredictions({ voltageStability: "Medium", reverseFlow: "Medium", congestion: "Low" });
    } else {
      setAgentStatus("Active");
      setPredictions({ voltageStability: "Low", reverseFlow: "Low", congestion: "Low" });
    }
  }, [isReversed, systemStatus, simRunning]);

  // Ambient decision log
  useEffect(() => {
    if (simRunning) return;
    const interval = setInterval(() => {
      const entry = DECISION_MESSAGES[Math.floor(Math.random() * DECISION_MESSAGES.length)];
      addLog(entry.message, entry.type);
    }, 4000);
    return () => clearInterval(interval);
  }, [simRunning, addLog]);

  // Stability score tracks voltage
  useEffect(() => {
    if (simRunning) return;
    const deviation = Math.abs(voltage - 230);
    setStabilityScore(Math.max(0, Math.min(100, Math.round(100 - deviation * 3))));
    setHostingCapacity(Math.max(40, Math.min(95, Math.round(72 + (solarOutput - 45) * 0.5))));
  }, [voltage, solarOutput, simRunning]);

  const runSimulation = useCallback(() => {
    if (simRunning) return;
    setSimRunning(true);

    // Phase 1: Instability
    addLog("▶ AI Grid Stabilization initiated", "info");
    setStabilityScore(42);
    setHostingCapacity(65);
    setAgentStatus("Warning");
    setPredictions({ voltageStability: "High", reverseFlow: "High", congestion: "High" });
    setActiveControls([false, false, false, false, false]);

    setTimeout(() => addLog("AI detected overvoltage — voltage at 1.08 pu", "warning"), 800);

    // Phase 2: AI detects & acts
    setTimeout(() => {
      addLog("AI activating Volt-VAR Optimization", "action");
      setActiveControls([true, false, false, false, false]);
      setStabilityScore(55);
    }, 2000);

    setTimeout(() => {
      addLog("AI adjusting transformer tap position", "action");
      setActiveControls([true, true, false, false, false]);
      setStabilityScore(63);
    }, 3500);

    setTimeout(() => {
      addLog("AI dispatching battery storage to absorb excess", "action");
      setActiveControls([true, true, true, false, false]);
      setStabilityScore(72);
      setHostingCapacity(75);
      setPredictions({ voltageStability: "Medium", reverseFlow: "Medium", congestion: "Medium" });
    }, 5000);

    setTimeout(() => {
      addLog("AI curtailing solar export by 5%", "action");
      setActiveControls([true, true, true, true, false]);
      setStabilityScore(82);
    }, 6500);

    setTimeout(() => {
      addLog("AI activating harmonic filter compensation", "action");
      setActiveControls([true, true, true, true, true]);
      setStabilityScore(91);
      setHostingCapacity(82);
    }, 8000);

    // Phase 3: Stabilized
    setTimeout(() => {
      addLog("✓ Grid stabilized — voltage normalized to 1.02 pu", "success");
      addLog("✓ Hosting capacity increased from 65% → 85%", "success");
      setStabilityScore(96);
      setHostingCapacity(85);
      setAgentStatus("Active");
      setPredictions({ voltageStability: "Low", reverseFlow: "Low", congestion: "Low" });
      setSimRunning(false);
    }, 10000);
  }, [simRunning, addLog]);

  const statusColor = agentStatus === "Active" ? "text-neon-green" : agentStatus === "Learning" ? "text-neon-cyan" : "text-neon-amber";
  const statusDot = agentStatus === "Active" ? "bg-neon-green" : agentStatus === "Learning" ? "bg-neon-cyan" : "bg-neon-amber";

  const riskColor = (level: string) =>
    level === "Low" ? "text-neon-green" : level === "Medium" ? "text-neon-amber" : "text-neon-red";
  const riskDot = (level: string) =>
    level === "Low" ? "bg-neon-green" : level === "Medium" ? "bg-neon-amber" : "bg-neon-red";

  const logIcon = (type: DecisionLog["type"]) => {
    switch (type) {
      case "warning": return <AlertTriangle size={11} className="text-neon-amber shrink-0" />;
      case "action": return <Zap size={11} className="text-neon-blue shrink-0" />;
      case "success": return <CheckCircle2 size={11} className="text-neon-green shrink-0" />;
      default: return <Radio size={11} className="text-muted-foreground shrink-0" />;
    }
  };

  return (
    <div className="glow-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xs tracking-widest text-accent glow-text-blue flex items-center gap-2">
          <Brain size={14} className="text-accent" /> AI GRID AGENT — AUTONOMOUS DECISION ENGINE
        </h2>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full animate-pulse-glow ${statusDot}`} />
          <span className={`font-mono text-xs ${statusColor}`}>{agentStatus.toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1 — Status Panel */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-[10px] tracking-widest text-muted-foreground">AGENT STATUS</span>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={`font-mono text-xs font-bold ${statusColor}`}>{agentStatus}</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Stability Score</span>
                <span className="font-mono text-xs text-primary font-bold">{stabilityScore}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${stabilityScore}%`,
                    background: stabilityScore > 75 ? "hsl(var(--neon-green))" : stabilityScore > 50 ? "hsl(var(--neon-amber))" : "hsl(var(--neon-red))",
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Hosting Capacity</span>
                <span className="font-mono text-xs text-secondary font-bold">{hostingCapacity}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-700"
                  style={{ width: `${hostingCapacity}%` }}
                />
              </div>
            </div>
          </div>

          {/* Prediction Panel */}
          <span className="font-display text-[10px] tracking-widest text-muted-foreground mt-1">AI PREDICTIONS (10 MIN)</span>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-2">
            {[
              { label: "Voltage Stability", value: predictions.voltageStability },
              { label: "Reverse Flow Risk", value: predictions.reverseFlow },
              { label: "Grid Congestion", value: predictions.congestion },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{p.label}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${riskDot(p.value)}`} />
                  <span className={`font-mono text-xs font-bold ${riskColor(p.value)}`}>{p.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 — Decision Log */}
        <div className="lg:col-span-2 flex flex-col gap-2">
          <span className="font-display text-[10px] tracking-widest text-muted-foreground">AI DECISION LOG</span>
          <ScrollArea className="bg-card border border-border rounded-lg h-[260px]">
            <div ref={scrollRef} className="p-3 flex flex-col gap-1.5">
              {logs.length === 0 && (
                <span className="text-xs text-muted-foreground italic">Waiting for AI decisions…</span>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  {logIcon(log.type)}
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">{log.timestamp}</span>
                  <span className={`text-xs leading-snug ${
                    log.type === "warning" ? "text-neon-amber" : log.type === "action" ? "text-primary" : log.type === "success" ? "text-neon-green" : "text-foreground"
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 3 — Control Actions + Sim Button */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-[10px] tracking-widest text-muted-foreground">AUTONOMOUS CONTROLS</span>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col gap-2">
            {CONTROL_ACTIONS.map((action, i) => (
              <div key={action.label} className={`flex items-center gap-2 p-1.5 rounded transition-all duration-500 ${activeControls[i] ? "bg-neon-green/10 neon-border-green" : ""}`}>
                <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${activeControls[i] ? "bg-neon-green animate-pulse-glow" : "bg-muted-foreground/40"}`} />
                <span className={activeControls[i] ? "text-neon-green" : "text-muted-foreground"}>{action.icon}</span>
                <span className={`font-mono text-[11px] ${activeControls[i] ? "text-neon-green" : "text-muted-foreground"}`}>{action.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={runSimulation}
            disabled={simRunning}
            className={`mt-auto py-3 px-4 rounded-lg font-display text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
              simRunning
                ? "bg-accent/20 text-accent border border-accent/40 cursor-wait"
                : "bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30"
            }`}
          >
            {simRunning ? (
              <><Loader2 size={14} className="animate-spin" /> AI STABILIZING...</>
            ) : (
              <><Play size={14} /> RUN AI GRID STABILIZATION</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGridAgent;
