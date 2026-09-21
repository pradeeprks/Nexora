import React from 'react';
import { 
  Radio, 
  Cpu, 
  ShieldAlert, 
  Activity, 
  Share2, 
  Zap, 
  CheckCircle2, 
  Layers,
  Lock
} from 'lucide-react';
import { IntersectionAgent } from '../types/traffic';

interface DecentralizedCityMeshProps {
  agents: IntersectionAgent[];
  onSelectAgent: (id: string) => void;
}

export const DecentralizedCityMesh: React.FC<DecentralizedCityMeshProps> = ({
  agents,
  onSelectAgent
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner emphasizing Key Differentiator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121520] via-[#1a1f30] to-[#121520] border border-[#ff2a5f]/40 shadow-neon-red space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-7 h-7 text-[#ff2a5f] animate-pulse" />
            <div>
              <h2 className="text-2xl font-extrabold font-outfit text-white uppercase tracking-wider">
                DECENTRALIZED CITY MESH ARCHITECTURE
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                Peer-to-Peer Consensus • Zero Single Point of Failure
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/40 text-xs font-mono font-bold">
            NO SINGLE CENTRAL CONTROLLER
          </span>
        </div>

        <p className="text-xs text-slate-300 font-mono leading-relaxed border-t border-[#1e2436] pt-3">
          Notice: The central element "CITY MESH" represents the shared distributed consensus topology—NOT a central server. Each intersection agent independently observes local sensors, makes autonomous decisions, and negotiates directly with adjacent agents.
        </p>
      </div>

      {/* Main Radial Mesh Visualization */}
      <div className="p-8 rounded-2xl glass-panel border border-[#1e2436] relative overflow-hidden min-h-[520px] flex items-center justify-center">
        
        {/* Cyber grid background pattern */}
        <div className="absolute inset-0 cyber-grid-red opacity-20 pointer-events-none"></div>

        {/* Outer Ring Circle */}
        <div className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-[#ff2a5f]/20 animate-spin-slow pointer-events-none"></div>
        <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-500/20 pointer-events-none"></div>

        {/* CENTER NODE: CITY MESH (Explicitly NOT a central controller) */}
        <div className="relative z-20 w-44 h-44 rounded-full bg-gradient-to-br from-[#121520] to-[#1a1f35] border-2 border-cyan-400 p-1 shadow-neon-cyan flex flex-col items-center justify-center text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-extrabold font-outfit text-white tracking-wider">
            CITY MESH
          </h3>
          <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-tight px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            Distributed Peer Mesh
          </span>
          <span className="text-[8px] font-mono text-slate-400 max-w-[120px] leading-tight">
            No Centralized Control
          </span>
        </div>

        {/* Perimeter Connected Intersection Agents (1 to 8) */}
        {agents.slice(0, 8).map((agent, index) => {
          const total = Math.min(agents.length, 8);
          const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
          const radius = 210; // Distance from center
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              className="absolute z-20 cursor-pointer group"
            >
              {/* Connecting line to center */}
              <div 
                style={{
                  width: `${radius}px`,
                  transformOrigin: '0% 50%',
                  transform: `rotate(${angle + Math.PI}rad)`,
                  left: '50%',
                  top: '50%'
                }}
                className="absolute h-0.5 bg-gradient-to-r from-[#ff2a5f]/40 via-cyan-500/30 to-transparent pointer-events-none -z-10"
              ></div>

              {/* Agent Node Box */}
              <div className="w-40 p-3 rounded-xl glass-panel border border-[#1e2436] group-hover:border-[#ff2a5f] group-hover:scale-110 transition-all shadow-glass bg-[#090a0f]/90 text-left space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#ff2a5f] flex items-center">
                    <Cpu className="w-3 h-3 mr-1" />
                    INTERSECTION AGENT 0{agent.numId}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'
                  }`}></span>
                </div>

                <div className="text-xs font-bold font-outfit text-white truncate">
                  {agent.name.split('&')[0]}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1e2436]">
                  <span>Signal: <strong className="text-emerald-400">{agent.currentSignal}</strong></span>
                  <span>Queue: <strong className="text-amber-400">{agent.queueLength}</strong></span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* 6 Key Decentralized Architectural Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl glass-panel border border-[#1e2436] space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>1. Localized Telemetry</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Intersection camera sensors process vehicle density locally at edge hardware.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#1e2436] space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
            <Share2 className="w-4 h-4" />
            <span>2. Peer Negotiation</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Agents directly request green phase extensions from immediate neighbor nodes.
          </p>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#1e2436] space-y-2">
          <div className="flex items-center space-x-2 text-[#ff2a5f] text-xs font-mono font-bold">
            <Lock className="w-4 h-4" />
            <span>3. Zero Central Failure</span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            If any single agent goes offline, adjacent agents dynamically adapt and reroute traffic.
          </p>
        </div>

      </div>

    </div>
  );
};
