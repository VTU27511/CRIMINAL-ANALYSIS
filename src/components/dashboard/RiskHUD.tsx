import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Crosshair, 
  TrendingUp, 
  Server, 
  Radar,
  ArrowRight,
  Info
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';

export const RiskHUD: React.FC = () => {
  const { currentScenario, isMitigationSimulated, isDemoMode } = useCyberPredict();

  // If analyst clicked "Simulate Mitigation", risk score drops conceptually
  const effectiveRisk = isMitigationSimulated 
    ? Math.max(12, Math.round(currentScenario.currentRiskScore * 0.35))
    : currentScenario.currentRiskScore;

  const getRiskColor = (score: number) => {
    if (score >= 80) return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/40', badge: 'bg-red-950 text-red-300 border-red-800', label: 'CRITICAL RISK' };
    if (score >= 60) return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', badge: 'bg-orange-950 text-orange-300 border-orange-800', label: 'HIGH RISK' };
    if (score >= 30) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', badge: 'bg-amber-950 text-amber-300 border-amber-800', label: 'MEDIUM RISK' };
    return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800', label: 'NORMAL / LOW' };
  };

  const riskMeta = getRiskColor(effectiveRisk);

  return (
    <div className="space-y-4">
      {/* Central Innovation Callout Banner */}
      <div className="glass-panel-glow rounded-xl p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Paradigm Shift in Cyber Defense
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Temporal World Model
              </span>
            </div>
            <p className="text-sm font-semibold text-white tracking-wide">
              "Don't just detect the attack. <span className="text-cyan-400 underline decoration-cyan-500/50 underline-offset-4">Predict where it is going next.</span>"
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-2.5 py-1.5 rounded bg-cyber-850 border border-white/10 text-slate-400 hidden sm:block">
            Traditional IDS: <span className="text-rose-400 font-semibold">"Attack Detected"</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          <div className="px-2.5 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
            CyberPredict AI: <span className="text-cyan-200">"Lateral Movement Likely in T+10m"</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Current Risk */}
        <div className={`glass-panel rounded-xl p-4 border ${riskMeta.border} relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              Current Risk
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300">
                DEMO
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-2 my-1">
            <span className={`text-3xl font-black font-mono tracking-tight ${riskMeta.text}`}>
              {effectiveRisk}%
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${riskMeta.badge}`}>
              {riskMeta.label}
            </span>
          </div>
          <div className="w-full bg-cyber-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${effectiveRisk >= 80 ? 'bg-red-500' : effectiveRisk >= 60 ? 'bg-orange-500' : effectiveRisk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${effectiveRisk}%` }}
            />
          </div>
          {isMitigationSimulated && (
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">
              Mitigation Active (-55% Risk)
            </span>
          )}
        </div>

        {/* Current Attack Stage */}
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              Current Stage
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Observed</span>
          </div>
          <p className="text-lg font-bold text-white truncate mt-1" title={currentScenario.stageName}>
            {currentScenario.stageName}
          </p>
          <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            {currentScenario.mitreTactic}
          </p>
        </div>

        {/* Predicted Next Stage */}
        <div className="glass-panel rounded-xl p-4 border border-cyan-500/30 bg-cyber-850/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-cyan-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Predicted Next
            </span>
            <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
              FORECAST
            </span>
          </div>
          <p className="text-lg font-bold text-cyan-300 truncate mt-1" title={currentScenario.predictedStage}>
            {currentScenario.predictedStage}
          </p>
          <div className="flex items-center space-x-1.5 mt-1 text-[11px] font-mono text-slate-400">
            <span>Horizon:</span>
            <span className="text-cyan-400 font-bold">+10 to +15 min</span>
          </div>
        </div>

        {/* Forecast Confidence */}
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-400">
              Confidence
            </span>
            <Info className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex items-baseline space-x-1 my-1">
            <span className="text-3xl font-black font-mono text-white">
              {currentScenario.forecastConfidence}%
            </span>
            <span className="text-xs text-slate-400 font-mono">prob</span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 truncate">
            Bayesian Ensemble CI [95%]
          </p>
        </div>

        {/* Active Hosts */}
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              Active Hosts
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Online</span>
          </div>
          <div className="text-3xl font-black font-mono text-white my-1">
            {currentScenario.activeHostsCount}
          </div>
          <p className="text-[10px] font-mono text-slate-400">
            Across 3 Network Segments
          </p>
        </div>

        {/* Suspicious Hosts */}
        <div className={`glass-panel rounded-xl p-4 border ${currentScenario.suspiciousHostsCount > 0 ? 'border-red-500/40 bg-red-950/20' : 'border-white/10'}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className={`w-3.5 h-3.5 ${currentScenario.suspiciousHostsCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
              Suspicious
            </span>
            {currentScenario.suspiciousHostsCount > 0 && (
              <span className="text-[9px] font-mono px-1 rounded bg-red-950 text-red-300 border border-red-700">
                ACTION
              </span>
            )}
          </div>
          <div className={`text-3xl font-black font-mono my-1 ${currentScenario.suspiciousHostsCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {currentScenario.suspiciousHostsCount}
          </div>
          <p className="text-[10px] font-mono text-slate-400 truncate">
            {currentScenario.suspiciousHostsCount > 0 ? 'Host-01 & Server-01 flagged' : 'No anomalous nodes'}
          </p>
        </div>
      </div>
    </div>
  );
};
