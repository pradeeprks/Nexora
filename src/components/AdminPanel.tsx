import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Radio, 
  AlertTriangle, 
  Activity, 
  Wifi, 
  WifiOff, 
  Server,
  RefreshCw
} from 'lucide-react';
import { IntersectionAgent } from '../types/traffic';

interface AdminPanelProps {
  agents: IntersectionAgent[];
  onToggleAgentFailover: (agentId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  agents,
  onToggleAgentFailover
}) => {
  const activeCount = agents.filter(a => a.status === 'ACTIVE').length;
  const offlineCount = agents.filter(a => a.status === 'OFFLINE').length;
  const avgLatency = (agents.reduce((acc, a) => acc + a.latencyMs, 0) / (agents.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#ff2a5f]" />
            <span>Admin & Network Monitoring Panel</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Hardware health diagnostics, peer socket latency, and decentralized fault tolerance testing
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Health: 99.4%
          </span>
          <span className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Avg Latency: {avgLatency}ms
          </span>
        </div>
      </div>

      {/* 4 Admin Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl glass-panel border border-[#1e2436]">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Intersections</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{activeCount} / {agents.length}</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">OPERATIONAL</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#1e2436]">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Failed / Offline Agents</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold font-outfit ${offlineCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {offlineCount}
            </span>
            <span className={`text-xs font-mono ${offlineCount > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
              {offlineCount > 0 ? 'Failover Rerouted' : 'Zero Failures'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#1e2436]">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Communication Status</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-cyan-400">P2P Mesh</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">SUB-5MS</span>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-[#1e2436]">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Alerts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-emerald-400">0 Critical</span>
            <span className="text-xs font-mono text-slate-400">Nominal</span>
          </div>
        </div>

      </div>

      {/* Simulated Failover Action Banner */}
      <div className="p-6 rounded-xl glass-panel border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Decentralized Mesh Resiliency Test</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Self-Healing Peer Protocol
          </span>
        </div>

        <p className="text-xs text-slate-300 font-mono">
          Simulate an agent failure to test how adjacent intersection agents detect peer timeout, re-route arterial traffic, and maintain smooth flow without relying on any central server.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => onToggleAgentFailover(a.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                a.status === 'OFFLINE'
                  ? 'bg-red-500 text-white font-bold shadow-lg animate-pulse'
                  : 'bg-[#121520] text-slate-300 hover:border-[#ff2a5f] border border-[#1e2436]'
              }`}
            >
              {a.status === 'OFFLINE' ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{a.status === 'OFFLINE' ? `Restore ${a.id}` : `Simulate ${a.id} Offline`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Health Matrix Table */}
      <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
        <h3 className="text-lg font-bold font-outfit text-white">Agent Hardware & Latency Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e2436] text-slate-400">
                <th className="py-3 px-3">AGENT ID</th>
                <th className="py-3 px-3">HARDWARE HEALTH</th>
                <th className="py-3 px-3">LATENCY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2436]">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-[#121520]">
                  <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-[#ff2a5f]" />
                    <span>{agent.id}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${agent.healthPercent}%` }} 
                          className={`h-full ${agent.status === 'OFFLINE' ? 'bg-red-500' : 'bg-emerald-400'}`}
                        ></div>
                      </div>
                      <span className="text-slate-300">{agent.healthPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-cyan-400">{agent.latencyMs} ms</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      agent.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={() => onToggleAgentFailover(agent.id)}
                      className="text-xs text-[#ff2a5f] hover:underline"
                    >
                      {agent.status === 'OFFLINE' ? 'Bring Online' : 'Kill Agent'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
