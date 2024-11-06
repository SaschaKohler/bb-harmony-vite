import { createContext, useReducer, ReactNode } from "react";
import { EmotionGroupName, EMOTION_GROUPS } from "../constants/emotion-groups";

import { WizardContextType, WizardState, WizardSchritt } from "../types";

const initialState: WizardState = {
  currentStep: "welcome",
  selectedEmotionGroups: [], // Neue Property
  selectedSymptoms: [],
  selectedFlowers: [], // Neu
  selectedSecondarySymptoms: [],
  symptomWeights: {},
};

type WizardAction =
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "SELECT_EMOTION_GROUP"; groupName: EmotionGroupName }
  | { type: "DESELECT_EMOTION_GROUP"; groupName: EmotionGroupName }
  | { type: "SELECT_SYMPTOM"; symptomId: string }
  | { type: "DESELECT_SYMPTOM"; symptomId: string }
  | { type: "SELECT_FLOWER"; flowerId: string } // Neu
  | { type: "DESELECT_FLOWER"; flowerId: string } // Neu
  | { type: "SET_SYMPTOM_WEIGHT"; symptomId: string; weight: number }
  | { type: "RESET" };

const NEXT_STEPS: Record<WizardSchritt, WizardSchritt> = {
  welcome: "emotion-groups",
  "emotion-groups": "symptoms",
  symptoms: "flower-preview",
  "flower-preview": "result",
  result: "result",
};

const PREVIOUS_STEPS: Record<WizardSchritt, WizardSchritt> = {
  welcome: "welcome",
  "emotion-groups": "welcome",
  symptoms: "emotion-groups",
  "flower-preview": "symptoms", // Hier fehlte der flower-preview Schritt
  result: "flower-preview",
};

// Im Reducer dann einfach verwenden
const wizardReducer = (
  state: WizardState,
  action: WizardAction,
): WizardState => {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: NEXT_STEPS[state.currentStep],
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: PREVIOUS_STEPS[state.currentStep],
      };

    case "SELECT_EMOTION_GROUP":
      return {
        ...state,
        selectedEmotionGroups: [
          ...state.selectedEmotionGroups,
          action.groupName,
        ],
      };

    case "DESELECT_EMOTION_GROUP":
      return {
        ...state,
        selectedEmotionGroups: state.selectedEmotionGroups.filter(
          (name) => name !== action.groupName,
        ),
      };

    case "SELECT_SYMPTOM":
      return {
        ...state,
        selectedSymptoms: [...state.selectedSymptoms, action.symptomId],
        symptomWeights: {
          ...state.symptomWeights,
          [action.symptomId]: 1,
        },
      };

    case "DESELECT_SYMPTOM": {
      const { [action.symptomId]: _, ...restWeights } = state.symptomWeights;
      return {
        ...state,
        selectedSymptoms: state.selectedSymptoms.filter(
          (id) => id !== action.symptomId,
        ),
        symptomWeights: restWeights,
      };
    }
    case "SELECT_FLOWER":
      if (state.selectedFlowers.length >= 7) return state;
      return {
        ...state,
        selectedFlowers: [...state.selectedFlowers, action.flowerId],
      };

    case "DESELECT_FLOWER":
      return {
        ...state,
        selectedFlowers: state.selectedFlowers.filter(
          (id) => id !== action.flowerId,
        ),
      };
    case "SET_SYMPTOM_WEIGHT":
      return {
        ...state,
        symptomWeights: {
          ...state.symptomWeights,
          [action.symptomId]: action.weight,
        },
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const WizardContext = createContext<WizardContextType | undefined>(
  undefined,
);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const value: WizardContextType = {
    ...state,
    nextStep: () => dispatch({ type: "NEXT_STEP" }),
    previousStep: () => dispatch({ type: "PREVIOUS_STEP" }),
    selectEmotionGroup: (groupName) =>
      dispatch({ type: "SELECT_EMOTION_GROUP", groupName }),
    deselectEmotionGroup: (groupName) =>
      dispatch({ type: "DESELECT_EMOTION_GROUP", groupName }),
    selectSymptom: (symptomId) =>
      dispatch({ type: "SELECT_SYMPTOM", symptomId }),
    deselectSymptom: (symptomId) =>
      dispatch({ type: "DESELECT_SYMPTOM", symptomId }),
    selectFlower: (
      flowerId, // Diese Zeile fehlte
    ) => dispatch({ type: "SELECT_FLOWER", flowerId }),
    deselectFlower: (
      flowerId, // Diese Zeile fehlte
    ) => dispatch({ type: "DESELECT_FLOWER", flowerId }),
    setSymptomWeight: (symptomId, weight) =>
      dispatch({ type: "SET_SYMPTOM_WEIGHT", symptomId, weight }),
    resetWizard: () => dispatch({ type: "RESET" }),
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}
