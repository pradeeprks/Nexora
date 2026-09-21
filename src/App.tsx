import React, { useState, useEffect } from 'react';
import { ActiveTab, IntersectionAgent, EmergencyVehicle, AIDecisionLog as LogItem, TrafficMetricPoint, SimulationConfig, SignalColor } from './types/traffic';
import { 
  INITIAL_AGENTS, 
  INITIAL_EMERGENCY_VEHICLE, 
  INITIAL_LOGS, 
  INITIAL_HISTORY, 
  INITIAL_SIM_CONFIG,
  computeDensityLevel,
  getCurrentTimeFormatted
} from './services/simulationEngine';

import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TrafficDashboard } from './components/TrafficDashboard';
import { LiveTrafficMap } from './components/LiveTrafficMap';
import { IntersectionAgentDetail } from './components/IntersectionAgentDetail';
import { MultiAgentCommunication } from './components/MultiAgentCommunication';
import { DecentralizedCityMesh } from './components/DecentralizedCityMesh';
import { EmergencyVehiclePriority } from './components/EmergencyVehiclePriority';
import { DynamicSignalControl } from './components/DynamicSignalControl';
import { TrafficAnalytics } from './components/TrafficAnalytics';
import { AIDecisionLog } from './components/AIDecisionLog';
import { SystemArchitecture } from './components/SystemArchitecture';
import { AdminPanel } from './components/AdminPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { SimulationMode } from './components/SimulationMode';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('LANDING');
  const [agents, setAgents] = useState<IntersectionAgent[]>(INITIAL_AGENTS);
  const [emergencyVehicle, setEmergencyVehicle] = useState<EmergencyVehicle>(INITIAL_EMERGENCY_VEHICLE);
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [history, setHistory] = useState<TrafficMetricPoint[]>(INITIAL_HISTORY);
  const [simConfig, setSimConfig] = useState<SimulationConfig>(INITIAL_SIM_CONFIG);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('AGENT-01');

  // Real-Time Simulation Loop
  useEffect(() => {
    if (!simConfig.isRunning) return;

    const intervalMs = 1000 / simConfig.simulationSpeed;

    const timer = setInterval(() => {
      const nowTime = getCurrentTimeFormatted();

      setAgents((prevAgents) => {
        return prevAgents.map((agent) => {
          if (agent.status === 'OFFLINE') return agent;

          // If emergency wave active and agent on route, lock to GREEN
          const isOnEmergencyRoute = emergencyVehicle.active && emergencyVehicle.priorityRoute.includes(agent.id);
          if (isOnEmergencyRoute) {
            return {
              ...agent,
              currentSignal: 'GREEN',
              signalTimer: Math.max(1, agent.signalTimer - 1),
              status: 'EMERGENCY'
            };
          }

          let nextTimer = agent.signalTimer - 1;
          let nextSignal: SignalColor = agent.currentSignal;
          let nextDecision = agent.lastDecision;

          // Traffic count fluctuations based on simulation density
          const vehicleDelta = Math.floor(Math.random() * 5) - 2;
          const newVehicles = Math.max(5, agent.totalVehicles + vehicleDelta);
          const newQueue = Math.max(0, agent.queueLength + Math.floor(Math.random() * 3) - 1);
          const newDensity = computeDensityLevel(newVehicles);

          // Cycle Signal Phases when timer expires
          if (nextTimer <= 0) {
            if (agent.currentSignal === 'GREEN') {
              nextSignal = 'YELLOW';
              nextTimer = agent.signalDurations.yellow;
            } else if (agent.currentSignal === 'YELLOW') {
              nextSignal = 'RED';
              nextTimer = agent.signalDurations.red;
            } else {
              nextSignal = 'GREEN';
              // Autonomous AI decision logic: if queue > 14, extend green phase
              if (newQueue > 14) {
                const ext = 8;
                nextTimer = agent.signalDurations.green + ext;
                nextDecision = {
                  timestamp: nowTime,
                  action: `Extend green phase by ${ext} seconds`,
                  reason: `High localized queue detected (${newQueue} vehicles)`,
                  extendedSeconds: ext
                };

                // Add log entry
                setLogs(l => [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: nowTime,
                    agentId: agent.id,
                    agentName: agent.name,
                    type: 'TIMING_ADJUST',
                    message: `${agent.id} autonomously extended Green phase by ${ext}s due to ${newQueue} queued vehicles.`,
                    severity: 'success'
                  },
                  ...l.slice(0, 40)
                ]);
              } else {
                nextTimer = agent.signalDurations.green;
              }
            }
          }

          return {
            ...agent,
            currentSignal: nextSignal,
            signalTimer: nextTimer,
            totalVehicles: newVehicles,
            queueLength: newQueue,
            trafficDensity: newDensity,
            status: agent.status === 'EMERGENCY' ? 'ACTIVE' : agent.status,
            lastDecision: nextDecision
          };
        });
      });

      // Update Emergency Vehicle ETA
      setEmergencyVehicle((prev) => {
        if (!prev.active) return prev;
        const nextEta = prev.etaSeconds - 1;
        if (nextEta <= 0) {
          setLogs((l) => [
            {
              id: `log-ev-${Date.now()}`,
              timestamp: nowTime,
              agentId: 'AGENT-01',
              agentName: 'System Mesh',
              type: 'EMERGENCY_PRIORITY',
              message: `Emergency Vehicle (${prev.callsign}) reached destination. Normal decentralized mesh control restored.`,
              severity: 'info'
            },
            ...l
          ]);
          return { ...prev, active: false, etaSeconds: 45 };
        }
        return { ...prev, etaSeconds: nextEta };
      });

      // Update Metrics History for Live Charts
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        const newPoint: TrafficMetricPoint = {
          time: nowTime,
          avgWaitTimeSec: Math.max(15, Math.floor(25 + Math.random() * 8 - 4)),
          totalVehicles: agents.reduce((acc, a) => acc + a.totalVehicles, 0),
          flowEfficiencyPercent: Math.min(98, Math.max(70, Math.floor(88 + Math.random() * 6 - 3))),
          congestionIndex: Math.floor(35 + Math.random() * 10),
          throughputVehiclesPerMin: Math.floor(160 + Math.random() * 20)
        };
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });

    }, intervalMs);

    return () => clearInterval(timer);
  }, [simConfig.isRunning, simConfig.simulationSpeed, emergencyVehicle.active, agents]);

  // Demo Trigger Action
  const handleRunDemo = () => {
    setActiveTab('DASHBOARD');
    setSimConfig(prev => ({ ...prev, isRunning: true, simulationSpeed: 2 }));
    
    // Trigger sudden congestion on Agent 02 & Dispatch Emergency Ambulance
    setAgents(prev => prev.map(a => {
      if (a.id === 'AGENT-02') {
        return {
          ...a,
          trafficDensity: 'HIGH',
          totalVehicles: 48,
          queueLength: 24,
          lastDecision: {
            timestamp: getCurrentTimeFormatted(),
            action: 'Requested peer signal sync with AGENT-01',
            reason: 'Inbound surge from West corridor'
          }
        };
      }
      return a;
    }));

    setEmergencyVehicle({
      id: "EV-DEMO",
      type: "AMBULANCE",
      callsign: "MEDIC-01 (St. Mary Hospital)",
      currentIntersectionId: "AGENT-01",
      targetIntersectionId: "AGENT-08",
      priorityRoute: ["AGENT-01", "AGENT-02", "AGENT-05", "AGENT-08"],
      etaSeconds: 45,
      active: true
    });

    setLogs(prev => [
      {
        id: `demo-${Date.now()}`,
        timestamp: getCurrentTimeFormatted(),
        agentId: 'AGENT-01',
        agentName: 'Downtown Hub',
        type: 'EMERGENCY_PRIORITY',
        message: 'LIVE DEMO STARTED: Emergency vehicle detected. Priority green wave cascade broadcast to Agents 01, 02, 05, and 08.',
        severity: 'critical'
      },
      ...prev
    ]);
  };

  // Toggle Emergency Mode
  const handleTriggerEmergency = () => {
    setEmergencyVehicle(prev => ({ ...prev, active: !prev.active, etaSeconds: 45 }));
    if (!emergencyVehicle.active) {
      setLogs(prev => [
        {
          id: `em-${Date.now()}`,
          timestamp: getCurrentTimeFormatted(),
          agentId: 'AGENT-01',
          agentName: 'System',
          type: 'EMERGENCY_PRIORITY',
          message: 'Emergency priority mode dispatched. Priority route signals locked to GREEN.',
          severity: 'critical'
        },
        ...prev
      ]);
    }
  };

  // Toggle Failover for Agent (Simulate Offline)
  const handleToggleFailover = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const nextStatus = a.status === 'OFFLINE' ? 'ACTIVE' : 'OFFLINE';
        setLogs(l => [
          {
            id: `fail-${Date.now()}`,
            timestamp: getCurrentTimeFormatted(),
            agentId: a.id,
            agentName: a.name,
            type: 'FAILOVER_RECOVERY',
            message: nextStatus === 'OFFLINE' 
              ? `${a.id} went OFFLINE. Adjacent agents detected peer heartbeat timeout and autonomously rerouted traffic.`
              : `${a.id} RESTORED ONLINE. Peer mesh re-established.`,
            severity: nextStatus === 'OFFLINE' ? 'warning' : 'success'
          },
          ...l
        ]);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Update Dynamic Signal Durations
  const handleUpdateDurations = (agentId: string, green: number, yellow: number, red: number) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return {
          ...a,
          signalDurations: { green, yellow, red }
        };
      }
      return a;
    }));
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-[#ff2a5f] selection:text-white">
      
      {/* Top Glassmorphism Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={simConfig.isRunning}
        onToggleSim={() => setSimConfig(c => ({ ...c, isRunning: !c.isRunning }))}
        onRunDemo={handleRunDemo}
        onTriggerEmergency={handleTriggerEmergency}
        activeEmergency={emergencyVehicle.active}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'LANDING' && (
          <LandingHero 
            onLaunchDashboard={() => setActiveTab('DASHBOARD')}
            onRunSimulation={() => setActiveTab('SIMULATION')}
            onRunDemo={handleRunDemo}
            agents={agents}
          />
        )}

        {activeTab === 'DASHBOARD' && (
          <TrafficDashboard 
            agents={agents}
            emergencyVehicle={emergencyVehicle}
            history={history}
            onSelectAgent={(id) => {
              setSelectedAgentId(id);
              setActiveTab('AGENTS');
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'LIVE_MAP' && (
          <LiveTrafficMap 
            agents={agents}
            emergencyVehicle={emergencyVehicle}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            setActiveTab={setActiveTab}
          />
        )}

        {(activeTab === 'AGENTS' || activeTab === 'INTERSECTIONS') && (
          <IntersectionAgentDetail 
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
          />
        )}

        {activeTab === 'CITY_MESH' && (
          <DecentralizedCityMesh 
            agents={agents}
            onSelectAgent={(id) => {
              setSelectedAgentId(id);
              setActiveTab('AGENTS');
            }}
          />
        )}

        {activeTab === 'EMERGENCY' && (
          <EmergencyVehiclePriority 
            emergencyVehicle={emergencyVehicle}
            agents={agents}
            onTriggerEmergency={handleTriggerEmergency}
            onClearEmergency={() => setEmergencyVehicle(prev => ({ ...prev, active: false }))}
          />
        )}

        {activeTab === 'SIGNAL_CONTROL' && (
          <DynamicSignalControl 
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
            onUpdateDurations={handleUpdateDurations}
          />
        )}

        {activeTab === 'SIMULATION' && (
          <SimulationMode 
            config={simConfig}
            onUpdateConfig={(cfg: Partial<SimulationConfig>) => setSimConfig(prev => ({ ...prev, ...cfg }))}
            onStartSim={() => setSimConfig(prev => ({ ...prev, isRunning: true }))}
            onPauseSim={() => setSimConfig(prev => ({ ...prev, isRunning: false }))}
            onResetSim={() => {
              setAgents(INITIAL_AGENTS);
              setEmergencyVehicle(INITIAL_EMERGENCY_VEHICLE);
              setSimConfig(INITIAL_SIM_CONFIG);
            }}
            onRunDemo={handleRunDemo}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <TrafficAnalytics history={history} />
        )}

        {activeTab === 'DECISION_LOGS' && (
          <AIDecisionLog logs={logs} onClearLogs={() => setLogs([])} />
        )}

        {activeTab === 'ARCHITECTURE' && (
          <SystemArchitecture />
        )}

        {activeTab === 'ADMIN' && (
          <AdminPanel 
            agents={agents}
            onToggleAgentFailover={handleToggleFailover}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <SettingsPanel />
        )}

      </main>

      {/* Futuristic Footer */}
      <footer className="border-t border-[#1e2436] bg-[#090a0f] py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-white">NEXORA</strong> – Dynamic Multi-Agent Traffic Orchestration Network &copy; 2026
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-[#ff2a5f] font-bold">DECENTRALIZED</span> • 
            <span className="text-cyan-400 font-bold">AUTONOMOUS</span> • 
            <span className="text-emerald-400 font-bold">REAL-TIME</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
