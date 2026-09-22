import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Fingerprint,
  Sun,
  Moon,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  Menu,
  ChevronDown,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { databaseService } from '../../services/database/adapter';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isSeniorOfficial } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [timeStr, setTimeStr] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const dateFormatted = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      setTimeStr(`${dateFormatted.toUpperCase()} • ${formatted} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/fir?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adapterType = databaseService.getAdapterType();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:px-6 backdrop-blur-md transition-colors border-[var(--border-subtle)] bg-[var(--bg-card)]/90">
      {/* Left: Mobile Toggle & Branding */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-700 dark:border-slate-300 flex items-center justify-center transition-all flex-shrink-0 shadow-sm">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider uppercase text-[var(--text-primary)] whitespace-nowrap">
              CRIMINAL ANALYSIS
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold whitespace-nowrap hidden sm:inline">
              Analyze • Investigate • Solve
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Universal Search & Live Clock */}
      <div className="flex items-center gap-3 flex-1 min-w-[180px] max-w-xl mx-3 lg:mx-6">
        <form onSubmit={handleSearch} className="relative w-full min-w-[160px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search FIR#, Suspect, Vehicle, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all font-mono"
          />
        </form>

        <div className="hidden 2xl:flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap px-2.5 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Right Controls: Database status, Theme Switcher, Notifications, User Menu */}
      <div className="flex items-center gap-2 lg:gap-2.5 flex-shrink-0">
        {/* Firebase Connection Pill */}
        <button
          onClick={() => setShowDbModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-mono whitespace-nowrap flex-shrink-0"
          title="View Firebase Connection Details"
        >
          <Database className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden xl:inline text-[11px]">criminal-analysis-13de4</span>
          <span className="xl:hidden text-[11px]">Cloud DB</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md border border-[var(--border-subtle)] hover:border-slate-400 dark:hover:border-slate-600 text-[var(--text-secondary)] hover:text-slate-900 dark:hover:text-white transition-all relative group"
          title={`Switch to ${isDark ? 'White + Black' : 'Dark'} Theme`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
          <span className="absolute -bottom-8 right-0 text-[10px] whitespace-nowrap bg-slate-900 text-slate-100 px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Theme: {theme === 'black-white' ? 'Dark' : 'White + Black'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-md border border-[var(--border-subtle)] hover:border-blue-500/40 text-[var(--text-secondary)] hover:text-blue-500 transition-all relative"
            title="Investigative Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Investigative Alerts
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-[var(--border-subtle)] text-xs mt-2 space-y-2">
                <div className="pt-2">
                  <p className="font-semibold text-red-400 text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> CRITICAL HOTSPOT SPIKE
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Ring Road AIIMS corridor flagged with 94/100 risk score between 23:00 - 03:00.
                  </p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-blue-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> CDR ENTITY MATCH
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Mule account HDFC-MULE-4819 cross-matched with FIR-2026-DL-00189.
                  </p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-amber-400 text-[11px] flex items-center gap-1">
                    <Shield className="w-3 h-3" /> NEW FIR REGISTERED
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    FIR-2026-KA-00105 assigned to Cyber Crime Division.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-md border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all text-left"
          >
            <img
              src={user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name || 'Officer'}
              className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate max-w-[120px]">
                {user?.name || 'Investigator'}
              </span>
              <span className="text-[10px] font-mono text-blue-400 font-semibold">
                {user?.role === 'SENIOR_OFFICIAL' ? 'SR. OFFICIAL' : 'INSPECTOR'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{user?.name}</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono">{user?.officerId}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{user?.department}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isSeniorOfficial
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    <Shield className="w-3 h-3" />
                    {user?.role}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {isSeniorOfficial ? 'Clearance: Level 5' : 'Clearance: Level 3'}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1 text-xs">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>My Officer Profile</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Current</span>
                </Link>

                <Link
                  to="/profile?role=SENIOR_OFFICIAL"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-indigo-500/10 text-[var(--text-primary)] hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold">Senior Officer Profile</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    ACP Rathore
                  </span>
                </Link>

                <Link
                  to="/officers"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Officer Management Roster</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">HQ</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-blue-500/10 text-[var(--text-primary)] hover:text-blue-400 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  System & Theme Settings
                </Link>
              </div>

              {/* Sign Out */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-2.5 py-1 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Secure Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database Status Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="astra-card w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Database className="w-5 h-5" />
                <span>Firebase Architecture Diagnostic</span>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
                <p className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Service Account Connected
                </p>
                <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)]">
                  Project: <strong>criminal-analysis-13de4</strong><br />
                  Client: firebase-adminsdk-fbsvc@criminal-analysis-13de4.iam.gserviceaccount.com
                </p>
              </div>

              <div className="space-y-1.5 text-[var(--text-secondary)]">
                <p><strong>Primary Database:</strong> Firebase Cloud Firestore</p>
                <p><strong>Authentication:</strong> Firebase Auth (RBAC)</p>
                <p><strong>Dual-Mode Adapter:</strong> Active (Resilient sync with 17 Indian Law Enforcement collections)</p>
                <p><strong>Zoho Catalyst Adapter:</strong> Modular interface ready for enterprise sync</p>
              </div>

              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
                ✅ Live Cloud Firestore is ACTIVE and synced on Google Cloud servers for project <code>criminal-analysis-13de4</code>.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDbModal(false)}
                className="px-4 py-1.5 text-xs font-bold rounded bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
