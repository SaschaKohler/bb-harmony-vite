import { Database } from "@/types/supabase";

type Tables = Database["public"]["Tables"];

export type LearningModule = Tables["learning_modules"]["Row"];
export type LearningLesson = Tables["learning_lessons"]["Row"];
export type UserLessonProgress = Tables["user_lesson_progress"]["Row"];
export type UserLessonNote = Tables["user_lesson_notes"]["Row"];
export type LessonResource = Tables["lesson_resources"]["Row"];

export type LessonStatus = "not_started" | "in_progress" | "completed";

export interface LessonContent {
  title: string;
  pages: React.ReactNode[];
  quiz?: {
    questions: QuizQuestion[];
  };
}
export interface LessonDetails extends LearningLesson {
  module_title: string;
  module_icon: string;
  prerequisites: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LearningContextState {
  currentModule?: string;
  currentLesson?: string;
  currentPage: number;
  modules: LearningModule[];
  userProgress: Record<string, UserLessonProgress>;
}

// Füge auch einen Type für die Mutation hinzu
export interface UpdateProgressPayload {
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  current_page: number;
  completed_pages: number[];
  total_pages: number;
}
export interface LessonQuizProps {
  quiz: LessonContent["quiz"];
  onComplete: () => void;
}

export interface LessonDetailProps {
  lesson: LearningLesson;
  onComplete: () => void;
  onBack: () => void;
}

export interface LessonCardProps {
  lesson: LearningLesson;
  status: LessonStatus;
}
