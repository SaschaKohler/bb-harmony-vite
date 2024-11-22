import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import {
  useUserProgress,
  useLearningModules,
} from "../hooks/use-learning-data";
import type { LearningContextState, UserLessonProgress } from "../types";
import { supabase } from "@/lib/supabaseClient";

type LearningAction =
  | { type: "SET_CURRENT_MODULE"; moduleId: string }
  | { type: "SET_CURRENT_LESSON"; lessonId: string }
  | { type: "SET_CURRENT_PAGE"; page: number }
  | { type: "UPDATE_PROGRESS"; progress: UserLessonProgress }
  | { type: "SET_MODULES"; modules: any[] } // Type entsprechend anpassen
  | { type: "SET_PROGRESS"; progress: Record<string, UserLessonProgress> }
  | { type: "RESET_STATE" };

const initialState: LearningContextState = {
  currentPage: 0,
  modules: [],
  userProgress: {},
};

function learningReducer(
  state: LearningContextState,
  action: LearningAction,
): LearningContextState {
  switch (action.type) {
    case "SET_CURRENT_MODULE":
      return {
        ...state,
        currentModule: action.moduleId,
        currentLesson: undefined,
        currentPage: 0,
      };
    case "SET_CURRENT_LESSON":
      return {
        ...state,
        currentLesson: action.lessonId,
        currentPage: 0,
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.page,
      };
    case "UPDATE_PROGRESS":
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          [action.progress.lesson_id]: action.progress,
        },
      };
    case "SET_MODULES":
      return {
        ...state,
        modules: action.modules,
      };
    case "SET_PROGRESS":
      return {
        ...state,
        userProgress: action.progress,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

interface LearningContextValue {
  state: LearningContextState;
  setCurrentModule: (moduleId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  setCurrentPage: (page: number) => void;
  updateProgress: (progress: UserLessonProgress) => void;
  resetState: () => void;
}

export const LearningContext = createContext<LearningContextValue | undefined>(
  undefined,
);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, initialState);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  // Hole User-Daten asynchron
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  const { data: modules } = useLearningModules();
  const { data: progress } = useUserProgress(currentUser?.id);

  useEffect(() => {
    if (modules) {
      dispatch({ type: "SET_MODULES", modules });
    }
  }, [modules]);

  useEffect(() => {
    if (progress) {
      const progressMap = progress.reduce<Record<string, UserLessonProgress>>(
        (acc, p) => ({
          ...acc,
          [p.lesson_id]: p,
        }),
        {},
      );
      dispatch({ type: "SET_PROGRESS", progress: progressMap });
    }
  }, [progress]);

  const value = {
    state,
    setCurrentModule: (moduleId: string) =>
      dispatch({ type: "SET_CURRENT_MODULE", moduleId }),
    setCurrentLesson: (lessonId: string) =>
      dispatch({ type: "SET_CURRENT_LESSON", lessonId }),
    setCurrentPage: (page: number) =>
      dispatch({ type: "SET_CURRENT_PAGE", page }),
    updateProgress: (progress: UserLessonProgress) =>
      dispatch({ type: "UPDATE_PROGRESS", progress }),
    resetState: () => dispatch({ type: "RESET_STATE" }),
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}
