import React, { useEffect, useState } from 'react';
import { 
  Radio, 
  Cpu, 
  ArrowDown, 
  ArrowLeftRight, 
  Share2, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  CheckCircle2,
  Zap
} from 'lucide-react';
import { IntersectionAgent } from '../types/traffic';

interface MultiAgentCommunicationProps {
  agents: IntersectionAgent[];
}

export const MultiAgentCommunication: React.FC<MultiAgentCommunicationProps> = ({ agents }) => {
  const [activePacket, setActivePacket] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePacket((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const agent1 = agents.find(a => a.id === 'AGENT-01') || agents[0];
  const agent2 = agents.find(a => a.id === 'AGENT-02') || agents[1];
  const agent3 = agents.find(a => a.id === 'AGENT-03') || agents[2];
  const agent4 = agents.find(a => a.id === 'AGENT-04') || agents[3];

  const packetMessages = [
    { from: "Agent 01", to: "Agent 02", type: "Traffic-state sharing", text: "Queue alert: 12 vehicles northbound", color: "text-cyan-400" },
    { from: "Agent 02", to: "Agent 03", type: "Neighbor communication", text: "Peer sync request: +8s green wave", color: "text-[#ff2a5f]" },
    { from: "Agent 03", to: "Agent 02", type: "Signal coordination", text: "Ack: Signal phase aligned", color: "text-emerald-400" },
    { from: "Agent 02", to: "Agent 04", type: "Congestion alerts", text: "Flow surge warning on East corridor", color: "text-amber-400" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <Radio className="w-5 h-5 text-[#ff2a5f] animate-pulse" />
            <span>Multi-Agent Communication Protocol</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Peer-to-Peer Inter-Agent Messaging & Distributed State Synchronization
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#121520] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>P2P Broadcast Active (Sub-5ms Latency)</span>
        </div>
      </div>

      {/* Specified Hierarchy Diagram: Agent 1 -> Agent 2 <-> Agent 3 -> Agent 4 */}
      <div className="p-8 rounded-2xl glass-panel border border-[#1e2436] space-y-8 relative overflow-hidden">
        
        {/* Animated Background Line Grid */}
        <div className="absolute inset-0 cyber-grid-red opacity-30 pointer-events-none"></div>

        {/* Level 1: Agent 1 */}
        <div className="flex justify-center relative z-10">
          <div className={`p-5 rounded-2xl glass-panel border w-72 transition-all shadow-glass ${
            activePacket === 0 ? 'border-[#ff2a5f] shadow-neon-red scale-105' : 'border-[#1e2436]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#ff2a5f]">AGENT 01</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold font-outfit text-white mt-1">{agent1.name}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div>Vehicles: <strong className="text-white">{agent1.totalVehicles}</strong></div>
              <div>Signal: <strong className="text-emerald-400">{agent1.currentSignal}</strong></div>
            </div>
          </div>
        </div>

        {/* Arrow Down: Agent 1 -> Agent 2 */}
        <div className="flex justify-center items-center flex-col relative z-10">
          <div className="w-0.5 h-10 bg-gradient-to-b from-[#ff2a5f] to-cyan-400 animate-pulse"></div>
          <div className="px-3 py-1 rounded-full bg-[#121520] border border-cyan-500/40 text-cyan-400 text-[10px] font-mono shadow-neon-cyan">
            Traffic-State Sharing Packet
          </div>
          <ArrowDown className="w-6 h-6 text-cyan-400 mt-1 animate-bounce" />
        </div>

        {/* Level 2: Agent 2 ↔ Agent 3 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
          
          {/* Agent 2 */}
          <div className={`p-5 rounded-2xl glass-panel border w-72 transition-all shadow-glass ${
            activePacket === 1 || activePacket === 3 ? 'border-cyan-400 shadow-neon-cyan scale-105' : 'border-[#1e2436]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">AGENT 02</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold font-outfit text-white mt-1">{agent2.name}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div>Vehicles: <strong className="text-white">{agent2.totalVehicles}</strong></div>
              <div>Signal: <strong className="text-amber-400">{agent2.currentSignal}</strong></div>
            </div>
          </div>

          {/* Bidirectional Arrow ↔ Agent 2 and Agent 3 */}
          <div className="flex flex-col items-center">
            <div className="px-3 py-1 rounded-full bg-[#121520] border border-[#ff2a5f]/40 text-[#ff2a5f] text-[10px] font-mono shadow-neon-red">
              Neighbor State & Sync
            </div>
            <ArrowLeftRight className="w-8 h-8 text-[#ff2a5f] my-2 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400">Bi-directional Peer Link</span>
          </div>

          {/* Agent 3 */}
          <div className={`p-5 rounded-2xl glass-panel border w-72 transition-all shadow-glass ${
            activePacket === 2 ? 'border-emerald-400 shadow-neon-green scale-105' : 'border-[#1e2436]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400">AGENT 03</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold font-outfit text-white mt-1">{agent3.name}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div>Vehicles: <strong className="text-white">{agent3.totalVehicles}</strong></div>
              <div>Signal: <strong className="text-emerald-400">{agent3.currentSignal}</strong></div>
            </div>
          </div>

        </div>

        {/* Arrow Down: Agent 2 -> Agent 4 */}
        <div className="flex justify-center items-center flex-col relative z-10">
          <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-400 to-amber-400 animate-pulse"></div>
          <div className="px-3 py-1 rounded-full bg-[#121520] border border-amber-500/40 text-amber-400 text-[10px] font-mono">
            Congestion & Signal Coordination
          </div>
          <ArrowDown className="w-6 h-6 text-amber-400 mt-1 animate-bounce" />
        </div>

        {/* Level 3: Agent 4 */}
        <div className="flex justify-center relative z-10">
          <div className={`p-5 rounded-2xl glass-panel border w-72 transition-all shadow-glass ${
            activePacket === 3 ? 'border-amber-400 shadow-lg scale-105' : 'border-[#1e2436]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">AGENT 04</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h4 className="text-sm font-bold font-outfit text-white mt-1">{agent4.name}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div>Vehicles: <strong className="text-white">{agent4.totalVehicles}</strong></div>
              <div>Signal: <strong className="text-[#ff2a5f]">{agent4.currentSignal}</strong></div>
            </div>
          </div>
        </div>

      </div>

      {/* Real-time Peer Packet Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packetMessages.map((pkt, idx) => (
          <div 
            key={idx}
            className={`p-4 rounded-xl glass-panel border transition-all ${
              activePacket === idx ? 'border-[#ff2a5f] bg-[#ff2a5f]/10' : 'border-[#1e2436]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                {pkt.from} → {pkt.to}
              </span>
              <span className={`text-xs font-mono font-bold ${pkt.color}`}>
                {pkt.type}
              </span>
            </div>
            <p className="text-sm font-bold text-white font-outfit mt-2">
              "{pkt.text}"
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
