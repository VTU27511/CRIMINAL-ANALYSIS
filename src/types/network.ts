export type HostStatus = 'normal' | 'suspicious' | 'potentially_affected' | 'predicted_target';

export type HostRole = 
  | 'external_internet'
  | 'potential_attacker'
  | 'edge_gateway'
  | 'web_server'
  | 'app_server'
  | 'database'
  | 'workstation'
  | 'domain_controller';

export interface HostNode {
  id: string;
  name: string;
  ip: string;
  role: HostRole;
  status: HostStatus;
  riskScore: number; // 0 to 100
  activeConnections: number;
  trafficVolumeMB: number;
  currentState: string;
  predictedState: string;
  lastActivity: string;
  os?: string;
  zone: 'external' | 'dmz' | 'internal' | 'secure_core';
  x?: number;
  y?: number;
  quarantined?: boolean;
}

export interface NetworkLink {
  id: string;
  source: string; // HostNode id
  target: string; // HostNode id
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTPS' | 'SSH' | 'DNS' | 'SMB';
  bytesPerSec: number;
  packetsPerSec: number;
  isSuspicious: boolean;
  predictedPath?: boolean;
  port: number;
}

export interface NetworkTopologyData {
  nodes: HostNode[];
  links: NetworkLink[];
  totalHosts: number;
  suspiciousHostsCount: number;
  compromisedCount: number;
  predictedTargetCount: number;
  lastUpdated: string;
}

export interface TrafficFlow {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH' | 'SMB';
  flowDurationMs: number;
  totalPackets: number;
  totalBytes: number;
  packetRate: number;
  byteRate: number;
  synRatio: number;
  ackRatio: number;
  rstRatio: number;
  finRatio: number;
  interArrivalTimeMs: number;
  ttl: number;
  retransmissionRate: number;
  anomalyScore: number;
  attackCategory?: string;
  isSuspicious: boolean;
}

export type IngestionStep = 
  | 'idle'
  | 'uploaded'
  | 'parsing'
  | 'feature_extraction'
  | 'time_windowing'
  | 'state_construction'
  | 'model_inference'
  | 'forecast_ready';

export interface FileUploadStatus {
  fileName: string;
  fileSizeBytes: number;
  format: 'CSV' | 'PCAP' | 'PCAPNG';
  uploadTimestamp: string;
  step: IngestionStep;
  progressPercent: number;
  totalFlowsExtracted?: number;
  error?: string;
}
