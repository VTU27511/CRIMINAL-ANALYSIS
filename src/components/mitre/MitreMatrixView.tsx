import React, { useState } from 'react';
import { 
  Grid3X3, 
  ShieldAlert, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';
import { MitreTechnique, MitreTacticColumn } from '../../types/mitre';

export const MitreMatrixView: React.FC = () => {
  const { currentScenario, isDemoMode } = useCyberPredict();
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);

  const tactics = mockApiService.getMitreTacticColumns();

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Grid3X3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              MITRE ATT&CK® Enterprise Matrix & Forecast Mapping
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              v14.1 Enterprise Tactics
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SIMULATED TACTIC PROBABILITIES
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Network behaviors mapped directly to validated adversary tactics and projected next techniques
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-400 inline-block" />
            <span className="text-blue-300">Observed Tactic</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400 inline-block shadow-glow-cyan/50" />
            <span className="text-cyan-300 font-bold">Predicted Next Tactic</span>
          </div>
        </div>
      </div>

      {/* 12-Column Tactic Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 overflow-x-auto">
        {tactics.map((tactic) => {
          const isCurrent = tactic.isCurrentStage;
          const isPredicted = tactic.isPredictedStage;

          return (
            <div 
              key={tactic.id}
              className={`rounded-lg p-2 border flex flex-col justify-between transition-all ${
                isPredicted
                  ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400/50 shadow-glow-cyan/20'
                  : isCurrent
                  ? 'bg-blue-950/60 border-blue-400 ring-1 ring-blue-400/50'
                  : 'bg-cyber-900/50 border-white/5'
              }`}
            >
              {/* Tactic Header */}
              <div className="border-b border-white/10 pb-1.5 mb-2">
                <span className="text-[9px] font-mono text-slate-400 block">{tactic.id}</span>
                <h4 className={`text-xs font-bold font-mono leading-tight truncate ${
                  isPredicted ? 'text-cyan-300' : isCurrent ? 'text-blue-300' : 'text-slate-300'
                }`} title={tactic.name}>
                  {tactic.shortName}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[9px] font-mono">
                  <span className="text-slate-500">Likelihood:</span>
                  <span className={isPredicted || isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                    {(tactic.stageProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Technique Items */}
              <div className="space-y-1.5 flex-1">
                {tactic.techniques.map((tech) => {
                  const isTechActive = tech.observedInCurrentState;
                  const isTechPredicted = tech.predictedInFutureState;

                  return (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`w-full text-left p-1.5 rounded text-[10px] font-mono border transition-all ${
                        isTechPredicted
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 hover:bg-cyan-900 shadow-glow-cyan/20'
                          : isTechActive
                          ? 'bg-blue-950/80 border-blue-400 text-blue-200 hover:bg-blue-900'
                          : 'bg-cyber-850/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{tech.id}</span>
                        {isTechPredicted && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="truncate text-[9px] text-slate-300 mt-0.5" title={tech.name}>
                        {tech.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Technique Drilldown Drawer */}
      {selectedTechnique && (
        <div className="bg-cyber-850/90 rounded-xl p-4 border border-cyan-500/40 relative shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                {selectedTechnique.id}
              </span>
              <h4 className="text-sm font-bold text-white font-mono">{selectedTechnique.name}</h4>
              <span className="text-xs text-slate-400 font-mono">({selectedTechnique.tactic})</span>
            </div>
            <button 
              onClick={() => setSelectedTechnique(null)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            {selectedTechnique.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-cyber-900 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Detection Evidence</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {selectedTechnique.detectionEvidence.map((ev, i) => (
                  <li key={i} className="text-[11px] text-cyan-300">{ev}</li>
                ))}
              </ul>
            </div>

            <div className="bg-cyber-900 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Telemetry Data Sources</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {selectedTechnique.dataSources.map((ds, i) => (
                  <li key={i} className="text-[11px] text-slate-200">{ds}</li>
                ))}
              </ul>
            </div>

            <div className="bg-cyber-900 p-2.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Mitigation Strategies</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {selectedTechnique.mitigations.map((mg, i) => (
                  <li key={i} className="text-[11px] text-emerald-300">{mg}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
