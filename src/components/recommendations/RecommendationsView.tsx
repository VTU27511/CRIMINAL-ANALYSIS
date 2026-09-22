import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Lock, 
  Terminal, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info,
  Layers,
  Network
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const RecommendationsView: React.FC = () => {
  const { 
    isMitigationSimulated, 
    toggleMitigationSimulation,
    appliedRecommendationIds,
    applyRecommendation,
    isDemoMode 
  } = useCyberPredict();

  const recommendations = mockApiService.getDefensiveRecommendations();

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              Analyst Decision Support: Recommended Defensive Actions
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Proactive Containment Playbooks
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Prescriptive security interventions prioritized by predicted risk reduction before attack escalation occurs
          </p>
        </div>

        {/* Interactive Simulation Switcher */}
        <button
          onClick={toggleMitigationSimulation}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
            isMitigationSimulated
              ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-glow-cyan/20'
              : 'bg-cyber-850 hover:bg-cyber-800 text-cyan-300 border-cyan-500/30'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>{isMitigationSimulated ? '✓ Containment Simulated (Active)' : 'Simulate Containment Impact'}</span>
        </button>
      </div>

      {/* Mandatory Decision Support Disclaimer */}
      <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-start space-x-3">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-200">IMPORTANT DECISION-SUPPORT NOTICE:</strong> Recommendations are decision-support suggestions and should be reviewed and verified by a security analyst before execution in production environments. The platform does NOT autonomously execute disruptive network mutations.
        </p>
      </div>

      {/* Mitigation Impact Interactive Simulator Visual */}
      <div className="p-4 rounded-xl bg-cyber-950/80 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-bold">
            Projected Mitigation Outcome Simulator
          </span>
          <span className={isMitigationSimulated ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {isMitigationSimulated ? 'Simulated Reduction: -55% Risk' : 'Baseline Unmitigated Risk'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
          <div className="p-3 rounded-lg bg-cyber-900 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">Unmitigated Forecast (T+15m)</span>
            <span className="text-2xl font-black text-red-400">87% RISK</span>
            <p className="text-[11px] text-slate-400">Lateral movement and credential harvesting succeed unchecked.</p>
          </div>

          <div className={`p-3 rounded-lg border transition-all space-y-1 ${
            isMitigationSimulated 
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 shadow-glow-cyan/20' 
              : 'bg-cyber-900 border-white/5 text-slate-500'
          }`}>
            <span className="text-[10px] block uppercase">Post-Containment Forecast (T+15m)</span>
            <span className={`text-2xl font-black ${isMitigationSimulated ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isMitigationSimulated ? '28% RISK' : '--'}
            </span>
            <p className="text-[11px] leading-tight">
              {isMitigationSimulated 
                ? 'Host isolated, lateral SMB traffic severed. Adversary trapped in DMZ segment.' 
                : 'Click "Simulate Containment Impact" above to evaluate risk drop.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((rec) => {
          const isApplied = appliedRecommendationIds.includes(rec.id);

          return (
            <div 
              key={rec.id}
              className={`rounded-xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                isApplied
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-cyber-900/70 border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    rec.priority === 'immediate' 
                      ? 'bg-red-950 text-red-300 border-red-800' 
                      : 'bg-orange-950 text-orange-300 border-orange-800'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Est. -{rec.riskReductionEstimatePercent}% Risk
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-mono">{rec.title}</h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Target: <strong className="text-slate-200">{rec.affectedHost}</strong> ({rec.hostIp})
                </p>

                <p className="text-xs text-slate-300 font-mono mt-2 leading-relaxed">
                  {rec.reason}
                </p>

                {/* Command Snippet */}
                <div className="my-2 p-2 rounded bg-cyber-950 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="select-all">{rec.recommendedCommandOrStep}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  Category: {rec.category}
                </span>

                {isApplied ? (
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Action Applied
                  </span>
                ) : (
                  <button
                    onClick={() => applyRecommendation(rec.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-white text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors border border-white/10"
                  >
                    <span>Mark as Executed</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
