import React from 'react';
import { 
  Cpu, 
  Car, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Zap, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { IntersectionAgent } from '../types/traffic';

interface IntersectionAgentDetailProps {
  agents: IntersectionAgent[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
}

export const IntersectionAgentDetail: React.FC<IntersectionAgentDetailProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent
}) => {
  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  return (
    <div className="space-y-6">
      
      {/* Agent Selection Header Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#ff2a5f]/15 border border-[#ff2a5f]/40 flex items-center justify-center text-[#ff2a5f]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-outfit text-white">
              {currentAgent.id} - Autonomous Telemetry
            </h2>
            <p className="text-xs text-slate-400 font-mono">{currentAgent.name}</p>
          </div>
        </div>

        {/* Selector Dropdown / Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto py-1">
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => onSelectAgent(a.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                a.id === currentAgent.id
                  ? 'bg-[#ff2a5f] text-white font-bold shadow-neon-red'
                  : 'bg-[#121520] text-slate-400 hover:text-white border border-[#1e2436]'
              }`}
            >
              {a.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Agent Details Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Specified Metrics Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Exact Specs Block matching prompt */}
          <div className="p-6 rounded-xl glass-panel border border-[#ff2a5f]/30 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-[#ff2a5f]/20 border-b border-l border-[#ff2a5f]/40 text-[#ff2a5f] text-xs font-mono font-bold">
              EDGE NODE TELEMETRY
            </div>

            <div>
              <h3 className="text-2xl font-extrabold font-outfit text-white">
                Intersection Agent – {currentAgent.numId < 10 ? `0${currentAgent.numId}` : currentAgent.numId}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                San Francisco Smart Corridor • Mesh Node ID: {currentAgent.id}
              </p>
            </div>

            {/* Metrics List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
              
              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Status</span>
                <span className="text-emerald-400 font-extrabold text-lg flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2" /> {currentAgent.status}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Vehicles Detected</span>
                <span className="text-white font-extrabold text-lg flex items-center">
                  <Car className="w-5 h-5 mr-2 text-cyan-400" /> {currentAgent.totalVehicles} vehicles
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Traffic Density</span>
                <span className={`font-extrabold text-lg flex items-center ${
                  currentAgent.trafficDensity === 'LOW' ? 'text-emerald-400' :
                  currentAgent.trafficDensity === 'MODERATE' ? 'text-cyan-400' :
                  currentAgent.trafficDensity === 'HIGH' ? 'text-amber-400' :
                  'text-[#ff2a5f]'
                }`}>
                  <Activity className="w-5 h-5 mr-2" /> {currentAgent.trafficDensity}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Current Signal</span>
                <span className={`font-extrabold text-lg flex items-center ${
                  currentAgent.currentSignal === 'GREEN' ? 'text-emerald-400' :
                  currentAgent.currentSignal === 'YELLOW' ? 'text-amber-400' :
                  'text-[#ff2a5f]'
                }`}>
                  <Zap className="w-5 h-5 mr-2" /> {currentAgent.currentSignal}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Time Remaining</span>
                <span className="text-amber-400 font-extrabold text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> {currentAgent.signalTimer} sec
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Queue Length</span>
                <span className="text-white font-extrabold text-lg flex items-center">
                  <Sliders className="w-5 h-5 mr-2 text-amber-400" /> {currentAgent.queueLength} vehicles
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-1 sm:col-span-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider block">Average Speed</span>
                <span className="text-emerald-400 font-extrabold text-lg flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-emerald-400" /> {currentAgent.avgSpeedKmH} km/h
                </span>
              </div>

            </div>

            {/* Agent Autonomous Decision Box */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-[#121520] via-[#1a1f30] to-[#121520] border border-[#ff2a5f]/40 shadow-neon-red space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#ff2a5f] font-bold uppercase tracking-wider flex items-center">
                  <Cpu className="w-4 h-4 mr-2 animate-pulse" /> Autonomous Local Agent Decision
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentAgent.lastDecision.timestamp}
                </span>
              </div>

              <div className="text-xl font-bold font-outfit text-white italic border-l-4 border-[#ff2a5f] pl-3 py-1">
                "{currentAgent.lastDecision.action}"
              </div>

              <p className="text-xs text-slate-300 font-mono">
                Reasoning: {currentAgent.lastDecision.reason}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Directional Flow & Peer Communications */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Directional Flow Breakdown */}
          <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
            <h3 className="text-lg font-bold font-outfit text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>4-Way Approach Vehicle Counts</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436] text-center">
                <span className="text-slate-400 text-[10px] block">NORTHBOUND</span>
                <span className="text-cyan-400 text-xl font-extrabold">{currentAgent.directionalFlow.north} v/m</span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436] text-center">
                <span className="text-slate-400 text-[10px] block">SOUTHBOUND</span>
                <span className="text-cyan-400 text-xl font-extrabold">{currentAgent.directionalFlow.south} v/m</span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436] text-center">
                <span className="text-slate-400 text-[10px] block">EASTBOUND</span>
                <span className="text-cyan-400 text-xl font-extrabold">{currentAgent.directionalFlow.east} v/m</span>
              </div>

              <div className="p-3 rounded-lg bg-[#121520] border border-[#1e2436] text-center">
                <span className="text-slate-400 text-[10px] block">WESTBOUND</span>
                <span className="text-cyan-400 text-xl font-extrabold">{currentAgent.directionalFlow.west} v/m</span>
              </div>
            </div>
          </div>

          {/* Autonomous Consensus Protocol Checklist */}
          <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
            <h3 className="text-lg font-bold font-outfit text-white flex items-center space-x-2">
              <Radio className="w-5 h-5 text-[#ff2a5f]" />
              <span>Edge AI Decision Verification</span>
            </h3>

            <ul className="space-y-3 text-xs font-mono text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Local computer vision camera feeds processed at 60 FPS.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>State shared with peer neighbors ({currentAgent.neighbors.join(', ')}).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Green light extension calculated autonomously via Q-learning model.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Zero centralized server dependence; operates offline if network partitions.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
