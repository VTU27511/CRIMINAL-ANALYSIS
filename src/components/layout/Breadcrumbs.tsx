import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROUTE_NAME_MAP: Record<string, string> = {
  dashboard: 'Command Center',
  fir: 'FIR Dossier Registry',
  upload: 'Upload FIR',
  hotspots: 'Crime Hotspots Map',
  network: 'Entity Link Network',
  'investigation-assistant': 'Investigation Copilot',
  'crime-analytics': 'Crime Analytics & Trends',
  predictions: 'Predictive Risk Radar',
  officers: 'Officer Roster & Access',
  profile: 'Officer Profile',
  settings: 'System Settings'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  const userDisplayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Officer Profile');

  return (
    <nav className="flex items-center space-x-2 text-xs font-mono text-[var(--text-muted)] py-3 px-4 lg:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]">
      <Link
        to="/profile"
        className="flex items-center gap-1.5 hover:text-blue-500 transition-colors font-semibold text-[var(--text-primary)]"
        title="View Officer Profile"
      >
        <User className="w-3.5 h-3.5 text-blue-500" />
        <span className="truncate max-w-[160px]">{userDisplayName}</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = ROUTE_NAME_MAP[segment] || segment.toUpperCase();

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-blue-500 truncate max-w-[200px]">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-blue-500 transition-colors truncate max-w-[150px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
