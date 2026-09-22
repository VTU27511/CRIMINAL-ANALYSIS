import React from 'react';
import { 
  ShieldAlert, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Activity, 
  Database, 
  Zap,
  Clock,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useCyberPredict } from '../../context/CyberPredictContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { 
    currentPhaseIndex, 
    allPhases, 
    isPlayingDemo, 
    playbackSpeed,
    lastUpdated,
    isDemoMode,
    currentScenario,
    playDemo, 
    pauseDemo, 
    stepForward, 
    resetDemo,
    setSpeed
  } = useCyberPredict();

  return (
    <header className="bg-cyber-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Platform Branding */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <ShieldAlert className="w-5 h-5 text-cyber-950 font-bold" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                CYBERPREDICT <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                SOC v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">
              Predictive Network Defense Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Interactive Demo Simulation Controller */}
      <div className="flex items-center bg-cyber-850/90 border border-cyan-500/30 rounded-lg p-1.5 px-3 space-x-3 shadow-inner">
        <div className="flex items-center space-x-1.5 border-r border-white/10 pr-2.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-semibold">
            Attack Simulation
          </span>
        </div>

        {/* Phase Pill Indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-300">
            Step <span className="text-cyan-400 font-bold">{currentPhaseIndex + 1}</span>/{allPhases.length}:
          </span>
          <span className="text-[11px] font-medium text-white max-w-[160px] truncate hidden md:inline" title={currentScenario.phaseName}>
            {currentScenario.phaseName}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-1">
          {isPlayingDemo ? (
            <button 
              onClick={pauseDemo}
              className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
              title="Pause Simulation"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button 
              onClick={playDemo}
              className="p-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors flex items-center space-x-1 px-2"
              title="Run Attack Forecast Demo"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="text-[10px] font-mono font-semibold">Run Demo</span>
            </button>
          )}

          <button 
            onClick={stepForward}
            className="p-1 rounded bg-cyber-750 hover:bg-cyber-700 text-slate-300 hover:text-white transition-colors"
            title="Step to Next Phase"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={resetDemo}
            className="p-1 rounded bg-cyber-750 hover:bg-cyber-700 text-slate-300 hover:text-white transition-colors"
            title="Reset Scenario to Normal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyber-750 text-cyan-400 hover:bg-cyber-700 transition-colors ml-1"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Top-Right SOC Telemetry Status Bar */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        {/* Demo / Live Indicator */}
        <div className={`px-2 py-1 rounded border flex items-center space-x-1.5 ${
          isDemoMode 
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="font-bold uppercase tracking-wider text-[10px]">
            {isDemoMode ? 'DEMO / SYNTHETIC DATA' : 'LIVE TELEMETRY'}
          </span>
        </div>

        {/* Data Source */}
        <div className="hidden lg:flex items-center space-x-1.5 text-slate-400 bg-cyber-850 px-2 py-1 rounded border border-white/5">
          <Database className="w-3 h-3 text-slate-400" />
          <span className="text-[11px]">Source:</span>
          <span className="text-white font-medium text-[11px]">NetFlow-v9 (CIC-IDS)</span>
        </div>

        {/* System Health */}
        <div className="hidden sm:flex items-center space-x-1.5 text-slate-400 bg-cyber-850 px-2 py-1 rounded border border-white/5">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-400 font-medium text-[11px]">Inference Online</span>
        </div>

        {/* Last Updated */}
        <div className="hidden xl:flex items-center space-x-1 text-slate-400 text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{lastUpdated}</span>
        </div>

        {/* Settings Quicklink */}
        <Link 
          to="/settings"
          className="p-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
          title="Platform Settings & Model Configuration"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
