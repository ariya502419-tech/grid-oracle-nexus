import { useEffect, useState } from "react";

const TopBar = ({ systemStatus = "stable" }: { systemStatus?: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = systemStatus === "stable" ? "text-neon-green" : systemStatus === "warning" ? "text-neon-amber" : "text-neon-red";
  const statusGlow = systemStatus === "stable" ? "glow-text-green" : "";

  return (
    <div className="flex items-center justify-between px-6 py-3 neon-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse-glow" />
        <h1 className="font-display text-sm md:text-base tracking-wider text-primary glow-text-blue">
          GRIDTWIN DASHBOARD
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${systemStatus === "stable" ? "bg-neon-green" : systemStatus === "warning" ? "bg-neon-amber" : "bg-neon-red"} animate-pulse-glow`} />
          <span className={`font-mono text-xs uppercase tracking-widest ${statusColor} ${statusGlow}`}>
            {systemStatus === "stable" ? "System Stable" : systemStatus === "warning" ? "Warning" : "Alert"}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-muted-foreground">
          <span className="font-mono text-xs">LIVE</span>
          <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse-glow" />
        </div>

        <span className="font-mono text-xs text-muted-foreground tracking-wider">
          {time.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
