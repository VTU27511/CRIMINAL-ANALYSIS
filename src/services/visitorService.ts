import { collection, addDoc } from 'firebase/firestore';
import { db, isFirebaseInitialized } from './firebase';

export interface VisitorLog {
  id?: string;
  sessionId: string;
  timestamp: string;
  path: string;
  referrer: string;
  userAgent: string;
  screenResolution: string;
  language: string;
  platform: string;
  visitorType: 'GUEST' | 'OFFICER';
  userEmail?: string;
}

const getSessionId = (): string => {
  let sId = sessionStorage.getItem('astra_session_id');
  if (!sId) {
    sId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('astra_session_id', sId);
  }
  return sId;
};

export const logVisitorVisit = async (
  path: string,
  userEmail?: string,
  visitorType: 'GUEST' | 'OFFICER' = 'GUEST'
): Promise<void> => {
  const sessionId = getSessionId();
  const visitorData: VisitorLog = {
    sessionId,
    timestamp: new Date().toISOString(),
    path: path || window.location.pathname,
    referrer: document.referrer || 'direct',
    userAgent: navigator.userAgent || 'unknown',
    screenResolution: (window.screen ? window.screen.width + 'x' + window.screen.height : 'unknown'),
    language: navigator.language || 'en-US',
    platform: navigator.platform || 'unknown',
    visitorType,
    userEmail: userEmail || 'OFFICER_SESSION'
  };

  try {
    const raw = localStorage.getItem('astra_visitor_logs');
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(visitorData);
    if (logs.length > 50) logs.length = 50;
    localStorage.setItem('astra_visitor_logs', JSON.stringify(logs));
  } catch (e) {}

  try {
    if (db && isFirebaseInitialized) {
      const colRef = collection(db, 'visitor_logs');
      await addDoc(colRef, visitorData);
      console.log('[Team Astra] Visitor recorded in Firestore: visitor_logs');
    }
  } catch (fe) {
    console.warn('[Team Astra] Firestore visitor log note:', fe);
  }

  try {
    fetch('http://localhost:8000/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData)
    }).catch(() => {});
  } catch (be) {}
};
