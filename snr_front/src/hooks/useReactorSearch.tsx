import { useState, useEffect, useCallback } from 'react';
import type { ReactorRange } from '../modules/mock';

export function useReactorSearch(initialData: ReactorRange[]) {
  const [items, setItems] = useState<ReactorRange[]>(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const searchByImage = useCallback(async (_imageUrl: string) => {
    console.warn("Поиск по картинке недоступен в этой версии");
  }, []);

  const resetSearch = useCallback(() => {
    setItems(initialData);
  }, [initialData]);

  return { 
    items, 
    ready: true,
    searchByImage, 
    resetSearch 
  };
}