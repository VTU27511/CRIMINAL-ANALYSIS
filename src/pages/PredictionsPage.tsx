import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Car,
  TrendingUp,
  UserX,
  Target,
  CheckCircle2,
  Sliders,
  Layers,
  Info,
  Radio,
  BarChart3,
  Network
} from 'lucide-react';
import { AnomalyIndicatorsGrid } from '../components/analytics/AnomalyIndicatorsGrid';

interface ContributingFactor {
  factor: string;
  weight: number;
  impact: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

interface RiskModel {
  id: string;
  modelType: string;
  title: string;
  riskScore: number;
  signalLevel: string;
  targetSector: string;
  peakWindow: string;
  crimeType: string;
  contributingFactors: ContributingFactor[];
  recommendedForce: string;
  analyticalNote: string;
}

export const PredictionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MODELS' | 'ANOMALIES' | 'WATCHLIST'>('MODELS');
  const [riskModels, setRiskModels] = useState<RiskModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/predictions/risk');
        if (res.ok) {
          const data = await res.json();
          setRiskModels(data.models || []);
        } else {
          throw new Error('Failed to fetch risk models');
        }
      } catch (e) {
        // Local fallback models
        setRiskModels([
          {
            id: 'rm_001',
            modelType: 'CRIME_HOTSPOT_RISK',
            title: 'Crime Hotspot Risk',
            riskScore: 88.4,
            signalLevel: 'Elevated Analytical Signal',
            targetSector: 'Ring Road - AIIMS & Safdarjung Transit Corridor',
            peakWindow: '23:00 - 03:30 hrs',
            crimeType: 'Night Highway Robbery / Cash Van Interception',
            contributingFactors: [
              { factor: 'Interstate Escape Route Access (NH-48 / Haryana Border)', weight: 34, impact: 'CRITICAL' },
              { factor: 'Dim Lighting & Underpass Surveillance Blindspots', weight: 28, impact: 'HIGH' },
              { factor: 'Late-Night Cash Transit Logistics Volume Surge', weight: 24, impact: 'HIGH' },
              { factor: 'Historical Seasonal Incident Velocity Trend', weight: 14, impact: 'MODERATE' }
            ],
            recommendedForce: '2 PCR Interceptor Cruisers + 1 Automated ANPR Checkpoint',
            analyticalNote: 'High density of transit vehicles with reduced visibility creates opportunistic attack corridor.'
          },
          {
            id: 'rm_002',
            modelType: 'EMERGING_NETWORK_RISK',
            title: 'Emerging Network Risk',
            riskScore: 92.1,
            signalLevel: 'Critical Analytical Signal',
            targetSector: 'Delhi NCR ↔ Mumbai BKC Interstate Triad',
            peakWindow: 'Active 24/7 Syndicate Expansion',
            crimeType: 'Organized Cross-Jurisdiction Cyber-Narcotics Nexus',
            contributingFactors: [
              { factor: 'Shared Multi-Tier Mule Bank Accounts (HDFC & ICICI)', weight: 38, impact: 'CRITICAL' },
              { factor: 'Synchronized VoIP Ping Exchanges Across State Lines', weight: 31, impact: 'HIGH' },
              { factor: 'Cross-State Transit of Staged Commercial Vehicles', weight: 19, impact: 'MODERATE' },
              { factor: 'Common Nominee Directorships in Front Entities', weight: 12, impact: 'MODERATE' }
            ],
            recommendedForce: 'Joint CID & Cyber Special Cell Interrogation Task Force',
            analyticalNote: 'Syndicate consolidating financial laundering infrastructure with physical narcotics logistics.'
          },
          {
            id: 'rm_003',
            modelType: 'UNUSUAL_ACTIVITY_RISK',
            title: 'Unusual Activity Risk',
            riskScore: 86.5,
            signalLevel: 'Elevated Analytical Signal',
            targetSector: 'Digital Financial Gateways & Shadow Accounts',
            peakWindow: 'Post-Incident Smurfing (0 - 48 hours)',
            crimeType: 'High-Velocity Money Dispersion & Crypto Off-Ramping',
            contributingFactors: [
              { factor: 'Multiple Sub-Threshold Transaction Bursts (< ₹50L each)', weight: 42, impact: 'CRITICAL' },
              { factor: 'Rapid IMEI / Handset Swaps on Suspect Cellular Nodes', weight: 26, impact: 'HIGH' },
              { factor: 'Geofence Boundary Crossings Outside Operational Baseline', weight: 20, impact: 'MODERATE' },
              { factor: 'Unregistered Vehicle ANPR Sightings Near Transit Hubs', weight: 12, impact: 'MODERATE' }
            ],
            recommendedForce: 'Issue Immediate Section 94 BNSS Account Freeze Directives',
            analyticalNote: 'Smurfing pattern suggests imminent offshore extraction of extortion proceeds.'
          },
          {
            id: 'rm_004',
            modelType: 'REPEATED_INCIDENT_RISK',
            title: 'Repeated-Incident Risk (Modus Operandi Recurrence)',
            riskScore: 78.9,
            signalLevel: 'Moderate-High Analytical Signal',
            targetSector: 'Commercial Logistics Corridors & Night Transit',
            peakWindow: 'Bi-Weekly Modus Operandi Recurrence Cycle',
            crimeType: 'Tactical Vulnerability Exploitation & Recurrent MO',
            contributingFactors: [
              { factor: 'Unmarked Logistics Target Profile Consistency', weight: 35, impact: 'HIGH' },
              { factor: 'Identical Vehicular Escape Vector Utilization (NH-48)', weight: 29, impact: 'HIGH' },
              { factor: 'Firearm & RF Jammer Tactical Signature Similarity', weight: 22, impact: 'MODERATE' },
              { factor: 'Shift-Change Timing Exploitation (Police Post Rotation)', weight: 14, impact: 'MODERATE' }
            ],
            recommendedForce: 'Randomized Patrol Scheduling & Frequency-Hopped Logistics Telemetry',
            analyticalNote: 'Focuses exclusively on tactical MO patterns and geographical vulnerabilities without asserting individual culpability.'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const recidivismWatchlist = [
    {
      name: 'Karan Malhotra @ Tiger',
      id: 'per_001',
      score: 94,
      crimeType: 'Organized Extortion & Cyber Fraud',
      lastLocation: 'Rohini Sector 14 / Central Delhi',
      status: 'ABSCONDING',
      flightRisk: 'CRITICAL'
    },
    {
      name: 'Vikky Pehelwan',
      id: 'per_004_v',
      score: 88,
      crimeType: 'Armed Dacoity & Highway Robbery',
      lastLocation: 'Gurgaon-Delhi Border Toll',
      status: 'ACTIVE_SURVEILLANCE',
      flightRisk: 'HIGH'
    },
    {
      name: 'Sameer Qureshi @ Banker',
      id: 'per_002',
      score: 79,
      crimeType: 'Mule Account Hawala Distribution',
      lastLocation: 'Jafrabad, North East Delhi',
      status: 'BAIL_MONITORED',
      flightRisk: 'MEDIUM'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="astra-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)]">
              EXPLAINABLE AI ENGINE
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              PREDICTIVE POLICING & RISK INDICATOR DASHBOARD
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
            AI Crime Risk Radar & Anomaly Detection System
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Explainable predictive intelligence isolating spatio-temporal hotspots, emerging network triads, and 7 analytical anomaly classes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('MODELS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
              activeTab === 'MODELS'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Risk Models (4)</span>
          </button>
          <button
            onClick={() => setActiveTab('ANOMALIES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
              activeTab === 'ANOMALIES'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Anomalies (7)</span>
          </button>
          <button
            onClick={() => setActiveTab('WATCHLIST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
              activeTab === 'WATCHLIST'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Tactical Radar</span>
          </button>
        </div>
      </div>

      {/* Ethical & Legal Presumption of Innocence Banner */}
      <div className="p-3.5 rounded-xl border border-[var(--border-strong)] bg-[var(--accent-badge-bg)] text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-300 uppercase tracking-wide text-[11px] block">
            Statutory Compliance & Presumption of Innocence Notice (BNSS / Constitution of India)
          </span>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            In strict compliance with constitutional safeguards and the Bharatiya Nagarik Suraksha Sanhita (BNSS), all predictive scores represent <strong>non-judgmental analytical signals</strong> and <strong>investigative leads</strong> designed for patrol optimization and tactical resource allocation. They do NOT constitute proof of guilt, nor do they predict individual human behavior. Presumption of innocence applies unconditionally.
          </p>
        </div>
      </div>

      {/* Tab 1: 4 Explainable Risk Models */}
      {activeTab === 'MODELS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskModels.map((model) => (
              <div
                key={model.id}
                className="astra-card p-5 space-y-4 border-t-4 border-t-blue-500 flex flex-col justify-between"
              >
                <div>
                  {/* Model Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {model.modelType}
                      </span>
                      <h3 className="text-base font-bold text-[var(--text-primary)] mt-1.5">
                        {model.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-mono font-black text-red-400">
                        {model.riskScore}%
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                        ANALYTICAL SIGNAL
                      </span>
                    </div>
                  </div>

                  {/* Target Sector & Crime Type */}
                  <div className="mt-3 p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1 text-xs font-mono">
                    <div className="text-[var(--text-primary)] font-semibold flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-red-400" />
                      <span>{model.targetSector}</span>
                    </div>
                    <div className="text-blue-400 text-[11px]">{model.crimeType}</div>
                    <div className="text-[var(--text-muted)] text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Peak Risk Window: <b>{model.peakWindow}</b></span>
                    </div>
                  </div>

                  {/* Contributing Factors with Weight Bars */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                      <span className="font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-blue-400" /> Explainable Contributing Factors:
                      </span>
                      <span>Weight Impact</span>
                    </div>

                    <div className="space-y-2">
                      {model.contributingFactors.map((factor, fIdx) => (
                        <div key={fIdx} className="space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[var(--text-secondary)]">{factor.factor}</span>
                            <span
                              className={`font-bold ${
                                factor.impact === 'CRITICAL'
                                  ? 'text-red-400'
                                  : factor.impact === 'HIGH'
                                  ? 'text-orange-400'
                                  : 'text-blue-400'
                              }`}
                            >
                              {factor.weight}% ({factor.impact})
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                factor.impact === 'CRITICAL'
                                  ? 'bg-red-500'
                                  : factor.impact === 'HIGH'
                                  ? 'bg-orange-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${factor.weight * 2.2}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analytical Rationale Note */}
                  <p className="mt-3 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-main)]/50 p-2 rounded border border-[var(--border-subtle)] italic">
                    💡 <strong>Investigative Rationale</strong>: {model.analyticalNote}
                  </p>
                </div>

                {/* Tactical Action Directive */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  <div className="p-2.5 rounded bg-[var(--accent-badge-bg)] border border-[var(--accent-badge-border)] text-[11px]">
                    <span className="font-bold text-[var(--text-primary)] block mb-0.5 font-mono text-[10px] uppercase">
                      Recommended Resource Deployment:
                    </span>
                    <span className="text-[var(--text-primary)] font-mono text-[11px]">{model.recommendedForce}</span>
                  </div>

                  <button
                    onClick={() => alert(`Preemptive tactical directive dispatched for ${model.targetSector}`)}
                    className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Issue Patrol Directive</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 7 Analytical Anomaly Indicators */}
      {activeTab === 'ANOMALIES' && (
        <AnomalyIndicatorsGrid />
      )}

      {/* Tab 3: Tactical Recidivism Radar */}
      {activeTab === 'WATCHLIST' && (
        <div className="astra-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Recurrent Modus Operandi & High-Flight Watchlist
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Algorithmic index based on bail compliance & syndicate proximity
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase text-[var(--text-muted)]">
                  <th className="pb-2">Suspect Dossier</th>
                  <th className="pb-2">Recidivism Index</th>
                  <th className="pb-2">Primary Offence Category</th>
                  <th className="pb-2">Last Known Geospatial Fix</th>
                  <th className="pb-2">Flight Risk</th>
                  <th className="pb-2">Surveillance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {recidivismWatchlist.map((suspect, idx) => (
                  <tr key={idx} className="hover:bg-blue-500/5 transition-colors">
                    <td className="py-3 font-semibold text-[var(--text-primary)]">
                      <div>{suspect.name}</div>
                      <span className="text-[10px] font-mono text-blue-400">{suspect.id}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-400">{suspect.score}/100</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-700/30 overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: `${suspect.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">{suspect.crimeType}</td>
                    <td className="py-3 text-[var(--text-secondary)] font-mono">{suspect.lastLocation}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          suspect.flightRisk === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : suspect.flightRisk === 'HIGH'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {suspect.flightRisk}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-blue-400 font-semibold">
                      {suspect.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
