import React from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  GitBranch, 
  Activity,
  Terminal,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { TemporalStateSequence } from '../components/forecast/TemporalStateSequence';

export const WorldModelPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white font-mono tracking-wide">
            Temporal AI World Model Architecture
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            Self-Attention Latent State Space
          </span>
        </div>
        <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-4xl">
          "The world model learns temporal network-state transitions instead of treating each network flow as an isolated event."
        </p>
      </div>

      {/* Conceptual Diagram: S(t) -> Model -> S(t+1) -> Rollout */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-6">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider text-center">
          Autoregressive Multi-Step Rollout Dynamics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-xs font-mono">
          {/* Step 1: Observed State */}
          <div className="p-4 rounded-xl bg-cyber-900 border border-blue-500/50 space-y-2 text-center">
            <span className="text-[10px] text-blue-300 uppercase font-bold block">Current Observation</span>
            <div className="text-2xl font-black text-white font-mono">S(t)</div>
            <p className="text-[10px] text-slate-400">17-dim aggregated flow feature vector</p>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Step 2: Temporal Model */}
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-400 space-y-2 text-center shadow-glow-cyan/20">
            <span className="text-[10px] text-cyan-300 uppercase font-bold block">Temporal AI Model</span>
            <div className="text-sm font-black text-white font-mono">Transformer / LSTM</div>
            <p className="text-[10px] text-slate-300">4-Head Attention + Positional Encoding</p>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Step 3: Predicted Future State */}
          <div className="p-4 rounded-xl bg-cyber-900 border border-purple-500/50 space-y-2 text-center">
            <span className="text-[10px] text-purple-300 uppercase font-bold block">1-Step Forecast</span>
            <div className="text-2xl font-black text-white font-mono">S(t+1)</div>
            <p className="text-[10px] text-slate-400">Next state distribution & stage logits</p>
          </div>

          <div className="flex justify-center text-cyan-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>

          {/* Step 4: Multi-Step Rollout */}
          <div className="p-4 rounded-xl bg-cyber-900 border border-red-500/50 space-y-2 text-center">
            <span className="text-[10px] text-red-300 uppercase font-bold block">Multi-Step Rollout</span>
            <div className="text-sm font-black text-white font-mono">S(t+2) ... S(t+5)</div>
            <p className="text-[10px] text-slate-400">T+10m, T+20m, T+30m horizons</p>
          </div>
        </div>

        {/* Mathematical Formulation Box */}
        <div className="p-4 rounded-xl bg-cyber-950 border border-white/10 space-y-3 font-mono text-xs">
          <span className="text-cyan-400 font-bold uppercase text-[11px] block">
            Mathematical Formulation: Latent State Transition Dynamics
          </span>
          <div className="p-3 rounded bg-cyber-900 border border-white/5 space-y-2 text-slate-300">
            <p>
              1. <strong>Temporal State Vector:</strong> <code className="text-cyan-300">S_t = [phi(F_1), phi(F_2), ..., phi(F_m)] in R^d</code>, where each flow F_i contributes to empirical packet arrival rates, SYN-to-ACK ratios, and destination entropy over window Delta t.
            </p>
            <p>
              2. <strong>Autoregressive Rollout:</strong> <code className="text-cyan-300">S_(t+k) = f_theta(S_(t+k-1), ..., S_t)</code>, conditioned on learned transition dynamics across MITRE ATT&CK kill-chain phases.
            </p>
            <p>
              3. <strong>Stage Classification & Risk:</strong> <code className="text-cyan-300">P(Y_(t+k) = Stage_j | S_(t+k)) = softmax(W * S_(t+k) + b)</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Sequence View */}
      <TemporalStateSequence />
    </div>
  );
};
