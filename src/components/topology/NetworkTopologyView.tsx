import React, { useState } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  Server, 
  Database, 
  Monitor, 
  Globe, 
  X, 
  Lock, 
  Radio, 
  Activity,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';
import { HostNode } from '../../types/network';

export const NetworkTopologyView: React.FC = () => {
  const { 
    selectedHost, 
    setSelectedHost, 
    quarantinedHostIds, 
    quarantineHost, 
    unquarantineHost,
    isDemoMode 
  } = useCyberPredict();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterZone, setFilterZone] = useState<string>('all');

  const topology = mockApiService.getNetworkTopology();

  const handleZoomIn = () => setZoomLevel(z => Math.min(1.8, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomLevel(z => Math.max(0.6, +(z - 0.15).toFixed(2)));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const getNodeIcon = (role: string) => {
    switch (role) {
      case 'external_internet': return Globe;
      case 'potential_attacker': return Radio;
      case 'edge_gateway': return Server;
      case 'web_server': return Server;
      case 'app_server': return Server;
      case 'database': return Database;
      case 'workstation': return Monitor;
      case 'domain_controller': return Lock;
      default: return Server;
    }
  };

  const getNodeColor = (node: HostNode) => {
    const isQuarantined = quarantinedHostIds.includes(node.id);
    if (isQuarantined) {
      return {
        fill: '#1e1b4b',
        stroke: '#818cf8',
        badge: 'QUARANTINED',
        badgeBg: 'bg-indigo-950 text-indigo-300 border-indigo-700',
        glow: 'rgba(129, 140, 248, 0.4)'
      };
    }
    switch (node.status) {
      case 'suspicious':
        return {
          fill: '#450a0a',
          stroke: '#ef4444',
          badge: 'SUSPICIOUS',
          badgeBg: 'bg-red-950 text-red-300 border-red-700',
          glow: 'rgba(239, 68, 68, 0.5)'
        };
      case 'potentially_affected':
        return {
          fill: '#431407',
          stroke: '#f97316',
          badge: 'POTENTIALLY AFFECTED',
          badgeBg: 'bg-orange-950 text-orange-300 border-orange-700',
          glow: 'rgba(249, 115, 22, 0.4)'
        };
      case 'predicted_target':
        return {
          fill: '#3b0764',
          stroke: '#c084fc',
          badge: 'PREDICTED TARGET',
          badgeBg: 'bg-purple-950 text-purple-300 border-purple-700',
          glow: 'rgba(192, 132, 252, 0.5)'
        };
      default:
        return {
          fill: '#06281e',
          stroke: '#10b981',
          badge: 'NORMAL',
          badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-700',
          glow: 'rgba(16, 185, 129, 0.2)'
        };
    }
  };

  const filteredNodes = filterZone === 'all' 
    ? topology.nodes 
    : topology.nodes.filter(n => n.zone === filterZone);

  return (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden flex flex-col relative">
      {/* Top Controls Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-cyber-900/80">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide font-mono">
              Live Network Topology & Predicted Lateral Paths
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Interactive Graph
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SIMULATED TOPOLOGY
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Click any node to inspect host state, packet volumes, and predicted attack paths
          </p>
        </div>

        {/* Action Controls & Legend */}
        <div className="flex items-center space-x-3">
          {/* Zone Filter */}
          <div className="flex items-center space-x-1 text-xs font-mono bg-cyber-850 p-1 rounded-lg border border-white/10">
            {['all', 'external', 'dmz', 'internal', 'secure_core'].map(zone => (
              <button
                key={zone}
                onClick={() => setFilterZone(zone)}
                className={`px-2 py-1 rounded uppercase text-[10px] transition-colors ${
                  filterZone === zone ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                {zone.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-cyber-850 p-1 rounded-lg border border-white/10">
            <button 
              onClick={handleZoomIn} 
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button 
              onClick={handleZoomOut} 
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleReset} 
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white ml-1"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Banner */}
      <div className="px-4 py-2 border-b border-white/5 bg-cyber-950/40 flex flex-wrap items-center justify-between text-xs font-mono gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Normal Host</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-300 font-semibold">Suspicious Host</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-orange-300">Potentially Affected</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
            <span className="text-purple-300 font-semibold">Predicted Next Target</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
          <span className="text-cyan-400 font-semibold">Animated Dashes:</span>
          <span>Packet Streams</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative h-[480px] w-full bg-cyber-950/90 overflow-hidden cyber-grid">
        <svg 
          viewBox="0 0 960 520" 
          className="w-full h-full transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Markers for directed links */}
            <marker id="arrow-normal" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-suspicious" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-predicted" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" />
            </marker>
          </defs>

          {/* Network Subnet Boundary Boxes */}
          <g opacity="0.3">
            {/* External */}
            <rect x="30" y="30" width="280" height="460" rx="12" fill="none" stroke="#3b82f6" strokeDasharray="6 6" />
            <text x="45" y="55" fill="#3b82f6" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE: EXTERNAL & PERIMETER</text>

            {/* DMZ */}
            <rect x="340" y="30" width="230" height="460" rx="12" fill="none" stroke="#00f2ff" strokeDasharray="6 6" />
            <text x="355" y="55" fill="#00f2ff" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE: DMZ SEGMENT</text>

            {/* Internal Core */}
            <rect x="600" y="30" width="330" height="460" rx="12" fill="none" stroke="#8a2be2" strokeDasharray="6 6" />
            <text x="615" y="55" fill="#8a2be2" fontSize="11" fontFamily="monospace" fontWeight="bold">ZONE: INTERNAL & SECURE CORE</text>
          </g>

          {/* Links */}
          {topology.links.map(link => {
            const src = topology.nodes.find(n => n.id === link.source);
            const tgt = topology.nodes.find(n => n.id === link.target);
            if (!src || !tgt) return null;

            const isSuspicious = link.isSuspicious;
            const isPredicted = link.predictedPath;
            const midX = (src.x! + tgt.x!) / 2;
            const midY = (src.y! + tgt.y!) / 2;

            return (
              <g key={link.id}>
                {/* Edge line */}
                <line 
                  x1={src.x} 
                  y1={src.y} 
                  x2={tgt.x} 
                  y2={tgt.y} 
                  stroke={isSuspicious ? '#ef4444' : isPredicted ? '#c084fc' : '#334155'} 
                  strokeWidth={isSuspicious || isPredicted ? '2.5' : '1.5'}
                  strokeDasharray={isSuspicious || isPredicted ? '6 4' : 'none'}
                  className={isSuspicious ? 'animate-flow-fast' : isPredicted ? 'animate-flow' : ''}
                  markerEnd={isSuspicious ? 'url(#arrow-suspicious)' : isPredicted ? 'url(#arrow-predicted)' : 'url(#arrow-normal)'}
                />

                {/* Protocol badge on link */}
                <g transform={`translate(${midX - 18}, ${midY - 8})`}>
                  <rect width="36" height="15" rx="3" fill="#060c18" stroke={isSuspicious ? '#ef4444' : '#334155'} strokeWidth="1" />
                  <text x="18" y="11" fill={isSuspicious ? '#ef4444' : '#94a3b8'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {link.protocol}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const color = getNodeColor(node);
            const isSelected = selectedHost?.id === node.id;
            const isQuarantined = quarantinedHostIds.includes(node.id);
            const Icon = getNodeIcon(node.role);

            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedHost(node)}
                className="cursor-pointer group"
              >
                {/* Glow ring for suspicious or selected */}
                {(node.status === 'suspicious' || node.status === 'predicted_target' || isSelected) && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="28" 
                    fill="none" 
                    stroke={color.stroke} 
                    strokeWidth="1.5" 
                    className="radar-ping" 
                  />
                )}

                {/* Node Outer Circle */}
                <circle 
                  cx="0" 
                  cy="0" 
                  r={isSelected ? "22" : "19"} 
                  fill={color.fill} 
                  stroke={isSelected ? '#00f2ff' : color.stroke} 
                  strokeWidth={isSelected ? '3' : '2'} 
                  className="transition-all duration-200"
                />

                {/* Inner Icon */}
                <g transform="translate(-8, -8)">
                  <Icon className="w-4 h-4 text-white" />
                </g>

                {/* Host label text */}
                <text 
                  x="0" 
                  y="32" 
                  fill="#f1f5f9" 
                  fontSize="11" 
                  fontFamily="monospace" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {node.name}
                </text>
                <text 
                  x="0" 
                  y="45" 
                  fill="#94a3b8" 
                  fontSize="9" 
                  fontFamily="monospace" 
                  textAnchor="middle"
                >
                  {node.ip}
                </text>

                {/* Status indicator tag */}
                <g transform="translate(-25, -34)">
                  <rect width="50" height="14" rx="3" fill="#040812" stroke={color.stroke} strokeWidth="1" />
                  <text x="25" y="10" fill={color.stroke} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    {color.badge}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Host Details Drawer / Modal Overlay */}
        {selectedHost && (
          <div className="absolute top-3 right-3 bottom-3 w-84 bg-cyber-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 shadow-2xl overflow-y-auto z-20 flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white font-mono">{selectedHost.name}</h4>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getNodeColor(selectedHost).badgeBg}`}>
                      {getNodeColor(selectedHost).badge}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedHost.ip}</p>
                </div>
                <button 
                  onClick={() => setSelectedHost(null)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Host Attributes */}
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-cyber-850 p-2.5 rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Host ID:</span>
                    <span className="text-white">{selectedHost.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Network Zone:</span>
                    <span className="text-cyan-300 uppercase">{selectedHost.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operating System:</span>
                    <span className="text-slate-200">{selectedHost.os || 'Unknown OS'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Conns:</span>
                    <span className="text-white font-bold">{selectedHost.activeConnections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traffic Volume:</span>
                    <span className="text-white">{selectedHost.trafficVolumeMB} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Activity:</span>
                    <span className="text-emerald-400">{selectedHost.lastActivity}</span>
                  </div>
                </div>

                {/* Risk and Prediction */}
                <div className="bg-cyber-850 p-2.5 rounded-lg border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Host Risk Score:</span>
                    <span className={`text-base font-black ${selectedHost.riskScore >= 70 ? 'text-red-400' : selectedHost.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {selectedHost.riskScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase">Current Behavioral State:</span>
                    <span className="text-white font-semibold text-[11px]">{selectedHost.currentState}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 text-[10px] block uppercase">Predicted Next State:</span>
                    <span className="text-cyan-300 font-semibold text-[11px]">{selectedHost.predictedState}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Defensive Action Buttons */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              {quarantinedHostIds.includes(selectedHost.id) ? (
                <button
                  onClick={() => unquarantineHost(selectedHost.id)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Restore Host to Network</span>
                </button>
              ) : (
                <button
                  onClick={() => quarantineHost(selectedHost.id)}
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-glow-red/30"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Quarantine & Isolate Host</span>
                </button>
              )}
              <p className="text-[10px] text-slate-400 text-center font-mono">
                Isolates host via simulated OpenFlow / iptables rule
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
