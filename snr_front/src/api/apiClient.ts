import { Api } from './api';

export const apiClient = new Api({
  baseURL: 'https://10.46.79.236:52840',
});

apiClient.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  
  if (token && token !== 'undefined' && token !== 'null') {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  
  return config;
});