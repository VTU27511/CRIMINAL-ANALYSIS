import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApiService, SCENARIO_PHASES, AttackScenarioPhase } from '../services/mockApi';
import { apiService, ApiSettings } from '../services/api';
import { HostNode } from '../types/network';

interface CyberPredictContextType {
  currentPhaseIndex: number;
  currentScenario: AttackScenarioPhase;
  allPhases: AttackScenarioPhase[];
  isPlayingDemo: boolean;
  playbackSpeed: number; // 1 or 2
  isMitigationSimulated: boolean;
  selectedHost: HostNode | null;
  quarantinedHostIds: string[];
  acknowledgedAlertIds: string[];
  appliedRecommendationIds: string[];
  apiSettings: ApiSettings;
  lastUpdated: string;
  isDemoMode: boolean;

  // Actions
  setPhase: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  playDemo: () => void;
  pauseDemo: () => void;
  resetDemo: () => void;
  setSpeed: (speed: number) => void;
  toggleMitigationSimulation: () => void;
  setSelectedHost: (host: HostNode | null) => void;
  quarantineHost: (hostId: string) => void;
  unquarantineHost: (hostId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  applyRecommendation: (recId: string) => void;
  updateSettings: (newSettings: Partial<ApiSettings>) => void;
  refreshData: () => void;
}

const CyberPredictContext = createContext<CyberPredictContextType | undefined>(undefined);

export const CyberPredictProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(() => mockApiService.getPhaseIndex());
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMitigationSimulated, setIsMitigationSimulated] = useState<boolean>(false);
  const [selectedHost, setSelectedHost] = useState<HostNode | null>(null);
  const [quarantinedHostIds, setQuarantinedHostIds] = useState<string[]>([]);
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<string[]>([]);
  const [appliedRecommendationIds, setAppliedRecommendationIds] = useState<string[]>([]);
  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => apiService.getSettings());
  const [lastUpdated, setLastUpdated] = useState<string>(() => new Date().toLocaleTimeString());
  const [ticker, setTicker] = useState<number>(0);

  const isDemoMode = !apiSettings.useLiveBackend;

  const setPhase = (index: number) => {
    mockApiService.setPhaseIndex(index);
    setCurrentPhaseIndex(index);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const stepForward = () => {
    const next = (currentPhaseIndex + 1) % SCENARIO_PHASES.length;
    setPhase(next);
  };

  const stepBackward = () => {
    const prev = (currentPhaseIndex - 1 + SCENARIO_PHASES.length) % SCENARIO_PHASES.length;
    setPhase(prev);
  };

  const playDemo = () => setIsPlayingDemo(true);
  const pauseDemo = () => setIsPlayingDemo(false);
  const resetDemo = () => {
    setIsPlayingDemo(false);
    setIsMitigationSimulated(false);
    setPhase(0);
  };

  const setSpeed = (speed: number) => setPlaybackSpeed(speed);

  const toggleMitigationSimulation = () => {
    setIsMitigationSimulated(prev => !prev);
  };

  const quarantineHost = (hostId: string) => {
    if (!quarantinedHostIds.includes(hostId)) {
      setQuarantinedHostIds(prev => [...prev, hostId]);
    }
  };

  const unquarantineHost = (hostId: string) => {
    setQuarantinedHostIds(prev => prev.filter(id => id !== hostId));
  };

  const acknowledgeAlert = (alertId: string) => {
    if (!acknowledgedAlertIds.includes(alertId)) {
      setAcknowledgedAlertIds(prev => [...prev, alertId]);
    }
  };

  const applyRecommendation = (recId: string) => {
    if (!appliedRecommendationIds.includes(recId)) {
      setAppliedRecommendationIds(prev => [...prev, recId]);
    }
  };

  const updateSettings = (newSettings: Partial<ApiSettings>) => {
    apiService.saveSettings(newSettings);
    setApiSettings(apiService.getSettings());
  };

  const refreshData = () => {
    setTicker(t => t + 1);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Auto-advance loop when Demo is playing
  useEffect(() => {
    if (!isPlayingDemo) return;

    const intervalMs = (5000 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentPhaseIndex(current => {
        const next = (current + 1);
        if (next >= SCENARIO_PHASES.length) {
          setIsPlayingDemo(false);
          mockApiService.setPhaseIndex(0);
          return 0;
        }
        mockApiService.setPhaseIndex(next);
        setLastUpdated(new Date().toLocaleTimeString());
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingDemo, playbackSpeed]);

  const currentScenario = SCENARIO_PHASES[currentPhaseIndex];

  return (
    <CyberPredictContext.Provider
      value={{
        currentPhaseIndex,
        currentScenario,
        allPhases: SCENARIO_PHASES,
        isPlayingDemo,
        playbackSpeed,
        isMitigationSimulated,
        selectedHost,
        quarantinedHostIds,
        acknowledgedAlertIds,
        appliedRecommendationIds,
        apiSettings,
        lastUpdated,
        isDemoMode,
        setPhase,
        stepForward,
        stepBackward,
        playDemo,
        pauseDemo,
        resetDemo,
        setSpeed,
        toggleMitigationSimulation,
        setSelectedHost,
        quarantineHost,
        unquarantineHost,
        acknowledgeAlert,
        applyRecommendation,
        updateSettings,
        refreshData
      }}
    >
      {children}
    </CyberPredictContext.Provider>
  );
};

export const useCyberPredict = (): CyberPredictContextType => {
  const context = useContext(CyberPredictContext);
  if (!context) {
    throw new Error('useCyberPredict must be used within a CyberPredictProvider');
  }
  return context;
};
