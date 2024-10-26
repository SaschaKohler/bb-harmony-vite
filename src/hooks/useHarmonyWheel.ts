// src/hooks/useHarmonyWheel.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Database } from "../types/supabase";

// Typdefinitionen
type Emotion = Database["public"]["Tables"]["emotion"]["Row"];
type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

interface EmotionWithFlowers extends Emotion {
  bach_flowers: BachFlower[];
}

interface UseHarmonyWheelReturn {
  emotions: EmotionWithFlowers[];
  loading: boolean;
  error: string | null;
  selectedEmotion: EmotionWithFlowers | null;
  selectedFlower: BachFlower | null;
  selectEmotion: (emotion: EmotionWithFlowers | null) => void;
  selectFlower: (flower: BachFlower) => void;
  resetSelection: () => void;
  getBlossomData: (blossomId: string) => BachFlower | undefined;
}

export function useHarmonyWheel(): UseHarmonyWheelReturn {
  const [emotions, setEmotions] = useState<EmotionWithFlowers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionWithFlowers | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<BachFlower | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch emotions with their related bach flowers
        const { data, error: queryError } = await supabase
          .from("emotion")
          .select(
            `
            id,
            name,
            description,
            color,
            created_at,
            bach_flowers (
              id,
              name_english,
              name_german,
              name_latin,
              number,
              description,
              affirmation,
              color
            )
          `,
          )
          .order("name");

        if (queryError) throw queryError;
        console.log("Fetched emotions:", data);

        if (data) {
          // Typensicherheit für das zurückgegebene Datenformat
          const emotionsWithFlowers = data as EmotionWithFlowers[];

          // Sortiere Bach-Blüten nach Nummer
          emotionsWithFlowers.forEach((emotion) => {
            emotion.bach_flowers.sort((a, b) => {
              return (a.number || 0) - (b.number || 0);
            });
          });
          setEmotions(emotionsWithFlowers);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error
            ? e.message
            : "Ein unbekannter Fehler ist aufgetreten";
        setError(errorMessage);
        console.error("Error fetching harmony wheel data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getBlossomData = useCallback(
    (blossomId: string): BachFlower | undefined => {
      for (const emotion of emotions) {
        const flower = emotion.bach_flowers.find((f) => f.id === blossomId);

        if (flower) {
          return {
            ...flower,
            emotion_name: emotion.name,
          };
        }
      }
      return undefined;
    },
    [emotions],
  );

  const selectEmotion = (emotion: EmotionWithFlowers | null) => {
    console.log("selectEmotion called with:", emotion); // Debug log

    setSelectedEmotion(emotion);
    setSelectedFlower(null); // Reset flower selection when changing emotion
  };

  const selectFlower = (flower: BachFlower) => {
    setSelectedFlower(flower);
  };

  const resetSelection = () => {
    setSelectedEmotion(null);
    setSelectedFlower(null);
  };

  return {
    emotions,
    loading,
    error,
    selectedEmotion,
    selectedFlower,
    selectEmotion,
    selectFlower,
    resetSelection,
    getBlossomData,
  };
}

// src/components/HarmonyWheel/types.ts
export interface WheelSegmentProps {
  emotion: EmotionWithFlowers;
  rotation: number;
  isSelected: boolean;
  onSelect: (emotion: EmotionWithFlowers) => void;
}

export interface FlowerListProps {
  flowers: BachFlower[];
  selectedFlower: BachFlower | null;
  onSelectFlower: (flower: BachFlower) => void;
}

export interface FlowerCardProps {
  flower: BachFlower;
  isSelected: boolean;
  onSelect: (flower: BachFlower) => void;
}

export interface DetailViewProps {
  emotion: EmotionWithFlowers;
  selectedFlower: BachFlower | null;
  onSelectFlower: (flower: BachFlower) => void;
  onClose: () => void;
}
