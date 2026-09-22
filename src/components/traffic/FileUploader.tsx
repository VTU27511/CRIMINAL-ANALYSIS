import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Cpu, 
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';
import { apiService } from '../../services/api';
import { FileUploadStatus, IngestionStep } from '../../types/network';

export const FileUploader: React.FC<{ onUploadComplete?: () => void }> = ({ onUploadComplete }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const PIPELINE_STEPS: Array<{ key: IngestionStep; label: string; desc: string }> = [
    { key: 'uploaded', label: 'Uploaded', desc: 'File verified' },
    { key: 'parsing', label: 'Parsing', desc: 'PCAP / CSV decode' },
    { key: 'feature_extraction', label: 'Feature Extraction', desc: '17 flow features' },
    { key: 'time_windowing', label: 'Time Windowing', desc: '1m / 5m rolling bins' },
    { key: 'state_construction', label: 'State Construction', desc: 'Network state vector S(t)' },
    { key: 'model_inference', label: 'Model Inference', desc: 'Temporal Transformer' },
    { key: 'forecast_ready', label: 'Forecast Ready', desc: 'Multi-step projection' }
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setValidationError(null);

    // Validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'pcap', 'pcapng'].includes(ext || '')) {
      setValidationError('Invalid file format. Only CSV, PCAP, and PCAPNG capture files are supported.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setValidationError('File exceeds 100MB limit for telemetry stream buffer.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await apiService.uploadFile(file, (status) => {
        setUploadStatus({ ...status });
      });
      onUploadComplete?.();
    } catch (err: any) {
      setValidationError('Error processing telemetry capture file: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide font-mono flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            Network Traffic Data Ingestion Pipeline
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ingest raw packet captures (.pcap) or pre-aggregated flow logs (.csv) to build temporal network state vectors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Upload PCAP</span>
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-cyber-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-glow-cyan"
          >
            <FileText className="w-4 h-4 text-cyber-950 font-bold" />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      <input 
        ref={inputRef}
        type="file" 
        accept=".csv,.pcap,.pcapng"
        className="hidden" 
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag and Drop Box */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive 
            ? 'border-cyan-400 bg-cyan-950/30 shadow-glow-cyan' 
            : 'border-white/10 hover:border-cyan-500/40 bg-cyber-950/40'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {isProcessing ? 'Processing Telemetry Streams...' : 'Drag & drop PCAP or CSV files here, or click to browse'}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Supports: Wireshark PCAP/PCAPNG, Zeek/Bro TSV/CSV, CIC-IDS-2018 NetFlow format (Max 100MB)
            </p>
          </div>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Uploaded File Info & 7-Stage Pipeline Visualizer */}
      {uploadStatus && (
        <div className="bg-cyber-850/80 rounded-xl p-4 border border-white/10 space-y-4">
          {/* File Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 text-xs font-mono gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-slate-400">File:</span>
              <strong className="text-white">{uploadStatus.fileName}</strong>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px]">
                {uploadStatus.format}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>Size: {(uploadStatus.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
              <span>Time: {uploadStatus.uploadTimestamp}</span>
              {uploadStatus.totalFlowsExtracted && (
                <span className="text-emerald-400 font-semibold">
                  {uploadStatus.totalFlowsExtracted.toLocaleString()} flows decoded
                </span>
              )}
            </div>
          </div>

          {/* 7-Step Progress Pipeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                Processing Pipeline Status
              </span>
              <span className="text-cyan-400 font-bold">
                {uploadStatus.progressPercent}% Complete
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {PIPELINE_STEPS.map((step, idx) => {
                const currentIdx = PIPELINE_STEPS.findIndex(s => s.key === uploadStatus.step);
                const isPassed = currentIdx > idx || uploadStatus.step === 'forecast_ready';
                const isCurrent = uploadStatus.step === step.key && !isPassed;

                return (
                  <div 
                    key={step.key}
                    className={`p-2 rounded-lg border text-xs font-mono transition-all ${
                      isPassed 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                        : isCurrent 
                        ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-glow-cyan/20 animate-pulse' 
                        : 'bg-cyber-900/40 border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-slate-400">#{idx + 1}</span>
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      ) : (
                        <Clock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <p className="font-bold text-[11px] truncate">{step.label}</p>
                    <p className="text-[9px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
