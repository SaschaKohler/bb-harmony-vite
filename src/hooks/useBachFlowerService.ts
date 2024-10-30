// hooks/useBachFlowerService.ts
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
  BachFlower,
  Emotion,
  FlowerRecommendation,
} from "../types/bachFlowerTypes";

export const useBachFlowerService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmotions = useCallback(async (): Promise<Emotion[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("emotion")
        .select("*")
        .order("name");

      if (error) throw error;

      return data || [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Fehler beim Laden der Emotionen";
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFlowersByEmotion = useCallback(
    async (emotionId: string): Promise<BachFlower[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("bach_flowers")
          .select("*")
          .eq("emotion_id", emotionId);

        if (error) throw error;

        return data || [];
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Fehler beim Laden der Bachblüten";
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getRecommendations = useCallback(
    async (selectedEmotionIds: string[]): Promise<FlowerRecommendation[]> => {
      setIsLoading(true);
      setError(null);

      try {
        // Hole alle Blüten für die ausgewählten Emotionen
        const flowers = await Promise.all(
          selectedEmotionIds.map((id) => fetchFlowersByEmotion(id)),
        );

        // Hole die zugehörigen Emotionen
        const { data: emotions } = await supabase
          .from("emotion")
          .select("*")
          .in("id", selectedEmotionIds);

        // Kombiniere die Ergebnisse zu Empfehlungen
        const recommendations: FlowerRecommendation[] = flowers
          .flat()
          .map((flower) => ({
            flower,
            matchScore: 100, // Hier könnte später eine komplexere Scoring-Logik implementiert werden
            emotion: emotions?.find(
              (e) => e.id === flower.emotion_id,
            ) as Emotion,
          }));

        return recommendations;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Fehler bei den Empfehlungen";
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFlowersByEmotion],
  );

  return {
    fetchEmotions,
    fetchFlowersByEmotion,
    getRecommendations,
    isLoading,
    error,
  };
};
