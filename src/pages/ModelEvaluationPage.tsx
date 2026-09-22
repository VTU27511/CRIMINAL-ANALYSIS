import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  TrendingUp, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCyberPredict } from '../context/CyberPredictContext';
import { mockApiService } from '../services/mockApi';

export const ModelEvaluationPage: React.FC = () => {
  const { isDemoMode } = useCyberPredict();
  const evaluations = mockApiService.getModelEvaluations();

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-2">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono tracking-wide">
            Model Evaluation & Forecasting Benchmark Comparison
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            Multi-Horizon Validation
          </span>
        </div>
        <p className="text-xs text-slate-300 font-mono">
          Systematic performance comparison between point-in-time classifiers and temporal sequence architectures on network attack forecasting
        </p>
      </div>

      {/* Prominent Simulated Notice */}
      <div className="p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/50 text-amber-300 text-xs font-mono space-y-1">
        <div className="flex items-center space-x-2 font-bold text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="uppercase tracking-wider text-sm">SIMULATED DEMONSTRATION RESULTS</span>
        </div>
        <p className="leading-relaxed">
          The metrics displayed below reflect simulated benchmark baselines configured for the SIH prototype demonstration. In production, real model validation metrics are ingested live from the Python ML training backend via <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-300">GET /api/model-evaluations</code>.
        </p>
      </div>

      {/* Comprehensive Metric Comparison Table */}
      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
          Classification & Forecasting Metric Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-cyber-900/90 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Temporal Awareness</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">F1 Score</th>
                <th className="p-3">ROC-AUC</th>
                <th className="p-3">False Pos Rate</th>
                <th className="p-3">MAE (+5m)</th>
                <th className="p-3">MAE (+15m)</th>
                <th className="p-3">MAE (+30m)</th>
                <th className="p-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {evaluations.map((model) => {
                const isWinner = model.modelName === 'Temporal Transformer';

                return (
                  <tr 
                    key={model.modelName} 
                    className={`hover:bg-white/5 transition-colors ${isWinner ? 'bg-cyan-950/20' : ''}`}
                  >
                    <td className="p-3 font-bold text-white flex items-center gap-1.5">
                      {model.modelName}
                      {isWinner && <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 font-normal">Active</span>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        model.temporalAware ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {model.temporalAware ? 'Temporal State' : 'Point-in-Time'}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{(model.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3">{(model.precision * 100).toFixed(1)}%</td>
                    <td className="p-3">{(model.recall * 100).toFixed(1)}%</td>
                    <td className="p-3 font-bold">{(model.f1Score * 100).toFixed(1)}%</td>
                    <td className="p-3 text-cyan-300 font-bold">{model.rocAuc.toFixed(3)}</td>
                    <td className="p-3 text-slate-400">{(model.falsePositiveRate * 100).toFixed(1)}%</td>
                    <td className="p-3 text-emerald-400">{model.forecastMae.h5m.toFixed(3)}</td>
                    <td className="p-3 text-emerald-400">{model.forecastMae.h15m.toFixed(3)}</td>
                    <td className="p-3 text-emerald-400">{model.forecastMae.h30m.toFixed(3)}</td>
                    <td className="p-3 text-slate-400">{model.inferenceLatencyMs} ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Cards: Strengths and Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {evaluations.map((m) => (
          <div key={m.modelName} className="glass-panel rounded-xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-sm font-bold text-white font-mono">{m.modelName}</h4>
              <span className="text-[10px] font-mono text-cyan-400">{m.inferenceLatencyMs}ms</span>
            </div>

            <p className="text-[11px] font-mono text-slate-400">{m.architecture}</p>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-cyber-900 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">Key Strengths</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{m.strengths}</p>
              </div>

              <div className="bg-cyber-900 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] text-rose-400 uppercase font-bold block">Limitations</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{m.limitations}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
