import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../firebase';
import {
  UserProfile,
  FIR,
  Person,
  PhoneRecord,
  Vehicle,
  CrimeLocation,
  CrimeHotspot,
  Investigation,
  Relationship,
  AuditLog
} from '../../types/crime';
import { OfficerMessage } from '../../types/auth';
import {
  INITIAL_OFFICERS,
  INITIAL_FIRS,
  INITIAL_PERSONS,
  INITIAL_PHONE_RECORDS,
  INITIAL_VEHICLES,
  INITIAL_HOTSPOTS,
  INITIAL_RELATIONSHIPS,
  INITIAL_INVESTIGATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_OFFICER_MESSAGES
} from '../syntheticData';

export interface IDatabaseService {
  getFIRs(): Promise<FIR[]>;
  getFIRById(id: string): Promise<FIR | null>;
  createFIR(fir: Omit<FIR, 'id'>): Promise<FIR>;
  updateFIR(id: string, updates: Partial<FIR>): Promise<FIR>;
  getOfficers(): Promise<UserProfile[]>;
  getOfficerById(id: string): Promise<UserProfile | null>;
  updateOfficer(id: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  getOfficerMessages(officerId?: string): Promise<OfficerMessage[]>;
  sendOfficerMessage(msg: Omit<OfficerMessage, 'id' | 'timestamp'>): Promise<OfficerMessage>;
  markMessageRead(id: string): Promise<void>;
  getPersons(): Promise<Person[]>;
  getHotspots(): Promise<CrimeHotspot[]>;
  getVehicles(): Promise<Vehicle[]>;
  getPhoneRecords(): Promise<PhoneRecord[]>;
  getInvestigations(): Promise<Investigation[]>;
  getRelationships(): Promise<Relationship[]>;
  getAuditLogs(): Promise<AuditLog[]>;
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  addRelationship(rel: Relationship): Promise<void>;
  addHotspot(hs: CrimeHotspot): Promise<void>;
  saveFIRAnalysisResult(analysis: any, fir: FIR): Promise<void>;
  getAdapterType(): 'FIREBASE' | 'ZOHO_CATALYST' | 'LOCAL_SYNTHETIC';
}

/**
 * Local Synced Synthetic Adapter (Resilient fallback)
 */
class LocalSyntheticAdapter implements IDatabaseService {
  private firs: FIR[];
  private officers: UserProfile[];
  private persons: Person[];
  private vehicles: Vehicle[];
  private phoneRecords: PhoneRecord[];
  private hotspots: CrimeHotspot[];
  private investigations: Investigation[];
  private relationships: Relationship[];
  private auditLogs: AuditLog[];
  private messages: OfficerMessage[];

  constructor() {
    // Load from localStorage or initialize
    const savedFirs = localStorage.getItem('astra_firs');
    this.firs = savedFirs ? JSON.parse(savedFirs) : [...INITIAL_FIRS];

    const savedOfficers = localStorage.getItem('astra_officers');
    this.officers = savedOfficers ? JSON.parse(savedOfficers) : [...INITIAL_OFFICERS];

    const savedAuditLogs = localStorage.getItem('astra_audit_logs');
    this.auditLogs = savedAuditLogs ? JSON.parse(savedAuditLogs) : [...INITIAL_AUDIT_LOGS];

    const savedPersons = localStorage.getItem('astra_persons');
    this.persons = savedPersons ? JSON.parse(savedPersons) : [...INITIAL_PERSONS];

    const savedVehicles = localStorage.getItem('astra_vehicles');
    this.vehicles = savedVehicles ? JSON.parse(savedVehicles) : [...INITIAL_VEHICLES];

    const savedPhones = localStorage.getItem('astra_phone_records');
    this.phoneRecords = savedPhones ? JSON.parse(savedPhones) : [...INITIAL_PHONE_RECORDS];

    const savedHotspots = localStorage.getItem('astra_hotspots');
    if (savedHotspots) {
      const parsed = JSON.parse(savedHotspots) as CrimeHotspot[];
      const missing = INITIAL_HOTSPOTS.filter((ih) => !parsed.some((p) => p.id === ih.id || p.name === ih.name));
      this.hotspots = [...parsed, ...missing];
    } else {
      this.hotspots = [...INITIAL_HOTSPOTS];
    }

    const savedInvestigations = localStorage.getItem('astra_investigations');
    this.investigations = savedInvestigations ? JSON.parse(savedInvestigations) : [...INITIAL_INVESTIGATIONS];

    const savedRelationships = localStorage.getItem('astra_relationships');
    this.relationships = savedRelationships ? JSON.parse(savedRelationships) : [...INITIAL_RELATIONSHIPS];

    const savedMessages = localStorage.getItem('astra_officer_messages');
    this.messages = savedMessages ? JSON.parse(savedMessages) : [...INITIAL_OFFICER_MESSAGES];
  }

