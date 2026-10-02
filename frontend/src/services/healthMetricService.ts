import api from './api';
import { HealthMetric } from '../types';

export interface DashboardSummary {
  patientName: string;
  healthScore: number;
  healthScoreStatus: string;
  bmi?: number;
  bmiCategory?: string;
  latestMetric?: HealthMetric;
  metricHistory: HealthMetric[];
  aiInsights: string[];
  cardiovascularRiskCategory?: string;
  riskScore?: number;
  activeMedicationsCount?: number;
}

export const healthMetricService = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>('/health-metrics/dashboard-summary');
    return response.data;
  },

  getHistory: async (): Promise<HealthMetric[]> => {
    const response = await api.get<HealthMetric[]>('/health-metrics');
    return response.data;
  },

  recordMetric: async (metric: HealthMetric): Promise<HealthMetric> => {
    const response = await api.post<HealthMetric>('/health-metrics', metric);
    return response.data;
  }
};
