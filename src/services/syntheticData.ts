import {
  UserProfile,
  FIR,
  Person,
  PhoneRecord,
  Vehicle,
  CrimeLocation,
  Organization,
  Transaction,
  CDRRecord,
  CrimeEvent,
  Relationship,
  NetworkAnalysis,
  CrimeHotspot,
  Investigation,
  AuditLog
} from '../types/crime';
import { OfficerMessage } from '../types/auth';

export const INITIAL_OFFICERS: UserProfile[] = [
  {
    id: 'off_001',
    officerId: 'DL-ACP-4102',
    name: 'Vikram Rathore',
    email: 'senior.official@police.gov.in',
    role: 'SENIOR_OFFICIAL',
    department: 'Special Crime Branch',
    designation: 'Assistant Commissioner of Police (ACP)',
    phone: '+91 98110 44210',
    badgeNumber: 'IND-SPB-4102',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    casesAssigned: 24,
    casesSolved: 21,
    clearanceRate: 87.5,
    status: 'ACTIVE',
    createdAt: '2024-01-15T09:30:00Z',
    lastLogin: '2026-03-10T14:20:00Z'
  },
  {
    id: 'off_002',
    officerId: 'DL-INS-8823',
    name: 'Ananya Sharma',
    email: 'inspector@police.gov.in',
    role: 'INSPECTOR',
    department: 'Cyber Crime Division',
    designation: 'Police Inspector',
    phone: '+91 98230 77192',
    badgeNumber: 'IND-CCD-8823',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    casesAssigned: 14,
    casesSolved: 11,
    clearanceRate: 78.5,
    status: 'ACTIVE',
    createdAt: '2024-03-10T11:15:00Z',
    lastLogin: '2026-03-10T15:10:00Z'
  },
  {
    id: 'off_003',
    officerId: 'MH-INS-5512',
    name: 'Rajesh Deshmukh',
    email: 'rajesh.deshmukh@police.gov.in',
    role: 'INSPECTOR',
    department: 'Anti-Extortion Cell (CID)',
    designation: 'Senior Police Inspector',
    phone: '+91 97654 32180',
    badgeNumber: 'IND-AEC-5512',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    casesAssigned: 18,
    casesSolved: 15,
    clearanceRate: 83.3,
    status: 'ACTIVE',
    createdAt: '2024-02-01T10:00:00Z',
    lastLogin: '2026-03-09T18:40:00Z'
  }
];

