import axios from 'axios';
import { mockApiService, AttackScenarioPhase } from './mockApi';
import { 
  NetworkTopologyData, 
  TrafficFlow, 
  FileUploadStatus 
} from '../types/network';
import { 
  ForecastHorizonPoint, 
  MultiStepForecastCardData, 
  AttackTrajectoryStage, 
  TemporalNetworkState, 
  FeatureImportanceItem, 
  ModelEvaluationResult 
} from '../types/forecast';
import { SocAlert, DefensiveRecommendation } from '../types/alert';
import { MitreTacticColumn } from '../types/mitre';

export interface ApiSettings {
  useLiveBackend: boolean;
  backendUrl: string;
  forecastHorizon: string; // '30m', '15m', '60m'
  timeWindowSize: string; // '1m', '5m', '15m'
  riskThresholdPercent: number;
  alertThresholdPercent: number;
  activeModel: 'Logistic Regression' | 'LSTM' | 'Temporal Transformer';
}

const DEFAULT_SETTINGS: ApiSettings = {
  useLiveBackend: false,
  backendUrl: 'http://localhost:8000',
  forecastHorizon: '30m',
  timeWindowSize: '5m',
  riskThresholdPercent: 70,
  alertThresholdPercent: 65,
  activeModel: 'Temporal Transformer'
};

class ApiService {
  private settings: ApiSettings;

  constructor() {
    const saved = localStorage.getItem('cyberpredict_settings');
    if (saved) {
      try {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        this.settings = DEFAULT_SETTINGS;
      }
    } else {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public getSettings(): ApiSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: Partial<ApiSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('cyberpredict_settings', JSON.stringify(this.settings));
  }

  public async getActiveScenario(): Promise<AttackScenarioPhase> {
    return mockApiService.getActiveScenario();
  }

  public async getForecast(): Promise<{
    curves: ForecastHorizonPoint[];
    cards: MultiStepForecastCardData[];
    riskScore: number;
    confidence: number;
    currentStage: string;
    predictedStage: string;
  }> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/forecast`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }

    const scenario = mockApiService.getActiveScenario();
    return {
      curves: mockApiService.getForecastCurves(),
      cards: mockApiService.getMultiStepCards(),
      riskScore: scenario.currentRiskScore,
      confidence: scenario.forecastConfidence,
      currentStage: scenario.stageName,
      predictedStage: scenario.predictedStage
    };
  }

  public async getNetworkTopology(): Promise<NetworkTopologyData> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/topology`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getNetworkTopology();
  }

  public async getAttackTrajectory(): Promise<AttackTrajectoryStage[]> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/attack-stage`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getAttackTrajectory();
  }

  public async getTemporalStates(): Promise<TemporalNetworkState[]> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/network-state`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getTemporalStates();
  }

  public async getExplainability(): Promise<FeatureImportanceItem[]> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/explainability`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getExplainabilityFeatures();
  }

  public async getTrafficFlows(): Promise<TrafficFlow[]> {
    return mockApiService.getTrafficFlows();
  }

  public async getAlerts(): Promise<SocAlert[]> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/alerts`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getAlerts();
  }

  public async getDefensiveRecommendations(): Promise<DefensiveRecommendation[]> {
    return mockApiService.getDefensiveRecommendations();
  }

  public async getMitreMapping(): Promise<MitreTacticColumn[]> {
    if (this.settings.useLiveBackend) {
      try {
        const res = await axios.get(`${this.settings.backendUrl}/api/mitre`, { timeout: 3000 });
        return res.data;
      } catch (err) {
        console.warn('Live backend unreachable, using synthetic demo service', err);
      }
    }
    return mockApiService.getMitreTacticColumns();
  }

  public async getModelEvaluations(): Promise<ModelEvaluationResult[]> {
    return mockApiService.getModelEvaluations();
  }

  public async uploadFile(file: File, onProgress?: (status: FileUploadStatus) => void): Promise<FileUploadStatus> {
    const ext = file.name.split('.').pop()?.toUpperCase();
    const format = ext === 'PCAP' ? 'PCAP' : ext === 'PCAPNG' ? 'PCAPNG' : 'CSV';
    
    const status: FileUploadStatus = {
      fileName: file.name,
      fileSizeBytes: file.size,
      format,
      uploadTimestamp: new Date().toLocaleTimeString(),
      step: 'uploaded',
      progressPercent: 15
    };
    onProgress?.(status);

    // Pipeline step delays for realistic processing simulation
    const steps: Array<{ step: FileUploadStatus['step']; pct: number; delay: number }> = [
      { step: 'parsing', pct: 30, delay: 600 },
      { step: 'feature_extraction', pct: 50, delay: 700 },
      { step: 'time_windowing', pct: 70, delay: 600 },
      { step: 'state_construction', pct: 85, delay: 600 },
      { step: 'model_inference', pct: 95, delay: 700 },
      { step: 'forecast_ready', pct: 100, delay: 400 }
    ];

    for (const item of steps) {
      await new Promise(r => setTimeout(r, item.delay));
      status.step = item.step;
      status.progressPercent = item.pct;
      if (item.step === 'forecast_ready') {
        status.totalFlowsExtracted = Math.round(1500 + Math.random() * 2000);
      }
      onProgress?.(status);
    }

    return status;
  }
}

export const apiService = new ApiService();
