import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Search, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TrafficFlow } from '../../types/network';
import { mockApiService } from '../../services/mockApi';

export const FlowFeaturesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [anomalyOnly, setAnomalyOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<keyof TrafficFlow>('timestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const flows = mockApiService.getTrafficFlows();

  // Filter and sort
  const filteredFlows = useMemo(() => {
    return flows.filter(f => {
      const matchesSearch = 
        f.srcIp.includes(searchTerm) || 
        f.dstIp.includes(searchTerm) || 
        f.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.attackCategory && f.attackCategory.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesProtocol = protocolFilter === 'all' || f.protocol === protocolFilter;
      const matchesAnomaly = !anomalyOnly || f.isSuspicious;

      return matchesSearch && matchesProtocol && matchesAnomaly;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [flows, searchTerm, protocolFilter, anomalyOnly, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredFlows.length / itemsPerPage);
  const paginatedFlows = filteredFlows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof TrafficFlow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCsv = () => {
    const headers = [
      'Timestamp', 'SrcIP', 'DstIP', 'SrcPort', 'DstPort', 'Protocol',
      'DurationMs', 'Packets', 'Bytes', 'PacketRate', 'ByteRate',
      'SYN_Ratio', 'ACK_Ratio', 'RST_Ratio', 'FIN_Ratio', 'IAT_Ms', 'TTL', 'AnomalyScore'
    ];
    const rows = flows.map(f => [
      f.timestamp, f.srcIp, f.dstIp, f.srcPort, f.dstPort, f.protocol,
      f.flowDurationMs, f.totalPackets, f.totalBytes, f.packetRate, f.byteRate,
      f.synRatio, f.ackRatio, f.rstRatio, f.finRatio, f.interArrivalTimeMs, f.ttl, f.anomalyScore
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyberpredict_flow_features_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-xl border border-white/10 overflow-hidden space-y-3 p-5">
      {/* Table Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            Extracted Flow Telemetry Features (17 Dimensions)
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Statistical flow vectors serving as continuous inputs into the temporal world model
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input 
              type="text"
              placeholder="Search IP, Port, Protocol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-cyber-850 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Protocol Filter */}
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="bg-cyber-850 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="SMB">SMB</option>
            <option value="HTTPS">HTTPS</option>
            <option value="DNS">DNS</option>
          </select>

          {/* Anomaly only checkbox */}
          <label className="flex items-center space-x-1.5 text-xs font-mono text-slate-300 cursor-pointer bg-cyber-850 px-2.5 py-1.5 rounded-lg border border-white/10">
            <input 
              type="checkbox" 
              checked={anomalyOnly} 
              onChange={(e) => setAnomalyOnly(e.target.checked)}
              className="rounded bg-cyber-900 border-white/20 text-cyan-500 focus:ring-0"
            />
            <span>Suspicious Only</span>
          </label>

          {/* Export Button */}
          <button
            onClick={exportCsv}
            className="px-2.5 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center space-x-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-cyber-950/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-cyber-900/90 text-slate-400 border-b border-white/10 select-none">
            <tr>
              <th onClick={() => handleSort('timestamp')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Time</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('srcIp')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Source IP:Port</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('dstIp')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Dest IP:Port</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('protocol')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Proto</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('flowDurationMs')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Duration</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('totalPackets')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Packets</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('totalBytes')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Bytes</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('packetRate')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Pkt/s</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('synRatio')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>SYN%</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('rstRatio')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>RST%</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('interArrivalTimeMs')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>IAT(ms)</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('ttl')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>TTL</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th onClick={() => handleSort('anomalyScore')} className="p-2.5 cursor-pointer hover:text-white">
                <div className="flex items-center space-x-1"><span>Risk/Anomaly</span><ArrowUpDown className="w-3 h-3" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {paginatedFlows.map(flow => (
              <tr 
                key={flow.id} 
                className={`hover:bg-white/5 transition-colors ${flow.isSuspicious ? 'bg-red-950/20' : ''}`}
              >
                <td className="p-2.5 text-slate-400">{flow.timestamp}</td>
                <td className="p-2.5 font-bold text-white">
                  {flow.srcIp}:{flow.srcPort}
                </td>
                <td className="p-2.5 text-slate-200">
                  {flow.dstIp}:{flow.dstPort}
                </td>
                <td className="p-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    flow.protocol === 'TCP' ? 'bg-blue-950 text-blue-300' :
                    flow.protocol === 'SMB' ? 'bg-amber-950 text-amber-300' :
                    flow.protocol === 'HTTPS' ? 'bg-emerald-950 text-emerald-300' :
                    'bg-cyber-800 text-slate-300'
                  }`}>
                    {flow.protocol}
                  </span>
                </td>
                <td className="p-2.5">{flow.flowDurationMs}ms</td>
                <td className="p-2.5">{flow.totalPackets}</td>
                <td className="p-2.5">{(flow.totalBytes / 1024).toFixed(1)} KB</td>
                <td className="p-2.5">{flow.packetRate.toFixed(1)}</td>
                <td className="p-2.5">
                  <span className={flow.synRatio > 0.4 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {(flow.synRatio * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="p-2.5">
                  <span className={flow.rstRatio > 0.15 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {(flow.rstRatio * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="p-2.5">{flow.interArrivalTimeMs}</td>
                <td className="p-2.5 text-slate-400">{flow.ttl}</td>
                <td className="p-2.5">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${
                      flow.anomalyScore >= 0.7 ? 'text-red-400' :
                      flow.anomalyScore >= 0.4 ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {(flow.anomalyScore * 100).toFixed(0)}%
                    </span>
                    {flow.isSuspicious && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 uppercase">
                        ALERT
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
        <span>Showing {filteredFlows.length} total active flow vectors</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-cyber-850 hover:bg-cyber-800 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded bg-cyber-850 hover:bg-cyber-800 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
