import React from 'react';
import { 
  Sliders, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Cpu, 
  Siren, 
  Activity,
  Gauge
} from 'lucide-react';
import { SimulationConfig } from '../types/traffic';

interface SimulationModeProps {
  config: SimulationConfig;
  onUpdateConfig: (newConfig: Partial<SimulationConfig>) => void;
  onStartSim: () => void;
  onPauseSim: () => void;
  onResetSim: () => void;
  onRunDemo: () => void;
}

export const SimulationMode: React.FC<SimulationModeProps> = ({
  config,
  onUpdateConfig,
  onStartSim,
  onPauseSim,
  onResetSim,
  onRunDemo
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-[#1e2436]">
        <div>
          <h2 className="text-xl font-extrabold font-outfit text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#ff2a5f]" />
            <span>Interactive Traffic Network Simulation Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Adjust network parameters and observe autonomous multi-agent adaptation in real time
          </p>
        </div>

        <button
          onClick={onRunDemo}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-outfit font-extrabold text-xs uppercase tracking-wider shadow-neon-cyan hover:brightness-110 transition-all flex items-center space-x-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run Live Demo Scenario</span>
        </button>
      </div>

      {/* Main Control Panel & Visual Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Parameter Sliders */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-[#1e2436] space-y-6">
          
          <h3 className="text-lg font-bold font-outfit text-white">
            Simulation Parameter Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slider 1: Vehicle Density */}
            <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Vehicle Density</span>
                <span className="text-[#ff2a5f] font-bold">{config.vehicleDensity}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={config.vehicleDensity} 
                onChange={(e) => onUpdateConfig({ vehicleDensity: Number(e.target.value) })}
                className="w-full accent-[#ff2a5f] cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-mono">Simulates low to severe vehicle influx rates</p>
            </div>

            {/* Slider 2: Number of Intersections */}
            <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Active Intersections</span>
                <span className="text-cyan-400 font-bold">{config.activeIntersections} Agents</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="8" 
                value={config.activeIntersections} 
                onChange={(e) => onUpdateConfig({ activeIntersections: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-mono">Configures active mesh nodes (4 to 8 agents)</p>
            </div>

            {/* Slider 3: Traffic Flow Speed */}
            <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Traffic Flow Rate</span>
                <span className="text-emerald-400 font-bold">{config.trafficFlowSpeed} km/h</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="80" 
                value={config.trafficFlowSpeed} 
                onChange={(e) => onUpdateConfig({ trafficFlowSpeed: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-mono">Base vehicle movement velocity</p>
            </div>

            {/* Slider 4: Emergency Vehicles Frequency */}
            <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Emergency Priority Wave Frequency</span>
                <span className="text-amber-400 font-bold">Level {config.emergencyFrequency}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={config.emergencyFrequency} 
                onChange={(e) => onUpdateConfig({ emergencyFrequency: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-mono">Probability of emergency dispatch triggers</p>
            </div>

          </div>

          {/* Simulation Speed Buttons (1x, 2x, 5x) */}
          <div className="p-4 rounded-xl bg-[#121520] border border-[#1e2436] space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Simulation Time Multiplier
            </span>
            <div className="flex space-x-3 text-xs font-mono">
              {[1, 2, 5].map(multiplier => (
                <button
                  key={multiplier}
                  onClick={() => onUpdateConfig({ simulationSpeed: multiplier })}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    config.simulationSpeed === multiplier 
                      ? 'bg-[#ff2a5f] text-white shadow-neon-red' 
                      : 'bg-[#090a0f] text-slate-400 hover:text-white border border-[#1e2436]'
                  }`}
                >
                  {multiplier}x Speed
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Execution Action Buttons & Status */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-[#1e2436] flex flex-col justify-between space-y-6">
          
          <div>
            <h3 className="text-lg font-bold font-outfit text-white">Engine Execution Status</h3>
            <p className="text-xs text-slate-400 font-mono">Control live state updates across canvas</p>
          </div>

          {/* Status Display Card */}
          <div className="p-5 rounded-xl bg-[#090a0f] border border-[#1e2436] text-center space-y-2">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
              config.isRunning ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-lg font-extrabold font-outfit text-white">
              {config.isRunning ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}
            </div>
            <p className="text-xs font-mono text-slate-400">
              {config.isRunning ? 'Autonomous agents ticking at 60 FPS' : 'State frozen for inspection'}
            </p>
          </div>

          {/* Exact Required Action Buttons: START SIMULATION, PAUSE, RESET */}
          <div className="space-y-3">
            {!config.isRunning ? (
              <button
                onClick={onStartSim}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-outfit font-extrabold text-xs uppercase tracking-wider shadow-neon-green hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START SIMULATION</span>
              </button>
            ) : (
              <button
                onClick={onPauseSim}
                className="w-full py-3.5 rounded-xl bg-amber-500 text-slate-950 font-outfit font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </button>
            )}

            <button
              onClick={onResetSim}
              className="w-full py-3 rounded-xl bg-[#121520] hover:bg-[#1a2030] text-slate-300 border border-[#1e2436] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
