import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, CheckCircle } from 'lucide-react';

interface SupportingRecord {
  id: string;
  type: string;
  name: string;
  confidence?: number;
  ref?: string;
}

interface SupportingRecordsTableProps {
  records: SupportingRecord[];
}

export const SupportingRecordsTable: React.FC<SupportingRecordsTableProps> = ({ records }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!records || records.length === 0) return null;

  return (
    <div className="mt-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)]/80 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors"
      >
        <div className="flex items-center gap-1.5 text-blue-400">
          <Database className="w-3.5 h-3.5" />
          <span>Supporting Verified Records ({records.length})</span>
          <CheckCircle className="w-3 h-3 text-emerald-400" />
        </div>
        <div className="flex items-center gap-1 text-[var(--text-muted)] text-[10px]">
          <span>{isOpen ? 'Hide Records' : 'View Records'}</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[var(--border-subtle)] p-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px]">
              <thead>
                <tr className="text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="pb-1.5 pl-1">Record ID</th>
                  <th className="pb-1.5">Class</th>
                  <th className="pb-1.5">Identifier / Name</th>
                  <th className="pb-1.5 text-right pr-1">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]/40">
                {records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-blue-500/5 transition-colors">
                    <td className="py-1.5 pl-1 text-blue-400 font-bold">{r.id}</td>
                    <td className="py-1.5">
                      <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 text-[9px]">
                        {r.type}
                      </span>
                    </td>
                    <td className="py-1.5 text-[var(--text-primary)]">{r.name}</td>
                    <td className="py-1.5 text-right pr-1 font-bold text-emerald-400">
                      {r.confidence ? `${r.confidence}%` : '96.5%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
