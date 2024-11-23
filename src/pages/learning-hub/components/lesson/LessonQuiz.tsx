// src/pages/learning-hub/components/lesson/LessonQuiz.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "../../data/lesson-content";

interface LessonQuizProps {
  quiz: {
    questions: Question[];
  };
  onComplete: () => void;
}

const LessonQuiz = ({ quiz, onComplete }: LessonQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const question = quiz.questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (question.type === "single") {
      setSelectedAnswers([answerIndex]);
    } else {
      // Toggle für Multiple Choice
      setSelectedAnswers((prev) =>
        prev.includes(answerIndex)
          ? prev.filter((idx) => idx !== answerIndex)
          : [...prev, answerIndex],
      );
    }
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    if (question.type === "single") {
      if (selectedAnswers[0] === question.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    } else {
      // Für Multiple Choice: Alle richtigen Antworten müssen ausgewählt sein
      const isCorrect =
        selectedAnswers.length === question.correctAnswers.length &&
        selectedAnswers.every((answer) =>
          question.correctAnswers.includes(answer),
        );
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswers([]);
      setIsAnswered(false);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="mt-8 p-6 bg-learning-light-card dark:bg-learning-dark-card">
      <h3 className="text-xl font-bold mb-6 text-learning-light-foreground dark:text-learning-dark-foreground">
        Quiz: Frage {currentQuestion + 1} von {quiz.questions.length}
      </h3>

      <div className="space-y-6">
        <p className="text-lg text-learning-light-foreground dark:text-learning-dark-foreground">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-colors ${
                isAnswered
                  ? question.type === "single"
                    ? index === question.correctAnswer
                      ? "border-learning-light-success dark:border-learning-dark-success bg-learning-light-success/10 dark:bg-learning-dark-success/10"
                      : selectedAnswers[0] === index
                        ? "border-destructive bg-destructive/10"
                        : "border-learning-light-border dark:border-learning-dark-border"
                    : question.correctAnswers?.includes(index)
                      ? "border-learning-light-success dark:border-learning-dark-success bg-learning-light-success/10 dark:bg-learning-dark-success/10"
                      : selectedAnswers.includes(index)
                        ? "border-destructive bg-destructive/10"
                        : "border-learning-light-border dark:border-learning-dark-border"
                  : selectedAnswers.includes(index)
                    ? "border-learning-light-accent dark:border-learning-dark-accent bg-learning-light-accent/10 dark:bg-learning-dark-accent/10"
                    : "border-learning-light-border dark:border-learning-dark-border"
              }`}
            >
              <div className="flex items-center gap-3">
                {question.type === "single" ? (
                  <RadioGroup
                    value={selectedAnswers[0]?.toString()}
                    disabled={isAnswered}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      onClick={() => !isAnswered && handleAnswer(index)}
                    />
                  </RadioGroup>
                ) : (
                  <Checkbox
                    checked={selectedAnswers.includes(index)}
                    disabled={isAnswered}
                    onCheckedChange={() => !isAnswered && handleAnswer(index)}
                  />
                )}
                <span>{option}</span>
                {isAnswered &&
                  (question.type === "single"
                    ? index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )
                    : question.correctAnswers?.includes(index) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ))}
              </div>
            </div>
          ))}
        </div>

        {!isAnswered ? (
          <Button
            onClick={checkAnswer}
            disabled={selectedAnswers.length === 0}
            className="bg-primary text-primary-foreground dark:bg-learning-dark-accent hover:bg-primary/90 dark:hover:bg-learning-dark-accent/90 shadow-sm font-medium px-6 py-2 rounded-md"
          >
            Antwort überprüfen
          </Button>
        ) : (
          <div className="mt-4">
            <p className="text-learning-light-muted-foreground dark:text-learning-dark-muted-foreground mb-4">
              {question.explanation}
            </p>
            <Button
              onClick={handleNext}
              // Verbesserte Button-Stile für bessere Sichtbarkeit
              className="bg-primary text-primary-foreground dark:bg-learning-dark-accent hover:bg-primary/90 dark:hover:bg-learning-dark-accent/90 shadow-sm font-medium px-6 py-2 rounded-md"
            >
              {currentQuestion + 1 === quiz.questions.length
                ? "Quiz abschließen"
                : "Nächste Frage"}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-learning-light-muted-foreground dark:text-learning-dark-muted-foreground">
        Aktueller Punktestand: {score} von {quiz.questions.length} Punkten
      </div>
    </Card>
  );
};

export default LessonQuiz;
