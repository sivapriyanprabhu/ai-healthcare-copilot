import api from './api';
import { DrugInteractionResult } from '../types';

export interface MedicationDTO {
  id?: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  timeOfDay?: string;
  prescribingDoctor?: string;
  startDate?: string;
  endDate?: string;
  purpose?: string;
  sideEffects?: string;
  isActive?: boolean;
  refillReminderDays?: number;
}

export const medicationService = {
  getAll: async (): Promise<MedicationDTO[]> => {
    const response = await api.get<MedicationDTO[]>('/medications');
    return response.data;
  },

  getActive: async (): Promise<MedicationDTO[]> => {
    const response = await api.get<MedicationDTO[]>('/medications/active');
    return response.data;
  },

  create: async (medication: MedicationDTO): Promise<MedicationDTO> => {
    const response = await api.post<MedicationDTO>('/medications', medication);
    return response.data;
  },

  update: async (id: number, medication: MedicationDTO): Promise<MedicationDTO> => {
    const response = await api.put<MedicationDTO>(`/medications/${id}`, medication);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/medications/${id}`);
  },

  checkInteractions: async (medications?: string[], candidateDrug?: string): Promise<DrugInteractionResult> => {
    try {
      const response = await api.post<DrugInteractionResult>('/medications/interactions', {
        medications,
        candidateDrug
      });
      return response.data;
    } catch (err) {
      // If Spring Boot hasn't reloaded the new controller endpoint yet, call AI service directly
      try {
        const directRes = await fetch('http://localhost:8000/api/ai/medications/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medications, candidateDrug })
        });
        if (directRes.ok) {
          return await directRes.json();
        }
      } catch (directErr) {
        console.warn('Direct AI service call failed:', directErr);
      }
      throw err;
    }
  }
};
