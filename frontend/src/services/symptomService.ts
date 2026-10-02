import api from './api';

export interface SymptomAnalysisRequest {
  symptoms: string[];
  durationDays: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  age?: number;
  existingConditions?: string;
}

export interface SymptomAnalysisResponse {
  urgencyLevel: 'ROUTINE' | 'PROMPT_CARE' | 'EMERGENCY_CARE';
  urgencyBadgeColor: string;
  possibleExplanations: string[];
  suggestedSpecialist: string;
  warningSigns: string[];
  recommendedNextSteps: string[];
  disclaimer: string;
}

export const symptomService = {
  analyzeSymptoms: async (request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> => {
    const response = await api.post<SymptomAnalysisResponse>('/symptoms/analyze', request);
    return response.data;
  }
};
