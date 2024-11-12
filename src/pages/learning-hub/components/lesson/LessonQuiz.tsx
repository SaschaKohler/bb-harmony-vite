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
    <Card className="mt-8 p-6">
      <h3 className="text-xl font-bold mb-6">
        Quiz: Frage {currentQuestion + 1} von {quiz.questions.length}
      </h3>

      <div className="space-y-6">
        <p className="text-lg">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isAnswered
                  ? question.type === "single"
                    ? index === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : selectedAnswers[0] === index
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    : question.correctAnswers?.includes(index)
                      ? "border-green-500 bg-green-50"
                      : selectedAnswers.includes(index)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                  : selectedAnswers.includes(index)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
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
          <Button onClick={checkAnswer} disabled={selectedAnswers.length === 0}>
            Antwort überprüfen
          </Button>
        ) : (
          <div className="mt-4">
            <p className="text-gray-600 mb-4">{question.explanation}</p>
            <Button onClick={handleNext}>
              {currentQuestion + 1 === quiz.questions.length
                ? "Quiz abschließen"
                : "Nächste Frage"}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Aktueller Punktestand: {score} von {quiz.questions.length} Punkten
      </div>
    </Card>
  );
};

export default LessonQuiz;
