import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Cpu, 
  Navigation, 
  Layers, 
  TrafficCone, 
  Activity, 
  X, 
  ArrowRight,
  ShieldCheck,
  Siren,
  Clock,
  Car
} from 'lucide-react';
import { IntersectionAgent, EmergencyVehicle, ActiveTab } from '../types/traffic';

interface LiveTrafficMapProps {
  agents: IntersectionAgent[];
  emergencyVehicle: EmergencyVehicle;
  selectedAgentId: string | null;
  onSelectAgent: (id: string | null) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LiveTrafficMap: React.FC<LiveTrafficMapProps> = ({
  agents,
  emergencyVehicle,
  selectedAgentId,
  onSelectAgent,
  setActiveTab
}) => {
  const [mapMode, setMapMode] = useState<'CYBER_GRID' | 'LEAFLET'>('CYBER_GRID');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || null;

  // Render Cyber Grid Canvas Map
  useEffect(() => {
    if (mapMode !== 'CYBER_GRID') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Map road coordinates scaled to canvas width/height
    const getScaledPos = (agent: IntersectionAgent) => {
      const minX = 100, maxX = 900;
      const minY = 100, maxY = 650;
      const x = ((agent.canvasX - minX) / (maxX - minX)) * (width - 160) + 80;
      const y = ((agent.canvasY - minY) / (maxY - minY)) * (height - 160) + 80;
      return { x, y };
    };

    // Vehicles particles traveling along roads
    const vehicles: { x: number; y: number; fromIdx: number; toIdx: number; progress: number; speed: number }[] = [];
    
    const roadConnections: [number, number][] = [
      [0, 1], [1, 2], [2, 5], [5, 4], [4, 7], [7, 6], [6, 0], [0, 3], [3, 4], [1, 4], [0, 6]
    ];

    for (let i = 0; i < 24; i++) {
      const conn = roadConnections[Math.floor(Math.random() * roadConnections.length)];
      vehicles.push({
        x: 0,
        y: 0,
        fromIdx: conn[0],
        toIdx: conn[1],
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dark city background with cyber grid lines
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(30, 36, 54, 0.3)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Roads between Intersections
      roadConnections.forEach(([i1, i2]) => {
        const a1 = agents[i1];
        const a2 = agents[i2];
        if (!a1 || !a2) return;
        const p1 = getScaledPos(a1);
        const p2 = getScaledPos(a2);

        // Check if road is on Emergency Route
        const isEmergencyPath = emergencyVehicle.active && 
          emergencyVehicle.priorityRoute.includes(a1.id) && 
          emergencyVehicle.priorityRoute.includes(a2.id);

        // Asphalt Road Bed
        ctx.strokeStyle = isEmergencyPath ? 'rgba(255, 183, 3, 0.4)' : '#161b28';
        ctx.lineWidth = isEmergencyPath ? 14 : 10;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Lane markings
        ctx.strokeStyle = isEmergencyPath ? '#ffb703' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Animate Vehicles
      vehicles.forEach(v => {
        v.progress += v.speed;
        if (v.progress >= 1) {
          v.progress = 0;
          const conn = roadConnections[Math.floor(Math.random() * roadConnections.length)];
          v.fromIdx = conn[0];
          v.toIdx = conn[1];
        }
        const a1 = agents[v.fromIdx];
        const a2 = agents[v.toIdx];
        if (a1 && a2) {
          const p1 = getScaledPos(a1);
          const p2 = getScaledPos(a2);
          const vx = p1.x + (p2.x - p1.x) * v.progress;
          const vy = p1.y + (p2.y - p1.y) * v.progress;

          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(vx, vy, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Render Intersections (Nodes)
      agents.forEach((agent) => {
        const p = getScaledPos(agent);
        const isSelected = selectedAgentId === agent.id;

        // Density level color: Green=Low, Yellow=Moderate, Orange=High, Red=Severe
        let densityColor = '#00e676';
        if (agent.trafficDensity === 'MODERATE') densityColor = '#ffb703';
        if (agent.trafficDensity === 'HIGH') densityColor = '#ff9100';
        if (agent.trafficDensity === 'SEVERE') densityColor = '#ff2a5f';

        // Outer pulse circle
        ctx.strokeStyle = densityColor;
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 24 : 18, 0, Math.PI * 2);
        ctx.stroke();

        // Node center fill
        ctx.fillStyle = '#121520';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Signal state LED bulb
        let signalLed = '#00e676';
        if (agent.currentSignal === 'YELLOW') signalLed = '#ffb703';
        if (agent.currentSignal === 'RED') signalLed = '#ff2a5f';

        ctx.fillStyle = signalLed;
        ctx.shadowColor = signalLed;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node Label Box
        ctx.fillStyle = isSelected ? '#ff2a5f' : '#1e2436';
        ctx.fillRect(p.x - 36, p.y + 22, 72, 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(agent.id, p.x, p.y + 34);

        // Density Badge
        ctx.fillStyle = densityColor;
        ctx.font = '8px Outfit';
        ctx.fillText(`${agent.queueLength} vq`, p.x, p.y - 24);
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [agents, mapMode, selectedAgentId, emergencyVehicle]);

  return (
    <div className="space-y-6">
      
      {/* Map Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#ff2a5f]" />
            <span>Interactive City Mesh Map</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            8 Decentralized Intersections • Real-time traffic density stream
          </p>
        </div>

        {/* Legend & View Toggles */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          
          {/* Traffic Level Legend */}
          <div className="hidden md:flex items-center space-x-3 bg-[#121520] px-3 py-1.5 rounded-lg border border-[#1e2436]">
            <span className="flex items-center text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1"></span> Low
            </span>
            <span className="flex items-center text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1"></span> Moderate
            </span>
            <span className="flex items-center text-orange-400">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 mr-1"></span> High
            </span>
            <span className="flex items-center text-[#ff2a5f]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] mr-1"></span> Severe
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex bg-[#121520] p-1 rounded-lg border border-[#1e2436]">
            <button
              onClick={() => setMapMode('CYBER_GRID')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                mapMode === 'CYBER_GRID' 
                  ? 'bg-[#ff2a5f] text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cyber Grid
            </button>
            <button
              onClick={() => setMapMode('LEAFLET')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                mapMode === 'LEAFLET' 
                  ? 'bg-[#ff2a5f] text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite OSM
            </button>
          </div>

        </div>
      </div>

      {/* Main Map Viewport & Drawer Container */}
      <div className="relative w-full h-[600px] rounded-2xl border border-[#1e2436] glass-panel overflow-hidden shadow-glass">
        
        {/* Render Canvas or Leaflet */}
        {mapMode === 'CYBER_GRID' ? (
          <div className="relative w-full h-full cursor-crosshair">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full block"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                // Detect click on nearest agent node
                const width = rect.width;
                const height = rect.height;

                agents.forEach(agent => {
                  const minX = 100, maxX = 900;
                  const minY = 100, maxY = 650;
                  const x = ((agent.canvasX - minX) / (maxX - minX)) * (width - 160) + 80;
                  const y = ((agent.canvasY - minY) / (maxY - minY)) * (height - 160) + 80;

                  const dist = Math.hypot(clickX - x, clickY - y);
                  if (dist < 30) {
                    onSelectAgent(agent.id);
                  }
                });
              }}
            />

            {/* Instruction Overlay */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-[#090a0f]/80 border border-[#1e2436] text-[11px] font-mono text-slate-300 backdrop-blur-md">
              💡 Click any intersection node to open AI Agent Telemetry
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-[#090a0f] p-8 flex items-center justify-center text-center">
            <div className="max-w-md space-y-4">
              <Navigation className="w-12 h-12 text-[#ff2a5f] mx-auto animate-bounce" />
              <h3 className="text-xl font-bold font-outfit text-white">OpenStreetMap Vector Grid Layer</h3>
              <p className="text-xs text-slate-400 font-mono">
                Simulated dark map tiles loaded. 8 autonomous agents pinned at San Francisco Smart City coordinates.
              </p>
              <div className="grid grid-cols-2 gap-2 text-left">
                {agents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => onSelectAgent(a.id)}
                    className="p-2 rounded bg-[#121520] border border-[#1e2436] hover:border-[#ff2a5f]/40 text-xs font-mono text-slate-200 text-left flex items-center justify-between"
                  >
                    <span>{a.id}</span>
                    <span className="text-emerald-400">{a.trafficDensity}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide-over Inspection Panel for Selected Agent */}
        {selectedAgent && (
          <div className="absolute top-0 right-0 w-full sm:w-[380px] h-full bg-[#0e111a]/95 border-l border-[#1e2436] backdrop-blur-2xl z-30 p-6 overflow-y-auto space-y-6 shadow-2xl transition-all">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#1e2436] pb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[#ff2a5f]" />
                <div>
                  <h3 className="text-lg font-extrabold font-outfit text-white">{selectedAgent.id}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedAgent.name}</p>
                </div>
              </div>
              <button 
                onClick={() => onSelectAgent(null)}
                className="p-1 rounded-lg bg-[#121520] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
                <span className="text-slate-400 block text-[10px]">AGENT STATUS</span>
                <span className="text-emerald-400 font-bold text-sm flex items-center mt-1">
                  <ShieldCheck className="w-4 h-4 mr-1" /> {selectedAgent.status}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
                <span className="text-slate-400 block text-[10px]">CURRENT SIGNAL</span>
                <span className={`font-bold text-sm flex items-center mt-1 ${
                  selectedAgent.currentSignal === 'GREEN' ? 'text-emerald-400' :
                  selectedAgent.currentSignal === 'YELLOW' ? 'text-amber-400' :
                  'text-[#ff2a5f]'
                }`}>
                  <Activity className="w-4 h-4 mr-1" /> {selectedAgent.currentSignal} ({selectedAgent.signalTimer}s)
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
                <span className="text-slate-400 block text-[10px]">DETECTED VEHICLES</span>
                <span className="text-white font-bold text-sm flex items-center mt-1">
                  <Car className="w-4 h-4 mr-1 text-cyan-400" /> {selectedAgent.totalVehicles}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
                <span className="text-slate-400 block text-[10px]">QUEUE LENGTH</span>
                <span className="text-amber-400 font-bold text-sm flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" /> {selectedAgent.queueLength} vehicles
                </span>
              </div>
            </div>

            {/* AI Autonomous Decision Reasoning */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#121520] to-[#1a1f30] border border-[#ff2a5f]/30 space-y-2">
              <div className="flex items-center space-x-2 text-[#ff2a5f] text-xs font-mono font-bold">
                <Cpu className="w-4 h-4 animate-pulse" />
                <span>LOCAL AI DECISION ENGINE</span>
              </div>
              <p className="text-sm font-bold text-white font-outfit">
                "{selectedAgent.lastDecision.action}"
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Reason: {selectedAgent.lastDecision.reason}
              </p>
              <div className="text-[10px] text-slate-500 font-mono text-right">
                Logged at: {selectedAgent.lastDecision.timestamp}
              </div>
            </div>

            {/* Neighboring Agents Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                PEER NEIGHBOR CONNECTIONS
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.neighbors.map(nId => (
                  <button
                    key={nId}
                    onClick={() => onSelectAgent(nId)}
                    className="px-3 py-1.5 rounded bg-[#121520] border border-[#1e2436] hover:border-[#ff2a5f]/40 text-xs font-mono text-cyan-400 flex items-center space-x-1"
                  >
                    <span>{nId}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Deep Inspect Button */}
            <button
              onClick={() => {
                setActiveTab('AGENTS');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-[#ff003c] text-white font-outfit font-bold text-xs uppercase tracking-wider shadow-neon-red hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>Full Agent Telemetry Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
