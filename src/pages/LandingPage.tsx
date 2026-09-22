import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  TrendingUp, 
  Cpu, 
  Network, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Lock, 
  Search, 
  Layers, 
  CheckCircle2, 
  Radar, 
  BarChart3, 
  Database,
  Terminal,
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { useCyberPredict } from '../context/CyberPredictContext';

export const LandingPage: React.FC = () => {
  const { playDemo } = useCyberPredict();

  const PIPELINE_STEPS = [
    { num: '01', title: 'Capture Network Traffic', desc: 'Continuous packet capture via PCAP or IPFIX / NetFlow-v9 network flow stream ingestion.' },
    { num: '02', title: 'Extract Flow Features', desc: '17 high-resolution attributes including SYN/ACK/RST ratios, inter-arrival times, and port entropy.' },
    { num: '03', title: 'Build Temporal Network States', desc: 'Binning flow vectors into sequential temporal windows S(t-k) ... S(t) capturing global network posture.' },
    { num: '04', title: 'Learn State Transitions', desc: 'Recurrent cells and self-attention learn the temporal dynamics of adversary progression through subnets.' },
    { num: '05', title: 'Forecast Future States', desc: 'Autoregressive multi-step rollout predicts network state vectors S(t+1) through S(t+5).' },
    { num: '06', title: 'Predict Attack Stage', desc: 'Translates forecasted state vectors into probable MITRE ATT&CK kill-chain tactics and targets.' },
    { num: '07', title: 'Explain Prediction', desc: 'Game-theoretic SHAP attributions highlight exactly which flow metrics drove the forecast.' },
    { num: '08', title: 'Support Defensive Decisions', desc: 'Generates prescriptive containment and segmentation playbooks before lateral pivoting completes.' }
  ];

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 cyber-grid relative overflow-x-hidden">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-cyber-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
            <ShieldAlert className="w-5 h-5 text-cyber-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-white">
              CYBERPREDICT <span className="text-cyan-400">AI</span>
            </span>
            <span className="block text-[10px] font-mono text-slate-400">
              Smart India Hackathon Prototype
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-mono text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">Problem</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#architecture" className="hover:text-cyan-400 transition-colors">AI Architecture</a>
          <a href="#tech" className="hover:text-cyan-400 transition-colors">Technology</a>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-cyber-950 font-bold font-mono text-xs shadow-glow-cyan transition-all flex items-center space-x-1.5"
          >
            <span>Launch SOC Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-glow-cyan/20">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI-Based Network Attack Forecasting from Network Traffic Data</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans max-w-4xl mx-auto leading-tight">
          Predict the next move of a <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">network attack</span>.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          An AI-powered predictive cyber defence platform that learns temporal network behaviour and forecasts attack progression before the next stage occurs.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-cyber-950 font-black font-mono text-sm shadow-glow-cyan transition-all flex items-center space-x-2"
          >
            <span>Launch SOC Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/world-model"
            className="px-6 py-3.5 rounded-xl bg-cyber-850 hover:bg-cyber-800 text-slate-200 border border-white/15 font-mono text-sm transition-colors flex items-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>View AI World Model Architecture</span>
          </Link>
        </div>

        {/* The Fundamental Distinction Callout */}
        <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl glass-panel-glow border border-cyan-500/40 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400 animate-spin" />
              Paradigm Shift: Detection vs Forecasting
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
              Core Innovation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-cyber-900 border border-red-500/30 space-y-2">
              <span className="text-red-400 font-bold uppercase tracking-wider block text-[11px]">
                Traditional Intrusion Detection (IDS)
              </span>
              <p className="text-slate-300">
                Classifies isolated flows as Benign or Malicious after the fact.
              </p>
              <div className="p-2.5 rounded bg-black/40 text-red-300 border border-red-500/20 font-bold">
                "Attack detected."
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400/50 space-y-2 shadow-glow-cyan/20">
              <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[11px]">
                CyberPredict AI Platform
              </span>
              <p className="text-slate-300">
                Models temporal state transitions to forecast future kill-chain moves.
              </p>
              <div className="p-2.5 rounded bg-cyan-900/40 text-cyan-200 border border-cyan-500/40 font-bold">
                "Attack progression forecast: Lateral Movement likely in T+10m."
              </div>
            </div>
          </div>

          <p className="text-center text-sm font-bold text-cyan-300 pt-2 tracking-wide font-mono">
            "Don't just detect the attack. Predict where it is going next."
          </p>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <section id="problem" className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            The SIH Challenge
          </span>
          <h2 className="text-3xl font-black text-white">
            Why Point-in-Time Detection Fails Modern SOCs
          </h2>
          <p className="text-slate-400 text-sm">
            Modern advanced persistent threats (APTs) unfold over hours and days through stealthy stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-950 text-red-400 border border-red-800 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Reactive, Not Proactive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard IDSs only alert after an exploitation or command-and-control beacon has already established footholds, forcing SOC analysts into pure damage control.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Blind to Temporal Dynamics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Treating each packet or flow as independent loses all temporal context. Slow port sweeps and quiet internal discovery go unnoticed because individual flows appear benign.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">CyberPredict Solution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              By continuous temporal state binning and Transformer transition modeling, CyberPredict projects risk curves across multiple future horizons (+5m, +15m, +30m).
            </p>
          </div>
        </div>
      </section>

      {/* 8-Step Pipeline */}
      <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            End-to-End Pipeline
          </span>
          <h2 className="text-3xl font-black text-white">
            How CyberPredict AI Works
          </h2>
          <p className="text-slate-400 text-sm">
            From raw packet captures to predictive MITRE ATT&CK mitigation playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE_STEPS.map((step) => (
            <div key={step.num} className="p-5 rounded-xl bg-cyber-900/60 border border-white/10 space-y-2 hover:border-cyan-500/40 transition-colors">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {step.num}
              </span>
              <h3 className="text-sm font-bold text-white font-mono">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Architecture Overview */}
      <section id="architecture" className="py-16 px-6 max-w-6xl mx-auto border-t border-white/10 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            Temporal World Model
          </span>
          <h2 className="text-3xl font-black text-white">
            Self-Attention Over Sequential Network States
          </h2>
          <p className="text-slate-400 text-sm">
            The world model learns temporal network-state transitions instead of treating each network flow as an isolated event.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-mono">
            <div className="p-4 rounded-xl bg-cyber-850 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px]">Past State S(t-1)</span>
              <p className="font-bold text-white">Baseline Normal</p>
              <span className="text-slate-500 text-[10px]">1,420 flows</span>
            </div>

            <div className="flex items-center justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="p-4 rounded-xl bg-blue-950 border border-blue-500/50 space-y-1 shadow-glow-cyan/20">
              <span className="text-blue-300 text-[10px]">Current State S(t)</span>
              <p className="font-bold text-white">Initial Access</p>
              <span className="text-cyan-400 text-[10px]">Anomalous Ingress</span>
            </div>

            <div className="flex items-center justify-center text-cyan-400">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="p-4 rounded-xl bg-cyan-950 border border-cyan-400 space-y-1 shadow-glow-cyan/30">
              <span className="text-cyan-300 text-[10px]">Forecast State S(t+1)</span>
              <p className="font-bold text-white">Lateral Movement</p>
              <span className="text-cyan-300 text-[10px]">87% Probability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section id="tech" className="py-12 px-6 max-w-6xl mx-auto border-t border-white/10 text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
          Engineered With Industry Standard Defensive Telemetry Technologies
        </span>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-mono text-slate-400">
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-white">React 18 & TypeScript</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-cyan-300">FastAPI & Python 3.11</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-white">PyTorch LSTM & Transformer</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-cyan-300">SHAP Explainable AI</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-white">Scapy & CIC-IDS NetFlow</span>
          <span className="px-3 py-1.5 rounded-lg bg-cyber-900 border border-white/10 text-cyan-300">MITRE ATT&CK v14.1</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-cyber-950 py-8 px-6 text-center text-xs font-mono text-slate-500 space-y-2">
        <p className="text-slate-400">
          CYBERPREDICT AI — Smart India Hackathon Prototype
        </p>
        <p className="text-[11px]">
          Problem Statement: AI-Based Network Attack Forecasting from Network Traffic Data
        </p>
      </footer>
    </div>
  );
};
