import React from 'react';
import { 
  Siren, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Radio, 
  Play, 
  XSquare,
  Activity,
  Volume2
} from 'lucide-react';
import { EmergencyVehicle, IntersectionAgent } from '../types/traffic';

interface EmergencyVehiclePriorityProps {
  emergencyVehicle: EmergencyVehicle;
  agents: IntersectionAgent[];
  onTriggerEmergency: () => void;
  onClearEmergency: () => void;
}

export const EmergencyVehiclePriority: React.FC<EmergencyVehiclePriorityProps> = ({
  emergencyVehicle,
  agents,
  onTriggerEmergency,
  onClearEmergency
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-outfit text-white">
              Emergency Vehicle Priority Dispatch Console
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Autonomous Green Wave Cascade & Peer Alert Broadcast
            </p>
          </div>
        </div>

        {/* Dispatch Controls */}
        <div className="flex items-center space-x-3">
          {!emergencyVehicle.active ? (
            <button
              onClick={onTriggerEmergency}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-outfit font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Ambulance Priority Dispatch</span>
            </button>
          ) : (
            <button
              onClick={onClearEmergency}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs transition-all flex items-center space-x-2"
            >
              <XSquare className="w-4 h-4 text-red-400" />
              <span>Deactivate Emergency Priority Wave</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Alert & Route Card (Matching user example specs) */}
      {emergencyVehicle.active ? (
        <div className="p-8 rounded-2xl glass-panel-neon space-y-6 relative overflow-hidden">
          
          {/* Top Alert Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#ff2a5f]/40 pb-4">
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-lg bg-[#ff2a5f] text-white animate-bounce">
                <Siren className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono font-bold text-[#ff2a5f] uppercase tracking-widest block">
                  CRITICAL ALERT
                </span>
                <h3 className="text-2xl font-extrabold font-outfit text-white">
                  EMERGENCY VEHICLE DETECTED
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-[#121520] border border-amber-500/40 text-amber-400">
                Type: <strong className="text-white">{emergencyVehicle.type}</strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#121520] border border-emerald-500/40 text-emerald-400 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" /> ETA: <strong className="text-white ml-1">{emergencyVehicle.etaSeconds}s</strong>
              </div>
            </div>
          </div>

          {/* Priority Route Display (Exact spec requirement) */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              PRIORITY ROUTE CASCADE
            </h4>
            
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-[#090a0f]/80 border border-[#1e2436]">
              {emergencyVehicle.priorityRoute.map((nodeId, idx) => {
                const isLast = idx === emergencyVehicle.priorityRoute.length - 1;
                return (
                  <React.Fragment key={nodeId}>
                    <div className="px-4 py-2 rounded-lg bg-[#121520] border border-emerald-500/50 text-emerald-400 font-mono font-bold text-sm shadow-neon-green flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{nodeId}</span>
                    </div>
                    {!isLast && (
                      <ArrowRight className="w-5 h-5 text-[#ff2a5f] animate-pulse" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Action & Signal Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            
            <div className="p-4 rounded-xl bg-[#121520] border border-emerald-500/40 space-y-2">
              <span className="text-slate-400 uppercase tracking-wider block">Signal Action</span>
              <span className="text-2xl font-extrabold font-outfit text-emerald-400 flex items-center">
                <Activity className="w-6 h-6 mr-2 animate-pulse" /> GREEN WAVE LOCKED
              </span>
              <p className="text-[11px] text-slate-300">
                All traffic signals along priority route overridden to uninterrupted GREEN phase.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121520] border border-[#ff2a5f]/40 space-y-2">
              <span className="text-slate-400 uppercase tracking-wider block">Agent Action</span>
              <span className="text-base font-bold text-white font-outfit flex items-center">
                <Radio className="w-5 h-5 mr-2 text-[#ff2a5f]" /> Broadcast Priority Request
              </span>
              <p className="text-[11px] text-slate-300">
                Agents 01, 02, 05 and 08 coordinated emergency priority via P2P mesh network.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-12 rounded-2xl glass-panel border border-[#1e2436] text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold font-outfit text-white">No Active Emergency Priority Wave</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            The city grid is currently operating under standard decentralized optimization mode. Click below to simulate an incoming emergency response vehicle.
          </p>
          <button
            onClick={onTriggerEmergency}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-outfit font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all inline-flex items-center space-x-2"
          >
            <Siren className="w-4 h-4" />
            <span>Trigger Emergency Ambulance Dispatch</span>
          </button>
        </div>
      )}

      {/* Emergency Route Intersection Status Table */}
      <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
        <h3 className="text-lg font-bold font-outfit text-white">Route Node Priority Pre-emption Status</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.slice(0, 4).map((agent) => {
            const isOnRoute = emergencyVehicle.active && emergencyVehicle.priorityRoute.includes(agent.id);
            return (
              <div 
                key={agent.id}
                className={`p-4 rounded-xl border transition-all ${
                  isOnRoute 
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-neon-green' 
                    : 'bg-[#121520] border-[#1e2436]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{agent.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    isOnRoute ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isOnRoute ? 'OVERRIDDEN' : 'NORMAL'}
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono text-slate-300">
                  Signal: <strong className={isOnRoute ? 'text-emerald-400 font-bold' : 'text-slate-200'}>{agent.currentSignal}</strong>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Queue Pre-cleared: {isOnRoute ? 'Yes (0 vq)' : 'Standard'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
