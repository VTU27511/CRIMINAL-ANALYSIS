import React, { useState } from 'react';
import { 
  TrendingUp, 
  Info, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  AlertOctagon,
  Layers
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const AttackForecastChart: React.FC = () => {
  const { isMitigationSimulated, toggleMitigationSimulation, isDemoMode } = useCyberPredict();
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Get raw forecast curves
  const rawPoints = mockApiService.getForecastCurves();

  // Apply mitigation factor if active
  const points = rawPoints.map(pt => {
    if (!pt.isForecast || !isMitigationSimulated) return pt;
    // Mitigation drops forecasted progression sharply
    const factor = Math.max(0.25, 1 - (pt.minutesFromNow / 30) * 0.7);
    return {
      ...pt,
      riskScore: +(pt.riskScore * factor).toFixed(2),
      lowerConfidenceBound: +(pt.lowerConfidenceBound * factor).toFixed(2),
      upperConfidenceBound: +(pt.upperConfidenceBound * factor).toFixed(2),
      predictedStage: 'Discovery'
    };
  });

  // SVG Chart Geometry
  const width = 860;
  const height = 300;
  const padding = { top: 30, right: 40, bottom: 45, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale functions
  const getX = (index: number) => padding.left + (index / (points.length - 1)) * graphWidth;
  const getY = (score: number) => padding.top + (1 - Math.min(1, Math.max(0, score))) * graphHeight;

  // Split points into Historical (index 0 to 3) and Forecast (index 3 to points.length-1)
  const nowIndex = points.findIndex(p => p.horizon === 'Now');
  const histPoints = points.slice(0, nowIndex + 1);
  const forecastPoints = points.slice(nowIndex);

  // SVG path for Historical
  const histPathD = histPoints.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getY(curr.riskScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // SVG path for Forecast
  const forecastPathD = forecastPoints.reduce((acc, curr, idx) => {
    const globalIdx = nowIndex + idx;
    const x = getX(globalIdx);
    const y = getY(curr.riskScore);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Confidence Interval Shaded Polygon for Forecast
  const upperPath = forecastPoints.map((curr, idx) => {
    const globalIdx = nowIndex + idx;
    return `${getX(globalIdx)},${getY(curr.upperConfidenceBound)}`;
  });
  const lowerPath = [...forecastPoints].reverse().map((curr, idx) => {
    const globalIdx = nowIndex + (forecastPoints.length - 1 - idx);
    return `${getX(globalIdx)},${getY(curr.lowerConfidenceBound)}`;
  });
  const confidencePolygonPoints = [...upperPath, ...lowerPath].join(' ');

  // Now Divider X coordinate
  const nowX = getX(nowIndex);

  const activeHover = hoveredPointIndex !== null ? points[hoveredPointIndex] : null;

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 relative">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Attack Progression Forecast
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold uppercase tracking-wider">
              Autoregressive Temporal Rollout
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SIMULATED DATA
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Temporal state projection over 30-minute rolling horizon with 95% Bayesian confidence bounds
          </p>
        </div>

        {/* Legend and Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-blue-400 inline-block rounded" />
              <span className="text-slate-300">Historical</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-cyan-400 inline-block" />
              <span className="text-cyan-300 font-semibold">Forecast</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-500/40 inline-block rounded-xs" />
              <span className="text-slate-400">Confidence Range</span>
            </div>
          </div>

          {/* Mitigation simulation toggle */}
          <button
            onClick={toggleMitigationSimulation}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
              isMitigationSimulated
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-glow-cyan/20'
                : 'bg-cyber-800 hover:bg-cyber-750 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle simulation of host isolation to test projected mitigation outcome"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isMitigationSimulated ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isMitigationSimulated ? 'Mitigation Active (-55% Risk)' : 'Simulate Mitigation'}</span>
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto min-w-[650px] overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="forecastGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="historicalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (Y-axis 0%, 25%, 50%, 75%, 100%) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = getY(pct);
            return (
              <g key={idx}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={width - padding.right} 
                  y2={y} 
                  stroke="rgba(255, 255, 255, 0.07)" 
                  strokeDasharray="4 4"
                />
                <text 
                  x={padding.left - 10} 
                  y={y + 4} 
                  fill="#64748b" 
                  fontSize="10" 
                  fontFamily="monospace" 
                  textAnchor="end"
                >
                  {Math.round(pct * 100)}%
                </text>
              </g>
            );
          })}

          {/* Shaded Forecast Background Zone */}
          <rect 
            x={nowX} 
            y={padding.top} 
            width={width - padding.right - nowX} 
            height={graphHeight} 
            fill="rgba(0, 242, 255, 0.02)"
          />

          {/* Confidence Interval Shaded Band */}
          <polygon 
            points={confidencePolygonPoints} 
            fill="url(#confidenceFill)"
          />

          {/* Historical Path */}
          <path 
            d={histPathD} 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Forecast Path (Dashed Glowing Line) */}
          <path 
            d={forecastPathD} 
            fill="none" 
            stroke={isMitigationSimulated ? '#10b981' : 'url(#forecastGlow)'} 
            strokeWidth="3.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />

          {/* Vertical "Now" Current Observation Line */}
          <line 
            x1={nowX} 
            y1={padding.top} 
            x2={nowX} 
            y2={height - padding.bottom} 
            stroke="#00f2ff" 
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <circle cx={nowX} cy={getY(points[nowIndex].riskScore)} r="6" fill="#00f2ff" />
          <circle cx={nowX} cy={getY(points[nowIndex].riskScore)} r="12" fill="none" stroke="#00f2ff" opacity="0.4" className="radar-ping" />

          {/* Now label tag */}
          <g transform={`translate(${nowX - 25}, ${padding.top - 8})`}>
            <rect width="50" height="18" rx="4" fill="#060c18" stroke="#00f2ff" strokeWidth="1" />
            <text x="25" y="12" fill="#00f2ff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              NOW
            </text>
          </g>

          {/* Data Points */}
          {points.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.riskScore);
            const isNow = pt.horizon === 'Now';
            const isHovered = hoveredPointIndex === idx;

            return (
              <g 
                key={idx} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPointIndex(idx)}
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                {/* Target hitbox */}
                <circle cx={x} cy={y} r="16" fill="transparent" />

                {/* Point circle */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? 7 : (pt.isForecast ? 4.5 : 3.5)} 
                  fill={pt.isForecast ? (isMitigationSimulated ? '#10b981' : '#00f2ff') : '#3b82f6'} 
                  stroke="#060c18" 
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* X-axis label */}
                <text 
                  x={x} 
                  y={height - padding.bottom + 18} 
                  fill={isNow ? '#00f2ff' : pt.isForecast ? '#94a3b8' : '#64748b'} 
                  fontSize="10" 
                  fontFamily="monospace" 
                  fontWeight={isNow ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {pt.horizon}
                </text>
                <text 
                  x={x} 
                  y={height - padding.bottom + 30} 
                  fill="#475569" 
                  fontSize="8" 
                  fontFamily="monospace" 
                  textAnchor="middle"
                >
                  {pt.timestamp}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHover && hoveredPointIndex !== null && (
          <div 
            className="absolute z-30 pointer-events-none glass-panel-glow p-3 rounded-lg border border-cyan-500/50 shadow-2xl text-xs font-mono space-y-1 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(getX(hoveredPointIndex) / width) * 100}%`,
              top: `${getY(activeHover.riskScore) - 15}px`
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1 gap-3">
              <span className="font-bold text-white">{activeHover.horizon} ({activeHover.timestamp})</span>
              <span className={`text-[10px] px-1 rounded ${activeHover.isForecast ? 'bg-cyan-950 text-cyan-300' : 'bg-blue-950 text-blue-300'}`}>
                {activeHover.isForecast ? 'FORECAST' : 'OBSERVED'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Attack Probability:</span>
              <span className="text-cyan-400 font-bold">{Math.round(activeHover.riskScore * 100)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Predicted Stage:</span>
              <span className="text-white font-semibold">{activeHover.predictedStage}</span>
            </div>
            {activeHover.isForecast && (
              <>
                <div className="flex justify-between gap-4 text-[10px] text-slate-400 pt-0.5 border-t border-white/5">
                  <span>95% CI Range:</span>
                  <span>{Math.round(activeHover.lowerConfidenceBound * 100)}% - {Math.round(activeHover.upperConfidenceBound * 100)}%</span>
                </div>
                <div className="flex justify-between gap-4 text-[10px] text-slate-400">
                  <span>Model Confidence:</span>
                  <span>{Math.round(activeHover.confidence * 100)}%</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer explanation note */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Solid curve denotes observed historical telemetry; dashed segment indicates projected autoregressive trajectory.
        </span>
        <span className="text-slate-500">
          Loss: MSE 0.041 (MAE @ 15m)
        </span>
      </div>
    </div>
  );
};
