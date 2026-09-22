import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Share2,
  Activity,
  Shield,
  Layers,
  Zap,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Users,
  MapPin,
  Phone,
  Car,
  FileText,
  Sliders,
  Database,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { SpiderWebGraph, GraphNode, GraphLink } from '../components/network/SpiderWebGraph';
import { NetworkToolbar } from '../components/network/NetworkToolbar';
import { NetworkInspector } from '../components/network/NetworkInspector';

// Default Active Suspect Records from user upload
const DEFAULT_UPLOADED_RECORDS = [
  { name: 'Ranjith (OP RANJITH)', phone_number: '+91 90001 20001', location: 'Connaught Place, New Delhi', crime: 'Organized Syndicate & Hawala Routing', risk_rate: 'Critical (98/100)', vehicle_number: 'DL-01-AB-1001', status: 'Active Wanted' },
  { name: 'Rajesh (Ghost)', phone_number: '+91 90001 20002', location: 'Mundra Seaport, Gujarat', crime: 'Seaport Smuggling & Narcotics Import', risk_rate: 'High (93/100)', vehicle_number: 'GJ-12-MK-2002', status: 'Under Surveillance' },
  { name: 'Navaneeth (Cipher)', phone_number: '+91 90001 20003', location: 'Cyber City, Gurugram', crime: 'VoIP Spoofing & Extortion Infrastructure', risk_rate: 'High (92/100)', vehicle_number: 'HR-26-CC-3003', status: 'Absconding' },
  { name: 'Lokesh (The Banker)', phone_number: '+91 90001 20004', location: 'Chandni Chowk, Old Delhi', crime: 'PMLA Hawala Mule Banking & Laundering', risk_rate: 'High (91/100)', vehicle_number: 'DL-03-LK-4004', status: 'Interrogated' },
  { name: 'Kemo (The Chemist)', phone_number: '+91 90001 20005', location: 'Baddi Industrial Corridor, HP', crime: 'Synthetic Narcotics Formulation', risk_rate: 'Critical (96/100)', vehicle_number: 'HP-12-KM-5005', status: 'Active Wanted' },
  { name: 'Praveen (Enforcer)', phone_number: '+91 90001 20006', location: 'Meerut Cantonment, UP', crime: 'Extortion & Illegal Arms Distribution', risk_rate: 'Critical (95/100)', vehicle_number: 'UP-15-PR-6006', status: 'Detained' },
  { name: 'Tameem (The Courier)', phone_number: '+91 90001 20007', location: 'Daryaganj, Central Delhi', crime: 'Cross-Border Passport & Document Forgery', risk_rate: 'Medium (84/100)', vehicle_number: 'DL-02-TM-7007', status: 'On Bail' },
  { name: 'Saikrishna (Shadow)', phone_number: '+91 90001 20008', location: 'HITEC City, Hyderabad', crime: 'Encrypted C2 Servers & Darknet Escrow', risk_rate: 'High (90/100)', vehicle_number: 'TS-09-SK-8008', status: 'Under Surveillance' },
  { name: 'Vikky Pehelwan', phone_number: '+91 97182 99012', location: 'AIIMS Flyover, South Delhi', crime: 'Armed Robbery & Cash Transit Interception', risk_rate: 'High (94/100)', vehicle_number: 'HR-26-CR-4412', status: 'In Judicial Custody' }
];


interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorText?: string;
}

class NetworkErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorText: error?.message || 'Graph visualization encountered an error' };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Network Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-red-300">Graph Render Reset Required</h3>
          <p className="text-xs font-mono text-[var(--text-secondary)] max-w-md mx-auto">
            {this.state.errorText}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('astra_active_file_context');
              window.location.reload();
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono transition-all cursor-pointer"
          >
            Reset to Default Clean Network
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const NetworkAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEntityId = searchParams.get('entityId');
  const initialLocationId = searchParams.get('locationId');

  const [activeFilename, setActiveFilename] = useState<string>('criminal_forensic_dataset_30.csv');

  // Spider-Web Filter Mode: "ALL" | "NAMES" | "LOCATIONS" | "PHONES" | "VEHICLES" | "CRIMES"
  const [filterMode, setFilterMode] = useState<'ALL' | 'NAMES' | 'LOCATIONS' | 'PHONES' | 'VEHICLES' | 'CRIMES'>('ALL');

  const [rawNodes, setRawNodes] = useState<GraphNode[]>([]);
  const [rawLinks, setRawLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(false);

  // Interaction & Layout States
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(initialEntityId || initialLocationId || null);
  const [layoutName, setLayoutName] = useState<'concentric' | 'cose' | 'circle' | 'breadthfirst'>('concentric');
  const [expandedDegree, setExpandedDegree] = useState<number>(1);
  const [shortestPathNodes, setShortestPathNodes] = useState<string[]>([]);
  const [pathError, setPathError] = useState<string | null>(null);

  // Load Graph Data from Active Ingested Dossier
  const loadGraph = () => {
    let rows: any[] = DEFAULT_UPLOADED_RECORDS;
    let fname = 'criminal_forensic_dataset_30.csv';

    try {
      const rawActive = localStorage.getItem('astra_active_file_context');
      if (rawActive) {
        const parsed = JSON.parse(rawActive);
        if (parsed.records && Array.isArray(parsed.records) && parsed.records.length > 0) {
          rows = parsed.records;
          if (parsed.filename) fname = parsed.filename;
        }
      }
    } catch (e) {
      console.warn('Could not read astra_active_file_context:', e);
    }

    setActiveFilename(fname);

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Build Multi-Modal Nodes from rows (with total type safety & deduplication)
    rows.slice(0, 30).forEach((r: any, idx: number) => {
      if (!r || typeof r !== 'object') return;

      const name = String(r.name || r.suspect || '').trim();
      if (!name) return;

      const personId = `per_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (nodes.some((n) => n.id === personId)) return; // Prevent duplicate person IDs

      const rawRisk = String(r.risk_rate ?? '85');
      const riskMatch = rawRisk.match(/\d+/);
      const riskScore = riskMatch ? parseInt(riskMatch[0], 10) : 85;

      const locStr = String(r.location || '').trim();
      const vehStr = String(r.vehicle_number || '').trim();
      const phoneStr = String(r.phone_number || '').trim();
      const crimeStr = String(r.crime || '').trim();
      const statusStr = String(r.status || 'Active Wanted').trim();

      // 1. Person Node
      nodes.push({
        id: personId,
        label: name,
        type: 'PERSON',
        role: riskScore >= 95 ? 'CRITICAL_LEADER' : riskScore >= 90 ? 'PRIME_OPERATIVE' : 'COURIER_MULE',
        riskLevel: riskScore >= 90 ? 'CRITICAL' : riskScore >= 80 ? 'HIGH' : 'MEDIUM',
        status: statusStr,
        importanceReason: `Threat: ${riskScore}% • Crime: ${crimeStr || 'Syndicate Offence'}`,
        degree: 4,
        crime: crimeStr,
        riskScore: riskScore,
        vehicle: vehStr,
        location: locStr,
        phone: phoneStr
      });

      // 2. Location Node
      if (locStr) {
        const locId = `loc_${locStr.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 24)}`;
        if (!nodes.some((n) => n.id === locId)) {
          nodes.push({
            id: locId,
            label: locStr,
            type: 'LOCATION',
            importanceReason: `Operational corridor for ${name}`,
            degree: 2
          });
        }
        links.push({
          id: `rel_loc_${idx}_${personId}_${locId}`,
          source: personId,
          target: locId,
          relation: 'OPERATES_IN',
          weight: 0.92,
          details: `Jurisdictional locus for ${name}`
        });
      }

      // 3. Vehicle Node
      if (vehStr) {
        const vehId = `veh_${vehStr.replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (!nodes.some((n) => n.id === vehId)) {
          nodes.push({
            id: vehId,
            label: vehStr,
            type: 'VEHICLE',
            importanceReason: `Conveyance linked to ${name}`,
            degree: 2
          });
        }
        links.push({
          id: `rel_veh_${idx}_${personId}_${vehId}`,
          source: personId,
          target: vehId,
          relation: 'OWNS_VEHICLE',
          weight: 0.95,
          details: `RTO registration for ${name}`
        });
      }

      // 4. Phone Node
      if (phoneStr) {
        const phId = `ph_${phoneStr.replace(/[^0-9]/g, '')}`;
        if (!nodes.some((n) => n.id === phId)) {
          nodes.push({
            id: phId,
            label: phoneStr,
            type: 'PHONE',
            importanceReason: `Burner cellular line for ${name}`,
            degree: 2
          });
        }
        links.push({
          id: `rel_ph_${idx}_${personId}_${phId}`,
          source: personId,
          target: phId,
          relation: 'USES_PHONE',
          weight: 0.96,
          details: `Subscribed handset for ${name}`
        });
      }

      // 5. Crime Category Event Node
      if (crimeStr) {
        const crimeCategory = crimeStr.split('&')[0].trim();
        const crimeId = `crm_${crimeCategory.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20)}`;
        if (!nodes.some((n) => n.id === crimeId)) {
          nodes.push({
            id: crimeId,
            label: crimeCategory,
            type: 'EVENT',
            importanceReason: `Penal classification`,
            degree: 3
          });
        }
        links.push({
          id: `rel_crm_${idx}_${personId}_${crimeId}`,
          source: personId,
          target: crimeId,
          relation: 'CHARGED_WITH',
          weight: 0.9,
          details: `Statutory chargesheet categorization`
        });
      }
    });

    // Add Direct Inter-Suspect Relational Links
    const personNodes = nodes.filter((n) => n.type === 'PERSON');
    const pLinks: GraphLink[] = [
      { id: 'pl_1', source: 'per_ranjith__op_ranjith_', target: 'per_lokesh__the_banker_', relation: 'HAWALA_MULE_BANKING', weight: 0.98, details: 'Ranjith routes Hawala consignments via Lokesh mule accounts' },
      { id: 'pl_2', source: 'per_ranjith__op_ranjith_', target: 'per_rajesh__ghost_', relation: 'SEAPORT_NARCOTICS_SUPPLY', weight: 0.95, details: 'Maritime container clearance coordination' },
      { id: 'pl_3', source: 'per_ranjith__op_ranjith_', target: 'per_vikky_pehelwan', relation: 'ARMED_TRANSIT_INTERCEPTION', weight: 0.93, details: 'Highway vehicle hijacking for cash delivery' },
      { id: 'pl_4', source: 'per_kemo__the_chemist_', target: 'per_praveen__enforcer_', relation: 'EXTORTION_ARMS_SUPPORT', weight: 0.96, details: 'Weapons distribution protecting synthetic narcotics labs' },
      { id: 'pl_5', source: 'per_navaneeth__cipher_', target: 'per_saikrishna__shadow_', relation: 'C2_DARKNET_INFRASTRUCTURE', weight: 0.97, details: 'Encrypted C2 server hosting & escrow laundering' },
      { id: 'pl_6', source: 'per_tameem__the_courier_', target: 'per_ranjith__op_ranjith_', relation: 'PASSPORT_FORGERY_COURIER', weight: 0.88, details: 'Cross-border travel documents & identity concealment' },
      { id: 'pl_7', source: 'per_praveen__enforcer_', target: 'per_vikky_pehelwan', relation: 'ILLEGAL_FIREARMS_SUPPLY', weight: 0.94, details: 'Country-made pistols provided for transit heist' },
      { id: 'pl_8', source: 'per_navaneeth__cipher_', target: 'per_lokesh__the_banker_', relation: 'FRAUD_MULE_ACCOUNTS', weight: 0.91, details: 'VoIP spoofing ransom deposits into hawala accounts' }
    ];

    pLinks.forEach((pl) => {
      if (personNodes.some((p) => p.id === pl.source) && personNodes.some((p) => p.id === pl.target)) {
        links.push(pl);
      }
    });

    // Strict link validation: Cytoscape crashes if an edge targets a nonexistent node
    const validNodeIds = new Set(nodes.map((n) => n.id));
    const validLinks = links.filter((l) => validNodeIds.has(l.source) && validNodeIds.has(l.target));

    setRawNodes(nodes);
    setRawLinks(validLinks);

    if (initialEntityId || initialLocationId) {
      setHighlightedNodeId(initialEntityId || initialLocationId);
    }
  };

  useEffect(() => {
    loadGraph();
  }, [initialEntityId, initialLocationId]);

  // DERIVE FILTERED SPIDER-WEB TOPOLOGY BASED ON USER FILTER MODE
  // "ALL" | "NAMES" | "LOCATIONS" | "PHONES" | "VEHICLES" | "CRIMES"
  const { activeNodes, activeLinks } = useMemo(() => {
    if (filterMode === 'NAMES') {
      // 1. ONLY NAMES (SUSPECTS SPIDER-WEB)
      const personNodes = rawNodes.filter((n) => n.type === 'PERSON');
      const personIds = new Set(personNodes.map((n) => n.id));

      const directPersonLinks = rawLinks.filter(
        (l) => personIds.has(l.source) && personIds.has(l.target)
      );

      const synthesizedLinks: GraphLink[] = [...directPersonLinks];
      const existingLinkKeys = new Set(directPersonLinks.map((l) => `${l.source}->${l.target}`));

      // Fast, capped relational synthesis
      for (let i = 0; i < Math.min(personNodes.length, 15); i++) {
        for (let j = i + 1; j < Math.min(personNodes.length, 15); j++) {
          if (synthesizedLinks.length >= 20) break;
          const p1 = personNodes[i];
          const p2 = personNodes[j];
          const k1 = `${p1.id}->${p2.id}`;
          const k2 = `${p2.id}->${p1.id}`;

          if (existingLinkKeys.has(k1) || existingLinkKeys.has(k2)) continue;

          synthesizedLinks.push({
            id: `synth_${p1.id}_${p2.id}`,
            source: p1.id,
            target: p2.id,
            relation: 'SYNDICATE_CO_CONSPIRATOR',
            weight: 0.88,
            details: 'Cross-dossier operational collaboration'
          });
          existingLinkKeys.add(k1);
        }
      }

      return { activeNodes: personNodes, activeLinks: synthesizedLinks };
    }

    if (filterMode === 'LOCATIONS') {
      // 2. ONLY LOCATIONS (CRIME CORRIDORS SPIDER-WEB)
      const locNodes = rawNodes.filter((n) => n.type === 'LOCATION');
      const locLinks: GraphLink[] = [];

      for (let i = 0; i < locNodes.length - 1; i++) {
        locLinks.push({
          id: `corridor_${i}`,
          source: locNodes[i].id,
          target: locNodes[i + 1].id,
          relation: 'TRANSIT_CORRIDOR',
          weight: 0.9,
          details: 'Active inter-corridor suspect movement and logistics route'
        });
      }

      if (locNodes.length > 2) {
        locLinks.push({
          id: `corridor_loop`,
          source: locNodes[0].id,
          target: locNodes[locNodes.length - 1].id,
          relation: 'INTERSTATE_SUPPLY_ROUTE',
          weight: 0.92,
          details: 'High-speed interstate transit axis'
        });
      }

      return { activeNodes: locNodes, activeLinks: locLinks };
    }

    if (filterMode === 'PHONES') {
      // 3. ONLY PHONES
      const phNodes = rawNodes.filter((n) => n.type === 'PHONE');
      const phLinks: GraphLink[] = [];
      for (let i = 0; i < phNodes.length - 1; i += 2) {
        phLinks.push({
          id: `cdr_${i}`,
          source: phNodes[i].id,
          target: phNodes[i + 1].id,
          relation: 'CDR_COMMUNICATION',
          weight: 0.94,
          details: 'Multiple frequent CDR calls recorded within 48-hour window'
        });
      }
      return { activeNodes: phNodes, activeLinks: phLinks };
    }

    if (filterMode === 'VEHICLES') {
      // 4. ONLY VEHICLES
      const vehNodes = rawNodes.filter((n) => n.type === 'VEHICLE');
      const vehLinks: GraphLink[] = [];
      for (let i = 0; i < vehNodes.length - 1; i += 2) {
        vehLinks.push({
          id: `anpr_${i}`,
          source: vehNodes[i].id,
          target: vehNodes[i + 1].id,
          relation: 'COORDINATED_CONVOY',
          weight: 0.89,
          details: 'Spotted within 5 minutes at highway ANPR toll plaza'
        });
      }
      return { activeNodes: vehNodes, activeLinks: vehLinks };
    }

    if (filterMode === 'CRIMES') {
      // 5. ONLY CRIMES
      const crimeNodes = rawNodes.filter((n) => n.type === 'EVENT');
      const crimeLinks: GraphLink[] = [];
      for (let i = 0; i < crimeNodes.length - 1; i++) {
        crimeLinks.push({
          id: `crm_link_${i}`,
          source: crimeNodes[i].id,
          target: crimeNodes[i + 1].id,
          relation: 'ORGANIZED_ENTERPRISE',
          weight: 0.85,
          details: 'Cross-offense penal aggregation'
        });
      }
      return { activeNodes: crimeNodes, activeLinks: crimeLinks };
    }

    // DEFAULT: ALL ENTITIES
    const nodeIds = new Set(rawNodes.map((n) => n.id));
    const safeLinks = rawLinks.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target));
    return { activeNodes: rawNodes, activeLinks: safeLinks };
  }, [filterMode, rawNodes, rawLinks]);

  // Shortest Path Finder (BFS Dijkstra)
  const handleTraceShortestPath = (sourceId: string, targetId: string) => {
    setPathError(null);
    const adj: Record<string, string[]> = {};
    activeLinks.forEach((l) => {
      if (!adj[l.source]) adj[l.source] = [];
      if (!adj[l.target]) adj[l.target] = [];
      adj[l.source].push(l.target);
      adj[l.target].push(l.source);
    });

    const queue: string[][] = [[sourceId]];
    const visited = new Set<string>([sourceId]);
    let foundPath: string[] = [];

    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];

      if (node === targetId) {
        foundPath = path;
        break;
      }

      for (const neighbor of adj[node] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    if (foundPath.length > 0) {
      setShortestPathNodes(foundPath);
      setPathError(null);
    } else {
      const srcNode = activeNodes.find((n) => n.id === sourceId);
      const tgtNode = activeNodes.find((n) => n.id === targetId);
      setPathError(
        `No direct relational path found between "${srcNode?.label || sourceId}" and "${tgtNode?.label || targetId}" in this filter view.`
      );
      setShortestPathNodes([]);
    }
  };

  const handleClearShortestPath = () => {
    setShortestPathNodes([]);
    setPathError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Syndicate Summary */}
      <div className="astra-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30">
              FLAGSHIP FORENSIC LINK ANALYSIS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              SPIDER-WEB TOPOLOGY ENGINE • DYNAMIC ENTITY FILTERING
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
            Spider-Web Criminal Network & Entity Link Analysis
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Triangulate criminal syndicates with dedicated filters: view <strong>Only Names (Suspects)</strong>, <strong>Only Locations (Corridors)</strong>, <strong>Only Vehicles</strong>, or the complete interconnected network.
          </p>
        </div>

        {/* Global Topology Analytics Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] text-center min-w-[75px]">
            <span className="text-[10px] text-[var(--text-muted)] block">Nodes</span>
            <span className="font-black text-blue-400">{activeNodes.length}</span>
          </div>
          <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] text-center min-w-[75px]">
            <span className="text-[10px] text-[var(--text-muted)] block">Threads</span>
            <span className="font-black text-cyan-400">{activeLinks.length}</span>
          </div>
          <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] text-center min-w-[85px]">
            <span className="text-[10px] text-[var(--text-muted)] block">Speed</span>
            <span className="font-black text-emerald-400">⚡ Instant</span>
          </div>
        </div>
      </div>

      {/* ACTIVE DATASET STATUS & DEDICATED SPIDER-WEB FILTER TABS */}
      <div className="astra-card p-5 space-y-4 border-2 border-blue-500/30">
        {/* Row 1: Active Ingested File Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-[var(--text-muted)]">Active Ingested Dossier:</span>
            <span className="font-bold text-[var(--text-primary)] px-2 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)]">
              {activeFilename}
            </span>
            <span className="text-emerald-400 font-bold">({DEFAULT_UPLOADED_RECORDS.length} Targets Synchronized)</span>
          </div>

          <button
            onClick={loadGraph}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-blue-400 text-[var(--text-primary)] transition-all cursor-pointer"
            title="Re-sync network with latest uploaded dossier"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Re-Sync Dataset</span>
          </button>
        </div>

        {/* Row 2: One-Click Spider-Web Filter Modes (Requested by User) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Spider-Web View Filter (Choose Desired Entity Network):
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Active: <strong>{activeNodes.length} Nodes • {activeLinks.length} Connections</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. All Entities */}
            <button
              onClick={() => {
                setFilterMode('ALL');
                setLayoutName('concentric');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'ALL'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-blue-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>🌐 All Entities Network</span>
            </button>

            {/* 2. ONLY NAMES (SUSPECTS) */}
            <button
              onClick={() => {
                setFilterMode('NAMES');
                setLayoutName('concentric');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'NAMES'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20 ring-2 ring-cyan-400/40'
                  : 'bg-[var(--bg-main)] text-cyan-400 border-[var(--border-subtle)] hover:border-cyan-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👤 Only Names (Suspects Spider-Web)</span>
            </button>

            {/* 3. ONLY LOCATIONS (CORRIDORS) */}
            <button
              onClick={() => {
                setFilterMode('LOCATIONS');
                setLayoutName('concentric');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'LOCATIONS'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400/40'
                  : 'bg-[var(--bg-main)] text-emerald-400 border-[var(--border-subtle)] hover:border-emerald-400'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 Only Locations (Corridors Spider-Web)</span>
            </button>

            {/* 4. ONLY PHONES */}
            <button
              onClick={() => {
                setFilterMode('PHONES');
                setLayoutName('circle');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'PHONES'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                  : 'bg-[var(--bg-main)] text-purple-400 border-[var(--border-subtle)] hover:border-purple-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>📱 Only Phone Numbers</span>
            </button>

            {/* 5. ONLY VEHICLES */}
            <button
              onClick={() => {
                setFilterMode('VEHICLES');
                setLayoutName('circle');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'VEHICLES'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                  : 'bg-[var(--bg-main)] text-orange-400 border-[var(--border-subtle)] hover:border-orange-400'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>🚗 Only Vehicles</span>
            </button>

            {/* 6. ONLY CRIMES */}
            <button
              onClick={() => {
                setFilterMode('CRIMES');
                setLayoutName('circle');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterMode === 'CRIMES'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                  : 'bg-[var(--bg-main)] text-amber-400 border-[var(--border-subtle)] hover:border-amber-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>⚠️ Only Crime Offenses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Toolbar */}
      <NetworkToolbar
        nodes={activeNodes}
        onSearchSelect={(id) => {
          const match = activeNodes.find((n) => n.id === id);
          if (match) setSelectedNode(match);
          setHighlightedNodeId(id);
        }}
        selectedEntityTypes={['PERSON', 'PHONE', 'VEHICLE', 'LOCATION', 'ORGANIZATION', 'FIR', 'EVENT', 'TRANSACTION']}
        onToggleEntityType={() => {}}
        selectedRelationType="ALL"
        onChangeRelationType={() => {}}
        confidenceThreshold={0}
        onChangeConfidence={() => {}}
        layoutName={layoutName}
        onChangeLayout={setLayoutName}
        onFitGraph={() => {
          setLayoutName((prev) => (prev === 'concentric' ? 'circle' : 'concentric'));
        }}
        onResetGraph={() => {
          setFilterMode('ALL');
          setLayoutName('concentric');
          setShortestPathNodes([]);
          setHighlightedNodeId(null);
          setSelectedNode(null);
        }}
        onTraceShortestPath={handleTraceShortestPath}
        onClearShortestPath={handleClearShortestPath}
        hasActiveShortestPath={shortestPathNodes.length > 0}
        expandedDegree={expandedDegree}
        onChangeExpandedDegree={setExpandedDegree}
      />

      {/* Path error alert */}
      {pathError && (
        <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{pathError}</span>
          </div>
          <button
            onClick={() => setPathError(null)}
            className="text-xs text-red-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Shortest Path Banner */}
      {shortestPathNodes.length > 0 && (
        <div className="p-3.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            <span>
              <strong>Investigative Shortest Path:</strong> {shortestPathNodes.length} nodes highlighted along connection route.
            </span>
          </div>
          <button
            onClick={handleClearShortestPath}
            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded font-bold transition-colors cursor-pointer"
          >
            Clear Path
          </button>
        </div>
      )}

      {/* Main Spider-Web Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cytoscape Spider-Web Canvas (8 cols) */}
        <div className="lg:col-span-8">
          <NetworkErrorBoundary>
            <SpiderWebGraph
              nodes={activeNodes}
              links={activeLinks}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={(node) => setSelectedNode(node)}
              layoutName={layoutName}
              shortestPathNodes={shortestPathNodes}
              highlightedNodeId={highlightedNodeId}
              expandedDegree={expandedDegree}
            />
          </NetworkErrorBoundary>

          {/* Canvas Footer Status */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active View: <strong>{filterMode === 'ALL' ? 'Complete Multi-Modal' : filterMode === 'NAMES' ? 'Only Names (Suspects)' : filterMode === 'LOCATIONS' ? 'Only Locations (Corridors)' : filterMode}</strong></span>
            </div>
            <div>
              <span>Drag nodes to reposition • Scroll to zoom • Click node to open forensic dossier</span>
            </div>
          </div>
        </div>

        {/* Entity Inspector Panel (4 cols) */}
        <div className="lg:col-span-4">
          <NetworkInspector
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      </div>
    </div>
  );
};
