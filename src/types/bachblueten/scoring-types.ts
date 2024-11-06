export interface FlowerScore {
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

export interface SuggestionResult {
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

export interface ScoringParameters {
  primaryWeight: number;
  secondaryWeight: number;
  emotionalGroupWeight: number;
  coverageWeight: number;
}
