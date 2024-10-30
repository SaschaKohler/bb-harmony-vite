// src/contexts/TherapyContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Database } from "../types/supabase";
import { ErrorBoundary } from "@/components/ErrorBoundary";

type Emotion = Database["public"]["Tables"]["emotion"]["Row"];
type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface TherapyState {
  messages: Message[];
  selectedEmotions: Map<string, Emotion>;
  recommendedFlowers: BachFlower[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

type TherapyAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SELECT_EMOTION"; payload: Emotion }
  | { type: "DESELECT_EMOTION"; payload: string }
  | { type: "SET_RECOMMENDED_FLOWERS"; payload: BachFlower[] }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_SESSION" };

const initialState: TherapyState = {
  messages: [],
  selectedEmotions: new Map(),
  recommendedFlowers: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
};

const therapyReducer = (
  state: TherapyState,
  action: TherapyAction,
): TherapyState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    case "SELECT_EMOTION":
      const updatedEmotions = new Map(state.selectedEmotions);
      updatedEmotions.set(action.payload.id, action.payload);
      return {
        ...state,
        selectedEmotions: updatedEmotions,
      };

    case "DESELECT_EMOTION":
      const newEmotions = new Map(state.selectedEmotions);
      newEmotions.delete(action.payload);
      return {
        ...state,
        selectedEmotions: newEmotions,
      };

    case "SET_RECOMMENDED_FLOWERS":
      return {
        ...state,
        recommendedFlowers: action.payload,
      };

    case "SET_SESSION_ID":
      return {
        ...state,
        currentSessionId: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "RESET_SESSION":
      return initialState;

    default:
      return state;
  }
};

const TherapyContext = createContext<{
  state: TherapyState;
  dispatch: React.Dispatch<TherapyAction>;
} | null>(null);

export const TherapyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(therapyReducer, initialState);

  return (
    <ErrorBoundary>
      <TherapyContext.Provider value={{ state, dispatch }}>
        {children}
      </TherapyContext.Provider>
    </ErrorBoundary>
  );
};

export const useTherapy = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error("useTherapy must be used within a TherapyProvider");
  }
  return context;
};