  private persistFirs() {
    localStorage.setItem('astra_firs', JSON.stringify(this.firs));
  }

  private persistOfficers() {
    localStorage.setItem('astra_officers', JSON.stringify(this.officers));
  }

  private persistAuditLogs() {
    localStorage.setItem('astra_audit_logs', JSON.stringify(this.auditLogs));
  }

  private persistMessages() {
    localStorage.setItem('astra_officer_messages', JSON.stringify(this.messages));
  }

  async getFIRs(): Promise<FIR[]> {
    return [...this.firs];
  }

  async getFIRById(id: string): Promise<FIR | null> {
    return this.firs.find(f => f.id === id) || null;
  }

  async createFIR(firData: Omit<FIR, 'id'>): Promise<FIR> {
    const newFir: FIR = {
      ...firData,
      id: `fir_2026_${String(this.firs.length + 1).padStart(3, '0')}`
    };
    this.firs.unshift(newFir);
    this.persistFirs();
    return newFir;
  }

  async updateFIR(id: string, updates: Partial<FIR>): Promise<FIR> {
    const idx = this.firs.findIndex(f => f.id === id);
    if (idx === -1) throw new Error("FIR not found");
    this.firs[idx] = { ...this.firs[idx], ...updates };
    this.persistFirs();
    return this.firs[idx];
  }

  async getOfficers(): Promise<UserProfile[]> {
    return [...this.officers];
  }

  async getOfficerById(id: string): Promise<UserProfile | null> {
    return this.officers.find(o => o.id === id || o.officerId === id) || null;
  }

