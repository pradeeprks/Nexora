import React from 'react';
import { 
  Layers, 
  Camera, 
  Cpu, 
  Brain, 
  Radio, 
  Sliders, 
  Siren, 
  Share2, 
  Zap, 
  ArrowDown, 
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#ff2a5f]" />
            <span>NEXORA Decentralized System Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Edge Perception • Localized AI Decision Engine • Peer-to-Peer Consensus
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
          Zero Central Bottlenecks
        </span>
      </div>

      {/* Main Flowchart 1: Standard Edge Processing Pipeline (Specified in Prompt) */}
      <div className="p-8 rounded-2xl glass-panel border border-[#1e2436] space-y-6">
        <h3 className="text-lg font-bold font-outfit text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Core Edge-AI Traffic Pipeline</span>
        </h3>

        <div className="flex flex-col items-center space-y-4 font-mono text-xs relative">
          
          {/* Box 1: Traffic Sensors / Cameras */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-cyan-500/40 text-center space-y-1 shadow-neon-cyan">
            <Camera className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-extrabold text-sm text-white font-outfit">Traffic Sensors / Cameras</div>
            <p className="text-[11px] text-slate-400">High-resolution optical & LiDAR vision feeds at 60 FPS</p>
          </div>

          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />

          {/* Box 2: Intersection Agent */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-[#ff2a5f]/40 text-center space-y-1 shadow-neon-red">
            <Cpu className="w-6 h-6 text-[#ff2a5f] mx-auto animate-pulse" />
            <div className="font-extrabold text-sm text-white font-outfit">Intersection Agent</div>
            <p className="text-[11px] text-slate-400">Localized edge node computing hardware</p>
          </div>

          <ArrowDown className="w-6 h-6 text-[#ff2a5f] animate-bounce" />

          {/* Box 3: Local AI Decision Engine ↔ Neighboring Agents */}
          <div className="w-full max-w-lg p-5 rounded-xl bg-[#121520] border-2 border-emerald-500/50 text-center space-y-3 shadow-neon-green">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-6 h-6 text-emerald-400" />
              <ArrowLeftRight className="w-6 h-6 text-emerald-400 animate-pulse" />
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div>
              <div className="font-extrabold text-base text-white font-outfit">
                Local AI Decision Engine ↔ Neighboring Agents
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Reinforcement Learning model computes green extensions & exchanges peer state
              </p>
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-emerald-400 animate-bounce" />

          {/* Box 4: Traffic Signal Controller */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-amber-500/40 text-center space-y-1 shadow-lg">
            <Zap className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="font-extrabold text-sm text-white font-outfit">Traffic Signal Controller</div>
            <p className="text-[11px] text-slate-400">Physical relay light phase actuation</p>
          </div>

        </div>
      </div>

      {/* Main Flowchart 2: Emergency Vehicle Detection Pipeline (Specified in Prompt) */}
      <div className="p-8 rounded-2xl glass-panel border border-[#1e2436] space-y-6">
        <h3 className="text-lg font-bold font-outfit text-white flex items-center space-x-2">
          <Siren className="w-5 h-5 text-amber-400" />
          <span>Emergency Vehicle Priority Pipeline</span>
        </h3>

        <div className="flex flex-col items-center space-y-4 font-mono text-xs">
          
          {/* Step 1: Emergency Vehicle Detection */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-amber-500/40 text-center space-y-1">
            <Siren className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
            <div className="font-extrabold text-sm text-white font-outfit">Emergency Vehicle Detection</div>
            <p className="text-[11px] text-slate-400">Acoustic siren sensing & GPS beacon telemetry</p>
          </div>

          <ArrowDown className="w-6 h-6 text-amber-400 animate-bounce" />

          {/* Step 2: Priority Negotiation */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-cyan-500/40 text-center space-y-1">
            <Share2 className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-extrabold text-sm text-white font-outfit">Priority Negotiation</div>
            <p className="text-[11px] text-slate-400">Peer-to-peer route handshake across corridor nodes</p>
          </div>

          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />

          {/* Step 3: Coordinated Signal Control */}
          <div className="w-full max-w-md p-4 rounded-xl bg-[#121520] border border-emerald-500/40 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="font-extrabold text-sm text-white font-outfit">Coordinated Signal Control</div>
            <p className="text-[11px] text-slate-400">Instantaneous Green Wave corridor creation</p>
          </div>

        </div>
      </div>

    </div>
  );
};
