import React from 'react';
import { FileUploader } from '../components/traffic/FileUploader';
import { FlowFeaturesTable } from '../components/traffic/FlowFeaturesTable';
import { TemporalStateSequence } from '../components/forecast/TemporalStateSequence';

export const TrafficAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. PCAP / CSV Telemetry Ingestion Pipeline */}
      <FileUploader />

      {/* 2. Temporal State Sequence */}
      <TemporalStateSequence />

      {/* 3. 17-Dimensional Flow Telemetry Features Table */}
      <FlowFeaturesTable />
    </div>
  );
};
