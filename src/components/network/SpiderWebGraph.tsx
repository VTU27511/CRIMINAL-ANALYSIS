import React, { useEffect, useRef } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { Camera, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface GraphNode {
  id: string;
  label: string;
  type: 'PERSON' | 'PHONE' | 'VEHICLE' | 'LOCATION' | 'ORGANIZATION' | 'FIR' | 'EVENT' | 'TRANSACTION';
  role?: string;
  riskLevel?: string;
  status?: string;
  alias?: string;
  degree?: number;
  degreeCentrality?: number;
  betweennessCentrality?: number;
  closenessCentrality?: number;
  isBridgeNode?: boolean;
  isHubNode?: boolean;
  importanceReason?: string;
  connectedPhones?: string[];
  connectedVehicles?: string[];
  connectedLocations?: string[];
  connectedLocationIds?: string[];
  connectedFIRs?: string[];
  connectedOrganizations?: string[];
  connectedTransactions?: string[];
  [key: string]: any;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  relation: string;
  weight?: number;
  details?: string;
  date?: string;
}

interface SpiderWebGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  layoutName?: 'concentric' | 'cose' | 'circle' | 'breadthfirst';
  shortestPathNodes?: string[]; // Array of node IDs in shortest path
  highlightedNodeId?: string | null;
  expandedDegree?: number; // 1 or 2
}

// Node colors mapping for 8 forensic entity types
export const NODE_TYPE_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  PERSON: { bg: '#2563eb', border: '#60a5fa', glow: 'rgba(59, 130, 246, 0.4)', text: '🔵 Suspect' },
  PHONE: { bg: '#9333ea', border: '#c084fc', glow: 'rgba(168, 85, 247, 0.4)', text: '🟣 Phone / SIM' },
  VEHICLE: { bg: '#ea580c', border: '#fb923c', glow: 'rgba(234, 88, 12, 0.4)', text: '🟠 Vehicle' },
  LOCATION: { bg: '#059669', border: '#34d399', glow: 'rgba(16, 185, 129, 0.4)', text: '🟢 Location' },
  ORGANIZATION: { bg: '#dc2626', border: '#f87171', glow: 'rgba(239, 68, 68, 0.4)', text: '🔴 Organization' },
  FIR: { bg: '#d97706', border: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)', text: '🟡 FIR Dossier' },
  EVENT: { bg: '#475569', border: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)', text: '⚪ Event / Incident' },
  TRANSACTION: { bg: '#0d9488', border: '#2dd4bf', glow: 'rgba(20, 184, 166, 0.4)', text: '💰 Transaction' }
};

