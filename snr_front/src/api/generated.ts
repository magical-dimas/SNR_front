import { apiClient } from './axios';

export interface M2MInput {
  amount: number;
  model_id: number;
}

export const CalculationsApi = {
  addModelToCart: (input: M2MInput) => apiClient.post(`/api/model_calculation/add/${input.model_id}`, input),
  updateCartItem: (input: M2MInput) => apiClient.put(`/api/model_calculation/${input.model_id}`, input),
  removeModelFromCart: (modelId: number) => apiClient.delete(`/api/model_calculation/${modelId}`),

  getCalculations: (params?: { from_date?: string; to_date?: string }) => 
    apiClient.get('/api/nuclear_calculations', { params }),

  getDraftSummary: () => apiClient.get('/api/nuclear_calculations/items'),

  getCalculationById: (id: number) => apiClient.get(`/api/nuclear_calculations/${id}`),

  formCalculation: (id: number) => apiClient.put(`/api/nuclear_calculations/${id}/form`),

  removeCalculation: (id: number) => apiClient.delete(`/api/nuclear_calculations/${id}`),

  finishCalculation: (id: number, action: 'completed' | 'rejected') => 
    apiClient.put(`/api/nuclear_calculations/${id}/finish`, { status: action }),

  updateCalculation: (id: number, desc: string) => 
    apiClient.put(`/api/nuclear_calculations/${id}`, { description: desc }),
};

export const AuthApi = {
  register: (data: any) => apiClient.post('/api/engineers/register', data),
  login: (data: any) => apiClient.post('/api/engineers/login', data),
}