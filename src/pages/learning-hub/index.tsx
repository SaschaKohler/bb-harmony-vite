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
import { LearningProvider } from "./context/learning-hub-context";
import { useLearning } from "./hooks/use-learning-hub-context";
import LessonCard from "./components/LessonCard";
import { modules } from "./data/modules";
import { getIcon } from "./data/modules";

const LearningHubContent = () => {
  const { state } = useLearning();
  const [activeModule, setActiveModule] = React.useState("basics");

  const calculateProgress = () => {
    const totalLessons = modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0,
    );
    const completed = state.completedLessons.length;
    return Math.round((completed / totalLessons) * 100);
  };

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    // Wird später implementiert für Navigation zur Lektion
    console.log(`Selected lesson ${lessonId} from module ${moduleId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bachblüten Lernprogramm</h1>
        <div className="flex items-center gap-4">
          <Progress value={calculateProgress()} className="w-64" />
          <span className="text-sm text-gray-600">
            {calculateProgress()}% abgeschlossen
          </span>
        </div>
      </div>

      <Tabs
        value={activeModule}
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
                  {module.lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      id={lesson.id}
                      moduleId={module.id}
                      title={lesson.title}
                      status={lesson.status}
                      onSelect={() => handleLessonSelect(module.id, lesson.id)}
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

const LearningHub = () => (
  <LearningProvider>
    <LearningHubContent />
  </LearningProvider>
);

export default LearningHub;
