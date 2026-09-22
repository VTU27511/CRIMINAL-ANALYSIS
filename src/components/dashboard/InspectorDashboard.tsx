import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  Share2,
  Bot,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  Activity,
  AlertTriangle,
  Radio,
  Network,
  Cpu,
  Shield,
  Search
} from 'lucide-react';
import { FIR, Investigation, CrimeHotspot } from '../../types/crime';

interface InspectorDashboardProps {
  firs: FIR[];
  investigations: Investigation[];
  hotspots: CrimeHotspot[];
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({
  firs,
  investigations,
  hotspots
}) => {
  // Pending Analysis Queue
  const pendingAnalysis = [
    {
      id: 'doc_pend_01',
      title: 'FIR-2026-KA-00105 Document Scan (Indiranagar Jewelry Store)',
      fileType: 'PDF',
      size: '2.4 MB',
      uploadedAt: '12 mins ago',
      status: 'QUEUED_FOR_OCR'
    },
    {
      id: 'doc_pend_02',
      title: 'CDR Tower Dump - Connaught Place Outer Circle Cell 4A',
      fileType: 'CSV / TXT',
      size: '14.8 MB',
      uploadedAt: '45 mins ago',
      status: 'AWAITING_TRIANGULATION'
    }
  ];

  // Live Alerts
  const networkAlerts = [
    {
      id: 'alt_01',
      type: 'NETWORK_SPIKE',
      text: 'Dormant SIM +91 97182 99012 activated with 34 calls near AIIMS Flyover',
      time: '18 mins ago',
      severity: 'HIGH'
    },
    {
      id: 'alt_02',
      type: 'HOTSPOT_GEOFENCE',
      text: 'Scorpio DL-3C-AZ-9901 ANPR hit on Connaught Place toll outer ring',
      time: '34 mins ago',
      severity: 'CRITICAL'
    },
    {
      id: 'alt_03',
      type: 'MULE_TRANSFER',
      text: '₹40L IMPS transferred from HDFC-MULE-4819 to ICICI-MULE-9021',
      time: '1 hr ago',
      severity: 'HIGH'
    }
  ];

  // Recent Activity Log
  const activityLog = [
    { action: 'Added Case Diary Note #14', caseRef: 'FIR-2026-DL-00189', time: '10:15 hrs', officer: 'Insp. Ananya Sharma' },
    { action: 'Triangulated Shortest Path', caseRef: 'Tiger-Ansari Syndicate', time: '09:40 hrs', officer: 'Insp. Ananya Sharma' },
    { action: 'Issued ANPR Lookout Alert', caseRef: 'DL-3C-AZ-9901', time: '08:25 hrs', officer: 'Insp. Ananya Sharma' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Intake Banner */}
      <div className="astra-card p-5 bg-[var(--bg-card)] border border-[var(--border-strong)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center flex-shrink-0 shadow-md">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-primary)]">
              Rapid FIR Document Ingestion & Optical Analysis
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Ingest new multi-format FIRs (PDF, DOCX, Images, Scans) to automatically resolve entities and update the criminal network.
            </p>
          </div>
        </div>

        <Link
          to="/fir/upload"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold self-start md:self-auto transition-colors shadow-md"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New FIR</span>
        </Link>
      </div>

      {/* Grid: Assigned Investigations & Pending Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Active Investigations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="astra-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  My Assigned Active Investigations
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">
                  Primary cases requiring daily case diary entries and forensic updates
                </p>
              </div>
              <Link to="/fir" className="text-xs font-bold text-[var(--text-primary)] hover:underline font-mono">
                View All Cases
              </Link>
            </div>

            <div className="space-y-3">
              {investigations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-3 hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            inv.priority === 'P0_CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border-[var(--accent-badge-border)]'
                          }`}
                        >
                          {inv.priority}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {inv.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-1">
                        Lead: {inv.leadOfficer} | {inv.caseDiaryEntries} Case Diary Notes
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      {inv.progressPercentage}% Complete
                    </span>
                  </div>

                  {/* Progress Bar with Clear High-Contrast Track */}
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner">
                    <div
                      className="h-full bg-slate-900 dark:bg-emerald-400 rounded-full transition-all duration-300 shadow-sm"
                      style={{ width: `${inv.progressPercentage}%` }}
                    />
                  </div>

                  {/* Targets & Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[10px] font-mono">
                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <span>Targets:</span>
                      {inv.targetEntities.map((t, idx) => (
                        <span key={idx} className="px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/investigation-assistant`}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold flex items-center gap-1"
                    >
                      <span>Ask AI Copilot</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Ingested FIRs & Forensic Dossiers */}
          <div className="astra-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--text-primary)]" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Recently Ingested FIRs & Forensic Dossiers ({firs.length})
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    Persistently stored case files available for cross-referencing and graph expansion
                  </p>
                </div>
              </div>
              <Link to="/fir" className="text-xs font-bold text-[var(--text-primary)] hover:underline font-mono">
                View All in Registry
              </Link>
            </div>

            <div className="space-y-3">
              {firs.slice(0, 5).map((fir) => (
                <div
                  key={fir.id}
                  className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)]">
                          {fir.firNumber}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            fir.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }`}
                        >
                          {fir.severity}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {fir.crimeCategory}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-1">
                        Station: {fir.policeStation} | Complainant: {fir.complainant}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/network"
                        className="px-2 py-1 rounded border border-[var(--border-strong)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] text-[10px] font-mono flex items-center gap-1 transition-colors"
                        title="Explore on Spider-Web Graph"
                      >
                        <Network className="w-3 h-3" />
                        <span>Inspect Spider-Web</span>
                      </Link>
                      <Link
                        to={`/fir?search=${fir.firNumber}`}
                        className="px-2 py-1 rounded bg-[var(--accent-badge-bg)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] text-[10px] font-mono transition-colors"
                      >
                        Dossier
                      </Link>
                    </div>
                  </div>

                  {fir.extractedEntities && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-[var(--text-muted)] font-semibold">Extracted Entities:</span>
                      {fir.extractedEntities.suspects?.slice(0, 3).map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
                          🔵 {s}
                        </span>
                      ))}
                      {(fir.extractedEntities.phones || (fir.extractedEntities as any).phoneNumbers)?.slice(0, 2).map((ph: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800">
                          🟣 {ph}
                        </span>
                      ))}
                      {fir.extractedEntities.vehicles?.slice(0, 1).map((vh: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                          🟠 {vh}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Analysis Queue */}
          <div className="astra-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Pending Document Analysis & OCR Queue
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {pendingAnalysis.length} Items Awaiting Execution
              </span>
            </div>

            <div className="space-y-2">
              {pendingAnalysis.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[var(--text-primary)] block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {item.fileType} • {item.size} • Uploaded {item.uploadedAt}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/fir/upload"
                    className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold font-mono shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Run OCR/NLP</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Alerts & Case Diary Stream */}
        <div className="space-y-6">
          {/* Live Network & Hotspot Alerts */}
          <div className="astra-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Live Network & Hotspot Alerts
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-red-500" />
            </div>

            <div className="space-y-2.5">
              {networkAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        alt.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans">{alt.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="astra-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Recent Case Diary Activity
                </h3>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--text-primary)] block text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">{log.caseRef}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      {log.officer} • {log.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