  async updateOfficer(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    let idx = this.officers.findIndex(o => o.id === id || o.officerId === id || (updates.email && o.email.toLowerCase() === updates.email.toLowerCase()));
    if (idx === -1) {
      // Create new officer record (upsert) for new registrations
      const newOfficer: UserProfile = {
        id: id || `off_${Date.now()}`,
        officerId: updates.officerId || `IND-OFF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: updates.name || 'OFFICER',
        email: updates.email || 'officer@police.gov.in',
        role: updates.role || 'INSPECTOR',
        department: updates.department || 'Crime Investigation Department',
        designation: updates.designation || 'Sub-Inspector',
        phone: updates.phone || '+91 98000 00000',
        photoUrl: updates.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        casesAssigned: updates.casesAssigned || 0,
        casesSolved: updates.casesSolved || 0,
        clearanceRate: updates.clearanceRate || 0,
        status: updates.status || 'ACTIVE',
        createdAt: updates.createdAt || new Date().toISOString(),
        ...updates
      };
      this.officers.unshift(newOfficer);
      this.persistOfficers();
      return newOfficer;
    }

    this.officers[idx] = { ...this.officers[idx], ...updates };
    this.persistOfficers();

    // Synchronize logged-in user if updating own record
    try {
      const currentRaw = localStorage.getItem('astra_current_user');
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current.id === id || current.officerId === id || current.email === this.officers[idx].email) {
          localStorage.setItem('astra_current_user', JSON.stringify({ ...current, ...updates }));
        }
      }
    } catch (e) {
      console.warn("Could not sync astra_current_user in updateOfficer", e);
    }

    return this.officers[idx];
  }

  async getOfficerMessages(officerId?: string): Promise<OfficerMessage[]> {
    if (!officerId) return [...this.messages];
    return this.messages.filter(m => m.senderId === officerId || m.receiverId === officerId);
  }

  async sendOfficerMessage(msgData: Omit<OfficerMessage, 'id' | 'timestamp'>): Promise<OfficerMessage> {
    const newMsg: OfficerMessage = {
      ...msgData,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.messages.unshift(newMsg);
    this.persistMessages();
    return newMsg;
  }

  async markMessageRead(id: string): Promise<void> {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.read = true;
      this.persistMessages();
    }
  }

  async getPersons(): Promise<Person[]> {
    return [...this.persons];
  }

  async getHotspots(): Promise<CrimeHotspot[]> {
    return [...this.hotspots];
  }

  async getVehicles(): Promise<Vehicle[]> {
    return [...this.vehicles];
  }

  async getPhoneRecords(): Promise<PhoneRecord[]> {
    return [...this.phoneRecords];
  }

  async getInvestigations(): Promise<Investigation[]> {
    return [...this.investigations];
  }

  async getRelationships(): Promise<Relationship[]> {
    return [...this.relationships];
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return [...this.auditLogs];
  }

  async addAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const log: AuditLog = {
      ...logData,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    this.persistAuditLogs();
    return log;
  }

  async addRelationship(rel: Relationship): Promise<void> {
    this.relationships.unshift(rel);
    localStorage.setItem('astra_relationships', JSON.stringify(this.relationships));
  }

  async addHotspot(hs: CrimeHotspot): Promise<void> {
    const existing = this.hotspots.findIndex(h => h.name === hs.name);
    if (existing >= 0) {
      this.hotspots[existing] = hs;
    } else {
      this.hotspots.unshift(hs);
    }
    localStorage.setItem('astra_hotspots', JSON.stringify(this.hotspots));
  }

  async saveFIRAnalysisResult(analysis: any, fir: FIR): Promise<void> {
    // 1. Add FIR
    const existingFirIdx = this.firs.findIndex(f => f.id === fir.id || f.firNumber === fir.firNumber);
    if (existingFirIdx >= 0) {
      this.firs[existingFirIdx] = fir;
    } else {
      this.firs.unshift(fir);
    }
    this.persistFirs();

    // 2. Add derived hotspot
    if (analysis.derived_hotspot) {
      await this.addHotspot(analysis.derived_hotspot);
    }

    // 3. Add relationships
    if (analysis.relationships && Array.isArray(analysis.relationships)) {
      for (const r of analysis.relationships) {
        const src = r.source_entity || r.source;
        const tgt = r.target_entity || r.target;
        const rel = r.relationship_type || r.relation || 'connected_to';
        if (!src || !tgt) continue;
        if (!this.relationships.some(existing => existing.source === src && existing.target === tgt && existing.relation === rel)) {
          this.relationships.unshift({
            source: src,
            target: tgt,
            relation: rel,
            weight: (r.confidence || 90) / 100.0,
            details: `Triangulated from ${fir.firNumber}`
          });
        }
      }
      localStorage.setItem('astra_relationships', JSON.stringify(this.relationships));
    }

    // 4. Add persons
    if (analysis.entities && Array.isArray(analysis.entities)) {
      const personEntities = analysis.entities.filter((e: any) => e.entity_type === 'PERSON');
      for (const pe of personEntities) {
        if (!this.persons.some(p => p.name.toLowerCase() === pe.value.toLowerCase())) {
          this.persons.unshift({
            id: `per_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: pe.value,
            role: 'PRIMARY_SUSPECT',
            riskLevel: fir.severity,
            associatedFIRs: [fir.id],
            criminalRecord: pe.extracted_text_context || 'Identified via FIR intake NLP pipeline',
            status: 'UNDER_SURVEILLANCE'
          });
        }
      }
      localStorage.setItem('astra_persons', JSON.stringify(this.persons));

