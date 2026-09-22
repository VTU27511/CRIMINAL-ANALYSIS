import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Binary, 
  TrendingUp, 
  Network, 
  Cpu, 
  BarChart3, 
  HelpCircle, 
  Grid3X3, 
  BellRing, 
  ShieldCheck, 
  FileText, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';

export const Sidebar: React.FC = () => {
  const { currentScenario, acknowledgedAlertIds } = useCyberPredict();
  const unacknowledgedCount = Math.max(0, 3 - acknowledgedAlertIds.length);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/traffic', label: 'Traffic Analysis', icon: Binary, badge: 'PCAP/CSV' },
    { to: '/forecast', label: 'Attack Forecast', icon: TrendingUp, badge: 'Primary' },
    { to: '/topology', label: 'Network Topology', icon: Network, badge: currentScenario.suspiciousHostsCount > 0 ? `${currentScenario.suspiciousHostsCount} Alert` : null, badgeColor: 'bg-red-950 text-red-400 border-red-800' },
    { to: '/world-model', label: 'World Model', icon: Cpu, badge: 'AI' },
    { to: '/models', label: 'Model Evaluation', icon: BarChart3, badge: null },
    { to: '/explainability', label: 'Explainability', icon: HelpCircle, badge: 'SHAP' },
    { to: '/mitre', label: 'MITRE ATT&CK', icon: Grid3X3, badge: null },
    { to: '/alerts', label: 'Alert Center', icon: BellRing, badge: unacknowledgedCount > 0 ? `${unacknowledgedCount}` : null, badgeColor: 'bg-red-500 text-white font-bold' },
    { to: '/recommendations', label: 'Defensive Actions', icon: ShieldCheck, badge: null },
    { to: '/reports', label: 'Reports', icon: FileText, badge: 'Export' },
    { to: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-cyber-900/95 border-r border-white/10 flex flex-col justify-between shrink-0 h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
          SOC Operations
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-cyan-400" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  item.badgeColor || 'bg-cyber-800 text-slate-300 border-white/10'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Telemetry Card */}
      <div className="p-3 border-t border-white/10 bg-cyber-950/60 m-2 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            World Model
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-1 leading-snug">
          Temporal Transformer v2.1 (Autoregressive Rollout)
        </p>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
          <span>Latency: 14.8ms</span>
          <span>SIH-2024 / SOC</span>
        </div>
      </div>
    </aside>
  );
};
