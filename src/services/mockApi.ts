import { 
  HostNode, 
  NetworkLink, 
  NetworkTopologyData, 
  TrafficFlow 
} from '../types/network';
import { 
  ForecastHorizonPoint, 
  MultiStepForecastCardData, 
  AttackTrajectoryStage, 
  TemporalNetworkState, 
  FeatureImportanceItem, 
  ModelEvaluationResult,
  KillChainStage
} from '../types/forecast';
import { SocAlert, DefensiveRecommendation } from '../types/alert';
import { MitreTacticColumn } from '../types/mitre';

export interface AttackScenarioPhase {
  phaseIndex: number;
  phaseName: string;
  stageName: KillChainStage;
  predictedStage: KillChainStage;
  currentRiskScore: number;
  forecastConfidence: number;
  activeHostsCount: number;
  suspiciousHostsCount: number;
  summaryNote: string;
  mitreTactic: string;
}

export const SCENARIO_PHASES: AttackScenarioPhase[] = [
  {
    phaseIndex: 0,
    phaseName: "Baseline Normal Traffic",
    stageName: "Reconnaissance",
    predictedStage: "Reconnaissance",
    currentRiskScore: 9,
    forecastConfidence: 91,
    activeHostsCount: 24,
    suspiciousHostsCount: 0,
    summaryNote: "Network is operating within normal statistical bounds. No anomaly clusters detected.",
    mitreTactic: "None"
  },
  {
    phaseIndex: 1,
    phaseName: "External Reconnaissance & Port Sweeping",
    stageName: "Reconnaissance",
    predictedStage: "Initial Access",
    currentRiskScore: 38,
    forecastConfidence: 82,
    activeHostsCount: 24,
    suspiciousHostsCount: 1,
    summaryNote: "High-frequency SYN scans directed against Host-01 edge port 80/443. Elevated port diversity.",
    mitreTactic: "TA0043 Reconnaissance"
  },
  {
    phaseIndex: 2,
    phaseName: "Exploitation & Initial Access",
    stageName: "Initial Access",
    predictedStage: "Discovery",
    currentRiskScore: 64,
    forecastConfidence: 86,
    activeHostsCount: 24,
    suspiciousHostsCount: 2,
    summaryNote: "Anomalous ingress flow duration on Host-01 with reverse shell payload signature detected.",
    mitreTactic: "TA0001 Initial Access"
  },
  {
    phaseIndex: 3,
    phaseName: "Internal Host & Subnet Discovery",
    stageName: "Discovery",
    predictedStage: "Lateral Movement",
    currentRiskScore: 78,
    forecastConfidence: 88,
    activeHostsCount: 24,
    suspiciousHostsCount: 3,
    summaryNote: "Host-01 initiating ARP/SMB sweeps towards Server-01 and Workstation-01. Destination spread spiking.",
    mitreTactic: "TA0007 Discovery"
  },
  {
    phaseIndex: 4,
    phaseName: "Active Lateral Movement & Pivoting",
    stageName: "Lateral Movement",
    predictedStage: "Command and Control",
    currentRiskScore: 87,
    forecastConfidence: 84,
    activeHostsCount: 24,
    suspiciousHostsCount: 4,
    summaryNote: "Server-01 authenticated via Pass-the-Hash/WinRM from Host-01. East-west traffic volume anomaly.",
    mitreTactic: "TA0008 Lateral Movement"
  },
  {
    phaseIndex: 5,
    phaseName: "C2 Channel & Exfiltration Staging",
    stageName: "Command and Control",
    predictedStage: "Exfiltration",
    currentRiskScore: 94,
    forecastConfidence: 89,
    activeHostsCount: 24,
    suspiciousHostsCount: 5,
    summaryNote: "Periodic TLS beaconing observed to external adversary IP. High-volume staging detected on Database-01.",
    mitreTactic: "TA0011 Command and Control"
  }
];

// Kill Chain Trajectory definition
export const KILL_CHAIN_STAGES: KillChainStage[] = [
  'Reconnaissance',
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Command and Control',
  'Exfiltration',
  'Impact'
];

export class MockApiService {
  private currentPhaseIndex: number = 2; // Default to Initial Access -> Lateral Movement demo

  public getPhaseIndex(): number {
    return this.currentPhaseIndex;
  }

  public setPhaseIndex(index: number): void {
    if (index >= 0 && index < SCENARIO_PHASES.length) {
      this.currentPhaseIndex = index;
    }
  }

  public getActiveScenario(): AttackScenarioPhase {
    return SCENARIO_PHASES[this.currentPhaseIndex];
  }

