import React from 'react';
import { FileText, Shield, ExternalLink, User, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FIRData {
  id: string;
  firNumber: string;
  policeStation: string;
  dateReported: string;
  crimeCategory: string;
  sectionsBNS: string[];
  sectionsIPC?: string[];
  complainant: string;
  status: string;
  severity: string;
  investigatingOfficerName: string;
  briefSummary: string;
  location?: string;
}

interface EmbeddedFIRDossierProps {
  firs: FIRData[];
}

export const EmbeddedFIRDossier: React.FC<EmbeddedFIRDossierProps> = ({ firs }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-3 space-y-3">
      {firs.map((fir) => (
        <div
          key={fir.id}
          className="rounded-lg border border-amber-500/30 bg-slate-950/80 p-3.5 space-y-2.5 shadow-md"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-2 border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 block">
                  {fir.firNumber}
                </span>
                <span className="text-[10px] text-slate-400">{fir.policeStation}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  fir.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : fir.severity === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                }`}
              >
                {fir.severity}
              </span>
              <button
                onClick={() => navigate('/fir')}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="View Full FIR in Registry"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Offence & IO Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
            <div>
              <span className="text-slate-500 block">Classification:</span>
              <span className="font-semibold text-blue-400">{fir.crimeCategory}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Lead Investigator:</span>
              <span className="font-semibold text-slate-200">{fir.investigatingOfficerName}</span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-slate-500 text-[10px] font-mono block mb-0.5">Summary of Occurrence:</span>
            {fir.briefSummary}
          </div>

          {/* BNS Statutes */}
          <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono">
            <span className="text-slate-500 font-semibold">BNS Statutes:</span>
            {fir.sectionsBNS.map((sec, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
              >
                BNS Sec {sec}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
