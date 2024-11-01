import { createContext, useReducer, ReactNode } from "react";
import { WizardContextType, WizardState, WizardSchritt } from "../types";

const initialState: WizardState = {
  currentStep: "welcome",
  selectedEmotions: [],
  emotionIntensities: {},
  selectedSymptoms: [],
  empfohleneBluten: [],
};

type WizardAction =
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "SELECT_EMOTION"; emotionId: string }
  | { type: "DESELECT_EMOTION"; emotionId: string }
  | { type: "SET_EMOTION_INTENSITY"; emotionId: string; intensity: number }
  | { type: "SELECT_SYMPTOM"; symptomId: string }
  | { type: "DESELECT_SYMPTOM"; symptomId: string }
  | { type: "SET_EMPFOHLENE_BLUTEN"; blutenIds: string[] }
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
        currentStep: NEXT_STEPS[state.currentStep],
      };

    case "PREVIOUS_STEP":
      return {
        ...state,
        currentStep: PREVIOUS_STEPS[state.currentStep],
      };
    case "SELECT_EMOTION":
      return {
        ...state,
        selectedEmotions: [...state.selectedEmotions, action.emotionId],
        emotionIntensities: {
          ...state.emotionIntensities,
          [action.emotionId]: 5, // Standardwert für Intensität
        },
      };

    case "DESELECT_EMOTION": {
      // Wir nutzen Object Rest Destructuring für die Intensitäten
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.emotionId]: _, ...restIntensities } =
        state.emotionIntensities;

      return {
        ...state,
        selectedEmotions: state.selectedEmotions.filter(
          (id) => id !== action.emotionId,
        ),
        emotionIntensities: restIntensities,
      };
    }

    case "SET_EMOTION_INTENSITY":
      return {
        ...state,
        emotionIntensities: {
          ...state.emotionIntensities,
          [action.emotionId]: action.intensity,
        },
      };
    case "SELECT_SYMPTOM":
      return {
        ...state,
        selectedSymptoms: [...state.selectedSymptoms, action.symptomId],
      };

    case "DESELECT_SYMPTOM":
      return {
        ...state,
        selectedSymptoms: state.selectedSymptoms.filter(
          (id) => id !== action.symptomId,
        ),
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
    selectEmotion: (emotionId: string) =>
      dispatch({ type: "SELECT_EMOTION", emotionId }),
    deselectEmotion: (emotionId: string) =>
      dispatch({ type: "DESELECT_EMOTION", emotionId }),
    setEmotionIntensity: (emotionId: string, intensity: number) =>
      dispatch({ type: "SET_EMOTION_INTENSITY", emotionId, intensity }),
    selectSymptom: (symptomId: string) =>
      dispatch({ type: "SELECT_SYMPTOM", symptomId }),
    deselectSymptom: (symptomId: string) =>
      dispatch({ type: "DESELECT_SYMPTOM", symptomId }),
    resetWizard: () => dispatch({ type: "RESET" }),
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}
