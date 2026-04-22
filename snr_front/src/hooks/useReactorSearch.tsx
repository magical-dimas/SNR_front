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
        setReady(true);
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
        }
      })();

      await initPromise;
      setReady(true);
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
        // if (item.description == ""){
        if (item.photo_url == ""){
          continue
        }
        // const textInputs = tokenizer(item.description, { padding: true, truncation: true });
        // const textOut = await textModel(textInputs);
        // const textEmbedding = Array.from(textOut.text_embeds.data as Float32Array);
        const item_image = await RawImage.read(item.photo_url);
        const item_imageInputs = await processor(item_image);
        const item_imageOut = await visionModel(item_imageInputs);
        const item_imageEmbedding = Array.from(item_imageOut.image_embeds.data as Float32Array);

        let dotProduct = 0, normA = 0, normB = 0;
        for (let i = 0; i < imageEmbedding.length; i++) {
          dotProduct += imageEmbedding[i] * item_imageEmbedding[i];
          normA += imageEmbedding[i] * imageEmbedding[i];
          normB += item_imageEmbedding[i] * item_imageEmbedding[i];
        }
        const score = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        scoredItems.push({ ...item, score });
      }

      const THRESHOLD = 0.55;
      const TOP_K = 2;

      const filteredAndSorted = scoredItems
        .filter(item => item.score >= THRESHOLD)
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K);

      console.log("Результаты поиска CLIP по картинке:");
      if (filteredAndSorted.length === 0) {
        console.log("Ничего не найдено");
      } else {
        filteredAndSorted.forEach((item, index) => {
          const percentage = (item.score * 100).toFixed(1);
          console.log(`${index + 1}. ${item.name} | Совпадение: ${percentage}% | (Score: ${item.score.toFixed(4)})`);
        });
      }

      setItems(filteredAndSorted.map(({ score, ...item }) => item));
    } catch (error) {
      console.error("Ошибка при поиске по изображению:", error);
    }
  }, [initialData]);

  const resetSearch = useCallback(() => {
    setItems(initialData);
  }, [initialData]);

  return { items, ready, searchByImage, resetSearch };
}