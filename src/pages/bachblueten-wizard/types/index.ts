import { Database } from "@/types/supabase";

export type WizardSchritt = "welcome" | "emotions" | "symptoms" | "result";

// Direkt aus der Datenbank
export type DBEmotion = Database["public"]["Tables"]["emotion"]["Row"];
export type DBBachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

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
  selectedEmotions: string[];
  emotionIntensities: Record<string, number>;
  selectedSymptoms: string[];
  empfohleneBluten: string[];
}

export interface WizardContextType extends WizardState {
  nextStep: () => void;
  previousStep: () => void;
  selectEmotion: (emotionId: string) => void;
  deselectEmotion: (emotionId: string) => void;
  selectSymptom: (symptomId: string) => void;
  deselectSymptom: (symptomId: string) => void;
  setEmotionIntensity: (emotionId: string, intensity: number) => void; // Neue Funktion
  resetWizard: () => void;
}
