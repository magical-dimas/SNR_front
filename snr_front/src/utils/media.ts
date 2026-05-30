const IMG_BASE_URL = 'https://10.46.79.236:52840';

export function resolveMediaUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '';
  
  // Если URL уже полный (http/https), проверяем протокол
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    // В dev-режиме с mkcert заменяем http на относительный путь
    if (import.meta.env.DEV) {
      // Извлекаем путь после домена:порт
      try {
        const url = new URL(rawUrl);
        return url.pathname; // Вернёт /reactorservice/ritm.jpg
      } catch {
        return rawUrl;
      }
    }
    return rawUrl;
  }
  
  // Для относительных путей
  const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${IMG_BASE_URL}${normalizedPath}`;
}