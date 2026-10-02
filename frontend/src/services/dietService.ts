import api from './api';
import { DietPlan, DietPlanRequest } from '../types';

export const dietService = {
  generatePlan: async (data: DietPlanRequest): Promise<DietPlan> => {
    const response = await api.post<DietPlan>('/diet/plan', data);
    return response.data;
  }
};
