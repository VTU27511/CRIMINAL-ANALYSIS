export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'open' | 'investigating' | 'acknowledged' | 'resolved';

export interface SocAlert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedHostId: string;
  affectedHostName: string;
  affectedHostIp: string;
  currentStage: string;
  predictedStage: string;
  progressionProbabilityPercent: number;
  explanation: string;
  recommendedInvestigation: string;
  suggestedAction: string;
  status: AlertStatus;
  evidenceFeatures: {
    name: string;
    value: string;
    threshold: string;
  }[];
  mitreTechniqueId?: string;
}

export interface DefensiveRecommendation {
  id: string;
  title: string;
  category: 'containment' | 'segmentation' | 'credential' | 'telemetry' | 'forensics';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  affectedHost: string;
  hostIp: string;
  reason: string;
  recommendedCommandOrStep: string;
  riskReductionEstimatePercent: number;
  applied?: boolean;
}
