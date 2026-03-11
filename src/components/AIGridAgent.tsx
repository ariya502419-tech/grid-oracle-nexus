import { useState, useEffect, useCallback, useRef } from "react";
import { Brain, Activity, Zap, Shield, Sun, Battery, Radio, AlertTriangle, TrendingUp, Play, Loader2 } from "lucide-react";
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
  type: "info" | "action" | "warning" | "success";
  timestamp: string;
}

const controlActions = [
  { label: "Volt-VAR Optimization", icon: <Zap size={13} /> },
  { label: "Transformer Tap Adjust", icon: <Activity size={13} /> },
  { label: "Battery Storage Dispatch", icon: <Battery size={13} /> },
  { label: "Solar Curtailment", icon: <Sun size={13} /> },
  { label: "Harmonic Filter", icon: <Radio size={13} /> },
];

const AIGridAgent = ({ solarOutput, voltage, loadDemand, isReversed, systemStatus }: AIGridAgentProps) => {
  const [stabilityScore, setStabilityScore] = useState(82);
  const [hostingCapacity, setHostingCapacity] = useState(65);
  const [agentStatus, setAgentStatus] = useState<"Active" | "Learning" | "Warning">("Active");
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [activeControls, setActiveControls] = useState<Set<number>>(new Set());
  const [simRunning, setSimRunning] = useState(false);
  const [predictions, setPredictions] = useState({ voltage: "Low", reverseFlow: "Low", congestion: "Low" });
  const logIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = () => new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const addLog = useCallback((message: string, type: DecisionLog["type"] = "info") => {
    logIdRef.current += 1;
    setLogs((prev) => [...prev.slice(-30), { id: logIdRef.current, message, type, timestamp: now() }]);
  }, []);

  // React to grid parameters
  useEffect(() => {
    if (simRunning) return;
    if (isReversed) {
      setAgentStatus("Warning");
      setPredictions({ voltage: "High", reverseFlow: "High", congestion: "Medium" });
    } else if (solarOutput > 70) {
      setAgentStatus("Learning");
      setPredictions({ voltage: "Medium", reverseFlow: "Medium", congestion: "Low" });
    } else {
      setAgentStatus("Active");
      setPredictions({ voltage: "Low", reverseFlow: "Low", congestion: "Low" });
    }

    const score = Math.round(Math.max(20, Math.min(100, 100 - Math.abs(voltage - 230) * 3 - (isReversed ? 25 : 0) - Math.max(0, solarOutput - 70))));
    setStabilityScore(score);
    setHostingCapacity(Math.round(Math.max(40, Math.min(95, 65 + (230 - voltage) * 2 + (isReversed ? -15 : 10)))));
  }, [solarOutput, voltage, isReversed, simRunning]);

  // Periodic AI observations
  useEffect(() => {
    if (simRunning) return;
    const interval = setInterval(() => {
      if (isReversed) {
        addLog("AI detected reverse power flow — evaluating curtailment", "warning");
      } else if (solarOutput > 70) {
        addLog("AI monitoring elevated solar injection levels", "info");
      } else {
        addLog("AI: Grid parameters within normal range", "info");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isReversed, solarOutput, addLog, simRunning]);

  // Auto-scroll log
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const runSimulation = useCallback(() => {
    if (simRunning) return;
    setSimRunning(true);
    setActiveControls(new Set());

    // Phase 1 — Detect instability
    addLog("▶ AI Stabilization Simulation initiated", "action");
    setStabilityScore(42);
    setHostingCapacity(52);
    setAgentStatus("Warning");
    setPredictions({ voltage: "High", reverseFlow: "High", congestion: "High" });

    setTimeout(() => addLog("AI detected overvoltage due to high solar injection", "warning"), 1200);
    setTimeout(() => addLog("Voltage at 1.08 pu — exceeds safe threshold", "warning"), 2200);

    // Phase 2 — Activate controls
    setTimeout(() => {
      addLog("AI activated Volt-VAR control to stabilize voltage", "action");
      setActiveControls(new Set([0]));
      setStabilityScore(55);
    }, 3500);

    setTimeout(() => {
      addLog("AI adjusting transformer tap position", "action");
      setActiveControls(new Set([0, 1]));
      setStabilityScore(62);
    }, 5000);

    setTimeout(() => {
      addLog("AI recommended battery dispatch to absorb excess generation", "action");
      setActiveControls(new Set([0, 1, 2]));
      setHostingCapacity(70);
      setStabilityScore(72);
      setPredictions({ voltage: "Medium", reverseFlow: "Medium", congestion: "Medium" });
    }, 6500);

    setTimeout(() => {
      addLog("AI limited solar export by 5% to prevent reverse power flow", "action");
      setActiveControls(new Set([0, 1, 2, 3]));
      setStabilityScore(80);
    }, 8000);

    setTimeout(() => {
      addLog("AI activated harmonic filter for power quality", "action");
      setActiveControls(new Set([0, 1, 2, 3, 4]));
    }, 9000);

    // Phase 3 — Stabilized
    setTimeout(() => {
      setStabilityScore(94);
      setHostingCapacity(85);
      setAgentStatus("Active");
      setPredictions({ voltage: "Low", reverseFlow: "Low", congestion: "Low" });
      addLog("✓ Grid stabilized — Voltage 1.02 pu, Hosting capacity 85%", "success");
    }, 10500);

    setTimeout(() => {
      addLog("AI Stabilization complete. All systems nominal.", "success");
      setSimRunning(false);
      setTimeout(() => setActiveControls(new Set()), 4000);
    }, 12000);
  }, [simRunning, addLog]);

  const statusColor = agentStatus === "Active" ? "text-neon-green" : agentStatus === "Learning" ? "text-neon-cyan" : "text-neon-amber";
  const statusDot = agentStatus === "Active" ? "bg-neon-green" : agentStatus === "Learning" ? "bg-neon-cyan" : "bg-neon-amber";

  const riskColor = (level: string) =>
    level === "Low" ? "text-neon-green" : level === "Medium" ? "text-neon-amber" : "text-neon-red";
  const riskDot = (level: string) =>
    level === "Low" ? "bg-neon-green" : level === "Medium" ? "bg-neon-amber" : "bg-neon-red";

  const logColor = (type: DecisionLog["type"]) =>
    type === "warning" ? "text-neon-amber" : type === "action" ? "text-neon-cyan" : type === "success" ? "text-neon-green" : "text-muted-foreground";

  return (
    <div className="glow-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs tracking-widest text-accent glow-text-blue flex items-center gap-2">
          <Brain size={15} className="text-accent" /> AI GRID AGENT
        </h2>
        <span className="font-display text-[9px] tracking-widest text-muted-foreground">AUTONOMOUS DECISION ENGINE</span>
      </div>

      {/* 1. Status Panel */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/50 rounded-md p-2.5 border border-border">
          <span className="font-display text-[9px] tracking-widest text-muted-foreground block mb-1">AGENT STATUS</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusDot} animate-pulse-glow`} />
            <span className={`font-mono text-sm font-bold ${statusColor}`}>{agentStatus.toUpperCase()}</span>
          </div>
        </div>
        <div className="bg-muted/50 rounded-md p-2.5 border border-border">
          <span className="font-display text-[9px] tracking-widest text-muted-foreground block mb-1">STABILITY</span>
          <span className={`font-mono text-lg font-bold ${stabilityScore > 70 ? "text-neon-green" : stabilityScore > 45 ? "text-neon-amber" : "text-neon-red"}`}>
            {stabilityScore}
          </span>
          <span className="text-[10px] text-muted-foreground"> /100</span>
        </div>
        <div className="bg-muted/50 rounded-md p-2.5 border border-border">
          <span className="font-display text-[9px] tracking-widest text-muted-foreground block mb-1">HOSTING CAP.</span>
          <span className={`font-mono text-lg font-bold ${hostingCapacity > 75 ? "text-neon-green" : hostingCapacity > 55 ? "text-neon-amber" : "text-neon-red"}`}>
            {hostingCapacity}%
          </span>
        </div>
      </div>

      {/* 2. Decision Log */}
      <div>
        <span className="font-display text-[9px] tracking-widest text-muted-foreground flex items-center gap-1 mb-1.5">
          <Activity size={11} /> AI DECISION LOG
        </span>
        <div ref={scrollRef} className="bg-background/60 border border-border rounded-md h-[130px] overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {logs.length === 0 && (
            <span className="text-[11px] text-muted-foreground italic">Awaiting AI decisions...</span>
          )}
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 animate-fade-in">
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">{log.timestamp}</span>
              <span className={`text-[11px] font-mono leading-tight ${logColor(log.type)}`}>{log.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Autonomous Control Actions */}
      <div>
        <span className="font-display text-[9px] tracking-widest text-muted-foreground flex items-center gap-1 mb-1.5">
          <Shield size={11} /> AUTONOMOUS CONTROLS
        </span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {controlActions.map((action, i) => {
            const active = activeControls.has(i);
            return (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] font-mono transition-all duration-500 ${
                  active
                    ? "border-neon-green/50 bg-neon-green/10 text-neon-green shadow-[0_0_8px_hsl(150_80%_45%/0.15)]"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-neon-green animate-pulse-glow" : "bg-muted-foreground/40"}`} />
                {action.icon}
                <span className="truncate">{action.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Prediction Panel */}
      <div>
        <span className="font-display text-[9px] tracking-widest text-muted-foreground flex items-center gap-1 mb-1.5">
          <TrendingUp size={11} /> AI PREDICTIONS (NEXT 10 MIN)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Voltage Stability", value: predictions.voltage },
            { label: "Reverse Flow Risk", value: predictions.reverseFlow },
            { label: "Grid Congestion", value: predictions.congestion },
          ].map((p, i) => (
            <div key={i} className="bg-muted/30 rounded-md p-2 border border-border text-center">
              <span className="font-display text-[8px] tracking-widest text-muted-foreground block mb-1">{p.label.toUpperCase()}</span>
              <div className="flex items-center justify-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${riskDot(p.value)}`} />
                <span className={`font-mono text-xs font-bold ${riskColor(p.value)}`}>{p.value.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Simulation Trigger */}
      <button
        onClick={runSimulation}
        disabled={simRunning}
        className={`py-2.5 px-4 rounded-lg font-display text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
          simRunning
            ? "bg-neon-amber/20 text-neon-amber border border-neon-amber/40 cursor-wait"
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
  );
};

export default AIGridAgent;
