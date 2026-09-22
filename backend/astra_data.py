"""
TEAM ASTRA - AI Crime Analytics & Visualization Platform
Synthetic Law Enforcement Data for SIH 2026 Problem Statement 26189.
Contains strictly demo/synthetic data for all 17 Firestore collections.
"""

from datetime import datetime, timedelta
import random

# 1. Users / Officers
DEMO_OFFICERS = [
    {
        "id": "off_001",
        "officerId": "DL-ACP-4102",
        "name": "Vikram Rathore",
        "email": "senior.official@police.gov.in",
        "role": "SENIOR_OFFICIAL",
        "department": "Special Crime Branch",
        "designation": "Assistant Commissioner of Police (ACP)",
        "phone": "+91 98110 44210",
        "badgeNumber": "IND-SPB-4102",
        "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        "casesAssigned": 24,
        "casesSolved": 21,
        "clearanceRate": 87.5,
        "status": "ACTIVE",
        "createdAt": "2024-01-15T09:30:00Z"
    },
    {
        "id": "off_002",
        "officerId": "DL-INS-8823",
        "name": "Ananya Sharma",
        "email": "inspector@police.gov.in",
        "role": "INSPECTOR",
        "department": "Cyber Crime Division",
        "designation": "Police Inspector",
        "phone": "+91 98230 77192",
        "badgeNumber": "IND-CCD-8823",
        "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "casesAssigned": 14,
        "casesSolved": 11,
        "clearanceRate": 78.5,
        "status": "ACTIVE",
        "createdAt": "2024-03-10T11:15:00Z"
    },
    {
        "id": "off_003",
        "officerId": "MH-INS-5512",
        "name": "Rajesh Deshmukh",
        "email": "rajesh.deshmukh@police.gov.in",
        "role": "INSPECTOR",
        "department": "Anti-Extortion Cell (CID)",
        "designation": "Senior Police Inspector",
        "phone": "+91 97654 32180",
        "badgeNumber": "IND-AEC-5512",
        "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        "casesAssigned": 18,
        "casesSolved": 15,
        "clearanceRate": 83.3,
        "status": "ACTIVE",
        "createdAt": "2024-02-01T10:00:00Z"
    }
]

# 2. FIRs (First Information Reports)
DEMO_FIRS = [
    {
        "id": "fir_2026_001",
        "firNumber": "FIR-2026-DL-00189",
        "policeStation": "Connaught Place Police Station, New Delhi",
        "dateReported": "2026-03-01T14:20:00Z",
        "dateOfOccurrence": "2026-02-28T22:45:00Z",
        "crimeCategory": "Cyber Financial Fraud & Extortion",
        "sectionsIPC": ["420 (Cheating)", "384 (Extortion)", "120B (Criminal Conspiracy)"],
        "sectionsBNS": ["318 (Cheating)", "308 (Extortion)", "61 (Criminal Conspiracy)"],
        "complainant": "Rajiv Mehra (Director, Apex FinTech)",
        "status": "UNDER_INVESTIGATION",
        "severity": "CRITICAL",
        "investigatingOfficerId": "off_002",
        "investigatingOfficerName": "Insp. Ananya Sharma",
        "assignedTo": "off_002",
        "briefSummary": "Syndicate impersonating enforcement directorate officials extorted ₹1.45 Crores via mule accounts and encrypted VOIP calls.",
        "location": "Connaught Place, Central Delhi",
        "coordinates": {"lat": 28.6315, "lng": 77.2167},
        "extractedEntities": {
            "suspects": ["Karan Malhotra @ Tiger", "Sameer Qureshi"],
            "phones": ["+91 98711 02934", "+91 99102 38472"],
            "vehicles": ["DL-3C-AZ-9901"],
            "accounts": ["HDFC-MULE-4819", "ICICI-MULE-9021"]
        }
    },
    {
        "id": "fir_2026_002",
        "firNumber": "FIR-2026-DL-00190",
        "policeStation": "Hauz Khas Police Station, South Delhi",
        "dateReported": "2026-03-03T09:10:00Z",
        "dateOfOccurrence": "2026-03-02T23:15:00Z",
        "crimeCategory": "Armed Robbery & Hijacking",
        "sectionsIPC": ["392 (Robbery)", "397 (Robbery with attempt to cause death)", "34 (Common Intention)"],
        "sectionsBNS": ["309 (Robbery)", "311 (Robbery with firearm)", "3(5) (Joint Liability)"],
        "complainant": "Sunil Verma (Logistics Supervisor)",
        "status": "UNDER_INVESTIGATION",
        "severity": "HIGH",
        "investigatingOfficerId": "off_001",
        "investigatingOfficerName": "ACP Vikram Rathore",
        "assignedTo": "off_001",
        "briefSummary": "Armed interception of cash transit van near Ring Road flyover by 3 assailants in an unregistered white SUV.",
        "location": "AIIMS Flyover, Ring Road, South Delhi",
        "coordinates": {"lat": 28.5672, "lng": 77.2100},
        "extractedEntities": {
            "suspects": ["Vikky Pehelwan", "Unknown Accomplice 1"],
            "phones": ["+91 97182 99012"],
            "vehicles": ["HR-26-CR-4412"],
            "weapons": ["Desi Katta (Country Pistol)", "Iron Rod"]
        }
    },
    {
        "id": "fir_2026_003",
        "firNumber": "FIR-2026-MH-00412",
        "policeStation": "Bandra Kurla Complex (BKC) PS, Mumbai",
        "dateReported": "2026-02-25T16:00:00Z",
        "dateOfOccurrence": "2026-02-24T20:30:00Z",
        "crimeCategory": "Organized Syndicate Drug Trafficking",
        "sectionsIPC": ["120B (Criminal Conspiracy)", "NDPS Act Sec 8/21/29"],
        "sectionsBNS": ["61 (Criminal Conspiracy)", "Special NDPS Provisions"],
        "complainant": "Sub-Inspector K. Patil (Narcotics Cell)",
        "status": "CHARGESHEETED",
        "severity": "CRITICAL",
        "investigatingOfficerId": "off_003",
        "investigatingOfficerName": "Sr. Insp. Rajesh Deshmukh",
        "assignedTo": "off_003",
        "briefSummary": "Interception of synthetic opioid consignment worth ₹3.2 Cr distributed via darknet dead drops in industrial warehouse.",
        "location": "Kurla West Industrial Estate, Mumbai",
        "coordinates": {"lat": 19.0657, "lng": 72.8790},
        "extractedEntities": {
            "suspects": ["Iqbal 'Bhai' Ansari", "Karan Malhotra @ Tiger"],
            "phones": ["+91 98200 44321"],
            "vehicles": ["MH-02-EE-8899"],
            "organizations": ["Shadow Logistics LLP"]
        }
    },
    {
        "id": "fir_2026_004",
        "firNumber": "FIR-2026-KA-00105",
        "policeStation": "Indiranagar Police Station, Bengaluru",
        "dateReported": "2026-03-06T11:45:00Z",
        "dateOfOccurrence": "2026-03-05T01:30:00Z",
        "crimeCategory": "Burglary & Electronic Heist",
        "sectionsIPC": ["457 (Lurking house-trespass)", "380 (Theft in dwelling)"],
        "sectionsBNS": ["331 (House-trespass for offence)", "305 (Theft)"],
        "complainant": "Priya Nambiar",
        "status": "REGISTERED",
        "severity": "MEDIUM",
        "investigatingOfficerId": "off_002",
        "investigatingOfficerName": "Insp. Ananya Sharma",
        "assignedTo": "off_002",
        "briefSummary": "High-end jewelry store electronic lock bypassed with RF jammer; ₹45 Lakhs in diamond ornaments stolen.",
        "location": "100ft Road, Indiranagar, Bengaluru",
        "coordinates": {"lat": 12.9784, "lng": 77.6408},
        "extractedEntities": {
            "suspects": ["The Phantom Crew"],
            "phones": ["+91 94480 12389"],
            "vehicles": ["KA-03-MN-7102"]
        }
    }
]

