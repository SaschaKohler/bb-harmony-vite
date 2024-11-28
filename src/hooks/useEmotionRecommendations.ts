import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Emotion } from "@/types/bachFlowerTypes";

interface Symptom {
  id: string;
  name: string;
  description: string | null;
  indication_type: string;
  group_id: string | null;
  group?: {
    name: string;
    emotion_category: string;
  } | null;
}

interface EmotionalSuggestion {
  id: string;
  name: string;
  description: string | null;
  type: "emotion" | "symptom";
  category?: string;
  groupName?: string;
}

interface UseEmotionRecommendationsProps {
  searchTerm?: string;
  excludeTerms?: string[];
  maxSuggestions?: number;
}

export function useEmotionRecommendations({
  searchTerm = "",
  excludeTerms = [],
  maxSuggestions = 5,
}: UseEmotionRecommendationsProps = {}) {
  // Hole alle Emotionen mit React Query für Caching
  const { data: emotions = [], isLoading: emotionsLoading } = useQuery({
    queryKey: ["emotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emotion")
        .select(
          `
          id,
          name,
          description,
          color
        `,
        )
        .order("name");

      if (error) throw error;
      return data as Emotion[];
    },
  });

  // Hole alle Symptome mit ihren Gruppen
  const { data: symptoms = [], isLoading: symptomsLoading } = useQuery({
    queryKey: ["symptoms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptoms")
        .select(
          `
          id,
          name,
          description,
          indication_type,
          group_id,
          group:symptom_groups (
            name,
            emotion_category
          )
        `,
        )
        .order("name");

      if (error) throw error;
      return data as Symptom[];
    },
  });

  // Kombiniere und verarbeite die Vorschläge
  const getSuggestions = (searchValue: string): EmotionalSuggestion[] => {
    if (!searchValue.trim()) return [];

    const searchLower = searchValue.toLowerCase();
    const allSuggestions: EmotionalSuggestion[] = [
      // Konvertiere Emotionen zu Vorschlägen
      ...emotions.map((emotion) => ({
        id: emotion.id,
        name: emotion.name || "",
        description: emotion.description,
        type: "emotion" as const,
      })),
      // Konvertiere Symptome zu Vorschlägen
      ...symptoms.map((symptom) => ({
        id: symptom.id,
        name: symptom.name,
        description: symptom.description,
        type: "symptom" as const,
        category: symptom.group?.emotion_category,
        groupName: symptom.group?.name,
      })),
    ];

    return allSuggestions
      .filter((suggestion) => {
        if (excludeTerms.includes(suggestion.name)) return false;

        const nameLower = suggestion.name.toLowerCase();
        const descriptionLower = suggestion.description?.toLowerCase() || "";

        // Verschiedene Match-Kriterien
        const exactMatch = nameLower === searchLower;
        const nameStartsWith = nameLower.startsWith(searchLower);
        const nameIncludes = nameLower.includes(searchLower);
        const descriptionIncludes = descriptionLower.includes(searchLower);
        const similarityScore = getLevenshteinDistance(searchLower, nameLower);

        return (
          exactMatch ||
          nameStartsWith ||
          nameIncludes ||
          (descriptionIncludes && similarityScore <= 3)
        );
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        // Priorisiere exakte Matches
        if (aName === searchLower) return -1;
        if (bName === searchLower) return 1;

        // Dann Begriffe die mit dem Suchbegriff beginnen
        const aStartsWith = aName.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Dann nach Levenshtein-Distanz
        return (
          getLevenshteinDistance(searchLower, aName) -
          getLevenshteinDistance(searchLower, bName)
        );
      })
      .slice(0, maxSuggestions);
  };

  const suggestions = searchTerm ? getSuggestions(searchTerm) : [];
  const isLoading = emotionsLoading || symptomsLoading;

  return {
    suggestions,
    isLoading,
  };
}

// Hilfsfunktion zur Berechnung der Levenshtein-Distanz
function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost,
      );
    }
  }

  return matrix[b.length][a.length];
}
