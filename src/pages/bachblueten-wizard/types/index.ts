import { Database } from "@/types/supabase";
import { EmotionGroupName } from "../components/emotions-auswahl";

export type DBEmotion = Database["public"]["Tables"]["emotion"]["Row"];
export type DBBachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

export type WizardSchritt =
  | "welcome"
  | "emotion-groups"
  | "symptoms"
  | "flower-preview"
  | "result";

export const WIZARD_STEPS: WizardSchritt[] = [
  "welcome",
  "emotion-groups",
  "symptoms",
  "result",
];

export const STEP_TITLES: Record<WizardSchritt, string> = {
  welcome: "Willkommen",
  "emotion-groups": "Gefühlsbereiche",
  symptoms: "Symptome",
  result: "Deine Empfehlung",
};
// Direkt aus der Datenbank

// Erweiterte Types für den Wizard
export interface WizardEmotion extends DBEmotion {
  selectedDescription?: string;
  intensity?: number;
}

export interface Symptom {
  id: string;
  bezeichnung: string;
  beschreibung: string;
  verwandteEmotionen: string[];
}

export interface WizardState {
  currentStep: WizardSchritt;
  selectedEmotionGroups: string[];
  selectedSymptoms: string[];
  selectedSecondarySymptoms: string[];
  selectedFlowers: string[]; // Neu
  symptomWeights: Record<string, number>;
  empfohleneBluten: string[];
  blutenCount: number;
}

export interface WizardContextType extends WizardState {
  nextStep: () => void;
  previousStep: () => void;
  selectEmotionGroup: (groupName: EmotionGroupName) => void;
  deselectEmotionGroup: (groupName: EmotionGroupName) => void;
  selectSymptom: (symptomId: string) => void;
  deselectSymptom: (symptomId: string) => void;
  selectFlower: (flowerId: string) => void;
  deselectFlower: (flowerId: string) => void;
  setSymptomWeight: (symptomId: string, weight: number) => void;
  resetWizard: () => void;
}
