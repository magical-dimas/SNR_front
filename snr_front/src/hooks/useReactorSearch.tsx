import { useState, useEffect, useCallback } from 'react';
import { 
  env, 
  AutoTokenizer, 
  AutoProcessor, 
  CLIPTextModelWithProjection, 
  CLIPVisionModelWithProjection,
  RawImage 
} from '@xenova/transformers';
import type { ReactorRange } from '../modules/mock';

env.allowLocalModels = false;

let globalModels: any = null;
let initPromise: Promise<void> | null = null;

export function useReactorSearch(initialData: ReactorRange[]) {
  const [items, setItems] = useState<ReactorRange[]>(initialData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  useEffect(() => {
    const initModels = async () => {
      if (globalModels) {
        setReady(true);
        return;
      }

      if (initPromise) {
        await initPromise;
        if (globalModels) setReady(true);
        return;
      }

      initPromise = (async () => {
        try {
          const MODEL_ID = 'Xenova/clip-vit-base-patch32';
          const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
          const processor = await AutoProcessor.from_pretrained(MODEL_ID);
          
          const textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID, {});
          const visionModel = await CLIPVisionModelWithProjection.from_pretrained(MODEL_ID, {});
          
          globalModels = { tokenizer, processor, textModel, visionModel };
          console.log("Все модели успешно загружены в память!");
        } catch (error) {
          console.error("Ошибка инициализации CLIP:", error);
          initPromise = null; 
        }
      })();

      await initPromise;
      if (globalModels) {
        setReady(true);
      }
    };

    initModels();
  }, []);

  const searchByImage = useCallback(async (imageUrl: string) => {
    if (!globalModels || initialData.length === 0) return;

    try {
      const { tokenizer, processor, textModel, visionModel } = globalModels;

      console.log("Начинаем анализ изображения...");
      const image = await RawImage.read(imageUrl);
      const imageInputs = await processor(image);
      const imageOut = await visionModel(imageInputs);
      const imageEmbedding = Array.from(imageOut.image_embeds.data as Float32Array);

      console.log("Сравниваем с услугами...");
      const scoredItems = [];

      for (const item of initialData) {
        if (item.short_desc == ""){
          continue
        }
        const textInputs = tokenizer(item.short_desc, { padding: true, truncation: true });
        const textOut = await textModel(textInputs);
        const textEmbedding = Array.from(textOut.text_embeds.data as Float32Array);

        let dotProduct = 0, normA = 0, normB = 0;
        for (let i = 0; i < imageEmbedding.length; i++) {
          dotProduct += imageEmbedding[i] * textEmbedding[i];
          normA += imageEmbedding[i] * imageEmbedding[i];
          normB += textEmbedding[i] * textEmbedding[i];
        }
        const score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        item.similarity_score = Math.round(10000*score)/100;
        scoredItems.push({ ...item, score });
      }

      const THRESHOLD = 0.25;

      const filteredAndSorted = scoredItems
        .filter(item => item.score >= THRESHOLD)
        .sort((a, b) => b.score - a.score);

      setItems(filteredAndSorted.map(({ score, ...item }) => item));
    } catch (error) {
      console.error("Ошибка при поиске по изображению:", error);
    }
  }, [initialData]);

  const resetSearch = useCallback(() => {
    for (const item of initialData) {
        item.similarity_score = null;
      }
    setItems(initialData);
  }, [initialData]);

  return { items, ready, searchByImage, resetSearch };
}