import { UserProfile, UserRole } from './auth';
export type { UserProfile, UserRole };

// 1. users & officers
export type Officer = UserProfile;

// 2. firs
export interface FIR {
  id: string;
  firNumber: string;
  policeStation: string;
  dateReported: string;
  dateOfOccurrence: string;
  crimeCategory: string;
  sectionsIPC: string[];
  sectionsBNS: string[];
  complainant: string;
  status: 'REGISTERED' | 'UNDER_INVESTIGATION' | 'CHARGESHEETED' | 'CLOSED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  investigatingOfficerId: string;
  investigatingOfficerName: string;
  assignedTo: string;
  briefSummary: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  uploaderId?: string;
  uploaderEmail?: string;
  uploaderName?: string;
  extractedEntities?: {
    suspects?: string[];
    phones?: string[];
    vehicles?: string[];
    weapons?: string[];
    accounts?: string[];
    organizations?: string[];
  };
}

// 3. persons
export interface Person {
  id: string;
  name: string;
  alias?: string;
  role: 'PRIMARY_SUSPECT' | 'ACCOMPLICE' | 'VICTIM' | 'WITNESS' | 'SYNDICATE_HEAD' | 'PERSON_OF_INTEREST';
  age?: number;
  gender?: string;
  nationality?: string;
  address?: string;
  phone?: string;
  aadhaarRef?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  associatedFIRs: string[];
  criminalRecord?: string;
  photo?: string;
  status: 'ABSCONDING' | 'UNDER_SURVEILLANCE' | 'ARRESTED' | 'COOPERATING' | 'WANTED';
}

// 4. phone_records
export interface PhoneRecord {
  id: string;
  number: string;
  subscriberName: string;
  carrier: string;
  imei: string;
  isActive: boolean;
  riskScore: number;
}

// 5. vehicles
export interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  color: string;
  owner: string;
  flaggedStolen: boolean;
  involvedCrimes: number;
}

// 6. locations
export interface CrimeLocation {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  category: string;
  crimeRate: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// 7. organizations
export interface Organization {
  id: string;
  name: string;
  type: string;
  regNumber: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  headquarters: string;
}

// 8. transactions
export interface Transaction {
  id: string;
  senderAccount: string;
  receiverAccount: string;
  amount: number;
  timestamp: string;
  status: 'COMPLETED' | 'FLAGGED' | 'FROZEN';
  type: string;
}

// 9. cdr_records
export interface CDRRecord {
  id: string;
  callingNumber: string;
  calledNumber: string;
  timestamp: string;
  durationSeconds: number;
  towerLocation: string;
  callType: 'INCOMING' | 'OUTGOING' | 'MISSED' | 'SMS';
}

// 10. events
export interface CrimeEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: string;
}

// 11. relationships
export interface Relationship {
  source: string;
  target: string;
  relation: string;
  weight: number;
  details?: string;
}

// 12. network_analysis
export interface NetworkAnalysis {
  networkId: string;
  title: string;
  analyzedAt: string;
  keyInferences: string[];
  highDegreeNodes: string[];
  kingpinNode: string;
  syndicateSize: number;
  confidenceScore: number;
}

// 13. crime_hotspots
export interface CrimeHotspot {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  densityScore: number;
  primaryCrimes: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  patrolRecommendation: string;
  associatedFIRs?: string[];
  relatedEntityIds?: string[];
  timeTrend?: Array<{ period: string; count: number }>;
  crimeBreakdown?: Array<{ category: string; percentage: number }>;
  recentIncidents?: Array<{ firNumber: string; date: string; statutes: string; desc: string }>;
}

// 14. investigations
export interface Investigation {
  id: string;
  title: string;
  leadOfficer: string;
  priority: 'P0_CRITICAL' | 'P1_URGENT' | 'P2_STANDARD';
  status: 'SURVEILLANCE' | 'ACTIVE_INTERROGATION' | 'FORENSIC_REVIEW' | 'CLOSED';
  caseDiaryEntries: number;
  linkedFIRs: string[];
  targetEntities: string[];
  progressPercentage: number;
}

// 15. audit_logs
export interface AuditLog {
  id: string;
  officerId: string;
  officerName: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
}
