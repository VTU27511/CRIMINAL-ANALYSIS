import React, { useEffect, useRef } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubgraphNode {
  id: string;
  type: string;
  name: string;
  details?: string;
}

interface SubgraphEdge {
  source: string;
  target: string;
  relation: string;
  weight?: number;
  details?: string;
  stepNumber?: number;
}

interface EmbeddedSubgraphProps {
  nodes: SubgraphNode[];
  edges: SubgraphEdge[];
  title?: string;
}

const TYPE_COLORS: Record<string, string> = {
  Person: '#3b82f6',
  Phone: '#a855f7',
  Vehicle: '#f97316',
  Location: '#10b981',
  Organization: '#ef4444',
  FIR: '#f59e0b',
  Transaction: '#14b8a6',
  Event: '#64748b'
};

export const EmbeddedSubgraph: React.FC<EmbeddedSubgraphProps> = ({ nodes, edges, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

    // Convert to Cytoscape elements
    const cyElements: cytoscape.ElementDefinition[] = [
      ...nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.name.length > 16 ? n.name.substring(0, 14) + '...' : n.name,
          type: n.type,
          color: TYPE_COLORS[n.type] || '#3b82f6',
          fullName: n.name,
          details: n.details || ''
        }
      })),
      ...edges.map((e, idx) => ({
        data: {
          id: `edge_${e.source}_${e.target}_${idx}`,
          source: e.source,
          target: e.target,
          label: e.stepNumber ? `Step ${e.stepNumber}: ${e.relation}` : e.relation,
          weight: e.weight || 1.0,
          isStep: Boolean(e.stepNumber)
        }
      }))
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#ffffff',
            'font-size': '10px',
            'font-family': 'monospace',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'text-background-color': 'rgba(15, 23, 42, 0.85)',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'width': 28,
            'height': 28,
            'border-width': 2,
            'border-color': '#ffffff',
            'border-opacity': 0.8
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#3b82f6',
            'target-arrow-color': '#3b82f6',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'font-family': 'monospace',
            'color': '#93c5fd',
            'text-background-color': 'rgba(15, 23, 42, 0.9)',
            'text-background-opacity': 0.9,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'edge[?isStep]',
          style: {
            'width': 3.5,
            'line-color': '#f59e0b',
            'target-arrow-color': '#f59e0b',
            'color': '#fbbf24',
            'font-weight': 'bold'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: false,
        padding: 20,
        componentSpacing: 40
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [nodes, edges]);

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.25);
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
    }
  };

  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 20);
    }
  };

  const handleOpenFull = () => {
    if (nodes.length > 0) {
      navigate(`/network?focusNode=${nodes[0].id}`);
    } else {
      navigate('/network');
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-blue-500/30 bg-slate-950/80 overflow-hidden shadow-md">
      {/* Header bar */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-blue-500/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase text-blue-300">
            {title || 'INTERACTIVE FORENSIC SUBGRAPH'} ({nodes.length} Nodes, {edges.length} Edges)
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Fit Graph"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={handleOpenFull}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-[9px] font-mono transition-colors"
            title="Open in Full Network Analysis"
          >
            <Maximize2 className="w-2.5 h-2.5" />
            <span>Full Graph</span>
          </button>
        </div>
      </div>

      {/* Cytoscape Container */}
      <div ref={containerRef} className="w-full h-[220px] bg-slate-950/60" />

      {/* Footer Legend */}
      <div className="px-2.5 py-1 bg-slate-900/50 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[9px] font-mono text-slate-400">
        <span className="text-slate-500 font-semibold">Entity Classes:</span>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{type}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
