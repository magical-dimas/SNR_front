import { Api } from './api';

export const apiClient = new Api({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
});

apiClient.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  
  if (token && token !== 'undefined' && token !== 'null') {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  
  return config;
});