# 3. Persons (Suspects, Victims, Witnesses, Contacts)
DEMO_PERSONS = [
    {
        "id": "per_001",
        "name": "Karan Malhotra",
        "alias": "Tiger / KM",
        "role": "PRIMARY_SUSPECT",
        "age": 34,
        "gender": "Male",
        "nationality": "Indian",
        "address": "Flat 402, Royal Residency, Rohini Sector 14, Delhi",
        "phone": "+91 98711 02934",
        "aadhaarRef": "XXXX-XXXX-8921",
        "riskLevel": "CRITICAL",
        "associatedFIRs": ["fir_2026_001", "fir_2026_003"],
        "criminalRecord": "Previous arrests in 2021 (Cyber fraud), 2023 (Extortion)",
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        "status": "ABSCONDING"
    },
    {
        "id": "per_002",
        "name": "Sameer Qureshi",
        "alias": "Sammy Banker",
        "role": "ACCOMPLICE",
        "age": 29,
        "gender": "Male",
        "nationality": "Indian",
        "address": "Gali 4, Jafrabad, North East Delhi",
        "phone": "+91 99102 38472",
        "aadhaarRef": "XXXX-XXXX-4412",
        "riskLevel": "HIGH",
        "associatedFIRs": ["fir_2026_001"],
        "criminalRecord": "Hawala routing operator, mule bank account distributor",
        "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
        "status": "UNDER_SURVEILLANCE"
    },
    {
        "id": "per_003",
        "name": "Vikram Rathore (Complainant / Witness)",
        "alias": "None",
        "role": "WITNESS",
        "age": 42,
        "gender": "Male",
        "nationality": "Indian",
        "phone": "+91 98112 00192",
        "status": "COOPERATING"
    },
    {
        "id": "per_004",
        "name": "Iqbal Ansari",
        "alias": "Bhaijaan / Shadow Boss",
        "role": "SYNDICATE_HEAD",
        "age": 48,
        "gender": "Male",
        "nationality": "Indian",
        "phone": "+91 98200 44321",
        "riskLevel": "CRITICAL",
        "associatedFIRs": ["fir_2026_003"],
        "status": "WANTED"
    }
]

# 4. Phone Records
DEMO_PHONE_RECORDS = [
    {"id": "ph_001", "number": "+91 98711 02934", "subscriberName": "Karan Malhotra", "carrier": "Airtel Delhi", "imei": "864192040182910", "isActive": True, "riskScore": 92},
    {"id": "ph_002", "number": "+91 99102 38472", "subscriberName": "Sameer Qureshi (Fake ID)", "carrier": "Jio Delhi", "imei": "864192040991823", "isActive": True, "riskScore": 84},
    {"id": "ph_003", "number": "+91 98200 44321", "subscriberName": "Shadow Corp SIM", "carrier": "Vodafone Mumbai", "imei": "359812048172630", "isActive": False, "riskScore": 95},
    {"id": "ph_004", "number": "+91 97182 99012", "subscriberName": "Burner 104", "carrier": "Airtel Haryana", "imei": "861928374651920", "isActive": True, "riskScore": 76}
]

# 5. Vehicles
DEMO_VEHICLES = [
    {"id": "veh_001", "regNumber": "DL-3C-AZ-9901", "make": "Mahindra Scorpio", "color": "Stealth Black", "owner": "Karan Malhotra", "flaggedStolen": False, "involvedCrimes": 2},
    {"id": "veh_002", "regNumber": "HR-26-CR-4412", "make": "Toyota Fortuner", "color": "White", "owner": "Gurgaon Fake Leasing", "flaggedStolen": True, "involvedCrimes": 3},
    {"id": "veh_003", "regNumber": "MH-02-EE-8899", "make": "Tata Nexon EV", "color": "Dark Blue", "owner": "Shadow Logistics LLP", "flaggedStolen": False, "involvedCrimes": 1}
]

# 6. Locations
DEMO_LOCATIONS = [
    {"id": "loc_001", "name": "Connaught Place Inner Circle", "city": "New Delhi", "lat": 28.6315, "lng": 77.2167, "category": "Commercial Hub", "crimeRate": "HIGH"},
    {"id": "loc_002", "name": "AIIMS Flyover Junction", "city": "New Delhi", "lat": 28.5672, "lng": 77.2100, "category": "Transit Corridor", "crimeRate": "CRITICAL"},
    {"id": "loc_003", "name": "Kurla Industrial Zone", "city": "Mumbai", "lat": 19.0657, "lng": 72.8790, "category": "Warehouse Zone", "crimeRate": "HIGH"},
    {"id": "loc_004", "name": "Rohini Sector 14", "city": "New Delhi", "lat": 28.7180, "lng": 77.1290, "category": "Residential Hideout", "crimeRate": "MEDIUM"}
]

