import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  Clock, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { IntersectionAgent, SignalColor } from '../types/traffic';

interface DynamicSignalControlProps {
  agents: IntersectionAgent[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  onUpdateDurations: (agentId: string, green: number, yellow: number, red: number) => void;
}

export const DynamicSignalControl: React.FC<DynamicSignalControlProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onUpdateDurations
}) => {
  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const [greenVal, setGreenVal] = useState(currentAgent.signalDurations.green);
  const [yellowVal, setYellowVal] = useState(currentAgent.signalDurations.yellow);
  const [redVal, setRedVal] = useState(currentAgent.signalDurations.red);

  const handleApply = () => {
    onUpdateDurations(currentAgent.id, greenVal, yellowVal, redVal);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#ff2a5f]" />
            <span>Dynamic AI Signal Phase Controller</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Autonomous density-based green light timing optimization
          </p>
        </div>

        {/* Agent Switcher */}
        <div className="flex items-center space-x-2">
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => {
                onSelectAgent(a.id);
                setGreenVal(a.signalDurations.green);
                setYellowVal(a.signalDurations.yellow);
                setRedVal(a.signalDurations.red);
              }}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                a.id === currentAgent.id
                  ? 'bg-[#ff2a5f] text-white font-bold'
                  : 'bg-[#121520] text-slate-400 hover:text-white border border-[#1e2436]'
              }`}
            >
              {a.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Signal Display & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Specified 3 Traffic Signal Bulbs (RED, YELLOW, GREEN) with Countdown */}
        <div className="lg:col-span-5 p-8 rounded-2xl glass-panel border border-[#1e2436] flex flex-col items-center justify-center space-y-6">
          
          <div className="text-center">
            <h3 className="text-lg font-bold font-outfit text-white">{currentAgent.id} Traffic Light</h3>
            <p className="text-xs text-slate-400 font-mono">{currentAgent.name}</p>
          </div>

          {/* Traffic Signal Light Housing */}
          <div className="w-36 p-5 rounded-3xl bg-[#0e111a] border-2 border-[#1e2436] shadow-2xl flex flex-col items-center space-y-5">
            
            {/* RED BULB */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              currentAgent.currentSignal === 'RED'
                ? 'bg-[#ff2a5f] shadow-neon-red scale-105 border-2 border-white'
                : 'bg-[#260e18] opacity-30 border border-red-900'
            }`}>
              <span className={`text-xl font-mono font-extrabold ${
                currentAgent.currentSignal === 'RED' ? 'text-white' : 'text-slate-600'
              }`}>
                {currentAgent.currentSignal === 'RED' ? `${currentAgent.signalTimer}s` : 'RED'}
              </span>
            </div>

            {/* YELLOW BULB */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              currentAgent.currentSignal === 'YELLOW'
                ? 'bg-[#ffb703] shadow-lg shadow-amber-500/50 scale-105 border-2 border-white'
                : 'bg-[#261f0e] opacity-30 border border-amber-900'
            }`}>
              <span className={`text-xl font-mono font-extrabold ${
                currentAgent.currentSignal === 'YELLOW' ? 'text-slate-950' : 'text-slate-600'
              }`}>
                {currentAgent.currentSignal === 'YELLOW' ? `${currentAgent.signalTimer}s` : 'YEL'}
              </span>
            </div>

            {/* GREEN BULB */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              currentAgent.currentSignal === 'GREEN'
                ? 'bg-[#00e676] shadow-neon-green scale-105 border-2 border-white'
                : 'bg-[#0e2618] opacity-30 border border-emerald-900'
            }`}>
              <span className={`text-xl font-mono font-extrabold ${
                currentAgent.currentSignal === 'GREEN' ? 'text-slate-950' : 'text-slate-600'
              }`}>
                {currentAgent.currentSignal === 'GREEN' ? `${currentAgent.signalTimer}s` : 'GRN'}
              </span>
            </div>

          </div>

          <div className="text-center font-mono text-xs text-slate-400">
            Active Phase Countdown: <strong className="text-white text-base ml-1">{currentAgent.signalTimer} seconds</strong>
          </div>

        </div>

        {/* Right Column: AI Dynamic Adjustment Parameters */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-[#1e2436] space-y-6">
          
          <div>
            <h3 className="text-lg font-bold font-outfit text-white">
              Phase Timing Control & AI Adaptation
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Adjust minimum/maximum phase durations or let AI dynamically recalculate based on density.
            </p>
          </div>

          {/* Phase Sliders */}
          <div className="space-y-4">
            
            {/* Green Duration */}
            <div className="space-y-2 p-4 rounded-xl bg-[#121520] border border-[#1e2436]">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2"></span> GREEN PHASE DURATION
                </span>
                <span className="text-white font-bold">{greenVal} seconds</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="60" 
                value={greenVal} 
                onChange={(e) => setGreenVal(Number(e.target.value))}
                className="w-full accent-[#00e676] cursor-pointer"
              />
            </div>

            {/* Yellow Duration */}
            <div className="space-y-2 p-4 rounded-xl bg-[#121520] border border-[#1e2436]">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2"></span> YELLOW PHASE DURATION
                </span>
                <span className="text-white font-bold">{yellowVal} seconds</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="10" 
                value={yellowVal} 
                onChange={(e) => setYellowVal(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Red Duration */}
            <div className="space-y-2 p-4 rounded-xl bg-[#121520] border border-[#1e2436]">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#ff2a5f] font-bold flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] mr-2"></span> RED PHASE DURATION
                </span>
                <span className="text-white font-bold">{redVal} seconds</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="60" 
                value={redVal} 
                onChange={(e) => setRedVal(Number(e.target.value))}
                className="w-full accent-[#ff2a5f] cursor-pointer"
              />
            </div>

          </div>

          {/* AI Decision Influence Factors (Exact specs: density, queue, emergency, neighbors) */}
          <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2436] space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              AI ADAPTATION INPUT PARAMETERS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <div>• Vehicle Density: <strong className="text-white">{currentAgent.trafficDensity}</strong></div>
              <div>• Queue Length: <strong className="text-amber-400">{currentAgent.queueLength} vehicles</strong></div>
              <div>• Emergency Priority: <strong className="text-emerald-400">Normal</strong></div>
              <div>• Neighbor State: <strong className="text-cyan-400">In-sync</strong></div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-[#ff003c] text-white font-outfit font-bold text-xs uppercase tracking-wider shadow-neon-red hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Apply Dynamic Signal Configuration</span>
          </button>

        </div>

      </div>

    </div>
  );
};
