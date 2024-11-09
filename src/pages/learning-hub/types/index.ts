import { ReactNode } from "react";

export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  status: LessonStatus;
  progress: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface LearningState {
  completedLessons: string[];
  lessonProgress: Record<string, number>;
  currentLesson?: string;
}

export type LearningAction =
  | { type: "START_LESSON"; lessonId: string }
  | { type: "COMPLETE_LESSON"; lessonId: string }
  | { type: "UPDATE_PROGRESS"; lessonId: string; progress: number };