# 7. Organizations
DEMO_ORGANIZATIONS = [
    {"id": "org_001", "name": "Shadow Logistics LLP", "type": "Shell Company / Freight", "regNumber": "U74999MH2022PTC8912", "risk": "CRITICAL", "headquarters": "Kurla, Mumbai"},
    {"id": "org_002", "name": "Apex FinTech Pvt Ltd", "type": "Legitimate Entity (Victim)", "regNumber": "U72200DL2019PTC3409", "risk": "LOW", "headquarters": "Connaught Place, Delhi"},
    {"id": "org_003", "name": "Digital Pay Nexus", "type": "Unregulated Payment Gateway", "regNumber": "OFFSHORE-BVI-9921", "risk": "CRITICAL", "headquarters": "Offshore / Web"}
]

# 8. Transactions
DEMO_TRANSACTIONS = [
    {"id": "tx_001", "senderAccount": "Apex FinTech - Escrow", "receiverAccount": "HDFC-MULE-4819", "amount": 6500000, "timestamp": "2026-02-28T22:50:00Z", "status": "FLAGGED", "type": "RTGS"},
    {"id": "tx_002", "senderAccount": "HDFC-MULE-4819", "receiverAccount": "ICICI-MULE-9021", "amount": 4000000, "timestamp": "2026-02-28T23:10:00Z", "status": "FROZEN", "type": "IMPS"},
    {"id": "tx_003", "senderAccount": "HDFC-MULE-4819", "receiverAccount": "Crypto Desk Cash-Out", "amount": 2500000, "timestamp": "2026-02-28T23:25:00Z", "status": "COMPLETED", "type": "P2P_USDT"}
]

# 9. CDR Records (Call Detail Records)
DEMO_CDR_RECORDS = [
    {"id": "cdr_001", "callingNumber": "+91 98711 02934", "calledNumber": "+91 99102 38472", "timestamp": "2026-02-28T22:30:15Z", "durationSeconds": 312, "towerLocation": "Connaught Place Tower 4A", "callType": "OUTGOING"},
    {"id": "cdr_002", "callingNumber": "+91 99102 38472", "calledNumber": "+91 98200 44321", "timestamp": "2026-02-28T23:05:40Z", "durationSeconds": 145, "towerLocation": "Jafrabad Central Cell", "callType": "OUTGOING"},
    {"id": "cdr_003", "callingNumber": "+91 98711 02934", "calledNumber": "+91 97182 99012", "timestamp": "2026-03-02T22:40:10Z", "durationSeconds": 98, "towerLocation": "Ring Road South Flyover", "callType": "OUTGOING"}
]

# 10. Events / Incidents
DEMO_EVENTS = [
    {"id": "evt_001", "title": "Large Cash Transit Van Interception", "date": "2026-03-02T23:15:00Z", "location": "AIIMS Flyover", "severity": "HIGH", "status": "RESOLVING"},
    {"id": "evt_002", "title": "Corporate Ransom Call Transmitted", "date": "2026-02-28T22:45:00Z", "location": "Connaught Place", "severity": "CRITICAL", "status": "INVESTIGATING"}
]

