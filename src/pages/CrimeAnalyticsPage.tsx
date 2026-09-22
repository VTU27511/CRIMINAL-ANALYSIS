import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Download,
  Share2,
  Camera,
  FileText,
  Network,
  Activity,
  CheckCircle2,
  Sliders,
  Maximize2,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { SpiderWebGraph, GraphNode, GraphLink } from '../components/network/SpiderWebGraph';

export const CrimeAnalyticsPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string | null>(null);
  const [activeThreadSeries, setActiveThreadSeries] = useState<'ALL' | 'REPORTED' | 'SOLVED' | 'VELOCITY'>('ALL');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [graphLayout, setGraphLayout] = useState<'concentric' | 'cose' | 'circle'>('concentric');
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);

  const chartsContainerRef = useRef<HTMLDivElement>(null);

  // Crime Categories Statistics
  const categoryStats = [
    { label: 'Cyber Financial Fraud & Extortion', count: 182, pct: 37.7, color: '#3b82f6', icon: '💻' },
    { label: 'Armed Robbery & Vehicle Hijacking', count: 96, pct: 19.9, color: '#f97316', icon: '🚗' },
    { label: 'Narcotics & Contraband (NDPS)', count: 78, pct: 16.1, color: '#a855f7', icon: '📦' },
    { label: 'Violent Crime / Homicide (BNS 103)', count: 64, pct: 13.2, color: '#ef4444', icon: '⚠️' },
    { label: 'Burglary & Commercial Theft', count: 63, pct: 13.1, color: '#10b981', icon: '🏢' }
  ];

  // Monthly Crime Trends Data
  const monthlyTrend = [
    { month: 'Oct 2025', reported: 54, solved: 46, clearance: 85.1, momChange: '+4.2%' },
    { month: 'Nov 2025', reported: 61, solved: 51, clearance: 83.6, momChange: '+12.9%' },
    { month: 'Dec 2025', reported: 59, solved: 49, clearance: 83.0, momChange: '-3.2%' },
    { month: 'Jan 2026', reported: 72, solved: 58, clearance: 80.5, momChange: '+22.0%' },
    { month: 'Feb 2026', reported: 65, solved: 54, clearance: 83.0, momChange: '-9.7%' },
    { month: 'Mar 2026', reported: 48, solved: 39, clearance: 81.2, momChange: '-26.1%' }
  ];

  const topPrecincts = [
    { name: 'Connaught Place PS (New Delhi)', cases: 142, clearance: 86.4, avgResolutionDays: 19, primaryCrime: 'Cyber Financial Fraud & Extortion' },
    { name: 'Chennai Central Crime Wing (Chennai)', cases: 126, clearance: 87.2, avgResolutionDays: 21, primaryCrime: 'Cyber Financial Fraud & Extortion' },
    { name: 'BKC Special Crime Wing (Mumbai)', cases: 118, clearance: 89.0, avgResolutionDays: 24, primaryCrime: 'Narcotics & Contraband (NDPS)' },
    { name: 'Hauz Khas PS (South Delhi)', cases: 94, clearance: 81.2, avgResolutionDays: 28, primaryCrime: 'Armed Robbery & Vehicle Hijacking' },
    { name: 'OMR Cyber Police Station (Chennai)', cases: 88, clearance: 88.5, avgResolutionDays: 17, primaryCrime: 'Cyber Financial Fraud & Extortion' },
    { name: 'Indiranagar PS (Bengaluru)', cases: 76, clearance: 83.5, avgResolutionDays: 22, primaryCrime: 'Cyber Financial Fraud & Extortion' }
  ];

  // Movable Correlation Graph Nodes & Links
  const analyticsNodes: GraphNode[] = [
    { id: 'cat_cyber', label: 'Cyber Financial Fraud', type: 'EVENT', role: '37.7% OF INCIDENTS', importanceReason: '182 Cases • Primary National Threat' },
    { id: 'cat_robbery', label: 'Armed Robbery', type: 'EVENT', role: '19.9% OF INCIDENTS', importanceReason: '96 Cases • Transit Interception' },
    { id: 'cat_ndps', label: 'Narcotics (NDPS)', type: 'EVENT', role: '16.1% OF INCIDENTS', importanceReason: '78 Cases • Maritime & Cargo Supply' },
    { id: 'cat_homicide', label: 'Violent Crime (BNS 103)', type: 'EVENT', role: '13.2% OF INCIDENTS', importanceReason: '64 Cases • Organized Hit Cell' },
    { id: 'cat_theft', label: 'Vehicle Theft', type: 'EVENT', role: '13.1% OF INCIDENTS', importanceReason: '63 Cases • Stolen Fleet' },

    { id: 'precinct_cp', label: 'Connaught Place PS', type: 'LOCATION', role: '142 CASES', importanceReason: 'Clearance Rate: 86.4%' },
    { id: 'precinct_chn', label: 'Chennai Central PS', type: 'LOCATION', role: '126 CASES', importanceReason: 'Clearance Rate: 87.2%' },
    { id: 'precinct_bkc', label: 'BKC Crime Wing Mumbai', type: 'LOCATION', role: '118 CASES', importanceReason: 'Clearance Rate: 89.0%' },
    { id: 'precinct_hk', label: 'Hauz Khas PS South Delhi', type: 'LOCATION', role: '94 CASES', importanceReason: 'Clearance Rate: 81.2%' },
    { id: 'precinct_blr', label: 'Indiranagar PS Bengaluru', type: 'LOCATION', role: '76 CASES', importanceReason: 'Clearance Rate: 83.5%' },

    { id: 'task_cyber', label: 'National Cyber Cell', type: 'ORGANIZATION', role: 'SPECIAL TASK FORCE', importanceReason: 'Specialized Tech Intercept Unit' },
    { id: 'task_flying', label: 'Highway Interceptor Squad', type: 'ORGANIZATION', role: 'ANPR RESPONSE', importanceReason: 'Transit Corridors Interception' }
  ];

  const analyticsLinks: GraphLink[] = [
    { id: 'l1', source: 'cat_cyber', target: 'precinct_cp', relation: 'PRIMARY_JURISDICTION', weight: 0.95 },
    { id: 'l2', source: 'cat_cyber', target: 'precinct_chn', relation: 'CORRIDOR_MULES', weight: 0.91 },
    { id: 'l3', source: 'cat_cyber', target: 'precinct_blr', relation: 'CROSS_STATE_MULES', weight: 0.88 },
    { id: 'l4', source: 'cat_cyber', target: 'task_cyber', relation: 'ASSIGNED_TASK_FORCE', weight: 0.98 },
    { id: 'l5', source: 'cat_robbery', target: 'precinct_hk', relation: 'CORRIDOR_INCIDENTS', weight: 0.92 },
    { id: 'l6', source: 'cat_robbery', target: 'task_flying', relation: 'ANPR_PATROL', weight: 0.94 },
    { id: 'l7', source: 'cat_ndps', target: 'precinct_bkc', relation: 'PORT_LOGISTICS', weight: 0.9 },
    { id: 'l8', source: 'cat_ndps', target: 'precinct_chn', relation: 'SEAPORT_ANCHORAGE', weight: 0.89 },
    { id: 'l9', source: 'cat_homicide', target: 'precinct_cp', relation: 'CHARGESHEETED', weight: 0.85 },
    { id: 'l10', source: 'cat_theft', target: 'precinct_hk', relation: 'STOLEN_ASSETS', weight: 0.87 }
  ];

  const filteredPrecincts = selectedCategoryFilter
    ? topPrecincts.filter((p) => p.primaryCrime.toLowerCase().includes(selectedCategoryFilter.toLowerCase()))
    : topPrecincts;

  const totalIncidents = categoryStats.reduce((acc, c) => acc + c.count, 0);
  const maxReported = Math.max(...monthlyTrend.map((m) => m.reported));

  // Export functions
  const downloadWordReport = () => {
    let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Crime Analytics & Trends Dossier</title>
<style>
body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #1e293b; padding: 20px; }
h1 { color: #1e3a8a; border-bottom: 2px solid #2563eb; padding-bottom: 8px; font-size: 22pt; }
h2 { color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; font-size: 15pt; margin-top: 20pt; }
table { width: 100%; border-collapse: collapse; margin-top: 10pt; font-size: 10pt; }
th, td { border: 1px solid #94a3b8; padding: 6px 10px; text-align: left; }
th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
.badge { font-weight: bold; color: #10b981; }
</style></head><body>
<h1>STATE-WIDE CRIME PATTERN, TRENDS & CLEARANCE VELOCITY REPORT</h1>
<p><strong>Generated:</strong> ${new Date().toLocaleString()} | <strong>Timeframe:</strong> ${selectedTimeframe} | <strong>Jurisdiction:</strong> ${selectedDistrict}</p>
<p><strong>Total Cases Analyzed:</strong> ${totalIncidents} | <strong>Average Clearance Velocity:</strong> 82.5%</p>

<h2>1. CRIME CLASSIFICATION BREAKDOWN</h2>
<table>
<thead><tr><th>Crime Category</th><th>Reported Cases</th><th>Percentage Share</th></tr></thead>
<tbody>`;
    categoryStats.forEach((c) => {
      html += `<tr><td><strong>${c.label}</strong></td><td>${c.count}</td><td>${c.pct}%</td></tr>`;
    });
    html += `</tbody></table>

<h2>2. MONTHLY INCIDENT VELOCITY & CLEARANCE TREND THREADS</h2>
<table>
<thead><tr><th>Month</th><th>Reported Cases</th><th>Disposed / Solved</th><th>Clearance Velocity</th><th>MoM Velocity Change</th></tr></thead>
<tbody>`;
    monthlyTrend.forEach((m) => {
      html += `<tr><td><strong>${m.month}</strong></td><td>${m.reported}</td><td>${m.solved}</td><td class="badge">${m.clearance}%</td><td>${m.momChange}</td></tr>`;
    });
    html += `</tbody></table>

<h2>3. PRECINCT CLEARANCE RANKING</h2>
<table>
<thead><tr><th>Precinct Name</th><th>Active Cases</th><th>Clearance Rate</th><th>Avg Days to Chargesheet</th></tr></thead>
<tbody>`;
    topPrecincts.forEach((p) => {
      html += `<tr><td><strong>${p.name}</strong></td><td>${p.cases}</td><td>${p.clearance}%</td><td>${p.avgResolutionDays} days</td></tr>`;
    });
    html += `</tbody></table>
</body></html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crime_Analytics_Trends_Report_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadChartsPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('CRIME ANALYTICS & TRENDS INTELLIGENCE DOSSIER', 50, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Arial';
    ctx.fillText(`Generated by Criminal Intelligence Engine • ${new Date().toLocaleDateString()}`, 50, 80);

    // Draw Line & Bar Comparison
    let y = 130;
    monthlyTrend.forEach((m) => {
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(`${m.month} (${m.reported} Reported • ${m.solved} Solved)`, 50, y);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(50, y + 8, 900, 24);

      // Reported Bar
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(50, y + 8, (m.reported / 80) * 900, 11);

      // Cleared Bar
      ctx.fillStyle = '#10b981';
      ctx.fillRect(50, y + 20, (m.solved / 80) * 900, 11);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(`${m.clearance}% Clear`, 965, y + 25);

      y += 65;
    });

    const png = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = png;
    a.download = `Crime_Analytics_Charts_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // SVG Coordinates Calculation for Line Graph
  const graphWidth = 600;
  const graphHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = graphWidth - paddingX * 2;
  const plotHeight = graphHeight - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (monthlyTrend.length - 1)) * plotWidth;
  const getYReported = (val: number) => graphHeight - paddingY - (val / 80) * plotHeight;
  const getYClearance = (val: number) => graphHeight - paddingY - ((val - 60) / 40) * plotHeight;

  // Path generators
  const reportedPoints = monthlyTrend.map((m, i) => `${getX(i)},${getYReported(m.reported)}`).join(' ');
  const solvedPoints = monthlyTrend.map((m, i) => `${getX(i)},${getYReported(m.solved)}`).join(' ');
  const clearancePoints = monthlyTrend.map((m, i) => `${getX(i)},${getYClearance(m.clearance)}`).join(' ');

  // Area path below reported
  const reportedAreaPath = `M ${getX(0)},${graphHeight - paddingY} ` +
    monthlyTrend.map((m, i) => `L ${getX(i)},${getYReported(m.reported)}`).join(' ') +
    ` L ${getX(monthlyTrend.length - 1)},${graphHeight - paddingY} Z`;

  const solvedAreaPath = `M ${getX(0)},${graphHeight - paddingY} ` +
    monthlyTrend.map((m, i) => `L ${getX(i)},${getYReported(m.solved)}`).join(' ') +
    ` L ${getX(monthlyTrend.length - 1)},${graphHeight - paddingY} Z`;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Filter Controls */}
      <div className="astra-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              NATIONAL CRIME INTELLIGENCE & PATTERN THREADS
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              TRENDS • INTERACTIVE GRAPH & BARGRAPH SUITE
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1 text-[var(--text-primary)]">
            Crime Analytics, Trends & Threat Pattern Threads
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Multi-dimensional analytical suite featuring trend line graphs, comparative bar charts, classification breakdown pie, and movable correlation networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* District Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="CHENNAI">Chennai Metro & OMR</option>
              <option value="DELHI">Delhi NCR</option>
              <option value="MUMBAI">Mumbai Metropolitan</option>
              <option value="BENGALURU">Bengaluru Urban</option>
            </select>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-main)] text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-transparent text-[var(--text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="1M">Last 30 Days</option>
              <option value="6M">Last 6 Months</option>
              <option value="1Y">Last 1 Year</option>
            </select>
          </div>

          {/* Download Buttons */}
          <button
            onClick={downloadWordReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all cursor-pointer font-mono"
            title="Download Full Crime Analytics Report in Word (.doc)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Word (.doc)</span>
          </button>

          <button
            onClick={downloadChartsPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer font-mono"
            title="Download Visual Charts as PNG image"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Download Charts (PNG)</span>
          </button>
        </div>
      </div>

      {/* TOP KPI THREADS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="astra-card p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>6-MONTH INCIDENTS</span>
            <span className="text-cyan-400 font-bold">📈 INFLUX</span>
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)] font-mono mt-1">
            {totalIncidents} Cases
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peak Month: <strong>Jan 2026 (72 Cases)</strong></span>
          </div>
        </div>

        <div className="astra-card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>CHARGESHEETED & RESOLVED</span>
            <span className="text-emerald-400 font-bold">🛡️ DISPOSED</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            397 Solved
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Average Velocity: <strong>82.5%</strong></span>
          </div>
        </div>

        <div className="astra-card p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>PRIMARY CRIME THREAD</span>
            <span className="text-purple-400 font-bold">💻 CYBER</span>
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            37.7% Share
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
            182 Cyber Extortion & Mule Accounts
          </div>
        </div>

        <div className="astra-card p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>MOM ACCELERATION</span>
            <span className="text-amber-400 font-bold">⚡ VELOCITY</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            -26.1% Drop
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fewer incidents in March 2026</span>
          </div>
        </div>
      </div>

      {/* 1. INTERACTIVE CRIME THREADS LINE GRAPH (SPLINE / MULTI-CURVE) */}
      <div className="astra-card p-6 space-y-4 border-2 border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Crime Analysis Threads Line Graph (Multi-Month Trajectory)
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Interactive spline curve trajectories tracking incident influx, chargesheet disposal, and clearance percentage velocity over time.
            </p>
          </div>

          {/* Series Toggle Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-[10px] text-[var(--text-muted)] mr-1">View Series:</span>
            <button
              onClick={() => setActiveThreadSeries('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeThreadSeries === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)]'
              }`}
            >
              All Threads
            </button>
            <button
              onClick={() => setActiveThreadSeries('REPORTED')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeThreadSeries === 'REPORTED'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] text-blue-400 hover:text-white border border-[var(--border-subtle)]'
              }`}
            >
              📈 Reported Influx
            </button>
            <button
              onClick={() => setActiveThreadSeries('SOLVED')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeThreadSeries === 'SOLVED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] text-emerald-400 hover:text-white border border-[var(--border-subtle)]'
              }`}
            >
              🛡️ Solved Cases
            </button>
            <button
              onClick={() => setActiveThreadSeries('VELOCITY')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeThreadSeries === 'VELOCITY'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[var(--bg-main)] text-purple-400 hover:text-white border border-[var(--border-subtle)]'
              }`}
            >
              ⚡ Velocity %
            </button>
          </div>
        </div>

        {/* SVG Multi-Line Graph */}
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-64 overflow-visible">
              <defs>
                <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[20, 40, 60, 80].map((level) => {
                const y = getYReported(level);
                return (
                  <g key={level}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={graphWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="3, 3"
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fill="currentColor"
                      className="text-[9px] font-mono text-slate-400 dark:text-slate-600"
                      textAnchor="end"
                    >
                      {level}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Areas */}
              {(activeThreadSeries === 'ALL' || activeThreadSeries === 'REPORTED') && (
                <path d={reportedAreaPath} fill="url(#cyanArea)" />
              )}
              {(activeThreadSeries === 'ALL' || activeThreadSeries === 'SOLVED') && (
                <path d={solvedAreaPath} fill="url(#emeraldArea)" />
              )}

              {/* 1. Reported Curve Line */}
              {(activeThreadSeries === 'ALL' || activeThreadSeries === 'REPORTED') && (
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={reportedPoints}
                  className="transition-all duration-300"
                />
              )}

              {/* 2. Solved Curve Line */}
              {(activeThreadSeries === 'ALL' || activeThreadSeries === 'SOLVED') && (
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={solvedPoints}
                  className="transition-all duration-300"
                />
              )}

              {/* 3. Clearance Velocity Curve Line */}
              {(activeThreadSeries === 'ALL' || activeThreadSeries === 'VELOCITY') && (
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="5, 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={clearancePoints}
                  className="transition-all duration-300"
                />
              )}

              {/* Interactive Data Points & Hover Targets */}
              {monthlyTrend.map((m, idx) => {
                const x = getX(idx);
                const yRep = getYReported(m.reported);
                const ySol = getYReported(m.solved);
                const yVel = getYClearance(m.clearance);
                const isHovered = hoveredMonthIndex === idx;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMonthIndex(idx)}
                    onMouseLeave={() => setHoveredMonthIndex(null)}
                    onClick={() => setSelectedMonthFilter(selectedMonthFilter === m.month ? null : m.month)}
                  >
                    {/* Vertical Highlight Bar on Hover */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1={paddingY}
                        x2={x}
                        y2={graphHeight - paddingY}
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="2, 2"
                      />
                    )}

                    {/* Reported Point */}
                    {(activeThreadSeries === 'ALL' || activeThreadSeries === 'REPORTED') && (
                      <circle
                        cx={x}
                        cy={yRep}
                        r={isHovered ? '6' : '4'}
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                    )}

                    {/* Solved Point */}
                    {(activeThreadSeries === 'ALL' || activeThreadSeries === 'SOLVED') && (
                      <circle
                        cx={x}
                        cy={ySol}
                        r={isHovered ? '6' : '4'}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                    )}

                    {/* Velocity Point */}
                    {(activeThreadSeries === 'ALL' || activeThreadSeries === 'VELOCITY') && (
                      <rect
                        x={x - (isHovered ? 4 : 3)}
                        y={yVel - (isHovered ? 4 : 3)}
                        width={isHovered ? 8 : 6}
                        height={isHovered ? 8 : 6}
                        fill="#a855f7"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                    )}

                    {/* X-Axis Month Label */}
                    <text
                      x={x}
                      y={graphHeight - paddingY + 18}
                      fill="currentColor"
                      textAnchor="middle"
                      className={`text-[10px] font-mono transition-colors ${
                        isHovered || selectedMonthFilter === m.month
                          ? 'font-bold text-cyan-400'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {m.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hovered Month Interactive Floating Banner */}
        {hoveredMonthIndex !== null && (
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between text-xs font-mono animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--text-primary)]">
                📅 {monthlyTrend[hoveredMonthIndex].month} Snapshot:
              </span>
              <span className="text-cyan-400 font-bold">
                {monthlyTrend[hoveredMonthIndex].reported} Reported
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                {monthlyTrend[hoveredMonthIndex].solved} Solved
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-purple-400 font-bold">
                ⚡ Clearance Velocity: {monthlyTrend[hoveredMonthIndex].clearance}%
              </span>
              <span className="text-amber-400 font-bold">
                MoM: {monthlyTrend[hoveredMonthIndex].momChange}
              </span>
            </div>
          </div>
        )}

        {/* Graph Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-[#06b6d4]" />
            <span className="text-[var(--text-primary)] font-bold">Reported Crimes Influx</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-[#10b981]" />
            <span className="text-[var(--text-primary)] font-bold">Solved / Chargesheeted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 border-b-2 border-dashed border-[#a855f7]" />
            <span className="text-[var(--text-primary)] font-bold">Clearance Velocity %</span>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE BAR GRAPH & CRIME CLASSIFICATION PIE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clickable / Interactive Monthly Bar Graph (7 Cols) */}
        <div className="lg:col-span-7 astra-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Monthly Incident Influx & Clearance Rate Bar Graph
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                AVG VELOCITY: 82.5%
              </span>
            </div>
          </div>

          {selectedMonthFilter && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <span>Selected Month: <strong>{selectedMonthFilter}</strong></span>
              <button
                onClick={() => setSelectedMonthFilter(null)}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
              >
                Reset ✕
              </button>
            </div>
          )}

          {/* Interactive Bar Chart Elements */}
          <div className="space-y-3 pt-1">
            {monthlyTrend.map((m, idx) => {
              const isSelected = selectedMonthFilter === m.month;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedMonthFilter(isSelected ? null : m.month)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-main)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span>{m.month}</span>
                      {isSelected && <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-900 font-black">ACTIVE</span>}
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      <strong className="text-cyan-400">{m.reported} Reported</strong> • <strong className="text-emerald-400">{m.solved} Solved</strong> ({m.clearance}%)
                    </span>
                  </div>

                  {/* Dual Bar Track */}
                  <div className="space-y-1">
                    {/* Reported Track */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${(m.reported / 80) * 100}%` }}
                      />
                    </div>
                    {/* Solved Track */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${(m.solved / 80) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)] pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Blue = Reported Influx
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Green = Solved Cases
            </span>
            <span>Click any bar to filter precinct ranking</span>
          </div>
        </div>

        {/* Clickable / Interactive Pie Chart (5 Cols) */}
        <div className="lg:col-span-5 astra-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Crime Classification Breakdown Pie
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Click slice to filter
              </span>
            </div>

            {selectedCategoryFilter && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 mt-2">
                <span>Filter: <strong>{selectedCategoryFilter}</strong></span>
                <button
                  onClick={() => setSelectedCategoryFilter(null)}
                  className="text-[10px] text-purple-400 hover:underline cursor-pointer"
                >
                  Reset ✕
                </button>
              </div>
            )}

            {/* SVG Donut Chart */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {(() => {
                    let accumulatedPercent = 0;
                    return categoryStats.map((c, idx) => {
                      const strokeDasharray = `${c.pct} ${100 - c.pct}`;
                      const strokeDashoffset = -accumulatedPercent;
                      accumulatedPercent += c.pct;
                      const isSelected = selectedCategoryFilter === c.label;

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke={c.color}
                          strokeWidth={isSelected ? '16' : '12'}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          pathLength="100"
                          className="transition-all duration-300 cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedCategoryFilter(isSelected ? null : c.label)}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-[var(--text-primary)] font-mono">
                    {totalIncidents}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">
                    Total Crimes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Clickable Legend */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
            {categoryStats.map((cat, idx) => {
              const isSelected = selectedCategoryFilter === cat.label;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.label)}
                  className={`w-full flex items-center justify-between p-2 rounded text-xs font-mono transition-all cursor-pointer ${
                    isSelected ? 'bg-purple-500/15 border border-purple-500/40' : 'hover:bg-[var(--bg-main)]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-[var(--text-primary)] truncate text-left">{cat.label}</span>
                  </div>
                  <span className="font-bold text-[var(--text-muted)] whitespace-nowrap ml-2">
                    {cat.count} ({cat.pct}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MOVABLE & INTERACTIVE CORRELATION TOPOLOGY GRAPH */}
      <div className="astra-card p-6 space-y-4 border border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Movable Crime Correlation & Police Precinct Spider-Web Graph
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Interactive force-directed graph correlating crime categories to jurisdictional police stations and specialized response squads. Drag, pan, and click nodes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[11px] text-[var(--text-muted)]">Layout:</span>
            {(['concentric', 'cose', 'circle'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setGraphLayout(mode)}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                  graphLayout === mode
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Embedded SpiderWebGraph */}
        <div className="w-full h-[460px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] overflow-hidden">
          <SpiderWebGraph
            nodes={analyticsNodes}
            links={analyticsLinks}
            layoutName={graphLayout}
            selectedNodeId={selectedGraphNode?.id || null}
            onSelectNode={(node: GraphNode | null) => setSelectedGraphNode(node)}
            highlightedNodeId={selectedGraphNode?.id || null}
          />
        </div>

        {/* Selected Graph Node Details Pill */}
        {selectedGraphNode && (
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-between text-xs font-mono animate-in fade-in">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <strong>{selectedGraphNode.label}</strong>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                {selectedGraphNode.role}
              </span>
              <span className="text-[var(--text-muted)]">• {selectedGraphNode.importanceReason}</span>
            </div>
            <button
              onClick={() => setSelectedGraphNode(null)}
              className="text-[10px] text-purple-400 hover:underline cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. PRECINCT CLEARANCE RANKING TABLE */}
      <div className="astra-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Jurisdictional Precinct Clearance Ranking ({filteredPrecincts.length} Precincts)
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Ranked by chargesheet velocity and average days to conviction chargesheet under BNS statutory deadlines.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                <th className="pb-2">PRECINCT NAME</th>
                <th className="pb-2">PRIMARY CRIME CORRIDOR</th>
                <th className="pb-2 text-center">ACTIVE CASES</th>
                <th className="pb-2 text-center">CLEARANCE RATE</th>
                <th className="pb-2 text-right">AVG RESOLUTION DAYS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredPrecincts.map((p, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-main)] transition-colors">
                  <td className="py-2.5 font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      #{idx + 1}
                    </span>
                    {p.name}
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">{p.primaryCrime}</td>
                  <td className="py-2.5 text-center font-bold text-[var(--text-primary)]">{p.cases}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                      p.clearance >= 85
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {p.clearance}%
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-[var(--text-secondary)]">
                    {p.avgResolutionDays} Days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
