import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const MultiStepForecastCards: React.FC = () => {
  const { isMitigationSimulated, isDemoMode } = useCyberPredict();
  const rawCards = mockApiService.getMultiStepCards();

  const cards = rawCards.map(c => {
    if (!isMitigationSimulated) return c;
    const factor = Math.max(0.28, 1 - (c.minutes / 30) * 0.65);
    return {
      ...c,
      riskPercent: Math.round(c.riskPercent * factor),
      stage: 'Discovery',
      summary: 'Containment mitigations effectively suppress predicted lateral pivot.'
    };
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Reconnaissance': return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      case 'Initial Access': return 'text-blue-400 border-blue-500/30 bg-blue-950/40';
      case 'Execution': return 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40';
      case 'Discovery': return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      case 'Lateral Movement': return 'text-orange-400 border-orange-500/30 bg-orange-950/40';
      case 'Command and Control': return 'text-red-400 border-red-500/30 bg-red-950/40';
      case 'Exfiltration': return 'text-rose-400 border-rose-500/30 bg-rose-950/40';
      default: return 'text-purple-400 border-purple-500/30 bg-purple-950/40';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-cyan-400" />
            Future Network State Forecast
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-800 text-slate-300 border border-white/10">
            Multi-Step Horizons
          </span>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
              DEMO DATA
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-slate-400">
          Autoregressive Lookahead Window: 30 Minutes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map((c, idx) => {
          const badgeClass = getStageColor(c.stage);
          const isHigh = c.riskPercent >= 75;
          const isMed = c.riskPercent >= 50 && c.riskPercent < 75;

          return (
            <div 
              key={idx}
              className={`glass-panel rounded-xl p-3.5 border transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5 relative group ${
                isHigh ? 'border-red-500/40 bg-red-950/10' : isMed ? 'border-orange-500/30' : 'border-white/10'
              }`}
            >
              {/* Horizon Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  {c.horizon}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  +{c.minutes}m out
                </span>
              </div>

              {/* Predicted Risk */}
              <div className="flex items-baseline justify-between my-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Predicted Risk
                  </span>
                  <span className={`text-2xl font-black font-mono tracking-tight ${
                    isHigh ? 'text-red-400' : isMed ? 'text-orange-400' : 'text-amber-400'
                  }`}>
                    {c.riskPercent}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Confidence
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-200">
                    {c.confidencePercent}%
                  </span>
                </div>
              </div>

              {/* Predicted Stage */}
              <div className="my-2 pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Predicted Stage
                </span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border inline-block truncate max-w-full ${badgeClass}`}>
                  {c.stage}
                </span>
              </div>

              {/* State Change Deltas */}
              <div className="space-y-1 my-2 bg-cyber-950/60 p-2 rounded-lg border border-white/5 text-[10px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Flow Anomaly:</span>
                  <span className="text-white font-semibold">{c.stateDelta.flowAnomalyDelta}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Port Spread:</span>
                  <span className="text-cyan-300 font-semibold">{c.stateDelta.portSpreadDelta}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Velocity:</span>
                  <span className={`${isHigh ? 'text-red-400' : 'text-amber-400'} font-semibold`}>
                    {c.stateDelta.velocityDelta}
                  </span>
                </div>
              </div>

              {/* Summary note */}
              <p className="text-[11px] text-slate-400 leading-tight line-clamp-2 mt-1" title={c.summary}>
                {c.summary}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
