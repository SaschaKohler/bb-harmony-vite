export interface BachFlower {
  id: string;
  name_german: string;
  name_latin: string | null;
  name_english: string;
  affirmation: string | null;
  color: string | null;
  description: string | null;
  emotion_id: string | null;
  number: number | null;
  flower_symptom_relations: FlowerSymptomRelation[];
}

export interface FlowerSymptomRelation {
  symptom_id: string;
  is_primary: boolean;
  flower_id: string;
}
