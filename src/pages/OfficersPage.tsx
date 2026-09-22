import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  TrendingUp,
  User,
  MessageSquare,
  Send,
  Radio,
  Camera,
  Upload,
  RefreshCw,
  X,
  FileText,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  Inbox,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { databaseService } from '../services/database/adapter';
import { UserProfile, UserRole, OfficerMessage } from '../types/auth';
import { compressImage } from '../utils/imageCompressor';

const DIRECTIVE_TEMPLATES = [
  {
    title: '🚨 Priority Tower Dump Intercept',
    subject: 'Priority Directive: CDR Tower Dump Analysis',
    content: 'Verify CDR tower dump cell 4A near Connaught Place for primary suspect movements. Correlate with ANPR logs immediately.',
    priority: 'URGENT_DIRECTIVE' as const
  },
  {
    title: '⚡ Tactical Interception Deploy',
    subject: 'Tactical Interception & Surveillance Order',
    content: 'Deploy mobile surveillance unit to intercepted corridor coordinates. Maintain observation without compromising cover.',
    priority: 'URGENT_DIRECTIVE' as const
  },
  {
    title: '🏦 Freeze Mule Accounts',
    subject: 'Mule Account Freeze & KYC Audit',
    content: 'Initiate urgent freeze order under Sec 106 BNSS for flagged mule bank accounts. Request transaction trail from compliance desks.',
    priority: 'CASE_ASSIGNMENT' as const
  },
  {
    title: '📋 Draft Chargesheet Submission',
    subject: 'Case Chargesheet & Evidence Review',
    content: 'Collate digital forensics, call logs, and seizure memos. Prepare draft chargesheet for executive review by 1800 hrs.',
    priority: 'ROUTINE' as const
  }
];

const SITREP_TEMPLATES = [
  {
    title: '📍 Suspect Triangulation Update',
    subject: 'SITREP: ANPR Triangulation Complete',
    content: 'Suspect vehicle spotted on Outer Ring Road corridor via ANPR camera #14. Ground team in pursuit, requesting tactical backup.',
    priority: 'SITREP' as const
  },
  {
    title: '📊 CDR Analysis Complete',
    subject: 'SITREP: CDR Tower Correlation Finished',
    content: 'Tower dump analysis complete. 3 suspicious international numbers identified communicating with suspect between 01:00-03:30 AM.',
    priority: 'SITREP' as const
  },
  {
    title: '🚨 Urgent Intercept Clearance',
    subject: 'URGENT: Authorization for Premises Search',
    content: 'Primary stash house identified near Industrial Area. Requesting Senior Officer warrant clearance for immediate entry.',
    priority: 'URGENT_DIRECTIVE' as const
  }
];