export const INITIAL_FIRS: FIR[] = [
  {
    id: 'fir_2026_001',
    firNumber: 'FIR-2026-DL-00189',
    policeStation: 'Connaught Place Police Station, New Delhi',
    dateReported: '2026-03-01T14:20:00Z',
    dateOfOccurrence: '2026-02-28T22:45:00Z',
    crimeCategory: 'Cyber Financial Fraud & Extortion',
    sectionsIPC: ['420 (Cheating)', '384 (Extortion)', '120B (Criminal Conspiracy)'],
    sectionsBNS: ['318 (Cheating)', '308 (Extortion)', '61 (Criminal Conspiracy)'],
    complainant: 'Rajiv Mehra (Director, Apex FinTech)',
    status: 'UNDER_INVESTIGATION',
    severity: 'CRITICAL',
    investigatingOfficerId: 'off_002',
    investigatingOfficerName: 'Insp. Ananya Sharma',
    assignedTo: 'off_002',
    briefSummary: 'Syndicate impersonating enforcement directorate officials extorted ₹1.45 Crores via mule accounts and encrypted VOIP calls.',
    location: 'Connaught Place, Central Delhi',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    extractedEntities: {
      suspects: ['Karan Malhotra @ Tiger', 'Sameer Qureshi'],
      phones: ['+91 98711 02934', '+91 99102 38472'],
      vehicles: ['DL-3C-AZ-9901'],
      accounts: ['HDFC-MULE-4819', 'ICICI-MULE-9021']
    }
  },
  {
    id: 'fir_2026_002',
    firNumber: 'FIR-2026-DL-00190',
    policeStation: 'Hauz Khas Police Station, South Delhi',
    dateReported: '2026-03-03T09:10:00Z',
    dateOfOccurrence: '2026-03-02T23:15:00Z',
    crimeCategory: 'Armed Robbery & Hijacking',
    sectionsIPC: ['392 (Robbery)', '397 (Robbery with deadly weapon)', '34 (Common Intention)'],
    sectionsBNS: ['309 (Robbery)', '311 (Robbery with deadly weapon)', '3(5) (Joint Liability)'],
    complainant: 'Sunil Verma (Logistics Supervisor)',
    status: 'UNDER_INVESTIGATION',
    severity: 'HIGH',
    investigatingOfficerId: 'off_001',
    investigatingOfficerName: 'ACP Vikram Rathore',
    assignedTo: 'off_001',
    briefSummary: 'Armed interception of cash transit van near Ring Road flyover by 3 assailants in an unregistered white SUV.',
    location: 'AIIMS Flyover, Ring Road, South Delhi',
    coordinates: { lat: 28.5672, lng: 77.2100 },
    extractedEntities: {
      suspects: ['Vikky Pehelwan', 'Unknown Accomplice 1'],
      phones: ['+91 97182 99012'],
      vehicles: ['HR-26-CR-4412'],
      weapons: ['Desi Katta (Country Pistol)', 'Iron Rod']
    }
  },
  {
    id: 'fir_2026_003',
    firNumber: 'FIR-2026-MH-00412',
    policeStation: 'Bandra Kurla Complex (BKC) PS, Mumbai',
    dateReported: '2026-02-25T16:00:00Z',
    dateOfOccurrence: '2026-02-24T20:30:00Z',
    crimeCategory: 'Organized Syndicate Drug Trafficking',
    sectionsIPC: ['120B (Criminal Conspiracy)', 'NDPS Act Sec 8/21/29'],
    sectionsBNS: ['61 (Criminal Conspiracy)', 'Special NDPS Provisions'],
    complainant: 'Sub-Inspector K. Patil (Narcotics Cell)',
    status: 'CHARGESHEETED',
    severity: 'CRITICAL',
    investigatingOfficerId: 'off_003',
    investigatingOfficerName: 'Sr. Insp. Rajesh Deshmukh',
    assignedTo: 'off_003',
    briefSummary: 'Interception of synthetic opioid consignment worth ₹3.2 Cr distributed via darknet dead drops in industrial warehouse.',
    location: 'Kurla West Industrial Estate, Mumbai',
    coordinates: { lat: 19.0657, lng: 72.8790 },
    extractedEntities: {
      suspects: ["Iqbal 'Bhai' Ansari", 'Karan Malhotra @ Tiger'],
      phones: ['+91 98200 44321'],
      vehicles: ['MH-02-EE-8899'],
      organizations: ['Shadow Logistics LLP']
    }
  },
  {
    id: 'fir_2026_004',
    firNumber: 'FIR-2026-KA-00105',
    policeStation: 'Indiranagar Police Station, Bengaluru',
    dateReported: '2026-03-06T11:45:00Z',
    dateOfOccurrence: '2026-03-05T01:30:00Z',
    crimeCategory: 'Burglary & Electronic Heist',
    sectionsIPC: ['457 (Lurking house-trespass)', '380 (Theft in dwelling)'],
    sectionsBNS: ['331 (House-trespass)', '305 (Theft)'],
    complainant: 'Priya Nambiar',
    status: 'REGISTERED',
    severity: 'MEDIUM',
    investigatingOfficerId: 'off_002',
    investigatingOfficerName: 'Insp. Ananya Sharma',
    assignedTo: 'off_002',
    briefSummary: 'High-end jewelry store electronic lock bypassed with RF jammer; ₹45 Lakhs in diamond ornaments stolen.',
    location: '100ft Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    extractedEntities: {
      suspects: ['The Phantom Crew'],
      phones: ['+91 94480 12389'],
      vehicles: ['KA-03-MN-7102']
    }
  }
];

