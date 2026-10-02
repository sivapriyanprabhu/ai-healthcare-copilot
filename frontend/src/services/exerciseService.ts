import api from './api';
import { ExercisePlan, ExercisePlanRequest } from '../types';

export const exerciseService = {
  generatePlan: async (data: ExercisePlanRequest): Promise<ExercisePlan> => {
    const response = await api.post<ExercisePlan>('/exercise/plan', data);
    return response.data;
  }
};
