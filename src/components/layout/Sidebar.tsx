import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Share2,
  Bot,
  TrendingUp,
  MapPin,
  Sparkles,
  Users,
  User,
  Shield,
  Settings,
  ShieldAlert,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
  roleReq?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isSeniorOfficial } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'OPERATIONAL COMMAND',
      items: [
        { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
        { label: 'FIR Dossier Registry', path: '/fir', icon: FileText, badge: '4 New' },
        { label: 'Upload / Ingest FIR', path: '/fir/upload', icon: UploadCloud },
        { label: 'Crime Hotspots Map', path: '/hotspots', icon: MapPin },
        { label: 'Entity Link Network', path: '/network', icon: Share2 }
      ]
    },
    {
      title: 'AI INTELLIGENCE & ANALYTICS',
      items: [
        { label: 'Investigation Copilot', path: '/investigation-assistant', icon: Bot, badge: 'AI' },
        { label: 'Crime Analytics & Trends', path: '/crime-analytics', icon: TrendingUp },
        { label: 'Predictive Risk Radar', path: '/predictions', icon: Sparkles }
      ]
    },
    {
      title: 'ORGANIZATION & CONTROLS',
      items: [
        ...(isSeniorOfficial
          ? [
              {
                label: 'Sub-Officers & Directives',
                path: '/officers',
                icon: Users,
                badge: 'HQ Command'
              },
              {
                label: 'Senior Officer Profile',
                path: '/profile?role=SENIOR_OFFICIAL',
                icon: Shield,
                badge: 'ACP'
              }
            ]
          : []),
        {
          label: 'My Officer Profile',
          path: '/profile',
          icon: User
        },
        { label: 'System Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 border-[var(--border-subtle)] bg-[var(--bg-card)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Officer Active Badge */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-card)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-[10px] font-mono text-[var(--text-muted)] truncate">{user?.officerId}</p>
            <span className="inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-700 dark:border-slate-200">
              {user?.role === 'SENIOR_OFFICIAL' ? 'SR. OFFICIAL' : 'INSPECTOR'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--text-muted)]">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-sm dark:bg-slate-800 dark:text-white'
                          : 'text-[var(--text-secondary)] hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                              isActive
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-200 text-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:group-hover:bg-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Footer Badge */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/50">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3 text-slate-500" />
              RESTRICTED LE-NETWORK
            </span>
            <span className="text-emerald-500 font-bold">ENC-AES256</span>
          </div>
        </div>
      </aside>
    </>
  );
};