export const INITIAL_PERSONS: Person[] = [
  {
    id: 'per_001',
    name: 'Karan Malhotra',
    alias: 'Tiger / KM',
    role: 'PRIMARY_SUSPECT',
    age: 34,
    gender: 'Male',
    nationality: 'Indian',
    address: 'Flat 402, Royal Residency, Rohini Sector 14, Delhi',
    phone: '+91 98711 02934',
    aadhaarRef: 'XXXX-XXXX-8921',
    riskLevel: 'CRITICAL',
    associatedFIRs: ['fir_2026_001', 'fir_2026_003'],
    criminalRecord: 'Previous arrests in 2021 (Cyber fraud), 2023 (Extortion)',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    status: 'ABSCONDING'
  },
  {
    id: 'per_002',
    name: 'Sameer Qureshi',
    alias: 'Sammy Banker',
    role: 'ACCOMPLICE',
    age: 29,
    gender: 'Male',
    nationality: 'Indian',
    address: 'Gali 4, Jafrabad, North East Delhi',
    phone: '+91 99102 38472',
    aadhaarRef: 'XXXX-XXXX-4412',
    riskLevel: 'HIGH',
    associatedFIRs: ['fir_2026_001'],
    criminalRecord: 'Hawala routing operator, mule bank account distributor',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    status: 'UNDER_SURVEILLANCE'
  },
  {
    id: 'per_003',
    name: 'Iqbal Ansari',
    alias: 'Bhaijaan / Shadow Boss',
    role: 'SYNDICATE_HEAD',
    age: 48,
    gender: 'Male',
    nationality: 'Indian',
    phone: '+91 98200 44321',
    riskLevel: 'CRITICAL',
    associatedFIRs: ['fir_2026_003'],
    criminalRecord: 'Interstate syndicate coordinator, maritime contraband',
    status: 'WANTED'
  },
  {
    id: 'per_004',
    name: 'Vikky Pehelwan',
    alias: 'The Enforcer',
    role: 'PRIMARY_SUSPECT',
    age: 31,
    gender: 'Male',
    nationality: 'Indian',
    phone: '+91 97182 99012',
    riskLevel: 'HIGH',
    associatedFIRs: ['fir_2026_002'],
    criminalRecord: 'Armed highway dacoity, illegal arms possession',
    status: 'UNDER_SURVEILLANCE'
  }
];

export const INITIAL_PHONE_RECORDS: PhoneRecord[] = [
  { id: 'ph_001', number: '+91 98711 02934', subscriberName: 'Karan Malhotra', carrier: 'Airtel Delhi', imei: '864192040182910', isActive: true, riskScore: 92 },
  { id: 'ph_002', number: '+91 99102 38472', subscriberName: 'Sameer Qureshi', carrier: 'Jio Delhi', imei: '864192040991823', isActive: true, riskScore: 84 },
  { id: 'ph_003', number: '+91 98200 44321', subscriberName: 'Shadow Corp SIM', carrier: 'Vodafone Mumbai', imei: '359812048172630', isActive: false, riskScore: 95 },
  { id: 'ph_004', number: '+91 97182 99012', subscriberName: 'Burner 104', carrier: 'Airtel Haryana', imei: '861928374651920', isActive: true, riskScore: 76 }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh_001', regNumber: 'DL-3C-AZ-9901', make: 'Mahindra Scorpio', color: 'Stealth Black', owner: 'Karan Malhotra', flaggedStolen: false, involvedCrimes: 2 },
  { id: 'veh_002', regNumber: 'HR-26-CR-4412', make: 'Toyota Fortuner', color: 'White', owner: 'Gurgaon Fake Leasing', flaggedStolen: true, involvedCrimes: 3 },
  { id: 'veh_003', regNumber: 'MH-02-EE-8899', make: 'Tata Nexon EV', color: 'Dark Blue', owner: 'Shadow Logistics LLP', flaggedStolen: false, involvedCrimes: 1 }
];

