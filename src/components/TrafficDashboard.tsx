import React from 'react';
import { 
  Building2, 
  Cpu, 
  Car, 
  Clock, 
  Activity, 
  Zap, 
  Siren, 
  TrafficCone,
  ArrowUpRight,
  TrendingDown,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { IntersectionAgent, EmergencyVehicle, TrafficMetricPoint, ActiveTab } from '../types/traffic';

interface TrafficDashboardProps {
  agents: IntersectionAgent[];
  emergencyVehicle: EmergencyVehicle;
  history: TrafficMetricPoint[];
  onSelectAgent: (agentId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TrafficDashboard: React.FC<TrafficDashboardProps> = ({
  agents,
  emergencyVehicle,
  history,
  onSelectAgent,
  setActiveTab
}) => {
  // Aggregate Metrics
  const totalIntersections = agents.length;
  const activeAgents = agents.filter(a => a.status === 'ACTIVE').length;
  const totalVehicles = agents.reduce((acc, a) => acc + a.totalVehicles, 0);
  const avgWaitTime = (agents.reduce((acc, a) => acc + a.queueLength * 1.8, 0) / (agents.length || 1)).toFixed(1);
  const avgEfficiency = (agents.reduce((acc, a) => acc + (100 - a.queueLength * 2.2), 0) / (agents.length || 1)).toFixed(1);

  // Density Calculation
  let overallDensity = 'LOW';
  if (totalVehicles > 250) overallDensity = 'SEVERE';
  else if (totalVehicles > 180) overallDensity = 'HIGH';
  else if (totalVehicles > 120) overallDensity = 'MODERATE';

  // Signal breakdown
  const greenSignals = agents.filter(a => a.currentSignal === 'GREEN').length;
  const yellowSignals = agents.filter(a => a.currentSignal === 'YELLOW').length;
  const redSignals = agents.filter(a => a.currentSignal === 'RED').length;

  const signalPieData = [
    { name: 'Green', value: greenSignals, color: '#00e676' },
    { name: 'Yellow', value: yellowSignals, color: '#ffb703' },
    { name: 'Red', value: redSignals, color: '#ff2a5f' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert if Emergency Active */}
      {emergencyVehicle.active && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 flex items-center justify-between shadow-lg shadow-amber-500/10 animate-pulse">
          <div className="flex items-center space-x-3">
            <Siren className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="font-outfit font-bold uppercase tracking-wider text-sm text-white">
                EMERGENCY PRIORITY WAVE ACTIVE ({emergencyVehicle.type})
              </h4>
              <p className="text-xs font-mono text-amber-200">
                Route Locked: {emergencyVehicle.priorityRoute.join(' → ')} | ETA: {emergencyVehicle.etaSeconds}s
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('EMERGENCY')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            View Route
          </button>
        </div>
      )}

      {/* 8 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Intersections */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Intersections</span>
            <div className="w-9 h-9 rounded-lg bg-[#121520] border border-[#1e2436] flex items-center justify-center text-[#ff2a5f]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{totalIntersections}</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Mapped
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">All nodes localized at edge</p>
        </div>

        {/* Card 2: Active Agents */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Agents</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{activeAgents} / {totalIntersections}</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span> Healthy
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Zero central controller required</p>
        </div>

        {/* Card 3: Total Vehicles */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Vehicles</span>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{totalVehicles}</span>
            <span className="text-xs font-mono text-cyan-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.2% / min
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Live camera sensor feed</p>
        </div>

        {/* Card 4: Avg Waiting Time */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Avg Waiting Time</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{avgWaitTime} <span className="text-sm font-normal text-slate-400">sec</span></span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> -18.4% vs central
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Dynamic green phase optimization</p>
        </div>

        {/* Card 5: Traffic Density */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Traffic Density</span>
            <div className="w-9 h-9 rounded-lg bg-[#ff2a5f]/10 border border-[#ff2a5f]/30 flex items-center justify-center text-[#ff2a5f]">
              <TrafficCone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-outfit text-[#ff2a5f]">{overallDensity}</span>
            <span className="text-xs font-mono text-slate-300">Net Index: 48/100</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Grid-wide congestion index</p>
        </div>

        {/* Card 6: Avg Flow Efficiency */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Flow Efficiency</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{avgEfficiency}%</span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-0.5" /> Optimal
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Throughput optimization active</p>
        </div>

        {/* Card 7: Emergency Vehicles */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Emergency Vehicles</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Siren className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-outfit text-white">{emergencyVehicle.active ? 1 : 0}</span>
            <span className={`text-xs font-mono ${emergencyVehicle.active ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'}`}>
              {emergencyVehicle.active ? 'Priority Wave' : 'None Detected'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Auto cascade green routing</p>
        </div>

        {/* Card 8: Signal Status Breakdown */}
        <div className="p-5 rounded-xl glass-panel border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Signal Status</span>
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-3 text-xs font-mono font-bold">
            <span className="text-emerald-400 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1 shadow-neon-green"></span> {greenSignals} Green
            </span>
            <span className="text-amber-400 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1"></span> {yellowSignals} Yel
            </span>
            <span className="text-[#ff2a5f] flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] mr-1 shadow-neon-red"></span> {redSignals} Red
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">Autonomous timing cycle</p>
        </div>

      </div>

      {/* Main Visualizations Row: Charts & Intersections List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Traffic Metrics Chart */}
        <div className="lg:col-span-8 p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-outfit text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[#ff2a5f]" />
                <span>Real-Time Traffic Throughput & Wait Time Trend</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Updating continuously across all 8 decentralized agents
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#ff2a5f]/10 text-[#ff2a5f] text-xs font-mono border border-[#ff2a5f]/30">
              LIVE STREAM
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="waitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff2a5f" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff2a5f" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="efficiencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e676" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121520', borderColor: '#1e2436', borderRadius: '8px' }} 
                  itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                />
                <Area type="monotone" dataKey="avgWaitTimeSec" name="Avg Wait Time (sec)" stroke="#ff2a5f" fillOpacity={1} fill="url(#waitGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="flowEfficiencyPercent" name="Efficiency (%)" stroke="#00e676" fillOpacity={1} fill="url(#efficiencyGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Distribution Pie Chart */}
        <div className="lg:col-span-4 p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-outfit text-white">Signal State Distribution</h3>
            <p className="text-xs text-slate-400 font-mono">Live ratio of current intersection signals</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={signalPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {signalPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121520', borderColor: '#1e2436', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <div className="font-bold text-base">{greenSignals}</div>
              <div className="text-[10px]">GREEN</div>
            </div>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <div className="font-bold text-base">{yellowSignals}</div>
              <div className="text-[10px]">YELLOW</div>
            </div>
            <div className="p-2 rounded bg-[#ff2a5f]/10 border border-[#ff2a5f]/20 text-[#ff2a5f]">
              <div className="font-bold text-base">{redSignals}</div>
              <div className="text-[10px]">RED</div>
            </div>
          </div>
        </div>

      </div>

      {/* Intersection Agents Quick Overview Table */}
      <div className="p-6 rounded-xl glass-panel border border-[#1e2436] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-outfit text-white">Autonomous Intersection Agents</h3>
            <p className="text-xs text-slate-400 font-mono">Click any agent to launch full detail telemetry</p>
          </div>
          <button
            onClick={() => setActiveTab('AGENTS')}
            className="text-xs font-mono text-[#ff2a5f] hover:underline flex items-center"
          >
            View All Agents →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1e2436] text-slate-400">
                <th className="py-3 px-3">AGENT ID</th>
                <th className="py-3 px-3">LOCATION</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">SIGNAL</th>
                <th className="py-3 px-3">TIMER</th>
                <th className="py-3 px-3">VEHICLES</th>
                <th className="py-3 px-3">QUEUE</th>
                <th className="py-3 px-3">LAST AI ACTION</th>
                <th className="py-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2436]/60">
              {agents.map((agent) => {
                const signalColorClass = 
                  agent.currentSignal === 'GREEN' ? 'bg-emerald-500 text-slate-950 font-bold' :
                  agent.currentSignal === 'YELLOW' ? 'bg-amber-400 text-slate-950 font-bold' :
                  'bg-[#ff2a5f] text-white font-bold';

                const densityColor = 
                  agent.trafficDensity === 'LOW' ? 'text-emerald-400' :
                  agent.trafficDensity === 'MODERATE' ? 'text-cyan-400' :
                  agent.trafficDensity === 'HIGH' ? 'text-amber-400' :
                  'text-[#ff2a5f] font-bold';

                return (
                  <tr 
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    className="hover:bg-[#121520]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-bold text-white group-hover:text-[#ff2a5f] flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-[#ff2a5f]" />
                      <span>{agent.id}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{agent.name}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        agent.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        agent.status === 'EMERGENCY' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${signalColorClass}`}>
                        {agent.currentSignal}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-bold">{agent.signalTimer}s</td>
                    <td className="py-3 px-3 text-slate-200">{agent.totalVehicles}</td>
                    <td className="py-3 px-3">
                      <span className={densityColor}>{agent.queueLength} ({agent.trafficDensity})</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 truncate max-w-[200px]">
                      {agent.lastDecision.action}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-[11px] text-[#ff2a5f] hover:text-white underline">
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