      // 5. Add vehicles
      const vehicleEntities = analysis.entities.filter((e: any) => e.entity_type === 'VEHICLE');
      for (const ve of vehicleEntities) {
        if (!this.vehicles.some(v => v.regNumber.toLowerCase() === ve.value.toLowerCase())) {
          this.vehicles.unshift({
            id: `veh_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            regNumber: ve.value,
            make: 'Syndicate Fleet Asset',
            color: 'Dark Metallic',
            owner: 'Syndicate Logistics Cell',
            flaggedStolen: true,
            involvedCrimes: 1
          });
        }
      }
      localStorage.setItem('astra_vehicles', JSON.stringify(this.vehicles));

      // 6. Add phone records
      const phoneEntities = analysis.entities.filter((e: any) => e.entity_type === 'PHONE_NUMBER');
      for (const ph of phoneEntities) {
        if (!this.phoneRecords.some(p => p.number === ph.value)) {
          this.phoneRecords.unshift({
            id: `ph_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            number: ph.value,
            riskScore: 88,
            carrier: 'Cellular Intercept',
            imei: `86${Date.now()}`,
            subscriberName: 'Identified from Ingested Dossier',
            isActive: true
          });
        }
      }
      localStorage.setItem('astra_phone_records', JSON.stringify(this.phoneRecords));
    }

    // 7. Add active investigation for Inspector Dashboard
    const invId = `inv_${fir.id}`;
    if (!this.investigations.some(i => i.id === invId || (i.linkedFIRs && i.linkedFIRs.includes(fir.firNumber)))) {
      const suspects = fir.extractedEntities?.suspects || [];
      this.investigations.unshift({
        id: invId,
        title: `Operation: ${fir.crimeCategory} (${fir.firNumber})`,
        leadOfficer: fir.investigatingOfficerName || 'Insp. Ananya Sharma',
        priority: fir.severity === 'CRITICAL' ? 'P0_CRITICAL' : 'P1_URGENT',
        status: 'ACTIVE_INTERROGATION',
        linkedFIRs: [fir.firNumber],
        targetEntities: suspects.length > 0 ? suspects.slice(0, 3) : ['Syndicate Operatives'],
        caseDiaryEntries: 1,
        progressPercentage: 40
      });
      localStorage.setItem('astra_investigations', JSON.stringify(this.investigations));
    }
  }

  getAdapterType(): 'LOCAL_SYNTHETIC' {
    return 'LOCAL_SYNTHETIC';
  }
}
// Backend API helper - Only default to localhost:8000 when running locally
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || (isLocalhost ? 'http://localhost:8000' : '');

async function fetchFromBackend<T>(endpoint: string, timeoutMs: number = 1500): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // silently continue to direct firestore or fallback
  }
  return null;
}

/**
 * Firebase Firestore Adapter (Live Cloud Firestore + Resilient fallback)
 */
class FirebaseDatabaseAdapter implements IDatabaseService {
  private fallback: LocalSyntheticAdapter;

  constructor() {
    this.fallback = new LocalSyntheticAdapter();
  }

