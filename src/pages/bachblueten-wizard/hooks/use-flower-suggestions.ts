import { useCallback, useMemo } from "react";
import { Database } from "@/types/supabase";

// export type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];
// export type Symptom = Database["public"]["Tables"]["symptoms"]["Row"];
// import {
//   FlowerScore,
//   SuggestionResult,
//   WeightedSymptom,
// } from "../types/flower-suggestions";
// Typen
interface WeightedSymptom {
  symptom: Symptom;
  weight: number;
}
interface BachFlowerRelation {
  flower_id: string;
  symptom_id: string;
  is_primary: boolean;
}

interface BachFlower {
  id: string;
  name_german: string;
  name_latin: string | null;
  name_english: string;
  affirmation: string | null;
  color: string | null;
  created_at: string | null;
  description: string | null;
  emotion_id: string | null;
  number: number | null;
  updated_at: string | null;
  flower_symptom_relations: BachFlowerRelation[];
}

interface SecondarySymptomDefinition {
  id: string;
  primary_symptom_id: string;
  weight: number;
  name: string;
  description?: string;
}

interface Symptom {
  id: string;
  name: string;
  description: string | null;
  group_id: string | null;
  emotion_category: string;
  indication_type: string;
  secondary_symptoms?: SecondarySymptomDefinition[];
}
interface FlowerScore {
  flower: BachFlower;
  scores: {
    primarySymptomMatch: number;
    secondarySymptomMatch: number;
    emotionalGroupMatch: number;
    symptomGroupCoverage: number;
    total: number;
  };
  matchedSymptoms: {
    primary: Symptom[];
    secondary: WeightedSymptom[];
  };
}

interface SuggestionResult {
  priorityGroups: {
    highPriority: FlowerScore[];
    mediumPriority: FlowerScore[];
    additionalOptions: FlowerScore[];
  };
  statistics: {
    totalMatches: number;
    averageScore: number;
    coveragePerGroup: Record<string, number>;
  };
}

export function useFlowerSuggestions(
  bachFlowers: BachFlower[],
  symptoms: Symptom[],
  selectedEmotionGroups: string[],
  selectedSymptoms: string[],
): SuggestionResult {
  const calculateScores = useCallback(() => {
    // Return empty result if data is missing
    if (!bachFlowers?.length || !symptoms?.length || !selectedSymptoms.length) {
      return {
        priorityGroups: {
          highPriority: [],
          mediumPriority: [],
          additionalOptions: [],
        },
        statistics: {
          totalMatches: 0,
          averageScore: 0,
          coveragePerGroup: {},
        },
      };
    }

    // Score alle Blüten
    const scoredFlowers: FlowerScore[] = bachFlowers.map((flower) => {
      // Finde primäre Symptom-Matches
      const primaryMatches = flower.flower_symptom_relations
        .filter(
          (
            rel: BachFlowerRelation,
          ): rel is BachFlowerRelation & { is_primary: true } =>
            rel.is_primary && selectedSymptoms.includes(rel.symptom_id),
        )
        .map((rel) => symptoms.find((s) => s.id === rel.symptom_id))
        .filter((s): s is Symptom => s !== undefined);

      // Finde sekundäre Symptom-Matches mit Gewichtungen
      const secondaryMatches = flower.flower_symptom_relations
        .filter(
          (
            rel: BachFlowerRelation,
          ): rel is BachFlowerRelation & { is_primary: false } =>
            !rel.is_primary && selectedSymptoms.includes(rel.symptom_id),
        )
        .map((rel) => {
          const symptom = symptoms.find((s) => s.id === rel.symptom_id);
          if (!symptom) return null;

          const secondarySymptom = symptom.secondary_symptoms?.find(
            (ss) => ss.primary_symptom_id === symptom.id,
          );

          return {
            symptom,
            weight: secondarySymptom?.weight ?? 0.6,
          };
        })
        .filter((match): match is WeightedSymptom => match !== null);

      // Berechne Scores
      const primarySymptomScore = primaryMatches.length * 3.0;

      const secondarySymptomScore = secondaryMatches.reduce(
        (sum, { weight }) => sum + weight,
        0,
      );

      // Berechne emotionale Gruppen-Übereinstimmung
      const matchedEmotionGroups = new Set([
        ...primaryMatches.map((s) => s.emotion_category),
        ...secondaryMatches.map((m) => m.symptom.emotion_category),
      ]);

      const emotionalGroupMatch = Array.from(matchedEmotionGroups).filter(
        (group) => selectedEmotionGroups.includes(group),
      ).length;

      const emotionalGroupScore = emotionalGroupMatch * 2.0;

      // Berechne Symptomgruppen-Abdeckung
      const symptomGroupCoverage = matchedEmotionGroups.size;

      // Berechne Gesamtscore
      const totalScore =
        primarySymptomScore +
        secondarySymptomScore +
        emotionalGroupScore +
        symptomGroupCoverage;

      return {
        flower,
        scores: {
          primarySymptomMatch: primarySymptomScore,
          secondarySymptomMatch: secondarySymptomScore,
          emotionalGroupMatch: emotionalGroupScore,
          symptomGroupCoverage,
          total: totalScore,
        },
        matchedSymptoms: {
          primary: primaryMatches,
          secondary: secondaryMatches,
        },
      };
    });

    // Sortiere und filtere die Blüten
    const sortedFlowers = scoredFlowers
      .filter((f) => f.scores.total > 0)
      .sort((a, b) => {
        // Primär nach Gesamtscore
        if (b.scores.total !== a.scores.total) {
          return b.scores.total - a.scores.total;
        }
        // Sekundär nach primären Symptomen
        if (b.scores.primarySymptomMatch !== a.scores.primarySymptomMatch) {
          return b.scores.primarySymptomMatch - a.scores.primarySymptomMatch;
        }
        // Tertiär nach gewichteten sekundären Symptomen
        return b.scores.secondarySymptomMatch - a.scores.secondarySymptomMatch;
      });

    // Gruppiere die Blüten nach Priorität
    const priorityGroups = {
      highPriority: sortedFlowers.filter(
        (f) => f.scores.total >= 8 && f.scores.primarySymptomMatch > 0,
      ),
      mediumPriority: sortedFlowers.filter(
        (f) => f.scores.total >= 5 && f.scores.total < 8,
      ),
      additionalOptions: sortedFlowers.filter((f) => f.scores.total < 5),
    };

    // Berechne Statistiken
    const statistics = {
      totalMatches: sortedFlowers.length,
      averageScore: sortedFlowers.length
        ? sortedFlowers.reduce((sum, f) => sum + f.scores.total, 0) /
          sortedFlowers.length
        : 0,
      coveragePerGroup: Object.fromEntries(
        selectedEmotionGroups.map((group) => [
          group,
          sortedFlowers.filter(
            (f) =>
              f.matchedSymptoms.primary.some(
                (s) => s.emotion_category === group,
              ) ||
              f.matchedSymptoms.secondary.some(
                (m) => m.symptom.emotion_category === group,
              ),
          ).length,
        ]),
      ),
    };

    return {
      priorityGroups,
      statistics,
    };
  }, [bachFlowers, symptoms, selectedEmotionGroups, selectedSymptoms]);

  return calculateScores();
}

export type { FlowerScore, WeightedSymptom, SuggestionResult };
