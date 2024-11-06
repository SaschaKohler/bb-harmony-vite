import { Database } from "@/types/supabase";

export type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];
export type Symptom = Database["public"]["Tables"]["symptoms"]["Row"];

export interface WeightedSymptom {
  symptom: Symptom;
  weight: number;
}

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
