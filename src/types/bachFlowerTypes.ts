// types/bachFlowerTypes.ts
import { Database } from "./supabase";

export type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];
export type Emotion = Database["public"]["Tables"]["emotion"]["Row"];

// Frontend-spezifische Typen
export interface WizardStep {
  id: number;
  type: "emotion" | "flower_selection" | "summary";
  question: string;
  description?: string;
  emotions?: Emotion[];
  selectedEmotions?: string[]; // Emotion IDs
}

export interface WizardState {
  currentStep: number;
  steps: WizardStep[];
  selectedEmotions: Map<string, Emotion>;
  recommendedFlowers: BachFlower[];
}

export interface WizardAction {
  type:
    | "NEXT_STEP"
    | "PREVIOUS_STEP"
    | "SELECT_EMOTION"
    | "DESELECT_EMOTION"
    | "SET_RECOMMENDED_FLOWERS";
  payload?: any;
}
export interface RecommendedFlower {
  flower: {
    id: string;
    number: number;
    name_german: string | null;
    name_english: string;
    affirmation: string | null;
    description: string | null;
    emotion_id: string | null;
  };
  drops: number;
  reasoning: string;
}
// Für die Mock-Response
export interface MockResponse {
  content: string;
  flowers: RecommendedFlower[];
}
// API Response Types für Frontend
export interface FlowerRecommendation {
  flower: BachFlower;
  matchScore: number;
  emotion: Emotion;
}
