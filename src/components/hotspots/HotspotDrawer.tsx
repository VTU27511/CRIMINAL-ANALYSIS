import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  AlertTriangle,
  FileText,
  Clock,
  TrendingUp,
  Share2,
  Users,
  ShieldAlert,
  ChevronRight,
  X,
  Radio,
  ExternalLink
} from 'lucide-react';
import { CrimeHotspot } from '../../types/crime';

interface HotspotDrawerProps {
  hotspot: CrimeHotspot | null;
  onClose: () => void;
}

export const HotspotDrawer: React.FC<HotspotDrawerProps> = ({ hotspot, onClose }) => {
  const navigate = useNavigate();

  if (!hotspot) {
    return (
      <div className="astra-card p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 min-h-[450px]">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <MapPin className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-sm font-bold text-[var(--text-primary)]">No Hotspot Selected</p>
        <p className="text-xs text-[var(--text-secondary)] max-w-xs">
          Click any incident marker or high-density heat ring on the GIS tactical map to inspect precinct dossiers, statutory FIRs, and linked syndicates.
        </p>
      </div>
    );
  }

  // Cross-Navigation Trigger: Explore Related Network
  const handleExploreNetwork = () => {
    // Navigate to /network highlighting either the first related entity or the location
    const relatedEntity = (hotspot as any).relatedEntityIds?.[0];
    if (relatedEntity) {
      navigate(`/network?entityId=${relatedEntity}`);
    } else {
      navigate(`/network?locationId=${hotspot.id}`);
    }
  };

  const riskBadgeColor =
    hotspot.riskLevel === 'CRITICAL'
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : hotspot.riskLevel === 'HIGH'
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';

  const timeTrend = (hotspot as any).timeTrend || [
    { period: 'Nov', count: 12 },
    { period: 'Dec', count: 18 },
    { period: 'Jan', count: 24 },
    { period: 'Feb', count: 31 },
    { period: 'Mar', count: 38 }
  ];

  const maxTimeTrendCount = Math.max(...timeTrend.map((t: any) => t.count), 1);

  const crimeBreakdown = (hotspot as any).crimeBreakdown || [
    { category: hotspot.primaryCrimes?.[0] || 'Violent Crime', percentage: 55 },
    { category: hotspot.primaryCrimes?.[1] || 'Vehicle Theft', percentage: 30 },
    { category: hotspot.primaryCrimes?.[2] || 'Extortion', percentage: 15 }
  ];

  const recentIncidents = (hotspot as any).recentIncidents || [
    {
      firNumber: hotspot.associatedFIRs?.[0] || 'FIR-2026-DL-00190',
      date: '2026-03-02',
      statutes: 'BNS 309, 311 / IPC 392, 397',
      desc: 'Armed transit van interception proximate to arterial flyover'
    }
  ];

  return (
    <div className="astra-card p-5 space-y-5 animate-in fade-in slide-in-from-right-4 duration-200 relative overflow-hidden">
      {/* Drawer Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${riskBadgeColor}`}>
              {hotspot.riskLevel} DENSITY
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {hotspot.city} JURISDICTION
            </span>
          </div>
          <h2 className="text-base font-black tracking-tight text-[var(--text-primary)]">
            {hotspot.name}
          </h2>
          <p className="text-[11px] font-mono text-slate-400">
            Coordinates: {hotspot.lat.toFixed(4)}° N, {hotspot.lng.toFixed(4)}° E • Radius: {hotspot.radiusMeters}m
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-blue-500/10 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Action Button: Explore Related Network */}
      <button
        onClick={handleExploreNetwork}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold text-xs tracking-wide transition-all shadow-md"
      >
        <Share2 className="w-4 h-4" />
        <span>Explore Related Network (Spider-Web)</span>
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </button>

      {/* Hotspot Vital Metrics */}
      <div className="grid grid-cols-3 gap-2 text-center font-mono">
        <div className="p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Density Index</span>
          <span className="text-lg font-black text-red-400">{hotspot.densityScore}/100</span>
          <span className="text-[9px] text-slate-400 block mt-0.5">High Density</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Linked FIRs</span>
          <span className="text-lg font-black text-blue-400">
            {hotspot.associatedFIRs ? hotspot.associatedFIRs.length : 3}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Active Dockets</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)]">
          <span className="text-[10px] text-[var(--text-muted)] block">Entities Sighted</span>
          <span className="text-lg font-black text-emerald-400">
            {(hotspot as any).relatedEntityIds ? (hotspot as any).relatedEntityIds.length : 4}
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Suspects & Autos</span>
        </div>
      </div>

      {/* Incident Time Trend Chart */}
      <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            Monthly Incident Velocity
          </span>
          <span className="text-[10px] text-red-400 font-bold">+28% this Quarter</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
          {timeTrend.map((t: any, idx: number) => {
            const heightPercent = Math.round((t.count / maxTimeTrendCount) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.count}
                </div>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all shadow-sm"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{t.period}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crime Categories Breakdown */}
      <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-2.5">
        <span className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          Statutory Crime Category Breakdown
        </span>

        <div className="space-y-2 text-xs font-mono">
          {crimeBreakdown.map((item: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-secondary)]">{item.category}</span>
                <span className="font-bold text-[var(--text-primary)]">{item.percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Incidents & Formal FIRs */}
      <div className="space-y-2 text-xs">
        <span className="font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          Recent Ingested Incidents & FIRs
        </span>

        <div className="space-y-2">
          {recentIncidents.map((inc: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-md bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-400">{inc.firNumber}</span>
                <span className="text-[10px] font-mono text-slate-400">{inc.date}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {inc.desc}
              </p>
              <div className="pt-1 flex items-center gap-1 text-[10px] font-mono text-amber-400">
                <span>Statutes:</span>
                <span className="font-bold">{inc.statutes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Patrol Recommendation */}
      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs space-y-1">
        <p className="font-bold text-blue-400 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          Active Patrol Beat Recommendation:
        </p>
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          {hotspot.patrolRecommendation || 'Maintain routine PCR roving patrols and coordinate ANPR cameras.'}
        </p>
      </div>
    </div>
  );
};
