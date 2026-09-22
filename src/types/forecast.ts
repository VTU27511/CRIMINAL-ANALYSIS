export type KillChainStage = 
  | 'Reconnaissance'
  | 'Initial Access'
  | 'Execution'
  | 'Persistence'
  | 'Privilege Escalation'
  | 'Defense Evasion'
  | 'Credential Access'
  | 'Discovery'
  | 'Lateral Movement'
  | 'Command and Control'
  | 'Exfiltration'
  | 'Impact';

export interface ForecastHorizonPoint {
  horizon: string;          // 'Now', '+5 min', '+10 min', etc.
  minutesFromNow: number;   // 0, 5, 10, 15, 20, 25, 30
  timestamp: string;        // '19:45:00'
  riskScore: number;        // 0.0 to 1.0 (or 0-100)
  predictedStage: KillChainStage;
  confidence: number;       // 0.0 to 1.0
  lowerConfidenceBound: number;
  upperConfidenceBound: number;
  isForecast: boolean;      // false for historical/now, true for future
}

export interface MultiStepForecastCardData {
  horizon: string;          // 'T+5 min', 'T+10 min', 'T+15 min', 'T+20 min', 'T+30 min'
  minutes: number;
  riskPercent: number;      // e.g. 38
  stage: KillChainStage;
  confidencePercent: number;// e.g. 76
  stateDelta: {
    flowAnomalyDelta: string;
    portSpreadDelta: string;
    velocityDelta: string;
  };
  summary: string;
}

export interface AttackTrajectoryStage {
  id: string;
  name: KillChainStage;
  order: number;
  isCurrent: boolean;
  isPredictedNext: boolean;
  probabilityPercent: number;
  confidencePercent: number;
  mitreTacticId: string;
  activeTechniques: string[];
  indicatorColor: string;
}

export interface TemporalNetworkState {
  stateId: string; // 'S1', 'S2', 'S3', 'S4', 'S5 (Forecast)'
  timeLabel: string;
  flowCount: number;
  uniqueSources: number;
  uniqueDestinations: number;
  packetRate: number;       // pkts/sec
  byteRate: number;         // bytes/sec
  synRatio: number;         // 0.00 - 1.00
  portDiversity: number;    // unique ports / total flows
  timingAnomalies: number;  // count of inter-arrival anomalies
  riskScore: number;        // 0 - 100
  isPredicted: boolean;
}

export interface FeatureImportanceItem {
  id: string;
  featureName: string;
  humanName: string;
  featureValue: string;
  shapValue: number; // e.g. +0.31
  contributionPercent: number; // e.g. 31%
  direction: 'increases_risk' | 'decreases_risk';
  importanceRank: number;
  explanation: string;
}

export interface ModelEvaluationResult {
  modelName: 'Logistic Regression' | 'LSTM' | 'Temporal Transformer' | 'Temporal GNN';
  architecture: string;
  temporalAware: boolean;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  falsePositiveRate: number;
  forecastMae: {
    h5m: number;
    h15m: number;
    h30m: number;
  };
  inferenceLatencyMs: number;
  strengths: string;
  limitations: string;
}