# 11. Relationships (Entity Graph Links - 9 Standard Types)
DEMO_RELATIONSHIPS = [
    # called / communicated_with
    {"source": "per_001", "target": "ph_001", "relation": "owns", "weight": 1.0, "details": "Subscribed SIM line +91 98711 02934", "date": "2026-02-10"},
    {"source": "per_002", "target": "ph_002", "relation": "owns", "weight": 0.95, "details": "Handset IMEI match +91 99102 38472", "date": "2026-02-15"},
    {"source": "ph_001", "target": "ph_002", "relation": "called", "weight": 0.98, "details": "64 CDR calls in 14 days (1,840 mins)", "date": "2026-02-28"},
    {"source": "ph_002", "target": "ph_004", "relation": "communicated_with", "weight": 0.89, "details": "Encrypted VoIP ping to +91 98200 44321", "date": "2026-02-28"},
    
    # associated_with / met
    {"source": "per_001", "target": "per_002", "relation": "associated_with", "weight": 0.95, "details": "Co-conspirator in cyber extortion syndicate", "date": "2026-02-20"},
    {"source": "per_002", "target": "per_004", "relation": "associated_with", "weight": 0.88, "details": "Subordinate courier to Iqbal Ansari", "date": "2026-02-22"},
    {"source": "per_001", "target": "per_004", "relation": "met", "weight": 0.75, "details": "Physical rendezvous observed at Kurla freight terminal", "date": "2026-02-24"},
    
    # owns / visited
    {"source": "per_001", "target": "veh_001", "relation": "owns", "weight": 1.0, "details": "Registered owner of DL-3C-AZ-9901", "date": "2025-11-12"},
    {"source": "veh_002", "target": "loc_002", "relation": "visited", "weight": 0.92, "details": "ANPR sighting on AIIMS flyover toll corridor", "date": "2026-03-02"},
    {"source": "per_001", "target": "loc_001", "relation": "visited", "weight": 0.85, "details": "CCTV camera #14 in Connaught Place", "date": "2026-02-28"},
    {"source": "per_004", "target": "loc_003", "relation": "visited", "weight": 0.96, "details": "Warehouse operational base in Kurla", "date": "2026-02-25"},
    {"source": "veh_003", "target": "loc_003", "relation": "visited", "weight": 0.88, "details": "Delivery vehicle sighting outside warehouse", "date": "2026-02-24"},

    # connected_to / transaction
    {"source": "per_004", "target": "org_001", "relation": "connected_to", "weight": 0.99, "details": "Beneficial director MCA records for Shadow Logistics", "date": "2022-04-18"},
    {"source": "per_002", "target": "tx_001", "relation": "transaction", "weight": 0.94, "details": "Beneficiary of ₹65L RTGS into mule account", "date": "2026-02-28"},
    {"source": "tx_001", "target": "tx_002", "relation": "transaction", "weight": 0.92, "details": "Layered transfer of ₹40L into ICICI mule account", "date": "2026-02-28"},
    {"source": "tx_001", "target": "org_001", "relation": "connected_to", "weight": 0.87, "details": "Corporate freight invoice reference", "date": "2026-02-28"},
    
    # involved_in
    {"source": "per_001", "target": "fir_2026_001", "relation": "involved_in", "weight": 0.98, "details": "Primary accused in cyber fraud FIR", "date": "2026-03-01"},
    {"source": "per_002", "target": "fir_2026_001", "relation": "involved_in", "weight": 0.92, "details": "Accomplice named in FIR-2026-DL-00189", "date": "2026-03-01"},
    {"source": "per_004", "target": "fir_2026_003", "relation": "involved_in", "weight": 0.95, "details": "Kingpin named in NDPS chargesheet", "date": "2026-02-25"},
    {"source": "fir_2026_001", "target": "evt_002", "relation": "involved_in", "weight": 0.90, "details": "FIR filed on corporate ransom call", "date": "2026-02-28"},
    {"source": "fir_2026_002", "target": "evt_001", "relation": "involved_in", "weight": 0.96, "details": "Cash van armed robbery incident", "date": "2026-03-02"},

    # Complainant / Witness Connections (per_003 - Vikram Rathore)
    {"source": "per_003", "target": "fir_2026_001", "relation": "involved_in", "weight": 0.98, "details": "Complainant who registered FIR-2026-DL-00189 on corporate ransom extortion", "date": "2026-03-01"},
    {"source": "per_003", "target": "org_002", "relation": "connected_to", "weight": 0.94, "details": "Managing Director at victim company Apex FinTech Pvt Ltd", "date": "2026-02-28"},
    {"source": "per_003", "target": "loc_001", "relation": "visited", "weight": 0.88, "details": "Executive corporate suite in Connaught Place", "date": "2026-02-28"},
    {"source": "ph_001", "target": "per_003", "relation": "called", "weight": 0.96, "details": "Extortion call transmitted from Karan Malhotra to Vikram Rathore demanding ₹2.5 Cr", "date": "2026-02-28"},

    # Syndicate Telecom & Iqbal Ansari Handset (ph_003, ph_004)
    {"source": "per_004", "target": "ph_003", "relation": "owns", "weight": 1.0, "details": "Encrypted VoIP handset registered to shadow persona", "date": "2026-02-12"},
    {"source": "ph_002", "target": "ph_003", "relation": "communicated_with", "weight": 0.92, "details": "Encrypted communication ping between Sameer Qureshi and Iqbal Ansari", "date": "2026-02-28"},
    {"source": "per_001", "target": "ph_004", "relation": "communicated_with", "weight": 0.87, "details": "Burner coordination call during highway heist", "date": "2026-03-02"},
    {"source": "veh_002", "target": "ph_004", "relation": "connected_to", "weight": 0.91, "details": "Tower triangulation match with Fortuner GPS tracker", "date": "2026-03-02"},

    # Corporate Fronts & Financial Gateways (org_002, org_003, tx_003)
    {"source": "tx_001", "target": "org_002", "relation": "connected_to", "weight": 0.95, "details": "Compromised Apex FinTech escrow bank account debited", "date": "2026-02-28"},
    {"source": "tx_002", "target": "org_003", "relation": "connected_to", "weight": 0.94, "details": "Offshore unmanifested gateway Digital Pay Nexus", "date": "2026-02-28"},
    {"source": "tx_003", "target": "org_003", "relation": "transaction", "weight": 0.98, "details": "P2P USDT cash-out conversion via offshore gateway", "date": "2026-02-28"},
    {"source": "per_004", "target": "org_003", "relation": "connected_to", "weight": 0.89, "details": "Beneficial controller of Digital Pay Nexus through offshore nominee trust", "date": "2025-08-14"},

    # Safehouses & Additional FIRs (loc_004, fir_2026_004)
    {"source": "per_001", "target": "loc_004", "relation": "visited", "weight": 0.90, "details": "Rohini Sector 14 residential transit safehouse", "date": "2026-03-01"},
    {"source": "veh_001", "target": "loc_004", "relation": "visited", "weight": 0.86, "details": "Mahindra Scorpio parked outside Rohini hideout", "date": "2026-03-01"},
    {"source": "per_001", "target": "fir_2026_004", "relation": "involved_in", "weight": 0.82, "details": "RF jammer procurement trail linked to Bengaluru heist", "date": "2026-03-06"},
    {"source": "fir_2026_004", "target": "loc_001", "relation": "involved_in", "weight": 0.78, "details": "Inter-state fencing nexus in Connaught Place", "date": "2026-03-05"}
]

# 12. Network Analysis
DEMO_NETWORK_ANALYSIS = {
    "networkId": "net_syndicate_tiger_2026",
    "title": "Tiger-Ansari Interstate Crime Syndicate",
    "analyzedAt": "2026-03-08T18:00:00Z",
    "keyInferences": [
        "Karan Malhotra acts as operational hub linking extortion calls to physical logistics in Mumbai.",
        "Iqbal Ansari has high betweenness centrality connecting corporate front entities to street operators.",
        "Mule phone number +91 99102 38472 bridges 3 distinct FIRs across Delhi and Mumbai."
    ],
    "highDegreeNodes": ["per_001", "ph_001", "per_002", "loc_001"],
    "bridgeNodes": ["per_002", "org_001", "tx_001"],
    "kingpinNode": "per_004",
    "syndicateSize": 18,
    "confidenceScore": 94.2
}

