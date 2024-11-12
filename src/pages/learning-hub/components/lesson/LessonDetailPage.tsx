// src/pages/learning-hub/components/lesson/LessonDetailPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useLessonDetails,
  useUserProgress,
} from "../../hooks/use-learning-data";
import { useAuth } from "@/contexts/AuthContext";
import { getLessonContent } from "../../data/lesson-content-registry";
import LessonDetail from "./LessonDetail";
import { toast } from "sonner";

const LessonDetailPage = () => {
  const { lessonId = "" } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: lessons = [], isLoading: isLoadingLesson } = useLessonDetails();
  const { data: userProgress = [], isLoading: isLoadingProgress } =
    useUserProgress(user?.id);

  // Debug-Logging
  React.useEffect(() => {
    console.log("LessonId:", lessonId);
    console.log("Available Lessons:", lessons);
    console.log("User Progress:", userProgress);
  }, [lessonId, lessons, userProgress]);

  if (isLoadingLesson || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  const lesson = lessons.find((l) => l.content_key === lessonId);
  if (!lesson) {
    console.error(`Lektion nicht gefunden für ID: ${lessonId}`);
    toast.error("Lektion nicht gefunden");
    navigate("/learning-hub");
    return null;
  }

  const lessonContent = lessonId ? getLessonContent(lesson.content_key) : null;
  if (!lessonContent) {
    console.error(
      `Content nicht gefunden für content_key: ${lesson.content_key}`,
    );
    toast.error("Lektionsinhalt nicht gefunden");
    navigate("/learning-hub");
    return null;
  }
  if (!lesson || !lessonContent) {
    toast.error("Lektion nicht gefunden");
    navigate("/learning-hub");
    return null;
  }

  const handleBack = () => {
    navigate("/learning-hub");
  };

  const handleComplete = () => {
    toast.success("Lektion erfolgreich abgeschlossen!");
    navigate("/learning-hub");
  };

  return (
    <LessonDetail
      lesson={lesson}
      content={lessonContent}
      userProgress={userProgress.find((p) => p.lesson_id === lessonId)}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};

export default LessonDetailPage;
