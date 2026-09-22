import React from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap,
  Target
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const AttackTrajectoryPath: React.FC = () => {
  const { currentScenario, isDemoMode } = useCyberPredict();
  const stages = mockApiService.getAttackTrajectory();

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white tracking-wide font-mono">
            Attack Trajectory & Kill-Chain State Transitions
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            Markovian + Attention Transition
          </span>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
              SIMULATED VALUES
            </span>
          )}
        </div>

        {/* Current vs Predicted Key Summary */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Current: <strong className="text-white">{currentScenario.stageName}</strong></span>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-glow-cyan/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Predicted: <strong className="text-white">{currentScenario.predictedStage}</strong></span>
            <span className="text-[10px] font-bold text-cyan-400 ml-1">(87% Prob)</span>
          </div>
        </div>
      </div>

      {/* Trajectory Step-by-Step Chain */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-2 relative pt-2">
        {stages.map((stage, idx) => {
          const isCurrent = stage.isCurrent;
          const isPredicted = stage.isPredictedNext;
          const isPast = stage.order < stages.find(s => s.isCurrent)?.order!;

          return (
            <div 
              key={stage.id}
              className={`relative rounded-xl p-2.5 border transition-all duration-300 flex flex-col justify-between text-left ${
                isCurrent
                  ? 'bg-blue-950/60 border-blue-500 shadow-glow-cyan/30 scale-105 z-10'
                  : isPredicted
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-glow-cyan/40 scale-105 z-10'
                  : isPast
                  ? 'bg-cyber-900/60 border-white/10 opacity-75'
                  : 'bg-cyber-950/40 border-white/5 opacity-50'
              }`}
            >
              {/* Top pill */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono text-slate-400">
                  #{stage.order}
                </span>
                {isCurrent ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500 text-white animate-pulse">
                    CURRENT
                  </span>
                ) : isPredicted ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-400 text-cyber-950 animate-bounce">
                    NEXT
                  </span>
                ) : isPast ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span className="text-[9px] font-mono text-slate-500">pending</span>
                )}
              </div>

              {/* Stage Name */}
              <div className="my-1">
                <span className={`text-xs font-bold leading-tight block truncate ${
                  isCurrent ? 'text-blue-200' : isPredicted ? 'text-cyan-300' : 'text-slate-300'
                }`} title={stage.name}>
                  {stage.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {stage.mitreTacticId}
                </span>
              </div>

              {/* Probability bar */}
              <div className="mt-2 pt-1 border-t border-white/5">
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                  <span>Likelihood</span>
                  <span className={`font-bold ${isCurrent || isPredicted ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {stage.probabilityPercent}%
                  </span>
                </div>
                <div className="w-full bg-cyber-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full ${isPredicted ? 'bg-cyan-400' : isCurrent ? 'bg-blue-400' : 'bg-slate-500'}`}
                    style={{ width: `${stage.probabilityPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trajectory Footnote */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5 gap-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          The transition model evaluates temporal Markov chain probabilities conditioned on packet inter-arrival burstiness and subnet dispersion.
        </span>
        <span className="text-cyan-400 font-semibold">
          High Confidence Progression Path: {currentScenario.stageName} → {currentScenario.predictedStage}
        </span>
      </div>
    </div>
  );
};
