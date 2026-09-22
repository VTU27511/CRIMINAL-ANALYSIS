export interface MitreTechnique {
  id: string; // e.g. 'T1046'
  name: string; // e.g. 'Network Service Discovery'
  tactic: string; // e.g. 'Discovery'
  description: string;
  observedInCurrentState: boolean;
  predictedInFutureState: boolean;
  confidenceScore: number;
  detectionEvidence: string[];
  dataSources: string[];
  mitigations: string[];
}

export interface MitreTacticColumn {
  id: string;
  name: string;
  shortName: string;
  stepNumber: number;
  isCurrentStage: boolean;
  isPredictedStage: boolean;
  stageProbability: number;
  techniques: MitreTechnique[];
}
