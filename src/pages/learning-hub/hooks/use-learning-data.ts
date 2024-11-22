// src/pages/learning-hub/hooks/use-learning-data.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type {
  LearningModule,
  LessonDetails,
  LessonStatus,
  UpdateProgressPayload,
  UserLessonProgress,
} from "../types";
import { toast } from "sonner";
import { lessonsContent } from "../data/lesson-content-registry";

export const useLearningModules = () => {
  return useQuery<LearningModule[]>({
    queryKey: ["learning-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learning_modules")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useLessonProgress = (userId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["lesson-progress", userId, lessonId],
    queryFn: async () => {
      // Nutzt den composite unique index
      const { data, error } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .match({
          user_id: userId,
          lesson_id: lessonId,
        })
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!lessonId,
  });
};

export const useLessonDetails = () => {
  return useQuery<LessonDetails[]>({
    queryKey: ["lesson-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_details")
        .select("*")
        .order("module_id, order_index");

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUserProgress = (userId?: string) => {
  return useQuery({
    queryKey: ["user-progress", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Nutzt den composite index für aktive Lektionen
      const { data: activeProgress, error: activeError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .neq("status", "completed")
        .order("current_page", { ascending: false });

      if (activeError) throw activeError;

      // Separate Abfrage für abgeschlossene Lektionen
      const { data: completedProgress, error: completedError } = await supabase
        .from("user_lesson_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "completed");

      if (completedError) throw completedError;

      return [...(activeProgress || []), ...(completedProgress || [])];
    },
    enabled: !!userId,
  });
};

// Helper Funktion zum Laden des Lektionsinhalts
async function getLessonContent(contentKey: string) {
  // Diese Funktion sollte den statischen Inhalt aus deinem content-registry laden
  const content = lessonsContent[contentKey];
  if (!content) {
    throw new Error(`Kein Inhalt gefunden für Lektion: ${contentKey}`);
  }
  return content;
}

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: Partial<UserLessonProgress>) => {
      if (!progress.user_id || !progress.lesson_id) {
        throw new Error("user_id und lesson_id sind erforderlich");
      }

      // Nutzt den unique index für schnelle Suche
      const { data: existingProgress, error: lookupError } = await supabase
        .from("user_lesson_progress")
        .select("id")
        .match({
          user_id: progress.user_id,
          lesson_id: progress.lesson_id,
        })
        .maybeSingle(); // Besser als .single() da es null zurückgibt statt einen Fehler zu werfen

      if (lookupError) throw lookupError;

      const timestamp = new Date().toISOString();

      if (existingProgress?.id) {
        // Update existierenden Eintrag
        const { data, error } = await supabase
          .from("user_lesson_progress")
          .update({
            ...progress,
            updated_at: timestamp,
          })
          .eq("id", existingProgress.id) // Nutzt den Primary Key Index
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Erstelle neuen Eintrag
        const { data, error } = await supabase
          .from("user_lesson_progress")
          .insert({
            ...progress,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .select()
          .single();

        if (error) {
          // Spezielle Behandlung von Unique Constraint Violations
          if (error.code === "23505") {
            toast.error("Dieser Lernfortschritt existiert bereits");
          }
          throw error;
        }
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-progress", data.user_id],
      });
      toast.success(
        data.status === "completed"
          ? "Lektion erfolgreich abgeschlossen!"
          : "Fortschritt gespeichert",
      );
    },
    onError: (error: Error) => {
      console.error("Fehler beim Speichern des Fortschritts:", error);
      toast.error(error.message || "Fehler beim Speichern des Fortschritts");
    },
  });
};

export const calculateLessonStatus = (
  lessonId: string,
  userProgress: UserLessonProgress[],
  lessonDetails: LessonDetails[],
): LessonStatus => {
  // Finde den Fortschritt für diese Lektion
  const progress = userProgress.find((p) => p.lesson_id === lessonId);
  if (progress) return progress.status;

  // Finde die Lektion und ihre Voraussetzungen
  const lesson = lessonDetails.find((l) => l.id === lessonId);
  if (!lesson) return "locked";

  // Wenn keine Voraussetzungen, ist die Lektion verfügbar
  if (!lesson.prerequisites?.length) return "not_started";

  // Prüfe, ob alle Voraussetzungen erfüllt sind
  const allPrerequisitesCompleted = lesson.prerequisites.every((prereqId) =>
    userProgress.some(
      (p) => p.lesson_id === prereqId && p.status === "completed",
    ),
  );

  return allPrerequisitesCompleted ? "not_started" : "locked";
};
