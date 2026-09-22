import React from 'react';
import { NetworkTopologyView } from '../components/topology/NetworkTopologyView';
import { mockApiService } from '../services/mockApi';
import { Server, ShieldAlert, Radio, Database } from 'lucide-react';

export const TopologyPage: React.FC = () => {
  const topology = mockApiService.getNetworkTopology();

  return (
    <div className="space-y-6">
      <NetworkTopologyView />

      {/* Network Segment Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Radio className="w-4 h-4" />
            <span>Perimeter / DMZ Subnet</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Gateway 192.168.1.1, Host-01 (DMZ Web), Host-02 (API). External interface under active SYN flood telemetry evaluation.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
            <span>Isolation Ready: Yes</span>
            <span className="text-orange-400">Threat Level: Elevated</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-bold uppercase">
            <Server className="w-4 h-4" />
            <span>Internal Core Subnet</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Server-01 (10.0.2.10), Server-02 (Auth/DC 10.0.2.20). East-west microsegmentation policy active.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
            <span>Predicted Target: Server-01</span>
            <span className="text-red-400">Pivot Risk: 87%</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
            <Database className="w-4 h-4" />
            <span>Secure Data Vault</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            Database-01 (10.0.3.50). Isolated PostgreSQL enterprise cluster. Continuous egress entropy monitoring engaged.
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex justify-between">
            <span>Exfil Watch: Active</span>
            <span className="text-emerald-400">Direct Access: Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
};
