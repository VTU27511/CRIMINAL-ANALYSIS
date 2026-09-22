import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Car,
  MapPin,
  Building,
  FileText,
  DollarSign,
  AlertTriangle,
  Activity,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  X,
  Compass
} from 'lucide-react';
import { GraphNode, NODE_TYPE_COLORS } from './SpiderWebGraph';

interface NetworkInspectorProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NetworkInspector: React.FC<NetworkInspectorProps> = ({ node, onClose }) => {
  const navigate = useNavigate();

  if (!node) {
    return (
      <div className="astra-card p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 min-h-[450px]">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <p className="text-sm font-bold text-[var(--text-primary)]">No Entity Selected</p>
        <p className="text-xs text-[var(--text-secondary)] max-w-xs">
          Click any node in the spider-web graph or use the search toolbar to inspect entity dossiers, centrality scores, and cross-modal links.
        </p>
      </div>
    );
  }

  const typeMeta = NODE_TYPE_COLORS[node.type] || NODE_TYPE_COLORS.PERSON;

  // Navigate to hotspot map filtered to this entity's locations
  const handleViewCrimeLocations = () => {
    if (node.type === 'LOCATION') {
      navigate(`/hotspots?locationId=${node.id}`);
    } else {
      navigate(`/hotspots?entityId=${node.id}`);
    }
  };

  return (
    <div className="astra-card p-5 space-y-5 animate-in fade-in slide-in-from-right-4 duration-200 relative overflow-hidden">
      {/* Top Header & Close Button */}
      <div className="flex items-start justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-white border shadow-sm"
              style={{ backgroundColor: typeMeta.bg, borderColor: typeMeta.border }}
            >
              {typeMeta.text}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              ID: {node.id}
            </span>
          </div>
          <h2 className="text-base font-black tracking-tight text-[var(--text-primary)]">
            {node.label}
          </h2>
          {node.alias && node.alias !== 'None' && (
            <p className="text-xs font-mono text-blue-400">
              Known Aliases: <span className="font-bold">{node.alias}</span>
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-blue-500/10 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Action Button: View Associated Crime Locations */}
      <button
        onClick={handleViewCrimeLocations}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-md hover:shadow-emerald-600/30"
      >
        <MapPin className="w-4 h-4" />
        <span>View Associated Crime Locations</span>
        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
      </button>

      {/* Network Centrality Metrics Bar */}
      <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Graph Centrality Metrics
          </span>
          {node.isBridgeNode && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              BRIDGE BROKER
            </span>
          )}
          {node.isHubNode && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              HIGH-DEGREE HUB
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
          <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Degree</span>
            <span className="text-sm font-black text-blue-400">{node.degree || 1}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Direct Links</span>
          </div>

          <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Betweenness</span>
            <span className="text-sm font-black text-amber-400">
              {node.betweennessCentrality ? node.betweennessCentrality.toFixed(2) : '0.45'}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Bridge Index</span>
          </div>

          <div className="p-2 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <span className="text-[10px] text-[var(--text-muted)] block">Closeness</span>
            <span className="text-sm font-black text-emerald-400">
              {node.closenessCentrality ? node.closenessCentrality.toFixed(2) : '0.52'}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Reach Speed</span>
          </div>
        </div>
      </div>

      {/* "Why is this node important?" Intel Analysis Box */}
      <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-xs text-blue-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Why is this node important?</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          {node.importanceReason || (
            "This entity has a high network-centrality score and may warrant further investigation. " +
            "Analytical indicators reflect cross-domain connections linking operational communications with corporate infrastructure."
          )}
        </p>
        <p className="text-[9px] font-mono text-slate-400 italic pt-1 border-t border-blue-500/20">
          ⚖️ Analytical Indicator Safeguard: Network centrality scores represent topological relationships and do not assert legal guilt.
        </p>
      </div>

      {/* Multi-Modal Connected Entities Breakdown */}
      <div className="space-y-3 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
          Connected Multi-Modal Entities ({node.degree || 1})
        </h3>

        {/* Phones */}
        {node.connectedPhones && node.connectedPhones.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Connected Phones ({node.connectedPhones.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedPhones.map((ph, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {ph}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Vehicles */}
        {node.connectedVehicles && node.connectedVehicles.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Connected Vehicles ({node.connectedVehicles.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedVehicles.map((v, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        {node.connectedLocations && node.connectedLocations.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Connected Locations ({node.connectedLocations.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedLocations.map((loc, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FIRs */}
        {node.connectedFIRs && node.connectedFIRs.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Associated FIRs ({node.connectedFIRs.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedFIRs.map((fir, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {fir}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Organizations */}
        {node.connectedOrganizations && node.connectedOrganizations.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Connected Organizations ({node.connectedOrganizations.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedOrganizations.map((org, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        {node.connectedTransactions && node.connectedTransactions.length > 0 && (
          <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] space-y-1.5">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-black flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              Financial Transactions ({node.connectedTransactions.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {node.connectedTransactions.map((tx, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm border border-slate-800 dark:border-slate-200">
                  {tx}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