export const SpiderWebGraph: React.FC<SpiderWebGraphProps> = ({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  layoutName = 'concentric',
  shortestPathNodes = [],
  highlightedNodeId = null,
  expandedDegree = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert nodes and links to Cytoscape elements
    const elements = [
      ...nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          role: n.role || '',
          degree: n.degree || 1,
          isBridgeNode: n.isBridgeNode ? 'true' : 'false',
          isHubNode: n.isHubNode ? 'true' : 'false',
          raw: n
        }
      })),
      ...links.map((l) => ({
        data: {
          id: l.id || `edge_${l.source}_${l.target}`,
          source: l.source,
          target: l.target,
          label: l.relation,
          weight: l.weight || 0.8,
          raw: l
        }
      }))
    ];

    // Background and label colors based on theme
    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const edgeColor = isDark ? '#334155' : '#cbd5e1';
    const edgeTextColor = isDark ? '#94a3b8' : '#64748b';

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        // Base Node Style
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'font-family': 'JetBrains Mono, monospace, system-ui',
            'font-size': '10px',
            'font-weight': 'bold',
            color: textColor,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-opacity': isDark ? 0.7 : 0.85,
            'text-background-color': isDark ? '#0b1120' : '#ffffff',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            width: (ele: any) => {
              const deg = ele.data('degree') || 1;
              return Math.min(52, Math.max(28, 26 + deg * 4));
            },
            height: (ele: any) => {
              const deg = ele.data('degree') || 1;
              return Math.min(52, Math.max(28, 26 + deg * 4));
            },
            'background-color': (ele: any) => {
              const t = ele.data('type');
              return NODE_TYPE_COLORS[t]?.bg || '#3b82f6';
            },
            'border-width': 2.5,
            'border-color': (ele: any) => {
              const t = ele.data('type');
              return NODE_TYPE_COLORS[t]?.border || '#60a5fa';
            },
            'transition-property': 'background-color, border-color, width, height, opacity',
            'transition-duration': 0.2
          }
        },
        // Bridge / High-Centrality Glow
        {
          selector: 'node[isBridgeNode = "true"]',
          style: {
            'border-width': 4,
            'border-style': 'double',
            'border-color': '#f59e0b'
          }
        },
        // Hub Nodes
        {
          selector: 'node[isHubNode = "true"]',
          style: {
            'border-width': 4.5,
            'border-color': '#38bdf8'
          }
        },
        // Base Edge Style (Curved Bezier spider-web threads)
        {
          selector: 'edge',
          style: {
            width: (ele: any) => Math.max(1.5, (ele.data('weight') || 0.8) * 3),
            'line-color': edgeColor,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': edgeColor,
            'arrow-scale': 0.8,
            label: 'data(label)',
            'font-family': 'JetBrains Mono, monospace',
            'font-size': '8px',
            'font-weight': 'normal',
            color: edgeTextColor,
            'text-rotation': 'autorotate',
            'text-background-opacity': isDark ? 0.75 : 0.85,
            'text-background-color': isDark ? '#020617' : '#ffffff',
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            opacity: 0.75
          }
        },
        // Node Type Specific Shapes
        {
          selector: 'node[type = "PERSON"]',
          style: { shape: 'ellipse' }
        },
        {
          selector: 'node[type = "PHONE"]',
          style: { shape: 'diamond' }
        },
        {
          selector: 'node[type = "VEHICLE"]',
          style: { shape: 'round-rectangle' }
        },
        {
          selector: 'node[type = "LOCATION"]',
          style: { shape: 'hexagon' }
        },
        {
          selector: 'node[type = "ORGANIZATION"]',
          style: { shape: 'barrel' }
        },
        {
          selector: 'node[type = "FIR"]',
          style: { shape: 'star' }
        },
        {
          selector: 'node[type = "EVENT"]',
          style: { shape: 'round-diamond' }
        },
        {
          selector: 'node[type = "TRANSACTION"]',
          style: { shape: 'octagon' }
        },
        // Selected Node Highlight
        {
          selector: 'node:selected',
          style: {
            'border-width': 5,
            'border-color': '#ffffff',
            'background-color': '#2563eb',
            'underlay-color': '#3b82f6',
            'underlay-padding': 8,
            'underlay-opacity': 0.5
          }
        },
        // Highlighted / Focused Node
        {
          selector: '.highlighted',
          style: {
            'border-color': '#06b6d4',
            'border-width': 5,
            'underlay-color': '#06b6d4',
            'underlay-padding': 10,
            'underlay-opacity': 0.6
          }
        },
        // Dimmed Non-Selected Elements
        {
          selector: '.dimmed',
          style: {
            opacity: 0.15
          }
        },
        // Shortest Path Highlight (Neon Cyan spider-web thread)
        {
          selector: '.shortest-path-node',
          style: {
            'border-color': '#06b6d4',
            'border-width': 5,
            'underlay-color': '#06b6d4',
            'underlay-padding': 8,
            'underlay-opacity': 0.6
          }
        },
        {
          selector: '.shortest-path-edge',
          style: {
            'line-color': '#06b6d4',
            'target-arrow-color': '#06b6d4',
            width: 4.5,
            opacity: 1.0,
            'underlay-color': '#06b6d4',
            'underlay-padding': 3,
            'underlay-opacity': 0.5
          }
        }
      ]
    });

    // Layout configuration
    applyLayout(cy, layoutName);

    // Event handlers
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const rawData = node.data('raw') as GraphNode;
      onSelectNode(rawData);

      // Highlight neighborhood
      cy.elements().removeClass('dimmed');
      const neighborhood = node.neighborhood().add(node);
      cy.elements().not(neighborhood).addClass('dimmed');
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        // Clicked background canvas
        onSelectNode(null);
        cy.elements().removeClass('dimmed');
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodes, links, isDark]);

  // Layout switcher
  useEffect(() => {
    if (cyRef.current) {
      applyLayout(cyRef.current, layoutName);
    }
  }, [layoutName]);

  // Shortest Path Highlighting
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.elements().removeClass('shortest-path-node shortest-path-edge dimmed');

    if (shortestPathNodes && shortestPathNodes.length > 1) {
      cy.elements().addClass('dimmed');
      const pathEles = cy.collection();

      shortestPathNodes.forEach((id) => {
        const nodeEle = cy.$id(id);
        if (nodeEle.length > 0) {
          nodeEle.removeClass('dimmed').addClass('shortest-path-node');
          pathEles.merge(nodeEle);
        }
      });

      // Highlight connecting edges between sequential path nodes
      for (let i = 0; i < shortestPathNodes.length - 1; i++) {
        const u = shortestPathNodes[i];
        const v = shortestPathNodes[i + 1];
        const edge = cy.edges().filter((e) => {
          const src = e.source().id();
          const tgt = e.target().id();
          return (src === u && tgt === v) || (src === v && tgt === u);
        });
        edge.removeClass('dimmed').addClass('shortest-path-edge');
        pathEles.merge(edge);
      }

      // Smoothly zoom and fit the entire shortest path into view
      if (pathEles.length > 0) {
        cy.animate({
          fit: { eles: pathEles, padding: 80 },
          duration: 500
        });
      }
    }
  }, [shortestPathNodes]);

  // Highlight specific node from prop or search (guarded when shortest path is active)
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    // Do not override shortest path highlighting
    if (shortestPathNodes && shortestPathNodes.length > 1) return;

    cy.nodes().removeClass('highlighted');

    const targetId = selectedNodeId || highlightedNodeId;
    if (targetId) {
      const targetNode = cy.$id(targetId);
      if (targetNode.length > 0) {
        targetNode.addClass('highlighted');
        cy.animate({
          center: { eles: targetNode },
          zoom: Math.max(1.2, cy.zoom()),
          duration: 400
        });

        // Highlight neighborhood based on expandedDegree
        cy.elements().removeClass('dimmed');
        let neighbors = targetNode.neighborhood();
        if (expandedDegree >= 2) {
          neighbors = neighbors.add(neighbors.neighborhood());
        }
        const cluster = targetNode.add(neighbors);
        cy.elements().not(cluster).addClass('dimmed');
      }
    } else {
      cy.elements().removeClass('dimmed');
    }
  }, [selectedNodeId, highlightedNodeId, expandedDegree, shortestPathNodes]);

  const activeLayoutRef = useRef<any>(null);

  const applyLayout = (cy: Core, layout: string) => {
    if (activeLayoutRef.current) {
      try {
        activeLayoutRef.current.stop();
      } catch (e) {}
    }

    let layoutOptions: any;

    if (layout === 'concentric') {
      // Spider-Web concentric rings: High centrality / Bridge nodes at center, radiating outward
      layoutOptions = {
        name: 'concentric',
        concentric: (node: any) => {
          const raw = node.data('raw');
          if (raw?.isBridgeNode && raw?.isHubNode) return 10;
          if (raw?.isHubNode) return 8;
          if (raw?.isBridgeNode) return 7;
          return raw?.degree || 1;
        },
        levelWidth: () => 2,
        minNodeSpacing: 60,
        animate: false,
        fit: true,
        padding: 40
      };
    } else if (layout === 'cose') {
      // Fast, non-blocking Physics Force-directed CoSE layout
      layoutOptions = {
        name: 'cose',
        animate: false,
        fit: true,
        padding: 40,
        nodeRepulsion: 12000,
        idealEdgeLength: 90,
        edgeElasticity: 0.2,
        gravity: 0.8,
        numIter: 150
      };
    } else if (layout === 'circle') {
      layoutOptions = {
        name: 'circle',
        animate: false,
        fit: true,
        padding: 40
      };
    } else {
      layoutOptions = {
        name: 'breadthfirst',
        directed: false,
        animate: false,
        fit: true,
        padding: 40
      };
    }

    const l = cy.layout(layoutOptions);
    activeLayoutRef.current = l;
    l.run();
  };

  return (
    <div className="relative w-full h-[620px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] overflow-hidden shadow-inner">
      {/* Spider-Web Background Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, transparent 70%),
                            repeating-radial-gradient(circle at center, transparent 0, transparent 40px, rgba(59, 130, 246, 0.2) 41px, transparent 42px)`
        }}
      />

      {/* Interactive Cytoscape Canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Canvas Watermark Badge */}
      <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--bg-card)]/80 backdrop-blur-sm border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>SPIDER-WEB TOPOLOGY ENGINE • {nodes.length} NODES • {links.length} RELATIONS</span>
      </div>

      {/* Snapshot / Download Graph Button */}
      <button
        type="button"
        onClick={() => {
          if (!cyRef.current) return;
          try {
            const png64 = cyRef.current.png({ full: true, bg: isDark ? '#0b1329' : '#ffffff', scale: 2 });
            const a = document.createElement('a');
            a.href = png64;
            a.download = `criminal_spider_web_graph_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } catch (e) {
            console.warn('Graph PNG export error:', e);
          }
        }}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold rounded bg-blue-600/90 hover:bg-blue-500 text-white backdrop-blur-md shadow-md transition-all cursor-pointer"
        title="Download Spider-Web Network Graph as high-resolution PNG image"
      >
        <Camera className="w-3.5 h-3.5" />
        <span>Download Graph Image</span>
      </button>
    </div>
  );
};
