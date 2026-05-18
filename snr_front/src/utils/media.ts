const IMG_BASE_URL = 'http://10.46.79.236:9000';

/**
 * Преобразует сырой URL от бэкенда в рабочий адрес.
 * Убирает localhost:9000 и подставляет адрес из .env
 */
export function resolveMediaUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '';
  
  const cleanUrl = rawUrl.replace(/^http?:\/\/localhost:9000(?=\/|$)/, '');
  
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  
  const normalizedPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${IMG_BASE_URL}${normalizedPath}`;
}