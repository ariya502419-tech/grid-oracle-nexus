import { useState, useCallback, useEffect } from "react";
import TopBar from "@/components/TopBar";
import GridDiagram from "@/components/GridDiagram";
import LiveDataPanel from "@/components/LiveDataPanel";
import ControlPanel from "@/components/ControlPanel";
import AIGridAgent from "@/components/AIGridAgent";

const Dashboard = () => {
  const [solarOutput, setSolarOutput] = useState(45);
  const [voltage, setVoltage] = useState(230);
  const [loadDemand, setLoadDemand] = useState(60);
  const [isReversed, setIsReversed] = useState(false);
  const [systemStatus, setSystemStatus] = useState("stable");
  const [mpptActive, setMpptActive] = useState(false);
  const [antiBackflowActive, setAntiBackflowActive] = useState(false);
  const [voltageStabActive, setVoltageStabActive] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  // Simulate gentle fluctuations
  useEffect(() => {
    if (demoRunning) return;
    const interval = setInterval(() => {
      setSolarOutput((prev) => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 5)));
      setLoadDemand((prev) => Math.max(40, Math.min(80, prev + (Math.random() - 0.5) * 3)));
      setVoltage((prev) => Math.max(225, Math.min(235, prev + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, [demoRunning]);

  const runDemo = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    setMpptActive(false);
    setAntiBackflowActive(false);
    setVoltageStabActive(false);

    // Phase 1: Solar increases
    setTimeout(() => {
      setSolarOutput(95);
      setSystemStatus("warning");
    }, 1000);

    // Phase 2: Reverse flow appears
    setTimeout(() => {
      setSolarOutput(110);
      setIsReversed(true);
      setVoltage(248);
      setSystemStatus("alert");
    }, 3000);

    // Phase 3: Systems activate
    setTimeout(() => {
      setMpptActive(true);
    }, 5000);

    setTimeout(() => {
      setAntiBackflowActive(true);
    }, 6500);

    setTimeout(() => {
      setVoltageStabActive(true);
      setVoltage(231);
    }, 8000);

    // Phase 4: Stabilize
    setTimeout(() => {
      setSolarOutput(72);
      setIsReversed(false);
      setSystemStatus("stable");
      setDemoRunning(false);
    }, 10000);
  }, [demoRunning]);

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      <TopBar systemStatus={systemStatus} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-3 p-3">
        {/* Left - Live Data */}
        <div className="order-2 lg:order-1">
          <LiveDataPanel
            solarOutput={solarOutput}
            voltage={voltage}
            loadDemand={loadDemand}
            isReversed={isReversed}
            systemStatus={systemStatus}
          />
        </div>

        {/* Center - Digital Twin */}
        <div className="order-1 lg:order-2">
          <GridDiagram solarOutput={solarOutput} isReversed={isReversed} />
        </div>

        {/* Right - Controls */}
        <div className="order-3">
          <ControlPanel
            mpptActive={mpptActive}
            antiBackflowActive={antiBackflowActive}
            voltageStabActive={voltageStabActive}
            onRunDemo={runDemo}
            demoRunning={demoRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
