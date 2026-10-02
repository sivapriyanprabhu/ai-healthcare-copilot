import api from './api';

export interface RiskPredictionRequest {
  condition?: string;
  age: number;
  sex: string;
  systolicBp: number;
  cholesterol: number;
  glucose: number;
  bmi: number;
  smoking: boolean;
  exerciseMins: number;
  familyHistory: boolean;
}

export interface RiskFactor {
  factorName: string;
  impactScore: number;
  description: string;
}

export interface RiskPredictionResponse {
  id?: number;
  conditionName: string;
  riskScorePercent?: number;
  riskScore?: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH';
  confidenceScore?: number;
  summary?: string;
  patientPlainSummary?: string;
  recommendations?: string[];
  factors?: RiskFactor[];
  keyFactors?: RiskFactor[];
  disclaimer?: string;
  createdAt?: string;
}

export const riskService = {
  predictRisk: async (request: RiskPredictionRequest, condition?: string): Promise<RiskPredictionResponse> => {
    const payload = { ...request, condition: condition || request.condition || 'heart-disease' };
    const response = await api.post<RiskPredictionResponse>('/risk/predict', payload);
    return response.data;
  },

  predictHeartDisease: async (request: RiskPredictionRequest): Promise<RiskPredictionResponse> => {
    return riskService.predictRisk({ ...request, condition: 'heart-disease' });
  },

  getRiskHistory: async (): Promise<RiskPredictionResponse[]> => {
    const response = await api.get<RiskPredictionResponse[]>('/risk/history');
    return response.data;
  }
};
