import React, { useState } from 'react';
import { 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Brain
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const ShapExplainabilityView: React.FC = () => {
  const { currentScenario, isDemoMode } = useCyberPredict();
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('f1');
  const features = mockApiService.getExplainabilityFeatures();

  const selectedFeature = features.find(f => f.id === selectedFeatureId) || features[0];

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              Explainable AI (XAI): Why did the model make this prediction?
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              SHAP / Integrated Gradients
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SIMULATED ATTRIBUTIONS
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Feature attributions showing which continuous network metrics pushed the risk score higher or lower
          </p>
        </div>

        {/* Global baseline comparison indicator */}
        <div className="px-3 py-1 rounded bg-cyber-850 border border-white/10 text-xs font-mono text-slate-300">
          Baseline Network Anomaly E[f(x)] = <span className="text-cyan-400 font-bold">12.4%</span>
        </div>
      </div>

      {/* Main Grid: SHAP Bars on Left, Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: SHAP Horizontal Contribution Bars */}
        <div className="lg:col-span-2 bg-cyber-950/70 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-2">
            <span>Feature Name & Current Observed Telemetry</span>
            <span>SHAP Impact on Forecast Risk</span>
          </div>

          <div className="space-y-3">
            {features.map((feat) => {
              const isSelected = feat.id === selectedFeatureId;
              const isPositive = feat.direction === 'increases_risk';

              return (
                <div 
                  key={feat.id}
                  onClick={() => setSelectedFeatureId(feat.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan/20' 
                      : 'bg-cyber-900/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 font-bold">#{feat.importanceRank}</span>
                      <span className="text-white font-semibold">{feat.humanName}</span>
                      <span className="text-[10px] text-slate-400">({feat.featureValue})</span>
                    </div>

                    <div className="flex items-center space-x-1.5 font-bold">
                      {isPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className={isPositive ? 'text-red-400' : 'text-emerald-400'}>
                        {isPositive ? `+${feat.contributionPercent}%` : `-${feat.contributionPercent}%`}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-cyber-800 rounded-full h-2 overflow-hidden flex items-center">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(100, feat.contributionPercent * 2.8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Deep Feature Explanation Inspector */}
        <div className="bg-cyber-900/80 p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <span className="text-xs font-mono uppercase text-slate-400">Feature Drilldown</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                selectedFeature.direction === 'increases_risk' 
                  ? 'bg-red-950 text-red-300 border-red-800' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {selectedFeature.direction === 'increases_risk' ? 'Increases Predicted Risk' : 'Decreases Predicted Risk'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white font-mono">{selectedFeature.humanName}</h4>
            <p className="text-[11px] font-mono text-cyan-400 mt-0.5">{selectedFeature.featureName}</p>

            <div className="my-3 p-3 rounded-lg bg-cyber-850 border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Observed Value:</span>
                <span className="text-white font-bold">{selectedFeature.featureValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SHAP Attrib φ:</span>
                <span className={`font-bold ${selectedFeature.shapValue > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedFeature.shapValue > 0 ? `+${selectedFeature.shapValue}` : selectedFeature.shapValue}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Relative Weight:</span>
                <span className="text-white">{selectedFeature.contributionPercent}% of decision</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Analyst Interpretation</span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-cyber-950/60 p-3 rounded-lg border border-white/5">
                {selectedFeature.explanation}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-500">
            Computed via KernelSHAP background sampling over 10,000 normal traffic flows.
          </div>
        </div>
      </div>
    </div>
  );
};
