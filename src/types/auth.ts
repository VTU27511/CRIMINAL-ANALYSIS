export type UserRole = 'INSPECTOR' | 'SENIOR_OFFICIAL';

export interface UserProfile {
  id: string;
  uid?: string;
  officerId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  phone: string;
  badgeNumber?: string;
  photoUrl: string;
  casesAssigned: number;
  casesSolved: number;
  clearanceRate: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  createdAt: string;
  lastLogin?: string;
}

export type Permission =
  | 'UPLOAD_FIR'
  | 'ANALYZE_FIR'
  | 'VIEW_ASSIGNED_CASES'
  | 'PERFORM_NETWORK_ANALYSIS'
  | 'VIEW_CRIME_ANALYTICS'
  | 'VIEW_HOTSPOT_MAPS'
  | 'USE_INVESTIGATION_ASSISTANT'
  | 'EDIT_OWN_PROFILE'
  | 'VIEW_ORGANIZATION_ANALYTICS'
  | 'VIEW_ALL_CASES'
  | 'VIEW_OFFICER_PERFORMANCE'
  | 'MANAGE_INVESTIGATOR_ACCESS'
  | 'VIEW_ADVANCED_INTELLIGENCE';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  INSPECTOR: [
    'UPLOAD_FIR',
    'ANALYZE_FIR',
    'VIEW_ASSIGNED_CASES',
    'PERFORM_NETWORK_ANALYSIS',
    'VIEW_CRIME_ANALYTICS',
    'VIEW_HOTSPOT_MAPS',
    'USE_INVESTIGATION_ASSISTANT',
    'EDIT_OWN_PROFILE'
  ],
  SENIOR_OFFICIAL: [
    'UPLOAD_FIR',
    'ANALYZE_FIR',
    'VIEW_ASSIGNED_CASES',
    'PERFORM_NETWORK_ANALYSIS',
    'VIEW_CRIME_ANALYTICS',
    'VIEW_HOTSPOT_MAPS',
    'USE_INVESTIGATION_ASSISTANT',
    'EDIT_OWN_PROFILE',
    'VIEW_ORGANIZATION_ANALYTICS',
    'VIEW_ALL_CASES',
    'VIEW_OFFICER_PERFORMANCE',
    'MANAGE_INVESTIGATOR_ACCESS',
    'VIEW_ADVANCED_INTELLIGENCE'
  ]
};

export interface OfficerMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  subject?: string;
  content: string;
  priority: 'ROUTINE' | 'URGENT_DIRECTIVE' | 'CASE_ASSIGNMENT' | 'SITREP';
  timestamp: string;
  read: boolean;
  firRef?: string;
}
