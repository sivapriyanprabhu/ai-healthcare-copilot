import api from './api';
import { PatientProfile } from '../types';

export const patientService = {
  getProfile: async (): Promise<PatientProfile> => {
    const response = await api.get<PatientProfile>('/patients/me');
    return response.data;
  },

  updateProfile: async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
    const response = await api.put<PatientProfile>('/patients/me', data);
    return response.data;
  }
};
