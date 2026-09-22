import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  CreditCard,
  MapPin,
  TrendingUp,
  Users,
  Network,
  GitFork,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface SupportingRecord {
  id: string;
  type: string;
  name: string;
}

interface AnomalyIndicator {
  id: string;
  indicatorClass: string;
  title: string;
  score: number;
  reason: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  confidence: number;
  supportingRecords: SupportingRecord[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  TELECOM_ANOMALY: <Radio className="w-4 h-4 text-purple-400" />,
  FINANCIAL_ANOMALY: <CreditCard className="w-4 h-4 text-emerald-400" />,
  GEOSPATIAL_ANOMALY: <MapPin className="w-4 h-4 text-red-400" />,
  BEHAVIORAL_SPIKE: <TrendingUp className="w-4 h-4 text-amber-400" />,
  RELATIONSHIP_ANOMALY: <Users className="w-4 h-4 text-blue-400" />,
  TOPOLOGICAL_CLUSTER: <Network className="w-4 h-4 text-indigo-400" />,
  STRUCTURAL_BRIDGE: <GitFork className="w-4 h-4 text-pink-400" />
};

export const AnomalyIndicatorsGrid: React.FC = () => {
  const [anomalies, setAnomalies] = useState<AnomalyIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/anomalies');
        if (res.ok) {
          const data = await res.json();
          setAnomalies(data.indicators || []);
        } else {
          throw new Error('Failed to fetch anomalies');
        }
      } catch (e) {
        // Fallback demo anomalies
        setAnomalies([
          {
            id: 'anom_001',
            indicatorClass: 'UNUSUAL_COMMUNICATION_FREQUENCY',
            title: 'Unusual Communication Frequency',
            score: 94,
            reason: 'Sudden burst of 48 encrypted & VoIP calls within 6 hours preceding cash transit van robbery between burner SIMs +91 98711 02934 and +91 99102 38472.',
            category: 'TELECOM_ANOMALY',
            severity: 'CRITICAL',
            timestamp: '2026-03-02T22:30:00Z',
            confidence: 96.2,
            supportingRecords: [
              { id: 'ph_001', type: 'Phone', name: '+91 98711 02934' },
              { id: 'ph_002', type: 'Phone', name: '+91 99102 38472' },
              { id: 'per_001', type: 'Person', name: 'Karan Malhotra' }
            ]
          },
          {
            id: 'anom_002',
            indicatorClass: 'UNUSUAL_TRANSACTION_ACTIVITY',
            title: 'Unusual Transaction Activity',
            score: 92,
            reason: 'Rapid structuring/layering: ₹1.45 Cr extortion payout split into 3 tranches under 35 minutes via HDFC-MULE-4819 to ICICI-MULE-9021 and P2P Crypto desk.',
            category: 'FINANCIAL_ANOMALY',
            severity: 'CRITICAL',
            timestamp: '2026-02-28T23:25:00Z',
            confidence: 98.4,
            supportingRecords: [
              { id: 'tx_001', type: 'Transaction', name: 'RTGS ₹65L' },
              { id: 'tx_002', type: 'Transaction', name: 'IMPS ₹40L' },
              { id: 'per_002', type: 'Person', name: 'Sameer Qureshi' }
            ]
          },
          {
            id: 'anom_003',
            indicatorClass: 'REPEATED_LOCATIONS',
            title: 'Repeated Locations Co-Presence',
            score: 87,
            reason: 'Geospatial co-location anomaly: 3 distinct suspects (Karan Malhotra, Sameer Qureshi, Iqbal Ansari) identified within 150m radius of Kurla warehouse within 48 hours.',
            category: 'GEOSPATIAL_ANOMALY',
            severity: 'HIGH',
            timestamp: '2026-02-25T14:15:00Z',
            confidence: 91.5,
            supportingRecords: [
              { id: 'loc_003', type: 'Location', name: 'Kurla Industrial Zone' },
              { id: 'per_001', type: 'Person', name: 'Karan Malhotra' },
              { id: 'per_004', type: 'Person', name: 'Iqbal Ansari' }
            ]
          },
          {
            id: 'anom_004',
            indicatorClass: 'SUDDEN_INCREASE_IN_ACTIVITY',
            title: 'Sudden Increase in Activity',
            score: 85,
            reason: 'Dormant burner SIM (+91 97182 99012) inactive for 42 days suddenly exhibited 34 outgoing calls and 8km movement along Ring Road on day of robbery.',
            category: 'BEHAVIORAL_SPIKE',
            severity: 'HIGH',
            timestamp: '2026-03-02T23:00:00Z',
            confidence: 89.8,
            supportingRecords: [
              { id: 'ph_004', type: 'Phone', name: '+91 97182 99012' },
              { id: 'veh_002', type: 'Vehicle', name: 'HR-26-CR-4412' }
            ]
          },
          {
            id: 'anom_005',
            indicatorClass: 'REPEATED_INTERACTIONS',
            title: 'Repeated Cross-Syndicate Interactions',
            score: 89,
            reason: 'Persistent cross-jurisdiction interactions: 64 calls logged between Central Delhi extortion cell and Mumbai narcotics clearinghouse despite claimed lack of prior acquaintance.',
            category: 'RELATIONSHIP_ANOMALY',
            severity: 'HIGH',
            timestamp: '2026-03-04T11:00:00Z',
            confidence: 94.7,
            supportingRecords: [
              { id: 'per_001', type: 'Person', name: 'Karan Malhotra' },
              { id: 'per_004', type: 'Person', name: 'Iqbal Ansari' }
            ]
          },
          {
            id: 'anom_006',
            indicatorClass: 'EMERGING_CLUSTERS',
            title: 'Emerging Network Clusters',
            score: 91,
            reason: 'Graph modularity shift: New high-density triad cluster formed between Apex FinTech escrow breach, Shadow Logistics freight routes, and offshore gateway Digital Pay Nexus.',
            category: 'TOPOLOGICAL_CLUSTER',
            severity: 'CRITICAL',
            timestamp: '2026-03-05T08:30:00Z',
            confidence: 93.1,
            supportingRecords: [
              { id: 'org_001', type: 'Organization', name: 'Shadow Logistics LLP' },
              { id: 'org_003', type: 'Organization', name: 'Digital Pay Nexus' }
            ]
          },
          {
            id: 'anom_007',
            indicatorClass: 'UNUSUAL_CONNECTIONS',
            title: 'Unusual Topological Connections',
            score: 83,
            reason: 'Counter-intuitive topological bridge: Direct corporate ownership link between legitimate freight firm (Shadow Logistics LLP) and darknet narcotics distribution channel.',
            category: 'STRUCTURAL_BRIDGE',
            severity: 'HIGH',
            timestamp: '2026-03-06T17:45:00Z',
            confidence: 90.3,
            supportingRecords: [
              { id: 'org_001', type: 'Organization', name: 'Shadow Logistics LLP' },
              { id: 'per_004', type: 'Person', name: 'Iqbal Ansari' }
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  const filteredAnomalies = anomalies.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || a.severity === selectedSeverity;
    return matchesCategory && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Multi-Source Anomaly Detection System (7 Analytical Classes)
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
            Algorithmic flags isolating non-random spikes across telecom, financial flows, and geospatial traces.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {['ALL', 'CRITICAL', 'HIGH'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                selectedSeverity === sev
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnomalies.map((anom) => (
          <div
            key={anom.id}
            className="astra-card p-4 flex flex-col justify-between border-t-2 border-t-blue-500 hover:border-t-red-500 transition-all space-y-3"
          >
            {/* Top Bar */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                    {CATEGORY_ICONS[anom.category] || <AlertTriangle className="w-4 h-4 text-blue-400" />}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">
                    {anom.category.replace('_', ' ')}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    anom.severity === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                  }`}
                >
                  {anom.severity}
                </span>
              </div>

              {/* Title & Score */}
              <div className="mt-2.5 flex items-center justify-between">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{anom.title}</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono font-bold text-red-400">{anom.score}/100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full ${
                    anom.score > 90 ? 'bg-red-500' : anom.score > 80 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${anom.score}%` }}
                />
              </div>

              {/* Analytical Reason */}
              <p className="mt-2.5 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {anom.reason}
              </p>
            </div>

            {/* Bottom Footer */}
            <div className="pt-2.5 border-t border-[var(--border-subtle)] space-y-2 text-[10px] font-mono">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[var(--text-muted)] text-[9px]">Supporting:</span>
                {anom.supportingRecords.map((rec, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-300 border border-slate-700 text-[9px]"
                  >
                    {rec.id} ({rec.type})
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{new Date(anom.timestamp).toLocaleDateString()} {new Date(anom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="text-emerald-400 font-bold">Conf: {anom.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
