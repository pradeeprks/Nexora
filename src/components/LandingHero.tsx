import React, { useEffect, useRef } from 'react';
import { Cpu, ArrowRight, ShieldAlert, Radio, Activity, Zap, Play, CheckCircle2 } from 'lucide-react';
import { ActiveTab, IntersectionAgent } from '../types/traffic';

interface LandingHeroProps {
  onLaunchDashboard: () => void;
  onRunSimulation: () => void;
  onRunDemo: () => void;
  agents: IntersectionAgent[];
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchDashboard,
  onRunSimulation,
  onRunDemo,
  agents
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for city network
    const nodes = agents.map((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.32;
      const centerX = width / 2;
      const centerY = height / 2;
      return {
        id: agent.id,
        name: agent.name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        status: agent.status,
        density: agent.trafficDensity
      };
    });

    // Communication packets traveling between connected nodes
    const packets: { fromIndex: number; toIndex: number; progress: number; speed: number; color: string }[] = [];
    
    // Create connection pairs
    const connections: [number, number][] = [
      [0, 1], [1, 2], [2, 5], [5, 4], [4, 7], [7, 6], [6, 0], [0, 3], [3, 4], [1, 4]
    ];

    for (let i = 0; i < 8; i++) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      packets.push({
        fromIndex: conn[0],
        toIndex: conn[1],
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        color: Math.random() > 0.3 ? '#ff2a5f' : '#00f0ff'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(30, 36, 54, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw peer-to-peer connection links between intersection agents
      connections.forEach(([i1, i2]) => {
        const n1 = nodes[i1];
        const n2 = nodes[i2];
        if (!n1 || !n2) return;

        const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        grad.addColorStop(0, 'rgba(255, 42, 95, 0.35)');
        grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.25)');
        grad.addColorStop(1, 'rgba(255, 42, 95, 0.35)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update & render moving data packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          const conn = connections[Math.floor(Math.random() * connections.length)];
          p.fromIndex = conn[0];
          p.toIndex = conn[1];
        }
        const n1 = nodes[p.fromIndex];
        const n2 = nodes[p.toIndex];
        if (n1 && n2) {
          const px = n1.x + (n2.x - n1.x) * p.progress;
          const py = n1.y + (n2.y - n1.y) * p.progress;

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Render Nodes (Intersection Agents)
      nodes.forEach((node, idx) => {
        // Node outer glowing ring
        ctx.strokeStyle = 'rgba(255, 42, 95, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Node fill
        ctx.fillStyle = '#121520';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Node center core pulse
        ctx.fillStyle = idx % 2 === 0 ? '#ff2a5f' : '#00e676';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y + 30);
      });

      // Draw Center Hub (Decentralized Mesh Focus - NOT A CONTROLLER)
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(18, 21, 32, 0.9)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText('DECENTRALIZED', centerX, centerY - 6);
      ctx.fillStyle = '#ff2a5f';
      ctx.fillText('CITY MESH', centerX, centerY + 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [agents]);

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center cyber-grid-bg py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Neon Accent Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff2a5f]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Text Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#121520] border border-[#ff2a5f]/40 text-[#ff2a5f] text-xs font-mono tracking-widest shadow-neon-red">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>DECENTRALIZED • AUTONOMOUS • REAL-TIME</span>
          </div>

          {/* Hero Main Titles */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-outfit text-white leading-none">
              NEXORA
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-white via-slate-200 to-[#ff2a5f] bg-clip-text text-transparent font-outfit">
              Decentralized AI for Smarter Urban Traffic
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Autonomous intersection agents that communicate, coordinate, and dynamically optimize traffic flow in real time without relying on a single central controller.
          </p>

          {/* Key Differentiator Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#121520] to-[#1a1f2e] border border-[#ff2a5f]/30 shadow-glass space-y-2">
            <div className="flex items-center space-x-2 text-[#ff2a5f]">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span className="font-outfit font-bold uppercase tracking-wider text-sm">
                NO SINGLE CENTRAL CONTROLLER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Each intersection agent independently monitors local traffic sensors, negotiates green phase extensions with peer neighbors, and maintains zero single point of failure resilience.
            </p>
          </div>

          {/* Key Feature Bullets */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Peer-to-Peer Consensus</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Emergency Green Waves</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Adaptive Signal Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Self-Healing Mesh</span>
            </div>
          </div>

          {/* Action Call-to-Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onLaunchDashboard}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-[#ff003c] text-white font-outfit font-bold tracking-wide shadow-neon-red-lg hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2 text-sm"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRunSimulation}
              className="px-6 py-3.5 rounded-xl bg-[#121520] hover:bg-[#1a2030] text-slate-200 border border-[#1e2436] hover:border-[#ff2a5f]/40 font-outfit font-semibold transition-all flex items-center space-x-2 text-sm"
            >
              <Activity className="w-4 h-4 text-[#ff2a5f]" />
              <span>Run Simulation</span>
            </button>

            <button
              onClick={onRunDemo}
              className="px-5 py-3.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono text-xs transition-all flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Live Demo</span>
            </button>
          </div>

        </div>

        {/* Right Hero Visual Column (Interactive 3D/Canvas Network Mesh) */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full h-[480px] rounded-2xl border border-[#1e2436] glass-panel overflow-hidden shadow-glass group">
            {/* Header Badge overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#090a0f]/80 border border-[#1e2436] text-xs font-mono text-slate-300 backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-[#ff2a5f] animate-ping" />
              <span>INTERSECT MESH MAPPING</span>
            </div>

            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              8 AGENTS ACTIVE
            </div>

            {/* Canvas graphic render */}
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Footer Overlay Tag */}
            <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-xl bg-[#090a0f]/85 border border-[#1e2436] backdrop-blur-md flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-[#ff2a5f]" />
                <span>Localized Edge Computing</span>
              </span>
              <span className="text-[#00f0ff] font-semibold">Zero Central Bottlenecks</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
