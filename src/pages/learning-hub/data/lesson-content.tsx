// src/pages/learning-hub/data/lesson-content.tsx
import React from "react";

export interface LessonPage {
  id: string;
  title: string;
  content: React.ReactNode;
}

// Neue Types für Quiz-Fragen
export type QuestionType = "single" | "multiple";

export interface BaseQuestion {
  question: string;
  options: string[];
  explanation: string;
  type: QuestionType;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single";
  correctAnswer: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple";
  correctAnswers: number[];
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion;

export interface LessonContent {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  pages: LessonPage[];
  quiz?: {
    questions: Question[];
  };
}
