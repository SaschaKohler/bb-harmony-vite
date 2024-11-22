// src/pages/learning-hub/components/lesson/LessonDetail.tsx
import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateLessonProgress } from "../../hooks/use-learning-data";
import type { LessonContent } from "../../data/lesson-content";
import type { UserLessonProgress } from "../../types";
import { toast } from "sonner";
import LessonQuiz from "./LessonQuiz";

interface LessonDetailProps {
  lesson: {
    id: string;
    completed_pages: number[];
  };
  content: LessonContent;
  userProgress?: UserLessonProgress;
  onComplete: () => void;
  onBack: () => void;
}

const LessonDetail = ({
  lesson,
  content,
  userProgress,
  onComplete,
  onBack,
}: LessonDetailProps) => {
  const { user } = useAuth();
  const updateProgress = useUpdateLessonProgress();
  const [currentPage, setCurrentPage] = React.useState(
    userProgress?.current_page || 0,
  );

  const totalPages = content.pages.length;
  const progress = Math.round((currentPage / (totalPages - 1)) * 100);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;

    setCurrentPage(newPage);

    try {
      await updateProgress.mutateAsync({
        user_id: user?.id as string,
        lesson_id: lesson.id,
        status: "in_progress",
        current_page: newPage,
        completed_pages: Array.from(
          new Set([...(lesson.completed_pages || []), currentPage]),
        ),
        total_pages: totalPages,
      });
    } catch (error) {
      console.error("Fehler beim Speichern des Fortschritts:", error);
      toast.error("Fehler beim Speichern des Fortschritts");
    }
  };

  const handleComplete = async () => {
    try {
      await updateProgress.mutateAsync({
        user_id: user?.id as string,
        lesson_id: lesson.id,
        status: "completed",
        current_page: totalPages - 1,
        completed_pages: Array.from({ length: totalPages }, (_, i) => i),
        total_pages: totalPages,
      });
      onComplete();
    } catch (error) {
      console.error("Fehler beim Abschließen der Lektion:", error);
      toast.error("Fehler beim Abschließen der Lektion");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Seite {currentPage + 1} von {totalPages}
          </span>
          <Progress value={progress} className="w-32" />
        </div>
      </div>

      <Card className="mb-8 p-8">{content.pages[currentPage].content}</Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>

        <div className="flex gap-4">
          {currentPage === totalPages - 1 ? (
            <Button
              onClick={handleComplete}
              className="flex items-center gap-2"
              disabled={updateProgress.isPending}
            >
              <CheckCircle className="w-4 h-4" />
              Lektion abschließen
            </Button>
          ) : (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={updateProgress.isPending}
            >
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {currentPage === totalPages - 1 && content.quiz && (
        <LessonQuiz quiz={content.quiz} onComplete={handleComplete} />
      )}
    </div>
  );
};

export default LessonDetail;
