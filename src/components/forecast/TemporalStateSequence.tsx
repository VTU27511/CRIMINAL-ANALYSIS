import React from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Sparkles, 
  Info,
  Clock,
  Zap
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const TemporalStateSequence: React.FC = () => {
  const { isDemoMode } = useCyberPredict();
  const states = mockApiService.getTemporalStates();

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              Temporal Network State Transitions: S(t) → S(t+k)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              World Model State Dynamics
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SIMULATED DATA
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Network states are constructed by binning flows into rolling temporal windows, allowing the model to learn transition probabilities
          </p>
        </div>

        {/* State equation pill */}
        <div className="px-3 py-1.5 rounded-lg bg-cyber-850 border border-white/10 text-xs font-mono text-cyan-300">
          State Equation: <span className="text-white font-bold">S(t+1) = f(S_t, S_t-1, ..., S_t-k)</span>
        </div>
      </div>

      {/* States Sequence Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {states.map((st, idx) => {
          const isCurrent = idx === 3;
          const isForecast = st.isPredicted;

          return (
            <div 
              key={st.stateId}
              className={`rounded-xl p-3.5 border transition-all duration-300 flex flex-col justify-between relative ${
                isForecast
                  ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan/20 border-dashed'
                  : isCurrent
                  ? 'bg-blue-950/50 border-blue-500 shadow-glow-cyan/25 ring-1 ring-blue-500/50'
                  : 'bg-cyber-900/60 border-white/10'
              }`}
            >
              {/* State ID Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isForecast ? 'bg-cyan-400 text-cyber-950' : isCurrent ? 'bg-blue-500 text-white' : 'bg-cyber-800 text-slate-300'
                  }`}>
                    {st.stateId}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {st.timeLabel}
                </span>
              </div>

              {/* Risk Score */}
              <div className="flex items-baseline justify-between my-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Risk Level
                </span>
                <span className={`text-xl font-black font-mono ${
                  st.riskScore >= 70 ? 'text-red-400' : st.riskScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {st.riskScore}%
                </span>
              </div>

              {/* Feature Metrics in this State */}
              <div className="space-y-1.5 my-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Flow Count:</span>
                  <span className="text-white font-semibold">{st.flowCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Unique Src/Dst:</span>
                  <span className="text-slate-200">{st.uniqueSources} / {st.uniqueDestinations}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Packet Rate:</span>
                  <span className="text-white">{st.packetRate} pkts/s</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>SYN Ratio:</span>
                  <span className={st.synRatio >= 0.35 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {(st.synRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Port Diversity:</span>
                  <span className={st.portDiversity >= 0.4 ? 'text-amber-300 font-bold' : 'text-slate-300'}>
                    {st.portDiversity.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Timing Anomalies:</span>
                  <span className={st.timingAnomalies >= 20 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {st.timingAnomalies}
                  </span>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-2 border-t border-white/5 text-center">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                  isForecast ? 'text-cyan-400 animate-pulse' : isCurrent ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {isForecast ? '🔮 Forecast Horizon S(t+1)' : isCurrent ? '📍 Current Observed S(t)' : '✓ Historical Baseline'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory callout */}
      <div className="p-3 rounded-lg bg-cyber-850/80 border border-white/10 flex items-start space-x-3 text-xs font-mono">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          <strong className="text-cyan-400 font-semibold">"The model learns how network states transition over time."</strong> Traditional IDSs treat each packet or flow as an isolated event, missing the slow build-up of reconnaissance and discovery. CyberPredict's world model compresses network activity into dense latent state vectors, predicting state transitions before malicious lateral actions succeed.
        </p>
      </div>
    </div>
  );
};
