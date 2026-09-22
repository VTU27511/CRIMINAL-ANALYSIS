import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Bot,
  Shield,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { databaseService } from '../services/database/adapter';
import { FIR, Investigation, CrimeHotspot } from '../types/crime';
import { SeniorOfficialDashboard } from '../components/dashboard/SeniorOfficialDashboard';
import { InspectorDashboard } from '../components/dashboard/InspectorDashboard';

export const DashboardPage: React.FC = () => {
  const { user, isSeniorOfficial, quickLoginDemo } = useAuth();
  const [firs, setFirs] = useState<FIR[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [hotspots, setHotspots] = useState<CrimeHotspot[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentic Role Awareness

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [firsData, invData, hsData] = await Promise.all([
          databaseService.getFIRs(),
          databaseService.getInvestigations(),
          databaseService.getHotspots()
        ]);
        setFirs(firsData);
        setInvestigations(invData);
        setHotspots(hsData);
      } catch (e) {
        console.error('Dashboard data load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px] text-xs font-mono text-blue-400 gap-2">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>Loading Command Intelligence Desk...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Role Context & Welcome */}
      <div className="astra-card p-6 border-l-4 border-l-slate-900 dark:border-l-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)]">
              {isSeniorOfficial
                ? 'EXECUTIVE COMMAND DESK (SENIOR OFFICIAL)'
                : 'OPERATIONAL INVESTIGATIVE DESK (INSPECTOR)'}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              DEPARTMENT: {user?.department || 'Special Crime Branch'}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
            Welcome, {user?.designation || 'Officer'} {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {isSeniorOfficial
              ? 'Executive intelligence monitoring state-wide syndicate consolidation, jurisdictional clearance velocity, and critical hotspots.'
              : 'Managing assigned active investigations, pending document OCR/NLP analysis, and live syndicate geofence alerts.'}
          </p>
        </div>

        {/* Action Controls & Official Account Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Authentic Officer Account Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[var(--text-primary)]">
              {isSeniorOfficial ? 'SENIOR OFFICER' : 'INSPECTOR'}
            </span>
            <span className="text-[var(--text-muted)]">
              ({user?.name || user?.email?.split('@')[0] || 'Authenticated Officer'})
            </span>
          </div>

          <Link
            to="/fir/upload"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 transition-all shadow-md"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest FIR</span>
          </Link>
          <Link
            to="/investigation-assistant"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot</span>
          </Link>
        </div>
      </div>

      {/* Render Role-Specific Authenticated Dashboard */}
      {isSeniorOfficial ? (
        <SeniorOfficialDashboard
          firs={firs}
          investigations={investigations}
          hotspots={hotspots}
        />
      ) : (
        <InspectorDashboard
          firs={firs}
          investigations={investigations}
          hotspots={hotspots}
        />
      )}
    </div>
  );
};
