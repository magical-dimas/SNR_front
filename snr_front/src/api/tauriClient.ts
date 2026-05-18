import { fetch, Body, type HttpVerb } from '@tauri-apps/api/http';

export interface TauriRequestOptions {
  method?: HttpVerb;
  body?: any;
  headers?: Record<string, string>;
}

export async function tauriFetch<T = any>(
  url: string,
  options: TauriRequestOptions = {}
): Promise<T> {
  const token = localStorage.getItem('jwt');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && token !== 'undefined' && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let tauriBody: Body | undefined = undefined;
  if (options.body) {
    tauriBody = Body.json(options.body);
  }

  const response = await fetch<T>(url, {
    method: options.method || 'GET',
    headers,
    body: tauriBody,
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.data;
}