  public getForecastCurves(): ForecastHorizonPoint[] {
    const p = this.getActiveScenario();
    const nowRisk = p.currentRiskScore / 100;
    
    // Generate realistic curve: past 3 points + Now + future 6 points
    const points: ForecastHorizonPoint[] = [
      {
        horizon: '-15 min',
        minutesFromNow: -15,
        timestamp: '19:30',
        riskScore: Math.max(0.05, +(nowRisk * 0.45).toFixed(2)),
        predictedStage: 'Reconnaissance',
        confidence: 0.95,
        lowerConfidenceBound: Math.max(0.02, +(nowRisk * 0.40).toFixed(2)),
        upperConfidenceBound: +(nowRisk * 0.50).toFixed(2),
        isForecast: false
      },
      {
        horizon: '-10 min',
        minutesFromNow: -10,
        timestamp: '19:35',
        riskScore: Math.max(0.06, +(nowRisk * 0.65).toFixed(2)),
        predictedStage: 'Reconnaissance',
        confidence: 0.93,
        lowerConfidenceBound: Math.max(0.03, +(nowRisk * 0.58).toFixed(2)),
        upperConfidenceBound: +(nowRisk * 0.72).toFixed(2),
        isForecast: false
      },
      {
        horizon: '-5 min',
        minutesFromNow: -5,
        timestamp: '19:40',
        riskScore: Math.max(0.08, +(nowRisk * 0.85).toFixed(2)),
        predictedStage: p.stageName,
        confidence: 0.91,
        lowerConfidenceBound: Math.max(0.04, +(nowRisk * 0.78).toFixed(2)),
        upperConfidenceBound: +(nowRisk * 0.92).toFixed(2),
        isForecast: false
      },
      {
        horizon: 'Now',
        minutesFromNow: 0,
        timestamp: '19:45',
        riskScore: +(nowRisk).toFixed(2),
        predictedStage: p.stageName,
        confidence: +(p.forecastConfidence / 100).toFixed(2),
        lowerConfidenceBound: Math.max(0.05, +(nowRisk - 0.06).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.06).toFixed(2)),
        isForecast: false
      },
      // Forecast Horizons
      {
        horizon: '+5 min',
        minutesFromNow: 5,
        timestamp: '19:50',
        riskScore: Math.min(0.98, +(nowRisk + 0.08).toFixed(2)),
        predictedStage: p.stageName === 'Reconnaissance' ? 'Initial Access' : p.stageName,
        confidence: 0.88,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.01).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.15).toFixed(2)),
        isForecast: true
      },
      {
        horizon: '+10 min',
        minutesFromNow: 10,
        timestamp: '19:55',
        riskScore: Math.min(0.98, +(nowRisk + 0.16).toFixed(2)),
        predictedStage: p.predictedStage,
        confidence: 0.84,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.07).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.25).toFixed(2)),
        isForecast: true
      },
      {
        horizon: '+15 min',
        minutesFromNow: 15,
        timestamp: '20:00',
        riskScore: Math.min(0.98, +(nowRisk + 0.23).toFixed(2)),
        predictedStage: p.predictedStage,
        confidence: 0.81,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.12).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.33).toFixed(2)),
        isForecast: true
      },
      {
        horizon: '+20 min',
        minutesFromNow: 20,
        timestamp: '20:05',
        riskScore: Math.min(0.99, +(nowRisk + 0.28).toFixed(2)),
        predictedStage: p.predictedStage,
        confidence: 0.77,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.15).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.40).toFixed(2)),
        isForecast: true
      },
      {
        horizon: '+25 min',
        minutesFromNow: 25,
        timestamp: '20:10',
        riskScore: Math.min(1.0, +(nowRisk + 0.31).toFixed(2)),
        predictedStage: p.phaseIndex >= 3 ? 'Command and Control' : 'Lateral Movement',
        confidence: 0.72,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.16).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.46).toFixed(2)),
        isForecast: true
      },
      {
        horizon: '+30 min',
        minutesFromNow: 30,
        timestamp: '20:15',
        riskScore: Math.min(1.0, +(nowRisk + 0.35).toFixed(2)),
        predictedStage: p.phaseIndex >= 3 ? 'Exfiltration' : 'Command and Control',
        confidence: 0.68,
        lowerConfidenceBound: Math.max(0.05, +(nowRisk + 0.18).toFixed(2)),
        upperConfidenceBound: Math.min(1.0, +(nowRisk + 0.52).toFixed(2)),
        isForecast: true
      }
    ];

    return points;
  }

  public getMultiStepCards(): MultiStepForecastCardData[] {
    const p = this.getActiveScenario();
    const baseRisk = p.currentRiskScore;

    return [
      {
        horizon: 'T+5 min',
        minutes: 5,
        riskPercent: Math.min(99, Math.round(baseRisk + 8)),
        stage: p.stageName,
        confidencePercent: 88,
        stateDelta: {
          flowAnomalyDelta: "+14% flow rate",
          portSpreadDelta: "+4 ports probed",
          velocityDelta: "Accelerating"
        },
        summary: "Anomalous ingress persistent; initial beacon probing expected."
      },
      {
        horizon: 'T+10 min',
        minutes: 10,
        riskPercent: Math.min(99, Math.round(baseRisk + 16)),
        stage: p.predictedStage,
        confidencePercent: 84,
        stateDelta: {
          flowAnomalyDelta: "+28% anomalous flows",
          portSpreadDelta: "+12 subnet IPs",
          velocityDelta: "High velocity"
        },
        summary: `Anticipated transition toward ${p.predictedStage} stage based on learned temporal transition matrix.`
      },
      {
        horizon: 'T+15 min',
        minutes: 15,
        riskPercent: Math.min(99, Math.round(baseRisk + 22)),
        stage: p.predictedStage,
        confidencePercent: 81,
        stateDelta: {
          flowAnomalyDelta: "+35% SYN concentration",
          portSpreadDelta: "Internal ARP sweeps",
          velocityDelta: "Sustained"
        },
        summary: "Internal pivot probability crosses 80% containment threshold."
      },
      {
        horizon: 'T+20 min',
        minutes: 20,
        riskPercent: Math.min(99, Math.round(baseRisk + 28)),
        stage: p.phaseIndex >= 3 ? 'Command and Control' : 'Lateral Movement',
        confidencePercent: 77,
        stateDelta: {
          flowAnomalyDelta: "+42% East-West ratio",
          portSpreadDelta: "SMB/RPC port targeting",
          velocityDelta: "Elevated"
        },
        summary: "Lateral infection of adjacent file and auth servers predicted."
      },
      {
        horizon: 'T+30 min',
        minutes: 30,
        riskPercent: Math.min(100, Math.round(baseRisk + 34)),
        stage: p.phaseIndex >= 3 ? 'Exfiltration' : 'Command and Control',
        confidencePercent: 70,
        stateDelta: {
          flowAnomalyDelta: "+60% egress byte burst",
          portSpreadDelta: "External TLS tunnel",
          velocityDelta: "Critical"
        },
        summary: "High probability of exfiltration channel or persistence establishment."
      }
    ];
  }

  public getAttackTrajectory(): AttackTrajectoryStage[] {
    const p = this.getActiveScenario();
    const currentName = p.stageName;
    const predictedName = p.predictedStage;

    const stages: AttackTrajectoryStage[] = [
      { id: '1', name: 'Reconnaissance', order: 1, isCurrent: false, isPredictedNext: false, probabilityPercent: 95, confidencePercent: 94, mitreTacticId: 'TA0043', activeTechniques: ['T1046', 'T1595'], indicatorColor: '#00f2ff' },
      { id: '2', name: 'Initial Access', order: 2, isCurrent: false, isPredictedNext: false, probabilityPercent: 88, confidencePercent: 90, mitreTacticId: 'TA0001', activeTechniques: ['T1190', 'T1133'], indicatorColor: '#3b82f6' },
      { id: '3', name: 'Execution', order: 3, isCurrent: false, isPredictedNext: false, probabilityPercent: 72, confidencePercent: 85, mitreTacticId: 'TA0002', activeTechniques: ['T1059', 'T1203'], indicatorColor: '#8a2be2' },
      { id: '4', name: 'Persistence', order: 4, isCurrent: false, isPredictedNext: false, probabilityPercent: 64, confidencePercent: 82, mitreTacticId: 'TA0003', activeTechniques: ['T1053', 'T1136'], indicatorColor: '#a855f7' },
      { id: '5', name: 'Privilege Escalation', order: 5, isCurrent: false, isPredictedNext: false, probabilityPercent: 58, confidencePercent: 79, mitreTacticId: 'TA0004', activeTechniques: ['T1068', 'T1055'], indicatorColor: '#eab308' },
      { id: '6', name: 'Discovery', order: 6, isCurrent: false, isPredictedNext: false, probabilityPercent: 81, confidencePercent: 87, mitreTacticId: 'TA0007', activeTechniques: ['T1018', 'T1087'], indicatorColor: '#f97316' },
      { id: '7', name: 'Lateral Movement', order: 7, isCurrent: false, isPredictedNext: false, probabilityPercent: 87, confidencePercent: 84, mitreTacticId: 'TA0008', activeTechniques: ['T1021', 'T1570'], indicatorColor: '#ef4444' },
      { id: '8', name: 'Command and Control', order: 8, isCurrent: false, isPredictedNext: false, probabilityPercent: 68, confidencePercent: 81, mitreTacticId: 'TA0011', activeTechniques: ['T1071', 'T1573'], indicatorColor: '#dc2626' },
      { id: '9', name: 'Exfiltration', order: 9, isCurrent: false, isPredictedNext: false, probabilityPercent: 44, confidencePercent: 75, mitreTacticId: 'TA0010', activeTechniques: ['T1048', 'T1567'], indicatorColor: '#b91c1c' },
      { id: '10', name: 'Impact', order: 10, isCurrent: false, isPredictedNext: false, probabilityPercent: 32, confidencePercent: 70, mitreTacticId: 'TA0040', activeTechniques: ['T1486', 'T1490'], indicatorColor: '#7f1d1d' }
    ];

    return stages.map(s => {
      const isCur = s.name === currentName;
      const isPred = s.name === predictedName && !isCur;
      return {
        ...s,
        isCurrent: isCur,
        isPredictedNext: isPred,
        probabilityPercent: isCur ? 96 : isPred ? 87 : s.probabilityPercent
      };
    });
  }

  public getNetworkTopology(): NetworkTopologyData {
    const p = this.getActiveScenario();

    // Node statuses update according to scenario progression
    const host01Status = p.phaseIndex >= 1 ? (p.phaseIndex >= 2 ? 'suspicious' : 'potentially_affected') : 'normal';
    const server01Status = p.phaseIndex >= 3 ? (p.phaseIndex >= 4 ? 'suspicious' : 'potentially_affected') : (p.phaseIndex >= 2 ? 'predicted_target' : 'normal');
    const database01Status = p.phaseIndex >= 4 ? (p.phaseIndex >= 5 ? 'potentially_affected' : 'predicted_target') : (p.phaseIndex >= 3 ? 'predicted_target' : 'normal');
    const workstation01Status = p.phaseIndex >= 3 ? 'potentially_affected' : 'normal';
    const host02Status = p.phaseIndex >= 4 ? 'potentially_affected' : 'normal';

    const nodes: HostNode[] = [
      {
        id: 'internet',
        name: 'Public Internet',
        ip: '0.0.0.0/0',
        role: 'external_internet',
        status: 'normal',
        riskScore: 10,
        activeConnections: 184,
        trafficVolumeMB: 4850,
        currentState: 'Broad Ingress Gateway',
        predictedState: 'Continuous Ingress',
        lastActivity: 'Active (1s ago)',
        zone: 'external',
        x: 80,
        y: 190
      },
      {
        id: 'attacker',
        name: 'Potential Attacker',
        ip: '198.51.100.74',
        role: 'potential_attacker',
        status: p.phaseIndex >= 1 ? 'suspicious' : 'normal',
        riskScore: p.phaseIndex >= 1 ? 92 : 15,
        activeConnections: p.phaseIndex >= 1 ? 28 : 2,
        trafficVolumeMB: 412,
        currentState: p.phaseIndex >= 1 ? 'SYN Flooding / C2 Probing' : 'Idle',
        predictedState: 'Active Payload Delivery',
        lastActivity: 'Active (0s ago)',
        zone: 'external',
        x: 230,
        y: 80
      },
      {
        id: 'gateway',
        name: 'Edge-Gateway-01',
        ip: '192.168.1.1',
        role: 'edge_gateway',
        status: 'normal',
        riskScore: 24,
        activeConnections: 142,
        trafficVolumeMB: 2840,
        currentState: 'Stateful Filtering',
        predictedState: 'Packet Filtering Under Load',
        lastActivity: 'Active (0s ago)',
        zone: 'dmz',
        x: 230,
        y: 280
      },
      {
        id: 'host-01',
        name: 'Host-01 (DMZ Web)',
        ip: '192.168.1.45',
        role: 'web_server',
        status: host01Status,
        riskScore: p.phaseIndex >= 2 ? 88 : (p.phaseIndex === 1 ? 48 : 8),
        activeConnections: 45,
        trafficVolumeMB: 1240,
        currentState: p.phaseIndex >= 2 ? 'Exploitation / Shell Active' : 'HTTP/TLS Serving',
        predictedState: 'Pivot Point / Subnet Discovery',
        lastActivity: 'Active (0s ago)',
        os: 'Ubuntu Linux 22.04 LTS',
        zone: 'dmz',
        x: 420,
        y: 130
      },
      {
        id: 'host-02',
        name: 'Host-02 (API Gateway)',
        ip: '192.168.1.46',
        role: 'web_server',
        status: host02Status,
        riskScore: p.phaseIndex >= 4 ? 54 : 12,
        activeConnections: 31,
        trafficVolumeMB: 950,
        currentState: 'REST API Proxy',
        predictedState: 'Secondary Ingress Target',
        lastActivity: 'Active (3s ago)',
        os: 'Debian 12',
        zone: 'dmz',
        x: 420,
        y: 290
      },
      {
        id: 'server-01',
        name: 'Server-01 (App Server)',
        ip: '10.0.2.10',
        role: 'app_server',
        status: server01Status,
        riskScore: p.phaseIndex >= 4 ? 82 : (p.phaseIndex >= 3 ? 55 : 14),
        activeConnections: 26,
        trafficVolumeMB: 840,
        currentState: p.phaseIndex >= 4 ? 'Unauthorized WinRM Execution' : 'Java Middleware Runtime',
        predictedState: 'Lateral Credential Harvesting',
        lastActivity: 'Active (1s ago)',
        os: 'Windows Server 2022',
        zone: 'internal',
        x: 630,
        y: 110
      },
      {
        id: 'server-02',
        name: 'Server-02 (Auth / DC)',
        ip: '10.0.2.20',
        role: 'domain_controller',
        status: p.phaseIndex >= 4 ? 'predicted_target' : 'normal',
        riskScore: p.phaseIndex >= 4 ? 68 : 9,
        activeConnections: 48,
        trafficVolumeMB: 512,
        currentState: 'Active Directory / Kerberos',
        predictedState: 'Target of Golden Ticket Attack',
        lastActivity: 'Active (2s ago)',
        os: 'Windows Server 2022',
        zone: 'secure_core',
        x: 630,
        y: 270
      },
      {
        id: 'database-01',
        name: 'Database-01 (Prod DB)',
        ip: '10.0.3.50',
        role: 'database',
        status: database01Status,
        riskScore: p.phaseIndex >= 5 ? 89 : (p.phaseIndex >= 4 ? 64 : 8),
        activeConnections: 12,
        trafficVolumeMB: 2150,
        currentState: p.phaseIndex >= 5 ? 'High Rate Dump / Exfiltration Staging' : 'PostgreSQL 16 Engine',
        predictedState: 'Data Exfiltration / Ransomware Encryption',
        lastActivity: 'Active (0s ago)',
        os: 'RHEL 9.2 Enterprise',
        zone: 'secure_core',
        x: 840,
        y: 190
      },
      {
        id: 'workstation-01',
        name: 'Workstation-01 (Admin PC)',
        ip: '10.0.4.15',
        role: 'workstation',
        status: workstation01Status,
        riskScore: p.phaseIndex >= 3 ? 42 : 11,
        activeConnections: 8,
        trafficVolumeMB: 190,
        currentState: 'User Desktop Session',
        predictedState: 'Credential Harvesting Target',
        lastActivity: 'Active (12s ago)',
        os: 'Windows 11 Pro',
        zone: 'internal',
        x: 470,
        y: 430
      },
      {
        id: 'workstation-02',
        name: 'Workstation-02 (Dev PC)',
        ip: '10.0.4.18',
        role: 'workstation',
        status: 'normal',
        riskScore: 10,
        activeConnections: 6,
        trafficVolumeMB: 220,
        currentState: 'Developer IDE Idle',
        predictedState: 'Uncompromised',
        lastActivity: 'Active (45s ago)',
        os: 'Ubuntu 22.04',
        zone: 'internal',
        x: 680,
        y: 430
      }
    ];

    const links: NetworkLink[] = [
      { id: 'l1', source: 'attacker', target: 'host-01', protocol: 'TCP', bytesPerSec: 14200, packetsPerSec: 180, isSuspicious: p.phaseIndex >= 1, predictedPath: false, port: 443 },
      { id: 'l2', source: 'internet', target: 'gateway', protocol: 'HTTPS', bytesPerSec: 85000, packetsPerSec: 420, isSuspicious: false, predictedPath: false, port: 443 },
      { id: 'l3', source: 'gateway', target: 'host-01', protocol: 'TCP', bytesPerSec: 42000, packetsPerSec: 210, isSuspicious: false, predictedPath: false, port: 80 },
      { id: 'l4', source: 'gateway', target: 'host-02', protocol: 'HTTPS', bytesPerSec: 28000, packetsPerSec: 140, isSuspicious: false, predictedPath: false, port: 8080 },
      { id: 'l5', source: 'host-01', target: 'server-01', protocol: 'SMB', bytesPerSec: p.phaseIndex >= 3 ? 58000 : 1200, packetsPerSec: p.phaseIndex >= 3 ? 290 : 8, isSuspicious: p.phaseIndex >= 3, predictedPath: p.phaseIndex === 2, port: 445 },
      { id: 'l6', source: 'host-01', target: 'workstation-01', protocol: 'ICMP', bytesPerSec: p.phaseIndex >= 3 ? 8400 : 0, packetsPerSec: p.phaseIndex >= 3 ? 90 : 0, isSuspicious: p.phaseIndex >= 3, predictedPath: false, port: 0 },
      { id: 'l7', source: 'server-01', target: 'database-01', protocol: 'TCP', bytesPerSec: p.phaseIndex >= 5 ? 140000 : 18000, packetsPerSec: p.phaseIndex >= 5 ? 750 : 95, isSuspicious: p.phaseIndex >= 5, predictedPath: p.phaseIndex >= 3, port: 5432 },
      { id: 'l8', source: 'server-01', target: 'server-02', protocol: 'TCP', bytesPerSec: 4200, packetsPerSec: 25, isSuspicious: p.phaseIndex >= 4, predictedPath: p.phaseIndex >= 3, port: 88 },
      { id: 'l9', source: 'workstation-01', target: 'server-01', protocol: 'SSH', bytesPerSec: 2400, packetsPerSec: 14, isSuspicious: false, predictedPath: false, port: 22 },
      { id: 'l10', source: 'workstation-02', target: 'host-02', protocol: 'HTTPS', bytesPerSec: 3600, packetsPerSec: 18, isSuspicious: false, predictedPath: false, port: 443 }
    ];

    const suspiciousCount = nodes.filter(n => n.status === 'suspicious').length;
    const compromisedCount = nodes.filter(n => n.status === 'potentially_affected').length;
    const targetCount = nodes.filter(n => n.status === 'predicted_target').length;

    return {
      nodes,
      links,
      totalHosts: nodes.length,
      suspiciousHostsCount: suspiciousCount,
      compromisedCount,
      predictedTargetCount: targetCount,
      lastUpdated: new Date().toLocaleTimeString()
    };
  }

  public getTemporalStates(): TemporalNetworkState[] {
    const p = this.getActiveScenario();

    return [
      {
        stateId: 'S1',
        timeLabel: 'T - 15 min (Normal)',
        flowCount: 1420,
        uniqueSources: 18,
        uniqueDestinations: 14,
        packetRate: 480,
        byteRate: 642000,
        synRatio: 0.08,
        portDiversity: 0.12,
        timingAnomalies: 2,
        riskScore: 12,
        isPredicted: false
      },
      {
        stateId: 'S2',
        timeLabel: 'T - 10 min (Incipient)',
        flowCount: 1890,
        uniqueSources: 24,
        uniqueDestinations: 19,
        packetRate: 720,
        byteRate: 980000,
        synRatio: 0.19,
        portDiversity: 0.28,
        timingAnomalies: 9,
        riskScore: 32,
        isPredicted: false
      },
      {
        stateId: 'S3',
        timeLabel: 'T - 5 min (Pre-Exploit)',
        flowCount: 2640,
        uniqueSources: 31,
        uniqueDestinations: 26,
        packetRate: 1140,
        byteRate: 1540000,
        synRatio: 0.35,
        portDiversity: 0.44,
        timingAnomalies: 24,
        riskScore: 56,
        isPredicted: false
      },
      {
        stateId: 'S4',
        timeLabel: 'T (Current Observation)',
        flowCount: 3410,
        uniqueSources: 42,
        uniqueDestinations: 38,
        packetRate: 1680,
        byteRate: 2410000,
        synRatio: +(0.45 * (p.currentRiskScore / 100) + 0.1).toFixed(2),
        portDiversity: +(0.52 * (p.currentRiskScore / 100) + 0.15).toFixed(2),
        timingAnomalies: Math.round(48 * (p.currentRiskScore / 100)),
        riskScore: p.currentRiskScore,
        isPredicted: false
      },
      {
        stateId: 'S5 (Predicted)',
        timeLabel: 'T + 15 min (Forecast)',
        flowCount: Math.round(4200 * (p.currentRiskScore / 80)),
        uniqueSources: 58,
        uniqueDestinations: 49,
        packetRate: 2350,
        byteRate: 3800000,
        synRatio: 0.58,
        portDiversity: 0.72,
        timingAnomalies: 84,
        riskScore: Math.min(99, p.currentRiskScore + 20),
        isPredicted: true
      }
    ];
  }

  public getExplainabilityFeatures(): FeatureImportanceItem[] {
    const p = this.getActiveScenario();

    return [
      {
        id: 'f1',
        featureName: 'syn_ratio',
        humanName: 'SYN Flag Concentration',
        featureValue: `${(0.38 * (p.currentRiskScore / 70)).toFixed(2)} (Normal: <0.08)`,
        shapValue: +0.31,
        contributionPercent: 31,
        direction: 'increases_risk',
        importanceRank: 1,
        explanation: 'Elevated ratio of TCP SYN packets without completing handshake indicates half-open scans or scanning phase.'
      },
      {
        id: 'f2',
        featureName: 'port_diversity',
        humanName: 'Port Diversity Ratio',
        featureValue: `${(0.48 * (p.currentRiskScore / 70)).toFixed(2)} (Normal: <0.15)`,
        shapValue: +0.24,
        contributionPercent: 24,
        direction: 'increases_risk',
        importanceRank: 2,
        explanation: 'High dispersion across non-standard port numbers signals active enumeration and service discovery.'
      },
      {
        id: 'f3',
        featureName: 'packet_rate',
        humanName: 'Packet Arrival Rate',
        featureValue: `${Math.round(1450 * (p.currentRiskScore / 60))} pkts/sec`,
        shapValue: +0.18,
        contributionPercent: 18,
        direction: 'increases_risk',
        importanceRank: 3,
        explanation: 'Burst volume exceeding standard moving averages by 2.8 standard deviations.'
      },
      {
        id: 'f4',
        featureName: 'destination_spread',
        humanName: 'Subnet Destination Spread',
        featureValue: `${Math.round(18 * (p.currentRiskScore / 60))} internal hosts`,
        shapValue: +0.15,
        contributionPercent: 15,
        direction: 'increases_risk',
        importanceRank: 4,
        explanation: 'Single originating host broadcasting across adjacent Class-C subnet addresses.'
      },
      {
        id: 'f5',
        featureName: 'rst_ratio',
        humanName: 'RST Rejection Frequency',
        featureValue: '0.22 (Threshold: 0.05)',
        shapValue: +0.11,
        contributionPercent: 11,
        direction: 'increases_risk',
        importanceRank: 5,
        explanation: 'Closed port reset rejections indicating probing of filtered firewall boundaries.'
      },
      {
        id: 'f6',
        featureName: 'inter_arrival_variance',
        humanName: 'Inter-Arrival Time Variance',
        featureValue: '4.8 ms (Threshold: 18.2 ms)',
        shapValue: +0.08,
        contributionPercent: 8,
        direction: 'increases_risk',
        importanceRank: 6,
        explanation: 'Low temporal jitter corresponds to automated programmatic scripting rather than human browsing.'
      },
      {
        id: 'f7',
        featureName: 'flow_duration_entropy',
        humanName: 'Flow Duration Regularity',
        featureValue: '0.12 (Normal: >0.65)',
        shapValue: -0.07,
        contributionPercent: 7,
        direction: 'decreases_risk',
        importanceRank: 7,
        explanation: 'Some long-running steady streams on port 443 partially temper pure short-burst classification.'
      }
    ];
  }

  public getTrafficFlows(): TrafficFlow[] {
    const p = this.getActiveScenario();

    return [
      {
        id: 'flow-101',
        timestamp: '19:44:58',
        srcIp: '198.51.100.74',
        dstIp: '192.168.1.45',
        srcPort: 54102,
        dstPort: 443,
        protocol: 'TCP',
        flowDurationMs: 420,
        totalPackets: 48,
        totalBytes: 18450,
        packetRate: 114.2,
        byteRate: 43928,
        synRatio: 0.62,
        ackRatio: 0.38,
        rstRatio: 0.00,
        finRatio: 0.00,
        interArrivalTimeMs: 8.7,
        ttl: 54,
        retransmissionRate: 0.04,
        anomalyScore: 0.89,
        attackCategory: 'Port Scan / Payload Ingress',
        isSuspicious: true
      },
      {
        id: 'flow-102',
        timestamp: '19:44:56',
        srcIp: '198.51.100.74',
        dstIp: '192.168.1.45',
        srcPort: 54104,
        dstPort: 80,
        protocol: 'TCP',
        flowDurationMs: 120,
        totalPackets: 12,
        totalBytes: 4800,
        packetRate: 100.0,
        byteRate: 40000,
        synRatio: 0.83,
        ackRatio: 0.17,
        rstRatio: 0.00,
        finRatio: 0.00,
        interArrivalTimeMs: 10.0,
        ttl: 54,
        retransmissionRate: 0.08,
        anomalyScore: 0.84,
        attackCategory: 'Reconnaissance',
        isSuspicious: true
      },
      {
        id: 'flow-103',
        timestamp: '19:44:52',
        srcIp: '192.168.1.45',
        dstIp: '10.0.2.10',
        srcPort: 49210,
        dstPort: 445,
        protocol: 'SMB',
        flowDurationMs: 2450,
        totalPackets: 180,
        totalBytes: 128400,
        packetRate: 73.4,
        byteRate: 52408,
        synRatio: 0.12,
        ackRatio: 0.88,
        rstRatio: 0.00,
        finRatio: 0.02,
        interArrivalTimeMs: 13.6,
        ttl: 64,
        retransmissionRate: 0.01,
        anomalyScore: p.phaseIndex >= 3 ? 0.88 : 0.22,
        attackCategory: p.phaseIndex >= 3 ? 'Lateral Movement (SMB)' : 'Normal Service',
        isSuspicious: p.phaseIndex >= 3
      },
      {
        id: 'flow-104',
        timestamp: '19:44:48',
        srcIp: '192.168.1.45',
        dstIp: '10.0.4.15',
        srcPort: 38201,
        dstPort: 135,
        protocol: 'TCP',
        flowDurationMs: 180,
        totalPackets: 16,
        totalBytes: 2400,
        packetRate: 88.8,
        byteRate: 13333,
        synRatio: 0.50,
        ackRatio: 0.50,
        rstRatio: 0.25,
        finRatio: 0.00,
        interArrivalTimeMs: 11.2,
        ttl: 64,
        retransmissionRate: 0.06,
        anomalyScore: p.phaseIndex >= 3 ? 0.76 : 0.18,
        attackCategory: 'MSRPC Discovery Sweep',
        isSuspicious: p.phaseIndex >= 3
      },
      {
        id: 'flow-105',
        timestamp: '19:44:45',
        srcIp: '10.0.2.10',
        dstIp: '10.0.3.50',
        srcPort: 42100,
        dstPort: 5432,
        protocol: 'TCP',
        flowDurationMs: 8900,
        totalPackets: 540,
        totalBytes: 890000,
        packetRate: 60.6,
        byteRate: 100000,
        synRatio: 0.01,
        ackRatio: 0.99,
        rstRatio: 0.00,
        finRatio: 0.00,
        interArrivalTimeMs: 16.4,
        ttl: 64,
        retransmissionRate: 0.00,
        anomalyScore: p.phaseIndex >= 5 ? 0.92 : 0.14,
        attackCategory: p.phaseIndex >= 5 ? 'Exfiltration Dump Staging' : 'Database Queries',
        isSuspicious: p.phaseIndex >= 5
      },
      {
        id: 'flow-106',
        timestamp: '19:44:40',
        srcIp: '192.168.1.46',
        dstIp: '10.0.2.10',
        srcPort: 51230,
        dstPort: 8080,
        protocol: 'HTTPS',
        flowDurationMs: 340,
        totalPackets: 32,
        totalBytes: 14200,
        packetRate: 94.1,
        byteRate: 41764,
        synRatio: 0.03,
        ackRatio: 0.97,
        rstRatio: 0.00,
        finRatio: 0.03,
        interArrivalTimeMs: 10.6,
        ttl: 64,
        retransmissionRate: 0.00,
        anomalyScore: 0.08,
        attackCategory: 'Benign API Proxy Flow',
        isSuspicious: false
      },
      {
        id: 'flow-107',
        timestamp: '19:44:35',
        srcIp: '10.0.4.18',
        dstIp: '192.168.1.1',
        srcPort: 59120,
        dstPort: 53,
        protocol: 'DNS',
        flowDurationMs: 25,
        totalPackets: 4,
        totalBytes: 320,
        packetRate: 160.0,
        byteRate: 12800,
        synRatio: 0.00,
        ackRatio: 0.00,
        rstRatio: 0.00,
        finRatio: 0.00,
        interArrivalTimeMs: 6.2,
        ttl: 64,
        retransmissionRate: 0.00,
        anomalyScore: 0.05,
        attackCategory: 'Standard DNS Query',
        isSuspicious: false
      }
    ];
  }

  public getAlerts(): SocAlert[] {
    const p = this.getActiveScenario();

    return [
      {
        id: 'ALT-8901',
        timestamp: '19:44:52',
        severity: p.currentRiskScore >= 70 ? 'critical' : 'high',
        title: `Progression to ${p.predictedStage} Predicted`,
        description: `Temporal world model predicts ${Math.round(p.forecastConfidence)}% likelihood of attack transitioning from ${p.stageName} to ${p.predictedStage} within T+10m horizon.`,
        affectedHostId: 'host-01',
        affectedHostName: 'Host-01 (DMZ Web)',
        affectedHostIp: '192.168.1.45',
        currentStage: p.stageName,
        predictedStage: p.predictedStage,
        progressionProbabilityPercent: 87,
        explanation: 'Correlated SYN bursts, port sweep velocity, and newly established SMB pipes between DMZ and internal core.',
        recommendedInvestigation: 'Review active auth tokens on Host-01, inspect /proc/net/tcp, and verify east-west boundary rules.',
        suggestedAction: 'Isolate Host-01 from internal subnet 10.0.2.0/24 immediately.',
        status: 'open',
        evidenceFeatures: [
          { name: 'SYN Ratio', value: '0.45', threshold: '0.08' },
          { name: 'Port Diversity', value: '0.52', threshold: '0.15' },
          { name: 'E-W Connection Burst', value: '18 flows/min', threshold: '2 flows/min' }
        ],
        mitreTechniqueId: 'T1021.002'
      },
      {
        id: 'ALT-8894',
        timestamp: '19:42:15',
        severity: 'high',
        title: 'Abnormal Subnet Destination Spread Detected',
        description: 'Single DMZ node attempted connections across 18 unique private IP addresses in 60-second window.',
        affectedHostId: 'host-01',
        affectedHostName: 'Host-01 (DMZ Web)',
        affectedHostIp: '192.168.1.45',
        currentStage: 'Discovery',
        predictedStage: 'Lateral Movement',
        progressionProbabilityPercent: 79,
        explanation: 'Pattern matches automated internal network discovery scripts querying ports 445 (SMB) and 135 (RPC).',
        recommendedInvestigation: 'Inspect ephemeral process tree on Host-01 for unauthorized binaries or PowerShell/Python scripts.',
        suggestedAction: 'Apply zero-trust network policy restricting DMZ to internal application ports only.',
        status: 'investigating',
        evidenceFeatures: [
          { name: 'Destination Count', value: '18 IPs', threshold: '3 IPs' },
          { name: 'Inter-arrival Jitter', value: '4.8ms', threshold: '15ms' }
        ],
        mitreTechniqueId: 'T1046'
      },
      {
        id: 'ALT-8872',
        timestamp: '19:38:04',
        severity: 'medium',
        title: 'Elevated TCP SYN Activity Observed',
        description: 'SYN-to-ACK ratio exceeded safety ceiling on external-facing web interface.',
        affectedHostId: 'gateway',
        affectedHostName: 'Edge-Gateway-01',
        affectedHostIp: '192.168.1.1',
        currentStage: 'Reconnaissance',
        predictedStage: 'Initial Access',
        progressionProbabilityPercent: 64,
        explanation: 'External adversary 198.51.100.74 scanning edge perimeter for unpatched CVEs.',
        recommendedInvestigation: 'Correlate with WAF logs and check for payload triggers on /api/v1/ endpoints.',
        suggestedAction: 'Enforce rate-limiting and geo-IP blocklist on source ASN.',
        status: 'acknowledged',
        evidenceFeatures: [
          { name: 'SYN Ratio', value: '0.38', threshold: '0.10' }
        ],
        mitreTechniqueId: 'T1595.001'
      }
    ];
  }

  public getDefensiveRecommendations(): DefensiveRecommendation[] {
    return [
      {
        id: 'REC-01',
        title: 'Isolate Host-01 from Internal Subnet',
        category: 'containment',
        priority: 'immediate',
        affectedHost: 'Host-01 (DMZ Web)',
        hostIp: '192.168.1.45',
        reason: 'Prevents predicted lateral movement toward Server-01 (App Server) and stops SMB enumeration.',
        recommendedCommandOrStep: 'iptables -A FORWARD -s 192.168.1.45 -d 10.0.0.0/16 -j DROP',
        riskReductionEstimatePercent: 42,
        applied: false
      },
      {
        id: 'REC-02',
        title: 'Restrict East-West Lateral Communication',
        category: 'segmentation',
        priority: 'high',
        affectedHost: 'Server-01 (App Server)',
        hostIp: '10.0.2.10',
        reason: 'Deny all non-whitelisted inter-tier RPC/WinRM ports 135, 445, 5985 from DMZ origins.',
        recommendedCommandOrStep: 'Enforce microsegmentation rule #MS-DMZ-INTERNAL-DENY',
        riskReductionEstimatePercent: 28,
        applied: false
      },
      {
        id: 'REC-03',
        title: 'Revoke and Rotate Kerberos & Service Account Credentials',
        category: 'credential',
        priority: 'high',
        affectedHost: 'Server-02 (Auth / DC)',
        hostIp: '10.0.2.20',
        reason: 'Mitigates risk of harvested session tokens being leveraged for domain escalation.',
        recommendedCommandOrStep: 'Revoke Kerberos TGT tickets for service account svc_app_runner',
        riskReductionEstimatePercent: 20,
        applied: false
      },
      {
        id: 'REC-04',
        title: 'Increase Telemetry & Sysmon Logging on Database-01',
        category: 'telemetry',
        priority: 'medium',
        affectedHost: 'Database-01 (Prod DB)',
        hostIp: '10.0.3.50',
        reason: 'High future forecast likelihood of exfiltration staging within next 30 minutes.',
        recommendedCommandOrStep: 'auditctl -w /var/lib/postgresql/data -p rwa -k db_exfil_monitor',
        riskReductionEstimatePercent: 15,
        applied: false
      }
    ];
  }

  public getMitreTacticColumns(): MitreTacticColumn[] {
    const p = this.getActiveScenario();

    const tactics = [
      { id: 'TA0043', name: 'Reconnaissance', shortName: 'Recon', stepNumber: 1, probability: 0.95 },
      { id: 'TA0001', name: 'Initial Access', shortName: 'Initial Access', stepNumber: 2, probability: 0.88 },
      { id: 'TA0002', name: 'Execution', shortName: 'Execution', stepNumber: 3, probability: 0.74 },
      { id: 'TA0003', name: 'Persistence', shortName: 'Persistence', stepNumber: 4, probability: 0.65 },
      { id: 'TA0004', name: 'Privilege Escalation', shortName: 'Priv Esc', stepNumber: 5, probability: 0.58 },
      { id: 'TA0005', name: 'Defense Evasion', shortName: 'Evasion', stepNumber: 6, probability: 0.62 },
      { id: 'TA0006', name: 'Credential Access', shortName: 'Cred Access', stepNumber: 7, probability: 0.69 },
      { id: 'TA0007', name: 'Discovery', shortName: 'Discovery', stepNumber: 8, probability: 0.82 },
      { id: 'TA0008', name: 'Lateral Movement', shortName: 'Lateral Mvt', stepNumber: 9, probability: 0.87 },
      { id: 'TA0011', name: 'Command and Control', shortName: 'C2', stepNumber: 10, probability: 0.71 },
      { id: 'TA0010', name: 'Exfiltration', shortName: 'Exfil', stepNumber: 11, probability: 0.45 },
      { id: 'TA0040', name: 'Impact', shortName: 'Impact', stepNumber: 12, probability: 0.33 }
    ];

    return tactics.map(t => {
      const isCur = t.name === p.stageName;
      const isPred = t.name === p.predictedStage;

      return {
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        stepNumber: t.stepNumber,
        isCurrentStage: isCur,
        isPredictedStage: isPred,
        stageProbability: isCur ? 0.96 : isPred ? 0.87 : t.probability,
        techniques: this.getTechniquesForTactic(t.id, isCur, isPred)
      };
    });
  }

  private getTechniquesForTactic(tacticId: string, isCurrent: boolean, isPredicted: boolean) {
    const map: Record<string, any[]> = {
      'TA0043': [
        { id: 'T1595.001', name: 'Active Scanning: Scanning IP Blocks', tactic: 'Reconnaissance', description: 'Scanning across IP ranges to locate open network services.', observedInCurrentState: true, predictedInFutureState: false, confidenceScore: 0.94, detectionEvidence: ['SYN packets with varied dstPort'], dataSources: ['Network Traffic Flow'], mitigations: ['M1037 Filter Network Traffic'] },
        { id: 'T1595.002', name: 'Active Scanning: Vulnerability Scanning', tactic: 'Reconnaissance', description: 'Probing web servers for known vulnerabilities.', observedInCurrentState: true, predictedInFutureState: false, confidenceScore: 0.89, detectionEvidence: ['HTTP 404/403 anomalies'], dataSources: ['Web Application Logs'], mitigations: ['M1048 Application Isolation'] }
      ],
      'TA0001': [
        { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', description: 'Taking advantage of weakness in Internet-facing software.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.91, detectionEvidence: ['Abnormal flow duration on 443'], dataSources: ['IDS / NetFlow'], mitigations: ['M1051 Update Software'] },
        { id: 'T1133', name: 'External Remote Services', tactic: 'Initial Access', description: 'Leveraging VPN or SSH to gain initial access.', observedInCurrentState: false, predictedInFutureState: false, confidenceScore: 0.65, detectionEvidence: ['SSH handshake count'], dataSources: ['Authentication Logs'], mitigations: ['M1032 Multi-factor Auth'] }
      ],
      'TA0007': [
        { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery', description: 'Enumerating open ports and services on the internal subnet.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.88, detectionEvidence: ['Host-01 to 10.0.0.0/16 port probes'], dataSources: ['NetFlow / IPFIX'], mitigations: ['M1030 Network Segmentation'] },
        { id: 'T1018', name: 'Remote System Discovery', tactic: 'Discovery', description: 'Attempting to find other systems on the network by computer name/IP.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.85, detectionEvidence: ['ARP sweep patterns'], dataSources: ['Internal Network Logs'], mitigations: ['M1037 Filter Traffic'] }
      ],
      'TA0008': [
        { id: 'T1021.002', name: 'Remote Services: SMB/Windows Admin Shares', tactic: 'Lateral Movement', description: 'Leveraging SMB connections to pivot across servers.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.87, detectionEvidence: ['Flow 103 SMB pipe initiation'], dataSources: ['SMB Protocol Logs'], mitigations: ['M1035 Limit Access to Resource Over Network'] },
        { id: 'T1570', name: 'Lateral Tool Transfer', tactic: 'Lateral Movement', description: 'Transferring tools between internal systems to support pivoting.', observedInCurrentState: false, predictedInFutureState: isPredicted, confidenceScore: 0.82, detectionEvidence: ['East-west payload transfer'], dataSources: ['Network Content Inspection'], mitigations: ['M1031 Network Intrusion Prevention'] }
      ],
      'TA0011': [
        { id: 'T1071.001', name: 'Application Layer Protocol: Web Protocols', tactic: 'Command and Control', description: 'Communicating with external servers over HTTP/HTTPS.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.83, detectionEvidence: ['Low-variance periodic beaconing'], dataSources: ['Proxy Logs', 'Flow Analysis'], mitigations: ['M1031 Network Intrusion Prevention'] }
      ]
    };

    return map[tacticId] || [
      { id: `${tacticId}.001`, name: `Standard ${tacticId} Technique`, tactic: tacticId, description: 'Technique under active telemetry evaluation.', observedInCurrentState: isCurrent, predictedInFutureState: isPredicted, confidenceScore: 0.70, detectionEvidence: ['Statistical anomaly detection'], dataSources: ['Network Telemetry'], mitigations: ['Security Policy Enforcement'] }
    ];
  }

  public getModelEvaluations(): ModelEvaluationResult[] {
    return [
      {
        modelName: 'Logistic Regression',
        architecture: 'Point-in-time L2 Linear Classifier',
        temporalAware: false,
        accuracy: 0.812,
        precision: 0.785,
        recall: 0.764,
        f1Score: 0.774,
        rocAuc: 0.834,
        falsePositiveRate: 0.142,
        forecastMae: {
          h5m: 0.185,
          h15m: 0.294,
          h30m: 0.412
        },
        inferenceLatencyMs: 1.2,
        strengths: 'Minimal compute overhead, highly interpretable linear weights.',
        limitations: 'Completely ignores temporal state transitions; fails on multi-step attack forecasting horizons.'
      },
      {
        modelName: 'LSTM',
        architecture: 'Bidirectional 2-Layer Recurrent Cell (Hidden Dim: 128)',
        temporalAware: true,
        accuracy: 0.914,
        precision: 0.898,
        recall: 0.902,
        f1Score: 0.900,
        rocAuc: 0.941,
        falsePositiveRate: 0.048,
        forecastMae: {
          h5m: 0.082,
          h15m: 0.124,
          h30m: 0.188
        },
        inferenceLatencyMs: 8.4,
        strengths: 'Learns sequential flow state dependencies over rolling 5-minute windows.',
        limitations: 'Can suffer from vanishing gradients across long multi-hour dwell periods.'
      },
      {
        modelName: 'Temporal Transformer',
        architecture: 'Multi-Head Self-Attention (4 Heads, Positional Encoding, Latent State Space)',
        temporalAware: true,
        accuracy: 0.952,
        precision: 0.948,
        recall: 0.941,
        f1Score: 0.944,
        rocAuc: 0.978,
        falsePositiveRate: 0.024,
        forecastMae: {
          h5m: 0.041,
          h15m: 0.068,
          h30m: 0.095
        },
        inferenceLatencyMs: 14.8,
        strengths: 'Captures long-range multi-horizon temporal dependencies and sudden velocity shifts across kill-chain stages.',
        limitations: 'Higher memory footprint during autoregressive multi-step rollout.'
      }
    ];
  }
}

export const mockApiService = new MockApiService();
