import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  UploadCloud,
  Share2,
  Bot,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  Network,
  ShieldAlert,
  BarChart3,
  Layers,
  ChevronRight
} from 'lucide-react';
import { FIR, Investigation, CrimeHotspot } from '../../types/crime';
import { databaseService } from '../../services/database/adapter';

interface SeniorOfficialDashboardProps {
  firs: FIR[];
  investigations: Investigation[];
  hotspots: CrimeHotspot[];
}

export const SeniorOfficialDashboard: React.FC<SeniorOfficialDashboardProps> = ({
  firs,
  investigations,
  hotspots
}) => {
  const [officers, setOfficers] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        const [offRes, anomRes] = await Promise.all([
          fetch('http://localhost:8000/api/officers'),
          fetch('http://localhost:8000/api/anomalies')
        ]);
        if (offRes.ok) {
          const offData = await offRes.json();
          setOfficers(offData);
        }
        if (anomRes.ok) {
          const anomData = await anomRes.json();
          setAnomalies(anomData.indicators || []);
        }
      } catch (e) {
        console.warn('Fallback executive data load:', e);
      }
    };
    fetchExtraData();
  }, []);

  const totalCases = firs.length + 482;
  const solvedCases = 398;
  const clearanceRate = 82.5;

  // Monthly Crime Trend Data
  const monthlyTrends = [
    { month: 'Oct 2025', count: 42, clearance: 78 },
    { month: 'Nov 2025', count: 54, clearance: 80 },
    { month: 'Dec 2025', count: 68, clearance: 79 },
    { month: 'Jan 2026', count: 61, clearance: 84 },
    { month: 'Feb 2026', count: 75, clearance: 82 },
    { month: 'Mar 2026', count: 88, clearance: 85 }
  ];

  // High Centrality Syndicate Nodes
  const centralityActors = [
    { id: 'per_001', name: 'Karan Malhotra @ Tiger', role: 'Operational Hub', degree: 6, betweenness: 0.720, risk: 'CRITICAL' },
    { id: 'per_002', name: 'Sameer Qureshi @ Banker', role: 'Cluster Bridge Actor', degree: 5, betweenness: 0.784, risk: 'HIGH' },
    { id: 'per_004', name: 'Iqbal Ansari @ Bhaijaan', role: 'Syndicate Kingpin', degree: 5, betweenness: 0.810, risk: 'CRITICAL' },
    { id: 'org_001', name: 'Shadow Logistics LLP', role: 'Corporate Conduit', degree: 4, betweenness: 0.650, risk: 'CRITICAL' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total FIRs */}
        <div className="astra-card p-4 flex items-center justify-between border-t-2 border-t-slate-900 dark:border-t-white">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Jurisdictional FIRs
            </p>
            <p className="text-2xl font-black font-mono mt-1 text-[var(--text-primary)]">
              {totalCases}
            </p>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
              +14% intake clearance
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[var(--accent-badge-bg)] text-[var(--text-primary)] border border-[var(--border-strong)] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Clearance Rate */}
        <div className="astra-card p-4 flex items-center justify-between border-t-2 border-t-emerald-500">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Clearance Velocity
            </p>
            <p className="text-2xl font-black font-mono mt-1 text-emerald-500">
              {clearanceRate}%
            </p>
            <span className="text-[10px] text-[var(--text-secondary)] font-semibold mt-0.5">
              {solvedCases} chargesheeted
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Active Investigations */}
        <div className="astra-card p-4 flex items-center justify-between border-t-2 border-t-amber-500">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Active Interrogations
            </p>
            <p className="text-2xl font-black font-mono mt-1 text-[var(--text-primary)]">
              {investigations.length + 38}
            </p>
            <span className="text-[10px] text-amber-500 font-semibold mt-0.5">
              2 P0 Critical Priority
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Monitored Hotspots */}
        <div className="astra-card p-4 flex items-center justify-between border-t-2 border-t-red-500">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Critical Hotspots
            </p>
            <p className="text-2xl font-black font-mono mt-1 text-red-400">
              {hotspots.length} Sectors
            </p>
            <span className="text-[10px] text-red-400 font-semibold mt-0.5">
              AIIMS & BKC Flagged
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Row 2: Crime Trends Chart & Network Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Trends Chart */}
        <div className="lg:col-span-2 astra-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  State-Wide Crime Trend & Clearance Velocity (Oct 2025 - Mar 2026)
                </h3>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Monthly incident volume cross-correlated with chargesheet filing rate
              </p>
            </div>
            <Link
              to="/crime-analytics"
              className="text-xs font-bold text-[var(--text-primary)] hover:underline flex items-center gap-1 font-mono"
            >
              <span>Deep Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Visual Trend Bars - High Contrast & Clearly Visible */}
          <div className="space-y-3 pt-2">
            {monthlyTrends.map((t, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-2 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-primary)] text-xs">{t.month}</span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      ({t.count} Cases Ingested)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Velocity:</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-mono">
                      {t.clearance}% Cleared
                    </span>
                  </div>
                </div>

                {/* Clear Full-Width Progress Track */}
                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative border border-slate-300/60 dark:border-slate-700/60 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${t.clearance}%` }}
                  >
                    <span className="text-[9px] font-bold text-slate-950 font-mono drop-shadow-sm">
                      {t.clearance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Network Clusters & Top Bridges */}
        <div className="astra-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Network Clusters
                </h3>
              </div>
              <Link
                to="/network"
                className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Spider Web
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Cluster Alpha: Delhi Cyber-Extortion
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)]">
                    6 Nodes
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  ED impersonation ring, mule account dispatch, and Connaught Place extortion.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Cluster Beta: Mumbai Contraband Conduit
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400">
                    8 Nodes
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  BKC synthetic opioids, Shadow Logistics freight trucking, and dead drops.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)]">
            <Link
              to="/network"
              className="w-full py-2 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Launch Full Spider-Web Analysis</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: High Centrality Entities & Top Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Centrality Entities */}
        <div className="astra-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                High-Centrality Syndicate Entities
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              Ranked by Betweenness Centrality
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] uppercase">
                  <th className="pb-2">Suspect Entity</th>
                  <th className="pb-2">Syndicate Role</th>
                  <th className="pb-2">Degree</th>
                  <th className="pb-2">Betweenness</th>
                  <th className="pb-2 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {centralityActors.map((actor) => (
                  <tr key={actor.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                    <td className="py-2.5 font-sans font-semibold text-[var(--text-primary)]">
                      <div>{actor.name}</div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{actor.id}</span>
                    </td>
                    <td className="py-2.5 text-[var(--text-secondary)]">{actor.role}</td>
                    <td className="py-2.5 font-bold text-[var(--text-primary)]">{actor.degree} ties</td>
                    <td className="py-2.5 font-bold text-amber-400">{actor.betweenness}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {actor.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Hotspots */}
        <div className="astra-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Top Critical Hotspots & Density Ranking
              </h3>
            </div>
            <Link to="/hotspots" className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Interactive Map
            </Link>
          </div>

          <div className="space-y-3">
            {hotspots.slice(0, 3).map((hs, idx) => (
              <div
                key={hs.id}
                className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {hs.name}
                    </span>
                    <span className="text-[9px] font-mono text-[var(--text-muted)]">
                      ({hs.city})
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono block mt-0.5">
                    {hs.primaryCrimes.slice(0, 2).join(', ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-red-400 block">
                    {hs.densityScore}/100
                  </span>
                  <span className="text-[9px] font-mono uppercase text-[var(--text-muted)]">
                    Density Rank #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Officer Workload & Clearance Velocity */}
      <div className="astra-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Officer Workload & Clearance Velocity Roster
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile?role=SENIOR_OFFICIAL" className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View Sr. Officer Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/officers" className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Full Officer Roster
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase text-[var(--text-muted)]">
                <th className="pb-2">Officer Name & Badge</th>
                <th className="pb-2">Designation & Department</th>
                <th className="pb-2">Assigned Cases</th>
                <th className="pb-2">Solved / Chargesheeted</th>
                <th className="pb-2">Clearance Velocity</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {officers.map((off) => (
                <tr key={off.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                  <td className="py-3 font-semibold text-[var(--text-primary)]">
                    <Link
                      to={`/profile?id=${off.id || (off.role === 'SENIOR_OFFICIAL' ? 'off_001' : 'off_002')}`}
                      className="hover:underline transition-colors"
                    >
                      {off.name}
                    </Link>
                    <div className="text-[10px] font-mono text-[var(--text-muted)]">{off.badgeNumber || off.officerId}</div>
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    <div>{off.designation}</div>
                    <span className="text-[10px] text-[var(--text-muted)]">{off.department}</span>
                  </td>
                  <td className="py-3 font-mono font-bold text-[var(--text-primary)]">
                    {off.casesAssigned} active
                  </td>
                  <td className="py-3 font-mono text-emerald-400 font-bold">
                    {off.casesSolved} solved
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {off.clearanceRate}%
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${off.clearanceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {off.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/profile?id=${off.id || (off.role === 'SENIOR_OFFICIAL' ? 'off_001' : 'off_002')}`}
                      className="px-2.5 py-1 rounded border border-[var(--border-strong)] bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] text-[11px] font-mono transition-colors"
                    >
                      Open Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
