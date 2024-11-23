// src/pages/learning-hub/components/LessonCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, PlayCircle } from "lucide-react";
import { useUpdateLessonProgress } from "../hooks/use-learning-data";
import type { LessonDetails, LessonStatus } from "../types";
import { useAuth } from "@/hooks/useAuth"; // Benutze den existierenden AuthContext
import { toast } from "sonner"; // Nutze sonner für Benachrichtigungen
import { getLessonContent } from "../data/lesson-content-registry";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lesson: LessonDetails;
  status: LessonStatus;
}

const LessonCard = ({ lesson, status }: LessonCardProps) => {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth(); // Nutze die vorhandenen Auth-Funktionen
  const updateProgress = useUpdateLessonProgress();

  const getStatusIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" />;
      case "completed":
        return (
          <CheckCircle className="w-5 h-5 text-learning-light-success dark:text-learning-dark-success" />
        );
      case "in_progress":
        return (
          <PlayCircle className="w-5 h-5 text-learning-light-accent dark:text-learning-dark-accent" />
        );
      default:
        return (
          <PlayCircle className="w-5 h-5 text-learning-light-accent dark:text-learning-dark-accent" />
        );
    }
  };

  const handleStart = async () => {
    if (status === "locked") return;

    if (!isAuthenticated) {
      toast.error("Bitte melden Sie sich an, um eine Lektion zu starten.");
      return;
    }

    try {
      const lessonContent = getLessonContent(lesson.content_key);
      const totalPages = lessonContent?.pages.length || 0;

      await updateProgress.mutateAsync({
        user_id: user?.id,
        lesson_id: lesson.id,
        status: "in_progress",
        current_page: 0,
        completed_pages: [],
        total_pages: totalPages, // Hier fügen wir total_pages hinzu
      });

      toast.success("Lektion gestartet!");
      // Navigiere zur Lektionsdetail-Ansicht
      navigate(`/learning-hub/${lesson.content_key}`);
    } catch (error) {
      toast.error("Fehler beim Starten der Lektion");
      console.error("Fehler beim Starten der Lektion:", error);
    }
  };

  const getDurationText = () => {
    const hours = Math.floor(lesson.estimated_duration / 60);
    const minutes = lesson.estimated_duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const prerequisitesText =
    lesson.prerequisites.length > 0
      ? "Voraussetzungen erforderlich"
      : "Keine Voraussetzungen";

  return (
    <Card
      className={`
        transition-all duration-200
        border border-learning-light-card-border dark:border-learning-dark-card-border
        shadow-card-light dark:shadow-card-dark
        ${
          status === "locked"
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-md transition-transform hover:-translate-y-0.5"
        }
      `}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-learning-light-card-foreground dark:text-learning-dark-card-foreground">
            {getStatusIcon()}
            {lesson.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-learning-light-muted-foreground dark:text-learning-dark-muted-foreground">
            <span>{getDurationText()}</span>
            {status === "in_progress" && (
              <Progress
                value={0}
                className="w-24 bg-learning-light-muted dark:bg-learning-dark-muted"
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-learning-light-foreground dark:text-learning-dark-foreground mb-4">
          {lesson.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className={`text-sm lesson-status status-${status}`}>
              {status === "locked"
                ? "Gesperrt"
                : status === "completed"
                  ? "Abgeschlossen"
                  : status === "in_progress"
                    ? "In Bearbeitung"
                    : "Verfügbar"}
            </span>
            <span className="text-xs text-learning-light-muted-foreground dark:text-learning-dark-muted-foreground">
              {prerequisitesText}
            </span>
          </div>
          {status !== "locked" && (
            <Button
              variant={status === "completed" ? "ghost" : "default"}
              size="sm"
              onClick={handleStart}
              disabled={updateProgress.isPending || !isAuthenticated}
              className="bg-learning-light-accent dark:bg-learning-dark-accent hover:bg-learning-light-accent/90 dark:hover:bg-learning-dark-accent/90"
            >
              {updateProgress.isPending
                ? "Wird geladen..."
                : status === "completed"
                  ? "Wiederholen"
                  : "Starten"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
