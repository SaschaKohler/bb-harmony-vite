import { useMemo } from "react";
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"] & {
  flower_symptom_relations: Array<{
    symptom_id: string;
    is_primary: boolean;
  }>;
};

type Symptom = Database["public"]["Tables"]["symptoms"]["Row"] & {
  emotion_category: string;
};

interface FlowerScore {
  flower: BachFlower;
  scores: {
    primarySymptomMatch: number;
    emotionalGroupMatch: number;
    symptomGroupCoverage: number;
    total: number;
  };
  matchedSymptoms: Symptom[];
}

export function useFlowerSuggestions(
  bachFlowers: BachFlower[],
  symptoms: Symptom[],
  selectedEmotionGroups: string[],
  selectedSymptoms: string[],
) {
  return useMemo(() => {
    if (!selectedSymptoms.length || !bachFlowers?.length || !symptoms?.length) {
      return [];
    }

    const scoredFlowers: FlowerScore[] = bachFlowers.map((flower) => {
      // 1. Primäre Symptom-Übereinstimmung (Gewichtung: 3)
      const primaryMatches = flower.flower_symptom_relations.filter(
        (rel) => rel.is_primary && selectedSymptoms.includes(rel.symptom_id),
      );
      const primarySymptomScore = primaryMatches.length * 3;

      // 2. Emotionale Gruppen-Übereinstimmung (Gewichtung: 2)
      const matchedSymptoms = symptoms.filter(
        (symptom) =>
          selectedSymptoms.includes(symptom.id) &&
          selectedEmotionGroups.includes(symptom.emotion_category),
      );
      const emotionalGroupScore = matchedSymptoms.length * 2;

      // 3. Abdeckung verschiedener Symptomgruppen (Gewichtung: 1)
      const uniqueSymptomGroups = new Set(
        matchedSymptoms.map((s) => s.emotion_category),
      );
      const symptomGroupCoverageScore = uniqueSymptomGroups.size;

      // Gesamtpunktzahl berechnen
      const totalScore =
        primarySymptomScore + emotionalGroupScore + symptomGroupCoverageScore;

      return {
        flower,
        scores: {
          primarySymptomMatch: primarySymptomScore,
          emotionalGroupMatch: emotionalGroupScore,
          symptomGroupCoverage: symptomGroupCoverageScore,
          total: totalScore,
        },
        matchedSymptoms,
      };
    });

    // Sortiere und filtere die Blüten
    const suggestedFlowers = scoredFlowers
      .filter(({ scores }) => scores.total > 0)
      .sort((a, b) => {
        // Primär nach Gesamtpunktzahl
        if (b.scores.total !== a.scores.total) {
          return b.scores.total - a.scores.total;
        }

        // Sekundär nach Abdeckung der Symptomgruppen
        if (b.scores.symptomGroupCoverage !== a.scores.symptomGroupCoverage) {
          return b.scores.symptomGroupCoverage - a.scores.symptomGroupCoverage;
        }

        // Tertiär nach primären Symptom-Matches
        return b.scores.primarySymptomMatch - a.scores.primarySymptomMatch;
      })
      .slice(0, 12); // Maximal 12 Vorschläge

    // Gruppiere die Vorschläge in Prioritätsstufen
    const priorityGroups = {
      highPriority: suggestedFlowers
        .filter((f) => f.scores.total >= 8)
        .slice(0, 5),
      mediumPriority: suggestedFlowers.filter(
        (f) => f.scores.total >= 5 && f.scores.total < 8,
      ),
      additionalOptions: suggestedFlowers.filter((f) => f.scores.total < 5),
    };

    return {
      allSuggestions: suggestedFlowers,
      priorityGroups,
      statistics: {
        totalMatches: suggestedFlowers.length,
        averageScore:
          suggestedFlowers.reduce((acc, f) => acc + f.scores.total, 0) /
          suggestedFlowers.length,
        coveragePerGroup: Object.fromEntries(
          selectedEmotionGroups.map((group) => [
            group,
            suggestedFlowers.filter((f) =>
              f.matchedSymptoms.some((s) => s.emotion_category === group),
            ).length,
          ]),
        ),
      },
    };
  }, [bachFlowers, symptoms, selectedEmotionGroups, selectedSymptoms]);
}
