import React, { useState } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  GitBranch,
  Filter,
  Layers,
  Route,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';
import { GraphNode, NODE_TYPE_COLORS } from './SpiderWebGraph';

interface NetworkToolbarProps {
  nodes: GraphNode[];
  onSearchSelect: (nodeId: string) => void;
  selectedEntityTypes: string[];
  onToggleEntityType: (type: string) => void;
  selectedRelationType: string;
  onChangeRelationType: (rel: string) => void;
  confidenceThreshold: number;
  onChangeConfidence: (val: number) => void;
  layoutName: 'concentric' | 'cose' | 'circle' | 'breadthfirst';
  onChangeLayout: (layout: 'concentric' | 'cose' | 'circle' | 'breadthfirst') => void;
  onFitGraph: () => void;
  onResetGraph: () => void;
  onTraceShortestPath: (sourceId: string, targetId: string) => void;
  onClearShortestPath: () => void;
  hasActiveShortestPath: boolean;
  expandedDegree: number;
  onChangeExpandedDegree: (deg: number) => void;
}

export const NetworkToolbar: React.FC<NetworkToolbarProps> = ({
  nodes,
  onSearchSelect,
  selectedEntityTypes,
  onToggleEntityType,
  selectedRelationType,
  onChangeRelationType,
  confidenceThreshold,
  onChangeConfidence,
  layoutName,
  onChangeLayout,
  onFitGraph,
  onResetGraph,
  onTraceShortestPath,
  onClearShortestPath,
  hasActiveShortestPath,
  expandedDegree,
  onChangeExpandedDegree
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [sourceNodeId, setSourceNodeId] = useState('');
  const [targetNodeId, setTargetNodeId] = useState('');
  const [showShortestPathPanel, setShowShortestPathPanel] = useState(false);

  const filteredSearchNodes = nodes.filter((n) =>
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.alias && n.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
    n.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSearch = (nodeId: string) => {
    onSearchSelect(nodeId);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const handleRunShortestPath = () => {
    if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return;
    onTraceShortestPath(sourceNodeId, targetNodeId);
  };

  return (
    <div className="astra-card p-4 space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Node with Autocomplete */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search suspect name, phone, vehicle, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute z-40 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl p-1 space-y-1">
              {filteredSearchNodes.length === 0 ? (
                <div className="p-2.5 text-center text-xs text-slate-400 font-mono">
                  No matching entities found in network
                </div>
              ) : (
                filteredSearchNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelectSearch(n.id)}
                    className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-500/10 text-left transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: NODE_TYPE_COLORS[n.type]?.bg }} />
                      <span className="font-bold text-[var(--text-primary)] truncate">{n.label}</span>
                      {n.alias && n.alias !== 'None' && (
                        <span className="text-[10px] text-slate-400">({n.alias})</span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {n.type}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Layout & Degree Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Layout Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-[var(--text-muted)]">Layout:</span>
            <select
              value={layoutName}
              onChange={(e) => onChangeLayout(e.target.value as any)}
              className="bg-transparent text-[var(--text-primary)] font-bold focus:outline-none cursor-pointer"
            >
              <option value="concentric">Spider-Web (Concentric)</option>
              <option value="cose">Force-Directed (CoSE)</option>
              <option value="circle">Circular Radial</option>
              <option value="breadthfirst">Hierarchical Tree</option>
            </select>
          </div>

          {/* Degrees of Separation Toggle */}
          <div className="flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] p-0.5 text-xs font-mono">
            <button
              onClick={() => onChangeExpandedDegree(1)}
              className={`px-2 py-1 rounded transition-colors ${
                expandedDegree === 1
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              1° Neighbors
            </button>
            <button
              onClick={() => onChangeExpandedDegree(2)}
              className={`px-2 py-1 rounded transition-colors ${
                expandedDegree === 2
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              2° Expand
            </button>
          </div>

          {/* Shortest Path Toggle Button */}
          <button
            onClick={() => setShowShortestPathPanel(!showShortestPathPanel)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors ${
              showShortestPathPanel || hasActiveShortestPath
                ? 'border-cyan-500 bg-cyan-500/15 text-cyan-400 font-bold'
                : 'border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-cyan-400'
            }`}
            title="Calculate shortest path between two nodes"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Shortest Path</span>
          </button>

          {/* Reset & Fit View Buttons */}
          <button
            onClick={onFitGraph}
            className="p-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-slate-300 hover:text-white hover:bg-blue-500/10 transition-colors"
            title="Fit to View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onResetGraph}
            className="p-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-slate-300 hover:text-white hover:bg-blue-500/10 transition-colors"
            title="Reset Filters & Layout"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shortest Path Interactive Panel (Collapsible) */}
      {showShortestPathPanel && (
        <div className="p-3.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Route className="w-4 h-4" />
              Investigative Path Tracer:
            </span>

            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-cyan-500/40 bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">Select Origin Node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.type})
                </option>
              ))}
            </select>

            <span className="text-cyan-400 font-bold">➔</span>

            <select
              value={targetNodeId}
              onChange={(e) => setTargetNodeId(e.target.value)}
              className="px-2.5 py-1.5 rounded border border-cyan-500/40 bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">Select Target Node...</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label} ({n.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleRunShortestPath}
              disabled={!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-40"
            >
              Trace Shortest Link
            </button>
            {hasActiveShortestPath && (
              <button
                onClick={onClearShortestPath}
                className="px-2.5 py-1.5 rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Entity Filters & Relationship Controls */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* 8 Forensic Entity Types Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Entity Types:
          </span>
          {Object.entries(NODE_TYPE_COLORS).map(([type, meta]) => {
            const isSelected = selectedEntityTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => onToggleEntityType(type)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border ${
                  isSelected
                    ? 'border-blue-500 text-white shadow-sm'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? meta.bg : 'transparent',
                  borderColor: isSelected ? meta.border : undefined
                }}
              >
                {meta.text}
              </button>
            );
          })}
        </div>

        {/* Relationship Type & Confidence Filter */}
        <div className="flex items-center gap-3 text-xs font-mono w-full md:w-auto justify-between md:justify-end">
          {/* Relationship Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[var(--text-muted)]">Rel:</span>
            <select
              value={selectedRelationType}
              onChange={(e) => onChangeRelationType(e.target.value)}
              className="px-2 py-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:outline-none"
            >
              <option value="ALL">All Relationships</option>
              <option value="called">called</option>
              <option value="met">met</option>
              <option value="visited">visited</option>
              <option value="owns">owns</option>
              <option value="associated_with">associated_with</option>
              <option value="transaction">transaction</option>
              <option value="involved_in">involved_in</option>
              <option value="communicated_with">communicated_with</option>
              <option value="connected_to">connected_to</option>
            </select>
          </div>

          {/* Confidence Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)]">Conf:</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => onChangeConfidence(Number(e.target.value))}
              className="w-16 accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-blue-400 font-bold w-6">{confidenceThreshold}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
