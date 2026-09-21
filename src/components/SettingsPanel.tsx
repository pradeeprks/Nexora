import React from 'react';
import { Settings, Sliders, Moon, Volume2, Radio, Database, ShieldCheck } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#ff2a5f]" />
            <span>NEXORA Network Settings & Preferences</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Agent threshold sensitivity, visual telemetry themes, and API integration options
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Panel 1: Agent Threshold Preferences */}
        <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
          <h3 className="text-base font-bold font-outfit text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#ff2a5f]" />
            <span>AI Agent Optimization Sensitivity</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-300 block">Queue Length Extension Trigger Threshold</label>
              <select className="w-full bg-[#121520] border border-[#1e2436] rounded-lg p-2 text-slate-200 focus:outline-none">
                <option>High Sensitivity (&gt; 10 Vehicles)</option>
                <option>Moderate Sensitivity (&gt; 15 Vehicles)</option>
                <option>Low Sensitivity (&gt; 25 Vehicles)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block">Peer Broadcast Heartbeat Interval</label>
              <select className="w-full bg-[#121520] border border-[#1e2436] rounded-lg p-2 text-slate-200 focus:outline-none">
                <option>100 ms (Ultra Low Latency)</option>
                <option>500 ms (Balanced)</option>
                <option>1000 ms (Bandwidth Saver)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 2: Visual & Sound Settings */}
        <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
          <h3 className="text-base font-bold font-outfit text-white flex items-center space-x-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>Cyber UI & Sound Telemetry</span>
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
              <span>Emergency Siren Audio Chimes</span>
              <input type="checkbox" defaultChecked className="accent-[#ff2a5f] w-4 h-4" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#121520] border border-[#1e2436]">
              <span>Futuristic Neon Outer Glows</span>
              <input type="checkbox" defaultChecked className="accent-[#ff2a5f] w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
