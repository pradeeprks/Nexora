import React from 'react';
import { 
  Activity, 
  Cpu, 
  MapPin, 
  Radio, 
  AlertTriangle, 
  Sliders, 
  BarChart3, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Settings, 
  Play, 
  Siren,
  LayoutDashboard,
  Home
} from 'lucide-react';
import { ActiveTab } from '../types/traffic';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isRunning: boolean;
  onToggleSim: () => void;
  onRunDemo: () => void;
  onTriggerEmergency: () => void;
  activeEmergency: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isRunning,
  onToggleSim,
  onRunDemo,
  onTriggerEmergency,
  activeEmergency
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'LANDING', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'LIVE_MAP', label: 'Live Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'AGENTS', label: 'Agents', icon: <Cpu className="w-4 h-4" /> },
    { id: 'CITY_MESH', label: 'City Mesh', icon: <Radio className="w-4 h-4" /> },
    { id: 'EMERGENCY', label: 'Emergency Mode', icon: <Siren className="w-4 h-4" /> },
    { id: 'SIGNAL_CONTROL', label: 'Signals', icon: <Activity className="w-4 h-4" /> },
    { id: 'SIMULATION', label: 'Simulation', icon: <Sliders className="w-4 h-4" /> },
    { id: 'ANALYTICS', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'DECISION_LOGS', label: 'Decision Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'ARCHITECTURE', label: 'Architecture', icon: <Layers className="w-4 h-4" /> },
    { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090a0f]/90 backdrop-blur-xl border-b border-[#1e2436]">
      {/* Top Banner / Differentiator */}
      <div className="bg-[#121520]/80 border-b border-[#1e2436] px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/30 animate-pulse">
            DECENTRALIZED • AUTONOMOUS • REAL-TIME
          </span>
          <span className="hidden sm:inline text-slate-400 font-mono">
            P2P Consensus Active • <strong className="text-white">NO SINGLE CENTRAL CONTROLLER</strong>
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-400">8/8 Nodes Online</span>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">Latency: 4ms</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('LANDING')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2a5f] to-[#b3003b] p-0.5 shadow-neon-red group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#ff2a5f] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-wider font-outfit text-white group-hover:text-[#ff2a5f] transition-colors">
                  NEXORA
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  v2.4 AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
                Multi-Agent Urban Traffic Orchestration
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onRunDemo}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#ff2a5f] to-[#ff003c] text-white shadow-neon-red hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="font-outfit uppercase tracking-wider">Run Live Demo</span>
            </button>

            <button
              onClick={onTriggerEmergency}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                activeEmergency 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse shadow-lg shadow-amber-500/20'
                  : 'bg-[#121520] text-slate-200 border-[#1e2436] hover:border-amber-500/40 hover:text-amber-400'
              }`}
            >
              <Siren className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Emergency Mode</span>
            </button>

            <button
              onClick={onToggleSim}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isRunning 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isRunning ? "Simulation Running (Click to Pause)" : "Simulation Paused (Click to Resume)"}
            >
              <Activity className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Responsive Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-[#1e2436]/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#ff2a5f]/15 text-[#ff2a5f] border border-[#ff2a5f]/40 shadow-neon-red text-shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#121520]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
