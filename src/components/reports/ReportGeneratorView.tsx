import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Server, 
  TrendingUp, 
  Cpu,
  Info
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';

export const ReportGeneratorView: React.FC = () => {
  const { currentScenario, isDemoMode } = useCyberPredict();
  const topology = mockApiService.getNetworkTopology();
  const features = mockApiService.getExplainabilityFeatures();
  const recommendations = mockApiService.getDefensiveRecommendations();

  const handlePrint = () => {
    window.print();
  };

  const exportJson = () => {
    const reportData = {
      platform: "CyberPredict AI - Predictive Network Defense",
      reportGeneratedAt: new Date().toISOString(),
      reportClassification: "RESTRICTED / SOC INTERNAL USE",
      executiveSummary: {
        currentRiskScore: currentScenario.currentRiskScore,
        currentStage: currentScenario.stageName,
        predictedNextStage: currentScenario.predictedStage,
        forecastConfidence: currentScenario.forecastConfidence,
        summary: currentScenario.summaryNote
      },
      affectedHosts: topology.nodes.filter(n => n.status !== 'normal').map(n => ({
        id: n.id,
        name: n.name,
        ip: n.ip,
        status: n.status,
        risk: n.riskScore
      })),
      topFeatures: features.slice(0, 5).map(f => ({
        feature: f.humanName,
        value: f.featureValue,
        contributionPercent: f.contributionPercent,
        direction: f.direction
      })),
      mitreTactic: currentScenario.mitreTactic,
      recommendations: recommendations.map(r => ({
        title: r.title,
        priority: r.priority,
        target: r.affectedHost,
        action: r.recommendedCommandOrStep
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `cyberpredict_soc_report_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-6">
      {/* Header and Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              Automated SOC Intelligence & Forecast Report
            </h3>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SYNTHETIC REPORT DATA
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Compiled executive briefing and technical telemetry audit for security analysts and CISO briefings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportJson}
            className="px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-cyber-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors shadow-glow-cyan"
          >
            <Printer className="w-4 h-4 text-cyber-950 font-bold" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Report Container */}
      <div className="bg-cyber-950/90 rounded-xl p-6 border border-white/10 space-y-6 text-xs font-mono shadow-inner print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Metadata Banner */}
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              CONFIDENTIAL / SOC INTERNAL INCIDENT BRIEFING
            </span>
            <h2 className="text-lg font-black text-white font-mono mt-1">
              CYBERPREDICT AI: NETWORK ATTACK FORECAST AUDIT
            </h2>
          </div>
          <div className="text-right text-slate-400 text-[11px] space-y-0.5">
            <p>Generated: <strong className="text-white">{new Date().toLocaleString()}</strong></p>
            <p>Model Engine: <span className="text-cyan-400 font-bold">Temporal Transformer v2.1</span></p>
            <p>Incident Ref: <span className="text-slate-300">CP-2024-SIH-984</span></p>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-white/5 pb-1">
            1. Executive Summary
          </h4>
          <p className="text-slate-300 leading-relaxed">
            The CyberPredict AI world model has detected anomalous multi-step network behavior indicating active progression within the kill chain. The network is currently evaluated at <strong className="text-red-400">{currentScenario.currentRiskScore}% Risk</strong> in the <strong className="text-white">{currentScenario.stageName}</strong> stage ({currentScenario.mitreTactic}). Autoregressive rollout across rolling 5-minute intervals forecasts a transition into <strong className="text-cyan-300">{currentScenario.predictedStage}</strong> within the next <strong className="text-cyan-300">10–15 minutes</strong> with <strong className="text-white">{currentScenario.forecastConfidence}% confidence</strong>.
          </p>
          <div className="p-3 rounded-lg bg-cyber-900 border border-white/5 text-slate-300 italic">
            "{currentScenario.summaryNote}"
          </div>
        </div>

        {/* Section 2: Key Risk Metrics Table */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-white/5 pb-1">
            2. Forecast & Threat Metrics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded bg-cyber-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">Current Threat Risk</span>
              <span className="text-xl font-bold text-red-400">{currentScenario.currentRiskScore}%</span>
            </div>
            <div className="p-2.5 rounded bg-cyber-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">Observed Stage</span>
              <span className="text-base font-bold text-white truncate">{currentScenario.stageName}</span>
            </div>
            <div className="p-2.5 rounded bg-cyber-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">Predicted Next Stage</span>
              <span className="text-base font-bold text-cyan-400 truncate">{currentScenario.predictedStage}</span>
            </div>
            <div className="p-2.5 rounded bg-cyber-900 border border-white/5">
              <span className="text-slate-400 text-[10px] block">Forecast Confidence</span>
              <span className="text-xl font-bold text-white">{currentScenario.forecastConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Potentially Affected Hosts */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-white/5 pb-1">
            3. Potentially Affected Nodes & Targets
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-1.5">Host Name</th>
                  <th className="py-1.5">IP Address</th>
                  <th className="py-1.5">Status</th>
                  <th className="py-1.5">Risk</th>
                  <th className="py-1.5">Current Behavioral State</th>
                  <th className="py-1.5">Predicted Next State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {topology.nodes.filter(n => n.status !== 'normal').map(n => (
                  <tr key={n.id}>
                    <td className="py-1.5 font-bold text-white">{n.name}</td>
                    <td className="py-1.5 text-slate-400">{n.ip}</td>
                    <td className="py-1.5 uppercase font-bold text-[10px]">
                      <span className={n.status === 'suspicious' ? 'text-red-400' : 'text-purple-400'}>
                        {n.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-1.5 font-bold">{n.riskScore}%</td>
                    <td className="py-1.5 text-slate-300 truncate max-w-xs">{n.currentState}</td>
                    <td className="py-1.5 text-cyan-300 truncate max-w-xs">{n.predictedState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Explainability & Drivers */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-white/5 pb-1">
            4. Primary Feature Drivers (Explainable AI Attribution)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.slice(0, 4).map(f => (
              <div key={f.id} className="p-2 rounded bg-cyber-900 border border-white/5 flex justify-between items-center">
                <div>
                  <strong className="text-white block">{f.humanName}</strong>
                  <span className="text-[10px] text-slate-400">Telemetry: {f.featureValue}</span>
                </div>
                <span className="text-red-400 font-bold">+{f.contributionPercent}% Risk</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Prescriptive Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-white/5 pb-1">
            5. Recommended Defensive Mitigations
          </h4>
          <div className="space-y-2">
            {recommendations.map(r => (
              <div key={r.id} className="p-2.5 rounded bg-cyber-900 border border-white/5 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <strong className="text-white">{r.title}</strong>
                  <p className="text-[11px] text-slate-400">{r.reason}</p>
                </div>
                <span className="text-emerald-400 font-bold">Est. -{r.riskReductionEstimatePercent}% Risk</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