# 13. Crime Hotspots (Rich Geospatial Intelligence)
DEMO_CRIME_HOTSPOTS = [
    {
        "id": "hs_001",
        "name": "Connaught Place - Financial District",
        "city": "New Delhi",
        "lat": 28.6315,
        "lng": 77.2167,
        "radiusMeters": 650,
        "densityScore": 88,
        "primaryCrimes": ["Cyber Fraud", "Corporate Extortion", "ATM Skimming"],
        "riskLevel": "HIGH",
        "associatedFIRs": ["fir_2026_001", "fir_2026_DL_00189"],
        "relatedEntityIds": ["per_001", "per_002", "ph_001", "org_002"],
        "patrolRecommendation": "Deploy cyber forensics surveillance unit and inspect ATM vestibules 18:00 - 23:00.",
        "timeTrend": [
            {"period": "Oct", "count": 14},
            {"period": "Nov", "count": 19},
            {"period": "Dec", "count": 25},
            {"period": "Jan", "count": 21},
            {"period": "Feb", "count": 31},
            {"period": "Mar", "count": 38}
        ],
        "crimeBreakdown": [
            {"category": "Cyber Fraud & Extortion", "percentage": 52},
            {"category": "Financial ATM Skimming", "percentage": 28},
            {"category": "Identity Impersonation", "percentage": 20}
        ],
        "recentIncidents": [
            {"firNumber": "FIR-2026-DL-00189", "date": "2026-03-01", "statutes": "BNS 318, 308 / IPC 420, 384", "desc": "Corporate server ransomware extortion targeting ₹2.5 Cr"},
            {"firNumber": "FIR-2026-DL-00142", "date": "2026-02-14", "statutes": "BNS 318 / IPC 420", "desc": "Phishing syndicate cloning senior banker credentials"}
        ]
    },
    {
        "id": "hs_002",
        "name": "Ring Road - AIIMS & Safdarjung Corridor",
        "city": "New Delhi",
        "lat": 28.5672,
        "lng": 77.2100,
        "radiusMeters": 1100,
        "densityScore": 96,
        "primaryCrimes": ["Armed Robbery", "Vehicle Interception", "Highway Heist"],
        "riskLevel": "CRITICAL",
        "associatedFIRs": ["fir_2026_002", "fir_2026_0e2576"],
        "relatedEntityIds": ["per_001", "veh_002", "ph_001"],
        "patrolRecommendation": "Deploy 2 PCR vans + automated ANPR camera barrier from 22:00 to 04:00.",
        "timeTrend": [
            {"period": "Oct", "count": 8},
            {"period": "Nov", "count": 12},
            {"period": "Dec", "count": 20},
            {"period": "Jan", "count": 26},
            {"period": "Feb", "count": 34},
            {"period": "Mar", "count": 42}
        ],
        "crimeBreakdown": [
            {"category": "Armed Cash Van Robbery", "percentage": 58},
            {"category": "Commercial Vehicle Hijacking", "percentage": 26},
            {"category": "Firearm Threat & Intimidation", "percentage": 16}
        ],
        "recentIncidents": [
            {"firNumber": "FIR-2026-DL-00190", "date": "2026-03-02", "statutes": "BNS 309, 311 / IPC 392, 397", "desc": "Armed interception of cash transit van by assailants in white SUV"},
            {"firNumber": "FIR-2026-DL-00115", "date": "2026-01-28", "statutes": "BNS 309 / IPC 392", "desc": "Night gunpoint carjacking of commercial logistics vehicle"}
        ]
    },
    {
        "id": "hs_003",
        "name": "Kurla East-West Freight Corridor",
        "city": "Mumbai",
        "lat": 19.0657,
        "lng": 72.8790,
        "radiusMeters": 900,
        "densityScore": 84,
        "primaryCrimes": ["NDPS Narcotics", "Illicit Storage", "Extortion Front"],
        "riskLevel": "HIGH",
        "associatedFIRs": ["fir_2026_003"],
        "relatedEntityIds": ["per_004", "org_001", "veh_003", "ph_004"],
        "patrolRecommendation": "Inter-agency Narcotics Control Bureau (NCB) raids on freight warehouses.",
        "timeTrend": [
            {"period": "Oct", "count": 10},
            {"period": "Nov", "count": 15},
            {"period": "Dec", "count": 18},
            {"period": "Jan", "count": 24},
            {"period": "Feb", "count": 29},
            {"period": "Mar", "count": 33}
        ],
        "crimeBreakdown": [
            {"category": "Synthetic Opioid Trafficking", "percentage": 64},
            {"category": "Front Company Money Laundering", "percentage": 22},
            {"category": "Contraband Stockpiling", "percentage": 14}
        ],
        "recentIncidents": [
            {"firNumber": "FIR-2026-MH-00412", "date": "2026-02-24", "statutes": "BNS 61 / NDPS Sec 8/21/29", "desc": "Seizure of ₹3.2 Cr synthetic contraband concealed in freight consignment"}
        ]
    },
    {
        "id": "hs_004",
        "name": "Indiranagar 100ft Commercial Belt",
        "city": "Bengaluru",
        "lat": 12.9784,
        "lng": 77.6408,
        "radiusMeters": 550,
        "densityScore": 72,
        "primaryCrimes": ["Burglary", "Electronic Heist", "Night Robbery"],
        "riskLevel": "MEDIUM",
        "associatedFIRs": ["fir_2026_004"],
        "relatedEntityIds": ["per_001", "loc_004"],
        "patrolRecommendation": "Foot beat patrols and commercial jeweler CCTV integration post-midnight.",
        "timeTrend": [
            {"period": "Oct", "count": 6},
            {"period": "Nov", "count": 8},
            {"period": "Dec", "count": 11},
            {"period": "Jan", "count": 9},
            {"period": "Feb", "count": 14},
            {"period": "Mar", "count": 18}
        ],
        "crimeBreakdown": [
            {"category": "Commercial Safe Burglary", "percentage": 50},
            {"category": "RF Jammer Electronic Bypass", "percentage": 32},
            {"category": "Late-Night Shopbreaking", "percentage": 18}
        ],
        "recentIncidents": [
            {"firNumber": "FIR-2026-KA-00105", "date": "2026-03-05", "statutes": "BNS 331, 305 / IPC 457, 380", "desc": "Jewelry store heist with RF jammer disabling alarm telemetry"}
        ]
    },
    {
        "id": "hs_005",
        "name": "Rohini Sector 14 Transit Safehouse",
        "city": "New Delhi",
        "lat": 28.7180,
        "lng": 77.1290,
        "radiusMeters": 450,
        "densityScore": 68,
        "primaryCrimes": ["Suspect Harboring", "Stolen Goods Stockpile"],
        "riskLevel": "MEDIUM",
        "associatedFIRs": ["fir_2026_001"],
        "relatedEntityIds": ["per_001", "veh_001"],
        "patrolRecommendation": "Discrete surveillance on apartment complex entrance and parking lots.",
        "timeTrend": [
            {"period": "Oct", "count": 4},
            {"period": "Nov", "count": 5},
            {"period": "Dec", "count": 7},
            {"period": "Jan", "count": 8},
            {"period": "Feb", "count": 10},
            {"period": "Mar", "count": 12}
        ],
        "crimeBreakdown": [
            {"category": "Fugitive Hideout Sighting", "percentage": 60},
            {"category": "Vehicle Staging", "percentage": 40}
        ],
        "recentIncidents": [
            {"firNumber": "FIR-2026-DL-00189", "date": "2026-03-01", "statutes": "BNS 318 / IPC 420", "desc": "Suspect Karan Malhotra last geo-located proximate to residential flat"}
        ]
    }
]

