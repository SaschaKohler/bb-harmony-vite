import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import type {
  BachFlower,
  Emotion,
  FlowerRecommendation,
} from "../types/bachFlowerTypes";

interface EnhancedFlowerRecommendation extends FlowerRecommendation {
  matchSources: Array<{
    type: "emotion" | "symptom";
    term: string;
    score: number;
  }>;
}

export const useBachFlowerService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hole Blüten mit allen Verknüpfungen für die erweiterte Empfehlung
  const { data: flowersWithRelations = [] } = useQuery({
    queryKey: ["bach-flowers-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bach_flowers").select(`
          *,
          emotion:emotion (
            id,
            name,
            description
          ),
          flower_symptom_relations!inner (
            is_primary,
            symptom:symptoms (
              id,
              name,
              description,
              group:symptom_groups (
                name,
                emotion_category
              )
            )
          )
        `);

      if (error) throw error;
      return data;
    },
  });

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

  // Bestehende getRecommendations für Abwärtskompatibilität
  const getRecommendations = useCallback(
    async (selectedEmotionIds: string[]): Promise<FlowerRecommendation[]> => {
      setIsLoading(true);
      setError(null);

      try {
        const flowers = await Promise.all(
          selectedEmotionIds.map((id) => fetchFlowersByEmotion(id)),
        );

        const { data: emotions } = await supabase
          .from("emotion")
          .select("*")
          .in("id", selectedEmotionIds);

        const recommendations: FlowerRecommendation[] = flowers
          .flat()
          .map((flower) => ({
            flower,
            matchScore: 100,
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
  // Hilfsfunktion zum Berechnen der Empfehlungen
  const calculateRecommendations = (
    flowers: any[],
    emotionalStates: string[],
  ) => {
    return flowers
      .map((flower) => {
        const matchSources: Array<{
          type: "emotion" | "symptom";
          term: string;
          score: number;
        }> = [];
        let totalScore = 0;

        // Prüfe Emotion-Matches
        if (flower.emotion?.name) {
          emotionalStates.forEach((state) => {
            const emotionMatch =
              state.toLowerCase().includes(flower.emotion.name.toLowerCase()) ||
              flower.emotion.name.toLowerCase().includes(state.toLowerCase());

            if (emotionMatch) {
              totalScore += 100;
              matchSources.push({
                type: "emotion",
                term: state,
                score: 100,
              });
            }
          });
        }

        // Prüfe Symptom-Matches
        flower.flower_symptom_relations?.forEach((relation: any) => {
          const symptom = relation.symptom;
          if (symptom) {
            emotionalStates.forEach((state) => {
              const isMatch =
                state.toLowerCase().includes(symptom.name.toLowerCase()) ||
                symptom.name.toLowerCase().includes(state.toLowerCase()) ||
                (symptom.group?.emotion_category &&
                  state
                    .toLowerCase()
                    .includes(symptom.group.emotion_category.toLowerCase()));

              if (isMatch) {
                const score = relation.is_primary ? 80 : 50;
                totalScore += score;
                matchSources.push({
                  type: "symptom",
                  term: state,
                  score,
                });
              }
            });
          }
        });

        return {
          flower,
          matchScore: totalScore,
          matchSources,
        };
      })
      .filter((rec) => rec.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  };
  const getRecommendationsQuery = (emotionalStates: string[]) => ({
    queryKey: ["flower-recommendations", emotionalStates],
    enabled: emotionalStates.length > 0, // Nur ausführen wenn Emotionen vorhanden

    queryFn: async () => {
      // Wenn keine emotionalen Zustände, return leeres Array
      console.log("Fetching recommendations for:", emotionalStates); // Debug

      const { data: flowers, error } = await supabase.from("bach_flowers")
        .select(`
        *,
        emotion:emotion (
          id,
          name,
          description
        ),
        flower_symptom_relations!inner (
          is_primary,
          symptom:symptoms (
            id,
            name,
            description,
            group:symptom_groups (
              name,
              emotion_category
            )
          )
        )
      `);

      if (error) throw error;

      // Berechne Empfehlungen
      return calculateRecommendations(flowers, emotionalStates);
    },
  });
  // Neue Funktion für erweiterte Empfehlungen basierend auf Emotionen und Symptomen
  const getEnhancedRecommendations = useCallback(
    (emotionalStates: string[]): EnhancedFlowerRecommendation[] => {
      if (!emotionalStates?.length || !flowersWithRelations?.length) return [];

      const recommendations = flowersWithRelations.map((flower) => {
        const matchSources: EnhancedFlowerRecommendation["matchSources"] = [];
        let totalScore = 0;

        // Prüfe Emotion-Matches
        if (flower.emotion?.name) {
          emotionalStates.forEach((state) => {
            const emotionMatch =
              state.toLowerCase().includes(flower.emotion.name.toLowerCase()) ||
              flower.emotion.name.toLowerCase().includes(state.toLowerCase());

            if (emotionMatch) {
              totalScore += 100;
              matchSources.push({
                type: "emotion",
                term: state,
                score: 100,
              });
            }
          });
        }

        // Prüfe Symptom-Matches
        flower.flower_symptom_relations?.forEach((relation) => {
          const symptom = relation.symptom;
          if (symptom) {
            emotionalStates.forEach((state) => {
              const isMatch =
                state.toLowerCase().includes(symptom.name.toLowerCase()) ||
                symptom.name.toLowerCase().includes(state.toLowerCase()) ||
                (symptom.group?.emotion_category &&
                  state
                    .toLowerCase()
                    .includes(symptom.group.emotion_category.toLowerCase()));

              if (isMatch) {
                const score = relation.is_primary ? 80 : 50;
                totalScore += score;
                matchSources.push({
                  type: "symptom",
                  term: state,
                  score,
                });
              }
            });
          }
        });

        return {
          flower,
          matchScore: totalScore,
          matchSources,
          emotion: flower.emotion,
        };
      });

      return recommendations
        .filter((rec) => rec.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
    },
    [flowersWithRelations],
  );

  return {
    fetchEmotions,
    fetchFlowersByEmotion,
    getRecommendations,
    getEnhancedRecommendations,
    getRecommendationsQuery,
    isLoading,
    error,
  };
};
