export type WizardSchritt =
  | "welcome"
  | "emotion-groups"
  | "symptoms"
  | "flower-preview"
  | "result";

export interface WizardState {
  currentStep: WizardSchritt;
  selectedEmotionGroups: string[];
  selectedSymptoms: string[];
  selectedSecondarySymptoms: string[];
  selectedFlowers: string[];
  symptomWeights: Record<string, number>;
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
