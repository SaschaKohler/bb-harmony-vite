import { createContext, useReducer, ReactNode } from "react";
import {
  EmotionGroupName,
  EMOTION_GROUPS,
} from "../components/emotions-auswahl";

import {
  WizardContextType,
  WizardState,
  WizardSchritt,
  DBBachFlower,
} from "../types";

const initialState: WizardState = {
  currentStep: "welcome",
  selectedEmotionGroups: [], // Neue Property
  selectedSymptoms: [],
  selectedFlowers: [], // Neu
  selectedSecondarySymptoms: [],
  symptomWeights: {},
  empfohleneBluten: [],
  blutenCount: 0,
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
  welcome: "emotions",
  emotions: "symptoms",
  symptoms: "result",
  result: "result",
};

const PREVIOUS_STEPS: Record<WizardSchritt, WizardSchritt> = {
  welcome: "welcome",
  emotions: "welcome",
  symptoms: "emotions",
  result: "symptoms",
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
        currentStep: getNextStep(state.currentStep),
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: getPreviousStep(state.currentStep),
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

  const calculateRecommendation = (bachFlowers: DBBachFlower[]) => {
    // Intensität summieren
    const intensitaetGesamt = Object.values(state.emotionIntensities).reduce(
      (sum, intensity) => sum + intensity,
      0,
    );

    // Blüten basierend auf Emotionen und Symptomen filtern
    const relevanteBlueten = bachFlowers.filter(
      (blume) =>
        state.selectedEmotions.includes(blume.emotion_id) ||
        state.selectedSymptoms.some((symptomId) =>
          blume.description?.includes(symptomId.split("-")[1]),
        ),
    );

    // Blüten nach Intensität und Anzahl der zugehörigen Symptome sortieren
    const sortedBluten = relevanteBlueten.sort((a, b) => {
      const intensityA = state.selectedEmotions.includes(a.emotion_id)
        ? state.emotionIntensities[a.emotion_id]
        : 0;
      const intensityB = state.selectedEmotions.includes(b.emotion_id)
        ? state.emotionIntensities[b.emotion_id]
        : 0;
      const symptomCountA = state.selectedSymptoms.filter((id) =>
        a.description?.includes(id.split("-")[1]),
      ).length;
      const symptomCountB = state.selectedSymptoms.filter((id) =>
        b.description?.includes(id.split("-")[1]),
      ).length;

      return intensityB + symptomCountB - (intensityA + symptomCountA);
    });

    // Top 5-7 Blüten auswählen
    const empfohleneBluten = sortedBluten.slice(
      0,
      Math.min(sortedBluten.length, 7),
    );

    dispatch({ type: "SET_EMPFOHLENE_BLUTEN", empfohleneBluten });
    dispatch({ type: "SET_INTENSITAET_GESAMT", intensitaetGesamt });
    dispatch({
      type: "SET_AUSGEWAEHLTE_BLUETEN_ANZAHL",
      ausgewaehlteBluetenAnzahl: empfohleneBluten.length,
    });
  };

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
    setSymptomWeight: (symptomId, weight) =>
      dispatch({ type: "SET_SYMPTOM_WEIGHT", symptomId, weight }),
    resetWizard: () => dispatch({ type: "RESET" }),
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

// Helper functions for step navigation
const getNextStep = (currentStep: WizardSchritt): WizardSchritt => {
  const steps: WizardSchritt[] = [
    "welcome",
    "emotion-groups",
    "symptoms",
    "secondary-symptoms",
    "result",
  ];
  const currentIndex = steps.indexOf(currentStep);
  return steps[Math.min(currentIndex + 1, steps.length - 1)];
};

const getPreviousStep = (currentStep: WizardSchritt): WizardSchritt => {
  const steps: WizardSchritt[] = [
    "welcome",
    "emotion-groups",
    "symptoms",
    "secondary-symptoms",
    "result",
  ];
  const currentIndex = steps.indexOf(currentStep);
  return steps[Math.max(currentIndex - 1, 0)];
};
