import React, { useState } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  Server, 
  ArrowRight, 
  Eye, 
  X,
  FileText,
  Activity
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { mockApiService } from '../../services/mockApi';
import { SocAlert } from '../../types/alert';

export const AlertCenterView: React.FC = () => {
  const { 
    acknowledgedAlertIds, 
    acknowledgeAlert, 
    quarantineHost,
    setSelectedHost,
    isDemoMode 
  } = useCyberPredict();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [investigatingAlert, setInvestigatingAlert] = useState<SocAlert | null>(null);
  const [timelineAlert, setTimelineAlert] = useState<SocAlert | null>(null);

  const rawAlerts = mockApiService.getAlerts();

  const alerts = rawAlerts.map(a => ({
    ...a,
    status: acknowledgedAlertIds.includes(a.id) ? ('acknowledged' as const) : a.status
  }));

  const filteredAlerts = severityFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.severity === severityFilter);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-950 text-red-300 border-red-800';
      case 'high': return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'medium': return 'bg-amber-950 text-amber-300 border-amber-800';
      default: return 'bg-cyan-950 text-cyan-300 border-cyan-800';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono tracking-wide">
              SOC Predictive Alert Center
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Active Triage Feed
            </span>
            {isDemoMode && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                SYNTHETIC ALERTS
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Prioritized notifications generated when temporal state vectors indicate high probability of attack stage progression
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-1 bg-cyber-850 p-1 rounded-lg border border-white/10 text-xs font-mono">
          {['all', 'critical', 'high', 'medium'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded uppercase text-[10px] transition-colors ${
                severityFilter === sev 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isAck = alert.status === 'acknowledged';

          return (
            <div 
              key={alert.id}
              className={`rounded-xl p-4 border transition-all ${
                isAck 
                  ? 'bg-cyber-950/40 border-white/5 opacity-75' 
                  : alert.severity === 'critical'
                  ? 'bg-red-950/20 border-red-500/50 shadow-glow-red/20'
                  : alert.severity === 'high'
                  ? 'bg-orange-950/20 border-orange-500/40'
                  : 'bg-cyber-900/60 border-white/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">ID: {alert.id}</span>
                  <span className="text-xs font-mono text-slate-500">• {alert.timestamp}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400">Affected Host:</span>
                  <strong className="text-white">{alert.affectedHostName}</strong>
                  <span className="text-slate-400 font-mono">({alert.affectedHostIp})</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="my-2">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-1 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Progression Transition Bar */}
              <div className="my-3 p-2.5 rounded-lg bg-cyber-950/80 border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">Current Stage:</span>
                  <span className="text-blue-300 font-bold">{alert.currentStage}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-400">Predicted Stage:</span>
                  <span className="text-cyan-300 font-bold">{alert.predictedStage}</span>
                  <span className="text-[10px] text-cyan-400">({alert.progressionProbabilityPercent}% prob)</span>
                </div>

                {alert.mitreTechniqueId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-800 text-slate-300 border border-white/10">
                    MITRE: {alert.mitreTechniqueId}
                  </span>
                )}
              </div>

              {/* Investigation rationale & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                <div className="text-xs font-mono text-slate-400 max-w-xl truncate">
                  <span className="text-slate-300 font-bold">Investigation: </span>
                  {alert.recommendedInvestigation}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Timeline Button */}
                  <button
                    onClick={() => setTimelineAlert(alert)}
                    className="px-2.5 py-1.5 rounded bg-cyber-850 hover:bg-cyber-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center space-x-1 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>View Timeline</span>
                  </button>

                  {/* Investigate Button */}
                  <button
                    onClick={() => setInvestigatingAlert(alert)}
                    className="px-2.5 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center space-x-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </button>

                  {/* Acknowledge Button */}
                  {isAck ? (
                    <span className="px-2.5 py-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledged</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1.5 rounded bg-cyber-800 hover:bg-cyber-700 text-white border border-white/20 text-xs font-mono flex items-center space-x-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investigate Modal */}
      {investigatingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl max-w-xl w-full p-6 border border-cyan-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Investigate Alert: {investigatingAlert.id}
                </span>
                <h3 className="text-base font-bold text-white font-mono">{investigatingAlert.title}</h3>
              </div>
              <button 
                onClick={() => setInvestigatingAlert(null)}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-cyber-850 p-3 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Target:</span>
                  <span className="text-white font-bold">{investigatingAlert.affectedHostName} ({investigatingAlert.affectedHostIp})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kill Chain Progression:</span>
                  <span className="text-cyan-300 font-bold">{investigatingAlert.currentStage} → {investigatingAlert.predictedStage}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Telemetry Evidence Features</span>
                <div className="space-y-1 bg-cyber-950 p-3 rounded-lg border border-white/5">
                  {investigatingAlert.evidenceFeatures.map((ev, i) => (
                    <div key={i} className="flex justify-between text-slate-300">
                      <span>{ev.name}:</span>
                      <span className="text-red-400 font-bold">{ev.value} (Limit: {ev.threshold})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Recommended Forensic Playbook</span>
                <p className="text-slate-300 leading-relaxed bg-cyber-950 p-3 rounded-lg border border-white/5">
                  {investigatingAlert.recommendedInvestigation}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  quarantineHost(investigatingAlert.affectedHostId);
                  setInvestigatingAlert(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors shadow-glow-red"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Quarantine {investigatingAlert.affectedHostName}</span>
              </button>
              <button
                onClick={() => setInvestigatingAlert(null)}
                className="px-4 py-2 rounded-lg bg-cyber-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {timelineAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-cyan-500/40 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Temporal Incident Timeline: {timelineAlert.id}
              </h3>
              <button onClick={() => setTimelineAlert(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-cyan-500/40 my-3">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="text-[10px] text-slate-400">19:35:00 (T - 10m)</span>
                <p className="text-slate-200 font-semibold">Initial TCP SYN probes observed on perimeter gateway</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span className="text-[10px] text-slate-400">19:42:15 (T - 3m)</span>
                <p className="text-slate-200 font-semibold">Abnormal internal ARP and SMB sweep detected from Host-01</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[10px] text-red-400 font-bold">{timelineAlert.timestamp} (Current T=0)</span>
                <p className="text-white font-bold">{timelineAlert.title}</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] text-cyan-400 font-bold">19:55:00 (T + 10m Forecast)</span>
                <p className="text-cyan-300 font-semibold">Predicted pivot to {timelineAlert.predictedStage} across adjacent servers</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setTimelineAlert(null)}
                className="px-4 py-2 rounded-lg bg-cyber-800 text-slate-300 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
