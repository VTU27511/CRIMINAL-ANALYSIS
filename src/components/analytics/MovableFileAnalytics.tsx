import React, { useState, useEffect, useRef, useMemo } from 'react';
import cytoscape, { Core } from 'cytoscape';
import {
  Share2,
  PieChart as PieChartIcon,
  BarChart3,
  Move,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { FIRAnalysisResult, ExtractedEntity, ExtractedRelationship } from '../../types/pipeline';
import { useTheme } from '../../context/ThemeContext';

interface MovableFileAnalyticsProps {
  analysisResult: FIRAnalysisResult;
}

type WidgetId = 'graph' | 'pie' | 'bar';

interface EntityGroup {
  type: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  avgConfidence: number;
  entities: ExtractedEntity[];
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; lightBg: string; lightBorder: string; lightText: string }> = {
  PERSON: {
    bg: '#2563eb',
    border: '#1d4ed8',
    text: '#ffffff',
    lightBg: '#dbeafe',
    lightBorder: '#93c5fd',
    lightText: '#1e3a8a'
  },
  PHONE_NUMBER: {
    bg: '#9333ea',
    border: '#7e22ce',
    text: '#ffffff',
    lightBg: '#f3e8ff',
    lightBorder: '#d8b4fe',
    lightText: '#581c87'
  },
  VEHICLE: {
    bg: '#d97706',
    border: '#b45309',
    text: '#ffffff',
    lightBg: '#fef3c7',
    lightBorder: '#fcd34d',
    lightText: '#78350f'
  },
  LOCATION: {
    bg: '#059669',
    border: '#047857',
    text: '#ffffff',
    lightBg: '#d1fae5',
    lightBorder: '#6ee7b7',
    lightText: '#064e3b'
  },
  ORGANIZATION: {
    bg: '#e11d48',
    border: '#be123c',
    text: '#ffffff',
    lightBg: '#ffe4e6',
    lightBorder: '#fda4af',
    lightText: '#881337'
  },
  BANK_TRANSACTION_ENTITY: {
    bg: '#0d9488',
    border: '#0f766e',
    text: '#ffffff',
    lightBg: '#ccfbf1',
    lightBorder: '#5eead4',
    lightText: '#134e4a'
  },
  OTHER: {
    bg: '#475569',
    border: '#334155',
    text: '#ffffff',
    lightBg: '#f1f5f9',
    lightBorder: '#cbd5e1',
    lightText: '#0f172a'
  }
};

export const MovableFileAnalytics: React.FC<MovableFileAnalyticsProps> = ({ analysisResult }) => {
  const { isDark } = useTheme();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Layout order of widgets (movable / reorderable)
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(['graph', 'pie', 'bar']);
  const [activeTab, setActiveTab] = useState<'all' | WidgetId>('all');
  const [selectedEntity, setSelectedEntity] = useState<ExtractedEntity | null>(null);
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);

  // Group entities by category
  const entityGroups = useMemo<EntityGroup[]>(() => {
    const map = new Map<string, ExtractedEntity[]>();
    analysisResult.entities.forEach((e) => {
      const type = e.entity_type || 'OTHER';
      if (!map.has(type)) map.set(type, []);
      map.get(type)!.push(e);
    });

    const total = analysisResult.entities.length || 1;
    const groups: EntityGroup[] = [];

    map.forEach((items, type) => {
      const colors = COLOR_MAP[type] || COLOR_MAP.OTHER;
      const count = items.length;
      const pct = Number(((count / total) * 100).toFixed(1));
      const avgConfidence = Math.round(items.reduce((acc, curr) => acc + (curr.confidence_score || 85), 0) / count);

      let label = type.replace(/_/g, ' ');
      if (type === 'PERSON') label = 'Suspects & Persons';
      if (type === 'PHONE_NUMBER') label = 'Phones & SIMs';
      if (type === 'VEHICLE') label = 'Vehicles';
      if (type === 'LOCATION') label = 'Crime Locations';
      if (type === 'BANK_TRANSACTION_ENTITY') label = 'Financial Accounts';
      if (type === 'ORGANIZATION') label = 'Enterprises / Shells';

      groups.push({
        type,
        label,
        count,
        pct,
        color: colors.bg,
        textColor: colors.lightText,
        badgeBg: colors.lightBg,
        badgeBorder: colors.lightBorder,
        avgConfidence,
        entities: items
      });
    });

    return groups.sort((a, b) => b.count - a.count);
  }, [analysisResult]);

  // Cytoscape initialization & updates for movable network graph
  useEffect(() => {
    if (!graphContainerRef.current) return;

    // Build elements safely
    const elements: any[] = [];
    const entityMap = new Map<string, string>();

    analysisResult.entities.forEach((ent, idx) => {
      const id = ent.entity_id || `ent_${idx}`;
      const valStr = String(ent.value || '').trim();
      entityMap.set(valStr.toLowerCase(), id);
      const colorInfo = COLOR_MAP[ent.entity_type] || COLOR_MAP.OTHER;

      elements.push({
        group: 'nodes',
        data: {
          id,
          label: valStr,
          type: ent.entity_type,
          confidence: ent.confidence_score || 90,
          color: colorInfo.bg,
          border: colorInfo.border,
          raw: ent
        }
      });
    });

    // Relationships / Edges
    if (analysisResult.relationships && analysisResult.relationships.length > 0) {
      analysisResult.relationships.forEach((rel, idx) => {
        const srcStr = String(rel.source_entity || '').toLowerCase();
        const tgtStr = String(rel.target_entity || '').toLowerCase();
        const sourceId = entityMap.get(srcStr);
        const targetId = entityMap.get(tgtStr);

        if (sourceId && targetId && sourceId !== targetId) {
          elements.push({
            group: 'edges',
            data: {
              id: rel.relationship_id || `rel_${idx}`,
              source: sourceId,
              target: targetId,
              label: (rel.relationship_type || 'CONNECTED').replace(/_/g, ' ')
            }
          });
        }
      });
    }

    // Fallback: connect first person to other entities if no direct relationships found
    if (elements.filter((e) => e.group === 'edges').length === 0 && elements.length > 1) {
      const firstNodeId = elements[0].data.id;
      for (let i = 1; i < elements.length; i++) {
        elements.push({
          group: 'edges',
          data: {
            id: `auto_edge_${i}`,
            source: firstNodeId,
            target: elements[i].data.id,
            label: 'ASSOCIATED'
          }
        });
      }
    }

    if (cyRef.current) {
      try {
        cyRef.current.destroy();
      } catch (e) {}
    }

    try {
      const cy = cytoscape({
        container: graphContainerRef.current,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'border-width': 2,
              'border-color': 'data(border)',
              label: 'data(label)',
              color: isDark ? '#ffffff' : '#090d16',
              'font-size': '10px',
              'font-family': 'monospace',
              'font-weight': 'bold',
              'text-valign': 'bottom',
              'text-margin-y': 4,
              width: 32,
              height: 32,
              'text-background-opacity': isDark ? 0.8 : 0.9,
              'text-background-color': isDark ? '#0c1222' : '#ffffff',
              'text-background-padding': '2px',
              'text-background-shape': 'roundrectangle',
              'text-border-opacity': 0.6,
              'text-border-width': 1,
              'text-border-color': isDark ? '#334155' : '#cbd5e1'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1.5,
              'line-color': isDark ? '#475569' : '#94a3b8',
              'target-arrow-color': isDark ? '#64748b' : '#64748b',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '8px',
              color: isDark ? '#94a3b8' : '#475569',
              'text-rotation': 'autorotate',
              'text-background-opacity': isDark ? 0.8 : 0.85,
              'text-background-color': isDark ? '#0c1222' : '#f8fafc',
              'text-background-padding': '1px'
            }
          },
          {
            selector: ':selected',
            style: {
              'border-width': 4,
              'border-color': '#ffffff',
              'underlay-color': '#3b82f6',
              'underlay-padding': 6,
              'underlay-opacity': 0.5
            }
          }
        ],
        layout: {
          name: 'concentric',
          animate: false,
          padding: 24,
          minNodeSpacing: 35,
          concentric: (node: any) => (node.data('type') === 'PERSON' ? 2 : 1),
          levelWidth: () => 1
        },
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        autoungrabify: false
      });

      cy.on('tap', 'node', (evt) => {
        const node = evt.target;
        setSelectedEntity(node.data('raw'));
      });

      cyRef.current = cy;
    } catch (cyErr) {
      console.warn('Cytoscape render warning:', cyErr);
    }

    return () => {
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [analysisResult, isDark]);

  // Movable / reordering helpers
  const moveWidget = (id: WidgetId, direction: 'left' | 'right') => {
    setWidgetOrder((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleResetLayout = () => {
    if (cyRef.current) {
      cyRef.current.layout({
        name: 'concentric',
        animate: true,
        animationDuration: 300,
        concentric: (node: any) => (node.data('type') === 'PERSON' ? 2 : 1),
        levelWidth: () => 1
      }).run();
      cyRef.current.fit(undefined, 20);
    }
  };

  const handleZoom = (delta: number) => {
    if (cyRef.current) {
      const zoom = cyRef.current.zoom();
      cyRef.current.zoom(zoom + delta);
    }
  };

  // Pie chart calculation with safety against NaN & 360-degree SVG degenerate arcs
  const totalEntities = Math.max(analysisResult.entities.length, 1);
  let cumulativeAngle = 0;
  const pieSlices = entityGroups.map((group, idx) => {
    const rawAngle = (group.count / totalEntities) * 360;
    const angle = entityGroups.length === 1 ? 359.99 : Math.min(rawAngle, 359.99);
    const startAngle = cumulativeAngle;
    cumulativeAngle += rawAngle;
    const isHovered = hoveredPieIndex === idx;

    // SVG arc coordinates
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = (((startAngle + angle) - 90) * Math.PI) / 180;
    const radius = isHovered ? 82 : 78;
    const innerRadius = 45;

    const x1 = 100 + radius * Math.cos(startRad);
    const y1 = 100 + radius * Math.sin(startRad);
    const x2 = 100 + radius * Math.cos(endRad);
    const y2 = 100 + radius * Math.sin(endRad);

    const ix1 = 100 + innerRadius * Math.cos(endRad);
    const iy1 = 100 + innerRadius * Math.sin(endRad);
    const ix2 = 100 + innerRadius * Math.cos(startRad);
    const iy2 = 100 + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}`,
      'Z'
    ].join(' ');

    return {
      ...group,
      pathData,
      isHovered
    };
  });

  // Render individual widget based on id
  const renderWidget = (id: WidgetId) => {
    const isFirst = widgetOrder.indexOf(id) === 0;
    const isLast = widgetOrder.indexOf(id) === widgetOrder.length - 1;

    switch (id) {
      case 'graph':
        return (
          <div
            key="graph"
            className={`astra-card flex flex-col p-4 space-y-3 transition-all ${
              activeTab === 'graph' ? 'col-span-12' : 'col-span-12 lg:col-span-6'
            }`}
          >
            {/* Header with Movable Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <Share2 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Movable Entity Network Graph
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    🖱️ Nodes are freely draggable • Pan & zoom supported
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reorder Left/Right */}
                <button
                  onClick={() => moveWidget('graph', 'left')}
                  disabled={isFirst}
                  title="Move Chart Left"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveWidget('graph', 'right')}
                  disabled={isLast}
                  title="Move Chart Right"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Graph Zoom & Layout Controls */}
                <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />
                <button
                  onClick={() => handleZoom(0.2)}
                  title="Zoom In"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  title="Zoom Out"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetLayout}
                  title="Reset Physics Layout"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cytoscape Container */}
            <div className="relative w-full h-80 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] overflow-hidden">
              <div ref={graphContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* Entity Node Detail Floating Inspector */}
              {selectedEntity && (
                <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-md bg-[var(--bg-card)]/95 border border-[var(--border-subtle)] backdrop-blur shadow-lg flex items-center justify-between text-xs z-10 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono"
                      style={{
                        backgroundColor: COLOR_MAP[selectedEntity.entity_type]?.lightBg || '#f1f5f9',
                        color: COLOR_MAP[selectedEntity.entity_type]?.lightText || '#090d16',
                        border: `1px solid ${COLOR_MAP[selectedEntity.entity_type]?.lightBorder || '#cbd5e1'}`
                      }}
                    >
                      {selectedEntity.entity_type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold text-[var(--text-primary)] truncate">{selectedEntity.value}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedEntity.confidence_score}% Conf.
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-2 flex-shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Legend Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
              <span className="text-[var(--text-muted)] font-semibold">Entity Key:</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-bold dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
                🔵 Suspect
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 font-bold dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800">
                🟣 Phone
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-bold dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800">
                🟠 Vehicle
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800">
                🟢 Location
              </span>
              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-950 border border-teal-300 font-bold dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800">
                💰 Bank / Mule
              </span>
            </div>
          </div>
        );

      case 'pie':
        return (
          <div
            key="pie"
            className={`astra-card flex flex-col p-4 space-y-3 transition-all ${
              activeTab === 'pie' ? 'col-span-12' : 'col-span-12 lg:col-span-3'
            }`}
          >
            {/* Header with Movable Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <PieChartIcon className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Entity Distribution Pie Chart
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    {totalEntities} Forensic Attributes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveWidget('pie', 'left')}
                  disabled={isFirst}
                  title="Move Chart Left"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveWidget('pie', 'right')}
                  disabled={isLast}
                  title="Move Chart Right"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Pie Chart */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {pieSlices.map((slice, idx) => (
                    <path
                      key={idx}
                      d={slice.pathData}
                      fill={slice.color}
                      stroke={isDark ? '#0c1222' : '#ffffff'}
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      onMouseEnter={() => setHoveredPieIndex(idx)}
                      onMouseLeave={() => setHoveredPieIndex(null)}
                    />
                  ))}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  {hoveredPieIndex !== null ? (
                    <>
                      <span className="text-xs font-mono font-black text-[var(--text-primary)]">
                        {pieSlices[hoveredPieIndex].pct}%
                      </span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] truncate max-w-[80px]">
                        {pieSlices[hoveredPieIndex].label}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-base font-black text-[var(--text-primary)] font-mono">
                        {totalEntities}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-mono font-bold">
                        ENTITIES
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Pie Legend Breakdown */}
              <div className="w-full mt-3 space-y-1.5 pt-2 border-t border-[var(--border-subtle)] max-h-36 overflow-y-auto">
                {entityGroups.map((group, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredPieIndex(idx)}
                    onMouseLeave={() => setHoveredPieIndex(null)}
                    className={`flex items-center justify-between text-xs font-mono p-1 rounded transition-colors cursor-pointer ${
                      hoveredPieIndex === idx ? 'bg-[var(--bg-main)] font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                      <span className="text-[11px] text-[var(--text-primary)] truncate">{group.label}</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold flex-shrink-0">
                      {group.count} ({group.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bar':
        return (
          <div
            key="bar"
            className={`astra-card flex flex-col p-4 space-y-3 transition-all ${
              activeTab === 'bar' ? 'col-span-12' : 'col-span-12 lg:col-span-3'
            }`}
          >
            {/* Header with Movable Controls */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <BarChart3 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Forensic Frequency Bar Graph
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    Category Counts & AI Confidence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveWidget('bar', 'left')}
                  disabled={isFirst}
                  title="Move Chart Left"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveWidget('bar', 'right')}
                  disabled={isLast}
                  title="Move Chart Right"
                  className="p-1 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Horizontal Bar Visualizations */}
            <div className="space-y-3 py-1 overflow-y-auto max-h-80">
              {entityGroups.map((group, idx) => {
                const maxCount = Math.max(...entityGroups.map((g) => g.count), 1);
                const barWidth = `${Math.max((group.count / maxCount) * 100, 15)}%`;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-[var(--text-primary)] truncate max-w-[140px]">
                        {group.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[var(--text-primary)]">
                          {group.count} {group.count === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-[9px] px-1 rounded bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-bold">
                          {group.avgConfidence}%
                        </span>
                      </div>
                    </div>

                    {/* Bar track */}
                    <div className="w-full h-3 rounded-full bg-[var(--bg-main)] border border-[var(--border-subtle)] overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{
                          width: barWidth,
                          backgroundColor: group.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Average Confidence Callout */}
            <div className="p-2 rounded bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-secondary)] flex items-center justify-between mt-auto">
              <span className="flex items-center gap-1 font-bold">
                <ShieldAlert className="w-3 h-3 text-slate-500" />
                Model Mean Confidence
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(
                  analysisResult.entities.reduce((acc, e) => acc + (e.confidence_score || 85), 0) /
                    (analysisResult.entities.length || 1)
                )}
                %
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="astra-card p-3 flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-card)]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
            FORENSIC FILE VISUALIZER
          </span>
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
            Uploaded FIR Multi-Modal Analytics
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-[10px] text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Move className="w-3 h-3" />
            Rearrange / Views:
          </span>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]'
            }`}
          >
            All 3 Views
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeTab === 'graph'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]'
            }`}
          >
            Network Graph
          </button>
          <button
            onClick={() => setActiveTab('pie')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeTab === 'pie'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setActiveTab('bar')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              activeTab === 'bar'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-[var(--border-subtle)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)]'
            }`}
          >
            Bar Graph
          </button>
        </div>
      </div>

      {/* Movable Widgets Grid Container */}
      <div className="grid grid-cols-12 gap-4">
        {activeTab === 'all'
          ? widgetOrder.map((widgetId) => renderWidget(widgetId))
          : renderWidget(activeTab)}
      </div>
    </div>
  );
};
