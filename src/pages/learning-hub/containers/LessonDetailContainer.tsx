// src/pages/learning-hub/containers/LessonDetailContainer.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLessonDetails, useUserProgress } from "../hooks/use-learning-data";
import { useAuth } from "@/contexts/AuthContext";
import LessonDetail from "../components/lesson/LessonDetail";
import { toast } from "sonner";

const LessonDetailContainer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: lessons, isLoading: isLoadingLesson } = useLessonDetails();
  const { data: userProgress, isLoading: isLoadingProgress } = useUserProgress(
    user?.id,
  );

  if (isLoadingLesson || isLoadingProgress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  const lesson = lessons?.find((l) => l.id === lessonId);

  if (!lesson) {
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
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};

export default LessonDetailContainer;
