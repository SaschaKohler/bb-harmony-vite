import type {
  BachFlower,
  Symptom,
  ScoringParameters,
  SuggestionResult,
  WeightedSymptom,
} from "@/types/bachblueten";

export function calculateFlowerScores(
  bachFlowers: BachFlower[],
  symptoms: Symptom[],
  selectedEmotionGroups: string[],
  selectedSymptoms: string[],
  parameters?: ScoringParameters,
): SuggestionResult {
  const {
    primaryWeight = 3.0,
    secondaryWeight = 0.6,
    emotionalGroupWeight = 2.0,
    coverageWeight = 1.0,
  } = parameters || {};

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

  const scoredFlowers = bachFlowers.map((flower) => {
    // Primäre Symptome
    const primaryMatches = flower.flower_symptom_relations
      .filter(
        (rel) => rel.is_primary && selectedSymptoms.includes(rel.symptom_id),
      )
      .map((rel) => symptoms.find((s) => s.id === rel.symptom_id))
      .filter((s): s is Symptom => s !== undefined);

    // Sekundäre Symptome
    const secondaryMatches = flower.flower_symptom_relations
      .filter(
        (rel) => !rel.is_primary && selectedSymptoms.includes(rel.symptom_id),
      )
      .map((rel) => {
        const symptom = symptoms.find((s) => s.id === rel.symptom_id);
        if (!symptom) return null;
        return {
          symptom,
          weight: secondaryWeight, // Verwende den Parameter
        };
      })
      .filter((match): match is WeightedSymptom => match !== null);

    // Score-Berechnung
    const primarySymptomScore = primaryMatches.length * primaryWeight;
    const secondarySymptomScore = secondaryMatches.reduce(
      (sum, { weight }) => sum + weight,
      0,
    );

    // Emotionale Gruppen
    const matchedEmotionGroups = new Set([
      ...primaryMatches.map((s) => s.emotion_category),
      ...secondaryMatches.map((m) => m.symptom.emotion_category),
    ]);

    const emotionalGroupScore =
      Array.from(matchedEmotionGroups).filter((group) =>
        selectedEmotionGroups.includes(group),
      ).length * emotionalGroupWeight;

    const symptomGroupCoverage = matchedEmotionGroups.size * coverageWeight;

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

  // Gruppierung nach Score
  const priorityGroups = {
    highPriority: scoredFlowers.filter(
      (f) => f.scores.total >= 8 && f.scores.primarySymptomMatch > 0,
    ),
    mediumPriority: scoredFlowers.filter(
      (f) => f.scores.total >= 5 && f.scores.total < 8,
    ),
    additionalOptions: scoredFlowers.filter((f) => f.scores.total < 5),
  };

  return {
    priorityGroups,
    statistics: {
      totalMatches: scoredFlowers.length,
      averageScore: scoredFlowers.length
        ? scoredFlowers.reduce((sum, f) => sum + f.scores.total, 0) /
          scoredFlowers.length
        : 0,
      coveragePerGroup: Object.fromEntries(
        selectedEmotionGroups.map((group) => [
          group,
          scoredFlowers.filter(
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
    },
  };
}
