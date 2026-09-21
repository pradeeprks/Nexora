import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Pause, 
  Play, 
  Radio, 
  Cpu, 
  Siren,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AIDecisionLog as LogItem } from '../types/traffic';

interface AIDecisionLogProps {
  logs: LogItem[];
  onClearLogs: () => void;
}

export const AIDecisionLog: React.FC<AIDecisionLogProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isStreaming, setIsStreaming] = useState(true);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.timestamp.includes(searchTerm);

    const matchesFilter = filterType === 'ALL' || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#ff2a5f]" />
            <span>AI Decision Audit & Activity Stream</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Real-time decentralized agent event logs and P2P negotiation records
          </p>
        </div>

        {/* Streaming Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center space-x-1.5 ${
              isStreaming 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Log Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={onClearLogs}
            className="p-2 rounded-lg bg-[#121520] hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-[#1e2436] transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436] text-xs font-mono">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search logs by keyword or Agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121520] border border-[#1e2436] rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-[#ff2a5f]"
          />
        </div>

        {/* Log Type Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-semibold flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter:
          </span>
          {['ALL', 'STATE_SHARE', 'TIMING_ADJUST', 'EMERGENCY_PRIORITY', 'CONGESTION_ALERT', 'FAILOVER_RECOVERY'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${
                filterType === t 
                  ? 'bg-[#ff2a5f] text-white font-bold' 
                  : 'bg-[#121520] text-slate-400 hover:text-white border border-[#1e2436]'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Log Feed Terminal View */}
      <div className="p-6 rounded-2xl glass-panel border border-[#1e2436] bg-[#090a0f]/90 space-y-3 font-mono max-h-[550px] overflow-y-auto">
        
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No decision logs match current filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let severityIcon = <Info className="w-4 h-4 text-cyan-400" />;
            let badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';

            if (log.severity === 'warning') {
              severityIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
              badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            } else if (log.severity === 'critical') {
              severityIcon = <Siren className="w-4 h-4 text-[#ff2a5f] animate-pulse" />;
              badgeBg = 'bg-[#ff2a5f]/20 text-[#ff2a5f] border-[#ff2a5f]/40 font-bold';
            } else if (log.severity === 'success') {
              severityIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
              badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            }

            return (
              <div 
                key={log.id}
                className="p-3.5 rounded-xl bg-[#121520]/80 border border-[#1e2436] hover:border-[#ff2a5f]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-[#ff2a5f] font-bold text-sm min-w-[70px]">
                    {log.timestamp}
                  </span>
                  <div className="mt-0.5">{severityIcon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white font-outfit">{log.agentId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${badgeBg}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-slate-200 mt-1 leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 whitespace-nowrap self-end sm:self-center">
                  Verified Edge Consensus
                </div>
              </div>
            );
          })
        )}

      </div>

    </div>
  );
};
