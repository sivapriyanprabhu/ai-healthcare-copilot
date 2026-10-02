import api from './api';
import { MedicalReport } from '../types';

export interface ReportComparison {
  reports: MedicalReport[];
  metricTrends: Record<string, { date: string; numericValue: number; status: string }[]>;
  aiTrendExplanation: string;
}

export const reportService = {
  getReports: async (): Promise<MedicalReport[]> => {
    const response = await api.get<MedicalReport[]>('/reports');
    return response.data;
  },

  getReportById: async (id: number): Promise<MedicalReport> => {
    const response = await api.get<MedicalReport>(`/reports/${id}`);
    return response.data;
  },

  uploadReport: async (file: File, title?: string, reportType?: string): Promise<MedicalReport> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (reportType) formData.append('reportType', reportType);

    const response = await api.post<MedicalReport>('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteReport: async (id: number): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  compareReports: async (reportIds: number[]): Promise<ReportComparison> => {
    const response = await api.post<ReportComparison>('/reports/compare', reportIds);
    return response.data;
  }
};