# 14. Investigations
DEMO_INVESTIGATIONS = [
    {
        "id": "inv_001",
        "title": "Operation Black Shield - Hawala & Extortion",
        "leadOfficer": "Insp. Ananya Sharma",
        "priority": "P1_URGENT",
        "status": "ACTIVE_INTERROGATION",
        "caseDiaryEntries": 14,
        "linkedFIRs": ["fir_2026_001"],
        "targetEntities": ["per_001", "per_002", "org_001"],
        "progressPercentage": 68
    },
    {
        "id": "inv_002",
        "title": "Operation Nightfall - Highway Interceptor Heists",
        "leadOfficer": "ACP Vikram Rathore",
        "priority": "P0_CRITICAL",
        "status": "SURVEILLANCE",
        "caseDiaryEntries": 22,
        "linkedFIRs": ["fir_2026_002"],
        "targetEntities": ["veh_002", "per_001"],
        "progressPercentage": 82
    }
]

# 15. Audit Logs
DEMO_AUDIT_LOGS = [
    {"id": "log_001", "officerId": "DL-ACP-4102", "officerName": "ACP Vikram Rathore", "action": "EXPORT_INTELLIGENCE_REPORT", "target": "FIR-2026-DL-00189", "timestamp": "2026-03-08T16:20:00Z", "ip": "10.14.88.21", "result": "SUCCESS"},
    {"id": "log_002", "officerId": "DL-INS-8823", "officerName": "Insp. Ananya Sharma", "action": "RUN_NETWORK_ANALYSIS", "target": "net_syndicate_tiger_2026", "timestamp": "2026-03-08T18:02:15Z", "ip": "10.14.88.35", "result": "SUCCESS"},
    {"id": "log_003", "officerId": "DL-INS-8823", "officerName": "Insp. Ananya Sharma", "action": "ANALYZE_FIR_DOCUMENT", "target": "FIR-2026-DL-00189", "timestamp": "2026-03-08T19:10:00Z", "ip": "10.14.88.35", "result": "SUCCESS"}
]

# 16. Analytical Anomaly Indicators (7 Standard Classes for SIH 2026)
DEMO_ANOMALIES = [
    {
        "id": "anom_001",
        "indicatorClass": "UNUSUAL_COMMUNICATION_FREQUENCY",
        "title": "Unusual Communication Frequency",
        "score": 94,
        "reason": "Sudden burst of 48 encrypted & VoIP calls within 6 hours preceding cash transit van robbery between burner SIMs +91 98711 02934 and +91 99102 38472.",
        "category": "TELECOM_ANOMALY",
        "severity": "CRITICAL",
        "timestamp": "2026-03-02T22:30:00Z",
        "confidence": 96.2,
        "supportingRecords": [
            {"id": "ph_001", "type": "Phone", "name": "+91 98711 02934"},
            {"id": "ph_002", "type": "Phone", "name": "+91 99102 38472"},
            {"id": "per_001", "type": "Person", "name": "Karan Malhotra"},
            {"id": "fir_2026_002", "type": "FIR", "name": "FIR-2026-DL-00190"}
        ]
    },
    {
        "id": "anom_002",
        "indicatorClass": "UNUSUAL_TRANSACTION_ACTIVITY",
        "title": "Unusual Transaction Activity",
        "score": 92,
        "reason": "Rapid structuring/layering: ₹1.45 Cr extortion payout split into 3 tranches under 35 minutes via HDFC-MULE-4819 to ICICI-MULE-9021 and P2P Crypto desk.",
        "category": "FINANCIAL_ANOMALY",
        "severity": "CRITICAL",
        "timestamp": "2026-02-28T23:25:00Z",
        "confidence": 98.4,
        "supportingRecords": [
            {"id": "tx_001", "type": "Transaction", "name": "RTGS ₹65,00,000"},
            {"id": "tx_002", "type": "Transaction", "name": "IMPS ₹40,00,000"},
            {"id": "tx_003", "type": "Transaction", "name": "P2P USDT ₹25,00,000"},
            {"id": "per_002", "type": "Person", "name": "Sameer Qureshi"},
            {"id": "org_003", "type": "Organization", "name": "Digital Pay Nexus"}
        ]
    },
    {
        "id": "anom_003",
        "indicatorClass": "REPEATED_LOCATIONS",
        "title": "Repeated Locations Co-Presence",
        "score": 87,
        "reason": "Geospatial co-location anomaly: 3 distinct suspects (Karan Malhotra, Sameer Qureshi, Iqbal Ansari) identified within 150m radius of Kurla Industrial Zone warehouse within 48 hours.",
        "category": "GEOSPATIAL_ANOMALY",
        "severity": "HIGH",
        "timestamp": "2026-02-25T14:15:00Z",
        "confidence": 91.5,
        "supportingRecords": [
            {"id": "loc_003", "type": "Location", "name": "Kurla Industrial Zone"},
            {"id": "per_001", "type": "Person", "name": "Karan Malhotra"},
            {"id": "per_002", "type": "Person", "name": "Sameer Qureshi"},
            {"id": "per_004", "type": "Person", "name": "Iqbal Ansari"},
            {"id": "veh_003", "type": "Vehicle", "name": "MH-02-EE-8899"}
        ]
    },
    {
        "id": "anom_004",
        "indicatorClass": "SUDDEN_INCREASE_IN_ACTIVITY",
        "title": "Sudden Increase in Activity",
        "score": 85,
        "reason": "Dormant burner SIM (+91 97182 99012) inactive for 42 days suddenly exhibited 34 outgoing calls and 8km movement along Ring Road AIIMS Corridor on day of robbery.",
        "category": "BEHAVIORAL_SPIKE",
        "severity": "HIGH",
        "timestamp": "2026-03-02T23:00:00Z",
        "confidence": 89.8,
        "supportingRecords": [
            {"id": "ph_004", "type": "Phone", "name": "+91 97182 99012"},
            {"id": "veh_002", "type": "Vehicle", "name": "HR-26-CR-4412"},
            {"id": "loc_002", "type": "Location", "name": "AIIMS Flyover Junction"},
            {"id": "fir_2026_002", "type": "FIR", "name": "FIR-2026-DL-00190"}
        ]
    },
    {
        "id": "anom_005",
        "indicatorClass": "REPEATED_INTERACTIONS",
        "title": "Repeated Cross-Syndicate Interactions",
        "score": 89,
        "reason": "Persistent cross-jurisdiction interactions: 64 calls logged between Central Delhi extortion cell and Mumbai narcotics clearinghouse despite claimed lack of prior acquaintance.",
        "category": "RELATIONSHIP_ANOMALY",
        "severity": "HIGH",
        "timestamp": "2026-03-04T11:00:00Z",
        "confidence": 94.7,
        "supportingRecords": [
            {"id": "per_001", "type": "Person", "name": "Karan Malhotra"},
            {"id": "per_004", "type": "Person", "name": "Iqbal Ansari"},
            {"id": "ph_001", "type": "Phone", "name": "+91 98711 02934"},
            {"id": "ph_003", "type": "Phone", "name": "+91 98200 44321"}
        ]
    },
    {
        "id": "anom_006",
        "indicatorClass": "EMERGING_CLUSTERS",
        "title": "Emerging Network Clusters",
        "score": 91,
        "reason": "Graph modularity shift: New high-density triad cluster formed between Apex FinTech escrow breach, Shadow Logistics freight routes, and offshore gateway Digital Pay Nexus.",
        "category": "TOPOLOGICAL_CLUSTER",
        "severity": "CRITICAL",
        "timestamp": "2026-03-05T08:30:00Z",
        "confidence": 93.1,
        "supportingRecords": [
            {"id": "org_001", "type": "Organization", "name": "Shadow Logistics LLP"},
            {"id": "org_002", "type": "Organization", "name": "Apex FinTech Pvt Ltd"},
            {"id": "org_003", "type": "Organization", "name": "Digital Pay Nexus"},
            {"id": "tx_001", "type": "Transaction", "name": "Escrow Debiting"}
        ]
    },
    {
        "id": "anom_007",
        "indicatorClass": "UNUSUAL_CONNECTIONS",
        "title": "Unusual Topological Connections",
        "score": 83,
        "reason": "Counter-intuitive topological bridge: Direct corporate ownership link between legitimate freight firm (Shadow Logistics LLP) and darknet narcotics distribution channel.",
        "category": "STRUCTURAL_BRIDGE",
        "severity": "HIGH",
        "timestamp": "2026-03-06T17:45:00Z",
        "confidence": 90.3,
        "supportingRecords": [
            {"id": "org_001", "type": "Organization", "name": "Shadow Logistics LLP"},
            {"id": "per_004", "type": "Person", "name": "Iqbal Ansari"},
            {"id": "fir_2026_003", "type": "FIR", "name": "FIR-2026-MH-00412"}
        ]
    }
]