  async getFIRs(): Promise<FIR[]> {
    const localFirs = await this.fallback.getFIRs();
    const backendData = await fetchFromBackend<FIR[]>('/api/firs');
    const merged = [...(backendData || [])];
    for (const lf of localFirs) {
      if (!merged.some(bf => bf.id === lf.id || bf.firNumber === lf.firNumber)) {
        merged.unshift(lf);
      }
    }
    if (merged.length > 0) return merged;

    try {
      if (db && isFirebaseInitialized) {
        const colRef = collection(db, 'firs');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as FIR));
        }
      }
    } catch (e) {
      console.warn("Firestore getFIRs fallback:", e);
    }
    return localFirs;
  }

  async getFIRById(id: string): Promise<FIR | null> {
    const backendData = await fetchFromBackend<FIR>(`/api/firs/${id}`);
    if (backendData) return backendData;

    try {
      if (db && isFirebaseInitialized) {
        const docRef = doc(db, 'firs', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() } as FIR;
      }
    } catch (e) {
      // fallback
    }
    return this.fallback.getFIRById(id);
  }

  async createFIR(firData: Omit<FIR, 'id'>): Promise<FIR> {
    try {
      if (db && isFirebaseInitialized) {
        const colRef = collection(db, 'firs');
        const docRef = await addDoc(colRef, firData);
        return { id: docRef.id, ...firData };
      }
    } catch (e) {
      console.warn("Firestore createFIR fallback:", e);
    }
    return this.fallback.createFIR(firData);
  }

  async updateFIR(id: string, updates: Partial<FIR>): Promise<FIR> {
    try {
      if (db && isFirebaseInitialized) {
        const docRef = doc(db, 'firs', id);
        await updateDoc(docRef, updates);
        const updated = await this.getFIRById(id);
        if (updated) return updated;
      }
    } catch (e) {
      // fallback
    }
    return this.fallback.updateFIR(id, updates);
  }

  async getOfficers(): Promise<UserProfile[]> {
    const localOfficers = await this.fallback.getOfficers();
    const backendData = await fetchFromBackend<UserProfile[]>('/api/officers');

    if (backendData && backendData.length > 0) {
      // Local user modifications MUST override static backend defaults!
      const merged = backendData.map(bOff => {
        const localMatch = localOfficers.find(lOff => lOff.id === bOff.id || lOff.officerId === bOff.officerId);
        if (localMatch) {
          return { ...bOff, ...localMatch };
        }
        return bOff;
      });

      for (const lOff of localOfficers) {
        if (!merged.some(m => m.id === lOff.id || m.officerId === lOff.officerId)) {
          merged.push(lOff);
        }
      }
      return merged;
    }

    try {
      if (db && isFirebaseInitialized) {
        const colRef = collection(db, 'officers');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const fsOfficers = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
          return fsOfficers.map(fOff => {
            const localMatch = localOfficers.find(l => l.id === fOff.id || l.officerId === fOff.officerId);
            return localMatch ? { ...fOff, ...localMatch } : fOff;
          });
        }
      }
    } catch (e) {
      // fallback
    }
    return localOfficers;
  }

  async getOfficerById(id: string): Promise<UserProfile | null> {
    const localOfficer = await this.fallback.getOfficerById(id);
    if (localOfficer) return localOfficer;

    try {
      if (db && isFirebaseInitialized) {
        const docRef = doc(db, 'officers', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() } as UserProfile;
      }
    } catch (e) {
      // fallback
    }
    return null;
  }

  async updateOfficer(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // 1. Always update local storage & active officer FIRST
    const localUpdated = await this.fallback.updateOfficer(id, updates);

    // 2. Dispatch non-blocking update to backend FastAPI
    try {
      fetch(`http://127.0.0.1:8000/api/officers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(err => console.warn("Backend sync officer note:", err));
    } catch (e) {
      // non-blocking
    }

    // 3. Dispatch non-blocking sync to Firestore ('officers' and 'users' collections)
    try {
      if (db && isFirebaseInitialized) {
        const payload = {
          ...localUpdated,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        // 1. Primary Users collection (Document ID = User ID)
        // Store full profile and details inside particular user document
        const userDocRef = doc(db, 'Users', id);
        setDoc(userDocRef, {
          ...payload,
          userId: id,
          profile: {
            name: localUpdated.name,
            email: localUpdated.email,
            role: localUpdated.role,
            department: localUpdated.department,
            designation: localUpdated.designation,
            phone: localUpdated.phone,
            photoUrl: localUpdated.photoUrl,
            status: localUpdated.status,
            casesAssigned: localUpdated.casesAssigned || 0,
            casesSolved: localUpdated.casesSolved || 0,
            clearanceRate: localUpdated.clearanceRate || 0,
            createdAt: localUpdated.createdAt || new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(e => console.warn("Firestore Users setDoc note:", e));

        // Also update legacy lowercase 'users' and 'officers' for backward compatibility
        const legacyDocRef = doc(db, 'users', id);
        setDoc(legacyDocRef, payload, { merge: true }).catch(() => {});
        const offDocRef = doc(db, 'officers', id);
        setDoc(offDocRef, payload, { merge: true }).catch(() => {});
      }
    } catch (e) {
      console.warn("Firestore officer/user update sync note:", e);
    }

    return localUpdated;
  }

  async getOfficerMessages(officerId?: string): Promise<OfficerMessage[]> {
    return this.fallback.getOfficerMessages(officerId);
  }

  async sendOfficerMessage(msg: Omit<OfficerMessage, 'id' | 'timestamp'>): Promise<OfficerMessage> {
    return this.fallback.sendOfficerMessage(msg);
  }

  async markMessageRead(id: string): Promise<void> {
    return this.fallback.markMessageRead(id);
  }

  async getPersons(): Promise<Person[]> {
    const localPersons = await this.fallback.getPersons();
    const backendData = await fetchFromBackend<Person[]>('/api/persons');
    const merged = [...(backendData || [])];
    for (const lp of localPersons) {
      if (!merged.some(bp => bp.id === lp.id || bp.name.toLowerCase() === lp.name.toLowerCase())) {
        merged.unshift(lp);
      }
    }
    if (merged.length > 0) return merged;

    try {
      if (db && isFirebaseInitialized) {
        const colRef = collection(db, 'persons');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Person));
        }
      }
    } catch (e) {
      // fallback
    }
    return localPersons;
  }

  async getHotspots(): Promise<CrimeHotspot[]> {
    const localHotspots = await this.fallback.getHotspots();
    const backendData = await fetchFromBackend<CrimeHotspot[]>('/api/hotspots');
    const merged = [...(backendData || [])];
    for (const lh of localHotspots) {
      if (!merged.some(bh => bh.id === lh.id || bh.name.toLowerCase() === lh.name.toLowerCase())) {
        merged.unshift(lh);
      }
    }
    if (merged.length > 0) return merged;

    try {
      if (db && isFirebaseInitialized) {
        const colRef = collection(db, 'crime_hotspots');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as CrimeHotspot));
        }
      }
    } catch (e) {
      // fallback
    }
    return localHotspots;
  }

  async getVehicles(): Promise<Vehicle[]> {
    const localVehicles = await this.fallback.getVehicles();
    const backendData = await fetchFromBackend<Vehicle[]>('/api/vehicles');
    const merged = [...(backendData || [])];
    for (const lv of localVehicles) {
      if (!merged.some(bv => bv.id === lv.id || bv.regNumber.toLowerCase() === lv.regNumber.toLowerCase())) {
        merged.unshift(lv);
      }
    }
    return merged.length > 0 ? merged : localVehicles;
  }

  async getPhoneRecords(): Promise<PhoneRecord[]> {
    const localPhones = await this.fallback.getPhoneRecords();
    const backendData = await fetchFromBackend<PhoneRecord[]>('/api/phone-records');
    const merged = [...(backendData || [])];
    for (const lp of localPhones) {
      if (!merged.some(bp => bp.id === lp.id || bp.number === lp.number)) {
        merged.unshift(lp);
      }
    }
    return merged.length > 0 ? merged : localPhones;
  }

  async getInvestigations(): Promise<Investigation[]> {
    const localInvs = await this.fallback.getInvestigations();
    const backendData = await fetchFromBackend<Investigation[]>('/api/investigations');
    const merged = [...(backendData || [])];
    for (const li of localInvs) {
      if (!merged.some(bi => bi.id === li.id)) {
        merged.unshift(li);
      }
    }
    return merged.length > 0 ? merged : localInvs;
  }

  async getRelationships(): Promise<Relationship[]> {
    const localRels = await this.fallback.getRelationships();
    const backendData = await fetchFromBackend<Relationship[]>('/api/relationships');
    const merged = [...(backendData || [])];
    for (const lr of localRels) {
      if (!merged.some(br => br.source === lr.source && br.target === lr.target && br.relation === lr.relation)) {
        merged.unshift(lr);
      }
    }
    return merged.length > 0 ? merged : localRels;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    const backendData = await fetchFromBackend<AuditLog[]>('/api/audit-logs');
    if (backendData && backendData.length > 0) return backendData;
    return this.fallback.getAuditLogs();
  }

  async addAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const log = await this.fallback.addAuditLog(logData);
    try {
      if (db && isFirebaseInitialized) {
        // Legacy audit_logs collection
        const colRef = collection(db, 'audit_logs');
        addDoc(colRef, log).catch(e => console.warn("Firestore audit_logs addDoc note:", e));

        // Centralized clean "Logins" collection if the action represents a login/session
        if (log.action.includes('LOGIN') || log.action.includes('SWITCH') || log.action.includes('REGISTERED')) {
          const loginPayload = {
            id: log.id,
            officerId: log.officerId,
            officerName: log.officerName,
            action: log.action,
            timestamp: log.timestamp,
            ip: log.ip || '127.0.0.1',
            status: log.result || 'SUCCESS'
          };
          addDoc(collection(db, 'Logins'), loginPayload).catch(() => {});

          // Also record inside the user's specific subcollection: Users -> {userId} -> logins
          if (log.officerId) {
            addDoc(collection(db, 'Users', log.officerId, 'logins'), loginPayload).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Firestore audit log dispatch note:", e);
    }
    return log;
  }

  async addRelationship(rel: Relationship): Promise<void> {
    return this.fallback.addRelationship(rel);
  }

  async addHotspot(hs: CrimeHotspot): Promise<void> {
    return this.fallback.addHotspot(hs);
  }

  async saveFIRAnalysisResult(analysis: any, fir: FIR): Promise<void> {
    // 1. Immediately save locally (synchronous, instant, zero-hang)
    await this.fallback.saveFIRAnalysisResult(analysis, fir);

    // 2. Fire non-blocking backend sync with timeout guard (never blocks the UI pipeline)
    if (API_BASE) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        fetch(`${API_BASE}/api/fir/sync-analysis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analysis, fir_record: fir }),
          signal: controller.signal
        })
          .catch((err) => console.warn("Backend sync non-blocking warning:", err))
          .finally(() => clearTimeout(timeoutId));
      } catch (e) {
        console.warn("Backend sync dispatch warning:", e);
      }
    }

    // 3. Direct commit to Firebase Cloud Firestore
    try {
      if (db && isFirebaseInitialized) {
        const firId = fir.id || analysis.fir_id || `fir_${Date.now()}`;
        setDoc(doc(db, 'firs', firId), fir, { merge: true }).catch(() => {});

        if (analysis.derived_hotspot) {
          const hsId = analysis.derived_hotspot.id || `hs_${Date.now()}`;
          setDoc(doc(db, 'crime_hotspots', hsId), analysis.derived_hotspot, { merge: true }).catch(() => {});
        }

        if (analysis.entities && Array.isArray(analysis.entities)) {
          for (const ent of analysis.entities) {
            const entId = ent.entity_id || `ent_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            setDoc(doc(db, 'entities', entId), ent, { merge: true }).catch(() => {});
          }
        }

        if (analysis.relationships && Array.isArray(analysis.relationships)) {
          for (const rel of analysis.relationships) {
            const relId = rel.relationship_id || `rel_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            setDoc(doc(db, 'relationships', relId), rel, { merge: true }).catch(() => {});
          }
        }

        // 4. Centralized "Files" collection
        const filePayload = {
          fileId: firId,
          fileName: analysis.filename || fir.firNumber || 'Forensic_Document',
          uploaderId: fir.uploaderId || fir.investigatingOfficerId || 'system',
          uploaderName: fir.uploaderName || fir.investigatingOfficerName || 'Officer',
          uploaderEmail: fir.uploaderEmail || '',
          uploadedAt: new Date().toISOString(),
          crimeCategory: fir.crimeCategory || analysis.crime_category || 'General',
          firNumber: fir.firNumber || 'FIR-PENDING',
          entitiesCount: (analysis.entities && analysis.entities.length) || 0,
          status: 'PROCESSED'
        };

        setDoc(doc(db, 'Files', firId), filePayload, { merge: true }).catch(() => {});
        setDoc(doc(db, 'uploaded_documents', firId), filePayload, { merge: true }).catch(() => {});

        // Also save in the specific user's subcollection: Users -> {userId} -> uploaded_files
        if (filePayload.uploaderId) {
          setDoc(doc(db, 'Users', filePayload.uploaderId, 'uploaded_files', firId), filePayload, { merge: true }).catch(() => {});
        }
      }
    } catch (fsErr) {
      console.warn("Firestore direct commit note:", fsErr);
    }
  }

  getAdapterType(): 'FIREBASE' {
    return 'FIREBASE';
  }
}

