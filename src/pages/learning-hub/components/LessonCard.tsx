import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle, PlayCircle } from "lucide-react";
import { useLearning } from "../hooks/use-learning-hub-context";
import { LessonStatus } from "../context/learning-hub-context";
interface LessonProps {
  id: string;
  moduleId: string;
  title: string;
  status: LessonStatus;
  onSelect: () => void;
}

const LessonCard = ({ id, moduleId, title, status, onSelect }: LessonProps) => {
  const { state, startLesson } = useLearning();
  const progress = state.lessonProgress[id] || 0;

  const getStatusIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "available":
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (status !== "locked") {
      startLesson(id);
      onSelect();
    }
  };

  return (
    <Card
      className={`
        transition-all duration-200 
        ${status === "locked" ? "opacity-50 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}
      `}
      onClick={handleClick}
    >
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            {title}
          </CardTitle>
          <Progress value={progress} className="w-24" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {status === "completed"
              ? "Abgeschlossen"
              : status === "locked"
                ? "Gesperrt"
                : status === "in-progress"
                  ? "In Bearbeitung"
                  : "Verfügbar"}
          </span>
          {status !== "locked" && (
            <Button
              variant={status === "completed" ? "ghost" : "default"}
              size="sm"
            >
              {status === "completed" ? "Wiederholen" : "Starten"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