export const INITIAL_HOTSPOTS: CrimeHotspot[] = [
  {
    id: 'hs_001',
    name: 'Connaught Place - Financial & Hawala District',
    city: 'New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    radiusMeters: 750,
    densityScore: 94,
    primaryCrimes: ['Organized Hawala Banking', 'VoIP Extortion Drops', 'High-Value Cash Snatching'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Deploy tactical plainclothes surveillance squads + financial intelligence beat officers.'
  },
  {
    id: 'hs_002',
    name: 'AIIMS Flyover & Safdarjung Ring Road Corridor',
    city: 'New Delhi',
    lat: 28.5672,
    lng: 77.2100,
    radiusMeters: 1200,
    densityScore: 95,
    primaryCrimes: ['Armed Highway Robbery', 'Cash Transit Interception', 'Vehicle Carjacking'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Deploy 2 high-speed PCR interceptors + automated ANPR check-posts from 21:00 to 05:00.'
  },
  {
    id: 'hs_003',
    name: 'Cyber City & DLF Cyber Hub Belt',
    city: 'Gurugram',
    lat: 28.4950,
    lng: 77.0895,
    radiusMeters: 900,
    densityScore: 92,
    primaryCrimes: ['VoIP Call Spoofing', 'International Extortion', 'Mule Bank Accounts'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Activate Cyber Crime Cell packet sniffers & raid unauthorized BPO server basements.'
  },
  {
    id: 'hs_004',
    name: 'Mundra Port Logistics SEZ & Maritime Cargo',
    city: 'Kutch / Gujarat',
    lat: 22.8395,
    lng: 69.7042,
    radiusMeters: 2000,
    densityScore: 96,
    primaryCrimes: ['Maritime Narcotics Import', 'Unmanifested Cargo Smuggling', 'Contraband Transit'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Joint Coast Guard & NCB physical container x-ray inspection at berths 4 and 7.'
  },
  {
    id: 'hs_005',
    name: 'Chandni Chowk & Old Delhi Bullion Market',
    city: 'Old Delhi',
    lat: 28.6506,
    lng: 77.2303,
    radiusMeters: 800,
    densityScore: 91,
    primaryCrimes: ['PMLA Hawala Mule Banking', 'Bullion Gold Laundering', 'Trade-Based Money Laundering'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Audit cash courier movements near Katra Neel & deploy undercover ED-liaison units.'
  },
  {
    id: 'hs_006',
    name: 'Baddi Industrial Estate Synthetic Pharma Belt',
    city: 'Solan / HP',
    lat: 30.9578,
    lng: 76.7914,
    radiusMeters: 1500,
    densityScore: 96,
    primaryCrimes: ['Synthetic Narcotics Formulation', 'Precursor Chemical Diversion', 'Counterfeit Pharma'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Immediate state drug-controller lockdown + forensic chemical audit on factory units.'
  },
  {
    id: 'hs_007',
    name: 'Meerut Cantonment & Transport Nagar',
    city: 'Meerut / UP',
    lat: 28.9845,
    lng: 77.7064,
    radiusMeters: 1100,
    densityScore: 95,
    primaryCrimes: ['Illegal Firearms Distribution', 'Contract Killings', 'Gangland Extortion'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Special Task Force (STF) cordoning and armed vehicular checkpoints on Delhi-Meerut expressway.'
  },
  {
    id: 'hs_008',
    name: 'HITEC City & Madhapur Cyber Node',
    city: 'Hyderabad',
    lat: 17.4483,
    lng: 78.3915,
    radiusMeters: 800,
    densityScore: 90,
    primaryCrimes: ['Darknet Escrow Servers', 'Cryptocurrency Laundering', 'Encrypted C2 Infra'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Telangana Cyber Security Bureau IP trace & seized server forensic imaging.'
  },
  {
    id: 'hs_009',
    name: 'Kurla East-West Freight Corridor & Dharavi',
    city: 'Mumbai',
    lat: 19.0657,
    lng: 72.8790,
    radiusMeters: 950,
    densityScore: 86,
    primaryCrimes: ['NDPS Mephedrone Transit', 'Interstate Smuggling', 'Slum Gang Extortion'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Mumbai Police Crime Branch perimeter sweeps and freight godown inspections.'
  },
  {
    id: 'hs_010',
    name: 'Indiranagar 100ft Commercial Belt',
    city: 'Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    radiusMeters: 550,
    densityScore: 74,
    primaryCrimes: ['Commercial Burglary', 'Late Night Assaults', 'Drunk & Disorderly'],
    riskLevel: 'MEDIUM',
    patrolRecommendation: 'Enhanced foot beat patrols post-midnight near commercial establishments.'
  },
  {
    id: 'hs_011',
    name: 'Kashmere Gate ISBT Interstate Terminal',
    city: 'North Delhi',
    lat: 28.6675,
    lng: 77.2285,
    radiusMeters: 850,
    densityScore: 89,
    primaryCrimes: ['Interstate Drug Couriers', 'Forged ID Transit', 'Pickpocketing Rings'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Metal detector baggage scanners and dog squad sweeps on inter-state bus platforms.'
  },
  {
    id: 'hs_012',
    name: 'Sector 18 Atta Commercial Corridor',
    city: 'Noida',
    lat: 28.5708,
    lng: 77.3261,
    radiusMeters: 650,
    densityScore: 79,
    primaryCrimes: ['Motor Vehicle Theft', 'ATM Card Skimming', 'Retail Shoplifting'],
    riskLevel: 'MEDIUM',
    patrolRecommendation: 'ANPR camera coverage on all mall entry-exit ramps + bicycle patrol officers.'
  },
  {
    id: 'hs_013',
    name: 'Chennai - Central & Sowcarpet Bullion Corridor',
    city: 'Chennai',
    lat: 13.0878,
    lng: 80.2785,
    radiusMeters: 800,
    densityScore: 88,
    primaryCrimes: ['Bullion Hawala Transfers', 'Gold Smuggling', 'Counterfeit Currency Delivery'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Greater Chennai Police deployment around Mint Street, Wall Tax Road, and Central Station.'
  },
  {
    id: 'hs_014',
    name: 'Chennai - OMR Cyber & IT Express Corridor',
    city: 'Chennai',
    lat: 12.9010,
    lng: 80.2279,
    radiusMeters: 1200,
    densityScore: 89,
    primaryCrimes: ['VoIP Cyber Extortion', 'Fake Investment App Scams', 'Illegal Mule Bank Rackets'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'Cyber Crime Wing real-time IP tracking and raid squad deployment near Sholinganallur & Navalur.'
  },
  {
    id: 'hs_015',
    name: 'Chennai - Chennai Port & Royapuram Harbor',
    city: 'Chennai',
    lat: 13.0970,
    lng: 80.2970,
    radiusMeters: 1800,
    densityScore: 92,
    primaryCrimes: ['Maritime Narcotics Trafficking', 'Container Cargo Contraband', 'Coastal Smuggling'],
    riskLevel: 'CRITICAL',
    patrolRecommendation: 'Joint Coastal Security Group and NCB container dockyard scanning at outer harbor berths.'
  },
  {
    id: 'hs_016',
    name: 'Chennai - Koyambedu Market & Madhavaram Bus Terminal',
    city: 'Chennai',
    lat: 13.0694,
    lng: 80.1948,
    radiusMeters: 900,
    densityScore: 85,
    primaryCrimes: ['Interstate Ganja Supply', 'Heavy Vehicle Hijacking', 'Daylight Armed Robbery'],
    riskLevel: 'HIGH',
    patrolRecommendation: 'ANPR flying interceptors at 100-ft road and night canine patrol units on bus arrival bays.'
  }
];

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  { source: 'per_001', target: 'per_002', relation: 'CO_CONSPIRATOR', weight: 0.95, details: '64 CDR calls in 14 days' },
  { source: 'per_001', target: 'ph_001', relation: 'USES_PHONE', weight: 1.0, details: 'Subscribed SIM' },
  { source: 'per_002', target: 'ph_002', relation: 'USES_PHONE', weight: 0.9, details: 'Handset IMEI match' },
  { source: 'per_001', target: 'veh_001', relation: 'OWNS_VEHICLE', weight: 1.0, details: 'RTO Registered' },
  { source: 'per_002', target: 'per_003', relation: 'SUBORDINATE_TO', weight: 0.88, details: 'Weekly cash delivery' },
  { source: 'veh_001', target: 'hs_001', relation: 'ANPR_SIGHTING', weight: 0.85, details: 'CCTV camera #14 at 22:42' },
  { source: 'veh_002', target: 'hs_002', relation: 'SCENE_OF_CRIME', weight: 0.92, details: 'Eyewitness match' }
];

export const INITIAL_INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv_001',
    title: 'Operation Black Shield - Hawala & Extortion',
    leadOfficer: 'Insp. Ananya Sharma',
    priority: 'P1_URGENT',
    status: 'ACTIVE_INTERROGATION',
    caseDiaryEntries: 14,
    linkedFIRs: ['fir_2026_001'],
    targetEntities: ['per_001', 'per_002'],
    progressPercentage: 68
  },
  {
    id: 'inv_002',
    title: 'Operation Nightfall - Highway Interceptor Heists',
    leadOfficer: 'ACP Vikram Rathore',
    priority: 'P0_CRITICAL',
    status: 'SURVEILLANCE',
    caseDiaryEntries: 22,
    linkedFIRs: ['fir_2026_002'],
    targetEntities: ['veh_002', 'per_004'],
    progressPercentage: 82
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    officerId: 'DL-ACP-4102',
    officerName: 'ACP Vikram Rathore',
    action: 'EXPORT_INTELLIGENCE_REPORT',
    target: 'FIR-2026-DL-00189',
    timestamp: '2026-03-08T16:20:00Z',
    ip: '10.14.88.21',
    result: 'SUCCESS'
  },
  {
    id: 'log_002',
    officerId: 'DL-INS-8823',
    officerName: 'Insp. Ananya Sharma',
    action: 'RUN_NETWORK_ANALYSIS',
    target: 'net_syndicate_tiger_2026',
    timestamp: '2026-03-08T18:02:15Z',
    ip: '10.14.88.35',
    result: 'SUCCESS'
  },
  {
    id: 'log_003',
    officerId: 'DL-INS-8823',
    officerName: 'Insp. Ananya Sharma',
    action: 'ANALYZE_FIR_DOCUMENT',
    target: 'FIR-2026-DL-00189',
    timestamp: '2026-03-08T19:10:00Z',
    ip: '10.14.88.35',
    result: 'SUCCESS'
  }
];

export const INITIAL_OFFICER_MESSAGES: OfficerMessage[] = [
  {
    id: 'msg_001',
    senderId: 'off_001',
    senderName: 'Ranjith Chennuru (ACP)',
    senderRole: 'SENIOR_OFFICIAL',
    receiverId: 'off_002',
    receiverName: 'RANJITH',
    receiverRole: 'INSPECTOR',
    subject: 'Priority Directive: CDR Tower Dump Analysis',
    content: 'Verify CDR tower dump cell 4A near Connaught Place for FIR-2026-DL-00189. Primary suspect Karan Malhotra reported active in the vicinity.',
    priority: 'URGENT_DIRECTIVE',
    timestamp: '2026-03-10T10:15:00Z',
    read: true,
    firRef: 'FIR-2026-DL-00189'
  },
  {
    id: 'msg_002',
    senderId: 'off_002',
    senderName: 'RANJITH',
    senderRole: 'INSPECTOR',
    receiverId: 'off_001',
    receiverName: 'Ranjith Chennuru (ACP)',
    receiverRole: 'SENIOR_OFFICIAL',
    subject: 'SITREP: ANPR Triangulation Complete',
    content: 'Understood Sir. Triangulation complete. Scorpio DL-3C-AZ-9901 spotted on Outer Ring Road. Requesting clearance for tactical intercept.',
    priority: 'SITREP',
    timestamp: '2026-03-10T10:32:00Z',
    read: true,
    firRef: 'FIR-2026-DL-00189'
  },
  {
    id: 'msg_003',
    senderId: 'off_001',
    senderName: 'Ranjith Chennuru (ACP)',
    senderRole: 'SENIOR_OFFICIAL',
    receiverId: 'off_003',
    receiverName: 'Rajesh Deshmukh',
    receiverRole: 'INSPECTOR',
    subject: 'Hawala Mule Surveillance Order',
    content: 'Deploy CID anti-extortion unit to monitor Hawala transaction from HDFC-MULE-4819 to ICICI-MULE-9021 immediately.',
    priority: 'CASE_ASSIGNMENT',
    timestamp: '2026-03-10T11:05:00Z',
    read: false,
    firRef: 'FIR-2026-MH-00342'
  }
];

