import React, { createContext, useContext, useReducer, ReactNode } from "react";

export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  status: LessonStatus;
  progress: number;
}

interface LearningState {
  completedLessons: string[];
  lessonProgress: Record<string, number>;
  currentLesson?: string;
}

type LearningAction =
  | { type: "START_LESSON"; lessonId: string }
  | { type: "COMPLETE_LESSON"; lessonId: string }
  | { type: "UPDATE_PROGRESS"; lessonId: string; progress: number };

const initialState: LearningState = {
  completedLessons: [],
  lessonProgress: {},
  currentLesson: undefined,
};

function learningReducer(
  state: LearningState,
  action: LearningAction,
): LearningState {
  switch (action.type) {
    case "START_LESSON":
      return {
        ...state,
        currentLesson: action.lessonId,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: state.lessonProgress[action.lessonId] || 0,
        },
      };
    case "COMPLETE_LESSON":
      return {
        ...state,
        completedLessons: [...state.completedLessons, action.lessonId],
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: 100,
        },
      };
    case "UPDATE_PROGRESS":
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: action.progress,
        },
      };
    default:
      return state;
  }
}

interface LearningContextType {
  state: LearningState;
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  updateProgress: (lessonId: string, progress: number) => void;
}

export const LearningContext = createContext<LearningContextType | undefined>(
  undefined,
);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  const startLesson = (lessonId: string) => {
    dispatch({ type: "START_LESSON", lessonId });
  };

  const completeLesson = (lessonId: string) => {
    dispatch({ type: "COMPLETE_LESSON", lessonId });
  };

  const updateProgress = (lessonId: string, progress: number) => {
    dispatch({ type: "UPDATE_PROGRESS", lessonId, progress });
  };

  return (
    <LearningContext.Provider
      value={{ state, startLesson, completeLesson, updateProgress }}
    >
      {children}
    </LearningContext.Provider>
  );
}
