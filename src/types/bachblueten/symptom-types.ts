export interface Symptom {
  id: string;
  name: string;
  description: string | null;
  group_id: string | null;
  emotion_category: string;
  indication_type: string;
  secondary_symptoms?: SecondarySymptom[];
}

export interface SecondarySymptom {
  id: string;
  primary_symptom_id: string;
  weight: number;
  name: string;
  description?: string;
}

export interface WeightedSymptom {
  symptom: Symptom;
  weight: number;
}