# 17. Explainable Predictive Risk Models (4 Models with Factor Breakdowns)
DEMO_RISK_MODELS = [
    {
        "id": "rm_001",
        "modelType": "CRIME_HOTSPOT_RISK",
        "title": "Crime Hotspot Risk",
        "riskScore": 88.4,
        "signalLevel": "Elevated Analytical Signal",
        "targetSector": "Ring Road - AIIMS & Safdarjung Transit Corridor",
        "peakWindow": "23:00 - 03:30 hrs",
        "crimeType": "Night Highway Robbery / Cash Van Interception",
        "contributingFactors": [
            {"factor": "Interstate Escape Route Access (NH-48 / Haryana Border)", "weight": 34, "impact": "CRITICAL"},
            {"factor": "Dim Lighting & Underpass Surveillance Blindspots", "weight": 28, "impact": "HIGH"},
            {"factor": "Late-Night Cash Transit Logistics Volume Surge", "weight": 24, "impact": "HIGH"},
            {"factor": "Historical Seasonal Incident Velocity Trend", "weight": 14, "impact": "MODERATE"}
        ],
        "recommendedForce": "2 PCR Interceptor Cruisers + 1 Automated ANPR Checkpoint",
        "analyticalNote": "High density of transit vehicles with reduced visibility creates opportunistic attack corridor."
    },
    {
        "id": "rm_002",
        "modelType": "EMERGING_NETWORK_RISK",
        "title": "Emerging Network Risk",
        "riskScore": 92.1,
        "signalLevel": "Critical Analytical Signal",
        "targetSector": "Delhi NCR ↔ Mumbai BKC Interstate Triad",
        "peakWindow": "Active 24/7 Syndicate Expansion",
        "crimeType": "Organized Cross-Jurisdiction Cyber-Narcotics Nexus",
        "contributingFactors": [
            {"factor": "Shared Multi-Tier Mule Bank Accounts (HDFC & ICICI)", "weight": 38, "impact": "CRITICAL"},
            {"factor": "Synchronized VoIP Ping Exchanges Across State Lines", "weight": 31, "impact": "HIGH"},
            {"factor": "Cross-State Transit of Staged Commercial Vehicles", "weight": 19, "impact": "MODERATE"},
            {"factor": "Common Nominee Directorships in Front Entities", "weight": 12, "impact": "MODERATE"}
        ],
        "recommendedForce": "Joint CID & Cyber Special Cell Interrogation Task Force",
        "analyticalNote": "Syndicate consolidating financial laundering infrastructure with physical narcotics logistics."
    },
    {
        "id": "rm_003",
        "modelType": "UNUSUAL_ACTIVITY_RISK",
        "title": "Unusual Activity Risk",
        "riskScore": 86.5,
        "signalLevel": "Elevated Analytical Signal",
        "targetSector": "Digital Financial Gateways & Shadow Accounts",
        "peakWindow": "Post-Incident Smurfing (0 - 48 hours)",
        "crimeType": "High-Velocity Money Dispersion & Crypto Off-Ramping",
        "contributingFactors": [
            {"factor": "Multiple Sub-Threshold Transaction Bursts (< ₹50L each)", "weight": 42, "impact": "CRITICAL"},
            {"factor": "Rapid IMEI / Handset Swaps on Suspect Cellular Nodes", "weight": 26, "impact": "HIGH"},
            {"factor": "Geofence Boundary Crossings Outside Operational Baseline", "weight": 20, "impact": "MODERATE"},
            {"factor": "Unregistered Vehicle ANPR Sightings Near Transit Hubs", "weight": 12, "impact": "MODERATE"}
        ],
        "recommendedForce": "Issue Immediate Section 94 BNSS Account Freeze Directives",
        "analyticalNote": "Smurfing pattern suggests imminent offshore extraction of extortion proceeds."
    },
    {
        "id": "rm_004",
        "modelType": "REPEATED_INCIDENT_RISK",
        "title": "Repeated-Incident Risk (Modus Operandi Recurrence)",
        "riskScore": 78.9,
        "signalLevel": "Moderate-High Analytical Signal",
        "targetSector": "Commercial Logistics Corridors & Night Transit",
        "peakWindow": "Bi-Weekly Modus Operandi Recurrence Cycle",
        "crimeType": "Tactical Vulnerability Exploitation & Recurrent MO",
        "contributingFactors": [
            {"factor": "Unmarked Logistics Target Profile Consistency", "weight": 35, "impact": "HIGH"},
            {"factor": "Identical Vehicular Escape Vector Utilization (NH-48)", "weight": 29, "impact": "HIGH"},
            {"factor": "Firearm & RF Jammer Tactical Signature Similarity", "weight": 22, "impact": "MODERATE"},
            {"factor": "Shift-Change Timing Exploitation (Police Post Rotation)", "weight": 14, "impact": "MODERATE"}
        ],
        "recommendedForce": "Randomized Patrol Scheduling & Frequency-Hopped Logistics Telemetry",
        "analyticalNote": "Focuses exclusively on tactical MO patterns and geographical vulnerabilities without asserting individual culpability."
    }
]