/**
 * Modular Zoho Catalyst Adapter (Pluggable interface for future integration)
 */
class ZohoCatalystAdapter implements IDatabaseService {
  private fallback: LocalSyntheticAdapter;

  constructor() {
    this.fallback = new LocalSyntheticAdapter();
  }

  async getFIRs() { return this.fallback.getFIRs(); }
  async getFIRById(id: string) { return this.fallback.getFIRById(id); }
  async createFIR(fir: Omit<FIR, 'id'>) { return this.fallback.createFIR(fir); }
  async updateFIR(id: string, updates: Partial<FIR>) { return this.fallback.updateFIR(id, updates); }
  async getOfficers() { return this.fallback.getOfficers(); }
  async getOfficerById(id: string) { return this.fallback.getOfficerById(id); }
  async updateOfficer(id: string, updates: Partial<UserProfile>) { return this.fallback.updateOfficer(id, updates); }
  async getOfficerMessages(officerId?: string) { return this.fallback.getOfficerMessages(officerId); }
  async sendOfficerMessage(msg: Omit<OfficerMessage, 'id' | 'timestamp'>) { return this.fallback.sendOfficerMessage(msg); }
  async markMessageRead(id: string) { return this.fallback.markMessageRead(id); }
  async getPersons() { return this.fallback.getPersons(); }
  async getHotspots() { return this.fallback.getHotspots(); }
  async getVehicles() { return this.fallback.getVehicles(); }
  async getPhoneRecords() { return this.fallback.getPhoneRecords(); }
  async getInvestigations() { return this.fallback.getInvestigations(); }
  async getRelationships() { return this.fallback.getRelationships(); }
  async getAuditLogs() { return this.fallback.getAuditLogs(); }
  async addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) { return this.fallback.addAuditLog(log); }
  async addRelationship(rel: Relationship) { return this.fallback.addRelationship(rel); }
  async addHotspot(hs: CrimeHotspot) { return this.fallback.addHotspot(hs); }
  async saveFIRAnalysisResult(analysis: any, fir: FIR) { return this.fallback.saveFIRAnalysisResult(analysis, fir); }

  getAdapterType(): 'ZOHO_CATALYST' {
    return 'ZOHO_CATALYST';
  }
}

// Singleton Instance
export const databaseService: IDatabaseService = new FirebaseDatabaseAdapter();
