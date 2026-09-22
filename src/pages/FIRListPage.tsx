import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, UploadCloud, Eye, Shield, X, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { databaseService } from '../services/database/adapter';
import { FIR } from '../types/crime';

export const FIRListPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [firs, setFirs] = useState<FIR[]>([]);
  const [firLoading, setFirLoading] = useState(true);
  const [firError, setFirError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedFir, setSelectedFir] = useState<FIR | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setFirLoading(true);
        setFirError(null);
        const data = await databaseService.getFIRs();
        const safe = (data || []).map(f => ({
          ...f,
          sectionsBNS: Array.isArray(f.sectionsBNS) ? f.sectionsBNS : [],
          sectionsIPC: Array.isArray(f.sectionsIPC) ? f.sectionsIPC : [],
          firNumber: f.firNumber || 'FIR-UNKNOWN',
          crimeCategory: f.crimeCategory || 'Unclassified',
          policeStation: f.policeStation || 'Unknown Station',
          complainant: f.complainant || 'Unknown',
          status: f.status || 'REGISTERED',
          severity: f.severity || 'MEDIUM',
        }));
        setFirs(safe);
      } catch (err) {
        console.error('Failed to load FIRs:', err);
        setFirError('Failed to load FIR records. Please try again.');
      } finally {
        setFirLoading(false);
      }
    };
    load();
  }, []);

  const isSeniorOfficial = user?.role === 'SENIOR_OFFICIAL';

  const filteredFirs = firs.filter((f) => {
    // Role-based visibility:
    // Senior Official can view all FIRs.
    // Regular Officers/Inspectors can only view FIRs uploaded by them or assigned to them.
    if (!isSeniorOfficial && user) {
      const userIdent = (user.id || '').toLowerCase();
      const userOffId = (user.officerId || '').toLowerCase();
      const userEmail = (user.email || '').toLowerCase();
      const userName = (user.name || '').toLowerCase();

      const fUploaderId = (f.uploaderId || '').toLowerCase();
      const fUploaderEmail = (f.uploaderEmail || '').toLowerCase();
      const fUploaderName = (f.uploaderName || '').toLowerCase();
      const fInvestigatorId = (f.investigatingOfficerId || '').toLowerCase();
      const fInvestigatorName = (f.investigatingOfficerName || '').toLowerCase();
      const fAssignedTo = (f.assignedTo || '').toLowerCase();

      const isOwner =
        (fUploaderId && (fUploaderId === userIdent || fUploaderId === userOffId)) ||
        (fUploaderEmail && fUploaderEmail === userEmail) ||
        (fUploaderName && fUploaderName === userName) ||
        (fInvestigatorId && (fInvestigatorId === userIdent || fInvestigatorId === userOffId)) ||
        (fInvestigatorName && fInvestigatorName === userName) ||
        (fAssignedTo && (fAssignedTo === userIdent || fAssignedTo === userOffId));

      // Also allow default seeded/demo FIRs if user has not uploaded any personal ones yet,
      // but ensure any user-uploaded ones are strictly isolated to that user + senior official
      const isSystemDemo = f.id?.startsWith('fir_00') || f.id?.startsWith('fir_10');

      if (!isOwner && !isSystemDemo) {
        return false;
      }
    }

    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const bns = Array.isArray(f.sectionsBNS) ? f.sectionsBNS : [];
      const ipc = Array.isArray(f.sectionsIPC) ? f.sectionsIPC : [];
      const match =
        (f.firNumber || '').toLowerCase().includes(term) ||
        (f.crimeCategory || '').toLowerCase().includes(term) ||
        (f.policeStation || '').toLowerCase().includes(term) ||
        (f.complainant || '').toLowerCase().includes(term) ||
        bns.some((s) => s.toLowerCase().includes(term)) ||
        ipc.some((s) => s.toLowerCase().includes(term));
      if (!match) return false;
    }
    return true;
  });

  if (firLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">Loading FIR Registry...</span>
        </div>
      </div>
    );
  }

  if (firError) {
    return (
      <div className="astra-card p-8 text-center">
        <p className="text-red-400 font-mono text-sm mb-3">⚠ {firError}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="astra-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)]">NATIONAL CASE REPOSITORY</span>
            <span className="text-xs font-mono text-[var(--text-muted)]">FIR DOSSIER MANAGEMENT (SEC 154 CrPC / SEC 173 BNSS)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">First Information Report (FIR) Master Registry</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Cryptographically indexed case repository with AI entity mapping and forensic cross-referencing.</p>
        </div>
        <Link to="/fir/upload" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 transition-all shadow-md">
          <UploadCloud className="w-4 h-4" />
          <span>Ingest / Register FIR</span>
        </Link>
      </div>

      <div className="astra-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search FIR#, Complainant, Offence, Sections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none font-mono" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-[var(--text-primary)] focus:outline-none">
              <option value="ALL">All Statuses</option>
              <option value="REGISTERED">Registered</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="CHARGESHEETED">Chargesheeted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="bg-transparent text-[var(--text-primary)] focus:outline-none">
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="astra-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-main)]/50 text-[10px] font-mono uppercase text-[var(--text-muted)]">
                <th className="py-3 px-4">FIR Number</th>
                <th className="py-3 px-4">Offence Classification</th>
                <th className="py-3 px-4">Police Station</th>
                <th className="py-3 px-4">Sections (BNS / IPC)</th>
                <th className="py-3 px-4">Investigating Officer</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredFirs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">No matching FIR records found in the database.</td>
                </tr>
              ) : (
                filteredFirs.map((fir) => (
                  <tr key={fir.id} className="hover:bg-blue-500/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-500">{fir.firNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-[var(--text-primary)]">
                      <div>{fir.crimeCategory}</div>
                      <span className="text-[10px] text-[var(--text-muted)]">Complainant: {fir.complainant}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-secondary)]">{fir.policeStation}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="text-blue-400 font-semibold block">{fir.sectionsBNS[0] || 'BNS Standard'}</span>
                      <span className="text-[10px] text-slate-400">{fir.sectionsIPC[0] || 'IPC Associated'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-primary)] font-medium">{fir.investigatingOfficerName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${fir.severity === 'CRITICAL' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : fir.severity === 'HIGH' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
                        {fir.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">{(fir.status || '').replace('_', ' ')}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => setSelectedFir(fir)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[var(--border-subtle)] hover:border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs font-semibold transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="astra-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-500">{selectedFir.firNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">{selectedFir.severity}</span>
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mt-1">{selectedFir.crimeCategory}</h3>
              </div>
              <button onClick={() => setSelectedFir(null)} className="p-1 rounded hover:bg-slate-700/30 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Police Station & Jurisdiction</span>
                <p className="font-semibold text-[var(--text-primary)]">{selectedFir.policeStation}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{selectedFir.location}</p>
              </div>
              <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Investigation Officers & Assignee</span>
                <p className="font-semibold text-[var(--text-primary)]">{selectedFir.investigatingOfficerName}</p>
                <p className="text-[11px] text-[var(--text-secondary)] font-mono">Status: {selectedFir.status}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">FIR Brief Summary & Modus Operandi</h4>
              <p className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed">{selectedFir.briefSummary || 'No summary available.'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
                <h5 className="font-bold text-blue-400 mb-1">Bharatiya Nyaya Sanhita (BNS)</h5>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-[var(--text-primary)]">
                  {(selectedFir.sectionsBNS || []).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-3 rounded bg-slate-800/30 border border-slate-700/50">
                <h5 className="font-bold text-slate-300 mb-1">Indian Penal Code (IPC Legacy)</h5>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                  {(selectedFir.sectionsIPC || []).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            {selectedFir.extractedEntities && (
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">AI-Extracted Forensic Entities</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Accused / Suspects</span>
                    <span className="text-blue-400 font-semibold text-[11px]">{selectedFir.extractedEntities.suspects?.join(', ') || 'Under ID'}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Flagged Phones</span>
                    <span className="text-orange-400 font-semibold text-[11px]">{selectedFir.extractedEntities.phones?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Vehicles</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">{selectedFir.extractedEntities.vehicles?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                    <span className="text-[9px] text-[var(--text-muted)] block">Mule Accounts</span>
                    <span className="text-purple-400 font-semibold text-[11px]">{selectedFir.extractedEntities.accounts?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
              <Link to="/network" className="px-3.5 py-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold transition-colors">Inspect in Link Network</Link>
              <button onClick={() => setSelectedFir(null)} className="px-4 py-1.5 rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-colors">Close Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