def get_full_database_payload():
    """Returns all 17 collections ready for Firestore or local fallback"""
    return {
        "users": DEMO_OFFICERS,
        "officers": DEMO_OFFICERS,
        "firs": DEMO_FIRS,
        "persons": DEMO_PERSONS,
        "phone_records": DEMO_PHONE_RECORDS,
        "vehicles": DEMO_VEHICLES,
        "locations": DEMO_LOCATIONS,
        "organizations": DEMO_ORGANIZATIONS,
        "transactions": DEMO_TRANSACTIONS,
        "cdr_records": DEMO_CDR_RECORDS,
        "events": DEMO_EVENTS,
        "relationships": DEMO_RELATIONSHIPS,
        "network_analysis": [DEMO_NETWORK_ANALYSIS],
        "crime_hotspots": DEMO_CRIME_HOTSPOTS,
        "investigations": DEMO_INVESTIGATIONS,
        "audit_logs": DEMO_AUDIT_LOGS,
        "anomalies": DEMO_ANOMALIES,
        "risk_models": DEMO_RISK_MODELS
    }

def get_all_entities_map():
    """Returns a unified map of all entity IDs to their metadata for fast lookup."""
    m = {}
    for p in DEMO_PERSONS:
        m[p["id"]] = {"id": p["id"], "type": "Person", "name": p["name"], "details": p.get("role", "Suspect"), "risk": p.get("riskLevel", "MEDIUM")}
    for ph in DEMO_PHONE_RECORDS:
        m[ph["id"]] = {"id": ph["id"], "type": "Phone", "name": ph["number"], "details": ph.get("subscriberName", "Subscriber"), "risk": f"Score {ph.get('riskScore', 70)}"}
    for v in DEMO_VEHICLES:
        m[v["id"]] = {"id": v["id"], "type": "Vehicle", "name": v["regNumber"], "details": f"{v['color']} {v['make']}", "risk": "Flagged" if v.get("flaggedStolen") else "Active"}
    for loc in DEMO_LOCATIONS:
        m[loc["id"]] = {"id": loc["id"], "type": "Location", "name": loc["name"], "details": loc.get("category", "Location"), "risk": loc.get("crimeRate", "MEDIUM")}
    for org in DEMO_ORGANIZATIONS:
        m[org["id"]] = {"id": org["id"], "type": "Organization", "name": org["name"], "details": org.get("type", "Entity"), "risk": org.get("risk", "MEDIUM")}
    for fir in DEMO_FIRS:
        m[fir["id"]] = {"id": fir["id"], "type": "FIR", "name": fir["firNumber"], "details": fir.get("crimeCategory", "FIR"), "risk": fir.get("severity", "MEDIUM")}
    for tx in DEMO_TRANSACTIONS:
        m[tx["id"]] = {"id": tx["id"], "type": "Transaction", "name": f"TX ₹{tx['amount']:,}", "details": tx.get("status", "FLAGGED"), "risk": tx.get("status", "FLAGGED")}
    for evt in DEMO_EVENTS:
        m[evt["id"]] = {"id": evt["id"], "type": "Event", "name": evt["title"], "details": evt.get("location", "Event"), "risk": evt.get("severity", "MEDIUM")}
    return m

def find_shortest_path(start_id: str, end_id: str):
    """
    Dijkstra shortest path algorithm across DEMO_RELATIONSHIPS.
    Returns list of node IDs and edge details.
    """
    from collections import deque
    
    # Build adjacency list
    adj = {}
    edges_info = {}
    for r in DEMO_RELATIONSHIPS:
        u, v = r["source"], r["target"]
        if u not in adj:
            adj[u] = []
        if v not in adj:
            adj[v] = []
        adj[u].append((v, r))
        adj[v].append((u, r)) # Undirected for network intelligence
    
    if start_id not in adj or end_id not in adj:
        return None
    
    queue = deque([[start_id]])
    visited = set([start_id])
    
    while queue:
        path = queue.popleft()
        node = path[-1]
        
        if node == end_id:
            # Build detailed path steps
            steps = []
            ent_map = get_all_entities_map()
            for i in range(len(path) - 1):
                u, v = path[i], path[i+1]
                # Find edge
                rel_detail = None
                for nxt, rel in adj[u]:
                    if nxt == v:
                        rel_detail = rel
                        break
                steps.append({
                    "fromId": u,
                    "fromName": ent_map.get(u, {}).get("name", u),
                    "fromType": ent_map.get(u, {}).get("type", "Entity"),
                    "toId": v,
                    "toName": ent_map.get(v, {}).get("name", v),
                    "toType": ent_map.get(v, {}).get("type", "Entity"),
                    "relation": rel_detail["relation"] if rel_detail else "connected_to",
                    "details": rel_detail.get("details", "") if rel_detail else "",
                    "weight": rel_detail.get("weight", 1.0) if rel_detail else 1.0
                })
            return {"path": path, "steps": steps}
        
        for nxt, _ in adj.get(node, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append(path + [nxt])
                
    return None

