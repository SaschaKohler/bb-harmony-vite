// src/pages/learning-hub/index.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { getIcon } from "./data/modules";
import { useLearningContext } from "./hooks/use-learning-hub-context";
import {
  useLearningModules,
  useLessonDetails,
  useUserProgress,
} from "./hooks/use-learning-data";
import { useAuth } from "@/contexts/AuthContext";
import LessonCard from "./components/LessonCard";

const LearningHubContent = () => {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = React.useState<string | null>(null);

  const { data: modules = [], isLoading: isLoadingModules } =
    useLearningModules();
  const { data: lessons = [], isLoading: isLoadingLessons } =
    useLessonDetails();
  const { data: userProgress = [], isLoading: isLoadingProgress } =
    useUserProgress(user?.id);

  React.useEffect(() => {
    if (modules && modules.length > 0 && !activeModule) {
      setActiveModule(modules[0].id);
    }
  }, [modules]);

  const calculateModuleProgress = (moduleId: string) => {
    if (!moduleId || !lessons || !userProgress) return 0;

    const moduleLessons = lessons.filter((l) => l.module_id === moduleId);
    if (!moduleLessons || moduleLessons.length === 0) return 0;

    const completedLessons = moduleLessons.filter((lesson) =>
      userProgress.some(
        (p) => p.lesson_id === lesson.id && p.status === "completed",
      ),
    );

    return Math.round((completedLessons.length / moduleLessons.length) * 100);
  };

  if (isLoadingModules || isLoadingLessons || isLoadingProgress) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return <div className="text-center py-8">Keine Module verfügbar.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bachblüten Lernprogramm</h1>
        <div className="flex items-center gap-4">
          <Progress
            value={activeModule ? calculateModuleProgress(activeModule) : 0}
            className="w-64"
          />
          <span className="text-sm text-gray-600">
            {activeModule ? calculateModuleProgress(activeModule) : 0}% des
            Moduls abgeschlossen
          </span>
        </div>
      </div>

      <Tabs
        value={activeModule || modules[0]?.id}
        onValueChange={setActiveModule}
        className="space-y-4"
      >
        <TabsList>
          {modules.map((module) => (
            <TabsTrigger key={module.id} value={module.id}>
              <div className="flex items-center gap-2">
                {getIcon(module.icon)()}
                {module.title}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {modules.map((module) => (
          <TabsContent key={module.id} value={module.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {getIcon(module.icon)()}
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {lessons
                    .filter((lesson) => lesson.module_id === module.id)
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        status={calculateLessonStatus(
                          lesson.id,
                          userProgress,
                          lessons,
                        )}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper Funktion für den Lektions-Status
const calculateLessonStatus = (
  lessonId: string,
  userProgress: any[], // Hier entsprechenden Type einsetzen
  lessons: any[], // Hier entsprechenden Type einsetzen
): "locked" | "available" | "in_progress" | "completed" => {
  const progress = userProgress.find((p) => p.lesson_id === lessonId);
  if (progress) return progress.status;

  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return "locked";

  if (!lesson.prerequisites?.length) return "available";

  const allPrerequisitesCompleted = lesson.prerequisites.every((prereqId) =>
    userProgress.some(
      (p) => p.lesson_id === prereqId && p.status === "completed",
    ),
  );

  return allPrerequisitesCompleted ? "available" : "locked";
};

export default LearningHubContent;
