export interface ExtractedEntity {
  entity_id: string;
  entity_type:
    | 'PERSON'
    | 'PHONE_NUMBER'
    | 'VEHICLE'
    | 'LOCATION'
    | 'ORGANIZATION'
    | 'DATE'
    | 'CRIME_TYPE'
    | 'FIR_NUMBER'
    | 'CASE_NUMBER'
    | 'BANK_TRANSACTION_ENTITY'
    | 'EVENT';
  value: string;
  source_fir: string;
  confidence_score: number;
  extracted_text_context: string;
  timestamp: string;
}

export interface ExtractedRelationship {
  relationship_id: string;
  source_entity: string;
  target_entity: string;
  relationship_type:
    | 'PERSON_CALLED_PHONE'
    | 'PERSON_OWNS_VEHICLE'
    | 'PERSON_VISITED_LOCATION'
    | 'PERSON_ASSOCIATED_WITH_PERSON'
    | 'PERSON_INVOLVED_IN_FIR'
    | 'PERSON_TRANSACTION_ACCOUNT'
    | 'PERSON_CONNECTED_TO_ORGANIZATION';
  source_fir: string;
  confidence: number;
  date_time: string;
}

export interface PipelineStage {
  stage: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  message: string;
}

export interface FIRAnalysisResult {
  fir_id: string;
  filename: string;
  processed_at: string;
  pipeline_status: string;
  stages: PipelineStage[];
  raw_text_preview: string;
  crime_category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  bns_sections: string[];
  ipc_sections: string[];
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  derived_hotspot: {
    id: string;
    name: string;
    city: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    densityScore: number;
    primaryCrimes: string[];
    riskLevel: string;
    patrolRecommendation: string;
  };
  ai_case_summary: string;
  confidence_overall: number;
}