export const OfficersPage: React.FC = () => {
  const { user, switchOfficer, isSeniorOfficial, updateProfile } = useAuth();
  const [officers, setOfficers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<OfficerMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'DISPATCH'>('ROSTER');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Direct Directive / Message Modal State
  const [selectedSubOfficer, setSelectedSubOfficer] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directiveSubject, setDirectiveSubject] = useState('');
  const [directiveContent, setDirectiveContent] = useState('');
  const [directivePriority, setDirectivePriority] = useState<OfficerMessage['priority']>('URGENT_DIRECTIVE');
  const [directiveFirRef, setDirectiveFirRef] = useState('FIR-2026-DL-00189');
  const [isSending, setIsSending] = useState(false);

  // Photo Upload Feedback State
  const [uploadFeedback, setUploadFeedback] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<UserProfile | null>(null);

  // Load Officers and Messages
  const loadData = async () => {
    try {
      const allOfficers = await databaseService.getOfficers();
      setOfficers(allOfficers);

      const allMsgs = await databaseService.getOfficerMessages();
      setMessages(allMsgs);
    } catch (e) {
      console.error("Failed to load officer data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Senior Officer commanding profile (for Inspector's view)
  const seniorOfficer = officers.find(o => o.role === 'SENIOR_OFFICIAL') || {
    id: 'off_001',
    officerId: 'DL-ACP-4102',
    name: 'Vikram Rathore',
    email: 'senior.official@police.gov.in',
    role: 'SENIOR_OFFICIAL' as UserRole,
    department: 'Special Crime Branch HQ',
    designation: 'Assistant Commissioner of Police (ACP)',
    phone: '+91 98110 44210',
    badgeNumber: 'IND-SPB-4102',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    casesAssigned: 24,
    casesSolved: 21,
    clearanceRate: 87.5,
    status: 'ACTIVE' as const,
    createdAt: '2024-01-15T09:30:00Z'
  };

  // Sub-Officers list (only Inspectors)
  const subOfficers = officers.filter(o => o.role === 'INSPECTOR');

  // Filtered Sub-Officers (Senior Officer search)
  const filteredSubOfficers = subOfficers.filter((o) => {
    if (!searchTerm.trim()) return true;
    const t = searchTerm.toLowerCase();
    return (
      o.name.toLowerCase().includes(t) ||
      o.officerId.toLowerCase().includes(t) ||
      o.department.toLowerCase().includes(t) ||
      o.designation.toLowerCase().includes(t)
    );
  });

  // Photo Upload Handler with Client-Side Compression (<25KB, never hangs, never fails)
  const handlePhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, targetOfficer?: UserProfile) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const officerToUpdate = targetOfficer || activeUploadTarget || user;
    if (!officerToUpdate) return;

    setUpdatingId(officerToUpdate.id);
    setUploadFeedback('Optimizing and compressing photograph...');

    try {
      const compressedDataUrl = await compressImage(file, 320, 320, 0.85);

      // Persist to database service
      const updated = await databaseService.updateOfficer(officerToUpdate.id, { photoUrl: compressedDataUrl });
      
      // Update local state
      setOfficers(prev => prev.map(o => (o.id === officerToUpdate.id ? updated : o)));
      
      if (user?.id === officerToUpdate.id) {
        await updateProfile({ photoUrl: compressedDataUrl });
      }

      setUploadFeedback(`Photo updated successfully for ${officerToUpdate.name}! (~${Math.round(compressedDataUrl.length * 0.75 / 1024)} KB)`);
      setTimeout(() => setUploadFeedback(''), 4000);
    } catch (err: any) {
      console.error("Photo upload error:", err);
      setUploadFeedback(`Failed to update photo: ${err.message}`);
    } finally {
      setUpdatingId(null);
      setActiveUploadTarget(null);
      e.target.value = '';
    }
  };

  const triggerUploadFor = (officer: UserProfile) => {
    setActiveUploadTarget(officer);
    fileInputRef.current?.click();
  };

  // Open Direct Directive Modal for a Sub-Officer
  const handleOpenDirectiveModal = (subOfficer: UserProfile) => {
    setSelectedSubOfficer(subOfficer);
    setDirectiveSubject('');
    setDirectiveContent('');
    setDirectivePriority('URGENT_DIRECTIVE');
    setIsModalOpen(true);
  };

  // Send Message (Works for both Senior Official -> Sub-Officer, and Sub-Officer -> Senior Official)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveContent.trim()) return;

    setIsSending(true);

    try {
      let payload: Omit<OfficerMessage, 'id' | 'timestamp'>;

      if (isSeniorOfficial) {
        // Senior Officer dispatching to selected Sub-Officer
        if (!selectedSubOfficer) return;
        payload = {
          senderId: user?.id || 'off_001',
          senderName: user?.name ? `${user.name} (ACP)` : 'Senior Official (ACP)',
          senderRole: 'SENIOR_OFFICIAL',
          receiverId: selectedSubOfficer.id,
          receiverName: selectedSubOfficer.name,
          receiverRole: 'INSPECTOR',
          subject: directiveSubject.trim() || 'Bureau Directive',
          content: directiveContent.trim(),
          priority: directivePriority,
          read: false,
          firRef: directiveFirRef.trim() || undefined
        };
      } else {
        // Sub-Officer transmitting SITREP to Senior Officer
        payload = {
          senderId: user?.id || 'off_002',
          senderName: user?.name || 'Inspector',
          senderRole: 'INSPECTOR',
          receiverId: seniorOfficer.id,
          receiverName: seniorOfficer.name,
          receiverRole: 'SENIOR_OFFICIAL',
          subject: directiveSubject.trim() || 'Tactical Situation Report (SITREP)',
          content: directiveContent.trim(),
          priority: directivePriority,
          read: false,
          firRef: directiveFirRef.trim() || undefined
        };
      }

      const newMsg = await databaseService.sendOfficerMessage(payload);
      setMessages(prev => [newMsg, ...prev]);

      await databaseService.addAuditLog({
        officerId: user?.officerId || 'OFF-SYS',
        officerName: user?.name || 'Officer',
        action: `DISPATCH_${payload.priority}`,
        target: isSeniorOfficial ? selectedSubOfficer?.officerId || 'SUB-OFF' : seniorOfficer.officerId,
        ip: '127.0.0.1',
        result: 'SUCCESS'
      });

      setDirectiveContent('');
      setDirectiveSubject('');
      if (isSeniorOfficial) {
        setUploadFeedback(`Directive transmitted successfully to ${selectedSubOfficer?.name}!`);
        setTimeout(() => setUploadFeedback(''), 3500);
      } else {
        setUploadFeedback(`SITREP dispatched to ${seniorOfficer.name} (Crime Branch HQ)!`);
        setTimeout(() => setUploadFeedback(''), 3500);
      }
    } catch (err: any) {
      console.error("Failed to send officer message:", err);
      setUploadFeedback(`Dispatch failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // Mark message as read
  const handleMarkRead = async (msgId: string) => {
    try {
      await databaseService.markMessageRead(msgId);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
    } catch (e) {
      console.warn("Could not mark message read:", e);
    }
  };

  // Status and Role toggles (Senior Official only)
  const handleRoleToggle = async (officer: UserProfile) => {
    const newRole: UserRole = officer.role === 'INSPECTOR' ? 'SENIOR_OFFICIAL' : 'INSPECTOR';
    setUpdatingId(officer.id);

    try {
      const updated = await databaseService.updateOfficer(officer.id, { role: newRole });
      setOfficers((prev) => prev.map((o) => (o.id === officer.id ? updated : o)));
    } catch (e) {
      console.error("Failed to update officer role:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (officer: UserProfile) => {
    const newStatus = officer.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
    setUpdatingId(officer.id);

    try {
      const updated = await databaseService.updateOfficer(officer.id, { status: newStatus });
      setOfficers((prev) => prev.map((o) => (o.id === officer.id ? updated : o)));
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter messages relevant to current user
  const relevantMessages = messages.filter(m => {
    if (isSeniorOfficial) {
      // Senior official sees all directives dispatched and SITREPs received
      return true;
    } else {
      // Inspector sees messages sent to or from themselves
      return m.senderId === user?.id || m.receiverId === user?.id || m.receiverRole === 'INSPECTOR';
    }
  });

  const unreadCount = relevantMessages.filter(m => !m.read && m.receiverRole === user?.role).length;

  return (
    <div className="space-y-6">
      {/* Hidden Global File Input for 1-click Photo Upload with Compression */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoFileSelect}
        className="hidden"
      />

      {/* Global Feedback Banner */}
      {uploadFeedback && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-mono">{uploadFeedback}</span>
          </div>
          <button onClick={() => setUploadFeedback('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE A: SENIOR OFFICIAL VIEW                                              */}
      {/* ONLY Senior Official can view the Sub-Officers roster & send directives   */}
      {/* ========================================================================= */}
      {isSeniorOfficial ? (
        <>
          {/* Executive Command Header */}
          <div className="astra-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-950/20 via-slate-900/30 to-blue-950/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  EXECUTIVE LEVEL-5 PRIVILEGE
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  SUB-OFFICER GOVERNANCE & TACTICAL DISPATCH
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)] flex items-center gap-2">
                <span>Sub-Officer Roster & Command Dispatch</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--accent-badge-bg)] text-[var(--accent-badge-text)] border border-[var(--accent-badge-border)] font-bold">
                  {subOfficers.length} Sub-Officers Active
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Exclusive Senior Officer terminal: Monitor subordinate investigators, transmit binding directives, and review incoming SITREPs.
              </p>
            </div>

            {/* Right Controls: Tab Switcher & Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Tabs: Sub-Officers Roster vs Dispatch Console */}
              <div className="flex rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('ROSTER')}
                  className={`px-3 py-1.5 text-xs font-bold font-mono rounded transition-all flex items-center gap-1.5 ${
                    activeTab === 'ROSTER'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-indigo-400'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Sub-Officers ({subOfficers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('DISPATCH')}
                  className={`px-3 py-1.5 text-xs font-bold font-mono rounded transition-all flex items-center gap-1.5 relative ${
                    activeTab === 'DISPATCH'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-indigo-400'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Dispatch & SITREPs</span>
                  {unreadCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              </div>

              {/* Sub-Officer Search */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sub-officer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <Link
                to="/profile?role=SENIOR_OFFICIAL"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>My Dossier</span>
              </Link>
            </div>
          </div>

          {/* TAB 1: SUB-OFFICERS ROSTER */}
          {activeTab === 'ROSTER' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubOfficers.map((officer) => {
                const subOfficerMessages = messages.filter(
                  m => m.senderId === officer.id || m.receiverId === officer.id
                );
                const hasPendingSitrep = subOfficerMessages.some(m => m.senderId === officer.id && !m.read);

                return (
                  <div
                    key={officer.id}
                    className="astra-card p-5 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Officer Header with Direct Photo Upload Overlay */}
                      <div className="flex items-start gap-3.5">
                        <div className="relative group/avatar flex-shrink-0">
                          <img
                            src={officer.photoUrl}
                            alt={officer.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 shadow-md ring-1 ring-blue-500/20"
                          />
                          {/* 1-Click Photo Upload on Card with Compression */}
                          <button
                            type="button"
                            onClick={() => triggerUploadFor(officer)}
                            className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer text-[9px] font-mono"
                            title="Click to upload personal photo"
                          >
                            <Camera className="w-4 h-4 mb-0.5" />
                            <span>Change</span>
                          </button>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              SUB-OFFICER • {officer.role}
                            </span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                officer.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              title={officer.status}
                            />
                          </div>

                          <h3 className="text-sm font-bold text-[var(--text-primary)] truncate mt-1">
                            {officer.name}
                          </h3>
                          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                            {officer.officerId}
                          </p>
                          <p className="text-[11px] text-blue-400 font-medium truncate">
                            {officer.designation}
                          </p>
                        </div>
                      </div>

                      {/* Department Details */}
                      <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{officer.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-mono">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{officer.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{officer.phone}</span>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">Assigned</span>
                          <span className="text-[var(--text-primary)] font-bold text-sm">
                            {officer.casesAssigned}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">Solved</span>
                          <span className="text-emerald-500 font-bold text-sm">
                            {officer.casesSolved}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                          <span className="text-[9px] text-[var(--text-muted)] block">Clearance</span>
                          <span className="text-blue-400 font-bold text-sm">
                            {officer.clearanceRate}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: DIRECT DIRECTIVE BUTTON & Quick Controls */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                      {/* Priority Button: Send Directive / Message */}
                      <button
                        type="button"
                        onClick={() => handleOpenDirectiveModal(officer)}
                        className="w-full py-2 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer relative"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send Directive / Dispatch</span>
                        {hasPendingSitrep && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-mono font-black ml-1 animate-pulse">
                            SITREP WAITING
                          </span>
                        )}
                      </button>

                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/profile?id=${officer.id}`}
                          className="flex-1 py-1.5 px-2 text-[11px] font-semibold rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <User className="w-3 h-3" />
                          <span>Dossier</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => switchOfficer(officer.id)}
                          className="py-1.5 px-3 text-[11px] font-mono font-semibold rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                          title="Assume identity for operational testing"
                        >
                          Assume
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === officer.id}
                          onClick={() => handleStatusToggle(officer)}
                          className={`py-1.5 px-2.5 text-[11px] font-semibold rounded border transition-colors disabled:opacity-50 ${
                            officer.status === 'ACTIVE'
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {officer.status === 'ACTIVE' ? 'Set Leave' : 'Set Active'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSubOfficers.length === 0 && (
                <div className="col-span-full astra-card p-12 text-center text-xs font-mono text-[var(--text-muted)] space-y-2">
                  <Users className="w-8 h-8 text-slate-500 mx-auto" />
                  <p>No sub-officers match the current search query.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCOMING SITREPS & DISPATCH LOG (SENIOR OFFICER) */}
          {activeTab === 'DISPATCH' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Directives Dispatched & Incoming SITREPs Feed (7 Cols) */}
              <div className="lg:col-span-7 astra-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Operational Bureau Wire & Live Directives
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {messages.length} Total Messages Logged
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {messages.map((msg) => {
                    const isFromSenior = msg.senderRole === 'SENIOR_OFFICIAL';
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isFromSenior
                            ? 'bg-indigo-950/20 border-indigo-500/30'
                            : 'bg-blue-950/20 border-blue-500/30'
                        } ${!msg.read ? 'ring-1 ring-amber-400/50' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                                msg.priority === 'URGENT_DIRECTIVE'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  : msg.priority === 'SITREP'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              }`}
                            >
                              {msg.priority.replace('_', ' ')}
                            </span>
                            {msg.firRef && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {msg.firRef}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                            <span className={isFromSenior ? 'text-indigo-300' : 'text-blue-300'}>
                              {msg.senderName}
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                            <span className="text-[var(--text-secondary)]">{msg.receiverName}</span>
                          </div>
                          {msg.subject && (
                            <p className="text-xs font-bold text-[var(--text-primary)] mt-1">
                              {msg.subject}
                            </p>
                          )}
                          <p className="text-xs text-[var(--text-secondary)] mt-1 whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                          <span className="text-[10px] font-mono text-[var(--text-muted)]">
                            Status: {msg.read ? 'Acknowledged' : 'Delivered'}
                          </span>
                          {!msg.read && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(msg.id)}
                              className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300"
                            >
                              Mark as Acknowledged
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {messages.length === 0 && (
                    <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)]">
                      No operational messages on wire yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Quick Broadcast / Sub-Officer Dispatch Selector (5 Cols) */}
              <div className="lg:col-span-5 astra-card p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                  <Send className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Fast Directive Dispatch
                  </h3>
                </div>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                      Recipient Sub-Officer:
                    </label>
                    <select
                      value={selectedSubOfficer?.id || ''}
                      onChange={(e) => {
                        const found = subOfficers.find(o => o.id === e.target.value);
                        setSelectedSubOfficer(found || null);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                      required
                    >
                      <option value="">-- Select Sub-Officer (Inspector) --</option>
                      {subOfficers.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.name} ({o.officerId} - {o.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                      Directive Priority:
                    </label>
                    <select
                      value={directivePriority}
                      onChange={(e) => setDirectivePriority(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                    >
                      <option value="URGENT_DIRECTIVE">🚨 URGENT DIRECTIVE (Priority 1)</option>
                      <option value="CASE_ASSIGNMENT">📋 CASE ASSIGNMENT (Investigation)</option>
                      <option value="ROUTINE">ℹ️ ROUTINE OPERATIONAL NOTE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                      FIR Reference:
                    </label>
                    <input
                      type="text"
                      value={directiveFirRef}
                      onChange={(e) => setDirectiveFirRef(e.target.value)}
                      placeholder="e.g. FIR-2026-DL-00189"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                      Subject / Order Title:
                    </label>
                    <input
                      type="text"
                      value={directiveSubject}
                      onChange={(e) => setDirectiveSubject(e.target.value)}
                      placeholder="e.g. Intercept Surveillance Order"
                      className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)]"
                    />
                  </div>

                  {/* Quick Directive Chips */}
                  <div>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)] mb-1">
                      Quick Directive Templates:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {DIRECTIVE_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setDirectiveSubject(tmpl.subject);
                            setDirectiveContent(tmpl.content);
                            setDirectivePriority(tmpl.priority);
                          }}
                          className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 text-left transition-colors"
                        >
                          {tmpl.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                      Directive Text / Operational Instructions:
                    </label>
                    <textarea
                      rows={4}
                      value={directiveContent}
                      onChange={(e) => setDirectiveContent(e.target.value)}
                      placeholder="Type executive instructions to this investigator..."
                      className="w-full p-2.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || !selectedSubOfficer || !directiveContent.trim()}
                    className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Transmitting...' : 'Dispatch Binding Directive'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ========================================================================= */
        /* CASE B: SUB-OFFICER / INSPECTOR VIEW                                      */
        /* Sub-officers do NOT view other sub-officers.                              */
        /* They see their Commanding Senior Officer and 2-way SITREP Dispatch        */
        /* ========================================================================= */
        <>
          {/* Header */}
          <div className="astra-card p-6 border-l-4 border-l-slate-900 dark:border-l-white bg-[var(--bg-card)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                    REPORTING COMMAND PROTOCOL
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    SECURE BUREAU DIRECTIVES & SITREP CHANNEL
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
                  Senior Officer Directives & Secure Dispatch
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Direct encrypted line to Senior Official desk. Receive operational directives and transmit field situation reports (SITREPs).
                </p>
              </div>

              {/* Inspector's Profile Snapshot with 1-Click Photo Upload */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)]">
                <div className="relative group/myphoto flex-shrink-0">
                  <img
                    src={user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={user?.name}
                    className="w-11 h-11 rounded-full object-cover border border-blue-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => triggerUploadFor(user as UserProfile)}
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/myphoto:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                    title="Change my profile photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[var(--text-primary)]">{user?.name}</p>
                  <p className="text-[10px] font-mono text-blue-400">{user?.officerId} • INSPECTOR</p>
                  <button
                    type="button"
                    onClick={() => triggerUploadFor(user as UserProfile)}
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Upload className="w-2.5 h-2.5" />
                    <span>Upload Personal Photo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Senior Officer Reporting Dossier Card */}
          <div className="astra-card p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-slate-900/40 to-slate-900/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={seniorOfficer.photoUrl}
                    alt={seniorOfficer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md ring-2 ring-indigo-500/30"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-card)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      COMMANDING SENIOR OFFICER • CLEARANCE LEVEL 5
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ACTIVE ON DUTY
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[var(--text-primary)] mt-1">
                    {seniorOfficer.name}
                  </h2>
                  <p className="text-xs font-mono text-indigo-300">
                    {seniorOfficer.designation} • {seniorOfficer.department}
                  </p>
                  <p className="text-[11px] font-mono text-[var(--text-muted)]">
                    Officer Badge: {seniorOfficer.badgeNumber || seniorOfficer.officerId}
                  </p>
                </div>
              </div>

              {/* Direct Official Contact Channels */}
              <div className="flex flex-col sm:flex-row gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase block">HQ Direct Hotline</span>
                  <a href={`tel:${seniorOfficer.phone}`} className="text-indigo-400 hover:underline font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{seniorOfficer.phone}</span>
                  </a>
                </div>

                <div className="p-2.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase block">Executive Email</span>
                  <a href={`mailto:${seniorOfficer.email}`} className="text-indigo-400 hover:underline font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{seniorOfficer.email}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Statutory Jurisdiction: State Cyber & Special Crime Wing • BNSS Interception Authority</span>
              <span className="font-mono text-[11px] text-blue-400">All Field Communications Audited & Timestamped</span>
            </div>
          </div>

          {/* TWO-WAY DISPATCH CONSOLE: Received Directives on Left, Send SITREP on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Directives Received from Senior Officer (7 Cols) */}
            <div className="lg:col-span-7 astra-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Directives Received from {seniorOfficer.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                  Live Dispatch Feed
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {relevantMessages.map((msg) => {
                  const isIncoming = msg.senderRole === 'SENIOR_OFFICIAL';
                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isIncoming
                          ? 'bg-indigo-950/20 border-indigo-500/30'
                          : 'bg-emerald-950/20 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                              msg.priority === 'URGENT_DIRECTIVE'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : msg.priority === 'SITREP'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                            }`}
                          >
                            {msg.priority.replace('_', ' ')}
                          </span>
                          {msg.firRef && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {msg.firRef}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="mt-2">
                        <p className="text-[11px] font-mono font-semibold text-slate-400">
                          From: <strong className={isIncoming ? 'text-indigo-300' : 'text-emerald-300'}>{msg.senderName}</strong>
                        </p>
                        {msg.subject && (
                          <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                            {msg.subject}
                          </p>
                        )}
                        <p className="text-xs text-[var(--text-secondary)] mt-1 whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      </div>

                      {isIncoming && !msg.read && (
                        <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleMarkRead(msg.id)}
                            className="text-[11px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirm & Acknowledge Directive</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {relevantMessages.length === 0 && (
                  <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] space-y-1">
                    <p>No directives recorded for your call sign.</p>
                    <p className="text-[11px]">Use the SITREP console on the right to transmit an update to ACP desk.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Transmit SITREP / Reply to Senior Officer (5 Cols) */}
            <div className="lg:col-span-5 astra-card p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Transmit SITREP to Senior Officer
                </h3>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                    Transmission Type:
                  </label>
                  <select
                    value={directivePriority}
                    onChange={(e) => setDirectivePriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                  >
                    <option value="SITREP">📍 SITUATION REPORT (SITREP)</option>
                    <option value="URGENT_DIRECTIVE">🚨 URGENT ASSISTANCE / CLEARANCE</option>
                    <option value="ROUTINE">ℹ️ INVESTIGATION UPDATE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                    Case / FIR Reference:
                  </label>
                  <input
                    type="text"
                    value={directiveFirRef}
                    onChange={(e) => setDirectiveFirRef(e.target.value)}
                    placeholder="e.g. FIR-2026-DL-00189"
                    className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={directiveSubject}
                    onChange={(e) => setDirectiveSubject(e.target.value)}
                    placeholder="e.g. Outer Ring Road ANPR Triangulation"
                    className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)]"
                  />
                </div>

                {/* Quick SITREP chips */}
                <div>
                  <span className="block text-[10px] font-mono text-[var(--text-muted)] mb-1">
                    Quick Tactical SITREP Templates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SITREP_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setDirectiveSubject(tmpl.subject);
                          setDirectiveContent(tmpl.content);
                          setDirectivePriority(tmpl.priority);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 text-left transition-colors"
                      >
                        {tmpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
                    Situation Report Details:
                  </label>
                  <textarea
                    rows={4}
                    value={directiveContent}
                    onChange={(e) => setDirectiveContent(e.target.value)}
                    placeholder="Enter factual ground observations, suspect triangulation, or warrant requests..."
                    className="w-full p-2.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !directiveContent.trim()}
                  className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Transmitting...' : 'Dispatch SITREP to Senior Officer'}</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* DIRECTIVE & CHAT MODAL (Opened by Senior Officer for specific Sub-Officer) */}
      {/* ========================================================================= */}
      {isModalOpen && selectedSubOfficer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl border border-indigo-500/40 bg-[var(--bg-card)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-slate-900 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedSubOfficer.photoUrl}
                  alt={selectedSubOfficer.name}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-500/50"
                />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span>Dispatch Directive to {selectedSubOfficer.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400">
                      {selectedSubOfficer.officerId}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {selectedSubOfficer.designation} • {selectedSubOfficer.department}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Wire with this Sub-Officer */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-main)]/50 max-h-72">
              {messages
                .filter(
                  m =>
                    (m.senderId === selectedSubOfficer.id && m.receiverRole === 'SENIOR_OFFICIAL') ||
                    (m.receiverId === selectedSubOfficer.id && m.senderRole === 'SENIOR_OFFICIAL')
                )
                .map((msg) => {
                  const isSentByMe = msg.senderRole === 'SENIOR_OFFICIAL';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg border text-xs max-w-[85%] ${
                        isSentByMe
                          ? 'ml-auto bg-indigo-950/30 border-indigo-500/30 text-right'
                          : 'mr-auto bg-blue-950/30 border-blue-500/30 text-left'
                      }`}
                    >
                      <div className={`flex items-center gap-2 mb-1 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-white/10">
                          {msg.priority}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {msg.subject && (
                        <p className="font-bold text-[var(--text-primary)] mb-0.5">{msg.subject}</p>
                      )}
                      <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  );
                })}

              {messages.filter(
                m =>
                  (m.senderId === selectedSubOfficer.id && m.receiverRole === 'SENIOR_OFFICIAL') ||
                  (m.receiverId === selectedSubOfficer.id && m.senderRole === 'SENIOR_OFFICIAL')
              ).length === 0 && (
                <div className="p-6 text-center text-xs font-mono text-[var(--text-muted)]">
                  No previous directives dispatched to this sub-officer. Send the first directive below.
                </div>
              )}
            </div>

            {/* Directive Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border-subtle)] space-y-3 bg-[var(--bg-card)]">
              {/* Directive Templates */}
              <div>
                <span className="block text-[10px] font-mono text-[var(--text-muted)] mb-1">
                  Tactical Directive Templates:
                </span>
                <div className="flex flex-wrap gap-1">
                  {DIRECTIVE_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDirectiveSubject(tmpl.subject);
                        setDirectiveContent(tmpl.content);
                        setDirectivePriority(tmpl.priority);
                      }}
                      className="px-2 py-0.5 rounded bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 text-left transition-colors"
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-0.5">Priority:</label>
                  <select
                    value={directivePriority}
                    onChange={(e) => setDirectivePriority(e.target.value as any)}
                    className="w-full px-2 py-1 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                  >
                    <option value="URGENT_DIRECTIVE">🚨 URGENT DIRECTIVE</option>
                    <option value="CASE_ASSIGNMENT">📋 CASE ASSIGNMENT</option>
                    <option value="ROUTINE">ℹ️ ROUTINE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--text-secondary)] mb-0.5">FIR Ref:</label>
                  <input
                    type="text"
                    value={directiveFirRef}
                    onChange={(e) => setDirectiveFirRef(e.target.value)}
                    placeholder="FIR-2026-DL-00189"
                    className="w-full px-2 py-1 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-mono"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={directiveSubject}
                  onChange={(e) => setDirectiveSubject(e.target.value)}
                  placeholder="Directive Subject..."
                  className="w-full px-2.5 py-1 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] font-medium"
                />
              </div>

              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={directiveContent}
                  onChange={(e) => setDirectiveContent(e.target.value)}
                  placeholder="Type directive to send to investigator..."
                  className="flex-1 p-2 text-xs rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSending || !directiveContent.trim()}
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
